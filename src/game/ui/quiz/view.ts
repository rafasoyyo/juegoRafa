/**
 * Contrato de las vistas de las pruebas nuevas. `QuizScene` elige la vista según el tipo de prueba y le
 * delega el dibujo de la pregunta, las respuestas dentro del dibujo, las animaciones y las pistas.
 * La lógica pedagógica (qué es correcto) sigue en `src/learning/quiz/`: la vista solo dibuja y anima.
 */

import Phaser from 'phaser';
import type { HintKind, QuizKind, Question } from '../../../learning/quiz/types';
import type { RoundButton } from '../round-button';

export interface Point {
  x: number;
  y: number;
}

/** Hueco de una opción `scene`: centro y tamaño en px lógicos (al menos 90 px de lado). */
export interface SceneSlot {
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  /** Color de la cara del botón y de su sombra (por defecto, blanco). */
  color?: number;
  shadow?: number;
  /** Botón sin cara ni sombra: solo la zona táctil; la vista dibuja el resto. */
  ghost?: boolean;
}

/** Zona de las opciones que van en fila (las `place: 'row'`). */
export interface RowArea {
  cx: number;
  w: number;
  top: number;
  bottom: number;
  cell: [number, number];
}

export interface DrawResult {
  slots: Map<number, SceneSlot>;
  rowArea?: RowArea;
  /** Dónde señala la flecha de la demostración. */
  anchor: Point;
}

/** Estado de la pregunta actual que la vista necesita para dibujar (también al recolocar la pantalla). */
export interface ViewState {
  used: ReadonlySet<number>;
  fills: ReadonlyMap<number, number>;
  dimmed: ReadonlySet<number>;
}

export interface ViewHost {
  scene: Phaser.Scene;
  /** Fondo de la pregunta: va debajo de los botones. */
  layer: Phaser.GameObjects.Container;
  /** Encima de los botones: cosas que vuelan o se animan sobre las respuestas. */
  top: Phaser.GameObjects.Container;
  width: number;
  usefulW: number;
  state: () => ViewState;
}

export interface HintContext {
  question: Question;
  tapped: number;
  dimmed?: number;
}

export interface QuizView {
  /** Dibuja la pregunta. `willDemo` indica que la demostración empieza enseguida (el teleférico espera a ella). */
  draw(q: Question, willDemo: boolean): DrawResult;
  /** Recibe los botones ya creados de las respuestas, por id de opción. */
  attach(buttons: ReadonlyMap<number, RoundButton>): void;
  /** Escena previa a la demostración (teleférico). */
  intro?(): Promise<void>;
  /** Pieza bien tocada: galleta al plato, elemento a la fila, casilla pintada. */
  onProgress?(id: number): void;
  /** Toque equivocado: devuelve `true` si la vista ya hace su propio rebote. */
  onWrong?(id: number): boolean;
  /** Pregunta acertada, antes de pasar a la siguiente. */
  onCorrect?(id: number): Promise<void>;
  /** La pista propia (2.º fallo). */
  hint(kind: HintKind, ctx: HintContext): Promise<void>;
  /** Tras el 3.er fallo: muestra la respuesta. Devuelve `true` si ya lo hace la vista. */
  showAnswer?(ids: number[]): boolean;
  destroy(): void;
}

/** Base con lo común: esperar, mover cosas y no seguir si la vista ya se ha destruido. */
export abstract class ViewBase {
  protected alive = true;
  protected buttons: ReadonlyMap<number, RoundButton> = new Map();
  protected question!: Question;

  constructor(protected readonly host: ViewHost) {}

  get scene(): Phaser.Scene {
    return this.host.scene;
  }

  attach(buttons: ReadonlyMap<number, RoundButton>): void {
    this.buttons = buttons;
    this.afterAttach();
  }

  /** Para las vistas que ponen cosas dentro de los botones (galletas en el plato, casilla pintada…). */
  protected afterAttach(): void {}

  destroy(): void {
    this.alive = false;
  }

  /** Espera `ms` milisegundos; no resuelve si la escena se ha reconstruido. */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.scene.time.delayedCall(ms, () => resolve());
    });
  }

  /** Un tween que se resuelve al acabar. */
  protected tween(config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({ ...config, onComplete: () => resolve() });
    });
  }

  /** Posición en pantalla de un botón de respuesta. */
  protected buttonPos(id: number): Point | null {
    const b = this.buttons.get(id);
    return b ? { x: b.x, y: b.y } : null;
  }

  /** Temblor de un objeto (rebote de un fallo). */
  protected wobbleObject(target: { x: number }): Promise<void> {
    const x = target.x;
    return this.tween({ targets: target, x: x + 12, duration: 60, yoyo: true, repeat: 2, ease: 'Sine.easeInOut' }).then(() => {
      target.x = x;
    });
  }

  /** Halo amarillo que aparece y se desvanece; para iluminar objetos o casillas. */
  protected glow(x: number, y: number, radius: number, holdMs = 900): void {
    const halo = this.scene.add.circle(x, y, radius, 0xffd23f, 0.7).setScale(0);
    this.host.top.add(halo);
    this.scene.tweens.add({ targets: halo, scale: 1, duration: 220, ease: 'Back.easeOut' });
    this.scene.tweens.add({ targets: halo, alpha: 0, delay: holdMs, duration: 400, onComplete: () => halo.destroy() });
  }
}

export type ViewKind = Extract<QuizKind, 'share' | 'order' | 'cable-car' | 'tracks' | 'balance' | 'mirror' | 'fingers' | 'ten-frame' | 'memory' | 'number-line'>;
export const VIEW_KINDS: readonly QuizKind[] = ['share', 'order', 'cable-car', 'tracks', 'balance', 'mirror', 'fingers', 'ten-frame', 'memory', 'number-line'];
