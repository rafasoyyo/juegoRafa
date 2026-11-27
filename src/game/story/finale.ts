/**
 * Final del mundo (`docs/MUNDO-1.md`, «El final»), sin texto: en una viñeta grande, la nube de la cima
 * llueve sobre la montaña nevada, una gota baja al manantial y nace el río. `MapScene` lo lanza tras
 * pintar el último gajo y hace saltar el candado de los mundos que se abren con él. Cuándo se ve lo
 * decide `story.ts`.
 */

import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H } from '../config';

/** Momentos del final, en ms desde que aparece la viñeta. */
export const FINALE_TIMES = { rain: 500, drop: 2300, river: 3300, out: 5200, end: 5600 } as const;
const DEPTH = 90;
const RAIN = 0x5aa9f0;
const RIVER = 0x6cbcf5;
const RIVER_LIGHT = 0xc9ecff;

export class Finale {
  private card!: Phaser.GameObjects.Container;
  private shield?: Phaser.GameObjects.Zone;
  private timers: Phaser.Time.TimerEvent[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  private done?: () => void;

  constructor(
    private readonly scene: Phaser.Scene,
    /** Ancho lógico de la pantalla. */
    private readonly width: number,
  ) {}

  /** Monta la viñeta, la anima y llama a `done` cuando se ha ido (o cuando un toque la salta). */
  play(done: () => void): void {
    const { scene } = this;
    this.done = done;
    const at = (ms: number, fn: () => void) => this.timers.push(scene.time.delayedCall(ms, fn));
    const tween = (cfg: Phaser.Types.Tweens.TweenBuilderConfig) => this.tweens.push(scene.tweens.add(cfg));
    // Toda la pantalla escucha: un toque acaba el final al instante.
    this.shield = scene.add.zone(0, 0, this.width, GAME_H).setOrigin(0).setScrollFactor(0).setDepth(DEPTH - 1).setInteractive();
    this.shield.on('pointerdown', () => this.finish());
    const w = Math.min(640, this.width * 0.72);
    const h = 380;
    const cx = this.width / 2;
    const cy = GAME_H * 0.45;
    const card = scene.add.container(cx, cy).setScrollFactor(0).setDepth(DEPTH).setAlpha(0).setScale(0.9);
    this.card = card;

    // Tarjeta: sombra, cielo claro, tierra y montaña nevada a la izquierda.
    const g = scene.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, 36);
    g.fillStyle(0xdcefff).fillRoundedRect(-w / 2, -h / 2, w, h, 36);
    g.fillStyle(0xa9e3a0).fillRoundedRect(-w / 2, h / 2 - 110, w, 110, { tl: 0, tr: 0, bl: 36, br: 36 });
    const peak = { x: -w * 0.18, y: -h / 2 + 120 };
    const foot = h / 2 - 110;
    g.fillStyle(0xb9c7e6).fillTriangle(peak.x - 190, foot, peak.x, peak.y, peak.x + 190, foot);
    g.fillStyle(0xffffff).fillTriangle(peak.x - 62, peak.y + 62, peak.x, peak.y, peak.x + 62, peak.y + 62);
    g.fillStyle(0xffffff).fillCircle(peak.x - 40, peak.y + 62, 22).fillCircle(peak.x, peak.y + 66, 24).fillCircle(peak.x + 40, peak.y + 62, 22);
    // Manantial: piedras al pie de la montaña, a la derecha.
    const spring = { x: peak.x + 150, y: foot + 18 };
    g.fillStyle(0x9aa5b8).fillEllipse(spring.x - 26, spring.y + 4, 46, 26).fillEllipse(spring.x + 22, spring.y + 6, 40, 22);
    card.add(g);

    // Nube gris sobre la cima.
    const cloud = scene.add.image(peak.x, peak.y - 60, 'cloud').setTint(0xc9cfe2).setScale(1.25);
    card.add(cloud);

    const river = scene.add.graphics();
    card.add(river);
    card.bringToTop(cloud);

    tween({ targets: card, alpha: 1, scale: 1, duration: 350, ease: 'Back.easeOut' });

    // 1: la nube llueve sobre la montaña (gotas en bucle).
    at(FINALE_TIMES.rain, () => {
      for (let i = 0; i < 9; i++) {
        const x = peak.x - 70 + (i % 5) * 34 + (i > 4 ? 17 : 0);
        const drop = scene.add.ellipse(x, peak.y - 40, 8, 14, RAIN);
        card.add(drop);
        card.bringToTop(cloud);
        tween({ targets: drop, y: peak.y + 50 + (i % 3) * 18, alpha: { from: 1, to: 0 }, duration: 600, delay: i * 90, repeat: -1, repeatDelay: 120 });
      }
      for (let k = 0; k < 4; k++) at(k * 260, () => audio.sfx('tick', { index: 6 + k }));
    });

    // 2: una gota grande baja por la ladera hasta el manantial.
    at(FINALE_TIMES.drop, () => {
      const drop = scene.add.ellipse(peak.x + 10, peak.y + 40, 16, 24, RAIN);
      card.add(drop);
      const path = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(peak.x + 10, peak.y + 40), new Phaser.Math.Vector2(peak.x + 120, peak.y + 80), new Phaser.Math.Vector2(spring.x, spring.y - 6));
      const t = { v: 0 };
      tween({
        targets: t,
        v: 1,
        duration: 900,
        ease: 'Quad.easeIn',
        onUpdate: () => {
          const p = path.getPoint(t.v);
          drop.setPosition(p.x, p.y);
        },
        onComplete: () => drop.destroy(),
      });
    });

    // 3: nace el río, del manantial hacia la derecha.
    at(FINALE_TIMES.river, () => {
      audio.sfx('scale');
      const curve = new Phaser.Curves.Spline([
        new Phaser.Math.Vector2(spring.x, spring.y),
        new Phaser.Math.Vector2(spring.x + 60, spring.y + 30),
        new Phaser.Math.Vector2(spring.x + 150, spring.y + 24),
        new Phaser.Math.Vector2(w / 2 - 20, spring.y + 62),
      ]);
      const pts = curve.getPoints(60);
      const grow = { n: 2 };
      tween({
        targets: grow,
        n: pts.length,
        duration: 1100,
        ease: 'Sine.easeOut',
        onUpdate: () => {
          const shown = pts.slice(0, Math.max(2, Math.round(grow.n)));
          river.clear();
          river.lineStyle(26, RIVER).strokePoints(shown);
          river.lineStyle(8, RIVER_LIGHT).strokePoints(shown);
        },
      });
      for (let i = 0; i < 6; i++) {
        const s = scene.add.image(spring.x + Phaser.Math.Between(-24, 24), spring.y - 10, 'sparkle').setTint(RIVER_LIGHT).setScale(0.4);
        card.add(s);
        tween({ targets: s, y: s.y - 40, scale: 1.3, alpha: 0, angle: 90, delay: i * 90, duration: 600, onComplete: () => s.destroy() });
      }
    });

    at(FINALE_TIMES.out, () => {
      tween({ targets: card, alpha: 0, scale: 0.94, duration: 380, ease: 'Sine.easeIn' });
    });
    at(FINALE_TIMES.end, () => this.finish());
  }

  /** Quita la viñeta y avisa una sola vez, tanto al acabar como al saltarla. */
  finish(): void {
    const done = this.done;
    if (!done) return;
    this.done = undefined;
    for (const t of this.timers) t.remove();
    this.timers = [];
    for (const t of this.tweens) t.remove();
    this.tweens = [];
    this.card.destroy();
    this.shield?.destroy();
    done();
  }
}
