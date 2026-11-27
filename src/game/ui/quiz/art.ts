/**
 * Arte propio de las seis pruebas nuevas, dibujado con Graphics en el estilo plano del juego (sin
 * contornos negros y con sombra inferior sólida): platos, tarro, cesta, cabina, balanza, hitos de la
 * nieve, objetos de peso, dibujos simétricos, flechas y los seis pictogramas.
 * Todo se centra en (0, 0) dentro de un contenedor.
 */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import { halfPrims, type Prim } from '../../../learning/quiz/pictures';
import type { Dir, LandmarkId, ObjectId, PictureId, QuizKind, Visual, WeightId } from '../../../learning/quiz/types';
import { digits, fitImage } from '../round-button';
import { drawDino, drawEgg, drawIslandPictogram, drawNest, drawPiece, drawPlace, drawThing } from './island-art';

type G = Phaser.GameObjects.Graphics;
type C = Phaser.GameObjects.Container;

/** Inclinación de la balanza al soltarla, en grados. */
export const HEAVY_ANGLE = 14;
export const SNOW = 0xf4fbff;
export const SNOW_SHADOW = 0xb7d3e6;
export const CAKE = 0xb9773e;

const image = (scene: Phaser.Scene, key: string, size: number, x = 0, y = 0): Phaser.GameObjects.Image => fitImage(scene.add.image(x, y, key), size).setPosition(x, y);

const OBJECT_KEY: Record<ObjectId, string> = { cookie: 'cookie', hedgehog: 'hedgehog', bee: 'bee', star: 'star', snail: 'snail' };

// --- Flechas -------------------------------------------------------------------------------------

const ARROW_ANGLE: Record<Dir, number> = { up: 0, right: 90, down: 180, left: 270 };

