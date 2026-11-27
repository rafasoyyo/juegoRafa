/**
 * Final de la isla (`docs/MUNDO-3.md`, «El huevo y el final»), sin texto: en una viñeta grande, el huevo
 * con sus 12 manchas está en el nido del cráter; la mamá dinosaurio se asoma, el huevo se mueve, se abre
 * y sale un bebé que da un saltito. Mientras no exista el mundo 4, se queda ahí (sin la cueva de las
 * letras). Tiene la misma forma que `Finale`: `MapScene` lo lanza tras pintar la última mancha y un toque
 * lo salta.
 */

import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H } from '../config';
import { DINO_COLORS } from '../ui/quiz/island-art';
import { drawIslandEgg, drawSpot, eggPoints, SHELL, SHELL_DARK } from '../ui/island-egg';

/** Momentos del final, en ms desde que aparece la viñeta. */
export const HATCH_TIMES = { mother: 400, wobble: 1500, crack: 2700, hatch: 3300, hop: 4100, out: 5800, end: 6200 } as const;
const DEPTH = 90;
const SKY = 0x5a5f7d;
const SKY_LOW = 0xc98a7e;
const BASALT = 0x3a3540;
const BASALT_LIGHT = 0x524b58;
const NEST = 0x8a6a3f;
const NEST_LIGHT = 0xb08a52;
const GLOW = 0xff9b4a;
const EYE = 0xf3b23a;
const INK = 0x2b2233;
const EGG = 150;

export class HatchFinale {
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
    this.shield = scene.add.zone(0, 0, this.width, GAME_H).setOrigin(0).setScrollFactor(0).setDepth(DEPTH - 1).setInteractive();
    this.shield.on('pointerdown', () => this.finish());
    const w = Math.min(640, this.width * 0.72);
    const h = 380;
    const card = scene.add.container(this.width / 2, GAME_H * 0.45).setScrollFactor(0).setDepth(DEPTH).setAlpha(0).setScale(0.9);
    this.card = card;

