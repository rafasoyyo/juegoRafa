/**
 * Lalo volando por el nivel: sale de su sitio del HUD, va a un punto del mundo, señala con una flecha
 * que bota y vuelve. Mientras vuela, el Lalo del HUD se oculta para que solo haya uno.
 */

import Phaser from 'phaser';
import { COLORS } from '../config';

const DEPTH = 20;
const FLY_MS = 650;
/** Lalo del HUD: esquina superior izquierda en pantalla y tamaño de la imagen. */
const HUD_AT = { x: 32, y: 140, w: 84, h: 95 };

export class LaloFlyer {
  private lalo?: Phaser.GameObjects.Image;
  private arrow?: Phaser.GameObjects.Graphics;
  private flap?: Phaser.Tweens.Tween;

  constructor(
    private readonly scene: Phaser.Scene,
    /** Imagen de Lalo del HUD (se oculta mientras vuela). */
    private readonly hudLalo: () => Phaser.GameObjects.Image | undefined,
  ) {}

  get flying(): boolean {
    return this.lalo !== undefined;
  }

  private hudPoint(): { x: number; y: number } {
    const cam = this.scene.cameras.main;
    return { x: cam.scrollX + HUD_AT.x + HUD_AT.w / 2, y: cam.scrollY + HUD_AT.y + HUD_AT.h / 2 };
  }

  /** Vuela hasta (x, y) del mundo (el centro de Lalo) y llama a `then` al llegar. */
  flyTo(x: number, y: number, then?: () => void): void {
    this.clearArrow();
    if (!this.lalo) {
      const from = this.hudPoint();
      this.lalo = this.scene.add.image(from.x, from.y, 'lalo').setDepth(DEPTH);
      this.hudLalo()?.setAlpha(0);
    }
    this.scene.tweens.killTweensOf(this.lalo);
    this.flap = this.scene.tweens.add({ targets: this.lalo, scaleY: 0.92, duration: 140, yoyo: true, repeat: -1 });
    this.lalo.setFlipX(x < this.lalo.x);
    this.scene.tweens.add({ targets: this.lalo, x, y, duration: FLY_MS, ease: 'Sine.easeInOut', onComplete: () => then?.() });
  }

  /** Flecha que bota sobre (x, y), apuntando hacia abajo, con Lalo al lado. */
  point(x: number, y: number): void {
    this.flyTo(x + 70, y - 60, () => {
      this.clearArrow();
      const g = this.scene.add.graphics().setDepth(DEPTH);
      g.fillStyle(COLORS.coralDark).fillTriangle(-22, -30 + 4, 22, -30 + 4, 0, 4);
      g.fillStyle(COLORS.coral).fillTriangle(-22, -30, 22, -30, 0, 0);
      g.fillStyle(COLORS.coral).fillRoundedRect(-9, -62, 18, 36, 6);
      g.setPosition(x, y);
      this.arrow = g;
      this.scene.tweens.add({ targets: g, y: y - 16, duration: 320, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  }

  /** Vuelve a su sitio del HUD y desaparece. */
  home(): void {
    this.clearArrow();
    const lalo = this.lalo;
    if (!lalo) return;
    const to = this.hudPoint();
    this.scene.tweens.killTweensOf(lalo);
    lalo.setFlipX(to.x < lalo.x);
    this.scene.tweens.add({
      targets: lalo,
      x: to.x,
      y: to.y,
      duration: FLY_MS,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        lalo.destroy();
        if (!this.lalo) this.hudLalo()?.setAlpha(1);
      },
    });
    this.lalo = undefined;
    this.flap?.stop();
  }

  private clearArrow(): void {
    if (!this.arrow) return;
    this.scene.tweens.killTweensOf(this.arrow);
    this.arrow.destroy();
    this.arrow = undefined;
  }
}
