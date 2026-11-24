/**
 * «La otra mitad»: la mitad de un dibujo junto a una línea de espejo. Pequeños y medianos eligen la mitad
 * que falta; mayores tocan las casillas de la derecha que reflejan las pintadas de la izquierda.
 */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import type { GridCell, HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { digits } from '../round-button';
import { drawHalf, drawPaint, paintPrims, SNOW, SNOW_SHADOW } from './art';
import { halfPrims } from '../../../learning/quiz/pictures';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

type MirrorScene = Extract<SceneData, { kind: 'mirror' }>;

const HALF = 250;
const PIC_Y = 190;
const CELL = 96;
const TILE = 90;
const GRID_Y = 200;

export class MirrorView extends ViewBase implements QuizView {
  private scn!: MirrorScene;
  private cx = 0;
  private gx0 = 0;

  constructor(host: ViewHost) {
    super(host);
  }

  private cellCenter(c: GridCell): Point {
    return { x: this.gx0 + c.col * CELL + CELL / 2, y: GRID_Y + c.row * CELL + CELL / 2 };
  }

  private axis(y0: number, y1: number): void {
    const g = this.scene.add.graphics();
    g.lineStyle(5, COLORS.coral, 0.9);
    for (let y = y0; y < y1; y += 24) g.lineBetween(this.cx, y, this.cx, Math.min(y + 13, y1));
    this.host.layer.add(g);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'mirror') throw new Error('mirror: falta la escena');
    this.scn = s;
    const sc = this.scene;
    this.cx = this.host.width / 2;
    const cx = this.cx;

    if (s.mode === 'picture') {
      const card = sc.add.graphics();
      card.fillStyle(COLORS.white, 0.55).fillRoundedRect(cx - HALF - 16, PIC_Y - 14, HALF * 2 + 32, HALF + 28, 28);
      // La mitad que se ve, a la izquierda; a la derecha, un hueco con «?».
      const left = sc.add.graphics();
      const v = q.prompt.items[0];
      paintPrims(left, halfPrims(s.picture, false, v?.type === 'half' ? v.variant : 0), cx - HALF, PIC_Y, HALF);
      const hole = sc.add.graphics();
      hole.lineStyle(5, COLORS.coral, 0.8).strokeRoundedRect(cx + 8, PIC_Y + 8, HALF - 16, HALF - 16, 22);
      this.host.layer.add([card, left, hole, digits(sc, cx + HALF / 2, PIC_Y + HALF / 2, '?', 90, '#FF6B5E')]);
      this.axis(PIC_Y - 22, PIC_Y + HALF + 22);
      return { slots: new Map(), rowArea: { cx, w: this.host.usefulW, top: 500, bottom: 705, cell: [200, 190] }, anchor: { x: cx, y: PIC_Y } };
    }

    // Cuadrícula de 4×6: las casillas de la izquierda se ven y las de la derecha se tocan.
    this.gx0 = cx - (s.cols * CELL) / 2;
    const painted = new Set(s.painted.map((c) => `${c.row},${c.col}`));
    const g = sc.add.graphics();
    const slots = new Map<number, SceneSlot>();
    for (let r = 0; r < s.rows; r++) {
      for (let c = 0; c < s.cols / 2; c++) {
        const p = this.cellCenter({ row: r, col: c });
        g.fillStyle(SNOW_SHADOW).fillRoundedRect(p.x - TILE / 2, p.y - TILE / 2 + 8, TILE, TILE, 16);
        g.fillStyle(SNOW).fillRoundedRect(p.x - TILE / 2, p.y - TILE / 2, TILE, TILE, 16);
        if (painted.has(`${r},${c}`)) this.host.layer.add(drawPaint(sc, TILE * 0.82).setPosition(p.x, p.y));
      }
    }
    this.host.layer.addAt(g, 0);
    q.options.forEach((o) => {
      if (o.visual.type !== 'cell') return;
      const p = this.cellCenter({ row: o.visual.row, col: o.visual.col });
      slots.set(o.id, { x: p.x, y: p.y, w: TILE, h: TILE, radius: 16, color: SNOW, shadow: SNOW_SHADOW });
    });
    this.axis(GRID_Y - 14, GRID_Y + s.rows * CELL + 14);
    return { slots, anchor: { x: cx, y: GRID_Y } };
  }

  protected override afterAttach(): void {
    for (const id of this.host.state().used) this.paintButton(id, false);
  }

  private paintButton(id: number, animate: boolean): void {
    const b = this.buttons.get(id);
    if (!b) return;
    const mark = drawPaint(this.scene, TILE * 0.82);
    b.addContent(mark);
    if (animate) {
      mark.setScale(0.2);
      this.scene.tweens.add({ targets: mark, scale: 1, duration: 220, ease: 'Back.easeOut' });
    }
  }

  onProgress(id: number): void {
    if (this.scn.mode === 'grid') this.paintButton(id, true);
  }

  /** En los dibujos, la mitad correcta aparece en el hueco. */
  async onCorrect(): Promise<void> {
    const s = this.scn;
    if (s.mode !== 'picture') return;
    const v = this.question.prompt.items[0];
    const half = drawHalf(this.scene, s.picture, true, v?.type === 'half' ? v.variant : 0, HALF).setPosition(this.cx + HALF / 2, PIC_Y + HALF / 2).setAlpha(0);
    this.host.top.add(half);
    await this.tween({ targets: half, alpha: 1, duration: 300 });
    await this.sleep(400);
  }

  showAnswer(): boolean {
    const s = this.scn;
    if (s.mode === 'picture') {
      const half = drawHalf(this.scene, s.picture, true, 0, HALF).setPosition(this.cx + HALF / 2, PIC_Y + HALF / 2).setAlpha(0.6);
      this.host.top.add(half);
    }
    return false;
  }

  /** La mitad dibujada se dobla por la línea y queda en transparente al otro lado. */
  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    const s = this.scn;
    const sc = this.scene;
    const fold = sc.add.container(this.cx, 0);
    if (s.mode === 'picture') {
      const v = this.question.prompt.items[0];
      const g = sc.add.graphics();
      paintPrims(g, halfPrims(s.picture, false, v?.type === 'half' ? v.variant : 0), -HALF, PIC_Y, HALF, 0.7);
      fold.add(g);
    } else {
      for (const c of s.painted) {
        const p = this.cellCenter(c);
        fold.add(drawPaint(sc, TILE * 0.82).setPosition(p.x - this.cx, p.y).setAlpha(0.65));
      }
    }
    this.host.top.add(fold);
    await this.sleep(300);
    await this.tween({ targets: fold, scaleX: -1, duration: 900, ease: 'Sine.easeInOut' });
    await this.sleep(1500);
    if (!this.alive) return;
    this.scene.tweens.add({ targets: fold, alpha: 0, duration: 300, onComplete: () => fold.destroy() });
    await this.sleep(320);
  }
}
