import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H, MAX_W } from '../config';
import type { ChallengeTally } from '../../learning/challenges/ladder';
import { starsFor, starsForChallenges, type Stars } from '../../learning/scoring';
import { saveActive } from '../profile/active';
import { completeLevel, markPending, session } from '../state';
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
  /** Retos del recorrido acertados a la primera (mundos que cuentan estrellas por retos). */
  challenges?: ChallengeTally;
  /** Si se superó la prueba de la bandera. Sin dato (p. ej. abriendo la escena en desarrollo), sí. */
  passed?: boolean;
}

const GROUND_TOP = 615;
const MUSIC_AFTER_STARS_MS = 900;

/** Retardo con el que aparece (y suena) la estrella `i`. */
function starDelay(i: number): number {
  return 200 + i * 180;
}
const CONFETTI_COLORS = [COLORS.coral, COLORS.yellow, COLORS.purple, COLORS.grass, 0x4da3ff];

/**
 * Celebración sin texto: confeti, estrellas, galletas ganadas y tres caminos. Si no se superó la prueba
 * de la bandera, pantalla de ánimo: sin confeti ni estrellas, el nivel queda pendiente y se puede seguir.
 */
export class LevelCompleteScene extends Phaser.Scene {
  private def!: WorldDef;
  private result!: LevelCompleteData;
  private stars: Stars = 1;

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
      challenges: data?.challenges,
      passed: data?.passed ?? true,
    };
  }

  create(): void {
    // Se guarda una sola vez al llegar, no en cada recolocación.
    const tally = this.result.challenges ?? { firstTry: 0, total: 0 };
    this.stars = this.def.stars === 'challenges' ? starsForChallenges(tally.firstTry, tally.total) : starsFor(this.result.blocksHit, this.result.blocksTotal);
    if (this.result.passed) completeLevel(session, this.def.id, this.result.level, this.stars, this.result.cookies);
    else markPending(session, this.def.id, this.result.level, this.result.cookies);
    saveActive();

    enter(this);
    this.build(this.scale.width, true);
    if (this.result.passed) {
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
    if (this.result.passed) {
      this.confetti(width);
      this.card(width, animate);
      const fox = drawFox(this, Math.max(150, width * 0.14), GROUND_TOP + 20, 'celebrate', session.hat, 210);
      this.tweens.add({ targets: fox, y: fox.y - 26, duration: 260, yoyo: true, repeat: -1, repeatDelay: 140, ease: 'Quad.easeOut' });
    } else {
      this.encouragement(width);
    }

    const y = GAME_H - 32 - 75;
    const { level } = this.result;
    const world = this.def.id;
    new RoundButton(this, width / 2 - 180, y, {
      width: 110,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-map',
      iconSize: 54,
      onTap: () => goTo(this, 'Map', { world }),
    });
    new RoundButton(this, width / 2, y, {
      width: 190,
      height: 150,
      radius: 75,
      color: COLORS.coral,
      shadowColor: COLORS.coralDark,
      shadowDepth: 10,
      icon: 'icon-next-white',
      iconSize: 88,
      onTap: () => (level < this.def.levelCount ? goTo(this, 'Level', { world, level: level + 1 }) : goTo(this, 'Map', { world })),
    });
    new RoundButton(this, width / 2 + 180, y, {
      width: 110,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-replay',
      iconSize: 54,
      onTap: () => goTo(this, 'Level', { world, level }),
    });
  }

  /** Prueba no superada: el zorro y Lalo saludan, y se ven las galletas recogidas. Sin estrellas. */
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
