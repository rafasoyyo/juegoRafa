/**
 * «La balanza»: balanza de mercado sujeta en equilibrio. Pequeños tocan el platillo que bajará; medianos
 * eligen cuántas galletas faltan; mayores, cuántas galletas valen unas fresas según una balanza modelo.
 * Al acertar, la balanza se suelta y se mueve para mostrar el resultado.
 */

import Phaser from 'phaser';
import { audio } from '../../audio/audio-engine';
import { COLORS } from '../../config';
import type { HintKind, Question, SceneData } from '../../../learning/quiz/types';
import { fitImage } from '../round-button';
import { drawPanBowl, drawWeight, HEAVY_ANGLE } from './art';
import { ViewBase, type DrawResult, type HintContext, type Point, type QuizView, type SceneSlot, type ViewHost } from './view';

type BalanceScene = Extract<SceneData, { kind: 'balance' }>;

interface RigOptions {
  x: number;
  y: number;
  scale: number;
  /** Con las manos sujetando (se sueltan al acertar). */
  props: boolean;
}

/** Una balanza: viga que gira, cuerdas, dos platillos que cuelgan siempre rectos y, a veces, sus sujeciones. */
class Rig {
  readonly pans: Phaser.GameObjects.Container[];
  readonly props: Phaser.GameObjects.Container;
  readonly panW: number;
  readonly half: number;
  private readonly beam: Phaser.GameObjects.Graphics;
  private tilt = 0;
  private readonly string: number;

  constructor(private readonly scene: Phaser.Scene, parent: Phaser.GameObjects.Container, private readonly o: RigOptions) {
    const k = o.scale;
    this.half = 205 * k;
    this.string = 128 * k;
    this.panW = 190 * k;
    const stand = scene.add.graphics();
    stand.fillStyle(0x8d5527).fillRoundedRect(o.x - 10 * k, o.y, 20 * k, 270 * k, 6);
    stand.fillStyle(0x8d5527).fillRoundedRect(o.x - 70 * k, o.y + 262 * k, 140 * k, 24 * k, 10);
    this.beam = scene.add.graphics();
    this.pans = [0, 1].map(() => scene.add.container(0, 0, [drawPanBowl(scene, this.panW)]));
    this.props = scene.add.container(0, 0);
    if (o.props) {
      // Dos palitos que sujetan los platillos desde abajo.
      const g = scene.add.graphics();
      for (const side of [-1, 1]) {
        const top = o.y + this.string + this.panW / 2 + 6 * k;
        g.fillStyle(COLORS.coralDark).fillRoundedRect(o.x + side * this.half - 14, top + 6, 28, 70 * k, 10);
        g.fillStyle(COLORS.coral).fillRoundedRect(o.x + side * this.half - 14, top, 28, 70 * k, 10);
      }
      this.props.add(g);
    }
    parent.add([stand, this.beam, ...this.pans, this.props]);
    this.setTilt(0);
  }

  /** Posición de un platillo con la viga horizontal. */
  panCenter(side: 0 | 1): Point {
    return { x: this.o.x + (side === 0 ? -this.half : this.half), y: this.o.y + this.string };
  }

  /** `deg` positivo: baja el lado derecho. */
  setTilt(deg: number): void {
    this.tilt = deg;
    const a = Phaser.Math.DegToRad(deg);
    const dx = Math.cos(a) * this.half;
    const dy = Math.sin(a) * this.half;
    const ends: Point[] = [
      { x: this.o.x - dx, y: this.o.y - dy },
      { x: this.o.x + dx, y: this.o.y + dy },
    ];
    const g = this.beam;
    const k = this.o.scale;
    g.clear();
    g.lineStyle(7 * k, COLORS.ink, 0.8);
    ends.forEach((e, i) => {
      const w = this.panW / 2;
      g.lineBetween(e.x, e.y, e.x - w, e.y + this.string).lineBetween(e.x, e.y, e.x + w, e.y + this.string);
      this.pans[i]!.setPosition(e.x, e.y + this.string);
    });
    g.lineStyle(16 * k, 0x8d5527).lineBetween(ends[0]!.x, ends[0]!.y, ends[1]!.x, ends[1]!.y);
    g.fillStyle(COLORS.yellow).fillCircle(this.o.x, this.o.y, 16 * k);
  }

  tweenTo(deg: number, ms: number, scene: Phaser.Scene): Promise<void> {
    const proxy = { t: this.tilt };
    return new Promise((resolve) => {
      scene.tweens.add({ targets: proxy, t: deg, duration: ms, ease: 'Sine.easeInOut', onUpdate: () => this.setTilt(proxy.t), onComplete: () => resolve() });
    });
  }
}

