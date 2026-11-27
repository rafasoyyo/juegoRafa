/**
 * Prólogo del mundo (`docs/MUNDO-1.md`, «1. El prólogo»), sin texto: Rufo asoma de la madriguera y se
 * despereza, Lalo vuela a su lado y señala a la derecha, el arcoíris del horizonte destella con un
 * tintineo de 6 notas y Rufo da un salto de alegría. Un toque lo salta. Cuándo se ve lo decide
 * `story.ts`.
 */

import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import type { LaloFlyer } from '../challenges/lalo-flyer';
import { COLORS } from '../config';
import type { HatId } from '../state';
import { drawFox } from '../ui/characters';

/** Momentos del prólogo, en ms desde que empieza. */
export const PROLOGUE_TIMES = { lalo: 1000, rainbow: 2000, hop: 3500, end: 4100 } as const;
/** Los toques de los primeros ms no lo saltan: el dedo que abrió el nivel puede seguir en la pantalla. */
const SKIP_AFTER_MS = 400;
const NOTE_MS = 110;
const DEPTH = 15;

export interface PrologueCast {
  /** Rufo del nivel (se oculta mientras su doble sale de la madriguera). */
  fox: Phaser.GameObjects.Components.Visible & Phaser.GameObjects.Components.Transform;
  hat: Phaser.GameObjects.Image;
  hatId: HatId;
  foxSize: number;
  /** Boca de la madriguera, en el mundo. */
  burrowMouth: { x: number; y: number };
  lalo: LaloFlyer;
  rainbow?: Phaser.GameObjects.Image;
  /** Rufo de verdad da el salto de alegría. */
  hop: () => void;
  /** Se acaba (o se salta): el niño ya puede jugar. */
  done: () => void;
}

export class Prologue {
  private timers: Phaser.Time.TimerEvent[] = [];
  private temp: Phaser.GameObjects.GameObject[] = [];
  private finished = false;
  private startedAt = 0;
  private rainbowBase?: { alpha: number; scaleX: number; scaleY: number };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly cast: PrologueCast,
  ) {}

  play(): void {
    const { scene, cast } = this;
    this.startedAt = scene.time.now;
    const r = cast.rainbow;
    if (r) this.rainbowBase = { alpha: r.alpha, scaleX: r.scaleX, scaleY: r.scaleY };
    cast.fox.setVisible(false);
    cast.hat.setVisible(false);

    // 0 s: Rufo asoma de la madriguera y se despereza.
    const standX = cast.fox.x;
    const standY = cast.fox.y;
    const double = drawFox(scene, cast.burrowMouth.x, cast.burrowMouth.y + 20, 'idle', cast.hatId, cast.foxSize).setDepth(DEPTH).setScale(0.4).setAlpha(0);
    this.temp.push(double);
    scene.tweens.add({ targets: double, alpha: 1, duration: 150 });
    scene.tweens.add({ targets: double, x: standX, y: standY, scale: 1, duration: 600, ease: 'Back.easeOut' });
    scene.tweens.add({ targets: double, scaleY: 1.14, scaleX: 0.92, delay: 650, duration: 200, yoyo: true, ease: 'Sine.easeInOut' });

    // 1 s: Lalo vuela a su lado y señala a la derecha.
    this.at(PROLOGUE_TIMES.lalo, () => {
      const lx = standX + 150;
      const ly = standY - 230;
      cast.lalo.flyTo(lx, ly, () => {
        if (this.finished) return;
        const arrow = scene.add.graphics().setDepth(DEPTH);
        arrow.fillStyle(COLORS.coralDark).fillTriangle(30, -22 + 4, 30, 22 + 4, 58, 4);
        arrow.fillStyle(COLORS.coral).fillTriangle(30, -22, 30, 22, 58, 0);
        arrow.fillStyle(COLORS.coral).fillRoundedRect(0, -9, 34, 18, 6);
        arrow.setPosition(lx + 50, ly + 10);
        this.temp.push(arrow);
        scene.tweens.add({ targets: arrow, x: lx + 68, duration: 320, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      });
    });

    // 2 s: el arcoíris lejano destella con un tintineo de 6 notas.
    this.at(PROLOGUE_TIMES.rainbow, () => this.flashRainbow());

    // 3,5 s: Rufo salta de alegría y Lalo vuelve a su sitio.
    this.at(PROLOGUE_TIMES.hop, () => {
      this.clearTemp();
      cast.fox.setVisible(true);
      cast.hat.setVisible(true);
      cast.lalo.home();
      cast.hop();
    });
    this.at(PROLOGUE_TIMES.end, () => this.finish());
  }

  /** Un toque en la pantalla: si ya han pasado los primeros ms, todo a su sitio y a jugar. */
  tap(): void {
    if (this.finished || this.scene.time.now - this.startedAt < SKIP_AFTER_MS) return;
    this.skip();
  }

  skip(): void {
    if (this.finished) return;
    for (const t of this.timers) t.remove(false);
    this.clearTemp();
    const r = this.cast.rainbow;
    if (r && this.rainbowBase) {
      this.scene.tweens.killTweensOf(r);
      r.setAlpha(this.rainbowBase.alpha).setScale(this.rainbowBase.scaleX, this.rainbowBase.scaleY);
    }
    this.cast.fox.setVisible(true);
    this.cast.hat.setVisible(true);
    this.cast.lalo.home();
    this.finish();
  }

  get active(): boolean {
    return !this.finished;
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.cast.done();
  }

  /** Llama a `fn` dentro de `ms` (contados desde ahora) si el prólogo sigue en marcha. */
  private at(ms: number, fn: () => void): void {
    this.timers.push(this.scene.time.delayedCall(ms, () => !this.finished && fn()));
  }

  private clearTemp(): void {
    for (const o of this.temp) {
      this.scene.tweens.killTweensOf(o);
      o.destroy();
    }
    this.temp = [];
  }

  private flashRainbow(): void {
    const { scene } = this;
    for (let k = 0; k < 6; k++) this.at(k * NOTE_MS, () => audio.sfx('band', { index: k }));
    const r = this.cast.rainbow;
    if (!r || !this.rainbowBase) return;
    const base = this.rainbowBase;
    scene.tweens.add({ targets: r, alpha: 1, duration: 250 });
    scene.tweens.add({ targets: r, scaleX: base.scaleX * 1.25, scaleY: base.scaleY * 1.25, duration: 380, yoyo: true, hold: 300, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: r, alpha: base.alpha, delay: 1100, duration: 400 });
    const sf = r.scrollFactorX;
    for (let i = 0; i < 8; i++) {
      const a = Math.PI + (i / 7) * Math.PI;
      const rad = r.displayWidth * 0.5;
      const x = r.x + Math.cos(a) * rad;
      const y = r.y + Math.sin(a) * rad * 0.95;
      const s = scene.add.image(x, y, 'sparkle').setScrollFactor(sf, 1).setDepth(r.depth + 1).setScale(0.3).setAlpha(0);
      this.temp.push(s);
      scene.tweens.add({ targets: s, alpha: 1, scale: 1.4, angle: 90, delay: i * 60, duration: 350, yoyo: true, ease: 'Quad.easeOut' });
    }
  }
}
