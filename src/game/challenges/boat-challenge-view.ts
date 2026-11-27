/**
 * Reto «La barca de diez» en el nivel (`docs/MUNDO-2.md`, mecánica C): una barca en la orilla de un lago,
 * con los asientos en forma de marco y algunos patitos sentados. Los bloques van en el muelle; al acertar,
 * suben los patitos que faltan, suena la bocina y, cuando Rufo se sube, la barca lo lleva a la otra orilla.
 */

import Phaser from 'phaser';
import type { BoatChallenge } from '../../learning/challenges/boat';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import { GROUND_TOP } from '../level-course';
import { BOAT_BLOCK_XS, BOAT_LAKE, BOAT_LENGTH, TILE, type ChallengeData, type WorldSpike } from '../levels/types';
import { ChallengeView, CHALLENGE_DEPTH, type ChallengeHooks } from './challenge-view';
import { FRAME_BLUE } from './faces';

const WATER = 0x6fc3f0;
const WATER_DARK = 0x4da3dc;
const FOAM = 0xd9f1fd;
const HULL = 0xff6b5e;
const HULL_DARK = 0xc2463b;
const DECK = 0xc98a58;
const DECK_DARK = 0x9c6639;
const FRAME_DARK = 0x2f7fd6;
const DUCK = 0xffd23f;
const DUCK_DARK = 0xe0a800;
const BEAK = 0xf28c28;

/** Casco bajo la cubierta (que está a la altura del suelo). */
const HULL_H = 54;
/** Asientos: lado de cada casilla, separación entre los dos marcos y borde del panel. */
const CELL = 50;
const FRAME_GAP = 14;
const PANEL_PAD = 9;
/** El panel de asientos queda por encima de la cubierta, sobre dos palos. */
const PANEL_LIFT = 26;
const DUCK_SIZE = CELL * 0.78;
const DUCK_STEP_MS = 170;
const COUNT_STEP_MS = 380;
const SAIL_SPEED = 190;
const DEMO_TRIGGER_TILES = 8;

type BoatState = 'waiting' | 'filling' | 'ready' | 'sailing' | 'docked';

export class BoatChallengeView extends ChallengeView {
  private readonly lakeLeft: number;
  private readonly lakeW: number;
  private readonly boatW: number;
  private readonly boat: Phaser.GameObjects.Container;
  private readonly deck: Phaser.GameObjects.Zone;
  /** Centros de los asientos en la barca, en orden de conteo. */
  private readonly seats: { x: number; y: number; cell: Phaser.GameObjects.Graphics }[] = [];
  private panelTop = 0;
  private filled: number;
  private state: BoatState = 'waiting';
  private busy = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: BoatChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    this.lakeLeft = data.x;
    this.lakeW = BOAT_LAKE * TILE;
    this.boatW = BOAT_LENGTH * TILE;
    this.filled = challenge.seated;

    // Agua del lago, con espuma, y postes del muelle en las dos orillas.
    const water = scene.add.graphics().setDepth(CHALLENGE_DEPTH - 1);
    water.fillStyle(WATER_DARK).fillRect(this.lakeLeft, GROUND_TOP + 30, this.lakeW, 720 - GROUND_TOP);
    water.fillStyle(WATER).fillRect(this.lakeLeft, GROUND_TOP + 22, this.lakeW, 14);
    water.fillStyle(FOAM);
    for (let x = this.lakeLeft + 30; x < this.lakeLeft + this.lakeW - 30; x += 70) water.fillRoundedRect(x, GROUND_TOP + 44 + ((x / 70) % 2) * 18, 30, 6, 3);
    for (const px of [this.lakeLeft, this.lakeLeft + this.lakeW]) {
      water.fillStyle(DECK_DARK).fillRoundedRect(px - 9, GROUND_TOP - 30, 18, 110, 7);
      water.fillStyle(DECK).fillCircle(px, GROUND_TOP - 30, 11);
    }

    this.boat = scene.add.container(this.lakeLeft + this.boatW / 2, GROUND_TOP).setDepth(CHALLENGE_DEPTH);
    this.drawBoat();

    // Cubierta firme: el zorro anda por ella como por el suelo.
    this.deck = scene.add.zone(this.boat.x, GROUND_TOP + 20, this.boatW, 40);
    scene.physics.add.existing(this.deck, true);
    scene.physics.add.collider(fox, this.deck);

