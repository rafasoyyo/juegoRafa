/**
 * «El teleférico»: llega una cabina con pasajeros, suben o bajan otros de uno en uno, se cierra la puerta
 * y se toca cuántos hay ahora. La escena dura como mucho 6 s.
 */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import { finalCount } from '../../../learning/quiz/cable-car';
import type { HintKind, ObjectId, Question, SceneData } from '../../../learning/quiz/types';
import { digits, fitImage } from '../round-button';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type ViewHost } from './view';

type CableScene = Extract<SceneData, { kind: 'cable-car' }>;

const CABLE_Y = 178;
const BODY = { w: 420, h: 250, y: 380 };
const WIN = { w: 360, h: 190 };
const PASSENGER_MS = 330;
const PAUSE_MS = 350;

export class CableCarView extends ViewBase implements QuizView {
  private cabin!: Phaser.GameObjects.Container;
  private doors: Phaser.GameObjects.Container[] = [];
  private icons: Phaser.GameObjects.Image[] = [];
  private inside!: Phaser.GameObjects.Container;
  private temps: Phaser.GameObjects.GameObject[] = [];
  private cx = 0;
  private scn!: CableScene;
  private slots = 1;

  constructor(host: ViewHost) {
    super(host);
  }

  /** Posición (en la cabina, relativa a su centro) del pasajero número `i` de una cuadrícula de `slots`. */
  private seat(i: number): Point {
    const n = this.slots;
    const cols = n <= 5 ? Math.max(1, n) : n <= 10 ? 5 : 7;
    const rows = Math.ceil(n / cols);
    const cell = Math.min(72, WIN.w / cols, WIN.h / rows);
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    return { x: (i % cols - (inRow - 1) / 2) * cell, y: (row - (rows - 1) / 2) * cell };
  }

  private cellSize(): number {
    const n = this.slots;
    const cols = n <= 5 ? Math.max(1, n) : n <= 10 ? 5 : 7;
    return Math.min(72, WIN.w / cols, WIN.h / Math.ceil(n / cols));
  }

  private passenger(object: ObjectId, i: number): Phaser.GameObjects.Image {
    const p = this.seat(i);
    return fitImage(this.scene.add.image(p.x, p.y, object), this.cellSize() * 0.92);
  }