export class BalanceView extends ViewBase implements QuizView {
  private rig!: Rig;
  private scn!: BalanceScene;
  /** Contenido de cada platillo (izquierdo, derecho) para poder tocarlo. */
  private content: Phaser.GameObjects.Container[] = [];

  constructor(host: ViewHost) {
    super(host);
  }

  /** Lugar de la galleta número `i` dentro de un platillo (relativo al centro del platillo). */
  private spot(i: number, k = 1): Point {
    const cs = 38 * k;
    return { x: ((i % 5) - 2) * cs, y: -cs * 0.65 - Math.floor(i / 5) * cs * 0.92 };
  }

  private cookie(i: number, size: number, alpha = 1): Phaser.GameObjects.Image {
    const p = this.spot(i, size / 34);
    return fitImage(this.scene.add.image(p.x, p.y, 'cookie'), size).setAlpha(alpha);
  }

  draw(q: Question): DrawResult {
    this.question = q;
    const s = q.prompt.scene;
    if (s?.kind !== 'balance') throw new Error('balance: falta la escena');
    this.scn = s;
    const sc = this.scene;
    const cx = this.host.width / 2;
    const big = s.mode === 'equiv';
    const rx = big ? cx - 120 : cx;
    this.rig = new Rig(sc, this.host.layer, { x: rx, y: 262, scale: 1, props: true });
    this.content = this.rig.pans.map(() => sc.add.container(0, 0));
    this.rig.pans.forEach((p, i) => p.add(this.content[i]!));

    const slots = new Map<number, SceneSlot>();
    let rowArea: DrawResult['rowArea'];
    if (s.mode === 'weigh') {
      this.content[0]!.add(drawWeight(sc, s.left, 92).setPosition(0, -50));
      this.content[1]!.add(drawWeight(sc, s.right, 92).setPosition(0, -50));
      for (const side of [0, 1] as const) {
        const c = this.rig.panCenter(side);
        slots.set(side, { x: c.x, y: c.y - 30, w: 200, h: 180, ghost: true });
      }
    } else if (s.mode === 'gap') {
      const counts = [s.left, s.right];
      counts.forEach((n, side) => {
        for (let i = 0; i < n; i++) this.content[side]!.add(this.cookie(i, 34));
      });
      // El hueco: un sitio vacío, con borde discontinuo, en el platillo con menos.
      const less = s.left < s.right ? 0 : 1;
      const gapAt = this.spot(counts[less]!);
      const hole = sc.add.graphics();
      hole.lineStyle(5, COLORS.coral, 0.9).strokeCircle(gapAt.x, gapAt.y, 19);
      this.content[less]!.add(hole);
      rowArea = { cx, w: this.host.usefulW, top: 590, bottom: 705, cell: [150, 108] };
    } else {
      for (let i = 0; i < s.berries; i++) this.content[0]!.add(fitImage(sc.add.image((i - (s.berries - 1) / 2) * 76, -42, 'strawberry'), 70));
      // Balanza modelo: 1 fresa y las galletas que vale, en equilibrio y sin sujeciones.
      const model = new Rig(sc, this.host.layer, { x: cx + 340, y: 215, scale: 0.5, props: false });
      const mc = [sc.add.container(0, 0), sc.add.container(0, 0)];
      model.pans.forEach((p, i) => p.add(mc[i]!));
      mc[0]!.add(fitImage(sc.add.image(0, -24, 'strawberry'), 40));
      for (let i = 0; i < s.cookies; i++) {
        const p = this.spot(i, 0.5);
        mc[1]!.add(fitImage(sc.add.image(p.x, p.y, 'cookie'), 20));
      }
      const frame = sc.add.graphics();
      frame.lineStyle(5, COLORS.white, 0.9).strokeRoundedRect(cx + 340 - 140, 215 - 70, 280, 300, 24);
      this.host.layer.add(frame);
      rowArea = { cx, w: this.host.usefulW, top: 590, bottom: 705, cell: [150, 108] };
    }
    return { slots, rowArea, anchor: { x: rx, y: 200 } };
  }

  private async release(): Promise<void> {
    await this.tween({ targets: this.rig.props, alpha: 0, duration: 250 });
  }

  /** Lado que baja si no se sujeta: -1 izquierdo, +1 derecho. */
  private heavySide(): number {
    const s = this.scn;
    if (s.mode === 'weigh') return (['melon', 'rock', 'pumpkin'] as string[]).includes(s.left) ? -1 : 1;
    if (s.mode === 'gap') return s.left > s.right ? -1 : 1;
    return -1;
  }

