import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, FONT, GAME_H, INK_CSS, MAX_W } from '../config';
import { savedProfiles, startProfile } from '../profile/active';
import { guideStep, speak } from '../profile/guide-step';
import { AGE_OPTIONS, cleanAlias, isValidProfile, KEYBOARD_ROWS } from '../profile/profile-id';
import { bouncingArrow, cakeIcon, pencilIcon } from '../ui/guide-art';
import { RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';

const SHADOW = 0xd9cfe0;
const GAP = 8;

/** Nuevo perfil: alias con teclado en pantalla y edad con botones de dígitos. */
export class NewProfileScene extends Phaser.Scene {
  private alias = '';
  private age = 0;

  constructor() {
    super('NewProfile');
  }

  init(): void {
    this.alias = '';
    this.age = 0;
  }

  create(): void {
    enter(this);
    this.build(this.scale.width);
    onResize(this, (w) => this.rebuild(w));
    this.input.keyboard?.on('keydown', (ev: KeyboardEvent) => this.onKey(ev));
  }

  private rebuild(width = this.scale.width): void {
    this.tweens.killAll();
    this.children.removeAll(true);
    this.build(width);
  }

  private get valid(): boolean {
    return isValidProfile(this.alias, this.age);
  }

  private build(width: number): void {
    this.add.rectangle(0, 0, MAX_W, GAME_H, COLORS.lilacBg).setOrigin(0, 0);

    const key = width < 1200 ? 72 : 82;
    const step = key + GAP;
    const cols = KEYBOARD_ROWS[0]!.length;
    const kbW = cols * step - GAP;
    const left = 28;
    const kbTop = 260;
    const right = left + kbW + 28;

    // Alias.
    const aliasH = 104;
    const aliasY = 140;
    this.add.graphics().fillStyle(SHADOW).fillRoundedRect(left, aliasY - aliasH / 2 + 8, kbW, aliasH, 36);
    this.add.graphics().fillStyle(COLORS.white).fillRoundedRect(left, aliasY - aliasH / 2, kbW, aliasH, 36);
    const text = this.add
      .text(left + kbW / 2, aliasY, this.alias, { fontFamily: FONT, fontStyle: '800', fontSize: this.alias.length > 8 ? '56px' : '76px', color: INK_CSS, padding: { top: 6, bottom: 6 } })
      .setOrigin(0.5);
    pencilIcon(this, left + 62, aliasY, 84);
    const bar = this.add.rectangle(text.x + text.width / 2 + 10, aliasY, 6, 60, COLORS.coral).setOrigin(0, 0.5);
    this.tweens.add({ targets: bar, alpha: 0, duration: 500, yoyo: true, repeat: -1 });

    // Teclado.
    KEYBOARD_ROWS.forEach((row, r) => {
      [...row].forEach((letter, c) => {
        new RoundButton(this, left + key / 2 + c * step, kbTop + key / 2 + r * (key + GAP + 4), {
          width: key,
          height: key,
          radius: 24,
          color: COLORS.white,
          shadowColor: SHADOW,
          shadowDepth: 6,
          label: letter,
          labelSize: Math.round(key * 0.6),
          onTap: () => this.type(letter),
        });
      });
    });

    // Borrar, a la derecha del alias.
    new RoundButton(this, right + (width - right - 28) / 2, aliasY, {
      width: Math.min(width - right - 28, 2 * key + GAP),
      height: aliasH,
      radius: 36,
      color: COLORS.white,
      shadowColor: SHADOW,
      icon: 'icon-arrow-left',
      iconSize: 52,
      onTap: () => this.erase(),
    });

    // Edades en una rejilla de dos columnas, a la altura del teclado.
    AGE_OPTIONS.forEach((n, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const selected = this.age === n;
      new RoundButton(this, right + key / 2 + col * step, kbTop + key / 2 + row * (key + GAP + 4), {
        width: key,
        height: key,
        radius: 24,
        color: selected ? 0xffe9e6 : COLORS.white,
        shadowColor: SHADOW,
        shadowDepth: 6,
        border: selected ? { width: 6, color: COLORS.coral } : undefined,
        label: String(n),
        labelSize: Math.round(key * 0.65),
        onTap: () => {
          this.age = n;
          this.rebuild();
        },
      });
    });

    // Consigna visual: tarta sobre las edades y Lalo con una flecha al paso pendiente.
    const gridW = 2 * key + GAP;
    const gridCx = right + gridW / 2;
    cakeIcon(this, gridCx, kbTop - 26, 56);
    this.guide(width, { aliasCx: left + kbW / 2, aliasTop: aliasY - aliasH / 2, gridCx, gridBottom: kbTop + 3 * key + 2 * (GAP + 4) });

    // Aceptar, apagado hasta tener alias y edad.
    const ok = new RoundButton(this, width - 28 - 110, GAME_H - 28 - 8 - 50, {
      width: 220,
      height: 100,
      radius: 50,
      color: COLORS.coral,
      shadowColor: COLORS.coralDark,
      icon: 'icon-check-white',
      iconSize: 60,
      onTap: () => this.accept(ok),
    });
    if (!this.valid) ok.face.setAlpha(0.35);

    // Volver a la lista, solo si hay perfiles guardados.
    if (savedProfiles().length > 0) {
      new RoundButton(this, 28 + 48, GAME_H - 28 - 8 - 48, {
        width: 96,
        color: COLORS.white,
        shadowColor: SHADOW,
        icon: 'icon-arrow-left',
        iconSize: 50,
        onTap: () => goTo(this, 'Profiles'),
      });
    }
  }

  /** Lalo, abajo en el centro, y una flecha que apunta al paso pendiente. Tocar a Lalo repite la consigna. */
  private guide(width: number, p: { aliasCx: number; aliasTop: number; gridCx: number; gridBottom: number }): void {
    const step = guideStep(this.alias, this.age);
    const lalo = this.add.image(width / 2 - 60, GAME_H - 160, 'lalo').setOrigin(0, 0).setScale(1.4);
    lalo.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      lalo.setTexture('lalo-blink');
      this.time.delayedCall(160, () => lalo.setTexture('lalo'));
      this.tweens.add({ targets: lalo, y: lalo.y - 18, duration: 150, yoyo: true, ease: 'Quad.easeOut' });
      speak(step);
    });
    if (step === 'alias') bouncingArrow(this, p.aliasCx, p.aliasTop - 62, 'down');
    else if (step === 'age') bouncingArrow(this, p.gridCx, p.gridBottom + 36, 'up');
    else bouncingArrow(this, width - 28 - 110, GAME_H - 28 - 8 - 130, 'down');
  }

  private type(letter: string): void {
    const next = cleanAlias(this.alias + letter);
    if (next === this.alias) return;
    this.alias = next;
    this.rebuild();
  }

  private erase(): void {
    if (!this.alias) return;
    this.alias = [...this.alias].slice(0, -1).join('');
    this.rebuild();
  }

  private accept(button?: RoundButton): void {
    if (!this.valid) return;
    if (!startProfile(this.alias, this.age)) {
      button?.shake();
      return;
    }
    audio.sfx('prize');
    goTo(this, 'Map');
  }

  private onKey(ev: KeyboardEvent): void {
    if (ev.key === 'Backspace') this.erase();
    else if (ev.key === 'Enter') this.accept();
    else if (ev.key.length === 1 && ev.key >= '3' && ev.key <= '8') {
      this.age = Number(ev.key);
      this.rebuild();
    } else if (ev.key.length === 1 && cleanAlias(ev.key)) this.type(cleanAlias(ev.key));
  }
}
