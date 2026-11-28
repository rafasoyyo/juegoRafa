/**
 * Reto «Bloques que cuentan» en el nivel (`docs/MUNDO-2.md`, mecánica A): cartel, tres bloques con cara
 * que se golpean desde abajo y la compuerta que corta el paso. La lógica (valores y escalera de fallos)
 * está en `src/learning/challenges/`; aquí solo se dibuja y se anima.
 */

import Phaser from 'phaser';
import type { CountChallenge } from '../../learning/challenges/count-blocks';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { bakeGraphics } from '../ui/bake';
import { GROUND_TOP } from '../level-course';
import { CHALLENGE_BLOCK_XS, CHALLENGE_GATE_X, CHALLENGE_SIGN_X, TILE, type ChallengeData } from '../levels/types';
import { ChallengeView, CHALLENGE_DEPTH as DEPTH, type ChallengeHooks } from './challenge-view';
import { drawFace, lightDot, resetDots, type FaceView } from './faces';

/** Compuerta: más alta que lo que llega un salto desde encima de un bloque (~420 px). */
export const GATE_H = 450;
const GATE_W = 72;
const POST_W = 20;
const WOOD = 0xc98a58;
const WOOD_DARK = 0x9c6639;
const STONE = 0xb8c2cc;
const STONE_DARK = 0x8e9aa6;
/** Cartel: centro del tablero sobre el suelo y tamaño. */
const SIGN_Y = GROUND_TOP - 300;
const SIGN_W = 210;
const SIGN_H = 190;
/** Galletas que caen al abrirse la compuerta. */
export const GATE_COOKIES = 3;
const COUNT_STEP_MS = 420;
/** La demostración empieza cuando el zorro está a esta distancia del cartel, en baldosas. */
const DEMO_TRIGGER_TILES = 7;

export class CountChallengeView extends ChallengeView {
  private readonly sign: Phaser.GameObjects.Container;
  private readonly signFace: FaceView;
  private readonly gate: Phaser.GameObjects.Zone;
  private readonly board: Phaser.GameObjects.Graphics;
  private readonly signX: number;
  private counting = false;
  private helpDots: Phaser.GameObjects.Arc[] = [];

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: CountChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    const x = data.x;
    this.signX = x + CHALLENGE_SIGN_X * TILE;

