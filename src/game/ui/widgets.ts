import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { digits, fitImage } from './round-button';

/** Fondo de cielo en degradado, fijo a la cámara y del ancho máximo (no hay que recolocarlo). */
export function addSky(scene: Phaser.Scene, key = 'sky'): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, key).setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
}

/** Suelo de hierba sobre tierra. */
export function drawGround(scene: Phaser.Scene, x: number, width: number, top: number, grass = 36): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.earth).fillRect(x, top, width, GAME_H - top + 40);
  g.fillStyle(COLORS.grassDark).fillRect(x, top, width, grass + 6);
  g.fillStyle(COLORS.grass).fillRect(x, top, width, grass);
  return g;
}

/** Colinas redondeadas que asoman por detrás del suelo. */
export function drawHills(scene: Phaser.Scene, groundTop: number, from: number, to: number, step: number, color: number, scrollFactor = 1, phase = 0): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics().setScrollFactor(scrollFactor, 1);
  g.fillStyle(color);
  for (let x = from + phase; x < to; x += step) {
    g.fillEllipse(x, groundTop + 100, step * 1.1, 420);
  }
  return g;
}

export function addClouds(scene: Phaser.Scene, from: number, to: number, step: number, scrollFactor: number): void {
  const ys = [150, 200, 120, 180];
  let i = 0;
  for (let x = from; x < to; x += step) {
    scene.add
      .image(x, ys[i % ys.length] ?? 150, 'cloud')
      .setScale(0.8 + (i % 3) * 0.15)
      .setScrollFactor(scrollFactor, 1);
    i++;
  }
}

export interface CoinCounter {
  container: Phaser.GameObjects.Container;
  setValue(value: number): void;
  readonly width: number;
}

/** Píldora blanca con una moneda y un número. (x, y) es su centro. */
export function coinCounter(scene: Phaser.Scene, x: number, y: number, value: number, shadowColor: number = COLORS.shadow): CoinCounter {
  const h = 80;
  const minW = 170;
  const container = scene.add.container(x, y);
  const g = scene.add.graphics();
  const coin = fitImage(scene.add.image(0, 0, 'coin'), 46);
  const text = digits(scene, 0, 0, String(value), 42);
  container.add([g, coin, text]);

  const counter = {
    container,
    width: minW,
    setValue(v: number): void {
      text.setText(String(v));
      const w = Math.max(minW, 28 + 46 + 14 + text.width + 28);
      counter.width = w;
      g.clear();
      g.fillStyle(shadowColor).fillRoundedRect(-w / 2, -h / 2 + 6, w, h, h / 2);
      g.fillStyle(COLORS.white).fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
      coin.setPosition(-w / 2 + 28 + 23, 0);
      text.setOrigin(0, 0.5).setPosition(coin.x + 23 + 14, 2);
    },
  };
  counter.setValue(value);
  return counter;
}

/** Fija a la cámara un objeto y, si es un contenedor, todo lo que contiene. */
export function fixToCamera<T extends Phaser.GameObjects.GameObject>(obj: T): T {
  const sf = obj as unknown as { setScrollFactor?: (x: number, y?: number) => unknown };
  sf.setScrollFactor?.(0, 0);
  if (obj instanceof Phaser.GameObjects.Container) obj.each((child: Phaser.GameObjects.GameObject) => fixToCamera(child));
  return obj;
}

/** Pequeño salto de escala para celebrar un cambio. */
export function bump(scene: Phaser.Scene, target: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject): void {
  scene.tweens.add({ targets: target, scale: 1.15, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
}
