/** «Huellas en la nieve»: cuadrícula nevada con Rufo, tira de flechas y destinos con dibujo. */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { Dir, GridCell, HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { drawFox } from '../characters';
import { fitImage } from '../round-button';
import { drawArrowStrip, SNOW, SNOW_SHADOW } from './art';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

type TracksScene = Extract<SceneData, { kind: 'tracks' }>;

const CELL = 100;
const TILE = 92;
const STEP: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

export class TracksView extends ViewBase implements QuizView {
  private scn!: TracksScene;
  private x0 = 0;
  private y0 = 0;
  private stripX = 0;
  private rufo: Phaser.GameObjects.Container | null = null;
  private prints: Phaser.GameObjects.Graphics[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  private center(c: GridCell): Point {
    return { x: this.x0 + c.col * CELL + CELL / 2, y: this.y0 + c.row * CELL + CELL / 2 };
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'tracks') throw new Error('tracks: falta la escena');
    this.scn = s;
    const cx = this.host.width / 2;
    const gcx = cx - 240;
    const gcy = 440;
    this.x0 = gcx - (s.size * CELL) / 2;
    this.y0 = gcy - (s.size * CELL) / 2;
    this.stripX = cx + 240;
    const sc = this.scene;

    const optionCells = new Set<string>();
    const slots = new Map<number, SceneSlot>();
    q.options.forEach((o) => {
      if (o.place !== 'scene') return;
      let cell: GridCell | undefined;
      if (o.visual.type === 'cell') cell = { row: o.visual.row, col: o.visual.col };
      else if (o.visual.type === 'landmark') {
        const id = o.visual.id;
        cell = s.landmarks.find((l) => l.id === id)?.cell;
      }
      if (!cell) return;
      optionCells.add(`${cell.row},${cell.col}`);
      const p = this.center(cell);
      slots.set(o.id, { x: p.x, y: p.y, w: TILE, h: TILE, radius: 18, color: SNOW, shadow: SNOW_SHADOW });
    });

    // Casillas que no se tocan: nieve lisa.
    const g = sc.add.graphics();
    for (let r = 0; r < s.size; r++) {
      for (let c = 0; c < s.size; c++) {
        if (optionCells.has(`${r},${c}`)) continue;
        const p = this.center({ row: r, col: c });
        g.fillStyle(SNOW_SHADOW).fillRoundedRect(p.x - TILE / 2, p.y - TILE / 2 + 8, TILE, TILE, 18);
        g.fillStyle(SNOW).fillRoundedRect(p.x - TILE / 2, p.y - TILE / 2, TILE, TILE, 18);
      }
    }
    this.host.layer.add(g);
    if (s.goal) {
      const p = this.center(s.goal);
      this.host.layer.add(fitImage(sc.add.image(p.x, p.y, 'strawberry'), 62));
    }

    // Rufo en la salida.
    const from = this.center(s.start);
    this.rufo = drawFox(sc, from.x, from.y + 40, 'idle', 'none', 84);
    this.host.top.add(this.rufo);

    if (s.showStrip) {
      const len = s.path.length;
      const card = sc.add.graphics();
      card.fillStyle(COLORS.white, 0.85).fillRoundedRect(this.stripX - 52, gcy - (len * 80) / 2 - 14, 104, len * 80 + 28, 26);
      const strip = drawArrowStrip(sc, s.path, 80, true).setPosition(this.stripX, gcy);
      this.host.layer.add([card, strip]);
    }

    const rowArea = s.showStrip ? undefined : { cx: this.stripX, w: 420, top: 190, bottom: 690, cell: [400, 120] as [number, number] };
    return { slots, rowArea, anchor: { x: gcx, y: this.y0 - 6 } };
  }

  /** Huella (dos óvalos) en una casilla. */
  private footprint(cell: GridCell, alpha = 0.9): Phaser.GameObjects.Graphics {
    const p = this.center(cell);
    const g = this.scene.add.graphics();
    g.fillStyle(0x7d9fb8, alpha).fillEllipse(p.x - 12, p.y + 14, 14, 22).fillEllipse(p.x + 12, p.y - 10, 14, 22);
    this.host.top.addAt(g, 0);
    this.prints.push(g);
    return g;
  }

  private next(cell: GridCell, d: Dir): GridCell {
    return { row: cell.row + STEP[d][0], col: cell.col + STEP[d][1] };
  }

  /** Un Rufo (o su fantasma) recorre `dirs` desde la salida dejando huellas. */
  private async walkPath(who: Phaser.GameObjects.Container, dirs: Dir[], printAlpha: number): Promise<void> {
    let cell = this.scn.start;
    for (const d of dirs) {
      if (!this.alive) return;
      this.footprint(cell, printAlpha);
      audio.sfx('tap');
      cell = this.next(cell, d);
      const p = this.center(cell);
      await this.tween({ targets: who, x: p.x, y: p.y + 40, duration: 340, ease: 'Sine.easeInOut' });
    }
  }

  async onCorrect(): Promise<void> {
    if (!this.rufo) return;
    await this.walkPath(this.rufo, this.scn.path, 0.9);
    if (!this.alive) return;
    await this.tween({ targets: this.rufo, y: this.rufo.y - 26, duration: 160, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
  }

  /** El Rufo transparente sigue la primera mitad de las flechas dejando huellas. */
  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    const s = this.scn;
    const from = this.center(s.start);
    const ghost = drawFox(this.scene, from.x, from.y + 40, 'idle', 'none', 84).setAlpha(0.5);
    this.host.top.add(ghost);
    const half = s.path.slice(0, Math.max(1, Math.ceil(s.path.length / 2)));
    await this.walkPath(ghost, half, 0.5);
    await this.sleep(700);
    if (!this.alive) return;
    this.scene.tweens.add({ targets: [ghost, ...this.prints], alpha: 0, duration: 350, onComplete: () => ghost.destroy() });
    await this.sleep(380);
    for (const p of this.prints) p.destroy();
    this.prints = [];
  }
}