    // Cartel: poste y tablero blanco con la consigna dibujada.
    const post = scene.add.graphics();
    post.fillStyle(WOOD_DARK).fillRoundedRect(-9, 0, 18, GROUND_TOP - SIGN_Y, 6);
    post.setPosition(this.signX, SIGN_Y).setDepth(DEPTH - 1);
    bakeGraphics(scene, post, { x: -9, y: 0, width: 18, height: GROUND_TOP - SIGN_Y });
    const panel = scene.add.graphics();
    panel.fillStyle(COLORS.shadow).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2 + 8, SIGN_W, SIGN_H, 28);
    panel.fillStyle(COLORS.white).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 28);
    this.signFace = drawFace(scene, challenge.sign, Math.min(SIGN_W, SIGN_H) * 0.82);
    this.sign = scene.add.container(this.signX, SIGN_Y, [panel, this.signFace.container]).setDepth(DEPTH);
    bakeGraphics(scene, panel, { x: -SIGN_W / 2, y: -SIGN_H / 2, width: SIGN_W, height: SIGN_H + 8 });

    // Bloques con cara, en la fila baja sobre el suelo.
    this.addBlocks(
      challenge.options,
      CHALLENGE_BLOCK_XS.map((bx) => x + bx * TILE),
    );

    // Compuerta del arroyo: dos postes de piedra y una tabla de madera que se levanta.
    const gx = x + CHALLENGE_GATE_X * TILE;
    const top = GROUND_TOP - GATE_H;
    const posts = scene.add.graphics().setDepth(DEPTH + 1);
    for (const px of [gx - GATE_W / 2 - POST_W / 2, gx + GATE_W / 2 + POST_W / 2]) {
      posts.fillStyle(STONE_DARK).fillRoundedRect(px - POST_W / 2, top - 30 + 4, POST_W, GATE_H + 30, 8);
      posts.fillStyle(STONE).fillRoundedRect(px - POST_W / 2, top - 30, POST_W, GATE_H + 26, 8);
    }
    bakeGraphics(scene, posts, { x: gx - GATE_W / 2 - POST_W, y: top - 30, width: GATE_W + POST_W * 2, height: GATE_H + 34 });
    this.board = scene.add.graphics().setDepth(DEPTH);
    this.board.fillStyle(WOOD_DARK).fillRoundedRect(gx - GATE_W / 2, top, GATE_W, GATE_H, 10);
    this.board.fillStyle(WOOD).fillRoundedRect(gx - GATE_W / 2 + 6, top + 6, GATE_W - 12, GATE_H - 12, 8);
    this.board.fillStyle(WOOD_DARK);
    for (let y = top + 70; y < GROUND_TOP - 20; y += 70) this.board.fillRect(gx - GATE_W / 2 + 6, y, GATE_W - 12, 6);
    this.gate = scene.add.zone(gx, top + GATE_H / 2, GATE_W, GATE_H);
    scene.physics.add.existing(this.gate, true);
    scene.physics.add.collider(fox, this.gate);
  }

  protected override demoTriggerX(): number {
    return this.signX - DEMO_TRIGGER_TILES * TILE;
  }

  /** Lalo va al cartel, cuenta y señala el bloque correcto hasta que el niño lo golpee. */
  protected override startDemo(): void {
    this.hooks.lalo.flyTo(this.signX + SIGN_W / 2 + 30, SIGN_Y - SIGN_H / 2, () => this.countUp(() => this.pointCorrect()));
  }

  protected hintOne(): void {
    this.scene.tweens.add({ targets: this.sign, y: SIGN_Y - 22, duration: 140, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
  }

  protected hintTwo(): void {
    this.countUp();
  }

  /**
   * Cuenta encendiendo los puntos del cartel de uno en uno con un «tic». Si el cartel lleva la cifra,
   * aparecen bajo él tantos puntos como dice y se encienden igual.
   */
  private countUp(then?: () => void): void {
    if (this.counting) return;
    this.counting = true;
    let dots = this.signFace.dots;
    if (dots.length === 0) dots = this.showHelpDots();
    resetDots(dots);
    dots.forEach((dot, i) => {
      this.scene.time.delayedCall(i * COUNT_STEP_MS, () => {
        lightDot(this.scene, dot);
        audio.sfx('tick', { index: i + 1 });
      });
    });
    this.scene.time.delayedCall(dots.length * COUNT_STEP_MS + 300, () => {
      this.counting = false;
      then?.();
    });
  }

  /** Puntos bajo una cifra del cartel, en filas de 5. */
  private showHelpDots(): Phaser.GameObjects.Arc[] {
    if (this.helpDots.length > 0) return this.helpDots;
    const n = this.challenge.value;
    const step = 30;
    const per = 5;
    const rows = Math.ceil(n / per);
    const g = this.scene.add.graphics();
    const w = per * step + 16;
    const h = rows * step + 16;
    g.fillStyle(COLORS.white).fillRoundedRect(-w / 2, 0, w, h, 16);
    const parts: Phaser.GameObjects.GameObject[] = [g];
    for (let i = 0; i < n; i++) {
      const dot = this.scene.add.circle(-w / 2 + 8 + step * ((i % per) + 0.5), 8 + step * (Math.floor(i / per) + 0.5), 10, COLORS.ink);
      this.helpDots.push(dot);
      parts.push(dot);
    }
    this.scene.add.container(this.signX, SIGN_Y + SIGN_H / 2 + 14, parts).setDepth(DEPTH);
    bakeGraphics(this.scene, g, { x: -w / 2, y: 0, width: w, height: h });
    return this.helpDots;
  }

  override cookieReward(): number {
    return GATE_COOKIES;
  }

  /** Resuelto: la compuerta se levanta y caen galletas. */
  protected solve(): void {
    audio.sfx('gate');
    const body = this.gate.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    this.scene.tweens.add({ targets: this.board, y: -GATE_H + 40, duration: 700, ease: 'Back.easeIn' });
    this.hooks.reward(GATE_COOKIES, this.gate.x, GROUND_TOP - 280);
  }
}
