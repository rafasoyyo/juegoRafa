/**
 * Reto «Paseo en braquiosaurio» en el nivel (`docs/MUNDO-3.md`, reto C de la isla): un braquiosaurio
 * espera metido en un río humeante y lleva en el lomo una tablilla de piedra con un emblema al que le
 * falta una pieza. Los bloques van en la orilla; al golpear el que completa el emblema, la pieza vuela a
 * su sitio, los grabados se encienden, el braquiosaurio se agacha y, cuando Rufo se sube, cruza despacio.
 * Es la barca del río con otro dibujo (misma geometría, mismo «Rufo va sujeto» mientras cruza).
 */

import Phaser from 'phaser';
import { bounds, EMBLEM_UNITS, type BrachioChallenge, type Poly } from '../../learning/challenges/brachio';
import { audio } from '../audio/audio-engine';
import { GROUND_TOP } from '../level-course';
import { BOAT_BLOCK_XS, BOAT_LAKE, BOAT_LENGTH, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { DINO_COLORS } from '../ui/quiz/island-art';
import { ChallengeView, CHALLENGE_DEPTH as DEPTH, type ChallengeHooks } from './challenge-view';
import { drawStoneBlock, GLYPH_HEX, GOLD, STONE } from './glyphs';

const WATER = 0x3f9c96;
const WATER_DARK = 0x2a6f6c;
const STEAM = 0xeef6f4;
const BANK = 0x3a3540;
const [SKIN, SKIN_DARK, SKIN_LIGHT] = DINO_COLORS.brachio;
const SKIN_BACK = 0x86b4d0;
const EYE = 0xf3b23a;
const INK = 0x2b2233;

/** Unidad del emblema en la tablilla y en los bloques, en px. */
const UNIT = 34;
const BLOCK_UNIT = 17;
const EMBLEM = EMBLEM_UNITS * UNIT;
const TABLET_PAD = 16;
const TABLET = EMBLEM + TABLET_PAD * 2;
/** La tablilla va sobre dos postes, por encima del lomo (que está a la altura del suelo). */
const TABLET_LIFT = 26;
const TABLET_X = -24;
const TABLET_Y = -TABLET_LIFT - TABLET / 2;
const PIECE_COLOR = GLYPH_HEX.turquoise;
const NEW_PIECE = GLYPH_HEX.amber;
const DIM = 0.7;
const SAIL_SPEED = 150;
const DEMO_TRIGGER_TILES = 8;
const DOT = 0xfff2a8;

type BrachioState = 'waiting' | 'filling' | 'ready' | 'sailing' | 'docked';

/** Pieza de `unit` px por unidad, con el centro de su caja en (0, 0), y el surco debajo. */
function drawPoly(scene: Phaser.Scene, poly: Poly, unit: number, color: number, groove = true): Phaser.GameObjects.Graphics {
  const b = bounds(poly);
  const pts = poly.map(([x, y]) => new Phaser.Math.Vector2((x - b.x - b.w / 2) * unit, (y - b.y - b.h / 2) * unit));
  const g = scene.add.graphics();
  if (groove) g.fillStyle(STONE.groove, 0.7).fillPoints(pts.map((p) => new Phaser.Math.Vector2(p.x, p.y + 3)), true);
  g.fillStyle(color).fillPoints(pts, true);
  return g;
}

/** ¿Está (x, y) dentro del polígono? */
function inside(poly: Poly, x: number, y: number): boolean {
  let c = false;
  poly.forEach(([x0, y0], i) => {
    const [x1, y1] = poly[(i + 1) % poly.length]!;
    if (y0 > y !== y1 > y && x < ((x1 - x0) * (y - y0)) / (y1 - y0) + x0) c = !c;
  });
  return c;
}

export class BrachioChallengeView extends ChallengeView {
  private readonly lakeLeft: number;
  private readonly lakeW: number;
  private readonly boatW: number;
  private readonly dino: Phaser.GameObjects.Container;
  private readonly neck: Phaser.GameObjects.Container;
  private readonly neckDx: number;
  private readonly deck: Phaser.GameObjects.Zone;
  private readonly glyphs: Phaser.GameObjects.Graphics[] = [];
  private readonly rim: Phaser.GameObjects.Graphics;
  private state: BrachioState = 'waiting';
  private busy = false;
  private dotting = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: BrachioChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    this.lakeLeft = data.x;
    this.lakeW = BOAT_LAKE * TILE;
    this.boatW = BOAT_LENGTH * TILE;

    // El río humeante (por detrás del braquiosaurio) y las orillas de basalto.
    const water = scene.add.graphics().setDepth(DEPTH - 2);
    water.fillStyle(WATER_DARK).fillRect(this.lakeLeft, GROUND_TOP + 30, this.lakeW, 720 - GROUND_TOP);
    water.fillStyle(WATER).fillRect(this.lakeLeft, GROUND_TOP + 22, this.lakeW, 14);
    for (const px of [this.lakeLeft, this.lakeLeft + this.lakeW]) {
      water.fillStyle(BANK).fillRoundedRect(px - 12, GROUND_TOP - 4, 24, 120, 8);
      water.fillStyle(STONE.dark).fillRoundedRect(px - 12, GROUND_TOP - 4, 24, 10, 5);
    }
    this.steam();

    this.dino = scene.add.container(this.lakeLeft + this.boatW / 2, GROUND_TOP).setDepth(DEPTH);
    this.neckDx = this.boatW / 2 - 46;
    this.neck = scene.add.container(this.dino.x + this.neckDx, GROUND_TOP + 8, [this.drawNeck()]).setDepth(DEPTH - 1);
    this.dino.add(this.drawBody());
    this.rim = scene.add.graphics();
    this.dino.add([...this.drawTablet(), this.rim]);
    this.drawRim(0.35);

    // El agua por delante: tapa las patas y la tripa (Rufo, más arriba, sigue por encima).
    const front = scene.add.graphics().setDepth(DEPTH + 1);
    front.fillStyle(WATER, 0.88).fillRect(this.lakeLeft + 12, GROUND_TOP + 58, this.lakeW - 24, 720 - GROUND_TOP);
    front.fillStyle(STEAM, 0.5);
    for (let x = this.lakeLeft + 40; x < this.lakeLeft + this.lakeW - 40; x += 90) front.fillRoundedRect(x, GROUND_TOP + 64 + ((x / 90) % 2) * 16, 34, 6, 3);

    // El lomo es firme: el zorro anda por él como por el suelo.
    this.deck = scene.add.zone(this.dino.x, GROUND_TOP + 20, this.boatW, 40);
    scene.physics.add.existing(this.deck, true);
    scene.physics.add.collider(fox, this.deck);

    this.addBlockViews(
      BOAT_BLOCK_XS.map((bx) => this.lakeLeft + bx * TILE),
      (i) => [drawStoneBlock(scene), drawPoly(scene, challenge.options[i]!, BLOCK_UNIT, NEW_PIECE)],
    );
  }

  /** El agua libre a un lado del braquiosaurio; cruzando, ninguna (Rufo va sujeto). */
  override holes(): WorldSpike[] {
    const width = this.lakeW - this.boatW;
    if (this.state === 'sailing') return [];
    if (this.state === 'docked') return [{ index: -1, x: this.lakeLeft, width }];
    return [{ index: -1, x: this.lakeLeft + this.boatW, width }];
  }

  override update(foxX: number): void {
    super.update(foxX);
    if (this.state === 'ready' && this.foxAboard()) this.sail();
  }

  /** Bocanadas de vapor que suben despacio del río. */
  private steam(): void {
    for (let i = 0; i < 4; i++) {
      const x = this.lakeLeft + this.lakeW * (0.25 + i * 0.18);
      const puff = this.scene.add.ellipse(x, GROUND_TOP + 20, 60, 34, STEAM, 0.45).setDepth(DEPTH - 2);
      this.scene.tweens.add({ targets: puff, y: GROUND_TOP - 120, scale: 1.8, alpha: 0, duration: 3200, delay: i * 800, repeat: -1 });
    }
  }

  /** Cuerpo (con la luz en el lomo y la sombra en la tripa), patas y cola. Sin contornos. */
  private drawBody(): Phaser.GameObjects.Graphics {
    const w = this.boatW;
    const g = this.scene.add.graphics();
    g.fillStyle(SKIN_DARK);
    for (const lx of [-w * 0.32, w * 0.24]) g.fillRoundedRect(lx, 30, 34, 90, 12);
    g.fillStyle(SKIN_DARK).fillTriangle(-w / 2 + 20, 4, -w / 2 + 30, 44, -w / 2 - 80, 40);
    g.fillStyle(SKIN).fillTriangle(-w / 2 + 20, 2, -w / 2 + 30, 36, -w / 2 - 78, 36);
    // El lomo sobresale un poco por detrás de Rufo, que anda por su cara de delante (a ras del suelo).
    g.fillStyle(SKIN_DARK).fillEllipse(0, 40, w + 40, 150);
    g.fillStyle(SKIN).fillEllipse(0, 32, w + 34, 142);
    g.fillStyle(SKIN_BACK).fillEllipse(-10, -22, w - 40, 34);
    g.fillStyle(SKIN_LIGHT, 0.5).fillEllipse(10, 86, w * 0.6, 20);
    // Manchas del lomo en fila.
    g.fillStyle(SKIN_DARK, 0.55);
    for (let i = 0; i < 5; i++) g.fillEllipse(-w * 0.34 + i * w * 0.15, 8, 24, 12);
    for (const lx of [-w * 0.24, w * 0.32]) {
      g.fillStyle(SKIN).fillRoundedRect(lx, 40, 36, 80, 12);
    }
    return g;
  }

  /** Cuello largo hacia arriba y a la derecha y la cabeza, que mira adelante (por detrás del cuerpo). */
  private drawNeck(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();
    const curve = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(10, -170), new Phaser.Math.Vector2(80, -230));
    const n = 26;
    for (const [color, off] of [[SKIN_DARK, 4], [SKIN, 0]] as const) {
      g.fillStyle(color);
      for (let i = 0; i <= n; i++) {
        const p = curve.getPoint(i / n);
        g.fillCircle(p.x + off, p.y + off, 36 - (i / n) * 18);
      }
    }
    g.fillStyle(SKIN_BACK);
    for (let i = 2; i <= n - 2; i++) {
      const p = curve.getPoint(i / n);
      g.fillCircle(p.x - 6, p.y, 9 - (i / n) * 4);
    }
    // Cabeza: alargada, con el hocico romo; ojo de reptil ámbar con la pupila vertical.
    g.fillStyle(SKIN_DARK).fillEllipse(108, -224, 72, 34);
    g.fillStyle(SKIN).fillEllipse(104, -230, 72, 32);
    g.fillStyle(SKIN_BACK).fillEllipse(100, -240, 44, 10);
    g.fillStyle(SKIN_DARK).fillRoundedRect(96, -222, 40, 4, 2);
    g.fillStyle(EYE).fillCircle(96, -236, 6);
    g.fillStyle(INK).fillEllipse(96, -236, 3, 9);
    g.fillStyle(SKIN_DARK).fillCircle(134, -234, 2.5);
    return g;
  }

  /** Posición, dentro del braquiosaurio, de un punto del emblema (en unidades). */
  private emblemPoint(ux: number, uy: number): { x: number; y: number } {
    return { x: TABLET_X - EMBLEM / 2 + ux * UNIT, y: TABLET_Y - EMBLEM / 2 + uy * UNIT };
  }

  /** Centro (en el braquiosaurio) de la caja del hueco. */
  private holeCenter(): { x: number; y: number } {
    const b = bounds(this.challenge.pieces[this.challenge.missing]!);
    return this.emblemPoint(b.x + b.w / 2, b.y + b.h / 2);
  }

  private world(p: { x: number; y: number }): { x: number; y: number } {
    return { x: this.dino.x + p.x, y: this.dino.y + p.y };
  }

  /** Tablilla de piedra con borde dorado sobre dos postes, con las piezas talladas y el hueco. */
  private drawTablet(): Phaser.GameObjects.GameObject[] {
    const g = this.scene.add.graphics();
    g.fillStyle(STONE.dark).fillRoundedRect(TABLET_X - 46, -TABLET_LIFT - 4, 14, TABLET_LIFT + 8, 4).fillRoundedRect(TABLET_X + 32, -TABLET_LIFT - 4, 14, TABLET_LIFT + 8, 4);
    g.fillStyle(GOLD).fillRoundedRect(TABLET_X - TABLET / 2 - 6, TABLET_Y - TABLET / 2 - 6, TABLET + 12, TABLET + 12, 22);
    g.fillStyle(STONE.base).fillRoundedRect(TABLET_X - TABLET / 2, TABLET_Y - TABLET / 2, TABLET, TABLET, 18);
    g.fillStyle(STONE.light).fillRoundedRect(TABLET_X - TABLET / 2, TABLET_Y - TABLET / 2, TABLET, 12, { tl: 18, tr: 18, bl: 0, br: 0 });
    // El hueco: el surco oscuro de la pieza que falta.
    const hole = this.challenge.pieces[this.challenge.missing]!;
    g.fillStyle(STONE.groove).fillPoints(hole.map(([x, y]) => {
      const p = this.emblemPoint(x, y);
      return new Phaser.Math.Vector2(p.x, p.y);
    }), true);
    const out: Phaser.GameObjects.GameObject[] = [g];
    this.challenge.pieces.forEach((piece, i) => {
      if (i === this.challenge.missing) return;
      const b = bounds(piece);
      const c = this.emblemPoint(b.x + b.w / 2, b.y + b.h / 2);
      const glyph = drawPoly(this.scene, piece, UNIT, PIECE_COLOR).setPosition(c.x, c.y).setAlpha(DIM);
      // Un poco más pequeña que su sitio, para que se vean las juntas entre piezas.
      glyph.setScale(0.94);
      this.glyphs.push(glyph);
      out.push(glyph);
    });
    return out;
  }

  private drawRim(alpha: number): void {
    const hole = this.challenge.pieces[this.challenge.missing]!;
    const pts = hole.map(([x, y]) => {
      const p = this.emblemPoint(x, y);
      return new Phaser.Math.Vector2(p.x, p.y);
    });
    this.rim.clear().lineStyle(4, GOLD).strokePoints(pts, true, true);
    this.rim.setAlpha(alpha);
  }

  private foxAboard(): boolean {
    const body = this.fox.body;
    const grounded = body.blocked.down || body.touching.down;
    return grounded && Math.abs(body.bottom - GROUND_TOP) <= 3 && Math.abs(this.fox.x - this.dino.x) <= this.boatW / 2 - 16;
  }

  protected override demoTriggerX(): number {
    return this.lakeLeft - DEMO_TRIGGER_TILES * TILE;
  }

  /** Lalo va a la tablilla, el hueco se llena de puntitos y luego señala el bloque bueno. */
  protected override startDemo(): void {
    const c = this.world(this.holeCenter());
    this.hooks.lalo.flyTo(c.x + 120, c.y - 90, () => this.dots(() => this.pointCorrect()));
  }

  /** Primer fallo: la pieza se posa en el hueco, sobra o falta por un lado, y vuelve a su bloque. */
  protected hintOne(block: number): void {
    const from = this.blocks[block]?.visual;
    const option = this.challenge.options[block];
    if (!from || !option || this.busy || this.run.solved) return;
    this.busy = true;
    const to = this.world(this.holeCenter());
    const piece = drawPoly(this.scene, option, BLOCK_UNIT, NEW_PIECE, false).setPosition(from.x, from.y).setDepth(DEPTH + 2).setAlpha(0.9);
    this.scene.tweens.chain({
      targets: piece,
      tweens: [
        { x: to.x, y: to.y, scale: UNIT / BLOCK_UNIT, duration: 480, ease: 'Sine.easeOut' },
        {
          angle: { from: -5, to: 5 },
          duration: 90,
          yoyo: true,
          repeat: 3,
          onStart: () => audio.sfx('nope'),
        },
        { x: from.x, y: from.y, angle: 0, scale: 1, alpha: 0.2, delay: 250, duration: 420, ease: 'Sine.easeIn' },
      ],
      onComplete: () => {
        piece.destroy();
        this.busy = false;
      },
    });
  }

  /** Segundo fallo: el hueco se llena de puntitos que dibujan la forma que falta. */
  protected hintTwo(): void {
    this.dots();
  }

  private dots(then?: () => void): void {
    if (this.dotting) return;
    this.dotting = true;
    const hole = this.challenge.pieces[this.challenge.missing]!;
    const b = bounds(hole);
    const spots: { x: number; y: number }[] = [];
    for (let uy = b.y + 0.25; uy < b.y + b.h; uy += 0.5) {
      for (let ux = b.x + 0.25; ux < b.x + b.w; ux += 0.5) if (inside(hole, ux, uy)) spots.push(this.emblemPoint(ux, uy));
    }
    // En el braquiosaurio: si echa a andar, los puntitos van con él.
    const made = spots.map((p, i) => {
      const d = this.scene.add.circle(p.x, p.y, 6, DOT).setScale(0);
      this.dino.add(d);
      this.scene.tweens.add({ targets: d, scale: 1, delay: i * 45, duration: 160, ease: 'Back.easeOut', onStart: () => i % 3 === 0 && audio.sfx('tick', { index: (i / 3) % 8 + 1 }) });
      return d;
    });
    this.drawRim(1);
    const shown = spots.length * 45 + 1100;
    this.scene.time.delayedCall(shown, () => {
      this.scene.tweens.add({ targets: made, alpha: 0, duration: 300, onComplete: () => made.forEach((d) => d.destroy()) });
      if (!this.run.solved) this.drawRim(0.35);
      this.dotting = false;
      then?.();
    });
  }

  /** Resuelto: la pieza vuela a su sitio, encaja con un golpe de piedra y el emblema se enciende. */
  protected solve(block: Phaser.GameObjects.Container): void {
    this.state = 'filling';
    const hc = this.holeCenter();
    const to = this.world(hc);
    const piece = drawPoly(this.scene, this.challenge.options[this.correct]!, BLOCK_UNIT, NEW_PIECE).setPosition(block.x, block.y).setDepth(DEPTH + 2);
    this.scene.tweens.add({
      targets: piece,
      x: to.x,
      y: to.y,
      scale: (UNIT / BLOCK_UNIT) * 0.94,
      duration: 650,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        audio.sfx('stone');
        this.scene.cameras.main.shake(120, 0.003);
        this.drawRim(1);
        this.dino.add(piece.setPosition(hc.x, hc.y).setDepth(0));
        const all = [...this.glyphs, piece];
        all.forEach((gl, i) => {
          this.scene.time.delayedCall(200 + i * 220, () => {
            gl.setAlpha(1);
            audio.sfx('glyph', { index: i });
            this.scene.tweens.add({ targets: gl, scale: gl.scale * 1.12, duration: 120, yoyo: true });
          });
        });
        this.scene.time.delayedCall(300 + all.length * 220, () => this.kneel());
      },
    });
  }

  /** El braquiosaurio se agacha y llama con un mugido grave: ya puede subir Rufo. */
  private kneel(): void {
    audio.sfx('brachio');
    this.scene.tweens.add({ targets: this.neck, angle: 18, duration: 420, yoyo: true, hold: 200, ease: 'Sine.easeInOut' });
    this.scene.tweens.add({ targets: [this.dino, this.neck], y: '+=10', duration: 420, yoyo: true, hold: 200, ease: 'Sine.easeInOut' });
    this.state = 'ready';
  }

  /** Cruza el río despacio con Rufo en el lomo, sin control, y se queda en la otra orilla. */
  private sail(): void {
    this.state = 'sailing';
    this.hooks.hold(true);
    const proxy = { x: this.dino.x };
    const to = this.lakeLeft + this.lakeW - this.boatW / 2;
    this.scene.tweens.add({
      targets: proxy,
      x: to,
      duration: ((to - proxy.x) / SAIL_SPEED) * 1000,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        const dx = proxy.x - this.dino.x;
        this.dino.x = proxy.x;
        this.neck.x = proxy.x + this.neckDx;
        // Paso lento: el cuello cabecea un poco con cada zancada.
        this.neck.setAngle(Math.sin(proxy.x / 30) * 3);
        this.deck.x = proxy.x;
        (this.deck.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
        this.hooks.carry(dx);
      },
      onComplete: () => {
        this.neck.setAngle(0);
        this.state = 'docked';
        this.hooks.hold(false);
      },
    });
  }
}
