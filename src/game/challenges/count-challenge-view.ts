/**
 * Reto «Bloques que cuentan» en el nivel (`docs/MUNDO-2.md`, mecánica A): cartel, tres bloques con cara
 * que se golpean desde abajo y la compuerta que corta el paso. La lógica (valores y escalera de fallos)
 * está en `src/learning/challenges/`; aquí solo se dibuja y se anima.
 */

import Phaser from 'phaser';
import type { CountChallenge } from '../../learning/challenges/count-blocks';
import { hitBlock, startChallenge, type ChallengeRun } from '../../learning/challenges/ladder';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { BLOCK_SIZE, GROUND_TOP } from '../level-course';
import { CHALLENGE_BLOCK_XS, CHALLENGE_GATE_X, CHALLENGE_SIGN_X, ROW_BASE, TILE, type ChallengeData } from '../levels/types';
import { drawFace, lightDot, resetDots, type FaceView } from './faces';
import type { LaloFlyer } from './lalo-flyer';

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
const HIT_COOLDOWN_MS = 350;
/** La demostración empieza cuando el zorro está a esta distancia del cartel, en baldosas. */
const DEMO_TRIGGER_TILES = 7;
const DEPTH = 4;

export interface ChallengeHooks {
  lalo: LaloFlyer;
  /** Suma galletas al nivel (cae una lluvia desde `x`, `y`). */
  reward(count: number, x: number, y: number): void;
}

interface BlockView {
  zone: Phaser.GameObjects.Zone;
  visual: Phaser.GameObjects.Container;
}

