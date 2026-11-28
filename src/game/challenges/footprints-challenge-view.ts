/**
 * Reto «El camino de huellas» en el nivel (`docs/MUNDO-3.md`, reto A de la isla): un puente en ruinas de
 * cinco losas sobre un río de lava, al que le falta una. Sobre el puente, un dintel de piedra con una
 * tablilla grabada encima de cada losa sigue una serie de formas. Los bloques de piedra van sobre las
 * losas firmes antes del hueco; al acertar, la losa sube de la lava y encaja, los grabados se encienden
 * uno tras otro con su nota y el hueco pasa a ser suelo firme. Usa la geometría del puente del río.
 */

import Phaser from 'phaser';
import type { FootprintsChallenge } from '../../learning/challenges/footprints';
import { audio } from '../audio/audio-engine';
import { GROUND_TOP } from '../level-course';
import { BRIDGE_BLOCK_XS, BRIDGE_SECTION, BRIDGE_SECTIONS, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { bakeGraphics, bakePiece } from '../ui/bake';
import { bridgeHole } from './bridge-challenge-view';
import { ChallengeView, CHALLENGE_DEPTH, type ChallengeHooks } from './challenge-view';
import { drawGlyph, drawStoneBlock, GOLD, lightGlyph, STONE, type GlyphView } from './glyphs';

const LAVA_DARK = 0x7a2a1c;
const LAVA = 0xe8582a;
const LAVA_HOT = 0xffa33a;
const CRUST = 0x2f2b2e;
/** Losa: grosor bajo la línea del suelo. */
const DECK_H = 58;
/** Dintel de piedra sobre el puente, con las tablillas colgadas debajo: por encima de los bloques. */
const BEAM_Y = GROUND_TOP - 390;
const BEAM_H = 30;
const TABLET = 100;
const TABLET_Y = BEAM_Y + BEAM_H + 14 + TABLET / 2;
const STEP_MS = 430;
const DEMO_TRIGGER_TILES = 8;
const SLAB_KEY = 'isla-losa';
const TABLET_KEY = 'isla-tablilla';

/** Texturas de la losa y de la tablilla, dibujadas una sola vez y compartidas por todos los puentes. */
function ensureTextures(scene: Phaser.Scene): void {
  const s = BRIDGE_SECTION * TILE;
  if (!scene.textures.exists(SLAB_KEY)) {
    const g = scene.make.graphics({}, false);
    g.fillStyle(STONE.dark).fillRoundedRect(0, 4, s - 4, DECK_H, 12);
    g.fillStyle(STONE.base).fillRoundedRect(0, 0, s - 4, DECK_H - 8, 12);
    g.fillStyle(STONE.light).fillRoundedRect(0, 0, s - 4, 12, { tl: 12, tr: 12, bl: 0, br: 0 });
    // Juntas de los sillares.
    g.fillStyle(STONE.dark);
    for (let x = s / 3; x < s - 20; x += s / 3) g.fillRect(x, 14, 4, DECK_H - 26);
    g.generateTexture(SLAB_KEY, s - 4, DECK_H + 4);
    g.destroy();
  }
  if (!scene.textures.exists(TABLET_KEY)) {
    const g = scene.make.graphics({}, false);
    g.fillStyle(STONE.dark).fillRoundedRect(0, 6, TABLET, TABLET, 16);
    g.fillStyle(STONE.base).fillRoundedRect(0, 0, TABLET, TABLET, 16);
    g.fillStyle(STONE.light).fillRoundedRect(6, 6, TABLET - 12, 8, 4);
    g.generateTexture(TABLET_KEY, TABLET, TABLET + 6);
    g.destroy();
  }
}

export class FootprintsChallengeView extends ChallengeView {
  private readonly hole: WorldSpike;
  private readonly slabs: (Phaser.GameObjects.Image | undefined)[] = [];
  private readonly tablets: Phaser.GameObjects.Container[] = [];
  private readonly glyphs: (GlyphView | undefined)[] = [];
  private readonly slot: Phaser.GameObjects.Image;
  private readonly gapMark: Phaser.GameObjects.Image;
  private playing = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: FootprintsChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    ensureTextures(scene);
    const left = data.x;
    const s = BRIDGE_SECTION * TILE;
    const width = BRIDGE_SECTIONS * s;
    this.hole = bridgeHole(left, challenge);

    // Río de lava bajo todo el puente, con costra oscura, y más vivo en el hueco. Se dibuja una vez.
    const lava = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
    lava.fillStyle(LAVA_DARK).fillRect(left, GROUND_TOP + 30, width, 720 - GROUND_TOP);
    lava.fillStyle(CRUST);
    for (let x = left + 20; x < left + width - 40; x += 90) lava.fillRoundedRect(x, GROUND_TOP + 58 + ((x / 90) % 2) * 20, 46, 10, 5);
    lava.fillStyle(LAVA).fillRect(this.hole.x, GROUND_TOP + 24, s, 720 - GROUND_TOP);
    lava.fillStyle(LAVA_HOT);
    for (let x = this.hole.x + 20; x < this.hole.x + s - 30; x += 56) lava.fillCircle(x + 12, GROUND_TOP + 40 + ((x / 56) % 2) * 16, 9);
    bakeGraphics(scene, lava, { x: left, y: GROUND_TOP + 24, width, height: 720 - GROUND_TOP - 24 });

    // Losas firmes.
    for (let i = 0; i < BRIDGE_SECTIONS; i++) this.slabs.push(i === challenge.gap ? undefined : this.slab(left + i * s + s / 2, GROUND_TOP));

    // Dintel sobre dos columnas en los extremos del puente, y una tablilla grabada sobre cada losa.
    // Columnas, dintel y ganchos horneados por separado: juntos serían una imagen grande casi vacía.
    for (const px of [left, left + width]) {
      const column = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
      column.fillStyle(STONE.dark).fillRoundedRect(px - 18, BEAM_Y, 36, GROUND_TOP - BEAM_Y + 6, 8);
      column.fillStyle(STONE.base).fillRoundedRect(px - 14, BEAM_Y, 24, GROUND_TOP - BEAM_Y, 8);
      bakePiece(scene, column, { x: px - 18, y: BEAM_Y, width: 36, height: GROUND_TOP - BEAM_Y + 6 });
    }
    const ruin = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
    ruin.fillStyle(STONE.dark).fillRoundedRect(left - 30, BEAM_Y + 6, width + 60, BEAM_H, 10);
    ruin.fillStyle(STONE.base).fillRoundedRect(left - 30, BEAM_Y, width + 60, BEAM_H, 10);
    ruin.fillStyle(GOLD).fillRect(left - 20, BEAM_Y + BEAM_H / 2 - 2, width + 40, 4);
    for (let i = 0; i < BRIDGE_SECTIONS; i++) {
      const cx = left + i * s + s / 2;
      ruin.fillStyle(STONE.dark).fillRect(cx - 6, BEAM_Y + BEAM_H, 12, 16);
      const tablet = scene.add.container(cx, TABLET_Y).setDepth(CHALLENGE_DEPTH);
      tablet.add(scene.add.image(0, 3, TABLET_KEY));
      const glyph = i === challenge.gap ? undefined : drawGlyph(scene, challenge.slabs[i]!, TABLET * 0.7);
      if (glyph) tablet.add(glyph.container);
      this.tablets.push(tablet);
      this.glyphs.push(glyph);
    }
    bakeGraphics(scene, ruin, { x: left - 30, y: BEAM_Y, width: width + 60, height: BEAM_H + 16 });
    // La tablilla del hueco, vacía y con un marco que parpadea en la pista.
    const gapMark = scene.add.graphics().setDepth(CHALLENGE_DEPTH);
    const markX = this.hole.x + s / 2 - TABLET / 2 + 10;
    const markY = TABLET_Y - TABLET / 2 + 10;
    gapMark.lineStyle(5, GOLD).strokeRoundedRect(markX, markY, TABLET - 20, TABLET - 20, 10);
    this.gapMark = bakePiece(scene, gapMark, { x: markX - 4, y: markY - 4, width: TABLET - 12, height: TABLET - 12 });

    // El sitio de la losa que falta.
    const slot = scene.add.graphics().setDepth(CHALLENGE_DEPTH);
    slot.lineStyle(5, LAVA_HOT, 0.9).strokeRoundedRect(this.hole.x + 6, GROUND_TOP - 4, s - 12, DECK_H, 12);
    this.slot = bakePiece(scene, slot, { x: this.hole.x + 2, y: GROUND_TOP - 8, width: s - 4, height: DECK_H + 8 });

    const holeLeft = this.hole.x;
    this.addBlockViews(
      BRIDGE_BLOCK_XS.map((bx) => holeLeft + bx * TILE),
      (i) => [drawStoneBlock(scene), drawGlyph(scene, challenge.options[i]!, TILE * 0.62).container],
    );
  }

  override holes(): WorldSpike[] {
    return this.run.solved ? [] : [this.hole];
  }

  private slab(cx: number, y: number): Phaser.GameObjects.Image {
    return this.scene.add.image(cx, y - 4, SLAB_KEY).setOrigin(0.5, 0).setDepth(CHALLENGE_DEPTH);
  }

  protected override demoTriggerX(): number {
    return this.hole.x - DEMO_TRIGGER_TILES * TILE;
  }

  protected override startDemo(): void {
    this.playSeries(() => this.pointCorrect());
  }

  /** El hueco y su tablilla vacía parpadean. */
  protected hintOne(): void {
    this.scene.tweens.add({
      targets: [this.slot, this.gapMark],
      alpha: 0.1,
      duration: 160,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.slot.setAlpha(1);
        this.gapMark.setAlpha(1);
      },
    });
  }

  /** Segundo fallo: la serie suena losa a losa y en el hueco se oye el silencio. */
  protected hintTwo(): void {
    this.playSeries();
  }

  /**
   * Las tablillas se encienden de una en una desde la primera, cada una con la nota de su forma; la del
   * hueco parpadea en silencio. El ritmo deja oír lo que falta.
   */
  private playSeries(then?: () => void): void {
    if (this.playing) return;
    this.playing = true;
    for (let i = 0; i < BRIDGE_SECTIONS; i++) {
      this.scene.time.delayedCall(i * STEP_MS, () => {
        const glyph = this.glyphs[i];
        const tablet = this.tablets[i]!;
        this.scene.tweens.add({ targets: tablet, y: TABLET_Y - 14, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
        if (glyph) {
          audio.sfx('glyph', { index: this.challenge.notes[i] });
          lightGlyph(this.scene, glyph);
        } else this.hintOne();
      });
    }
    this.scene.time.delayedCall(BRIDGE_SECTIONS * STEP_MS + 200, () => {
      this.playing = false;
      then?.();
    });
  }

  /**
   * El grabado vuela del bloque a la tablilla del hueco y la losa sube de la lava hasta encajar con un
   * golpe de piedra. Después la serie entera se enciende con su melodía y el hueco se cierra.
   */
  protected solve(block: Phaser.GameObjects.Container): void {
    const s = BRIDGE_SECTION * TILE;
    const gap = this.challenge.gap;
    const glyph = drawGlyph(this.scene, this.challenge.slabs[gap]!, TABLET * 0.7);
    glyph.container.setPosition(block.x, block.y).setDepth(CHALLENGE_DEPTH + 2);
    this.scene.tweens.add({
      targets: glyph.container,
      x: this.hole.x + s / 2,
      y: TABLET_Y,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        glyph.container.setPosition(0, 0).setDepth(0);
        this.tablets[gap]!.add(glyph.container);
        this.glyphs[gap] = glyph;
        this.gapMark.setVisible(false);
      },
    });
    const slab = this.slab(this.hole.x + s / 2, GROUND_TOP + 90).setAlpha(0.6);
    this.slabs[gap] = slab;
    this.scene.tweens.add({
      targets: slab,
      y: GROUND_TOP - 4,
      alpha: 1,
      delay: 300,
      duration: 520,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.slot.setVisible(false);
        audio.sfx('stone');
        this.scene.cameras.main.shake(140, 0.004);
        this.hooks.closeHole(this.hole);
        this.scene.time.delayedCall(250, () => this.lightAll());
      },
    });
  }

  /** Todos los grabados se encienden uno tras otro con su nota y se quedan encendidos. */
  private lightAll(): void {
    for (let i = 0; i < BRIDGE_SECTIONS; i++) {
      this.scene.time.delayedCall(i * 160, () => {
        const glyph = this.glyphs[i];
        if (!glyph) return;
        audio.sfx('glyph', { index: this.challenge.notes[i] });
        lightGlyph(this.scene, glyph, true);
      });
    }
  }
}
