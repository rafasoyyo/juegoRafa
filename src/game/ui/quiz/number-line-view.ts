/**
 * «¿Dónde va?»: una tarjeta con un número y una recta con algunos a la vista; los sitios que se pueden
 * tocar llevan un «?». La pista salta por la recta desde el principio, contando, hasta el sitio.
 */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { drawDots } from '../quiz-art';
import { digits } from '../round-button';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

const LINE_Y = 470;
const CARD_Y = 250;
const CARD = 130;
const SPOT = 96;

export class NumberLineView extends ViewBase implements QuizView {
  private scn!: Extract<SceneData, { kind: 'number-line' }>;
  private x0 = 0;
  private unit = 0;
  private card?: Phaser.GameObjects.Container;
  private frog?: Phaser.GameObjects.Image;

  constructor(host: ViewHost) {
    super(host);
  }

  private xOf(v: number): number {
    return this.x0 + (v - this.scn.from) * this.unit;
  }

  draw(q: Question): DrawResult {
    this.question = q;
    this.scn = q.prompt.scene as Extract<SceneData, { kind: 'number-line' }>;
    const s = this.scn;
    const cx = this.host.width / 2;
    const w = Math.min(this.host.usefulW - 80, 900);
    this.x0 = cx - w / 2;
    this.unit = w / (s.to - s.from);

    // Tarjeta del número que hay que colocar (en «Saltos de rana», los saltos que da).
    const v = q.prompt.items[0] ?? { type: 'digit', value: s.target };
    if (s.jumps) this.drawJumps(cx, s.jumps);
    const g0 = this.scene.add.graphics();
    g0.fillStyle(COLORS.shadow).fillRoundedRect(-CARD / 2, -CARD / 2 + 8, CARD, CARD, 26);
    g0.fillStyle(COLORS.yellow).fillRoundedRect(-CARD / 2, -CARD / 2, CARD, CARD, 26);
    const face = v.type === 'dots' ? drawDots(this.scene, v.value, CARD * 0.74) : this.scene.add.container(0, 0, [digits(this.scene, 0, 0, String(v.type === 'digit' ? v.value : ''), CARD * 0.6)]);
    if (!s.jumps) {
      this.card = this.scene.add.container(cx, CARD_Y, [g0, face]);
      this.host.top.add(this.card);
    } else {
      g0.destroy();
      face.destroy();
    }

    // La recta, sus marcas y los números a la vista.
    const g = this.scene.add.graphics();
    g.lineStyle(10, COLORS.ink, 0.85).lineBetween(this.x0 - 30, LINE_Y, this.x0 + w + 30, LINE_Y);
    for (let n = s.from; n <= s.to; n += s.step) {
      const x = this.xOf(n);
      const big = s.labels.includes(n) || n === s.jumps?.start;
      g.lineStyle(big ? 8 : 6, COLORS.ink, 0.85).lineBetween(x, LINE_Y - (big ? 26 : 18), x, LINE_Y + (big ? 26 : 18));
      // Los pequeños ven puntos de dado en lugar de la cifra, como en la tarjeta.
      if (big) this.host.layer.add(v.type === 'dots' ? drawDots(this.scene, n, 60).setPosition(x, LINE_Y + 70) : digits(this.scene, x, LINE_Y + 66, String(n), 52));
    }
    this.host.layer.add(g);

    // Sitios que se pueden tocar: un círculo con «?» sobre la marca.
    const slots = new Map<number, SceneSlot>();
    for (const o of q.options) {
      if (o.visual.type !== 'digit') continue;
      const x = this.xOf(o.visual.value);
      const m = this.scene.add.graphics();
      m.fillStyle(COLORS.white).fillCircle(x, LINE_Y - 62, 34);
      m.lineStyle(5, COLORS.coral).strokeCircle(x, LINE_Y - 62, 34);
      m.lineStyle(5, COLORS.coral, 0.7).lineBetween(x, LINE_Y - 28, x, LINE_Y - 12);
      this.host.layer.add([m, digits(this.scene, x, LINE_Y - 60, '?', 42, '#FF6B5E')]);
      slots.set(o.id, { x, y: LINE_Y - 30, w: SPOT, h: 150, ghost: true });
    }
    return { slots, anchor: { x: cx, y: CARD_Y - CARD / 2 } };
  }