    this.addBlocks(
      challenge.options,
      BOAT_BLOCK_XS.map((bx) => this.lakeLeft + bx * TILE),
    );
  }

  /** El agua libre a un lado de la barca; navegando, ninguna (Rufo va sujeto). */
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

  /** Casco, cubierta y el panel de asientos (marcos de diez) con los patitos ya sentados. */
  private drawBoat(): void {
    const w = this.boatW;
    const hull = this.scene.add.graphics();
    hull.fillStyle(HULL_DARK).fillRoundedRect(-w / 2 + 14, 8, w - 28, HULL_H, { tl: 0, tr: 0, bl: 26, br: 26 });
    hull.fillStyle(HULL).fillRoundedRect(-w / 2 + 6, 0, w - 12, HULL_H - 10, { tl: 0, tr: 0, bl: 24, br: 24 });
    hull.fillStyle(COLORS.white, 0.85).fillRect(-w / 2 + 10, 16, w - 20, 6);
    hull.fillStyle(DECK_DARK).fillRoundedRect(-w / 2, -6, w, 14, 7);
    hull.fillStyle(DECK).fillRoundedRect(-w / 2, -6, w, 9, 5);

    const cap = this.challenge.capacity;
    const frames = cap === 20 ? 2 : 1;
    const rowsPerFrame = cap === 5 ? 1 : 2;
    const panelW = 5 * CELL + PANEL_PAD * 2;
    const frameH = rowsPerFrame * CELL + PANEL_PAD * 2;
    const frameTop = (f: number): number => this.panelTop + f * (frameH + FRAME_GAP);
    const bottom = -PANEL_LIFT;
    this.panelTop = bottom - frames * frameH - (frames - 1) * FRAME_GAP;
    const panel = this.scene.add.graphics();
    panel.fillStyle(DECK_DARK).fillRoundedRect(-panelW / 2 + 20, bottom - 4, 12, PANEL_LIFT, 4).fillRoundedRect(panelW / 2 - 32, bottom - 4, 12, PANEL_LIFT, 4);
    for (let f = 0; f < frames; f++) {
      panel.fillStyle(FRAME_DARK).fillRoundedRect(-panelW / 2, frameTop(f) + 4, panelW, frameH, 14);
      panel.fillStyle(FRAME_BLUE).fillRoundedRect(-panelW / 2, frameTop(f), panelW, frameH, 14);
    }
    this.boat.add([panel, hull]);

    for (let i = 0; i < cap; i++) {
      const f = Math.floor(i / 10);
      const k = i % 10;
      const x = -panelW / 2 + PANEL_PAD + CELL * ((k % 5) + 0.5);
      const y = frameTop(f) + PANEL_PAD + CELL * (Math.floor(k / 5) + 0.5);
      const cell = this.scene.add.graphics({ x, y });
      cell.fillStyle(COLORS.white).fillRoundedRect(-CELL * 0.42, -CELL * 0.42, CELL * 0.84, CELL * 0.84, CELL * 0.2);
      this.boat.add(cell);
      this.seats.push({ x, y, cell });
    }
    for (let i = 0; i < this.challenge.seated; i++) {
      const s = this.seats[i]!;
      this.boat.add(this.duck(s.x, s.y));
    }
  }

  /** Patito de frente: cuerpo, cabeza, ojo y pico. */
  private duck(x: number, y: number): Phaser.GameObjects.Container {
    const r = DUCK_SIZE / 2;
    const g = this.scene.add.graphics();
    g.fillStyle(DUCK_DARK).fillEllipse(0, r * 0.35, r * 2, r * 1.2);
    g.fillStyle(DUCK).fillEllipse(0, r * 0.25, r * 1.9, r * 1.05);
    g.fillStyle(DUCK).fillCircle(r * 0.15, -r * 0.35, r * 0.6);
    g.fillStyle(BEAK).fillTriangle(r * 0.6, -r * 0.45, r * 0.6, -r * 0.15, r * 1.05, -r * 0.3);
    g.fillStyle(COLORS.ink).fillCircle(r * 0.3, -r * 0.5, r * 0.13);
    return this.scene.add.container(x, y, [g]);
  }

  /** Posición en el mundo de un punto de la barca. */
  private world(x: number, y: number): { x: number; y: number } {
    return { x: this.boat.x + x, y: this.boat.y + y };
  }

  private foxAboard(): boolean {
    const body = this.fox.body;
    const grounded = body.blocked.down || body.touching.down;
    return grounded && Math.abs(body.bottom - GROUND_TOP) <= 3 && Math.abs(this.fox.x - this.boat.x) <= this.boatW / 2 - 16;
  }

  protected override demoTriggerX(): number {
    return this.lakeLeft - DEMO_TRIGGER_TILES * TILE;
  }

  protected override startDemo(): void {
    this.blinkEmpty(() => this.pointCorrect());
  }

  /**
   * Los patitos del bloque fallado suben a los asientos libres: si sobran, se quedan flotando encima sin
   * sitio; si faltan, parpadean los asientos que quedan vacíos. Luego vuelven al muelle.
   */
  protected hintOne(block: number): void {
    const from = this.blocks[block]?.visual;
    const n = this.challenge.options[block]?.value ?? 0;
    if (!from || this.busy || this.run.solved) return;
    this.busy = true;
    const free = this.seats.slice(this.filled);
    const extra = Math.max(0, n - free.length);
    const ducks: Phaser.GameObjects.Container[] = [];
    for (let i = 0; i < n; i++) {
      const seat = free[i];
      const to = seat ? this.world(seat.x, seat.y) : this.world((i - free.length - (extra - 1) / 2) * DUCK_SIZE * 1.1, this.panelTop - DUCK_SIZE * 0.8);
      const d = this.duck(from.x, from.y).setDepth(CHALLENGE_DEPTH + 2).setScale(0.5);
      ducks.push(d);
      this.scene.tweens.add({ targets: d, x: to.x, y: to.y, scale: 1, delay: i * DUCK_STEP_MS, duration: 320, ease: 'Quad.easeOut', onStart: () => audio.sfx('tick', { index: i + 1 }) });
    }
    const arrived = n * DUCK_STEP_MS + 340;
    this.scene.time.delayedCall(arrived, () => {
      // No caben: los de más se tambalean. No bastan: parpadean los asientos vacíos que quedan.
      ducks.slice(free.length).forEach((d) => this.wobble(d));
      const empty = free.slice(n).map((s) => s.cell);
      if (empty.length > 0) this.scene.tweens.add({ targets: empty, alpha: 0.15, duration: 160, yoyo: true, repeat: 2, onComplete: () => empty.forEach((c) => c.setAlpha(1)) });
    });
    this.scene.time.delayedCall(arrived + 1000, () => {
      ducks.forEach((d, i) => {
        this.scene.tweens.add({ targets: d, x: from.x, y: from.y, scale: 0.4, alpha: 0, delay: i * 60, duration: 360, ease: 'Quad.easeIn', onComplete: () => d.destroy() });
      });
      this.scene.time.delayedCall(ducks.length * 60 + 380, () => (this.busy = false));
    });
  }

  protected hintTwo(): void {
    this.blinkEmpty();
  }

  /** Los asientos vacíos se encienden de uno en uno con un «tic». */
  private blinkEmpty(then?: () => void): void {
    const empty = this.seats.slice(this.filled);
    empty.forEach((s, i) => {
      this.scene.time.delayedCall(i * COUNT_STEP_MS, () => {
        audio.sfx('tick', { index: i + 1 });
        this.scene.tweens.add({ targets: s.cell, scale: 1.25, alpha: 0.35, duration: 140, yoyo: true, ease: 'Quad.easeOut' });
      });
    });
    this.scene.time.delayedCall(empty.length * COUNT_STEP_MS + 200, () => then?.());
  }

  /** Suben los patitos que faltan, contándose; con el último, la bocina y la barca lista para zarpar. */
  protected solve(block: Phaser.GameObjects.Container): void {
    this.state = 'filling';
    const start = this.filled;
    const missing = this.challenge.capacity - start;
    for (let i = 0; i < missing; i++) {
      const seat = this.seats[start + i]!;
      const d = this.duck(block.x, block.y).setDepth(CHALLENGE_DEPTH + 2).setScale(0.5);
      const to = this.world(seat.x, seat.y);
      this.scene.tweens.add({
        targets: d,
        x: to.x,
        y: to.y,
        scale: 1,
        delay: 250 + i * DUCK_STEP_MS,
        duration: 320,
        ease: 'Quad.easeOut',
        onComplete: () => {
          d.destroy();
          this.boat.add(this.duck(seat.x, seat.y));
          this.filled += 1;
          audio.sfx('tick', { index: this.filled });
          if (this.filled === this.challenge.capacity) this.ready();
        },
      });
    }
  }

  private ready(): void {
    audio.sfx('horn');
    this.scene.tweens.add({ targets: this.boat, y: GROUND_TOP - 8, duration: 140, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
    this.state = 'ready';
  }

  /** La barca cruza el lago con Rufo encima, sin control, y se queda en la otra orilla. */
  private sail(): void {
    this.state = 'sailing';
    this.hooks.hold(true);
    const proxy = { x: this.boat.x };
    const to = this.lakeLeft + this.lakeW - this.boatW / 2;
    this.scene.tweens.add({
      targets: proxy,
      x: to,
      duration: ((to - proxy.x) / SAIL_SPEED) * 1000,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        const dx = proxy.x - this.boat.x;
        this.boat.x = proxy.x;
        this.boat.setAngle(Math.sin(proxy.x / 40) * 1.5);
        this.deck.x = proxy.x;
        (this.deck.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
        this.hooks.carry(dx);
      },
      onComplete: () => {
        this.boat.setAngle(0);
        this.state = 'docked';
        this.hooks.hold(false);
      },
    });
  }
}
