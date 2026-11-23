import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { skyKey, type Ambient } from '../levels/ambients';
import { digits, fitImage } from './round-button';

/** Fondo de cielo en degradado, fijo a la cámara y del ancho máximo (no hay que recolocarlo). */
export function addSky(scene: Phaser.Scene, key = 'sky'): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, key).setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
}

/** Colores del suelo: los de la paleta salvo en los ambientes de los niveles. */
export interface GroundColors {
  grass: number;
  grassDark: number;
  earth: number;
}

/** Suelo de hierba sobre tierra. */
export function drawGround(scene: Phaser.Scene, x: number, width: number, top: number, grass = 36, colors: GroundColors = COLORS): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(colors.earth).fillRect(x, top, width, GAME_H - top + 40);
  g.fillStyle(colors.grassDark).fillRect(x, top, width, grass + 6);
  g.fillStyle(colors.grass).fillRect(x, top, width, grass);
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

export function addClouds(scene: Phaser.Scene, from: number, to: number, step: number, scrollFactor: number, style = { tint: 0xffffff, alpha: 1 }): void {
  const ys = [150, 200, 120, 180];
  let i = 0;
  for (let x = from; x < to; x += step) {
    scene.add
      .image(x, ys[i % ys.length] ?? 150, 'cloud')
      .setScale(0.8 + (i % 3) * 0.15)
      .setScrollFactor(scrollFactor, 1)
      .setTint(style.tint)
      .setAlpha(style.alpha);
    i++;
  }
}