export class CountChallengeView {
  readonly run: ChallengeRun;
  readonly demo: boolean;
  private readonly blocks: BlockView[] = [];
  private readonly sign: Phaser.GameObjects.Container;
  private readonly signFace: FaceView;
  private readonly gate: Phaser.GameObjects.Zone;
  private readonly board: Phaser.GameObjects.Graphics;
  private readonly signX: number;
  private demoStarted = false;
  private lastHitAt = -Infinity;
  private counting = false;
  private helpDots: Phaser.GameObjects.Arc[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    private readonly data: ChallengeData & { index: number },
    private readonly challenge: CountChallenge,
    private readonly hooks: ChallengeHooks,
  ) {
    this.run = startChallenge(challenge.correct);
    this.demo = data.demo;
    const x = data.x;
    this.signX = x + CHALLENGE_SIGN_X * TILE;

    // Cartel: poste y tablero blanco con la consigna dibujada.
    const post = scene.add.graphics();
    post.fillStyle(WOOD_DARK).fillRoundedRect(-9, 0, 18, GROUND_TOP - SIGN_Y, 6);
    post.setPosition(this.signX, SIGN_Y).setDepth(DEPTH - 1);
    const panel = scene.add.graphics();
    panel.fillStyle(COLORS.shadow).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2 + 8, SIGN_W, SIGN_H, 28);
    panel.fillStyle(COLORS.white).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 28);
    this.signFace = drawFace(scene, challenge.sign, Math.min(SIGN_W, SIGN_H) * 0.82);
    this.sign = scene.add.container(this.signX, SIGN_Y, [panel, this.signFace.container]).setDepth(DEPTH);

    // Bloques con cara, en la fila baja sobre el suelo.
    const bottom = GROUND_TOP - ROW_BASE.low;
    challenge.options.forEach((face, i) => {
      const bx = x + (CHALLENGE_BLOCK_XS[i] ?? 0) * TILE;
      const by = bottom - BLOCK_SIZE / 2;
      const g = scene.add.graphics();
      g.fillStyle(0xb9d9ef).fillRoundedRect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2 + 6, BLOCK_SIZE, BLOCK_SIZE, 18);
      g.fillStyle(COLORS.white).fillRoundedRect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE, 18);
      const f = drawFace(scene, face, BLOCK_SIZE * 0.8);
      const visual = scene.add.container(bx, by, [g, f.container]).setDepth(DEPTH);
      const zone = scene.add.zone(bx, by, BLOCK_SIZE, BLOCK_SIZE);
      scene.physics.add.existing(zone, true);
      scene.physics.add.collider(fox, zone, () => {
        if (fox.body.touching.up) this.onHit(i);
      });
      this.blocks.push({ zone, visual });
    });

    // Compuerta del arroyo: dos postes de piedra y una tabla de madera que se levanta.
    const gx = x + CHALLENGE_GATE_X * TILE;
    const top = GROUND_TOP - GATE_H;
    const posts = scene.add.graphics().setDepth(DEPTH + 1);
    for (const px of [gx - GATE_W / 2 - POST_W / 2, gx + GATE_W / 2 + POST_W / 2]) {
      posts.fillStyle(STONE_DARK).fillRoundedRect(px - POST_W / 2, top - 30 + 4, POST_W, GATE_H + 30, 8);
      posts.fillStyle(STONE).fillRoundedRect(px - POST_W / 2, top - 30, POST_W, GATE_H + 26, 8);
    }
    this.board = scene.add.graphics().setDepth(DEPTH);
    this.board.fillStyle(WOOD_DARK).fillRoundedRect(gx - GATE_W / 2, top, GATE_W, GATE_H, 10);
    this.board.fillStyle(WOOD).fillRoundedRect(gx - GATE_W / 2 + 6, top + 6, GATE_W - 12, GATE_H - 12, 8);
    this.board.fillStyle(WOOD_DARK);
    for (let y = top + 70; y < GROUND_TOP - 20; y += 70) this.board.fillRect(gx - GATE_W / 2 + 6, y, GATE_W - 12, 6);
    this.gate = scene.add.zone(gx, top + GATE_H / 2, GATE_W, GATE_H);
    scene.physics.add.existing(this.gate, true);
    scene.physics.add.collider(fox, this.gate);
  }

  /** Con el zorro en `foxX`: empieza la demostración al acercarse. */
  update(foxX: number): void {
    if (this.demo && !this.demoStarted && !this.run.solved && foxX >= this.signX - DEMO_TRIGGER_TILES * TILE) {
      this.demoStarted = true;
      // Lalo va al cartel, cuenta y señala el bloque correcto hasta que el niño lo golpee.
      this.hooks.lalo.flyTo(this.signX + SIGN_W / 2 + 30, SIGN_Y - SIGN_H / 2, () => this.countUp(() => this.pointCorrect()));
    }
  }

  private correctBlock(): BlockView {
    return this.blocks[this.challenge.correct]!;
  }

  private pointCorrect(): void {
    if (this.run.solved) return;
    const b = this.correctBlock().visual;
    this.hooks.lalo.point(b.x, b.y - BLOCK_SIZE / 2 - 14);
  }

  private onHit(i: number): void {
    const now = this.scene.time.now;
    if (now - this.lastHitAt < HIT_COOLDOWN_MS) return;
    this.lastHitAt = now;
    const block = this.blocks[i];
    if (!block) return;
    const event = hitBlock(this.run, i);
    if (event === 'ignored') return;
    audio.sfx('block');
    this.scene.tweens.add({ targets: block.visual, y: block.visual.y - 14, duration: 80, yoyo: true });
    switch (event) {
      case 'correct':
        this.solve();
        break;
      case 'wobble':
        audio.sfx('nope');
        this.wobble(block.visual);
        this.scene.tweens.add({ targets: this.sign, y: SIGN_Y - 22, duration: 140, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
        break;
      case 'count-up':
        audio.sfx('nope');
        this.wobble(block.visual);
        this.countUp();
        break;
      case 'solved-by-lalo': {
        audio.sfx('nope');
        this.wobble(block.visual);
        const b = this.correctBlock().visual;
        this.hooks.lalo.point(b.x, b.y - BLOCK_SIZE / 2 - 14);
        this.scene.time.delayedCall(1400, () => {
          this.scene.tweens.add({ targets: b, y: b.y - 14, duration: 80, yoyo: true });
          this.solve();
        });
        break;
      }
    }
  }

  private wobble(target: Phaser.GameObjects.Container): void {
    this.scene.tweens.add({ targets: target, angle: { from: -9, to: 9 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => target.setAngle(0) });
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
    return this.helpDots;
  }

  /** Resuelto: la compuerta se levanta, caen galletas y el resto de bloques se apaga. */
  private solve(): void {
    audio.sfx('gate');
    this.blocks.forEach((b, i) => {
      if (i !== this.challenge.correct) b.visual.setAlpha(0.45);
    });
    const body = this.gate.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    this.scene.tweens.add({ targets: this.board, y: -GATE_H + 40, duration: 700, ease: 'Back.easeIn' });
    this.hooks.reward(GATE_COOKIES, this.gate.x, GROUND_TOP - 280);
    if (this.hooks.lalo.flying) this.scene.time.delayedCall(500, () => this.hooks.lalo.home());
  }
}
