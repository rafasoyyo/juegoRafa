/**
 * «Parejas»: arriba, la cantidad; abajo, cartas que se ven un momento y se dan la vuelta. Al tocar una se
 * destapa: si no es, se vuelve a tapar. La pista las destapa todas un instante.
 */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData, Visual } from '../../../learning/quiz/types';
import { drawObject } from '../quiz-art';
import { ViewBase, type DrawResult, type HintContext, type QuizView, type SceneSlot, type ViewHost } from './view';

const CARD_W = 128;
const CARD_H = 156;
const CARDS_Y = 560;
const PROMPT_Y = 300;
const BACK = 0x7b5ea7;
const BACK_DOTS = 0xe7defa;
const PEEK_MS = 1300;

export class MemoryView extends ViewBase implements QuizView {
  private covers = new Map<number, Phaser.GameObjects.Container>();

  constructor(host: ViewHost) {
    super(host);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene as Extract<SceneData, { kind: 'memory' }>;
    const cx = this.host.width / 2;
    this.drawQuantity(q.prompt.items[0]!, cx, PROMPT_Y);
    const n = q.options.length;
    const step = Math.min(CARD_W + 24, (this.host.usefulW - 20) / n);
    const slots = new Map<number, SceneSlot>();
    this.covers.clear();
    q.options.forEach((o, i) => slots.set(o.id, { x: cx + (i - (n - 1) / 2) * step, y: CARDS_Y, w: Math.min(CARD_W, step - 16), h: CARD_H, radius: 20 }));
    // Se ven un momento y se dan la vuelta.
    this.scene.time.delayedCall(s.showMs, () => {
      if (!this.alive) return;
      for (const o of q.options) if (!this.host.state().dimmed.has(o.id)) this.cover(o.id, true);
    });
    return { slots, anchor: { x: cx, y: PROMPT_Y - 90 } };
  }

  /** La cantidad en un marco blanco, en filas de 5. */
  private drawQuantity(v: Visual, cx: number, cy: number): void {
    if (v.type !== 'objects') return;
    const cols = Math.min(5, v.count);
    const rows = Math.ceil(v.count / 5);
    const size = rows > 2 ? 52 : 66;
    const step = size * 1.2;
    const w = cols * step + 40;
    const h = rows * step + 40;
    const g = this.scene.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(cx - w / 2, cy - h / 2 + 8, w, h, 28);
    g.fillStyle(COLORS.white).fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 28);
    g.lineStyle(6, COLORS.coral).strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 28);
    this.host.layer.add(g);
    for (let i = 0; i < v.count; i++) {
      const x = cx - ((cols - 1) * step) / 2 + (i % 5) * step;
      const y = cy - ((rows - 1) * step) / 2 + Math.floor(i / 5) * step;
      this.host.layer.add(drawObject(this.scene, v.object, size).setPosition(x, y));
    }
  }

  /** Tapa (o destapa) la carta `id` con un giro. */
  private cover(id: number, on: boolean): void {
    const b = this.buttons.get(id);
    if (!b) return;
    let c = this.covers.get(id);
    if (!c) {
      const g = this.scene.add.graphics();
      const w = b.btnWidth;
      const h = b.btnHeight;
      g.fillStyle(BACK).fillRoundedRect(-w / 2, -h / 2, w, h, 20);
      g.fillStyle(BACK_DOTS, 0.55);
      for (let y = -h / 2 + 22; y < h / 2 - 10; y += 28) for (let x = -w / 2 + 22; x < w / 2 - 10; x += 28) g.fillCircle(x, y, 5);
      c = this.scene.add.container(b.x, b.y, [g]).setScale(0, 1);
      this.host.top.add(c);
      this.covers.set(id, c);
    }
    this.scene.tweens.add({ targets: c, scaleX: on ? 1 : 0, duration: 180, ease: 'Sine.easeInOut' });
  }

  onWrong(id: number): boolean {
    // Se destapa, se ve que no es y se vuelve a tapar.
    this.cover(id, false);
    this.scene.time.delayedCall(900, () => this.alive && this.cover(id, true));
    return false;
  }

  async onCorrect(id: number): Promise<void> {
    this.cover(id, false);
    await this.sleep(500);
  }

  async hint(_kind: HintKind, ctx: HintContext): Promise<void> {
    const ids = ctx.question.options.map((o) => o.id);
    for (const id of ids) this.cover(id, false);
    await this.sleep(PEEK_MS);
    if (!this.alive) return;
    for (const id of ids) this.cover(id, true);
    await this.sleep(250);
  }

  showAnswer(ids: number[]): boolean {
    for (const id of ids) this.cover(id, false);
    return false;
  }
}