/** Flecha gruesa que apunta en `dir`, de lado `size`. */
export function drawArrow(scene: Phaser.Scene, dir: Dir, size: number, color: number = COLORS.coral): G {
  const g = scene.add.graphics();
  const pts: [number, number][] = [[0, -0.5], [0.4, -0.02], [0.16, -0.02], [0.16, 0.46], [-0.16, 0.46], [-0.16, -0.02], [-0.4, -0.02]];
  const a = Phaser.Math.DegToRad(ARROW_ANGLE[dir]);
  const rot = (x: number, y: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2((x * Math.cos(a) - y * Math.sin(a)) * size, (x * Math.sin(a) + y * Math.cos(a)) * size);
  const shape = pts.map(([x, y]) => rot(x, y));
  g.fillStyle(0x000000, 0.12).fillPoints(shape.map((p) => new Phaser.Math.Vector2(p.x, p.y + size * 0.05)), true);
  g.fillStyle(color).fillPoints(shape, true);
  return g;
}

/** Tira de flechas en fila (`vertical` false) o en columna. */
export function drawArrowStrip(scene: Phaser.Scene, dirs: readonly Dir[], cell: number, vertical = false): C {
  const parts = dirs.map((d, i) => {
    const off = (i - (dirs.length - 1) / 2) * cell;
    return drawArrow(scene, d, cell * 0.82).setPosition(vertical ? 0 : off, vertical ? off : 0);
  });
  return scene.add.container(0, 0, parts);
}

// --- Cesta, platos y tarro -----------------------------------------------------------------------

/** Cesta vacía (las galletas las pone la vista). El borde de arriba queda en y = -w·0,08. */
export function drawBasketBody(scene: Phaser.Scene, w: number): G {
  const g = scene.add.graphics();
  g.fillStyle(0x8d5527).fillRoundedRect(-w / 2, -w * 0.08 + 6, w, w * 0.46, 14);
  g.fillStyle(CAKE).fillRoundedRect(-w / 2, -w * 0.08, w, w * 0.46, 14);
  g.fillStyle(0xd4904f).fillRoundedRect(-w / 2, -w * 0.08, w, w * 0.12, 8);
  g.lineStyle(4, 0x8d5527);
  for (let i = 1; i < 5; i++) g.lineBetween(-w / 2 + (w * i) / 5, w * 0.06, -w / 2 + (w * i) / 5, w * 0.36);
  return g;
}

/** Plato con el amigo que está a punto de comer. */
export function drawPlate(scene: Phaser.Scene, friend: ObjectId, size: number): C {
  const g = scene.add.graphics();
  const w = size * 0.92;
  const y = size * 0.22;
  g.fillStyle(0xc9d6e2).fillEllipse(0, y + 6, w, w * 0.34);
  g.fillStyle(COLORS.white).fillEllipse(0, y, w, w * 0.34);
  g.fillStyle(0xe8eef5).fillEllipse(0, y, w * 0.62, w * 0.2);
  const pal = image(scene, OBJECT_KEY[friend], size * 0.5, 0, -size * 0.18);
  return scene.add.container(0, 0, [pal, g]);
}

/** Tarro de cristal con tapa morada. */
export function drawJar(scene: Phaser.Scene, size: number): C {
  const g = scene.add.graphics();
  const w = size * 0.62;
  const h = size * 0.7;
  g.fillStyle(0xc9d6e2).fillRoundedRect(-w / 2, -h * 0.3 + 6, w, h, 18);
  g.fillStyle(0xe9f6ff, 0.95).fillRoundedRect(-w / 2, -h * 0.3, w, h, 18);
  g.fillStyle(0xffffff, 0.8).fillRoundedRect(-w * 0.34, -h * 0.18, w * 0.1, h * 0.6, 5);
  g.fillStyle(COLORS.purple).fillRoundedRect(-w * 0.58 / 1, -h * 0.5, w * 1.16, h * 0.22, 10);
  return scene.add.container(0, 0, [g]);
}

// --- Escalera de consigna ------------------------------------------------------------------------

/** Escalera de 3 peldaños que sube o baja, con una flecha en el sentido de ordenar. */
export function drawStairs(scene: Phaser.Scene, direction: 'up' | 'down', size: number): C {
  const g = scene.add.graphics();
  const w = size / 3;
  for (let i = 0; i < 3; i++) {
    const k = direction === 'up' ? i : 2 - i;
    const h = size * (0.25 + k * 0.22);
    g.fillStyle(COLORS.purple).fillRoundedRect(-size / 2 + i * w + 3, size * 0.3 - h, w - 6, h, 8);
  }
  const arrow = drawArrow(scene, 'right', size * 0.5, COLORS.coral).setPosition(0, -size * 0.34);
  return scene.add.container(0, 0, [g, arrow]);
}

// --- Hitos de la nieve ---------------------------------------------------------------------------

export function drawLandmark(scene: Phaser.Scene, id: LandmarkId, size: number): C {
  const g = scene.add.graphics();
  const s = size;
  if (id === 'pine') {
    g.fillStyle(0x8d5527).fillRect(-s * 0.06, s * 0.2, s * 0.12, s * 0.22);
    for (let i = 0; i < 3; i++) {
      const y = s * 0.12 - i * s * 0.24;
      const w = s * (0.5 - i * 0.09);
      g.fillStyle(0x2f8f4e).fillTriangle(-w, y + s * 0.2, w, y + s * 0.2, 0, y - s * 0.16);
      g.fillStyle(COLORS.white).fillTriangle(-w * 0.45, y - s * 0.02, w * 0.45, y - s * 0.02, 0, y - s * 0.16);
    }
  } else if (id === 'snowman') {
    g.fillStyle(SNOW_SHADOW).fillCircle(0, s * 0.22 + 4, s * 0.26).fillCircle(0, -s * 0.12 + 4, s * 0.18);
    g.fillStyle(COLORS.white).fillCircle(0, s * 0.22, s * 0.26).fillCircle(0, -s * 0.12, s * 0.18);
    g.fillStyle(COLORS.ink).fillCircle(-s * 0.06, -s * 0.17, s * 0.025).fillCircle(s * 0.06, -s * 0.17, s * 0.025);
    g.fillStyle(COLORS.fox).fillTriangle(0, -s * 0.13, s * 0.2, -s * 0.1, 0, -s * 0.07);
    g.fillStyle(COLORS.coral).fillRect(-s * 0.2, -s * 0.0, s * 0.4, s * 0.06);
  } else {
    g.fillStyle(SNOW_SHADOW).fillEllipse(0, s * 0.3 + 4, s * 0.9, s * 0.2);
    g.fillStyle(COLORS.white).beginPath().arc(0, s * 0.28, s * 0.42, Math.PI, 0).closePath().fillPath();
    g.lineStyle(3, SNOW_SHADOW);
    g.lineBetween(-s * 0.36, s * 0.14, s * 0.36, s * 0.14).lineBetween(-s * 0.22, s * 0.0, s * 0.22, s * 0.0);
    g.fillStyle(COLORS.purple).beginPath().arc(s * 0.0, s * 0.28, s * 0.14, Math.PI, 0).closePath().fillPath();
  }
  return scene.add.container(0, 0, [g]);
}

// --- Objetos de peso -----------------------------------------------------------------------------

export function drawWeight(scene: Phaser.Scene, id: WeightId, size: number): C {
  if (id === 'berry') return scene.add.container(0, 0, [image(scene, 'strawberry', size)]);
  const g = scene.add.graphics();
  const s = size;
  switch (id) {
    case 'melon':
      g.fillStyle(0x2f8f4e).fillEllipse(0, 0, s, s * 0.8);
      g.lineStyle(s * 0.07, 0x1f6a37);
      for (const x of [-0.22, 0, 0.22]) g.lineBetween(x * s, -s * 0.34, x * s * 1.1, s * 0.34);
      break;
    case 'rock':
      g.fillStyle(0x6e7480).fillPoints(
        [[-0.5, 0.3], [-0.38, -0.1], [-0.1, -0.34], [0.26, -0.28], [0.5, 0.05], [0.42, 0.32]].map(([x, y]) => new Phaser.Math.Vector2(x! * s, y! * s)),
        true,
      );
      g.fillStyle(0x949aa6).fillTriangle(-0.3 * s, -0.05 * s, -0.08 * s, -0.28 * s, 0.1 * s, -0.04 * s);
      break;
    case 'pumpkin':
      g.fillStyle(0xf28c28).fillEllipse(0, s * 0.04, s, s * 0.78);
      g.lineStyle(s * 0.05, 0xc96a14);
      for (const x of [-0.18, 0.18]) g.beginPath().arc(0, s * 0.04, s * (0.1 + Math.abs(x)), Math.PI * 1.35, Math.PI * 1.65).strokePath();
      g.fillStyle(0x3f8f3a).fillRoundedRect(-s * 0.06, -s * 0.46, s * 0.12, s * 0.16, 4);
      break;
    case 'feather':
      g.fillStyle(0xa9d8ff).fillEllipse(0, 0, s * 0.34, s * 0.95);
      g.lineStyle(s * 0.04, COLORS.white).lineBetween(0, -s * 0.42, 0, s * 0.5);
      g.lineStyle(s * 0.03, 0x7ab8ee).lineBetween(0, -s * 0.2, s * 0.13, -s * 0.28).lineBetween(0, 0, s * 0.14, -s * 0.08).lineBetween(0, 0.2 * s, s * 0.12, 0.12 * s);
      break;
    case 'leaf':
      g.fillStyle(0x58c25a).fillPoints(
        [[0, -0.5], [0.3, -0.2], [0.3, 0.12], [0, 0.4], [-0.3, 0.12], [-0.3, -0.2]].map(([x, y]) => new Phaser.Math.Vector2(x! * s, y! * s)),
        true,
      );
      g.lineStyle(s * 0.04, 0x2f8f4e).lineBetween(0, -0.4 * s, 0, 0.5 * s);
      break;
  }
  return scene.add.container(0, 0, [g]);
}

/** Platillo de la balanza: un cuenco con sombra. */
export function drawPanBowl(scene: Phaser.Scene, w: number): G {
  const g = scene.add.graphics();
  g.fillStyle(0xb98a1e).beginPath().arc(0, 4, w / 2, 0, Math.PI).closePath().fillPath();
  g.fillStyle(COLORS.yellow).beginPath().arc(0, 0, w / 2, 0, Math.PI).closePath().fillPath();
  g.fillStyle(0xfff2a8).fillRoundedRect(-w / 2, -5, w, 9, 4);
  return g;
}

// --- Dibujos simétricos --------------------------------------------------------------------------

/** Dibuja primitivas de una mitad (caja unitaria) en una caja de `size` con la esquina izquierda arriba en (x0, y0). */
export function paintPrims(g: G, prims: readonly Prim[], x0: number, y0: number, size: number, alpha = 1): void {
  const X = (x: number): number => x0 + x * size;
  const Y = (y: number): number => y0 + y * size;
  for (const p of prims) {
    g.fillStyle(p.color, alpha);
    if (p.t === 'e') g.fillEllipse(X(p.cx), Y(p.cy), p.rx * 2 * size, p.ry * 2 * size);
    else if (p.t === 'r') g.fillRoundedRect(X(p.x), Y(p.y), p.w * size, p.h * size, Math.min(8, p.w * size * 0.3, p.h * size * 0.3));
    else g.fillPoints(p.pts.map(([x, y]) => new Phaser.Math.Vector2(X(x), Y(y))), true);
  }
}

/** Una mitad de un dibujo, centrada en (0, 0) dentro de una caja cuadrada de `size`. */
export function drawHalf(scene: Phaser.Scene, picture: PictureId, mirrored: boolean, variant: number, size: number, alpha = 1): C {
  const g = scene.add.graphics();
  paintPrims(g, halfPrims(picture, mirrored, variant), -size / 2, -size / 2, size, alpha);
  return scene.add.container(0, 0, [g]);
}

/** Casilla pintada: relleno y estrella (no depende del color). */
export function drawPaint(scene: Phaser.Scene, size: number): C {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.coral).fillRoundedRect(-size / 2, -size / 2, size, size, size * 0.18);
  g.fillStyle(COLORS.white);
  const pts: Phaser.Math.Vector2[] = [];
  for (let i = 0; i < 10; i++) {
    const r = (i % 2 === 0 ? 0.32 : 0.14) * size;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(new Phaser.Math.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  g.fillPoints(pts, true);
  return scene.add.container(0, 0, [g]);
}

// --- Visuales nuevos de las opciones -------------------------------------------------------------

/** Dibuja los `Visual` nuevos centrados en (0, 0) dentro de w×h. Devuelve `null` si no es uno de ellos. */
export function drawExtraVisual(scene: Phaser.Scene, v: Visual, w: number, h: number): C | null {
  const s = Math.min(w, h);
  switch (v.type) {
    case 'sized':
      return scene.add.container(0, 0, [image(scene, OBJECT_KEY[v.object], s * v.scale)]);
    case 'arrows':
      return drawArrowStrip(scene, v.dirs, Math.min(h * 0.8, w / v.dirs.length));
    case 'half':
      return drawHalf(scene, v.picture, v.mirrored, v.variant, s * 0.9);
    case 'cell':
      return v.painted ? drawPaint(scene, s * 0.8) : scene.add.container();
    case 'plate':
      return drawPlate(scene, v.friend, s);
    case 'jar':
      return drawJar(scene, s);
    case 'pan':
      return scene.add.container(0, 0, [drawPanBowl(scene, s * 0.9)]);
    case 'landmark':
      return drawLandmark(scene, v.id, s * 0.85);
    case 'weight':
      return drawWeight(scene, v.id, s * 0.8);
    case 'sock':
      return drawSock(scene, v.color, v.pattern, s * 0.85);
    case 'pairs':
      return drawPairs(scene, v.odd, Math.min(w, h * 1.6) * 0.9);
    case 'dino':
      return drawDino(scene, v.dino, v.shadow, v.flip, s * 0.95);
    case 'thing':
      return drawThing(scene, v.thing, s * 0.8);
    case 'piece':
      return drawPiece(scene, v.piece, v.angle, v.mirrored, v.color, s * 0.72);
    case 'place':
      return drawPlace(scene, v.rel, v.thing, v.holder, w * 0.95, h * 0.95);
    case 'egg':
      return drawEgg(scene, v.color, v.pattern, s * 0.8 * v.scale);
    case 'nest':
      return drawNest(scene, v.eggs, Math.min(w, h * 1.3) * 0.8);
    default:
      return null;
  }
}

/** Colores de los calcetines (índice de `sock.color`). */
export const SOCK_PALETTE = [0xff6b5e, 0x4da3ff, 0xffc93c, 0x8e6cf0, 0x58c25a] as const;

/** Calcetín de `size` px de alto con su dibujo: 0 liso, 1 rayas, 2 lunares. */
export function drawSock(scene: Phaser.Scene, color: number, pattern: number, size: number): C {
  const c = SOCK_PALETTE[color % SOCK_PALETTE.length]!;
  const w = size * 0.34;
  const g = scene.add.graphics();
  // Caña y pie.
  g.fillStyle(c).fillRoundedRect(-w / 2, -size / 2, w, size * 0.7, w * 0.25);
  g.fillStyle(c).fillRoundedRect(-w / 2, size * 0.08, w * 1.9, w * 0.95, w * 0.45);
  g.fillStyle(COLORS.white, 0.9).fillRoundedRect(-w / 2, -size / 2, w, size * 0.12, w * 0.2);
  g.fillStyle(COLORS.white, 0.85);
  if (pattern === 1) for (let k = 0; k < 3; k++) g.fillRect(-w / 2, -size * 0.28 + k * size * 0.13, w, size * 0.05);
  if (pattern === 2) for (let k = 0; k < 4; k++) g.fillCircle(-w * 0.18 + (k % 2) * w * 0.36, -size * 0.25 + Math.floor(k / 2) * size * 0.2, size * 0.04);
  // Talón y punta más oscuros.
  g.fillStyle(COLORS.ink, 0.15).fillCircle(-w * 0.1, size * 0.27, w * 0.32).fillCircle(w * 1.2, size * 0.27, w * 0.3);
  const box = scene.add.container(0, 0, [g]);
  g.x = -w * 0.45;
  return box;
}

/** Respuesta de pares y nones: dos parejas juntas, o dos parejas y uno solo con un brillo. */
function drawPairs(scene: Phaser.Scene, odd: boolean, size: number): C {
  const c = scene.add.container(0, 0);
  const s = size * (odd ? 0.4 : 0.48);
  const xs = odd ? [-0.34, -0.02] : [-0.2, 0.2];
  xs.forEach((x, i) => {
    c.add(drawSock(scene, i, i, s).setPosition(x * size - s * 0.12, 0));
    c.add(drawSock(scene, i, i, s).setPosition(x * size + s * 0.12, 0));
  });
  if (odd) {
    // El que sobra, aparte y con un brillo.
    const g = scene.add.graphics();
    g.fillStyle(COLORS.yellow, 0.7).fillCircle(size * 0.34, 0, s * 0.5);
    c.add([g, drawSock(scene, 2, 2, s).setPosition(size * 0.34, 0)]);
  }
  return c;
}

// --- Pictogramas ---------------------------------------------------------------------------------

/** Contenido del pictograma de las seis pruebas nuevas (sobre el círculo amarillo que pone `quiz-art`). */
export function drawNewPictogram(scene: Phaser.Scene, kind: QuizKind, size: number): Phaser.GameObjects.GameObject[] {
  const r = size / 2;
  const g = scene.add.graphics();
  const parts: Phaser.GameObjects.GameObject[] = [g];
  switch (kind) {
    case 'share':
      for (const x of [-0.34, 0.34]) {
        g.fillStyle(0xc9d6e2).fillEllipse(x * r, r * 0.3 + 4, r * 0.62, r * 0.22);
        g.fillStyle(COLORS.white).fillEllipse(x * r, r * 0.3, r * 0.62, r * 0.22);
        parts.push(image(scene, 'cookie', r * 0.34, x * r, r * 0.12));
      }
      parts.push(image(scene, 'cookie', r * 0.3, 0, -r * 0.45));
      break;
    case 'order':
      [0.3, 0.52, 0.76].forEach((h, i) => g.fillStyle(i === 2 ? COLORS.coral : COLORS.purple).fillRoundedRect(-r * 0.62 + i * r * 0.44, r * 0.5 - h * r * 1.1, r * 0.38, h * r * 1.1, 6));
      break;
    case 'cable-car':
      g.lineStyle(5, COLORS.ink).lineBetween(-r * 0.8, -r * 0.62, r * 0.8, -r * 0.34).lineBetween(0, -r * 0.48, 0, -r * 0.2);
      g.fillStyle(COLORS.coral).fillRoundedRect(-r * 0.42, -r * 0.2, r * 0.84, r * 0.7, 10);
      g.fillStyle(COLORS.white).fillRoundedRect(-r * 0.3, -r * 0.08, r * 0.24, r * 0.26, 4).fillRoundedRect(r * 0.06, -r * 0.08, r * 0.24, r * 0.26, 4);
      break;
    case 'tracks': {
      const a = drawArrow(scene, 'right', r * 0.7, COLORS.coral).setPosition(-r * 0.32, r * 0.3);
      const b = drawArrow(scene, 'up', r * 0.7, COLORS.purple).setPosition(r * 0.36, -r * 0.18);
      g.fillStyle(COLORS.white).fillEllipse(-r * 0.58, -r * 0.3, r * 0.14, r * 0.2).fillEllipse(-r * 0.28, -r * 0.5, r * 0.14, r * 0.2);
      parts.push(a, b);
      break;
    }
    case 'balance':
      g.fillStyle(COLORS.ink).fillRoundedRect(-r * 0.06, -r * 0.4, r * 0.12, r * 0.95, 4).fillRoundedRect(-r * 0.35, r * 0.5, r * 0.7, r * 0.12, 5);
      g.save();
      g.lineStyle(7, COLORS.ink).lineBetween(-r * 0.62, -r * 0.5, r * 0.62, -r * 0.3);
      g.fillStyle(COLORS.coral).beginPath().arc(-r * 0.62, -r * 0.1, r * 0.26, 0, Math.PI).closePath().fillPath();
      g.fillStyle(COLORS.purple).beginPath().arc(r * 0.62, r * 0.1, r * 0.26, 0, Math.PI).closePath().fillPath();
      g.restore();
      break;
    case 'mirror': {
      const half = drawHalf(scene, 'butterfly', false, 0, r * 0.95).setPosition(-r * 0.5, 0);
      const ghost = drawHalf(scene, 'butterfly', true, 0, r * 0.95).setPosition(r * 0.5, 0).setAlpha(0.35);
      g.lineStyle(4, COLORS.ink, 0.8);
      for (let y = -r * 0.7; y < r * 0.7; y += r * 0.26) g.lineBetween(0, y, 0, y + r * 0.14);
      parts.push(half, ghost);
      break;
    }
    case 'fingers':
      g.fillStyle(0xffc9a0).fillRoundedRect(-r * 0.42, -r * 0.05, r * 0.84, r * 0.6, 14);
      for (let k = 0; k < 3; k++) g.fillRoundedRect(-r * 0.38 + k * r * 0.27, -r * 0.62, r * 0.2, r * 0.7, 8);
      g.fillEllipse(r * 0.5, r * 0.15, r * 0.2, r * 0.36);
      break;
    case 'ten-frame':
      g.fillStyle(0x4da3ff).fillRoundedRect(-r * 0.72, -r * 0.34, r * 1.44, r * 0.68, 8);
      for (let i = 0; i < 10; i++) {
        const x = -r * 0.58 + (i % 5) * r * 0.29;
        const y = -r * 0.16 + Math.floor(i / 5) * r * 0.32;
        g.fillStyle(COLORS.white).fillRect(x - r * 0.11, y - r * 0.11, r * 0.22, r * 0.22);
        if (i < 7) g.fillStyle(COLORS.coral).fillCircle(x, y, r * 0.08);
      }
      break;
    case 'memory':
      g.fillStyle(COLORS.purple).fillRoundedRect(-r * 0.66, -r * 0.42, r * 0.6, r * 0.84, 8);
      g.fillStyle(COLORS.white).fillRoundedRect(r * 0.06, -r * 0.42, r * 0.6, r * 0.84, 8);
      parts.push(digits(scene, r * 0.36, 0, '3', r * 0.6));
      break;
    case 'neighbor':
      [-0.5, 0, 0.5].forEach((x, i) => g.fillStyle(i === 2 ? COLORS.white : COLORS.purple, i === 2 ? 0.9 : 1).fillRoundedRect(x * r - r * 0.2, -r * 0.2, r * 0.4, r * 0.4, 6));
      parts.push(digits(scene, r * 0.5, 0, '?', r * 0.4, '#FF6B5E'));
      break;
    case 'number-line':
      g.lineStyle(6, COLORS.ink).lineBetween(-r * 0.75, r * 0.2, r * 0.75, r * 0.2);
      for (let i = 0; i < 5; i++) g.lineBetween(-r * 0.6 + i * r * 0.3, r * 0.05, -r * 0.6 + i * r * 0.3, r * 0.35);
      g.fillStyle(COLORS.coral).fillCircle(r * 0.3, -r * 0.25, r * 0.16);
      break;
    case 'ten-friends':
      g.fillStyle(0x4da3ff).fillRoundedRect(-r * 0.72, -r * 0.34, r * 1.44, r * 0.68, 8);
      for (let i = 0; i < 10; i++) {
        const x = -r * 0.58 + (i % 5) * r * 0.29;
        const y = -r * 0.16 + Math.floor(i / 5) * r * 0.32;
        g.fillStyle(i < 7 ? COLORS.coral : COLORS.yellow).fillCircle(x, y, r * 0.1);
      }
      break;
    case 'train':
      g.fillStyle(COLORS.coral).fillRoundedRect(-r * 0.75, -r * 0.3, r * 0.5, r * 0.5, 6);
      g.fillStyle(0x4da3ff).fillRoundedRect(-r * 0.15, -r * 0.2, r * 0.38, r * 0.4, 6);
      g.fillStyle(0x58c25a).fillRoundedRect(r * 0.3, -r * 0.2, r * 0.38, r * 0.4, 6);
      g.fillStyle(COLORS.ink).fillCircle(-r * 0.6, r * 0.28, r * 0.1).fillCircle(-r * 0.35, r * 0.28, r * 0.1).fillCircle(r * 0.04, r * 0.28, r * 0.08).fillCircle(r * 0.5, r * 0.28, r * 0.08);
      break;
    case 'socks':
      parts.push(drawSock(scene, 0, 1, r * 1.1).setPosition(-r * 0.3, 0), drawSock(scene, 0, 1, r * 1.1).setPosition(r * 0.25, 0));
      break;
    case 'frog-jumps':
      g.lineStyle(5, COLORS.ink).lineBetween(-r * 0.75, r * 0.35, r * 0.75, r * 0.35);
      g.lineStyle(5, COLORS.grassDark).beginPath().arc(-r * 0.3, r * 0.3, r * 0.3, Math.PI, 0).strokePath();
      g.beginPath().arc(r * 0.3, r * 0.3, r * 0.3, Math.PI, 0).strokePath();
      break;
    case 'boats':
      [-0.5, 0, 0.5].forEach((x, i) => {
        g.fillStyle(COLORS.coral).fillRoundedRect(x * r - r * 0.2, r * 0.05 - i * r * 0.15, r * 0.4, r * 0.2, 6);
        g.fillStyle(COLORS.white).fillTriangle(x * r, -r * 0.5 - i * r * 0.15, x * r, r * 0.02 - i * r * 0.15, x * r + r * 0.2, r * 0.02 - i * r * 0.15);
      });
      break;
    case 'river-review':
      g.fillStyle(0x4da3ff).fillEllipse(0, r * 0.25, r * 1.5, r * 0.5);
      parts.push(digits(scene, -r * 0.35, -r * 0.2, '1', r * 0.5), digits(scene, r * 0.05, -r * 0.25, '2', r * 0.5), digits(scene, r * 0.45, -r * 0.2, '3', r * 0.5));
      break;
    case 'biggest':
      parts.push(digits(scene, -r * 0.32, r * 0.08, '3', r * 0.5), digits(scene, r * 0.3, 0, '8', r * 0.85, '#FF6B5E'));
      break;
    default:
      parts.push(...(drawIslandPictogram(scene, kind, size) ?? []));
      break;
  }
  return parts;
}
