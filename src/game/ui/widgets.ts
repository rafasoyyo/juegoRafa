import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { INK, mixColor, pitWall, skyKey, type Ambient, type GroundStyle } from '../levels/ambients';
import { horizonRainbow } from '../levels/horizon-rainbow';
import { PIT_DEPTH, PIT_LIP_RADIUS, type Span } from '../levels/spikes';
import { digits, fitImage } from './round-button';

/** Fondo de cielo en degradado, fijo a la cámara y del ancho máximo (no hay que recolocarlo). */
export function addSky(scene: Phaser.Scene, key = 'sky'): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, key).setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
}

/** Colores del suelo: los de la paleta salvo en los ambientes de los niveles. `ground` es el borde (hierba si falta). */
export interface GroundColors {
  grass: number;
  grassDark: number;
  earth: number;
  ground?: GroundStyle;
}

/** Esquinas superiores redondeadas de un tramo de suelo: el lado que da a un foso. */
export interface GroundRound {
  left?: boolean;
  right?: boolean;
}

/**
 * Suelo sobre su base: la capa de arriba con el borde de su ambiente. Hierba (bandas rectas, como
 * siempre), arena lisa con motas, nieve con el borde de abajo redondeado o nube festoneada. Con `round`,
 * las esquinas de arriba de ese lado se redondean (borde de un foso) y los bultos no cuelgan sobre él.
 */
export function drawGround(
  scene: Phaser.Scene,
  x: number,
  width: number,
  top: number,
  grass = 36,
  colors: GroundColors = COLORS,
  round: GroundRound = {},
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const corners = { tl: round.left ? PIT_LIP_RADIUS : 0, tr: round.right ? PIT_LIP_RADIUS : 0, bl: 0, br: 0 };
  const band = (h: number): void => {
    if (corners.tl || corners.tr) g.fillRoundedRect(x, top, width, h, corners);
    else g.fillRect(x, top, width, h);
  };
  g.fillStyle(colors.earth);
  band(GAME_H - top + 40);
  const style = colors.ground ?? 'grass';
  if (style === 'snow' || style === 'cloud') {
    // Borde inferior de bultos: pequeños y juntos en la nieve, grandes y mullidos en la nube.
    const r = style === 'snow' ? 12 : 22;
    const step = style === 'snow' ? 30 : 46;
    // En el lado de un foso, los bultos acaban dentro del tramo.
    const from = round.left ? x + r : x;
    const to = round.right ? x + width - r : x + width + step;
    const bumps = (y: number): void => {
      let px = from;
      for (; px < to; px += step) g.fillCircle(px, y, r);
      if (round.right && px - step < to) g.fillCircle(to, y, r);
    };
    g.fillStyle(colors.grassDark);
    band(grass + 6);
    bumps(top + grass + 6);
    g.fillStyle(colors.grass);
    band(grass);
    bumps(top + grass - 2);
    if (style === 'cloud') {
      g.fillStyle(colors.grassDark, 0.5);
      for (let px = x + step / 2; px < x + width; px += step * 2) g.fillCircle(px, top + 10, 6);
    }
    return g;
  }
  g.fillStyle(colors.grassDark);
  band(grass + 6);
  g.fillStyle(colors.grass);
  band(grass);
  if (style === 'sand') {
    // Arena lisa con motas.
    g.fillStyle(colors.grassDark, 0.6);
    for (let i = 0, px = x + 20; px < x + width - 10; i++, px += 34 + jitter(i, 5) * 40) g.fillCircle(px, top + 10 + jitter(i, 6) * 18, 2.5 + jitter(i, 7) * 2);
  }
  return g;
}

/** La pared del foso asoma esto por cada lado bajo las esquinas redondeadas del suelo, en px. */
const PIT_WALL_BLEED = 12;
/** Sombra bajo el borde del foso: alto y opacidad de arriba. */
const PIT_SHADOW_H = 26;
const PIT_SHADOW_ALPHA = 0.45;

/**
 * Interior de un foso de pinchos de `x` a `x + width`, bajo el suelo en `top`: la pared con la tierra del
 * ambiente oscurecida, una sombra en degradado bajo el borde y, bajo el fondo, la tierra con una línea
 * más oscura. Se dibuja antes que los tramos de suelo, que lo tapan por los lados.
 */
