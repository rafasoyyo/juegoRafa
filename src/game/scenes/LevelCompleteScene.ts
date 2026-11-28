import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { medalTexture } from '../castle/castle';
import { COLORS, GAME_H, MAX_W } from '../config';
import { starsForGoals, type Stars } from '../../learning/scoring';
import { saveActive } from '../profile/active';
import { completeLevel, finishWithoutStars, session, winMedal } from '../state';
import { drawFox } from '../ui/characters';
import { digits, fitImage, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { addSky, drawGround } from '../ui/widgets';
import { clampLevel, worldDef } from '../worlds/registry';
import type { WorldDef, WorldId } from '../worlds/types';

export interface LevelCompleteData {
  /** Mundo del nivel; sin dato, el primero. */
  world?: WorldId;
  level: number;
  blocksHit: number;
  blocksTotal: number;
  cookies: number;
  /** Galletas que se podían ganar en la fase. Sin dato (p. ej. abriendo la escena en desarrollo), las que lleva. */
  cookiesTotal?: number;
  /** Preguntas acertadas de la prueba de la bandera. Sin dato, todas. */
  quizCorrect?: number;
  /** Preguntas de la prueba de la bandera. Sin dato, 3. */
  quizTotal?: number;
  /** Fin del castillo del mundo: siempre da la medalla, sin estrellas (pase lo que pase en la prueba). */
  castle?: boolean;
}

const GROUND_TOP = 615;
const MUSIC_AFTER_STARS_MS = 900;
/** Retardo con el que aparece (y suena) la medalla del castillo. */
const MEDAL_DELAY_MS = 300;

/** Retardo con el que aparece (y suena) la estrella `i`. */
function starDelay(i: number): number {
  return 200 + i * 180;
}
const CONFETTI_COLORS = [COLORS.coral, COLORS.yellow, COLORS.purple, COLORS.grass, 0x4da3ff];

/**
 * Celebración sin texto: confeti, estrellas, galletas ganadas y tres caminos. Con 0 estrellas, pantalla
 * de ánimo: sin confeti ni estrellas, la fase no queda superada y el botón grande es volver a empezar.
 */
export class LevelCompleteScene extends Phaser.Scene {
  private def!: WorldDef;
  private result!: LevelCompleteData;
  private stars: Stars = 0;

  constructor() {
    super('LevelComplete');
  }

  init(data: LevelCompleteData): void {
    this.def = worldDef(data?.world);
    this.result = {
      world: this.def.id,
      level: clampLevel(this.def, data?.level),
      blocksHit: data?.blocksHit ?? 0,
      blocksTotal: data?.blocksTotal ?? 0,
      cookies: data?.cookies ?? 0,
      cookiesTotal: data?.cookiesTotal ?? data?.cookies ?? 0,
      quizCorrect: data?.quizCorrect ?? data?.quizTotal ?? 3,
      quizTotal: data?.quizTotal ?? 3,
      castle: data?.castle === true && this.def.castle !== undefined,
    };
  }

  create(): void {
    // Se guarda una sola vez al llegar, no en cada recolocación.
    const { cookies, cookiesTotal = 0, quizCorrect = 0, quizTotal = 0 } = this.result;
    this.stars = starsForGoals({ cookies, cookiesTotal, quizCorrect, quizTotal });
    if (this.result.castle) winMedal(session, this.def.id, cookies);
    else if (this.stars > 0) completeLevel(session, this.def.id, this.result.level, this.stars, cookies);
    else finishWithoutStars(session, cookies);
    saveActive();

    enter(this);
    this.build(this.scale.width, true);
    if (this.result.castle) {
      this.time.delayedCall(MEDAL_DELAY_MS, () => audio.sfx('prize'));
      this.time.delayedCall(MEDAL_DELAY_MS + MUSIC_AFTER_STARS_MS, () => audio.playMusic('map'));
    } else if (this.stars > 0) {
      // La melodía del mapa vuelve cuando han sonado los tintineos de las estrellas.
      this.time.delayedCall(starDelay(this.stars - 1) + MUSIC_AFTER_STARS_MS, () => audio.playMusic('map'));
    } else {
      this.time.delayedCall(300, () => audio.sfx('prize'));
      this.time.delayedCall(300 + MUSIC_AFTER_STARS_MS, () => audio.playMusic('map'));
    }
    onResize(this, (w) => {
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.children.removeAll(true);
      this.build(w, false);
      audio.playMusic('map');
    });
  }

  private build(width: number, animate: boolean): void {
    addSky(this);
    drawGround(this, 0, MAX_W, GROUND_TOP, 30);
    if (this.result.castle) {
      this.confetti(width);
      this.medalCard(width, animate);
      const fox = drawFox(this, Math.max(150, width * 0.14), GROUND_TOP + 20, 'celebrate', session.hat, 210);
      this.tweens.add({ targets: fox, y: fox.y - 26, duration: 260, yoyo: true, repeat: -1, repeatDelay: 140, ease: 'Quad.easeOut' });
    } else if (this.stars > 0) {
      this.confetti(width);
      this.card(width, animate);
      const fox = drawFox(this, Math.max(150, width * 0.14), GROUND_TOP + 20, 'celebrate', session.hat, 210);
      this.tweens.add({ targets: fox, y: fox.y - 26, duration: 260, yoyo: true, repeat: -1, repeatDelay: 140, ease: 'Quad.easeOut' });
    } else {
      this.encouragement(width);
    }

    const y = GAME_H - 32 - 75;
    const { level, castle } = this.result;
    const world = this.def.id;
    // Tras el último nivel, el siguiente paso es el castillo (si el mundo tiene); tras el castillo, el mapa.
    const next = (): void => {
      if (castle) goTo(this, 'Map', { world });
      else if (level < this.def.levelCount) goTo(this, 'Level', { world, level: level + 1 });
      else if (this.def.castle) goTo(this, 'Level', { world, castle: true });
      else goTo(this, 'Map', { world });
    };
    const replay = (): void => goTo(this, 'Level', castle ? { world, castle: true } : { world, level });
    const toMap = (): void => goTo(this, 'Map', { world });
    const small = { width: 110, color: COLORS.white, shadowColor: COLORS.shadow, iconSize: 54 };
    const big = { width: 190, height: 150, radius: 75, color: COLORS.coral, shadowColor: COLORS.coralDark, shadowDepth: 10, iconSize: 88 };
    if (!castle && this.stars === 0) {
      // Sin estrellas hay que empezar de nuevo: repetir es el botón grande y no hay «siguiente».
      new RoundButton(this, width / 2 - 110, y, { ...small, icon: 'icon-map', onTap: toMap });
      new RoundButton(this, width / 2 + 70, y, { ...big, icon: 'icon-replay-white', onTap: replay });
      return;
    }
    new RoundButton(this, width / 2 - 180, y, { ...small, icon: 'icon-map', onTap: toMap });
    new RoundButton(this, width / 2, y, { ...big, icon: 'icon-next-white', onTap: next });
    new RoundButton(this, width / 2 + 180, y, { ...small, icon: 'icon-replay', onTap: replay });
  }

  /** Fase sin estrellas: el zorro y Lalo saludan, y se ven las galletas recogidas. */
  private encouragement(width: number): void {
    const cw = 600;
    const ch = 330;
    const top = 36;
    const g = this.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(width / 2 - cw / 2, top + 10, cw, ch, 40);
    g.fillStyle(COLORS.white).fillRoundedRect(width / 2 - cw / 2, top, cw, ch, 40);

    // Lalo, grande, en el centro de la tarjeta, saludando con un balanceo.
    const lalo = fitImage(this.add.image(width / 2, top + 140, 'lalo'), 170);
    this.tweens.add({ targets: lalo, angle: { from: -8, to: 8 }, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.time.addEvent({ delay: 2600, loop: true, callback: () => {
      lalo.setTexture('lalo-blink');
      fitImage(lalo, 170);
      this.time.delayedCall(160, () => fitImage(lalo.setTexture('lalo'), 170));
    } });

    const pw = 200;
    const ph = 76;
    const py = top + ch - 30 - ph / 2;
    g.fillStyle(0xfff4d6).fillRoundedRect(width / 2 - pw / 2, py - ph / 2, pw, ph, ph / 2);
    fitImage(this.add.image(width / 2 - 36, py, 'cookie'), 54);
    digits(this, width / 2 + 30, py + 2, String(this.result.cookies), 48);

    // El zorro saluda balanceándose (sin saltar de alegría).
    const fox = drawFox(this, Math.max(150, width * 0.14), GROUND_TOP + 20, 'idle', session.hat, 210);
    this.tweens.add({ targets: fox, angle: { from: -5, to: 5 }, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  /** Fin del castillo: la medalla del mundo, grande, y las galletas. Sin estrellas. */
  private medalCard(width: number, animate: boolean): void {
    const cw = 600;
    const ch = 330;
    const top = 36;
    const g = this.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(width / 2 - cw / 2, top + 10, cw, ch, 40);
    g.fillStyle(COLORS.white).fillRoundedRect(width / 2 - cw / 2, top, cw, ch, 40);

    const glow = this.add.circle(width / 2, top + 130, 110, COLORS.yellow, 0.35);
    this.tweens.add({ targets: glow, scale: 1.12, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const medal = fitImage(this.add.image(width / 2, top + 135, medalTexture(this.def.castle, true)), 200);
    const target = medal.scale;
    if (animate) {
      medal.setScale(0);
      this.tweens.add({ targets: medal, scale: target, delay: MEDAL_DELAY_MS, duration: 420, ease: 'Back.easeOut' });
    }
    this.tweens.add({ targets: medal, angle: { from: -6, to: 6 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const pw = 200;
    const ph = 76;
    const py = top + ch - 30 - ph / 2;
    g.fillStyle(0xfff4d6).fillRoundedRect(width / 2 - pw / 2, py - ph / 2, pw, ph, ph / 2);
    fitImage(this.add.image(width / 2 - 36, py, 'cookie'), 54);
    digits(this, width / 2 + 30, py + 2, String(this.result.cookies), 48);
  }

  private card(width: number, animate: boolean): void {
    const cw = 600;
    const ch = 330;
    const top = 36;
    const g = this.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(width / 2 - cw / 2, top + 10, cw, ch, 40);
    g.fillStyle(COLORS.white).fillRoundedRect(width / 2 - cw / 2, top, cw, ch, 40);

    // Estrellas: la central más grande y más alta; se llenan de izquierda a derecha.
    const slots = [
      { dx: -170, dy: 150, size: 130 },
      { dx: 0, dy: 130, size: 170 },
      { dx: 170, dy: 150, size: 130 },
    ];
    slots.forEach((s, i) => {
      const filled = i < this.stars;
      const star = this.add.image(width / 2 + s.dx, top + s.dy, filled ? 'star-l' : 'star-empty-l');
      fitImage(star, s.size);
      if (filled && animate) {
        const target = star.scale;
        star.setScale(0);
        this.tweens.add({ targets: star, scale: target, delay: starDelay(i), duration: 320, ease: 'Back.easeOut' });
        this.time.delayedCall(starDelay(i), () => audio.sfx('star', { index: i }));
      }
    });

    // Galletas ganadas: icono y número.
    const pw = 200;
    const ph = 76;
    const py = top + ch - 30 - ph / 2;
    g.fillStyle(0xfff4d6).fillRoundedRect(width / 2 - pw / 2, py - ph / 2, pw, ph, ph / 2);
    fitImage(this.add.image(width / 2 - 36, py, 'cookie'), 54);
    digits(this, width / 2 + 30, py + 2, String(this.result.cookies), 48);
  }

  private confetti(width: number): void {
    const rnd = new Phaser.Math.RandomDataGenerator(['confeti']);
    for (let i = 0; i < 34; i++) {
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]!;
      const x = rnd.between(20, width - 20);
      const piece = i % 3 === 0 ? this.add.circle(x, -20, 9, color) : this.add.rectangle(x, -20, 22, 12, color).setRotation(rnd.rotation());
      const startY = rnd.between(-GAME_H, -20);
      piece.y = startY;
      this.tweens.add({
        targets: piece,
        y: GROUND_TOP + 10,
        x: x + rnd.between(-80, 80),
        rotation: piece.rotation + rnd.realInRange(-4, 4),
        duration: rnd.between(2600, 4200),
        delay: rnd.between(0, 600),
        repeat: -1,
        onRepeat: () => {
          piece.y = -20;
        },
      });
    }
  }
}
