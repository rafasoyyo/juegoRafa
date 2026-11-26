/** «El marco de diez»: un marco de 5 o de 10 con fichas; en «¿cuántas faltan?» las casillas vacías llaman la atención. */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { digits } from '../round-button';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type ViewHost } from './view';

const FRAME_Y = 320;
const CELL = 86;
const FRAME = 0x4da3ff;
const FRAME_DARK = 0x2f7fd6;

export class TenFrameView extends ViewBase implements QuizView {
  private counted: Point[] = [];
  private empties: Phaser.GameObjects.Graphics[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene as Extract<SceneData, { kind: 'ten-frame' }>;
    const cx = this.host.width / 2;
    const rows = s.cells === 5 ? 1 : 2;
    const w = CELL * 5 + 24;
    const h = CELL * rows + 24;
    const g = this.scene.add.graphics();
    g.fillStyle(FRAME_DARK).fillRoundedRect(cx - w / 2, FRAME_Y - h / 2 + 6, w, h, 22);
    g.fillStyle(FRAME).fillRoundedRect(cx - w / 2, FRAME_Y - h / 2, w, h, 22);
    this.host.layer.add(g);
    const filled: Point[] = [];
    const empty: Point[] = [];
    this.empties = [];
    for (let i = 0; i < s.cells; i++) {
      const x = cx - (CELL * 5) / 2 + CELL * ((i % 5) + 0.5);
      const y = FRAME_Y - (CELL * rows) / 2 + CELL * (Math.floor(i / 5) + 0.5);
      const cell = this.scene.add.graphics({ x, y });
      cell.fillStyle(COLORS.white).fillRoundedRect(-CELL * 0.42, -CELL * 0.42, CELL * 0.84, CELL * 0.84, 16);
      this.host.layer.add(cell);
      if (i < s.filled) {
        this.host.layer.add(this.scene.add.circle(x, y, CELL * 0.32, COLORS.coral));
        filled.push({ x, y });
      } else {
        empty.push({ x, y });
        if (s.ask === 'missing') {
          cell.lineStyle(4, COLORS.coral, 0.8).strokeRoundedRect(-CELL * 0.34, -CELL * 0.34, CELL * 0.68, CELL * 0.68, 12);
          this.host.layer.add(digits(this.scene, x, y, '?', CELL * 0.42, '#FF6B5E').setAlpha(0.7));
          this.empties.push(cell);
        }
      }
    }
    this.counted = s.ask === 'missing' ? empty : filled;
    return { slots: new Map(), rowArea: { cx, w: this.host.usefulW, top: 500, bottom: 700, cell: [150, 150] }, anchor: { x: cx, y: FRAME_Y - h / 2 } };
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    for (const [i, p] of this.counted.entries()) {
      if (!this.alive) return;
      audio.sfx('tick', { index: i + 1 });
      this.glow(p.x, p.y, CELL * 0.4, 900);
      await this.sleep(360);
    }
    await this.sleep(500);
  }
}
