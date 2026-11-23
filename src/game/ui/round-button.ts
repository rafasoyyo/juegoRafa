import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { FONT, INK_CSS } from '../config';

export interface RoundButtonOptions {
  /** Ancho en px lógicos. Sin `height` ni `radius` el botón es un círculo. */
  width: number;
  height?: number;
  radius?: number;
  color: number;
  shadowColor: number;
  /** Altura de la sombra inferior; al pulsar, la cara baja casi todo ese espacio. */
  shadowDepth?: number;
  border?: { width: number; color: number };
  icon?: string;
  iconSize?: number;
  /** Solo dígitos o símbolos de mundo (`123`, `Aa`): nunca palabras. */
  label?: string;
  labelSize?: number;
  labelColor?: string;
  onTap?: () => void;
  /** `false` para botones que controla otra lógica (p. ej. `TouchControls`). */
  interactive?: boolean;
  /** `false` para no sonar con el «pop» al pulsarlo. */
  sound?: boolean;
}

/**
 * Botón redondeado con sombra sólida que se hunde al pulsarlo.
 * La cara (`face`) es un contenedor: lo que se añade con `addContent` baja con ella.
 */
export class RoundButton extends Phaser.GameObjects.Container {
  readonly face: Phaser.GameObjects.Container;
  readonly btnWidth: number;
  readonly btnHeight: number;
  private readonly depthPx: number;
  private pressed = false;
  private shakeTween: Phaser.Tweens.Tween | undefined;
  private shakeBaseX = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, private readonly opts: RoundButtonOptions) {
    super(scene, x, y);
    const w = opts.width;
    const h = opts.height ?? w;
    const r = opts.radius ?? Math.min(w, h) / 2;
    this.btnWidth = w;
    this.btnHeight = h;
    this.depthPx = opts.shadowDepth ?? 8;

    const shadow = scene.add.graphics();
    shadow.fillStyle(opts.shadowColor);
    fillShape(shadow, w, h, r, this.depthPx);

    this.face = scene.add.container(0, 0);
    const faceGfx = scene.add.graphics();
    faceGfx.fillStyle(opts.color);
    fillShape(faceGfx, w, h, r, 0);
    if (opts.border) {
      const bw = opts.border.width;
      faceGfx.lineStyle(bw, opts.border.color);
      if (isCircle(w, h, r)) faceGfx.strokeCircle(0, 0, w / 2 - bw / 2);
      else faceGfx.strokeRoundedRect(-w / 2 + bw / 2, -h / 2 + bw / 2, w - bw, h - bw, Math.max(0, r - bw / 2));
    }
    this.face.add(faceGfx);

    if (opts.icon) {
      const icon = scene.add.image(0, 0, opts.icon);
      if (opts.iconSize) fitImage(icon, opts.iconSize);
      this.face.add(icon);
    }
    if (opts.label) {
      const size = opts.labelSize ?? Math.round(h * 0.55);
      this.face.add(digits(scene, 0, 0, opts.label, size, opts.labelColor ?? INK_CSS));
    }

    this.add([shadow, this.face]);
    scene.add.existing(this);

    if (opts.interactive !== false) {
      this.setSize(w, h + this.depthPx);
      this.setInteractive({ useHandCursor: true });
      this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.setPressed(true);
        if (this.opts.sound !== false) audio.sfx('tap');
      });
      this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this.setPressed(false));
      this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (!this.pressed) return;
        this.setPressed(false);
        this.opts.onTap?.();
      });
    }
  }

  addContent(...items: Phaser.GameObjects.GameObject[]): this {
    this.face.add(items);
    return this;
  }

  setPressed(pressed: boolean): this {
    if (pressed === this.pressed) return this;
    this.pressed = pressed;
    this.face.y = pressed ? Math.round(this.depthPx * 0.75) : 0;
    return this;
  }

  /** Temblor corto para indicar «todavía no se puede». */
  shake(): void {
    audio.sfx('nope');
    if (this.shakeTween?.isPlaying()) {
      this.shakeTween.stop();
      this.x = this.shakeBaseX;
    }
    this.shakeBaseX = this.x;
    this.shakeTween = this.scene.tweens.add({
      targets: this,
      x: this.shakeBaseX + 10,
      duration: 45,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.x = this.shakeBaseX;
      },
    });
  }
}

function isCircle(w: number, h: number, r: number): boolean {
  return w === h && r >= w / 2;
}

function fillShape(g: Phaser.GameObjects.Graphics, w: number, h: number, r: number, dy: number): void {
  if (isCircle(w, h, r)) g.fillCircle(0, dy, w / 2);
  else g.fillRoundedRect(-w / 2, -h / 2 + dy, w, h, Math.min(r, w / 2, h / 2));
}

/** Ajusta una imagen para que su lado mayor mida `size`. */
export function fitImage<T extends Phaser.GameObjects.Image>(img: T, size: number): T {
  const max = Math.max(img.width, img.height);
  if (max > 0) img.setScale(size / max);
  return img;
}

/** Texto con la tipografía del juego. Solo para dígitos y símbolos. */
export function digits(scene: Phaser.Scene, x: number, y: number, text: string, size: number, color = INK_CSS): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, text, { fontFamily: FONT, fontStyle: '800', fontSize: `${size}px`, color, padding: { top: 4, bottom: 4 } })
    .setOrigin(0.5, 0.5);
}