    // Tarjeta: cielo de atardecer volcánico, resplandor del cráter y su borde de basalto.
    const g = scene.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, 36);
    g.fillStyle(SKY).fillRoundedRect(-w / 2, -h / 2, w, h, 36);
    g.fillStyle(SKY_LOW).fillRect(-w / 2, -h / 2 + h * 0.45, w, h * 0.25);
    g.fillStyle(GLOW, 0.35).fillEllipse(0, h / 2 - 90, w * 0.9, 120);
    card.add(g);

    // La mamá se asoma por detrás del borde del cráter, a la derecha: empieza escondida tras la roca.
    const rimTop = h / 2 - 96;
    const mother = scene.add.container(w * 0.3, rimTop + 46, [this.drawMother()]).setAlpha(0);
    card.add(mother);
    const rim = scene.add.graphics();
    rim.fillStyle(BASALT).fillRoundedRect(-w / 2, rimTop, w, 96, { tl: 0, tr: 0, bl: 36, br: 36 });
    rim.fillStyle(BASALT_LIGHT).fillEllipse(-w * 0.26, rimTop + 2, w * 0.4, 24).fillEllipse(w * 0.27, rimTop + 6, w * 0.36, 20);
    card.add(rim);

    // El nido con el huevo.
    const nestY = h / 2 - 96;
    const nestBack = scene.add.graphics();
    nestBack.fillStyle(NEST).fillEllipse(-20, nestY - 6, 230, 64);
    card.add(nestBack);
    const egg = scene.add.container(-20, nestY - EGG / 2 + 4, [drawIslandEgg(scene, EGG, Array.from({ length: 12 }, (_, i) => i + 1))]);
    card.add(egg);
    const nestFront = scene.add.graphics();
    nestFront.fillStyle(NEST_LIGHT).fillEllipse(-20, nestY + 12, 250, 52);
    nestFront.fillStyle(NEST);
    for (let i = 0; i < 8; i++) nestFront.fillRoundedRect(-130 + i * 30, nestY + 2 + (i % 2) * 8, 34, 7, 3);
    card.add(nestFront);

    tween({ targets: card, alpha: 1, scale: 1, duration: 350, ease: 'Back.easeOut' });

    // 1: la mamá se asoma despacio, con su llamada grave.
    at(HATCH_TIMES.mother, () => {
      audio.sfx('brachio');
      tween({ targets: mother, y: rimTop - 44, alpha: 1, duration: 1000, ease: 'Sine.easeOut' });
    });

    // 2: el huevo se mueve, tres veces.
    at(HATCH_TIMES.wobble, () => {
      for (let i = 0; i < 3; i++) at(i * 380, () => audio.sfx('tick', { index: 3 + i }));
      tween({ targets: egg, angle: { from: -8, to: 8 }, duration: 120, yoyo: true, repeat: 4, onComplete: () => egg.setAngle(0) });
    });

    // 3: se raja.
    const crack = scene.add.graphics();
    card.add(crack);
    at(HATCH_TIMES.crack, () => {
      audio.sfx('stone');
      crack.lineStyle(5, SHELL_DARK).strokePoints(
        [-34, -6, -20, -20, -6, -4, 8, -20, 22, -4, 34, -16].reduce<Phaser.Math.Vector2[]>((pts, v, i, a) => (i % 2 === 0 ? [...pts, new Phaser.Math.Vector2(egg.x + v, egg.y + a[i + 1]! - 6)] : pts), []),
      );
      tween({ targets: egg, angle: { from: -4, to: 4 }, duration: 70, yoyo: true, repeat: 3, onComplete: () => egg.setAngle(0) });
    });

    // 4: la parte de arriba sale volando, el bebé asoma y da un saltito.
    const baby = scene.add.container(egg.x, egg.y + 10, [this.drawBaby()]).setScale(0.2).setAlpha(0);
    at(HATCH_TIMES.hatch, () => {
      audio.sfx('prize');
      crack.clear();
      // La cáscara se parte por encima de la fila de en medio: la tapa (con las manchas de arriba) sale volando.
      const cut = -EGG * 0.06;
      const cap = scene.add.graphics();
      cap.fillStyle(SHELL).fillPoints(eggPoints(EGG).filter((p) => p.y < cut), true);
      for (let l = 9; l <= 12; l++) drawSpot(cap, l, EGG, true);
      cap.setPosition(egg.x, egg.y);
      card.add(cap);
      const whole = egg.list[0] as Phaser.GameObjects.Graphics;
      whole.setVisible(false);
      const bottom = scene.add.graphics();
      bottom.fillStyle(SHELL_DARK).fillPoints(eggPoints(EGG).filter((p) => p.y > cut), true);
      bottom.fillStyle(SHELL).fillPoints(eggPoints(EGG * 0.97).filter((p) => p.y > cut + 4), true);
      for (let l = 1; l <= 8; l++) drawSpot(bottom, l, EGG, true);
      egg.add(bottom);
      card.add(baby);
      card.bringToTop(egg);
      card.bringToTop(nestFront);
      card.bringToTop(cap);
      tween({ targets: cap, x: egg.x + 90, y: egg.y - 150, angle: 140, alpha: 0, duration: 700, ease: 'Quad.easeOut' });
      tween({ targets: baby, y: egg.y - 46, scale: 1, alpha: 1, duration: 450, ease: 'Back.easeOut' });
      for (let i = 0; i < 6; i++) {
        const s = scene.add.image(egg.x + Phaser.Math.Between(-40, 40), egg.y - 50, 'sparkle').setTint(EYE).setScale(0.4);
        card.add(s);
        tween({ targets: s, y: s.y - 60, scale: 1.3, alpha: 0, angle: 90, delay: i * 80, duration: 600, onComplete: () => s.destroy() });
      }
    });

    // 5: saltito del bebé; la mamá baja la cabeza hacia él.
    at(HATCH_TIMES.hop, () => {
      audio.sfx('jump');
      tween({ targets: baby, y: egg.y - 96, duration: 260, yoyo: true, ease: 'Quad.easeOut' });
      tween({ targets: mother, x: w * 0.24, angle: -10, duration: 700, ease: 'Sine.easeInOut' });
    });

    at(HATCH_TIMES.out, () => {
      tween({ targets: card, alpha: 0, scale: 0.94, duration: 380, ease: 'Sine.easeIn' });
    });
    at(HATCH_TIMES.end, () => this.finish());
  }

  /** Cabeza y arranque del cuello de la mamá, mirando a la izquierda (hacia el nido). Estilo documental, sin sonrisa. */
  private drawMother(): Phaser.GameObjects.Graphics {
    const [body, dark, light] = DINO_COLORS.brachio;
    const g = this.scene.add.graphics();
    // Cuello hacia abajo (lo tapa el borde del cráter) y cabeza alargada encima.
    g.fillStyle(dark).fillRoundedRect(12, -6, 44, 110, 20);
    g.fillStyle(body).fillRoundedRect(8, -10, 44, 110, 20);
    g.fillStyle(dark).fillEllipse(-8, -14, 104, 50);
    g.fillStyle(body).fillEllipse(-4, -20, 104, 48);
    g.fillStyle(light, 0.6).fillEllipse(-12, -4, 76, 12);
    g.fillStyle(EYE).fillCircle(10, -30, 8);
    g.fillStyle(INK).fillEllipse(10, -30, 3.5, 12);
    g.fillStyle(dark).fillCircle(-46, -24, 3);
    return g;
  }

  /** El bebé: cuerpo redondo, cuello corto y cabeza grande, mirando a la izquierda. */
  private drawBaby(): Phaser.GameObjects.Graphics {
    const [body, dark, light] = DINO_COLORS.brachio;
    const g = this.scene.add.graphics();
    g.fillStyle(dark).fillEllipse(6, 34, 70, 44);
    g.fillStyle(body).fillEllipse(4, 30, 68, 40);
    g.fillStyle(body).fillRoundedRect(-18, -14, 22, 44, 10);
    g.fillStyle(dark).fillEllipse(-22, -18, 50, 32);
    g.fillStyle(body).fillEllipse(-22, -22, 50, 30);
    g.fillStyle(light, 0.7).fillEllipse(6, 42, 40, 10);
    g.fillStyle(EYE).fillCircle(-26, -26, 6);
    g.fillStyle(INK).fillEllipse(-26, -26, 3, 9);
    return g;
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
