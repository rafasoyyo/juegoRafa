/**
 * Dibujos de la prueba de la bandera, hechos con Graphics en el estilo plano del juego (propios del
 * proyecto): formas, puntos de dado, miniaturas de paisaje, cestas, pictogramas y marcas de progreso.
 * Todo se centra en (0, 0) dentro de un contenedor para poder colocarlo y animarlo.
 */

import Phaser from 'phaser';
import { COLORS } from '../config';
import { AMBIENTS, type DecorKind } from '../levels/ambients';
import type { AmbientId } from '../levels/types';
import type { Mark } from '../../learning/quiz/run';
import type { ObjectId, QuizKind, ShapeId, TopicIcon } from '../../learning/quiz/types';
import { drawNewPictogram } from './quiz/art';
import { fitImage } from './round-button';

type G = Phaser.GameObjects.Graphics;

/** Traza el contorno de una forma de lado `s` centrada en (0, 0). */
export function shapePoints(shape: ShapeId, s: number): Phaser.Math.Vector2[] | null {
  const h = s / 2;
  const P = (x: number, y: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x, y);
  switch (shape) {
    case 'circle':
      return null;
    case 'square':
      return [P(-h * 0.85, -h * 0.85), P(h * 0.85, -h * 0.85), P(h * 0.85, h * 0.85), P(-h * 0.85, h * 0.85)];
    case 'rectangle':
      return [P(-h, -h * 0.5), P(h, -h * 0.5), P(h, h * 0.5), P(-h, h * 0.5)];
    case 'triangle':
      return [P(0, -h), P(h, h * 0.8), P(-h, h * 0.8)];
    case 'diamond':
      return [P(0, -h), P(h * 0.72, 0), P(0, h), P(-h * 0.72, 0)];
    case 'hexagon':
      return Array.from({ length: 6 }, (_, i) => P(Math.cos((i * Math.PI) / 3) * h, Math.sin((i * Math.PI) / 3) * h));
    case 'star':
      return Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? h : h * 0.45;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        return P(Math.cos(a) * r, Math.sin(a) * r);
      });
    case 'oval':
      return Array.from({ length: 32 }, (_, i) => P(Math.cos((i * Math.PI) / 16) * h * 0.66, Math.sin((i * Math.PI) / 16) * h));
    case 'pentagon':
      return Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return P(Math.cos(a) * h, Math.sin(a) * h + h * 0.1);
      });
  }
}

export function fillShape(g: G, shape: ShapeId, s: number, dy = 0): void {
  const pts = shapePoints(shape, s);
  if (!pts) {
    g.fillCircle(0, dy, s / 2);
    return;
  }
  g.fillPoints(pts.map((p) => new Phaser.Math.Vector2(p.x, p.y + dy)), true);
}

function strokeShape(g: G, shape: ShapeId, s: number): void {
  const pts = shapePoints(shape, s);
  if (!pts) g.strokeCircle(0, 0, s / 2);
  else g.strokePoints(pts, true);
}

/** Forma con sombra sólida y borde oscuro (no depende del color para verse). */
export function drawShape(scene: Phaser.Scene, shape: ShapeId, color: number, size: number, angle = 0): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.12);
  fillShape(g, shape, size, 6);
  g.fillStyle(color);
  fillShape(g, shape, size);
  g.lineStyle(Math.max(3, size * 0.05), COLORS.ink, 0.85);
  strokeShape(g, shape, size);
  return scene.add.container(0, 0, [g]).setAngle(angle);
}