  async onCorrect(): Promise<void> {
    const s = this.scn;
    audio.sfx('tap');
    await this.release();
    if (!this.alive) return;
    await this.rig.tweenTo(this.heavySide() * HEAVY_ANGLE, 450, this.scene);
    if (s.mode === 'weigh') {
      await this.sleep(700);
      return;
    }
    if (s.mode === 'gap') {
      // Las galletas que faltan llegan al hueco y la balanza se iguala.
      const less = s.left < s.right ? 0 : 1;
      const have = Math.min(s.left, s.right);
      const missing = Math.abs(s.left - s.right);
      for (let i = 0; i < missing; i++) {
        const c = this.cookie(have + i, 34);
        const target = c.scale;
        c.setScale(0.01);
        this.content[less]!.add(c);
        audio.sfx('cookie');
        await this.tween({ targets: c, scale: target, duration: 180, ease: 'Back.easeOut' });
      }
    } else {
      const total = s.cookies * s.berries;
      for (let i = 0; i < total; i++) {
        const c = this.cookie(i, 30).setAlpha(0);
        this.content[1]!.add(c);
        audio.sfx('cookie');
        this.scene.tweens.add({ targets: c, alpha: 1, duration: 160 });
        await this.sleep(110);
      }
    }
    await this.rig.tweenTo(0, 500, this.scene);
    await this.sleep(300);
  }

  onWrong(id: number): boolean {
    if (this.scn.mode !== 'weigh') return false;
    const pan = this.rig.pans[id];
    if (pan) void this.wobbleObject(pan);
    return true;
  }

  async hint(kind: HintKind, _ctx: HintContext): Promise<void> {
    const s = this.scn;
    const sc = this.scene;
    if (kind === 'heft') {
      // Se suelta la balanza y baja del lado del objeto pesado.
      await this.release();
      await this.rig.tweenTo(this.heavySide() * HEAVY_ANGLE, 600, sc);
      await this.sleep(800);
      await this.rig.tweenTo(0, 500, sc);
      await this.tween({ targets: this.rig.props, alpha: 1, duration: 250 });
      return;
    }
    if (kind === 'pair-up' && s.mode === 'gap') {
      // Líneas que unen las galletas de un lado con las del otro, de una en una.
      const pairs = Math.min(s.left, s.right);
      const base = [this.rig.panCenter(0), this.rig.panCenter(1)];
      const g = sc.add.graphics();
      this.host.top.add(g);
      for (let i = 0; i < pairs; i++) {
        const a = this.spot(i);
        const b = this.spot(i);
        g.lineStyle(6, COLORS.purple, 0.85).lineBetween(base[0]!.x + a.x, base[0]!.y + a.y, base[1]!.x + b.x, base[1]!.y + b.y);
        audio.sfx('tap');
        await this.sleep(240);
        if (!this.alive) return;
      }
      // Brillan los sitios que quedan sin pareja (en el platillo con más y el hueco).
      const more = s.left > s.right ? 0 : 1;
      for (let i = pairs; i < Math.max(s.left, s.right); i++) {
        const p = this.spot(i);
        this.glow(base[more]!.x + p.x, base[more]!.y + p.y, 26, 1300);
        const q = base[1 - more]!;
        this.glow(q.x + p.x, q.y + p.y, 26, 1300);
      }
      await this.sleep(1700);
      this.scene.tweens.add({ targets: g, alpha: 0, duration: 300, onComplete: () => g.destroy() });
      await this.sleep(320);
      return;
    }
    if (kind === 'swap-fruit' && s.mode === 'equiv') {
      // Cada fresa se cambia por las galletas que vale y luego vuelve a ser fresa.
      const berries = [...this.content[0]!.list] as Phaser.GameObjects.Image[];
      const swaps: Phaser.GameObjects.Image[] = [];
      for (const berry of berries) {
        berry.setAlpha(0.15);
        for (let i = 0; i < s.cookies; i++) {
          const c = fitImage(sc.add.image(berry.x + (i - (s.cookies - 1) / 2) * 30, berry.y + ((i % 2) - 0.5) * 22, 'cookie'), 28);
          this.content[0]!.add(c);
          swaps.push(c);
          audio.sfx('cookie');
        }
        await this.sleep(700);
        if (!this.alive) return;
      }
      await this.sleep(700);
      for (const c of swaps) c.destroy();
      for (const b of berries) b.setAlpha(1);
      await this.sleep(200);
    }
  }
}
