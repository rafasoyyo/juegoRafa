/** «¿Cuántos dedos?»: una o dos manos con dedos levantados; la pista los ilumina de uno en uno. */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type ViewHost } from './view';

const HAND_Y = 330;
const SKIN = 0xffc9a0;
const SKIN_DARK = 0xe8a77c;
const PALM_W = 150;
const PALM_H = 130;
const FINGER_W = 30;

export class FingersView extends ViewBase implements QuizView {
  /** Puntas de los dedos levantados, en orden de conteo (de la mano izquierda a la derecha). */
  private tips: Point[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene as Extract<SceneData, { kind: 'fingers' }>;
    const cx = this.host.width / 2;
    const n = s.hands.length;
    const step = PALM_W + 70;
    this.tips = [];
    s.hands.forEach((up, i) => {
      // La mano de la izquierda con el pulgar a la derecha y al revés: como las propias manos vistas de frente.
      const x = cx + (i - (n - 1) / 2) * step;
      this.hand(x, HAND_Y, up, n === 2 && i === 0 ? 1 : -1);
    });
    return { slots: new Map(), rowArea: { cx, w: this.host.usefulW, top: 500, bottom: 700, cell: [150, 150] }, anchor: { x: cx, y: HAND_Y - 60 } };
  }

  /** Mano con `up` dedos levantados (del índice al meñique y luego el pulgar). `thumbSide`: 1 a la derecha. */
  private hand(x: number, y: number, up: number, thumbSide: 1 | -1): void {
    const g = this.scene.add.graphics();
    const top = y - PALM_H / 2;
    g.fillStyle(SKIN_DARK).fillRoundedRect(x - PALM_W / 2, top + 6, PALM_W, PALM_H, 36);
    g.fillStyle(SKIN).fillRoundedRect(x - PALM_W / 2, top, PALM_W, PALM_H, 36);
    // Cuatro dedos (del índice, junto al pulgar, al meñique) y el pulgar de lado.
    const fingers: Point[] = [];
    for (let k = 0; k < 4; k++) {
      const fx = x + thumbSide * (PALM_W / 2 - FINGER_W / 2 - 6) - thumbSide * k * (FINGER_W + 4);
      const raised = k < up;
      const len = raised ? 92 - Math.abs(k - 1.5) * 10 : 26;
      g.fillStyle(SKIN_DARK).fillRoundedRect(fx - FINGER_W / 2, top - len + 4, FINGER_W, len + 30, FINGER_W / 2);
      g.fillStyle(SKIN).fillRoundedRect(fx - FINGER_W / 2, top - len, FINGER_W, len + 30, FINGER_W / 2);
      if (raised) {
        g.fillStyle(COLORS.white, 0.7).fillRoundedRect(fx - 9, top - len + 6, 18, 14, 6);
        fingers.push({ x: fx, y: top - len + 16 });
      }
    }
    const thumbUp = up >= 5;
    const tx = x + thumbSide * (PALM_W / 2 + (thumbUp ? 14 : -10));
    const ty = y + (thumbUp ? -10 : 20);
    g.fillStyle(SKIN_DARK).fillEllipse(tx, ty + 4, thumbUp ? 34 : 30, thumbUp ? 80 : 44);
    g.fillStyle(SKIN).fillEllipse(tx, ty, thumbUp ? 34 : 30, thumbUp ? 80 : 44);
    if (thumbUp) fingers.push({ x: tx, y: ty - 26 });
    this.host.layer.add(g);
    this.tips.push(...fingers);
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    for (const [i, p] of this.tips.entries()) {
      if (!this.alive) return;
      audio.sfx('tick', { index: i + 1 });
      this.glow(p.x, p.y, 26, 900);
      await this.sleep(360);
    }
    await this.sleep(500);
  }
}
