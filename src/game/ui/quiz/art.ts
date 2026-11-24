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
import { fitImage } from '../round-button';

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
    default:
      return null;
  }
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
    default:
      break;
  }
  return parts;
}
