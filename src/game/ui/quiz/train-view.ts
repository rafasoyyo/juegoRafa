/**
 * «El tren»: una tarjeta con el puesto y un tren con su locomotora a la izquierda; cada vagón lleva un
 * pasajero y se toca entero. La pista los recorre de uno en uno desde la locomotora, contando.
 */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { drawDots, drawObject } from '../quiz-art';
import { digits } from '../round-button';
import { ViewBase, type DrawResult, type HintContext, type QuizView, type SceneSlot, type ViewHost } from './view';

const RAIL_Y = 520;
const CARD_Y = 230;
const WAGON_COLORS = [0x4da3ff, 0x58c25a, 0xffc93c, 0x8e6cf0, 0xff7a59];

export class TrainView extends ViewBase implements QuizView {
  private wagonX: number[] = [];
  private wagons: Phaser.GameObjects.Container[] = [];
  private wagonW = 0;

  constructor(host: ViewHost) {
    super(host);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene as Extract<SceneData, { kind: 'train' }>;
    const cx = this.host.width / 2;
    const engineW = 150;
    this.wagonW = Math.min(150, (this.host.usefulW - engineW - 60) / s.wagons - 12);
    const step = this.wagonW + 12;
    const total = engineW + 12 + s.wagons * step;
    const x0 = cx - total / 2;

    // Tarjeta con el puesto que se busca.
    const v = q.prompt.items[0]!;
    const card = this.scene.add.graphics();
    card.fillStyle(COLORS.shadow).fillRoundedRect(cx - 65, CARD_Y - 57, 130, 130, 26);
    card.fillStyle(COLORS.yellow).fillRoundedRect(cx - 65, CARD_Y - 65, 130, 130, 26);
    const face = v.type === 'dots' ? drawDots(this.scene, v.value, 96).setPosition(cx, CARD_Y) : digits(this.scene, cx, CARD_Y, String(v.type === 'digit' ? v.value : ''), 78);
    this.host.layer.add([card, face]);

    // Vía y locomotora (mira a la izquierda: el primer vagón es el que va pegado a ella).
    const g = this.scene.add.graphics();
    g.fillStyle(0x9c6639).fillRect(x0 - 30, RAIL_Y + 52, total + 60, 10);
    const ex = x0 + engineW / 2;
    g.fillStyle(COLORS.coralDark).fillRoundedRect(x0, RAIL_Y - 50, engineW, 92, 18);
    g.fillStyle(COLORS.coral).fillRoundedRect(x0, RAIL_Y - 56, engineW, 90, 18);
    g.fillStyle(COLORS.coral).fillRoundedRect(x0 + engineW - 64, RAIL_Y - 120, 60, 70, 12);
    g.fillStyle(COLORS.white).fillRoundedRect(x0 + engineW - 54, RAIL_Y - 108, 40, 32, 8);
    g.fillStyle(COLORS.ink).fillRoundedRect(x0 + 18, RAIL_Y - 100, 28, 46, 6);
    g.fillStyle(COLORS.yellow).fillCircle(x0 + 8, RAIL_Y - 14, 12);
    for (const wx of [ex - 40, ex + 40]) g.fillStyle(COLORS.ink).fillCircle(wx, RAIL_Y + 44, 18);
    this.host.layer.add(g);

    const slots = new Map<number, SceneSlot>();
    this.wagonX = [];
    this.wagons = [];
    for (let i = 0; i < s.wagons; i++) {
      const x = x0 + engineW + 12 + i * step + this.wagonW / 2;
      this.wagonX.push(x);
      const color = WAGON_COLORS[i % WAGON_COLORS.length]!;
      const w = this.scene.add.graphics();
      w.lineStyle(8, COLORS.ink).lineBetween(x - this.wagonW / 2 - 12, RAIL_Y + 10, x - this.wagonW / 2, RAIL_Y + 10);
      w.fillStyle(COLORS.ink).fillCircle(x - this.wagonW * 0.28, RAIL_Y + 44, 16).fillCircle(x + this.wagonW * 0.28, RAIL_Y + 44, 16);
      this.host.layer.add(w);
      // El vagón con su pasajero; encima, una zona táctil invisible del tamaño del vagón.
      const body = this.scene.add.graphics();
      body.fillStyle(0x2b2340, 0.25).fillRoundedRect(-this.wagonW / 2, -44, this.wagonW, 100, 16);
      body.fillStyle(color).fillRoundedRect(-this.wagonW / 2, -52, this.wagonW, 100, 16);
      body.fillStyle(COLORS.white, 0.85).fillRoundedRect(-this.wagonW / 2 + 10, -44, this.wagonW - 20, 56, 12);
      const parts: Phaser.GameObjects.GameObject[] = [body];
      const obj = s.objects[i];
      if (obj) parts.push(drawObject(this.scene, obj, Math.min(62, this.wagonW * 0.55)).setPosition(0, -16));
      const wagon = this.scene.add.container(x, RAIL_Y - 4, parts);
      this.host.layer.add(wagon);
      this.wagons.push(wagon);
      slots.set(i, { x, y: RAIL_Y - 6, w: this.wagonW, h: 110, ghost: true });
    }
    return { slots, anchor: { x: cx, y: CARD_Y - 60 } };
  }

  onWrong(id: number): boolean {
    const w = this.wagons[id];
    if (w) void this.wobbleObject(w);
    return true;
  }

  async onCorrect(id: number): Promise<void> {
    const w = this.wagons[id];
    if (w) await this.tween({ targets: w, y: w.y - 24, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
  }

  showAnswer(ids: number[]): boolean {
    for (const id of ids) this.glow(this.wagonX[id] ?? 0, RAIL_Y - 6, this.wagonW * 0.6, 1800);
    return false;
  }

  async hint(_kind: HintKind, ctx: HintContext): Promise<void> {
    const s = ctx.question.prompt.scene as Extract<SceneData, { kind: 'train' }>;
    for (let i = 0; i < s.target; i++) {
      if (!this.alive) return;
      const w = this.wagons[i];
      audio.sfx('tick', { index: i + 1 });
      if (w) this.scene.tweens.add({ targets: w, y: w.y - 18, duration: 140, yoyo: true, ease: 'Quad.easeOut' });
      this.glow(this.wagonX[i]!, RAIL_Y - 10, this.wagonW * 0.45, 700);
      await this.sleep(420);
    }
    await this.sleep(400);
  }
}
