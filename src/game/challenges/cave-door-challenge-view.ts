/**
 * Reto «La puerta de la cueva» en el nivel (`docs/MUNDO-3.md`, reto B de la isla): una losa de piedra tapa
 * la entrada de un templo excavado en la roca y tiene un hueco con una forma. Tres bloques de piedra con
 * una forma cada uno; al golpear el que encaja, la pieza vuela al hueco girando hasta encajar con un
 * golpe de piedra, el borde del hueco se ilumina y el triceratops arrastra la losa a un lado. Es la
 * compuerta de los bloques que cuentan con otro dibujo (misma geometría).
 */

import Phaser from 'phaser';
import type { CaveDoorChallenge, DoorShape } from '../../learning/challenges/cave-door';
import { audio } from '../audio/audio-engine';
import { BLOCK_SIZE, GROUND_TOP } from '../level-course';
import { CHALLENGE_BLOCK_XS, CHALLENGE_GATE_X, TILE, type ChallengeData } from '../levels/types';
import { bakePiece } from '../ui/bake';
import { shapePoints } from '../ui/quiz-art';
import { drawDino, piecePoints } from '../ui/quiz/island-art';
import { ChallengeView, CHALLENGE_DEPTH as DEPTH, type ChallengeHooks } from './challenge-view';
import { drawStoneBlock, GLYPH_HEX, GOLD, STONE } from './glyphs';

/** Losa: más alta que lo que llega un salto desde encima de un bloque (como la compuerta). */
export const DOOR_H = 450;
const DOOR_W = 170;
/** Centro del hueco, a la altura de los ojos de Rufo cuando salta. */
const HOLE_Y = GROUND_TOP - 300;
const HOLE = 112;
const ROCK = 0x8a7f73;
const ROCK_DARK = 0x6a6058;
const CAVE = 0x2a2230;
const PIECE = GLYPH_HEX.amber;
/** Galletas que caen al abrirse la puerta. */
export const DOOR_COOKIES = 3;
const TRICI = 190;
const DEMO_TRIGGER_TILES = 8;
const TRACE_MS = 1100;

/** Contorno de una forma o pieza de lado `size`, centrado en (0, 0) y sin girar. */
function outline(d: DoorShape, size: number): Phaser.Math.Vector2[] {
  if (d.type === 'piece') return piecePoints(d.piece, 0, d.mirrored, size);
  return shapePoints(d.shape, size) ?? Array.from({ length: 28 }, (_, i) => new Phaser.Math.Vector2(Math.cos((i * Math.PI) / 14) * size * 0.5, Math.sin((i * Math.PI) / 14) * size * 0.5));
}

/** Pieza de piedra ámbar (la del bloque, que luego vuela), centrada en (0, 0). Horneada. */
function drawPiece(scene: Phaser.Scene, d: DoorShape, size: number): Phaser.GameObjects.Image {
  const pts = outline(d, size);
  const g = scene.add.graphics();
  g.fillStyle(STONE.groove, 0.6).fillPoints(pts.map((p) => new Phaser.Math.Vector2(p.x, p.y + 4)), true);
  g.fillStyle(PIECE).fillPoints(pts, true);
  // Holgado: las piezas caben en su lado `size` y el surco baja 4 px.
  return bakePiece(scene, g, { x: -size * 0.75, y: -size * 0.75, width: size * 1.5, height: size * 1.5 + 4 });
}

export class CaveDoorChallengeView extends ChallengeView {
  private readonly slab: Phaser.GameObjects.Container;
  private readonly rim: Phaser.GameObjects.Image;
  private readonly trici: Phaser.GameObjects.Container;
  private readonly gate: Phaser.GameObjects.Zone;
  private readonly gx: number;
  private readonly holePts: Phaser.Math.Vector2[];
  private tracing = false;