  draw(q: Question, willDemo: boolean): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'cable-car') throw new Error('cable-car: falta la escena');
    this.scn = s;
    this.cx = this.host.width / 2;
    const sc = this.scene;

    // Cable de lado a lado y poste.
    const cable = sc.add.graphics();
    const half = this.host.usefulW / 2;
    cable.lineStyle(8, COLORS.ink, 0.8).lineBetween(this.cx - half, CABLE_Y, this.cx + half, CABLE_Y);
    this.host.layer.add(cable);

    // Cuántos asientos hacen falta: el máximo que llega a haber.
    let n = s.start;
    let max = n;
    for (const st of s.steps) {
      n += st.op === 'in' ? st.count : -st.count;
      max = Math.max(max, n);
    }
    this.slots = Math.max(1, max);

    this.cabin = sc.add.container(this.cx, 0);
    const hanger = sc.add.graphics();
    hanger.fillStyle(COLORS.ink, 0.8).fillRect(-6, CABLE_Y, 12, BODY.y - BODY.h / 2 - CABLE_Y + 4);
    const body = sc.add.graphics();
    body.fillStyle(COLORS.coralDark).fillRoundedRect(-BODY.w / 2, BODY.y - BODY.h / 2 + 8, BODY.w, BODY.h, 34);
    body.fillStyle(COLORS.coral).fillRoundedRect(-BODY.w / 2, BODY.y - BODY.h / 2, BODY.w, BODY.h, 34);
    body.fillStyle(0xe9f6ff).fillRoundedRect(-WIN.w / 2, BODY.y - WIN.h / 2 - 6, WIN.w, WIN.h, 22);
    this.cabin.add([hanger, body]);

    // Pasajeros dentro (por ahora, los del final; la escena previa los reajusta).
    const present = willDemo ? s.start : finalCount(s);
    this.icons = Array.from({ length: present }, (_, i) => this.passenger(s.object, i));
    this.inside = sc.add.container(0, BODY.y - 6, this.icons);
    this.cabin.add(this.inside);

    // Puertas: dos hojas opacas que cubren la ventana.
    this.doors = [-1, 1].map((side) => {
      const g = sc.add.graphics();
      g.fillStyle(0xd9503f).fillRoundedRect(side < 0 ? 0 : -WIN.w / 2, -WIN.h / 2, WIN.w / 2, WIN.h, 14);
      g.fillStyle(COLORS.white).fillRoundedRect(side < 0 ? WIN.w / 2 - 22 : -WIN.w / 2 + 10, -16, 12, 32, 6);
      return sc.add.container(side < 0 ? -WIN.w / 2 : WIN.w / 2, BODY.y - 6, [g]);
    });
    // Hoja izquierda dibujada de 0 a w/2 (anclada a su borde izquierdo); la derecha, de -w/2 a 0.
    this.cabin.add(this.doors);
    this.setDoors(willDemo ? 0 : 1);
    this.host.layer.add(this.cabin);
    if (willDemo) this.cabin.x = -400;

    return {
      slots: new Map(),
      rowArea: { cx: this.cx, w: this.host.usefulW, top: 545, bottom: 700, cell: [150, 150] },
      anchor: { x: this.cx, y: BODY.y - 90 },
    };
  }

  private setDoors(closed: number): void {
    for (const d of this.doors) d.setScale(closed, 1);
  }

  private async closeDoors(): Promise<void> {
    await this.tween({ targets: this.doors, scaleX: 1, duration: 300, ease: 'Sine.easeInOut' });
  }

  private async openDoors(): Promise<void> {
    await this.tween({ targets: this.doors, scaleX: 0, duration: 350, ease: 'Sine.easeInOut' });
  }

  /** Llega la cabina, suben o bajan pasajeros de uno en uno y se cierra la puerta. */
  async intro(): Promise<void> {
    const s = this.scn;
    const inside = this.inside;
    for (const i of this.icons) i.destroy();
    this.icons = [];
    for (let i = 0; i < s.start; i++) {
      const icon = this.passenger(s.object, i);
      inside.add(icon);
      this.icons.push(icon);
    }
    this.setDoors(0);
    this.cabin.x = -400;
    await this.tween({ targets: this.cabin, x: this.cx, duration: 600, ease: 'Sine.easeOut' });
    if (!this.alive) return;
    await this.sleep(PAUSE_MS);

    for (const step of s.steps) {
      for (let k = 0; k < step.count; k++) {
        if (!this.alive) return;
        audio.sfx('tap');
        if (step.op === 'in') {
          const i = this.icons.length;
          const icon = this.passenger(s.object, i);
          const to = { x: icon.x, y: icon.y };
          icon.setPosition(to.x + 260, to.y).setAlpha(0);
          inside.add(icon);
          this.icons.push(icon);
          await this.tween({ targets: icon, x: to.x, alpha: 1, duration: PASSENGER_MS, ease: 'Sine.easeOut' });
        } else {
          const icon = this.icons.pop();
          if (!icon) continue;
          await this.tween({ targets: icon, x: icon.x - 260, alpha: 0, duration: PASSENGER_MS, ease: 'Sine.easeIn' });
          icon.destroy();
        }
      }
      await this.sleep(PAUSE_MS);
    }
    if (!this.alive) return;
    await this.closeDoors();
  }

  async onCorrect(): Promise<void> {
    await this.openDoors();
    await this.sleep(500);
  }

  showAnswer(): boolean {
    void this.openDoors();
    return false;
  }

  private clearTemps(): void {
    for (const t of this.temps) t.destroy();
    this.temps = [];
  }

  /** Seguir contando: la cabina es transparente, se ve cuántos había y los que suben se iluminan contando. */
  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    const s = this.scn;
    const sc = this.scene;
    const inside = this.inside;
    inside.setAlpha(0);
    this.setDoorAlpha(0.15);
    const stage = sc.add.container(0, BODY.y - 6);
    this.cabin.add(stage);
    this.temps.push(stage);
    const badge = sc.add.graphics();
    badge.fillStyle(COLORS.white).fillCircle(0, 0, 54).lineStyle(6, COLORS.coral).strokeCircle(0, 0, 54);
    const badgeBox = sc.add.container(0, BODY.y - BODY.h / 2 - 8, [badge]);
    let count = s.start;
    let label = digits(sc, 0, 0, String(count), 74, '#FF6B5E');
    badgeBox.add(label);
    this.cabin.add(badgeBox);
    this.temps.push(badgeBox);

    const shown: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < s.start; i++) {
      const icon = this.passenger(s.object, i);
      stage.add(icon);
      shown.push(icon);
    }
    await this.sleep(800);
    const setLabel = (n: number): void => {
      label.destroy();
      label = digits(sc, 0, 0, String(n), 74, '#FF6B5E');
      badgeBox.add(label);
    };
    for (const step of s.steps) {
      for (let k = 0; k < step.count; k++) {
        if (!this.alive) return;
        audio.sfx('tap');
        if (step.op === 'in') {
          const icon = this.passenger(s.object, shown.length);
          stage.add(icon);
          shown.push(icon);
          const p = this.seat(shown.length - 1);
          const ring = sc.add.circle(p.x, p.y, this.cellSize() * 0.6, COLORS.yellow, 0.75);
          stage.addAt(ring, 0);
          this.scene.tweens.add({ targets: ring, alpha: 0, delay: 500, duration: 300, onComplete: () => ring.destroy() });
          count += 1;
        } else {
          const icon = shown.pop();
          if (icon) this.scene.tweens.add({ targets: icon, alpha: 0, duration: 250, onComplete: () => icon.destroy() });
          count -= 1;
        }
        setLabel(count);
        await this.sleep(650);
      }
    }
    await this.sleep(700);
    if (!this.alive) return;
    this.clearTemps();
    inside.setAlpha(1);
    this.setDoorAlpha(1);
  }

  private setDoorAlpha(a: number): void {
    for (const d of this.doors) d.setAlpha(a);
  }
}
