/**
 * Reto «Las piedras del géiser» en el nivel (`docs/MUNDO-3.md`, reto D de la isla): un tótem de piedra en
 * la orilla muestra una forma y sobre un lago de lava hay una fila de piedras con formas grabadas. Se
 * cruza saltando: las piedras que cumplen lo del tótem aguantan y suenan; las otras se hunden despacio con
 * un siseo y Rufo vuelve con un saltito a la piedra anterior, sin galleta menos. Al llegar a la otra
 * orilla, el géiser lanza una columna de vapor. No hay bloques: pisar una piedra mala es el fallo.
 */

import Phaser from 'phaser';
import type { GeyserChallenge, GeyserStone } from '../../learning/challenges/geyser';
import { hitBlock } from '../../learning/challenges/ladder';
import { audio } from '../audio/audio-engine';
import { GROUND_TOP } from '../level-course';
import { GEYSER_LAKE, GEYSER_STONE_W, GEYSER_TOTEM_X, geyserStoneX, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { fillShape } from '../ui/quiz-art';
import { ChallengeView, CHALLENGE_DEPTH as DEPTH, type ChallengeHooks } from './challenge-view';
import { drawGlyph, GLYPH_HEX, GOLD, lightGlyph, STONE, type GlyphView } from './glyphs';

const LAVA = 0xe8642c;
const LAVA_LIGHT = 0xffa23f;
const LAVA_DARK = 0xa83a1c;
const BASALT = 0x3a3540;
const BASALT_LIGHT = 0x524b58;
const STEAM = 0xf1f6f5;
const CARVED = 0xd9d2c3;
const GLOW = 0xfff2a8;
/** Lado del grabado de cada piedra según su tamaño. */
const GLYPH_SIZE = { small: 38, normal: 52, big: 66 } as const;
const STONE_H = 74;
const STELE_W = 76;
const STELE_H = 78;
const SINK = 46;
const SINK_MS = 650;
const HOP_MS = 520;
const TOTEM_H = 250;
const DEMO_TRIGGER_TILES = 9;
/** Índice del «bloque» bueno en la escalera de fallos: llegar a la otra orilla. */
const ARRIVE = 0;
const STEP_ON_BAD = 1;

interface StoneView {
  data: GeyserStone;
  x: number;
  container: Phaser.GameObjects.Container;
  glyph: GlyphView;
  zone: Phaser.GameObjects.Zone;
  sunk: boolean;
}

export class GeyserChallengeView extends ChallengeView {
  private readonly lakeLeft: number;
  private readonly lakeW: number;
  private readonly stones: StoneView[] = [];
  private readonly totem: Phaser.GameObjects.Container;
  private readonly totemGlow: Phaser.GameObjects.Graphics;
  private readonly geyserX: number;
  /** Piedra en la que está Rufo (−1: la orilla de salida). */
  private onStone = -1;
  /** Última piedra buena pisada (−1: la orilla). */
  private lastGood = -1;
  private bouncing = false;
  private arrived = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: GeyserChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, ARRIVE, hooks);
    this.lakeLeft = data.x;
    this.lakeW = GEYSER_LAKE * TILE;
    this.geyserX = this.lakeLeft + this.lakeW + TILE * 1.2;

    this.drawLava();
    challenge.stones.forEach((s, i) => this.stones.push(this.addStone(s, i)));
    const totem = this.drawTotem(this.lakeLeft + GEYSER_TOTEM_X * TILE);
    this.totem = totem.container;
    this.totemGlow = totem.glow;
    this.drawGeyser();
  }

  /** La lava entre las piedras (y la de las piedras hundidas del todo) hace rebotar. */
  override holes(): WorldSpike[] {
    const half = (GEYSER_STONE_W * TILE) / 2;
    const solid = this.stones.filter((s) => !s.sunk).map((s) => ({ from: s.x - half, to: s.x + half }));
    const out: WorldSpike[] = [];
    let from = this.lakeLeft;
    for (const s of solid) {
      if (s.from > from) out.push({ index: -1, x: from, width: s.from - from });
      from = s.to;
    }
    if (this.lakeLeft + this.lakeW > from) out.push({ index: -1, x: from, width: this.lakeLeft + this.lakeW - from });
    return out;
  }

  override update(foxX: number): void {
    super.update(foxX);
    const body = this.fox.body;
    const grounded = body.blocked.down || body.touching.down;
    if (!grounded || this.bouncing) return;
    // De vuelta en la orilla de salida.
    if (foxX < this.lakeLeft) {
      this.onStone = -1;
      this.lastGood = -1;
    }
    if (!this.arrived && foxX > this.lakeLeft + this.lakeW && Math.abs(body.bottom - GROUND_TOP) <= 3) this.arrive();
  }

  // --- Dibujo ----------------------------------------------------------------------------------

  private drawLava(): void {
    const g = this.scene.add.graphics().setDepth(DEPTH - 1);
    const x = this.lakeLeft;
    const w = this.lakeW;
    g.fillStyle(LAVA_DARK).fillRect(x, GROUND_TOP + 26, w, 720 - GROUND_TOP);
    g.fillStyle(LAVA).fillRect(x, GROUND_TOP + 18, w, 40);
    g.fillStyle(LAVA_LIGHT);
    for (let bx = x + 30; bx < x + w - 30; bx += 76) g.fillRoundedRect(bx, GROUND_TOP + 30 + ((bx / 76) % 2) * 14, 34, 7, 3);
    for (const px of [x, x + w]) {
      g.fillStyle(BASALT).fillRoundedRect(px - 12, GROUND_TOP - 4, 24, 120, 8);
      g.fillStyle(BASALT_LIGHT).fillRoundedRect(px - 12, GROUND_TOP - 4, 24, 10, 5);
    }
    // Resplandor que late despacio sobre la lava.
    const glow = this.scene.add.rectangle(x + w / 2, GROUND_TOP + 10, w, 26, LAVA_LIGHT, 0.25).setDepth(DEPTH - 1);
    this.scene.tweens.add({ targets: glow, alpha: 0.08, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  /** Piedra de basalto con la cara de arriba a ras del suelo y su grabado en la cara de delante. */
  private addStone(stone: GeyserStone, i: number): StoneView {
    const x = this.lakeLeft + geyserStoneX(i) * TILE;
    const w = GEYSER_STONE_W * TILE;
    const g = this.scene.add.graphics();
    g.fillStyle(STONE.dark).fillRoundedRect(-STELE_W / 2, -STELE_H, STELE_W, STELE_H, { tl: 16, tr: 16, bl: 0, br: 0 });
    g.fillStyle(STONE.base).fillRoundedRect(-STELE_W / 2 + 4, -STELE_H + 4, STELE_W - 8, STELE_H - 4, { tl: 13, tr: 13, bl: 0, br: 0 });
    g.fillStyle(BASALT).fillRoundedRect(-w / 2, -4, w, STONE_H, 14);
    g.fillStyle(BASALT_LIGHT).fillRoundedRect(-w / 2, -4, w, 14, { tl: 14, tr: 14, bl: 0, br: 0 });
    g.fillStyle(LAVA, 0.35).fillRoundedRect(-w / 2, STONE_H - 30, w, 26, { tl: 0, tr: 0, bl: 14, br: 14 });
    // El grabado va en una estela al fondo de la piedra, a la vista sobre el suelo (Rufo pasa por delante).
    const glyph = drawGlyph(this.scene, { shape: stone.shape, color: stone.color, count: 1 }, GLYPH_SIZE[stone.size]);
    glyph.container.setPosition(0, -STELE_H / 2 - 2);
    const container = this.scene.add.container(x, GROUND_TOP, [g, glyph.container]).setDepth(DEPTH);
    const zone = this.scene.add.zone(x, GROUND_TOP + 20, w, 40);
    this.scene.physics.add.existing(zone, true);
    this.scene.physics.add.collider(this.fox, zone, () => {
      if (this.fox.body.touching.down) this.land(i);
    });
    return { data: stone, x, container, glyph, zone, sunk: false };
  }

  /** Tótem: pilar de piedra con la forma tallada arriba; con color para los mayores, en piedra clara si no. */
  private drawTotem(x: number): { container: Phaser.GameObjects.Container; glow: Phaser.GameObjects.Graphics } {
    const { shape, color } = this.challenge.totem;
    const g = this.scene.add.graphics();
    g.fillStyle(STONE.dark).fillRoundedRect(-44, -TOTEM_H + 6, 88, TOTEM_H, 16);
    g.fillStyle(STONE.base).fillRoundedRect(-44, -TOTEM_H, 88, TOTEM_H - 6, 16);
    g.fillStyle(STONE.light).fillRoundedRect(-44, -TOTEM_H, 88, 12, { tl: 16, tr: 16, bl: 0, br: 0 });
    g.fillStyle(GOLD).fillRect(-44, -TOTEM_H + 104, 88, 8);
    for (let y = -TOTEM_H + 140; y < -20; y += 40) g.fillStyle(STONE.dark).fillRect(-30, y, 60, 5);
    const glow = this.scene.add.graphics();
    glow.fillStyle(GLOW, 0.5).fillCircle(0, -TOTEM_H + 52, 50);
    glow.setAlpha(0);
    const carving = this.scene.add.graphics();
    carving.fillStyle(STONE.groove);
    carving.save();
    carving.translateCanvas(0, -TOTEM_H + 55);
    fillShape(carving, shape, 68);
    carving.restore();
    carving.fillStyle(color ? GLYPH_HEX[color] : CARVED);
    carving.save();
    carving.translateCanvas(0, -TOTEM_H + 52);
    fillShape(carving, shape, 64);
    carving.restore();
    const container = this.scene.add.container(x, GROUND_TOP, [g, glow, carving]).setDepth(DEPTH - 1);
    return { container, glow };
  }

  /** Géiser en la otra orilla: un cono de roca con la boca humeando un poco. */
  private drawGeyser(): void {
    const g = this.scene.add.graphics().setDepth(DEPTH - 1);
    const x = this.geyserX;
    g.fillStyle(BASALT).fillTriangle(x - 70, GROUND_TOP + 2, x + 70, GROUND_TOP + 2, x, GROUND_TOP - 70);
    g.fillStyle(BASALT_LIGHT).fillTriangle(x - 30, GROUND_TOP - 40, x + 30, GROUND_TOP - 40, x, GROUND_TOP - 70);
    g.fillStyle(0x1f1b24).fillEllipse(x, GROUND_TOP - 58, 34, 12);
    const wisp = this.scene.add.ellipse(x, GROUND_TOP - 70, 30, 20, STEAM, 0.4).setDepth(DEPTH - 1);
    this.scene.tweens.add({ targets: wisp, y: GROUND_TOP - 150, scale: 2, alpha: 0, duration: 2200, repeat: -1 });
  }

  // --- Pisar piedras ---------------------------------------------------------------------------

  private land(i: number): void {
    if (this.bouncing || i === this.onStone) return;
    const stone = this.stones[i];
    if (!stone || stone.sunk) return;
    this.onStone = i;
    if (stone.data.good) {
      this.lastGood = i;
      audio.sfx('glyph', { index: i % 5 });
      lightGlyph(this.scene, stone.glyph);
      return;
    }
    this.stepOnBad(stone);
  }

  /**
   * Piedra mala: se hunde despacio con un siseo y Rufo vuelve con un saltito a la piedra buena anterior
   * (o a la orilla). Cuenta como fallo; el tercero lo resuelve Lalo.
   */
  private stepOnBad(stone: StoneView): void {
    this.bouncing = true;
    const event = this.run.solved ? 'ignored' : hitBlock(this.run, STEP_ON_BAD);
    audio.sfx('hiss');
    this.hooks.hold(true);
    const body = this.fox.body;
    body.setAllowGravity(false);
    this.fox.setVelocity(0, 0);
    this.scene.tweens.add({ targets: stone.container, y: GROUND_TOP + SINK, duration: SINK_MS, ease: 'Sine.easeIn' });

    const fromX = this.fox.x;
    const fromY = this.fox.y;
    const toX = this.lastGood >= 0 ? this.stones[this.lastGood]!.x : this.lakeLeft - TILE * 0.6;
    const proxy = { t: 0 };
    this.scene.tweens.add({
      targets: proxy,
      t: 1,
      delay: 260,
      duration: HOP_MS,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        const x = Phaser.Math.Linear(fromX, toX, proxy.t);
        const y = fromY - Math.sin(Math.PI * proxy.t) * 110;
        body.reset(x, y);
      },
      onComplete: () => {
        body.setAllowGravity(true);
        this.hooks.hold(false);
        this.onStone = this.lastGood;
        this.bouncing = false;
        if (event === 'wobble') this.lightTotem();
        else if (event === 'count-up') this.glowGood();
        else if (event === 'solved-by-lalo') this.laloShowsTheWay();
        // La piedra vuelve a subir, salvo si Lalo ya ha hundido las malas.
        if (!stone.sunk) this.scene.tweens.add({ targets: stone.container, y: GROUND_TOP, delay: 300, duration: 500, ease: 'Sine.easeOut' });
      },
    });
  }

  /** Primer fallo: la forma del tótem se ilumina. */
  private lightTotem(then?: () => void): void {
    audio.sfx('glyph', { index: 2 });
    this.totemGlow.setAlpha(1);
    this.scene.tweens.add({ targets: this.totem, scale: 1.06, duration: 180, yoyo: true, repeat: 1 });
    this.scene.time.delayedCall(1200, () => {
      this.totemGlow.setAlpha(0);
      then?.();
    });
  }

  /** Segundo fallo: las piedras buenas brillan un momento, de una en una. */
  private glowGood(then?: () => void): void {
    const good = this.stones.filter((s) => s.data.good && !s.sunk);
    good.forEach((s, k) => {
      this.scene.time.delayedCall(k * 380, () => {
        audio.sfx('glyph', { index: k % 5 });
        lightGlyph(this.scene, s.glyph);
        this.scene.tweens.add({ targets: s.container, y: GROUND_TOP - 8, duration: 140, yoyo: true });
      });
    });
    this.scene.time.delayedCall(good.length * 380 + 200, () => then?.());
  }

  /** Tercer fallo: las malas se hunden del todo y Lalo vuela de piedra buena en piedra buena. */
  private laloShowsTheWay(): void {
    for (const s of this.stones.filter((st) => !st.data.good)) this.sinkForever(s);
    const good = this.stones.filter((s) => s.data.good);
    const hop = (k: number): void => {
      const s = good[k];
      if (!s) {
        this.hooks.lalo.home();
        return;
      }
      this.hooks.lalo.flyTo(s.x + 40, GROUND_TOP - 150, () => {
        lightGlyph(this.scene, s.glyph);
        audio.sfx('glyph', { index: k % 5 });
        hop(k + 1);
      });
    };
    hop(0);
  }

  private sinkForever(s: StoneView): void {
    s.sunk = true;
    (s.zone.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    audio.sfx('hiss');
    this.scene.tweens.killTweensOf(s.container);
    this.scene.tweens.add({ targets: s.container, y: GROUND_TOP + STONE_H + 10, alpha: 0.4, duration: 1400, ease: 'Sine.easeIn' });
  }

  // --- Demostración y llegada ------------------------------------------------------------------

  protected override demoTriggerX(): number {
    return this.lakeLeft - DEMO_TRIGGER_TILES * TILE;
  }

  /** Lalo va al tótem, lo ilumina y luego hace brillar las piedras buenas, de una en una. */
  protected override startDemo(): void {
    this.hooks.lalo.flyTo(this.totem.x + 70, GROUND_TOP - TOTEM_H - 40, () =>
      this.lightTotem(() => this.glowGood(() => this.hooks.lalo.home())),
    );
  }

  /** En la otra orilla: cuenta como resuelto (a la primera si no pisó ninguna mala) y sale el vapor. */
  private arrive(): void {
    this.arrived = true;
    if (!this.run.solved) hitBlock(this.run, ARRIVE);
    audio.sfx('steam');
    for (let k = 0; k < 6; k++) {
      const puff = this.scene.add.ellipse(this.geyserX, GROUND_TOP - 60, 50, 40, STEAM, 0.85).setDepth(DEPTH - 1);
      this.scene.tweens.add({ targets: puff, y: GROUND_TOP - 260 - k * 40, scaleX: 2.2, scaleY: 2.6, alpha: 0, delay: k * 120, duration: 1300, ease: 'Quad.easeOut', onComplete: () => puff.destroy() });
    }
    if (this.hooks.lalo.flying) this.hooks.lalo.home();
  }

  // Sin bloques: la escalera de fallos la llevan las piedras.
  protected hintOne(): void {}
  protected hintTwo(): void {}
  protected solve(): void {}
}