/** Número pseudoaleatorio fijo (0-1) para repartir la decoración igual cada vez. */
function jitter(i: number, salt = 0): number {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/** Paralaje y opacidad de la decoración: más lenta que el suelo y más apagada que el recorrido. */
const DECOR_SCROLL = 0.52;
const DECOR_ALPHA = 0.72;

/**
 * Escenario completo de un nivel con su ambiente, de atrás adelante: cielo, sol o luna y estrellas,
 * nubes, colinas lejanas, decoración, colinas cercanas y suelo. Con el prado queda igual que el
 * escenario de siempre (nubes, dos capas de colinas y suelo con los colores de la paleta).
 */
export function addScenery(scene: Phaser.Scene, ambient: Ambient, worldW: number, groundTop: number): void {
  addSky(scene, skyKey(ambient.id));

  if (ambient.decor === 'sunset') {
    scene.add.image(MAX_W * 0.62, groundTop - 90, 'decor-sun').setScrollFactor(0.03, 1);
  }
  if (ambient.decor === 'night') {
    scene.add.image(MAX_W * 0.72, 220, 'decor-moon').setScrollFactor(0.03, 1);
    addStars(scene, worldW * 0.1 + MAX_W);
  }

  addClouds(scene, 120, worldW * 0.3 + MAX_W, 520, 0.3, ambient.cloud);
  drawHills(scene, groundTop, -200, worldW * 0.45 + MAX_W, 900, ambient.hillLight, 0.45);

  const decorTo = worldW * DECOR_SCROLL + MAX_W;
  if (ambient.decor === 'trees' || ambient.decor === 'autumn-trees') {
    const key = ambient.decor === 'trees' ? 'decor-tree' : 'decor-tree-autumn';
    for (let i = 0, x = 60; x < decorTo; i++, x += 260 + jitter(i) * 260) {
      scene.add
        .image(x, groundTop - 10 + jitter(i, 1) * 30, key)
        .setOrigin(0.5, 1)
        .setScale(0.75 + jitter(i, 2) * 0.4)
        .setScrollFactor(DECOR_SCROLL, 1)
        .setAlpha(DECOR_ALPHA);
    }
  }
  const near = { groundTop: groundTop + 30, from: -200, step: 800, phase: 420, scroll: 0.6 };
  drawHills(scene, near.groundTop, near.from, worldW * near.scroll + MAX_W, near.step, ambient.hill, near.scroll, near.phase);
  if (ambient.decor === 'flowers') {
    // Matas de flores plantadas en la cima de las colinas cercanas (se mueven con ellas).
    for (let i = 0, x = 40; x < worldW * near.scroll + MAX_W; i++, x += 150 + jitter(i) * 200) {
      const top = hillTop(x, near);
      if (top > groundTop - 40) continue;
      scene.add
        .image(x, top + 14, 'decor-flowers')
        .setOrigin(0.5, 1)
        .setScale(0.75 + jitter(i, 2) * 0.35)
        .setScrollFactor(near.scroll, 1)
        .setAlpha(0.85);
    }
  }
  drawGround(scene, 0, worldW, groundTop, 36, ambient);
}

/** Altura (`y`) de la cima de una capa de colinas de `drawHills` en `x`. */
function hillTop(x: number, hills: { groundTop: number; from: number; step: number; phase: number }): number {
  const first = hills.from + hills.phase;
  const k = Math.round((x - first) / hills.step);
  const dx = x - (first + k * hills.step);
  const rx = (hills.step * 1.1) / 2;
  return hills.groundTop + 100 - 210 * Math.sqrt(Math.max(0, 1 - (dx / rx) ** 2));
}

/** Estrellas de la noche: muy lentas, y una de cada tres titila despacio. */
function addStars(scene: Phaser.Scene, to: number): void {
  for (let i = 0, x = 30; x < to; i++, x += 70 + jitter(i) * 70) {
    const star = scene.add
      .image(x, 30 + jitter(i, 1) * 330, 'decor-star')
      .setScale(0.5 + jitter(i, 2) * 0.6)
      .setScrollFactor(0.1, 1)
      .setAlpha(0.85);
    if (i % 3 === 0) {
      scene.tweens.add({ targets: star, alpha: 0.3, duration: 1600 + jitter(i, 3) * 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: jitter(i, 4) * 2000 });
    }
  }
}

export interface CookieCounter {
  container: Phaser.GameObjects.Container;
  setValue(value: number): void;
  readonly width: number;
}

/** Píldora blanca con una galleta y un número. (x, y) es su centro. */
export function cookieCounter(scene: Phaser.Scene, x: number, y: number, value: number, shadowColor: number = COLORS.shadow): CookieCounter {
  const h = 80;
  const minW = 170;
  const container = scene.add.container(x, y);
  const g = scene.add.graphics();
  const cookie = fitImage(scene.add.image(0, 0, 'cookie'), 46);
  const text = digits(scene, 0, 0, String(value), 42);
  container.add([g, cookie, text]);

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
      cookie.setPosition(-w / 2 + 28 + 23, 0);
      text.setOrigin(0, 0.5).setPosition(cookie.x + 23 + 14, 2);
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

/** Grosor dibujado de una plataforma (su cuerpo físico es algo más grueso, ver `LevelScene`). */
export const PLATFORM_THICKNESS = 36;

/** Escalón: tierra con hierba encima, esquinas de arriba redondeadas; llega hasta dentro del suelo. */
export function drawStep(scene: Phaser.Scene, x: number, width: number, top: number, groundTop: number, colors: GroundColors): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const h = groundTop - top + 20;
  const r = { tl: 18, tr: 18, bl: 0, br: 0 };
  g.fillStyle(colors.earth).fillRoundedRect(x, top, width, h, r);
  g.fillStyle(colors.grassDark).fillRoundedRect(x, top, width, 30, r);
  g.fillStyle(colors.grass).fillRoundedRect(x, top, width, 24, r);
  // Piedrecitas en la tierra para que se lea como un bloque de suelo y no como una pared lisa.
  g.fillStyle(colors.grassDark, 0.25);
  for (let px = x + 30; px < x + width - 20; px += 70) g.fillCircle(px, top + 44 + ((px / 70) % 2) * 12, 6);
  return g;
}

/** Plataforma de un solo sentido: un tronco con musgo encima o una nube mullida, según el ambiente. */
export function drawPlatform(scene: Phaser.Scene, x: number, width: number, top: number, ambient: Ambient): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const h = PLATFORM_THICKNESS;
  if (ambient.platform === 'cloud') {
    g.fillStyle(0xd9cfe0).fillRoundedRect(x, top + 6, width, h, h / 2);
    for (let px = x + 26; px < x + width - 10; px += 40) g.fillCircle(px, top + h - 2, 16);
    g.fillStyle(COLORS.white).fillRoundedRect(x, top, width, h - 4, (h - 4) / 2);
    for (let px = x + 26; px < x + width - 10; px += 40) g.fillCircle(px, top + h - 10, 14);
    return g;
  }
  g.fillStyle(0x7d5432).fillRoundedRect(x, top + 4, width, h, h / 2);
  g.fillStyle(0x9a6a3f).fillRoundedRect(x, top, width, h, h / 2);
  g.fillStyle(0xb07d4c).fillRoundedRect(x + 22, top + 14, width - 44, 6, 3);
  // Corte del tronco (anillos) en los dos extremos.
  for (const cx of [x + h / 2, x + width - h / 2]) {
    g.fillStyle(0xd9a66a).fillCircle(cx, top + h / 2, h / 2 - 3);
    g.fillStyle(0xb07d4c).fillCircle(cx, top + h / 2, h / 4);
  }
  // Musgo del color de la hierba del ambiente.
  g.fillStyle(ambient.grass).fillRoundedRect(x + 10, top - 4, width - 20, 12, 6);
  return g;
}