  constructor(
    scene: Phaser.Scene,
    fox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    data: ChallengeData & { index: number },
    private readonly challenge: CaveDoorChallenge,
    hooks: ChallengeHooks,
  ) {
    super(scene, fox, data.demo, challenge.correct, hooks);
    const x = data.x;
    this.gx = x + CHALLENGE_GATE_X * TILE;
    const gx = this.gx;
    const top = GROUND_TOP - DOOR_H;

    // Fachada del templo: la roca con la boca oscura detrás de la losa (por detrás de Rufo).
    const facade = scene.add.graphics().setDepth(DEPTH - 2);
    facade.fillStyle(ROCK_DARK).fillRoundedRect(gx - DOOR_W / 2 - 70, top - 70, DOOR_W + 140, DOOR_H + 70, { tl: 90, tr: 90, bl: 0, br: 0 });
    facade.fillStyle(ROCK).fillRoundedRect(gx - DOOR_W / 2 - 60, top - 60, DOOR_W + 120, DOOR_H + 60, { tl: 80, tr: 80, bl: 0, br: 0 });
    facade.fillStyle(CAVE).fillRoundedRect(gx - DOOR_W / 2 - 6, top - 10, DOOR_W + 12, DOOR_H + 10, { tl: 60, tr: 60, bl: 0, br: 0 });
    facade.fillStyle(GOLD).fillRect(gx - 40, top - 48, 80, 10);
    bakePiece(scene, facade, { x: gx - DOOR_W / 2 - 70, y: top - 70, width: DOOR_W + 140, height: DOOR_H + 70 });

    // La losa con el hueco tallado y su borde (que se ilumina).
    const hole = challenge.hole;
    this.holePts = outline(hole, HOLE).map((p) => p.clone().rotate(Phaser.Math.DegToRad(hole.angle)));
    const slab = scene.add.graphics();
    slab.fillStyle(STONE.dark).fillRoundedRect(-DOOR_W / 2, -DOOR_H + 6, DOOR_W, DOOR_H, 18);
    slab.fillStyle(STONE.base).fillRoundedRect(-DOOR_W / 2, -DOOR_H, DOOR_W, DOOR_H - 6, 18);
    slab.fillStyle(STONE.light).fillRoundedRect(-DOOR_W / 2, -DOOR_H, DOOR_W, 16, { tl: 18, tr: 18, bl: 0, br: 0 });
    slab.fillStyle(STONE.dark);
    for (let y = -DOOR_H + 90; y < -30; y += 110) slab.fillRect(-DOOR_W / 2 + 10, y, DOOR_W - 20, 5);
    const hy = HOLE_Y - GROUND_TOP;
    slab.fillStyle(STONE.light).fillCircle(0, hy, HOLE * 0.72);
    slab.fillStyle(STONE.groove).fillPoints(this.holePts.map((p) => new Phaser.Math.Vector2(p.x, p.y + hy)), true);
    const slabImg = bakePiece(scene, slab, { x: -DOOR_W / 2, y: -DOOR_H, width: DOOR_W, height: DOOR_H + 6 });
    const rim = scene.add.graphics();
    rim.lineStyle(6, GOLD).strokePoints(this.holePts.map((p) => new Phaser.Math.Vector2(p.x, p.y + hy)), true, true);
    // Holgado: el hueco gira dentro de un círculo de lado `HOLE` (más el grosor del borde).
    this.rim = bakePiece(scene, rim, { x: -HOLE, y: hy - HOLE, width: HOLE * 2, height: HOLE * 2 }).setAlpha(0.35);
    this.slab = scene.add.container(gx, GROUND_TOP, [slabImg, this.rim]).setDepth(DEPTH);

    // El triceratops, al otro lado, mirando a la losa.
    const trici = drawDino(scene, 'trici', false, true, TRICI);
    const body = trici.list[0];
    if (body instanceof Phaser.GameObjects.Graphics) bakePiece(scene, body, { x: -TRICI * 0.75, y: -TRICI * 0.75, width: TRICI * 1.5, height: TRICI * 1.5 });
    this.trici = scene.add.container(gx + DOOR_W / 2 + TRICI * 0.38, GROUND_TOP - TRICI * 0.42, [trici]).setDepth(DEPTH - 1);

    this.addBlockViews(
      CHALLENGE_BLOCK_XS.map((bx) => x + bx * TILE),
      (i) => [drawStoneBlock(scene), drawPiece(scene, challenge.options[i]!, BLOCK_SIZE * 0.6)],
    );

    this.gate = scene.add.zone(gx, top + DOOR_H / 2, DOOR_W, DOOR_H);
    scene.physics.add.existing(this.gate, true);
    scene.physics.add.collider(fox, this.gate);
  }

  protected override demoTriggerX(): number {
    return this.gx - DEMO_TRIGGER_TILES * TILE;
  }