/** Cara de dado con `value` puntos (1-9); de 10 en adelante, en filas de 5. */
export function drawDots(scene: Phaser.Scene, value: number, size: number): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.white).fillRoundedRect(-size / 2, -size / 2, size, size, size * 0.2);
  g.lineStyle(4, COLORS.ink, 0.8).strokeRoundedRect(-size / 2, -size / 2, size, size, size * 0.2);
  const q = size * 0.27;
  const layouts: Record<number, [number, number][]> = {
    1: [[0, 0]],
    2: [[-1, -1], [1, 1]],
    3: [[-1, -1], [0, 0], [1, 1]],
    4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
    7: [[-1, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
    8: [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
    9: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
  };
  g.fillStyle(COLORS.ink);
  const spots = layouts[value];
  if (spots) {
    for (const [x, y] of spots) g.fillCircle(x * q, y * q, size * 0.085);
  } else {
    const per = 5;
    const rows = Math.ceil(value / per);
    const step = (size * 0.8) / per;
    for (let i = 0; i < value; i++) {
      const cx = -size * 0.4 + step * ((i % per) + 0.5);
      const cy = -((rows - 1) * step) / 2 + Math.floor(i / per) * step;
      g.fillCircle(cx, cy, step * 0.3);
    }
  }
  return scene.add.container(0, 0, [g]);
}

const DECOR_ICON: Record<DecorKind, string | null> = {
  clouds: null,
  flowers: 'decor-flowers',
  trees: 'decor-tree',
  'autumn-trees': 'decor-tree-autumn',
  sunset: 'decor-sun',
  night: 'decor-moon',
  beach: 'decor-palm',
  jungle: 'decor-leaf',
  mountains: 'decor-peak',
  snow: 'decor-pine-snow',
  desert: 'decor-cactus',
  rainbow: 'decor-rainbow',
};

/** Decoraciones que van grandes y al fondo de la miniatura (sol, luna, picos y arcoíris). */
const BIG_DECOR: readonly DecorKind[] = ['sunset', 'night', 'mountains', 'rainbow'];

const cssColor = (css: string): number => Phaser.Display.Color.HexStringToColor(css).color;

/** Miniatura de un paisaje: cielo, colinas, suelo y su decoración característica (todo dentro del marco). */
export function drawAmbientThumb(scene: Phaser.Scene, id: string, w: number, h: number): Phaser.GameObjects.Container {
  const amb = AMBIENTS[id as AmbientId] ?? AMBIENTS.prado;
  const g = scene.add.graphics();
  const top = cssColor(amb.sky[0]![1]);
  const bottom = cssColor(amb.sky[amb.sky.length - 1]![1]);
  g.fillGradientStyle(top, top, bottom, bottom, 1).fillRect(-w / 2, -h / 2, w, h);
  // Colinas: elipses cuya mitad inferior queda tapada por el suelo, sin salirse del marco.
  g.fillStyle(amb.hillLight).fillEllipse(-w * 0.2, h * 0.25, w * 0.55, h * 0.5);
  g.fillStyle(amb.hill).fillEllipse(w * 0.22, h * 0.28, w * 0.5, h * 0.44);
  g.fillStyle(amb.grass).fillRect(-w / 2, h * 0.18, w, h * 0.1);
  g.fillStyle(amb.earth).fillRect(-w / 2, h * 0.28, w, h * 0.22);
  const parts: Phaser.GameObjects.GameObject[] = [g];
  const decor = DECOR_ICON[amb.decor];
  if (amb.decor === 'clouds') {
    parts.push(fitImage(scene.add.image(w * 0.12, -h * 0.22, 'cloud'), w * 0.42));
  } else if (decor) {
    const big = BIG_DECOR.includes(amb.decor);
    parts.push(fitImage(scene.add.image(big ? w * 0.22 : -w * 0.18, big ? -h * 0.2 : h * 0.02, decor), big ? h * 0.42 : h * 0.55));
  }
  parts.push(scene.add.graphics().lineStyle(6, COLORS.white).strokeRoundedRect(-w / 2, -h / 2, w, h, 8));
  return scene.add.container(0, 0, parts);
}

const OBJECT_TEXTURE: Record<ObjectId, string> = {
  cookie: 'cookie',
  hedgehog: 'hedgehog',
  bee: 'bee',
  star: 'star',
  snail: 'snail',
};

/** Imagen de un objeto del juego ajustada a `size`. */
export function drawObject(scene: Phaser.Scene, object: ObjectId, size: number): Phaser.GameObjects.Image {
  return fitImage(scene.add.image(0, 0, OBJECT_TEXTURE[object]), size);
}

/** Cesta llena («más») o casi vacía («menos»), con galletas dentro. */
export function drawBasket(scene: Phaser.Scene, full: boolean, size: number): Phaser.GameObjects.Container {
  const w = size;
  const parts: Phaser.GameObjects.GameObject[] = [];
  const heap = full
    ? [
        [-0.26, -0.1],
        [0, -0.14],
        [0.26, -0.1],
        [-0.13, -0.32],
        [0.13, -0.32],
        [0, -0.5],
      ]
    : [[0.05, -0.08]];
  for (const [x, y] of heap) parts.push(fitImage(scene.add.image(x! * w, y! * w, 'cookie'), w * 0.3));
  const g = scene.add.graphics();
  g.fillStyle(0xb9773e).fillRoundedRect(-w / 2, -w * 0.08, w, w * 0.46, 14);
  g.fillStyle(0xd4904f).fillRoundedRect(-w / 2, -w * 0.08, w, w * 0.12, 8);
  g.lineStyle(4, 0x8d5527);
  for (let i = 1; i < 5; i++) g.lineBetween(-w / 2 + (w * i) / 5, w * 0.06, -w / 2 + (w * i) / 5, w * 0.36);
  parts.push(g);
  return scene.add.container(0, 0, parts);
}

/** Icono de tema de «¿Te acuerdas?». */
export function drawTopic(scene: Phaser.Scene, icon: TopicIcon, size: number): Phaser.GameObjects.Container {
  if (icon === 'block') return scene.add.container(0, 0, [fitImage(scene.add.image(0, 0, 'block'), size)]);
  if (icon === 'landscape') {
    const g = scene.add.graphics();
    g.fillStyle(COLORS.skyTop).fillRoundedRect(-size / 2, -size / 2, size, size, 16);
    g.fillStyle(COLORS.yellow).fillCircle(size * 0.2, -size * 0.2, size * 0.13);
    g.fillStyle(COLORS.hill).fillEllipse(-size * 0.1, size * 0.25, size * 0.8, size * 0.5);
    g.fillStyle(COLORS.grass).fillRoundedRect(-size / 2, size * 0.25, size, size * 0.25, { tl: 0, tr: 0, bl: 16, br: 16 });
    return scene.add.container(0, 0, [g]);
  }
  // Camino con huellas: «¿a quién te has encontrado en el camino?».
  const g = scene.add.graphics();
  g.fillStyle(COLORS.path).fillRoundedRect(-size / 2, -size * 0.18, size, size * 0.36, size * 0.18);
  g.fillStyle(COLORS.pathDots);
  for (let i = 0; i < 4; i++) {
    const x = -size * 0.33 + i * size * 0.22;
    const y = i % 2 === 0 ? -size * 0.05 : size * 0.05;
    g.fillEllipse(x, y, size * 0.09, size * 0.12);
  }
  return scene.add.container(0, 0, [g]);
}

/** Pictograma del tipo de prueba, sobre un círculo amarillo. */
export function drawQuizPictogram(scene: Phaser.Scene, kind: QuizKind, size: number): Phaser.GameObjects.Container {
  const r = size / 2;
  const bg = scene.add.graphics().fillStyle(COLORS.yellow).fillCircle(0, 0, r);
  const parts: Phaser.GameObjects.GameObject[] = [bg];
  const s = size * 0.26;
  const place = (o: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject, x: number, y: number): void => {
    o.setPosition(x, y);
    parts.push(o);
  };
  switch (kind) {
    case 'count':
      place(drawDots(scene, 3, size * 0.56), 0, 0);
      break;
    case 'compare':
      for (let i = 0; i < 3; i++) place(fitImage(scene.add.image(0, 0, 'cookie'), s * 0.9), -r * 0.42, -r * 0.4 + i * s * 0.8);
      place(fitImage(scene.add.image(0, 0, 'cookie'), s * 0.9), r * 0.42, 0);
      break;
    case 'series':
      place(drawShape(scene, 'circle', COLORS.coral, s), -r * 0.5, 0);
      place(drawShape(scene, 'square', 0x4da3ff, s), 0, 0);
      place(drawShape(scene, 'circle', COLORS.coral, s), r * 0.5, 0);
      break;
    case 'shapes':
      place(drawShape(scene, 'triangle', COLORS.coral, s), -r * 0.42, r * 0.2);
      place(drawShape(scene, 'circle', 0x4da3ff, s), r * 0.42, r * 0.2);
      place(drawShape(scene, 'square', COLORS.purple, s), 0, -r * 0.35);
      break;
    case 'name-letters': {
      const g = scene.add.graphics();
      g.fillStyle(COLORS.white).fillRoundedRect(-r * 0.6, -r * 0.45, r * 1.2, r * 0.9, 10);
      g.fillStyle(COLORS.ink);
      // Tres «letras» como barras gruesas: sin palabras.
      [-0.35, 0, 0.35].forEach((x) => g.fillRoundedRect(x * r - 5, -r * 0.25, 10, r * 0.5, 4));
      parts.push(g);
      break;
    }
    case 'recall': {
      const g = scene.add.graphics();
      g.fillStyle(COLORS.white).fillCircle(0, -r * 0.08, r * 0.55).fillCircle(-r * 0.45, r * 0.55, r * 0.12).fillCircle(-r * 0.62, r * 0.78, r * 0.07);
      parts.push(g);
      place(fitImage(scene.add.image(0, 0, 'hedgehog'), r * 0.75), 0, -r * 0.08);
      break;
    }
    default:
      parts.push(...drawNewPictogram(scene, kind, size));
      break;
  }
  return scene.add.container(0, 0, parts);
}

/** Marca de progreso: estrella (acertada), círculo vacío (fallada) o círculo grande con borde (actual). */
export function drawProgressMark(scene: Phaser.Scene, mark: Mark, current: boolean): Phaser.GameObjects.Container {
  if (mark === 'correct') return scene.add.container(0, 0, [fitImage(scene.add.image(0, 0, 'star'), 46)]);
  const g = scene.add.graphics();
  if (mark === 'failed') {
    g.lineStyle(5, COLORS.lockedDark).strokeCircle(0, 0, 16);
  } else if (current) {
    g.fillStyle(COLORS.white).fillCircle(0, 0, 24);
    g.lineStyle(6, COLORS.coral).strokeCircle(0, 0, 24);
  } else {
    g.fillStyle(COLORS.white, 0.85).fillCircle(0, 0, 14);
  }
  return scene.add.container(0, 0, [g]);
}

/** Cruz sobre una opción apagada (para no depender solo de la transparencia). */
export function drawCross(scene: Phaser.Scene, size: number): Phaser.GameObjects.Graphics {
  const h = size / 2;
  const g = scene.add.graphics();
  g.lineStyle(10, COLORS.white).lineBetween(-h, -h, h, h).lineBetween(-h, h, h, -h);
  g.lineStyle(6, COLORS.ink).lineBetween(-h, -h, h, h).lineBetween(-h, h, h, -h);
  return g;
}
