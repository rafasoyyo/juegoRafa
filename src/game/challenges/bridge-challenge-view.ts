/**
 * Reto «El puente de los números» en el nivel (`docs/MUNDO-2.md`, mecánica B): cinco tramos numerados
 * sobre el agua, uno sin tabla. Los bloques van sobre los tramos firmes antes del hueco; al acertar, la
 * tabla vuela a su sitio y el hueco pasa a ser suelo firme.
 */

import Phaser from 'phaser';
import type { BridgeChallenge } from '../../learning/challenges/bridge';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { GROUND_TOP } from '../level-course';
import { BRIDGE_BLOCK_XS, BRIDGE_SECTION, BRIDGE_SECTIONS, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { ChallengeView, CHALLENGE_DEPTH, type ChallengeHooks } from './challenge-view';
import { drawFace } from './faces';

const WATER = 0x6fc3f0;
const WATER_DARK = 0x4da3dc;
const FOAM = 0xd9f1fd;
const WOOD = 0xc98a58;
const WOOD_DARK = 0x9c6639;
/** Tabla: grosor bajo la línea del suelo y placa con el número en su cara. */
const DECK_H = 58;
const BADGE_W = 70;
const BADGE_H = 50;
const COUNT_STEP_MS = 420;
const DEMO_TRIGGER_TILES = 8;

/** Hueco del puente en px del mundo para el reto `bridge` que empieza en `left` (px). */
export function bridgeHole(left: number, challenge: BridgeChallenge): WorldSpike {
  const s = BRIDGE_SECTION * TILE;
  return { index: -1, x: left + challenge.gap * s, width: s };
}

export class BridgeChallengeView extends ChallengeView {
  private readonly hole: WorldSpike;
  private readonly planks: (Phaser.GameObjects.Container | undefined)[] = [];
  private readonly slot: Phaser.GameObjects.Graphics;
  private counting = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: BridgeChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    const left = data.x;
    const s = BRIDGE_SECTION * TILE;
    this.hole = bridgeHole(left, challenge);

    // Agua bajo todo el puente, y más alta en el hueco.
    const water = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
    water.fillStyle(WATER_DARK).fillRect(left, GROUND_TOP + 30, BRIDGE_SECTIONS * s, 720 - GROUND_TOP);
    water.fillStyle(WATER).fillRect(this.hole.x, GROUND_TOP + 26, s, 720 - GROUND_TOP);
    water.fillStyle(FOAM);
    for (let x = this.hole.x + 14; x < this.hole.x + s - 20; x += 46) water.fillRoundedRect(x, GROUND_TOP + 30, 26, 6, 3);

    // Tramos firmes, cada uno con su número (o sus puntos) en la cara.
    for (let i = 0; i < BRIDGE_SECTIONS; i++) {
      if (i === challenge.gap) {
        this.planks.push(undefined);
        continue;
      }
      this.planks.push(this.plank(left + i * s + s / 2, challenge.shown[i] ? i : -1));
    }

    // Hueco: el sitio de la tabla, marcado con un contorno que parpadea en la pista.
    this.slot = scene.add.graphics().setDepth(CHALLENGE_DEPTH);
    this.slot.lineStyle(5, COLORS.white, 0.9).strokeRoundedRect(this.hole.x + 6, GROUND_TOP - 4, s - 12, DECK_H, 12);

    const holeLeft = this.hole.x;
    this.addBlocks(
      challenge.options,
      BRIDGE_BLOCK_XS.map((bx) => holeLeft + bx * TILE),
    );
  }

  override holes(): WorldSpike[] {
    return this.run.solved ? [] : [this.hole];
  }

  /** Tabla de un tramo centrada en `cx`, con la cara del tramo `face` (−1: sin número). */
  private plank(cx: number, face: number): Phaser.GameObjects.Container {
    const s = BRIDGE_SECTION * TILE;
    const g = this.scene.add.graphics();
    g.fillStyle(WOOD_DARK).fillRoundedRect(-s / 2 + 2, -4, s - 4, DECK_H, 12);
    g.fillStyle(WOOD).fillRoundedRect(-s / 2 + 2, -4, s - 4, DECK_H - 8, 12);
    g.fillStyle(WOOD_DARK);
    for (let x = -s / 2 + 2 + s / 4; x < s / 2 - 10; x += s / 4) g.fillRect(x, 0, 4, DECK_H - 16);
    const parts: Phaser.GameObjects.GameObject[] = [g];
    if (face >= 0) {
      const badge = this.scene.add.graphics();
      badge.fillStyle(COLORS.white).fillRoundedRect(-BADGE_W / 2, DECK_H / 2 - BADGE_H / 2 - 4, BADGE_W, BADGE_H, 14);
      parts.push(badge, drawFace(this.scene, this.challenge.faces[face]!, BADGE_H * 0.86).container.setY(DECK_H / 2 - 4));
    }
    return this.scene.add.container(cx, GROUND_TOP, parts).setDepth(CHALLENGE_DEPTH);
  }

  protected override demoTriggerX(): number {
    return this.hole.x - DEMO_TRIGGER_TILES * TILE;
  }

  protected override startDemo(): void {
    this.countUp(() => this.pointCorrect());
  }

  /** El hueco parpadea. */
  protected hintOne(): void {
    this.scene.tweens.add({ targets: this.slot, alpha: 0.1, duration: 160, yoyo: true, repeat: 3, onComplete: () => this.slot.setAlpha(1) });
  }

  protected hintTwo(): void {
    this.countUp();
  }

  /** Los tramos dan un saltito de uno en uno desde el primero, con un «tic», hasta el hueco. */
  private countUp(then?: () => void): void {
    if (this.counting) return;
    this.counting = true;
    const steps = this.challenge.gap + 1;
    for (let i = 0; i < steps; i++) {
      this.scene.time.delayedCall(i * COUNT_STEP_MS, () => {
        audio.sfx('tick', { index: i + 1 });
        const p = this.planks[i];
        if (p) this.scene.tweens.add({ targets: p, y: GROUND_TOP - 16, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
        else this.hintOne();
      });
    }
    this.scene.time.delayedCall(steps * COUNT_STEP_MS + 200, () => {
      this.counting = false;
      then?.();
    });
  }

  /** La tabla del número correcto vuela del bloque al hueco; al llegar, suena la escala y se cierra. */
  protected solve(block: Phaser.GameObjects.Container): void {
    const s = BRIDGE_SECTION * TILE;
    const plank = this.plank(block.x, this.challenge.gap);
    plank.setPosition(block.x, block.y).setScale(0.4).setDepth(CHALLENGE_DEPTH + 2);
    // Se ve el número aunque el tramo estuviera oculto: es la respuesta.
    this.scene.tweens.add({
      targets: plank,
      x: this.hole.x + s / 2,
      y: GROUND_TOP,
      scale: 1,
      duration: 650,
      ease: 'Back.easeOut',
      onComplete: () => {
        plank.setDepth(CHALLENGE_DEPTH);
        this.slot.setVisible(false);
        audio.sfx('scale');
        this.hooks.closeHole(this.hole);
      },
    });
  }
}