export function drawPit(scene: Phaser.Scene, x: number, width: number, top: number, ambient: Ambient): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const left = x - PIT_WALL_BLEED;
  const w = width + 2 * PIT_WALL_BLEED;
  const wall = pitWall(ambient);
  const floor = top + PIT_DEPTH;
  g.fillStyle(wall).fillRect(left, top, w, PIT_DEPTH);
  // Degradado por bandas (alfa de 0,45 a 0) bajo el borde.
  const bands = 8;
  for (let k = 0; k < bands; k++) {
    g.fillStyle(INK, PIT_SHADOW_ALPHA * (1 - k / bands)).fillRect(left, top + (k * PIT_SHADOW_H) / bands, w, PIT_SHADOW_H / bands);
  }
  g.fillStyle(ambient.earth).fillRect(left, floor, w, GAME_H - floor + 40);
  g.fillStyle(mixColor(wall, INK, 0.35)).fillRect(left, floor, w, 4);
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
 * Escenario completo de un nivel con su ambiente, de atrás adelante: cielo, arcoíris del horizonte
 * (si el mundo lo lleva, `horizon`: según `horizonRainbow`, con la vista de `viewW`), sol o luna y estrellas, nubes, colinas lejanas, decoración, colinas cercanas y suelo. Con el prado queda igual que el
 * escenario de siempre (nubes, dos capas de colinas y suelo con los colores de la paleta). El suelo va
 * por tramos (`spans`) y entre ellos, los fosos de los pinchos (`pits`): primero los fosos y después
 * los tramos, con la esquina redondeada del lado del foso. Sin tramos, un solo suelo de todo el ancho.
 * Devuelve el arcoíris del horizonte, si lo hay (el prólogo lo hace destellar).
 */
export function addScenery(
  scene: Phaser.Scene,
  ambient: Ambient,
  worldW: number,
  groundTop: number,
  horizon: { level: number; lastLevel: number } | null,
  viewW: number,
  ground: { spans: readonly Span[]; pits: readonly Span[] } = { spans: [{ from: 0, to: worldW }], pits: [] },
): { rainbow?: Phaser.GameObjects.Image } {
  addSky(scene, skyKey(ambient.id));

  // Arcoíris del horizonte: la capa más lejana, detrás del sol, la luna, las nubes y las colinas.
  let arc: Phaser.GameObjects.Image | undefined;
  if (horizon) {
    const rainbow = horizonRainbow(horizon.level, horizon.lastLevel, ambient, viewW, worldW);
    arc = scene.add.image(rainbow.x, rainbow.bottom, 'decor-rainbow').setOrigin(0.5, 1);
    arc.setDisplaySize(rainbow.width, (rainbow.width * arc.height) / arc.width).setScrollFactor(rainbow.scrollFactor, 1).setAlpha(rainbow.alpha);
  }

  if (ambient.decor === 'sunset') {
    scene.add.image(MAX_W * 0.62, groundTop - 90, 'decor-sun').setScrollFactor(0.03, 1);
  }
  if (ambient.decor === 'night') {
    scene.add.image(MAX_W * 0.72, 220, 'decor-moon').setScrollFactor(0.03, 1);
    addStars(scene, worldW * 0.1 + MAX_W);
  }

  addClouds(scene, 120, worldW * 0.3 + MAX_W, 520, 0.3, ambient.cloud);
  if (ambient.decor === 'mountains') {
    // Picos nevados lejanos, detrás de las colinas.
    for (let i = 0, x = 120; x < worldW * 0.25 + MAX_W; i++, x += 520 + jitter(i) * 360) {
      scene.add
        .image(x, groundTop - 40, 'decor-peak')
        .setOrigin(0.5, 1)
        .setScale(0.8 + jitter(i, 2) * 0.45)
        .setScrollFactor(0.25, 1)
        .setAlpha(0.85);
    }
  }
  drawHills(scene, groundTop, -200, worldW * 0.45 + MAX_W, 900, ambient.hillLight, 0.45);
  if (ambient.decor === 'beach') drawSea(scene, groundTop, worldW * 0.45 + MAX_W);
  if (ambient.decor === 'rainbow') {
    // Nubes grandes y bajas, delante del arcoíris.
    for (let i = 0, x = 200; x < worldW * 0.4 + MAX_W; i++, x += 700 + jitter(i) * 400) {
      scene.add
        .image(x, groundTop - 150 - jitter(i, 1) * 90, 'cloud')
        .setScale(1.8 + jitter(i, 2) * 0.6)
        .setScrollFactor(0.4, 1)
        .setAlpha(0.9);
    }
  }

  const decorTo = worldW * DECOR_SCROLL + MAX_W;
  const groundDecor: Partial<Record<Ambient['decor'], { key: string; every: number; scale: number }>> = {
    trees: { key: 'decor-tree', every: 260, scale: 0.75 },
    'autumn-trees': { key: 'decor-tree-autumn', every: 260, scale: 0.75 },
    beach: { key: 'decor-palm', every: 420, scale: 0.85 },
    jungle: { key: 'decor-leaf', every: 240, scale: 0.7 },
    snow: { key: 'decor-pine-snow', every: 300, scale: 0.8 },
    desert: { key: 'decor-cactus', every: 460, scale: 0.6 },
  };
  const planted = groundDecor[ambient.decor];
  if (planted) {
    for (let i = 0, x = 60; x < decorTo; i++, x += planted.every + jitter(i) * planted.every) {
      scene.add
        .image(x, groundTop - 10 + jitter(i, 1) * 30, planted.key)
        .setOrigin(0.5, 1)
        .setScale(planted.scale + jitter(i, 2) * 0.4)
        .setScrollFactor(DECOR_SCROLL, 1)
        .setAlpha(DECOR_ALPHA);
    }
  }
  if (ambient.decor === 'jungle') {
    // Lianas que cuelgan desde arriba, entre la decoración y las colinas cercanas.
    for (let i = 0, x = 180; x < decorTo; i++, x += 380 + jitter(i, 8) * 300) {
      scene.add
        .image(x, -20 - jitter(i, 9) * 60, 'decor-vine')
        .setOrigin(0.5, 0)
        .setScale(0.8 + jitter(i, 3) * 0.4)
        .setScrollFactor(DECOR_SCROLL, 1)
        .setAlpha(DECOR_ALPHA);
    }
  }
  if (ambient.decor === 'snow') addSnowflakes(scene, groundTop, worldW * 0.3 + MAX_W);

  const near = { groundTop: groundTop + 30, from: -200, step: 800, phase: 420, scroll: 0.6 };
  // En la playa el mar llega hasta la arena: sin colinas cercanas.
  if (ambient.decor !== 'beach') {
    drawHills(scene, near.groundTop, near.from, worldW * near.scroll + MAX_W, near.step, ambient.hill, near.scroll, near.phase);
  }
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
  for (const pit of ground.pits) drawPit(scene, pit.from, pit.to - pit.from, groundTop, ambient);
  for (const span of ground.spans) {
    const round = { left: ground.pits.some((p) => p.to === span.from), right: ground.pits.some((p) => p.from === span.to) };
    drawGround(scene, span.from, span.to - span.from, groundTop, 36, ambient, round);
  }
  return arc ? { rainbow: arc } : {};
}

