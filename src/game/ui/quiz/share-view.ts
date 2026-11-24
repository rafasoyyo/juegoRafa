/** «Reparte las galletas»: cesta arriba, platos con amigos abajo y, en mayores, el tarro de Lalo. */

import Phaser from 'phaser';
import type { HintKind, Question } from '../../../learning/quiz/types';
import { drawBasketBody } from './art';
import { fitImage } from '../round-button';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

const COOKIE = 34;
const BASKET_W = 230;
/** Sitios de las galletas dentro de un plato (relativos al centro del botón) y dentro del tarro. */
const PLATE_SPOTS: Point[] = [
  [-26, 28], [26, 28], [0, 34], [-14, 14], [14, 14], [0, 6],
].map(([x, y]) => ({ x: x!, y: y! }));
const JAR_SPOTS: Point[] = [
  [-14, 36], [14, 36], [0, 14],
].map(([x, y]) => ({ x: x!, y: y! }));

export class ShareView extends ViewBase implements QuizView {
  private total = 0;
  private basket: Point = { x: 0, y: 0 };
  private inBasket: Phaser.GameObjects.Image[] = [];
  private jarId = -1;
  private placed = new Map<number, Phaser.GameObjects.Image[]>();

  constructor(host: ViewHost) {
    super(host);
  }

  private spots(id: number): Point[] {
    return id === this.jarId ? JAR_SPOTS : PLATE_SPOTS;
  }

  private cookieAt(x: number, y: number, alpha = 1): Phaser.GameObjects.Image {
    return fitImage(this.scene.add.image(x, y, 'cookie'), COOKIE).setAlpha(alpha);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'share') throw new Error('share: falta la escena');
    const cx = this.host.width / 2;
    const state = this.host.state();
    this.total = s.cookies;
    const given = [...state.fills.values()].reduce((a, b) => a + b, 0);
    this.basket = { x: s.jar ? cx - 120 : cx, y: 262 };
    this.inBasket = [];

    // Galletas en montón sobre la cesta; la cesta las tapa por abajo.
    for (let i = 0; i < this.total - given; i++) {
      const row = Math.floor(i / 5);
      const inRow = Math.min(5, this.total - given - row * 5);
      const col = i % 5;
      const img = this.cookieAt(this.basket.x + (col - (inRow - 1) / 2) * 42, this.basket.y - 34 - row * 32);
      this.inBasket.push(img);
      this.host.layer.add(img);
    }
    this.host.layer.add(drawBasketBody(this.scene, BASKET_W).setPosition(this.basket.x, this.basket.y));

    const slots = new Map<number, SceneSlot>();
    const n = s.plates.length;
    const step = Math.min(190, (this.host.usefulW - 40) / n);
    s.plates.forEach((_, i) => {
      const off = i - (n - 1) / 2;
      slots.set(i, { x: cx + off * step, y: 540 + Math.abs(off) * 16, w: 160, h: 200, radius: 30 });
    });
    if (s.jar) {
      this.jarId = n;
      slots.set(n, { x: cx + 190, y: 262, w: 130, h: 170, radius: 26, color: 0xe9f6ff });
    } else {
      this.jarId = -1;
    }
    return { slots, anchor: { x: this.basket.x, y: this.basket.y - 40 } };
  }

  protected override afterAttach(): void {
    for (const [id, count] of this.host.state().fills) {
      for (let k = 0; k < count; k++) this.addStatic(id, k);
    }
  }

  private addStatic(id: number, k: number, alpha = 1): Phaser.GameObjects.Image | null {
    const b = this.buttons.get(id);
    const spot = this.spots(id)[k];
    if (!b || !spot) return null;
    const img = this.cookieAt(spot.x, spot.y, alpha);
    b.addContent(img);
    if (alpha === 1) this.placed.set(id, [...(this.placed.get(id) ?? []), img]);
    return img;
  }

  private worldSpot(id: number, k: number): Point | null {
    const b = this.buttons.get(id);
    const spot = this.spots(id)[k];
    return b && spot ? { x: b.x + spot.x, y: b.y + spot.y } : null;
  }

  private basketTop(): Point {
    const c = this.inBasket[this.inBasket.length - 1];
    return c ? { x: c.x, y: c.y } : { x: this.basket.x, y: this.basket.y - 20 };
  }

  /** Una galleta vuela de la cesta al plato y se queda en él. */
  onProgress(id: number): void {
    const k = (this.host.state().fills.get(id) ?? 1) - 1;
    const to = this.worldSpot(id, k);
    const top = this.inBasket.pop();
    if (!to) return;
    const from = top ? { x: top.x, y: top.y } : this.basketTop();
    top?.destroy();
    const flyer = this.cookieAt(from.x, from.y);
    this.host.top.add(flyer);
    this.scene.tweens.add({
      targets: flyer,
      x: to.x,
      y: to.y,
      duration: 380,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        flyer.destroy();
        if (this.alive) this.addStatic(id, k);
      },
    });
  }

  /** La galleta llega al plato, rebota y vuelve a la cesta. */
  onWrong(id: number): boolean {
    const b = this.buttons.get(id);
    if (!b) return false;
    const from = this.basketTop();
    const flyer = this.cookieAt(from.x, from.y);
    this.host.top.add(flyer);
    this.scene.tweens.chain({
      targets: flyer,
      tweens: [
        { x: b.x, y: b.y - 20, duration: 260, ease: 'Sine.easeIn' },
        { y: b.y - 70, scale: flyer.scale * 1.2, duration: 160, ease: 'Quad.easeOut' },
        { x: from.x, y: from.y, scale: flyer.scale, duration: 340, ease: 'Sine.easeInOut' },
      ],
      onComplete: () => flyer.destroy(),
    });
    return false;
  }

  async hint(_kind: HintKind, _ctx: HintContext): Promise<void> {
    // Una vuelta de galletas transparentes, una a cada plato (sin tocar lo ya repartido), que luego vuelven.
    const fills = this.host.state().fills;
    const ghosts: Phaser.GameObjects.Image[] = [];
    const plates = [...this.buttons.keys()].filter((id) => id !== this.jarId);
    for (const id of plates) {
      const k = fills.get(id) ?? 0;
      const to = this.worldSpot(id, Math.min(k, PLATE_SPOTS.length - 1));
      if (!to) continue;
      const from = this.basketTop();
      const g = this.cookieAt(from.x, from.y, 0.55);
      this.host.top.add(g);
      ghosts.push(g);
      await this.tween({ targets: g, x: to.x, y: to.y, duration: 320, ease: 'Sine.easeInOut' });
      if (!this.alive) return;
    }
    await this.sleep(700);
    for (const g of ghosts) {
      const from = this.basketTop();
      this.scene.tweens.add({ targets: g, x: from.x, y: from.y, alpha: 0, duration: 380, ease: 'Sine.easeInOut', onComplete: () => g.destroy() });
    }
    await this.sleep(420);
  }

  showAnswer(ids: number[]): boolean {
    const counts = new Map<number, number>();
    const fills = this.host.state().fills;
    for (const id of ids) {
      const done = (fills.get(id) ?? 0) + (counts.get(id) ?? 0);
      counts.set(id, (counts.get(id) ?? 0) + 1);
      this.addStatic(id, done, 0.6);
    }
    for (const id of counts.keys()) {
      const p = this.buttonPos(id);
      if (p) this.glow(p.x, p.y, 110, 1500);
    }
    return true;
  }
}
