import Phaser from 'phaser';
import { COLORS } from '../config';
import type { HatId } from '../state';
import { RoundButton } from './round-button';

export type FoxPose = 'idle' | 'run' | 'jump' | 'celebrate';

/** Lado de la caja del dibujo del zorro (viewBox 120×120). */
export const FOX_UNITS = 120;
/** Tamaño a partir del cual se usan las texturas grandes. */
const LARGE_FROM = 180;

/**
 * Punto de la cabeza donde se apoya la base del gorro en cada pose, en unidades del zorro,
 * relativo al origen del zorro (centro de la base de los pies).
 */
export const HAT_OFFSETS: Readonly<Record<FoxPose, { x: number; y: number; angle: number }>> = {
  idle: { x: 0, y: -77, angle: 0 },
  // Mismo dibujo que `idle` sin pies y subido 10 unidades.
  run: { x: 0, y: -87, angle: 0 },
  jump: { x: 0, y: -77, angle: 0 },
  celebrate: { x: 0, y: -77, angle: -4 },
};

/**
 * Encaje de cada gorro (caja de 64): altura de su base y escala en unidades del zorro
 * por unidad del gorro.
 */
const HAT_FIT: Readonly<Record<Exclude<HatId, 'none'>, { base: number; sx: number; sy: number }>> = {
  cap: { base: 46, sx: 1.45, sy: 0.85 },
  wool: { base: 52, sx: 1.4, sy: 0.9 },
  party: { base: 54, sx: 1.0, sy: 0.9 },
  helmet: { base: 51, sx: 1.35, sy: 0.85 },
  crown: { base: 54, sx: 1.1, sy: 1.0 },
};

export function foxTexture(pose: FoxPose, size: number): string {
  return size >= LARGE_FROM ? `fox-${pose}-l` : `fox-${pose}`;
}

export function hatTexture(hat: Exclude<HatId, 'none'>, size: number): string {
  return size >= LARGE_FROM ? `hat-${hat}-l` : `hat-${hat}`;
}

/** Crea la imagen del gorro (invisible si no lleva) para colocarla luego con `placeHat`. */
export function makeHat(scene: Phaser.Scene, hat: HatId, foxSize: number): Phaser.GameObjects.Image {
  if (hat === 'none') return scene.add.image(0, 0, '__DEFAULT').setVisible(false).setData('hat', hat);
  const fit = HAT_FIT[hat];
  return scene.add
    .image(0, 0, hatTexture(hat, foxSize))
    .setOrigin(0.5, fit.base / 64)
    .setData('hat', hat);
}

/**
 * Coloca el gorro sobre la cabeza del zorro copiando su posición, giro y escala.
 * `fox` debe tener origen (0.5, 1). `faceLeft` voltea el gorro (la visera mira hacia donde va).
 */
export function placeHat(hatImg: Phaser.GameObjects.Image, fox: Phaser.GameObjects.Image, pose: FoxPose, faceLeft = false): void {
  const hat = hatImg.getData('hat') as HatId;
  if (hat === 'none') return;
  const fit = HAT_FIT[hat];
  const off = HAT_OFFSETS[pose];
  const ux = fox.displayWidth / FOX_UNITS;
  const uy = fox.displayHeight / FOX_UNITS;
  const dir = faceLeft ? -1 : 1;
  const lx = off.x * ux * dir;
  const ly = off.y * uy;
  const cos = Math.cos(fox.rotation);
  const sin = Math.sin(fox.rotation);
  const texScale = 64 / hatImg.frame.width;
  hatImg
    .setPosition(fox.x + lx * cos - ly * sin, fox.y + lx * sin + ly * cos)
    .setRotation(fox.rotation + Phaser.Math.DegToRad(off.angle * dir))
    .setScale(fit.sx * ux * texScale, fit.sy * uy * texScale)
    .setFlipX(faceLeft);
}

/**
 * Zorro estático con gorro, para el mapa, la celebración, el armario y el inicio.
 * (x, y) es el centro de la base de los pies; `size` es el lado del dibujo en px.
 */
export function drawFox(scene: Phaser.Scene, x: number, y: number, pose: FoxPose, hat: HatId, size: number): Phaser.GameObjects.Container {
  const fox = scene.add.image(0, 0, foxTexture(pose, size)).setOrigin(0.5, 1);
  fox.setScale(size / fox.width);
  const hatImg = makeHat(scene, hat, size);
  placeHat(hatImg, fox, pose);
  return scene.add.container(x, y, [fox, hatImg]);
}

/**
 * Lalo el búho con su botón de altavoz. Tocar a Lalo o el altavoz le hace saltar y parpadear.
 * Hasta la fase 2 no suena nada. (x, y) es la esquina superior izquierda.
 */
export function drawLalo(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const lalo = scene.add.image(0, 0, 'lalo').setOrigin(0, 0);
  const container = scene.add.container(x, y);

  let busy = false;
  const blink = (): void => {
    lalo.setTexture('lalo-blink');
    scene.time.delayedCall(160, () => lalo.setTexture('lalo'));
  };
  const react = (): void => {
    blink();
    if (busy) return;
    busy = true;
    scene.tweens.add({
      targets: lalo,
      y: -18,
      duration: 150,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => {
        lalo.y = 0;
        busy = false;
      },
    });
  };

  const speaker = new RoundButton(scene, lalo.width + 12 + 48, 50, {
    width: 96,
    color: COLORS.purpleSoft,
    shadowColor: 0xcabcf0,
    icon: 'icon-speaker',
    iconSize: 50,
    onTap: react,
  });
  lalo.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, react);
  container.add([lalo, speaker]);

  // Parpadeo espontáneo de vez en cuando.
  scene.time.addEvent({ delay: 3800, loop: true, callback: blink });
  return container;
}