  /** Lalo va al hueco, recorre su borde y señala el bloque bueno hasta que el niño lo golpee. */
  protected override startDemo(): void {
    this.hooks.lalo.flyTo(this.gx + HOLE * 0.8, HOLE_Y - HOLE * 0.8, () => this.trace(() => this.pointCorrect()));
  }

  /** Primer fallo: la pieza del bloque vuela al hueco, no cabe, rebota con un golpe sordo y vuelve. */
  protected hintOne(block: number): void {
    const from = this.blocks[block]!.visual;
    const piece = drawPiece(this.scene, this.challenge.options[block]!, BLOCK_SIZE * 0.6).setPosition(from.x, from.y).setDepth(DEPTH + 2);
    this.scene.tweens.chain({
      targets: piece,
      tweens: [
        { x: this.gx - 14, y: HOLE_Y, angle: this.challenge.hole.angle, scale: HOLE / (BLOCK_SIZE * 0.6), duration: 420, ease: 'Sine.easeOut' },
        {
          x: this.gx - 60,
          duration: 120,
          ease: 'Quad.easeOut',
          onStart: () => {
            audio.sfx('nope');
            this.scene.cameras.main.shake(90, 0.002);
          },
        },
        { x: from.x, y: from.y, angle: 0, scale: 1, alpha: 0.2, duration: 420, ease: 'Sine.easeIn' },
      ],
      onComplete: () => piece.destroy(),
    });
  }

  /** Segundo fallo: un brillo recorre el borde del hueco, esquina a esquina. */
  protected hintTwo(): void {
    this.trace();
  }

  private trace(then?: () => void): void {
    if (this.tracing) return;
    this.tracing = true;
    const pts = [...this.holePts, this.holePts[0]!].map((p) => new Phaser.Math.Vector2(this.gx + p.x, HOLE_Y + p.y));
    const spark = this.scene.add.circle(pts[0]!.x, pts[0]!.y, 11, 0xfff2a8).setDepth(DEPTH + 2);
    this.rim.setAlpha(1);
    const step = TRACE_MS / (pts.length - 1);
    this.scene.tweens.chain({
      targets: spark,
      tweens: pts.slice(1).map((p, i) => ({
        x: p.x,
        y: p.y,
        duration: step,
        onComplete: () => {
          // Una nota en cada esquina de verdad (no en cada punto de una curva).
          if (pts.length < 14 || i % 7 === 0) audio.sfx('tick', { index: (i % 5) + 1 });
        },
      })),
      onComplete: () => {
        spark.destroy();
        if (!this.run.solved) this.rim.setAlpha(0.35);
        this.tracing = false;
        then?.();
      },
    });
  }

  override cookieReward(): number {
    return DOOR_COOKIES;
  }

  /** Resuelto: la pieza vuela y gira hasta encajar, el borde se ilumina y el triceratops aparta la losa. */
  protected solve(block: Phaser.GameObjects.Container): void {
    const piece = drawPiece(this.scene, this.challenge.options[this.correct]!, BLOCK_SIZE * 0.6).setPosition(block.x, block.y).setDepth(DEPTH + 2);
    this.scene.tweens.add({
      targets: piece,
      x: this.gx,
      y: HOLE_Y,
      angle: this.challenge.hole.angle,
      scale: HOLE / (BLOCK_SIZE * 0.6),
      duration: 650,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        audio.sfx('stone');
        this.scene.cameras.main.shake(140, 0.004);
        this.rim.setAlpha(1);
        this.slab.add(piece.setPosition(0, HOLE_Y - GROUND_TOP));
        this.scene.time.delayedCall(450, () => this.pushAside());
      },
    });
  }

  /** El triceratops agacha la cabeza, empuja y la losa se desliza a un lado, detrás de él. */
  private pushAside(): void {
    (this.gate.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    audio.sfx('gate');
    this.slab.setDepth(DEPTH - 1);
    this.trici.setDepth(DEPTH);
    this.scene.tweens.add({ targets: this.trici, angle: 8, duration: 200, yoyo: true, repeat: 1 });
    this.scene.tweens.add({ targets: [this.slab, this.trici], x: `+=${DOOR_W + 40}`, duration: 1100, delay: 250, ease: 'Sine.easeInOut' });
    this.hooks.reward(DOOR_COOKIES, this.gx, GROUND_TOP - 280);
  }
}
