import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { starsFor, type Stars } from '../../learning/scoring';
import { completeLevel, LEVEL_COUNT, session } from '../state';
import { drawFox } from '../ui/characters';
import { digits, fitImage, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { addSky, drawGround } from '../ui/widgets';

export interface LevelCompleteData {
  level: number;
  blocksHit: number;
  blocksTotal: number;
  cookies: number;
}

const GROUND_TOP = 615;
const CONFETTI_COLORS = [COLORS.coral, COLORS.yellow, COLORS.purple, COLORS.grass, 0x4da3ff];

/** Celebración sin texto: confeti, estrellas, galletas ganadas y tres caminos. */
export class LevelCompleteScene extends Phaser.Scene {
  private result!: LevelCompleteData;
  private stars: Stars = 1;

  constructor() {
    super('LevelComplete');
  }

  init(data: LevelCompleteData): void {
    this.result = {
      level: data?.level ?? 1,
      blocksHit: data?.blocksHit ?? 0,
      blocksTotal: data?.blocksTotal ?? 0,
      cookies: data?.cookies ?? 0,
    };
  }

  create(): void {
    // Se guarda una sola vez al llegar, no en cada recolocación.
    this.stars = starsFor(this.result.blocksHit, this.result.blocksTotal);
    completeLevel(session, this.result.level, this.stars, this.result.cookies);

    enter(this);
    this.build(this.scale.width, true);
    onResize(this, (w) => {
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.children.removeAll(true);
      this.build(w, false);
    });
  }

  private build(width: number, animate: boolean): void {
    addSky(this);
    drawGround(this, 0, MAX_W, GROUND_TOP, 30);
    this.confetti(width);
    this.card(width, animate);

    const fox = drawFox(this, Math.max(150, width * 0.14), GROUND_TOP + 20, 'celebrate', session.hat, 210);
    this.tweens.add({ targets: fox, y: fox.y - 26, duration: 260, yoyo: true, repeat: -1, repeatDelay: 140, ease: 'Quad.easeOut' });

    const y = GAME_H - 32 - 75;
    const { level } = this.result;
    new RoundButton(this, width / 2 - 180, y, {
      width: 110,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-map',
      iconSize: 54,
      onTap: () => goTo(this, 'Map'),
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
      onTap: () => (level < LEVEL_COUNT ? goTo(this, 'Level', { level: level + 1 }) : goTo(this, 'Map')),
    });
    new RoundButton(this, width / 2 + 180, y, {
      width: 110,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-replay',
      iconSize: 54,
      onTap: () => goTo(this, 'Level', { level }),
    });
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
        this.tweens.add({ targets: star, scale: target, delay: 200 + i * 180, duration: 320, ease: 'Back.easeOut' });
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
