import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { buyHat, HAT_PRICES, HATS, session, type HatId } from '../state';
import { drawFox, hatTexture } from '../ui/characters';
import { digits, fitImage, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { cookieCounter } from '../ui/widgets';

const PANEL = { x: 28, y: 28, w: 400, h: 664, groundTop: 530 };
const COL_X = PANEL.x + PANEL.w + 32;
const SHADOW = 0xd9cfe0;

/** Mi personaje: escaparate del zorro y rejilla de gorros que se compran con galletas. */
export class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('Wardrobe');
  }

  create(): void {
    enter(this);
    this.build(this.scale.width);
    onResize(this, (w) => this.rebuild(w));
  }

  private rebuild(width = this.scale.width): void {
    this.tweens.killAll();
    this.children.removeAll(true);
    this.build(width);
  }

  private build(width: number): void {
    this.add.rectangle(0, 0, MAX_W, GAME_H, COLORS.lilacBg).setOrigin(0, 0);

    // Escaparate.
    this.add.image(PANEL.x, PANEL.y, 'showcase').setOrigin(0, 0);
    this.add.image(PANEL.x + 140, PANEL.y + 130, 'cloud').setScale(0.85);
    const fox = drawFox(this, PANEL.x + PANEL.w / 2, PANEL.y + PANEL.groundTop + 14, 'idle', session.hat, 320);
    this.tweens.add({ targets: fox, scaleY: 1.025, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Arriba: volver y galletas.
    new RoundButton(this, COL_X + 48, 28 + 48, {
      width: 96,
      color: COLORS.white,
      shadowColor: SHADOW,
      icon: 'icon-arrow-left',
      iconSize: 50,
      onTap: () => goTo(this, 'Map'),
    });
    const counter = cookieCounter(this, 0, 28 + 48, session.cookies, SHADOW);
    counter.container.x = width - 28 - counter.width / 2;

    this.buildCategories();
    this.buildGrid(width);

    new RoundButton(this, width - 28 - 110, GAME_H - 28 - 8 - 50, {
      width: 220,
      height: 100,
      radius: 50,
      color: COLORS.coral,
      shadowColor: COLORS.coralDark,
      icon: 'icon-check-white',
      iconSize: 60,
      onTap: () => goTo(this, 'Map'),
    });
  }

  private buildCategories(): void {
    const cats: { icon: string; active?: boolean }[] = [{ icon: 'hat-cap', active: true }, { icon: 'icon-glasses' }, { icon: 'icon-cape' }, { icon: 'icon-colors' }];
    cats.forEach((c, i) => {
      const btn = new RoundButton(this, COL_X + 48 + i * (96 + 16), 176, {
        width: 96,
        height: 96,
        radius: 30,
        color: c.active ? 0xffe9e6 : COLORS.white,
        shadowColor: SHADOW,
        shadowDepth: 6,
        border: c.active ? { width: 5, color: COLORS.coral } : undefined,
        icon: c.icon,
        iconSize: 58,
        onTap: () => {
          if (!c.active) btn.shake();
        },
      });
      if (!c.active) btn.face.setAlpha(0.45);
    });
  }

  private buildGrid(width: number): void {
    const gap = 20;
    const avail = width - 28 - COL_X;
    const cellW = Math.min(200, Math.floor((avail - gap * 2) / 3));
    const cellH = 150;
    const top = 256;

    HATS.forEach((hat, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = COL_X + cellW / 2 + col * (cellW + gap);
      const y = top + cellH / 2 + row * (cellH + gap + 6);
      const owned = session.ownedHats.has(hat);
      const worn = session.hat === hat;

      const cell = new RoundButton(this, x, y, {
        width: cellW,
        height: cellH,
        radius: 34,
        color: owned ? COLORS.white : 0xece7f7,
        shadowColor: SHADOW,
        shadowDepth: 6,
        border: worn ? { width: 6, color: COLORS.grass } : undefined,
        onTap: () => this.choose(hat, cell),
      });

      const icon = this.add.image(0, owned ? 0 : -16, hat === 'none' ? 'icon-no-hat' : hatTexture(hat, 0));
      fitImage(icon, hat === 'none' ? 72 : owned ? 96 : 80);
      if (!owned) icon.setAlpha(0.45);
      cell.addContent(icon);

      if (worn) {
        const badge = this.add.circle(cellW / 2 - 12, -cellH / 2 + 12, 24, COLORS.grass);
        const check = fitImage(this.add.image(badge.x, badge.y, 'icon-check-white'), 30);
        cell.addContent(badge, check);
      }
      if (!owned) {
        const pw = 112;
        const ph = 44;
        const pill = this.add.graphics();
        pill.fillStyle(COLORS.white).fillRoundedRect(-pw / 2, cellH / 2 - 14 - ph, pw, ph, ph / 2);
        const py = cellH / 2 - 14 - ph / 2;
        const cookie = fitImage(this.add.image(-24, py, 'cookie'), 30);
        const price = digits(this, 16, py + 1, String(HAT_PRICES[hat]), 30);
        cell.addContent(pill, cookie, price);
      }
    });
  }

  private choose(hat: HatId, cell: RoundButton): void {
    if (buyHat(session, hat)) this.rebuild();
    else cell.shake();
  }
}