/** Altura (`y`) de la cima de una capa de colinas de `drawHills` en `x`. */
function hillTop(x: number, hills: { groundTop: number; from: number; step: number; phase: number }): number {
  const first = hills.from + hills.phase;
  const k = Math.round((x - first) / hills.step);
  const dx = x - (first + k * hills.step);
  const rx = (hills.step * 1.1) / 2;
  return hills.groundTop + 100 - 210 * Math.sqrt(Math.max(0, 1 - (dx / rx) ** 2));
}

/** Franja de mar en el horizonte de la playa, con ondas claras; se mueve con las colinas lejanas. */
function drawSea(scene: Phaser.Scene, groundTop: number, to: number): void {
  const g = scene.add.graphics().setScrollFactor(0.45, 1);
  const top = groundTop - 96;
  g.fillStyle(0x7fcfe8).fillRect(-200, top, to + 200, groundTop - top + 10);
  g.fillStyle(0x9adbee).fillRect(-200, top, to + 200, 14);
  g.fillStyle(0xd4f1f8, 0.9);
  for (let i = 0, x = -160; x < to; i++, x += 120 + jitter(i, 10) * 120) {
    g.fillRoundedRect(x, top + 28 + jitter(i, 11) * 50, 34 + jitter(i, 12) * 30, 6, 3);
  }
}

/** Copos de nieve lentos que caen sin parar, con paralaje. */
function addSnowflakes(scene: Phaser.Scene, groundTop: number, to: number): void {
  for (let i = 0, x = 20; x < to; i++, x += 80 + jitter(i, 13) * 80) {
    const y0 = jitter(i, 14) * groundTop;
    const flake = scene.add
      .image(x, y0, 'decor-flake')
      .setScale(0.5 + jitter(i, 15) * 0.7)
      .setScrollFactor(0.3, 1)
      .setAlpha(0.85);
    // Velocidad constante: el primer tramo sale de donde está y luego vuelve a caer desde arriba.
    const speed = (groundTop + 20) / (7000 + jitter(i, 16) * 5000);
    const loop = (): void => {
      flake.setY(-20);
      scene.tweens.add({ targets: flake, y: groundTop, duration: (groundTop + 20) / speed, ease: 'Linear', onComplete: loop });
    };
    scene.tweens.add({ targets: flake, y: groundTop, duration: (groundTop - y0) / speed, ease: 'Linear', onComplete: loop });
    scene.tweens.add({ targets: flake, x: x + 24, duration: 1800 + jitter(i, 17) * 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
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