  /** Rana en la salida y, arriba, un arco por salto con su tamaño (los pequeños, sin número). */
  private drawJumps(cx: number, j: { start: number; size: number; count: number }): void {
    this.frog = this.scene.add.image(this.xOf(j.start), LINE_Y - 8, 'frog').setOrigin(0.5, 1);
    this.host.top.add(this.frog);
    const w = 110;
    const x0 = cx - ((j.count - 1) * w) / 2;
    const g = this.scene.add.graphics();
    g.fillStyle(COLORS.white, 0.85).fillRoundedRect(x0 - w / 2 - 10, CARD_Y - 70, j.count * w + 20, 140, 26);
    for (let i = 0; i < j.count; i++) {
      const x = x0 + i * w;
      g.lineStyle(9, COLORS.grassDark).beginPath().arc(x, CARD_Y + 34, 40, Math.PI, 0).strokePath();
      g.fillStyle(COLORS.grassDark).fillTriangle(x + 30, CARD_Y + 30, x + 52, CARD_Y + 30, x + 41, CARD_Y + 46);
      if (j.size > 1) this.host.layer.add(digits(this.scene, x, CARD_Y - 30, String(j.size), 46));
    }
    this.host.layer.addAt(g, 0);
  }

  async onCorrect(id: number): Promise<void> {
    const o = this.question.options.find((x) => x.id === id);
    if (this.frog && this.scn.jumps) {
      await this.hopFrog();
      return;
    }
    if (!this.card || o?.visual.type !== 'digit') return;
    await this.tween({ targets: this.card, x: this.xOf(o.visual.value), y: LINE_Y - 62, scale: 0.6, duration: 450, ease: 'Back.easeOut' });
    await this.sleep(300);
  }

  /** La rana da sus saltos, contándolos, hasta donde acaba. */
  private async hopFrog(): Promise<void> {
    const j = this.scn.jumps;
    const frog = this.frog;
    if (!j || !frog) return;
    frog.x = this.xOf(j.start);
    for (let i = 1; i <= j.count; i++) {
      if (!this.alive) return;
      const to = this.xOf(j.start + i * j.size);
      this.scene.tweens.add({ targets: frog, y: LINE_Y - 8 - 70, duration: 200, yoyo: true, ease: 'Quad.easeOut' });
      await this.tween({ targets: frog, x: to, duration: 400, ease: 'Linear' });
      audio.sfx('tick', { index: i });
    }
    await this.sleep(300);
  }

  async hint(kind: HintKind, ctx: HintContext): Promise<void> {
    if (this.scn.jumps) {
      await this.hopFrog();
      this.glow(this.xOf(this.scn.target), LINE_Y - 62, 44, 900);
      await this.sleep(900);
      if (this.frog) this.frog.x = this.xOf(this.scn.jumps.start);
      return;
    }
    await this.hopAlong(kind, ctx);
  }

  private async hopAlong(_kind: HintKind, _ctx: HintContext): Promise<void> {
    // Un saltito por marca desde el principio hasta el sitio del número, contando.
    const s = this.scn;
    const ball = this.scene.add.circle(this.xOf(s.from), LINE_Y - 24, 16, COLORS.coral);
    this.host.top.add(ball);
    let k = 0;
    for (let n = s.from; n <= s.target; n += s.step) {
      if (!this.alive) return;
      const p: Point = { x: this.xOf(n), y: LINE_Y - 24 };
      await this.tween({ targets: ball, x: p.x, duration: 220, ease: 'Sine.easeInOut' });
      this.scene.tweens.add({ targets: ball, y: p.y - 30, duration: 110, yoyo: true });
      audio.sfx('tick', { index: ++k });
      await this.sleep(160);
    }
    this.glow(this.xOf(s.target), LINE_Y - 62, 44, 900);
    await this.sleep(900);
    ball.destroy();
  }
}
