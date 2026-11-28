/**
 * Reto «El puente de los números» en el nivel (`docs/MUNDO-2.md`, mecánica B): cinco tramos numerados
 * sobre el agua, uno sin tabla. Los bloques van sobre los tramos firmes antes del hueco; al acertar, la
 * tabla vuela a su sitio y el hueco pasa a ser suelo firme.
 */

import Phaser from 'phaser';
import type { BridgeChallenge } from '../../learning/challenges/bridge';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { bakeGraphics } from '../ui/bake';
import { GROUND_TOP } from '../level-course';
import { BRIDGE_BLOCK_XS, BRIDGE_SECTION, BRIDGE_SECTIONS, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { ChallengeView, CHALLENGE_DEPTH, type ChallengeHooks } from './challenge-view';
import { drawFace } from './faces';

const WATER = 0x6fc3f0;
const WATER_DARK = 0x4da3dc;
const FOAM = 0xd9f1fd;
const WOOD = 0xc98a58;
const WOOD_DARK = 0x9c6639;
/** Tabla: grosor bajo la línea del suelo. */
const DECK_H = 58;
/**
 * Recta numérica: una cuerda entre dos postes en los extremos del puente, por encima de los bloques, con
 * un cartel colgado sobre cada tramo. Ahí no la tapan ni el zorro ni los controles.
 */
const ROPE_Y = GROUND_TOP - 360;
const SIGN_W = 96;
const SIGN_H = 80;
const SIGN_Y = ROPE_Y + 30 + SIGN_H / 2;
const ROPE = 0x8a5a2e;
const COUNT_STEP_MS = 420;
const DEMO_TRIGGER_TILES = 8;

/** Hueco del puente (también el de huellas de la isla) en px del mundo para el puente que empieza en `left` (px). */
export function bridgeHole(left: number, challenge: { gap: number }): WorldSpike {
  const s = BRIDGE_SECTION * TILE;
  return { index: -1, x: left + challenge.gap * s, width: s };
}

export class BridgeChallengeView extends ChallengeView {
  private readonly hole: WorldSpike;
  private readonly planks: (Phaser.GameObjects.Container | undefined)[] = [];
  private readonly signs: (Phaser.GameObjects.Container | undefined)[] = [];
  private readonly slot: Phaser.GameObjects.Image;
  private gapSign: Phaser.GameObjects.Container;
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
    bakeGraphics(scene, water, { x: left, y: GROUND_TOP + 26, width: BRIDGE_SECTIONS * s, height: 720 - GROUND_TOP - 26 });

    // Tramos firmes.
    for (let i = 0; i < BRIDGE_SECTIONS; i++) this.planks.push(i === challenge.gap ? undefined : this.plank(left + i * s + s / 2));

    // Recta numérica: postes, cuerda y el número (o los puntos) de cada tramo; el del hueco, vacío.
    const rope = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
    for (const px of [left, left + BRIDGE_SECTIONS * s]) {
      rope.fillStyle(WOOD_DARK).fillRoundedRect(px - 8, ROPE_Y - 20, 16, GROUND_TOP - ROPE_Y + 20, 6);
      rope.fillStyle(WOOD).fillCircle(px, ROPE_Y - 20, 12);
    }
    rope.lineStyle(5, ROPE).lineBetween(left, ROPE_Y, left + BRIDGE_SECTIONS * s, ROPE_Y);
    bakeGraphics(scene, rope, { x: left - 12, y: ROPE_Y - 32, width: BRIDGE_SECTIONS * s + 24, height: GROUND_TOP - ROPE_Y + 32 });
    for (let i = 0; i < BRIDGE_SECTIONS; i++) {
      this.signs.push(i !== challenge.gap && challenge.shown[i] ? this.sign(left + i * s + s / 2, i) : undefined);
    }
    this.gapSign = this.sign(this.hole.x + s / 2, -1);

    // Hueco: el sitio de la tabla, marcado con un contorno que parpadea en la pista.
    const slot = scene.add.graphics().setDepth(CHALLENGE_DEPTH);
    slot.lineStyle(5, COLORS.white, 0.9).strokeRoundedRect(this.hole.x + 6, GROUND_TOP - 4, s - 12, DECK_H, 12);
    this.slot = bakeGraphics(scene, slot, { x: this.hole.x + 3, y: GROUND_TOP - 7, width: s - 6, height: DECK_H + 6 })[0]!;

    const holeLeft = this.hole.x;
    this.addBlocks(
      challenge.options,
      BRIDGE_BLOCK_XS.map((bx) => holeLeft + bx * TILE),
    );
  }

  override holes(): WorldSpike[] {
    return this.run.solved ? [] : [this.hole];
  }

  /** Tabla de un tramo centrada en `cx`. */
  private plank(cx: number): Phaser.GameObjects.Container {
    const s = BRIDGE_SECTION * TILE;
    const g = this.scene.add.graphics();
    g.fillStyle(WOOD_DARK).fillRoundedRect(-s / 2 + 2, -4, s - 4, DECK_H, 12);
    g.fillStyle(WOOD).fillRoundedRect(-s / 2 + 2, -4, s - 4, DECK_H - 8, 12);
    g.fillStyle(WOOD_DARK);
    for (let x = -s / 2 + 2 + s / 4; x < s / 2 - 10; x += s / 4) g.fillRect(x, 0, 4, DECK_H - 16);
    const plank = this.scene.add.container(cx, GROUND_TOP, [g]).setDepth(CHALLENGE_DEPTH);
    bakeGraphics(this.scene, g, { x: -s / 2 + 2, y: -4, width: s - 4, height: DECK_H });
    return plank;
  }

  /** Cartel colgado de la cuerda en `cx` con la cara del tramo `i`; con −1, el hueco: vacío y punteado. */
  private sign(cx: number, i: number): Phaser.GameObjects.Container {
    const g = this.scene.add.graphics();
    g.lineStyle(4, ROPE).lineBetween(-SIGN_W / 4, -SIGN_H / 2, -SIGN_W / 4, ROPE_Y - SIGN_Y).lineBetween(SIGN_W / 4, -SIGN_H / 2, SIGN_W / 4, ROPE_Y - SIGN_Y);
    const parts: Phaser.GameObjects.GameObject[] = [g];
    if (i >= 0) {
      g.fillStyle(COLORS.shadow).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2 + 6, SIGN_W, SIGN_H, 18);
      g.fillStyle(COLORS.white).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 18);
      parts.push(drawFace(this.scene, this.challenge.faces[i]!, SIGN_H * 0.86).container);
    } else {
      g.fillStyle(COLORS.white, 0.35).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 18);
      g.lineStyle(5, COLORS.white).strokeRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 18);
    }
    const sign = this.scene.add.container(cx, SIGN_Y, parts).setDepth(CHALLENGE_DEPTH);
    // De la cuerda (arriba) a la sombra del cartel (abajo), con el grosor de las líneas.
    const top = ROPE_Y - SIGN_Y - 2;
    bakeGraphics(this.scene, g, { x: -SIGN_W / 2 - 3, y: top, width: SIGN_W + 6, height: SIGN_H / 2 + 9 - top });
    return sign;
  }

  protected override demoTriggerX(): number {
    return this.hole.x - DEMO_TRIGGER_TILES * TILE;
  }

  protected override startDemo(): void {
    this.countUp(() => this.pointCorrect());
  }

  /** El hueco y su cartel vacío parpadean. */
  protected hintOne(): void {
    this.scene.tweens.add({
      targets: [this.slot, this.gapSign],
      alpha: 0.1,
      duration: 160,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.slot.setAlpha(1);
        this.gapSign.setAlpha(1);
      },
    });
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
        const sign = i === this.challenge.gap ? this.gapSign : this.signs[i];
        if (p) this.scene.tweens.add({ targets: p, y: GROUND_TOP - 16, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
        else this.hintOne();
        if (sign) this.scene.tweens.add({ targets: sign, y: SIGN_Y - 18, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
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
    const plank = this.plank(block.x);
    plank.setPosition(block.x, block.y).setScale(0.4).setDepth(CHALLENGE_DEPTH + 2);
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
        // El cartel del hueco pasa a tener su número.
        this.gapSign.destroy();
        const filled = this.sign(this.hole.x + s / 2, this.challenge.gap);
        this.scene.tweens.add({ targets: filled, scale: { from: 1.3, to: 1 }, duration: 260, ease: 'Back.easeOut' });
        audio.sfx('scale');
        this.hooks.closeHole(this.hole);
      },
    });
  }
}
