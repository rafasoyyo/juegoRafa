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

    // Tarjeta del número que hay que colocar.
    const v = q.prompt.items[0]!;
    const g0 = this.scene.add.graphics();
    g0.fillStyle(COLORS.shadow).fillRoundedRect(-CARD / 2, -CARD / 2 + 8, CARD, CARD, 26);
    g0.fillStyle(COLORS.yellow).fillRoundedRect(-CARD / 2, -CARD / 2, CARD, CARD, 26);
    const face = v.type === 'dots' ? drawDots(this.scene, v.value, CARD * 0.74) : this.scene.add.container(0, 0, [digits(this.scene, 0, 0, String(v.type === 'digit' ? v.value : ''), CARD * 0.6)]);
    this.card = this.scene.add.container(cx, CARD_Y, [g0, face]);
    this.host.top.add(this.card);

    // La recta, sus marcas y los números a la vista.
    const g = this.scene.add.graphics();
    g.lineStyle(10, COLORS.ink, 0.85).lineBetween(this.x0 - 30, LINE_Y, this.x0 + w + 30, LINE_Y);
    for (let n = s.from; n <= s.to; n += s.step) {
      const x = this.xOf(n);
      const big = s.labels.includes(n);
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

  async onCorrect(id: number): Promise<void> {
    const o = this.question.options.find((x) => x.id === id);
    if (!this.card || o?.visual.type !== 'digit') return;
    await this.tween({ targets: this.card, x: this.xOf(o.visual.value), y: LINE_Y - 62, scale: 0.6, duration: 450, ease: 'Back.easeOut' });
    await this.sleep(300);
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
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
