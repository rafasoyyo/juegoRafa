/** «El marco de diez»: un marco de 5 o de 10 con fichas; en «¿cuántas faltan?» las casillas vacías llaman la atención. */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { drawDots } from '../quiz-art';
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
    const frames = s.cells === 20 ? 2 : 1;
    const rows = s.cells === 5 ? 1 : 2;
    const cell = frames === 2 ? 62 : CELL;
    const gap = 18;
    const w = cell * 5 + 24;
    const fh = cell * rows + 24;
    const totalH = frames * fh + (frames - 1) * gap;
    // Con la meta a la vista («los amigos del 10»), el marco se corre a la derecha para dejarle sitio.
    const cx = this.host.width / 2 + (s.whole ? 90 : 0);
    const g = this.scene.add.graphics();
    this.host.layer.add(g);
    const filled: Point[] = [];
    const empty: Point[] = [];
    this.empties = [];
    for (let f = 0; f < frames; f++) {
      const top = FRAME_Y - totalH / 2 + f * (fh + gap);
      g.fillStyle(FRAME_DARK).fillRoundedRect(cx - w / 2, top + 6, w, fh, 22);
      g.fillStyle(FRAME).fillRoundedRect(cx - w / 2, top, w, fh, 22);
      for (let k = 0; k < Math.min(10, s.cells); k++) {
        const i = f * 10 + k;
        const x = cx - (cell * 5) / 2 + cell * ((k % 5) + 0.5);
        const y = top + 12 + cell * (Math.floor(k / 5) + 0.5);
        const c = this.scene.add.graphics({ x, y });
        c.fillStyle(COLORS.white).fillRoundedRect(-cell * 0.42, -cell * 0.42, cell * 0.84, cell * 0.84, 14);
        this.host.layer.add(c);
        if (i < s.filled) {
          this.host.layer.add(this.scene.add.circle(x, y, cell * 0.32, COLORS.coral));
          filled.push({ x, y });
        } else {
          empty.push({ x, y });
          if (s.ask === 'missing') {
            c.lineStyle(4, COLORS.coral, 0.8).strokeRoundedRect(-cell * 0.34, -cell * 0.34, cell * 0.68, cell * 0.68, 12);
            this.host.layer.add(digits(this.scene, x, y, '?', cell * 0.42, '#FF6B5E').setAlpha(0.7));
            this.empties.push(c);
          }
        }
      }
    }
    if (s.whole) {
      // La meta: una tarjeta amarilla con el total (con puntos para los pequeños) y una flecha al marco.
      const kx = cx - w / 2 - 120;
      const card = this.scene.add.graphics();
      card.fillStyle(COLORS.shadow).fillRoundedRect(kx - 70, FRAME_Y - 62, 140, 132, 26);
      card.fillStyle(COLORS.yellow).fillRoundedRect(kx - 70, FRAME_Y - 70, 140, 132, 26);
      card.fillStyle(COLORS.coral).fillTriangle(kx + 84, FRAME_Y - 18, kx + 84, FRAME_Y + 14, kx + 104, FRAME_Y - 2);
      const total = s.cells === 5 ? drawDots(this.scene, 5, 96).setPosition(kx, FRAME_Y - 4) : digits(this.scene, kx, FRAME_Y - 2, String(s.cells), 78);
      this.host.layer.add([card, total]);
    }
    this.counted = s.ask === 'missing' ? empty : filled;
    return { slots: new Map(), rowArea: { cx: this.host.width / 2, w: this.host.usefulW, top: 500, bottom: 700, cell: [150, 150] }, anchor: { x: cx, y: FRAME_Y - totalH / 2 } };
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    for (const [i, p] of this.counted.entries()) {
      if (!this.alive) return;
      audio.sfx('tick', { index: i + 1 });
      this.glow(p.x, p.y, 30, 900);
      await this.sleep(360);
    }
    await this.sleep(500);
  }
}
