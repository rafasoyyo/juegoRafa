/** «De pequeño a grande»: elementos sueltos que se tocan en orden y saltan a su sitio en una fila. */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import type { HintKind, Question, Visual } from '../../../learning/quiz/types';
import { digits } from '../round-button';
import { drawDots } from '../quiz-art';
import { drawExtraVisual, drawStairs } from './art';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

const TARGET_Y = 330;
const ITEM_Y = 590;
const TARGET = 130;

export class OrderView extends ViewBase implements QuizView {
  private targets: Point[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  /** Copia de un elemento para la fila o la comparación, dentro de una caja de `box`. */
  private copy(v: Visual, box: number): Phaser.GameObjects.Container {
    if (v.type === 'digit') return this.scene.add.container(0, 0, [digits(this.scene, 0, 0, String(v.value), box * 0.62)]);
    if (v.type === 'dots') return drawDots(this.scene, v.value, box * 0.8);
    return drawExtraVisual(this.scene, v, box, box) ?? this.scene.add.container();
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'order') throw new Error('order: falta la escena');
    const cx = this.host.width / 2;
    const n = q.options.length;
    const step = Math.min(160, (this.host.usefulW - 20) / n);

    const stairs = drawStairs(this.scene, s.direction, 90).setPosition(cx, 196);
    this.host.layer.add(stairs);

    // La fila de destino: casillas vacías que se van llenando.
    const g = this.scene.add.graphics();
    this.targets = [];
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * Math.min(TARGET + 20, step);
      this.targets.push({ x, y: TARGET_Y });
      g.fillStyle(COLORS.white, 0.55).fillRoundedRect(x - TARGET / 2, TARGET_Y - TARGET / 2, TARGET, TARGET, 22);
      g.lineStyle(5, COLORS.coral, 0.7).strokeRoundedRect(x - TARGET / 2, TARGET_Y - TARGET / 2, TARGET, TARGET, 22);
    }
    this.host.layer.add(g);

    // Lo ya colocado (al recolocar la pantalla).
    [...this.host.state().used].forEach((id, k) => this.place(id, k, false));

    const slots = new Map<number, SceneSlot>();
    q.options.forEach((o, i) => slots.set(o.id, { x: cx + (i - (n - 1) / 2) * step, y: ITEM_Y, w: Math.min(140, step - 14), h: 150, radius: 26 }));
    return { slots, anchor: { x: cx, y: TARGET_Y - 50 } };
  }

  protected override afterAttach(): void {
    for (const id of this.host.state().used) this.buttons.get(id)?.face.setAlpha(0.35);
  }

  private place(id: number, k: number, animate: boolean): void {
    const opt = this.question.options.find((o) => o.id === id);
    const to = this.targets[k];
    if (!opt || !to) return;
    const c = this.copy(opt.visual, TARGET - 20);
    this.host.layer.add(c);
    const b = this.buttons.get(id);
    if (animate && b) {
      c.setPosition(b.x, b.y);
      this.scene.tweens.add({ targets: c, x: to.x, y: to.y, duration: 380, ease: 'Back.easeOut' });
    } else {
      c.setPosition(to.x, to.y);
    }
  }

  onProgress(id: number): void {
    const k = this.host.state().used.size - 1;
    this.buttons.get(id)?.face.setAlpha(0.35);
    this.place(id, k, true);
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    // El que toca y otro de los que quedan, juntos, para compararlos.
    const q = this.question;
    if (q.answer.form !== 'multi') return;
    const remaining = q.answer.targets.slice(this.host.state().used.size);
    const next = q.options[remaining[0]!];
    const other = q.options[remaining[1] ?? remaining[0]!];
    if (!next || !other) return;
    const cx = this.host.width / 2;
    const y = 462;
    const card = this.scene.add.graphics();
    card.fillStyle(COLORS.white, 0.95).fillRoundedRect(cx - 190, y - 52, 380, 104, 24);
    this.host.top.add(card);
    const a = this.copy(next.visual, 90).setPosition(cx - 90, y);
    const b = this.copy(other.visual, 90).setPosition(cx + 90, y);
    const ring = this.scene.add.circle(cx - 90, y, 54, COLORS.yellow, 0.6);
    this.host.top.add([ring, a, b]);
    this.glow(cx - 90, y, 60, 1500);
    await this.sleep(1900);
    if (!this.alive) return;
    this.scene.tweens.add({ targets: [card, ring, a, b], alpha: 0, duration: 300, onComplete: () => [card, ring, a, b].forEach((o) => o.destroy()) });
    await this.sleep(320);
  }

  showAnswer(ids: number[]): boolean {
    const start = this.host.state().used.size;
    ids.forEach((id, i) => {
      const opt = this.question.options.find((o) => o.id === id);
      const to = this.targets[start + i];
      if (!opt || !to) return;
      const c = this.copy(opt.visual, TARGET - 20).setPosition(to.x, to.y).setAlpha(0.6);
      this.host.top.add(c);
      const p = this.buttonPos(id);
      if (p) this.glow(p.x, p.y, 90, 1500);
    });
    return true;
  }
}
