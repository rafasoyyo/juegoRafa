/**
 * «Calcetines»: los pequeños ven un calcetín en un marco y buscan su pareja entre las respuestas; los demás
 * ven una fila de calcetines y eligen «todos con pareja» o «sobra uno». La pista los junta de dos en dos.
 */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { drawSock } from './art';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type ViewHost } from './view';

const ROW_Y = 320;

export class SocksView extends ViewBase implements QuizView {
  private socks: { p: Point; color: number }[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene as Extract<SceneData, { kind: 'socks' }>;
    const cx = this.host.width / 2;
    const rowArea = { cx, w: this.host.usefulW, top: 480, bottom: 700, cell: [200, 200] as [number, number] };
    this.socks = [];
    if (s.mode === 'match') {
      const g = this.scene.add.graphics();
      g.fillStyle(COLORS.shadow).fillRoundedRect(cx - 90, ROW_Y - 112, 180, 220, 30);
      g.fillStyle(COLORS.white).fillRoundedRect(cx - 90, ROW_Y - 120, 180, 220, 30);
      g.lineStyle(6, COLORS.coral).strokeRoundedRect(cx - 90, ROW_Y - 120, 180, 220, 30);
      const v = q.prompt.items[0]!;
      const sock = v.type === 'sock' ? drawSock(this.scene, v.color, v.pattern, 170).setPosition(cx, ROW_Y - 10) : this.scene.add.container();
      this.host.layer.add([g, sock]);
      return { slots: new Map(), rowArea, anchor: { x: cx, y: ROW_Y - 120 } };
    }
    // Fila (o dos) de calcetines colgados de una cuerda.
    const n = s.socks.length;
    const perRow = n > 10 ? Math.ceil(n / 2) : n;
    const rows = Math.ceil(n / perRow);
    const size = rows > 1 ? 92 : 118;
    const step = Math.min(size * 0.78, (this.host.usefulW - 60) / perRow);
    const g = this.scene.add.graphics();
    this.host.layer.add(g);
    s.socks.forEach((color, i) => {
      const r = Math.floor(i / perRow);
      const k = i - r * perRow;
      const inRow = Math.min(perRow, n - r * perRow);
      const x = cx + (k - (inRow - 1) / 2) * step;
      const y = ROW_Y - (rows - 1) * 70 + r * 140;
      if (k === 0) g.lineStyle(4, 0x9c6639).lineBetween(cx - (inRow * step) / 2 - 20, y - size * 0.42, cx + (inRow * step) / 2 + 20, y - size * 0.42);
      // Cada color con su dibujo, para que las parejas se reconozcan.
      this.host.layer.add(drawSock(this.scene, color, color % 3, size).setPosition(x, y));
      this.socks.push({ p: { x, y }, color });
    });
    return { slots: new Map(), rowArea, anchor: { x: cx, y: ROW_Y - 120 } };
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    // Se unen los del mismo color de dos en dos; el que se queda solo brilla.
    const g = this.scene.add.graphics();
    this.host.top.add(g);
    const left = [...this.socks];
    let k = 0;
    while (left.length > 1) {
      const a = left.shift()!;
      const j = left.findIndex((o) => o.color === a.color);
      if (j < 0) {
        left.push(a);
        if (left.every((o) => left.filter((x) => x.color === o.color).length < 2)) break;
        continue;
      }
      const b = left.splice(j, 1)[0]!;
      await this.sleep(k++ === 0 ? 0 : 260);
      if (!this.alive) return;
      g.lineStyle(7, COLORS.purple, 0.85).beginPath();
      g.moveTo(a.p.x, a.p.y + 30);
      g.lineTo((a.p.x + b.p.x) / 2, Math.max(a.p.y, b.p.y) + 70);
      g.lineTo(b.p.x, b.p.y + 30);
      g.strokePath();
    }
    for (const o of left) this.glow(o.p.x, o.p.y, 50, 1600);
    await this.sleep(1600);
    this.scene.tweens.add({ targets: g, alpha: 0, duration: 400, onComplete: () => g.destroy() });
  }
}
