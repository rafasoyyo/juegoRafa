import Phaser from 'phaser';
import { COLORS, FONT, GAME_H, INK_CSS, MAX_W } from '../config';
import { activateProfile, savedProfilesWithHat } from '../profile/active';
import { drawFox } from '../ui/characters';
import { digits, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';

const SHADOW = 0xd9cfe0;
const CARD = { w: 200, h: 250, gap: 20, cols: 4 };
/** Con la rejilla de 4×2 caben 7 perfiles y el botón «+». */
const MAX_SHOWN = CARD.cols * 2 - 1;

/** Lista de perfiles guardados: el zorro con su gorro, el alias y la edad. Un toque elige; «+» crea otro. */
export class ProfilesScene extends Phaser.Scene {
  constructor() {
    super('Profiles');
  }

  create(): void {
    enter(this);
    this.build(this.scale.width);
    onResize(this, (w) => {
      this.children.removeAll(true);
      this.build(w);
    });
  }

  private build(width: number): void {
    this.add.rectangle(0, 0, MAX_W, GAME_H, COLORS.lilacBg).setOrigin(0, 0);

    const profiles = savedProfilesWithHat().slice(0, MAX_SHOWN);
    const slots = profiles.length + 1;
    const cols = Math.min(CARD.cols, slots);
    const rows = Math.ceil(slots / cols);
    const gridW = cols * CARD.w + (cols - 1) * CARD.gap;
    const gridH = rows * CARD.h + (rows - 1) * CARD.gap;
    const x0 = (width - gridW) / 2;
    const y0 = (GAME_H - gridH) / 2;

    for (let i = 0; i < slots; i++) {
      const x = x0 + CARD.w / 2 + (i % cols) * (CARD.w + CARD.gap);
      const y = y0 + CARD.h / 2 + Math.floor(i / cols) * (CARD.h + CARD.gap);
      const p = profiles[i];
      if (p) this.profileCard(x, y, p);
      else this.addCard(x, y);
    }
  }

  private profileCard(x: number, y: number, p: { id: string; alias: string; age: number; hat: Parameters<typeof drawFox>[4] }): void {
    const card = new RoundButton(this, x, y, {
      width: CARD.w,
      height: CARD.h,
      radius: 40,
      color: COLORS.white,
      shadowColor: SHADOW,
      shadowDepth: 8,
      onTap: () => {
        if (activateProfile(p.id)) goTo(this, 'Map');
        else card.shake();
      },
    });
    const fox = drawFox(this, 0, -16, 'idle', p.hat, 120);
    const name = this.add
      .text(0, 44, p.alias, { fontFamily: FONT, fontStyle: '800', fontSize: p.alias.length > 7 ? '30px' : '42px', color: INK_CSS, padding: { top: 4, bottom: 4 } })
      .setOrigin(0.5);
    const badge = this.add.circle(0, 100, 28, COLORS.yellow);
    const age = digits(this, 0, 101, String(p.age), 38);
    card.addContent(fox, name, badge, age);
  }

  private addCard(x: number, y: number): void {
    const card = new RoundButton(this, x, y, {
      width: CARD.w,
      height: CARD.h,
      radius: 40,
      color: 0xffe9e6,
      shadowColor: COLORS.coralDark,
      shadowDepth: 8,
      onTap: () => goTo(this, 'NewProfile'),
    });
    const plus = this.add.graphics();
    plus.fillStyle(COLORS.coral).fillRoundedRect(-45, -9, 90, 18, 9).fillRoundedRect(-9, -45, 18, 90, 9);
    card.addContent(plus);
  }
}
