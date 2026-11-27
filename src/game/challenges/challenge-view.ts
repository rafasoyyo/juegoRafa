/**
 * Parte común de los retos del recorrido (`docs/MUNDO-2.md`): bloques con cara que se golpean desde
 * abajo, la escalera de fallos de `ladder.ts`, el tambaleo y Lalo señalando. Cada mecánica pone su
 * dibujo, sus dos pistas y lo que pasa al resolverse.
 */

import Phaser from 'phaser';
import type { Face } from '../../learning/challenges/count-blocks';
import { hitBlock, startChallenge, type ChallengeRun } from '../../learning/challenges/ladder';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { BLOCK_SIZE, GROUND_TOP } from '../level-course';
import { ROW_BASE, type WorldSpike } from '../levels/types';
import { drawFace } from './faces';
import type { LaloFlyer } from './lalo-flyer';

const HIT_COOLDOWN_MS = 350;
/** Tras el tercer fallo, lo que tarda en resolverse solo mientras Lalo señala. */
const LALO_SOLVES_MS = 1400;
export const CHALLENGE_DEPTH = 4;
export const FADED_ALPHA = 0.45;

export interface ChallengeHooks {
  lalo: LaloFlyer;
  /** Suma galletas al nivel (cae una lluvia desde `x`, `y`). */
  reward(count: number, x: number, y: number): void;
  /** Cierra un hueco del suelo (el del puente): pasa a ser suelo firme. */
  closeHole(hole: WorldSpike): void;
  /** Mientras `on`, el zorro no responde a los controles (va en la barca). */
  hold(on: boolean): void;
  /** Mueve al zorro `dx` px junto con la plataforma que lo lleva. */
  carry(dx: number): void;
}

export interface BlockView {
  zone: Phaser.GameObjects.Zone;
  visual: Phaser.GameObjects.Container;
}

export abstract class ChallengeView {
  readonly run: ChallengeRun;
  protected readonly blocks: BlockView[] = [];
  private lastHitAt = -Infinity;
  protected demoStarted = false;

  constructor(
    protected readonly scene: Phaser.Scene,
    protected readonly fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    readonly demo: boolean,
    protected readonly correct: number,
    protected readonly hooks: ChallengeHooks,
  ) {
    this.run = startChallenge(correct);
  }

  /** Galletas que da el reto al resolverse: cuentan en el total de la fase para las estrellas. */
  cookieReward(): number {
    return 0;
  }

  /** Huecos que el reto corta en el suelo mientras no esté resuelto. */
  holes(): WorldSpike[] {
    return [];
  }

  /** Con el zorro en `foxX`: la demostración empieza al acercarse. */
  update(foxX: number): void {
    if (this.demo && !this.demoStarted && !this.run.solved && foxX >= this.demoTriggerX()) {
      this.demoStarted = true;
      this.startDemo();
    }
  }

  protected demoTriggerX(): number {
    return Infinity;
  }

  protected startDemo(): void {
    this.pointCorrect();
  }

  /** Bloques con cara en la fila baja sobre el suelo, centrados en `xs` (px). */
  protected addBlocks(faces: readonly Face[], xs: readonly number[]): void {
    this.addBlockViews(xs, (i) => {
      const g = this.scene.add.graphics();
      g.fillStyle(0xb9d9ef).fillRoundedRect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2 + 6, BLOCK_SIZE, BLOCK_SIZE, 18);
      g.fillStyle(COLORS.white).fillRoundedRect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE, 18);
      return [g, drawFace(this.scene, faces[i]!, BLOCK_SIZE * 0.8).container];
    });
  }

  /** Bloques en la fila baja sobre el suelo, centrados en `xs` (px), con el dibujo que da `parts`. */
  protected addBlockViews(xs: readonly number[], parts: (i: number) => Phaser.GameObjects.GameObject[]): void {
    const by = GROUND_TOP - ROW_BASE.low - BLOCK_SIZE / 2;
    xs.forEach((bx, i) => {
      const visual = this.scene.add.container(bx, by, parts(i)).setDepth(CHALLENGE_DEPTH);
      const zone = this.scene.add.zone(bx, by, BLOCK_SIZE, BLOCK_SIZE);
      this.scene.physics.add.existing(zone, true);
      this.scene.physics.add.collider(this.fox, zone, () => {
        if (this.fox.body.touching.up) this.onHit(i);
      });
      this.blocks.push({ zone, visual });
    });
  }

  protected correctBlock(): BlockView {
    return this.blocks[this.correct]!;
  }

  protected pointCorrect(): void {
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
    if (event === 'correct') {
      this.resolve(i);
      return;
    }
    audio.sfx('nope');
    this.wobble(block.visual);
    if (event === 'wobble') this.hintOne(i);
    else if (event === 'count-up') this.hintTwo();
    else {
      const b = this.correctBlock().visual;
      this.hooks.lalo.point(b.x, b.y - BLOCK_SIZE / 2 - 14);
      this.scene.time.delayedCall(LALO_SOLVES_MS, () => {
        this.scene.tweens.add({ targets: b, y: b.y - 14, duration: 80, yoyo: true });
        this.resolve(this.correct);
      });
    }
  }

  /** Resuelto: el resto de bloques se apaga, la mecánica hace lo suyo y Lalo vuelve a su sitio. */
  private resolve(from: number): void {
    this.blocks.forEach((b, i) => {
      if (i !== this.correct) b.visual.setAlpha(FADED_ALPHA);
    });
    this.solve(this.blocks[from]!.visual);
    if (this.hooks.lalo.flying) this.scene.time.delayedCall(500, () => this.hooks.lalo.home());
  }

  protected wobble(target: Phaser.GameObjects.Container): void {
    this.scene.tweens.add({ targets: target, angle: { from: -9, to: 9 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => target.setAngle(0) });
  }

  /** Primer fallo (además del tambaleo del bloque `block`). */
  protected abstract hintOne(block: number): void;
  /** Segundo fallo: contar. */
  protected abstract hintTwo(): void;
  /** El reto queda resuelto desde el bloque `block` (el correcto). */
  protected abstract solve(block: Phaser.GameObjects.Container): void;
}
