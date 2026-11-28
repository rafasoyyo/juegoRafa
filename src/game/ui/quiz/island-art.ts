/**
 * Arte propio de las pruebas de la bandera de la isla (mundo 3), con Graphics en el estilo plano del
 * juego: dinosaurios (a color o como sombra), cosas de todos los días con su forma, piezas sin simetría,
 * escenas de «dónde está», huevos y el nido, y sus pictogramas. Todo se centra en (0, 0).
 */

import Phaser from 'phaser';
import { COLORS } from '../../config';
import type { DinoId, EggPattern, FigureId, GridCell, PieceId, PlaceRel, QuizKind, ShapeId, SolidId, ThingId } from '../../../learning/quiz/types';

type G = Phaser.GameObjects.Graphics;
type C = Phaser.GameObjects.Container;
type XY = readonly [number, number];

const V = (x: number, y: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x, y);
const poly = (g: G, pts: readonly XY[], s: number, dx = 0, dy = 0, flip = 1): void => {
  g.fillPoints(pts.map(([x, y]) => V(x * s * flip + dx, y * s + dy)), true);
};

// --- Dinosaurios ---------------------------------------------------------------------------------

/** Tono de cada parte: cuerpo, sombra del cuerpo (patas de atrás), barriga, adorno (placas, cresta) y ojo. */
type Tone = 'body' | 'dark' | 'light' | 'accent' | 'eye';
type Part = { t: 'e'; c: Tone; x: number; y: number; rx: number; ry: number } | { t: 'p'; c: Tone; pts: XY[] } | { t: 'r'; c: Tone; x: number; y: number; w: number; h: number };

const leg = (x: number, top: number, w = 0.08, c: Tone = 'body'): Part => ({ t: 'r', c, x, y: top, w, h: 0.42 - top });

/** Dinosaurios en una caja unidad mirando a la derecha, con los pies en y = 0,42. */
const DINO_PARTS: Record<DinoId, Part[]> = {
  trex: [
    leg(-0.13, 0.02, 0.09, 'dark'),
    { t: 'p', c: 'body', pts: [[-0.5, -0.06], [-0.12, -0.16], [-0.1, 0.06]] },
    { t: 'e', c: 'body', x: -0.03, y: -0.03, rx: 0.2, ry: 0.15 },
    { t: 'e', c: 'light', x: 0.02, y: 0.03, rx: 0.12, ry: 0.08 },
    leg(0.0, 0.02, 0.1),
    { t: 'r', c: 'body', x: 0.0, y: 0.37, w: 0.16, h: 0.05 },
    { t: 'p', c: 'body', pts: [[0.08, -0.12], [0.18, -0.34], [0.26, -0.2], [0.16, -0.02]] },
    { t: 'e', c: 'body', x: 0.27, y: -0.3, rx: 0.17, ry: 0.11 },
    { t: 'r', c: 'body', x: 0.24, y: -0.26, w: 0.2, h: 0.08 },
    { t: 'r', c: 'dark', x: 0.15, y: -0.06, w: 0.1, h: 0.04 },
    { t: 'e', c: 'eye', x: 0.3, y: -0.34, rx: 0.025, ry: 0.025 },
  ],
  brachio: [
    leg(-0.24, 0.1, 0.08, 'dark'),
    leg(0.06, 0.1, 0.08, 'dark'),
    { t: 'p', c: 'body', pts: [[-0.5, 0.16], [-0.26, -0.02], [-0.24, 0.14]] },
    { t: 'e', c: 'body', x: -0.06, y: 0.06, rx: 0.28, ry: 0.15 },
    { t: 'e', c: 'light', x: -0.04, y: 0.13, rx: 0.18, ry: 0.06 },
    leg(-0.14, 0.12),
    leg(0.14, 0.12),
    { t: 'p', c: 'body', pts: [[0.08, 0.02], [0.24, -0.04], [0.36, -0.36], [0.27, -0.4]] },
    { t: 'e', c: 'body', x: 0.34, y: -0.4, rx: 0.1, ry: 0.06 },
    { t: 'e', c: 'eye', x: 0.36, y: -0.42, rx: 0.02, ry: 0.02 },
  ],
  trici: [
    leg(-0.24, 0.12, 0.08, 'dark'),
    leg(0.04, 0.12, 0.08, 'dark'),
    { t: 'p', c: 'body', pts: [[-0.5, 0.12], [-0.28, 0.0], [-0.28, 0.14]] },
    { t: 'e', c: 'body', x: -0.06, y: 0.06, rx: 0.28, ry: 0.17 },
    { t: 'e', c: 'light', x: -0.04, y: 0.14, rx: 0.18, ry: 0.06 },
    leg(-0.14, 0.14),
    leg(0.12, 0.14),
    { t: 'e', c: 'dark', x: 0.22, y: -0.04, rx: 0.1, ry: 0.18 },
    { t: 'e', c: 'body', x: 0.32, y: 0.06, rx: 0.14, ry: 0.1 },
    { t: 'p', c: 'light', pts: [[0.28, -0.02], [0.44, -0.2], [0.34, 0.0]] },
    { t: 'p', c: 'light', pts: [[0.42, 0.02], [0.5, -0.06], [0.46, 0.06]] },
    { t: 'e', c: 'eye', x: 0.34, y: 0.02, rx: 0.022, ry: 0.022 },
  ],
  stego: [
    { t: 'p', c: 'accent', pts: [[-0.3, -0.02], [-0.24, -0.22], [-0.16, -0.06]] },
    { t: 'p', c: 'accent', pts: [[-0.16, -0.08], [-0.08, -0.3], [0.0, -0.08]] },
    { t: 'p', c: 'accent', pts: [[0.0, -0.08], [0.08, -0.26], [0.14, -0.04]] },
    { t: 'p', c: 'accent', pts: [[0.13, -0.02], [0.2, -0.16], [0.24, 0.02]] },
    leg(-0.22, 0.12, 0.08, 'dark'),
    leg(0.06, 0.12, 0.08, 'dark'),
    { t: 'p', c: 'body', pts: [[-0.5, 0.06], [-0.28, 0.02], [-0.28, 0.16]] },
    { t: 'p', c: 'light', pts: [[-0.5, 0.06], [-0.48, -0.06], [-0.44, 0.06]] },
    { t: 'e', c: 'body', x: -0.04, y: 0.08, rx: 0.28, ry: 0.15 },
    { t: 'e', c: 'light', x: -0.02, y: 0.15, rx: 0.17, ry: 0.05 },
    leg(-0.14, 0.14),
    leg(0.14, 0.14),
    { t: 'p', c: 'body', pts: [[0.2, 0.04], [0.36, 0.12], [0.36, 0.22], [0.2, 0.18]] },
    { t: 'e', c: 'body', x: 0.38, y: 0.17, rx: 0.08, ry: 0.06 },
    { t: 'e', c: 'eye', x: 0.4, y: 0.15, rx: 0.018, ry: 0.018 },
  ],
  ptero: [
    { t: 'p', c: 'dark', pts: [[-0.06, -0.02], [-0.5, -0.3], [-0.3, 0.06]] },
    { t: 'e', c: 'body', x: 0.0, y: 0.02, rx: 0.15, ry: 0.07 },
    { t: 'p', c: 'body', pts: [[0.06, -0.02], [-0.32, 0.36], [-0.1, 0.06]] },
    { t: 'p', c: 'body', pts: [[0.04, -0.03], [0.4, -0.36], [0.16, 0.04]] },
    { t: 'e', c: 'body', x: 0.22, y: -0.02, rx: 0.08, ry: 0.06 },
    { t: 'p', c: 'light', pts: [[0.26, -0.04], [0.5, 0.02], [0.26, 0.02]] },
    { t: 'p', c: 'accent', pts: [[0.2, -0.06], [0.06, -0.16], [0.24, -0.04]] },
    { t: 'e', c: 'eye', x: 0.24, y: -0.03, rx: 0.018, ry: 0.018 },
  ],
};

/** Colores (cuerpo, sombra, barriga, adorno) de cada dinosaurio, en tonos de estilo documental. */
export const DINO_COLORS: Record<DinoId, [number, number, number, number]> = {
  trex: [0x6f9a45, 0x4f7432, 0xe9dcae, 0x4f7432],
  brachio: [0x6c9fbf, 0x4c7b99, 0xdde9ef, 0x4c7b99],
  trici: [0xc98a43, 0x9c642b, 0xf1dfb6, 0x9c642b],
  stego: [0x9a9b45, 0x74752f, 0xe8e2b0, 0xc9573c],
  ptero: [0xb0694f, 0x8a4a35, 0xf2c94c, 0xc9573c],
};

const SHADOW_INK = 0x3a3150;

/** Dinosaurio a color o como sombra (todo de un color), mirando a la derecha o, con `flip`, a la izquierda. */
export function drawDino(scene: Phaser.Scene, dino: DinoId, shadow: boolean, flip: boolean, size: number): C {
  const g = scene.add.graphics();
  const [body, dark, light, accent] = DINO_COLORS[dino];
  const color = (t: Tone): number => (shadow ? SHADOW_INK : t === 'body' ? body : t === 'dark' ? dark : t === 'light' ? light : t === 'accent' ? accent : COLORS.ink);
  const f = flip ? -1 : 1;
  // Sombra en el suelo (no la lleva el pterosaurio, que vuela).
  if (dino !== 'ptero') g.fillStyle(0x000000, 0.12).fillEllipse(0, size * 0.43, size * 0.8, size * 0.07);
  for (const p of DINO_PARTS[dino]) {
    if (shadow && p.c === 'eye') continue;
    g.fillStyle(color(p.c));
    if (p.t === 'e') g.fillEllipse(p.x * size * f, p.y * size, p.rx * 2 * size, p.ry * 2 * size);
    else if (p.t === 'r') g.fillRoundedRect(Math.min(p.x * f, (p.x + p.w) * f) * size, p.y * size, p.w * size, p.h * size, Math.min(6, p.w * size * 0.3));
    else poly(g, p.pts, size, 0, 0, f);
  }
  return scene.add.container(0, 0, [g]);
}

// --- Cosas con forma -----------------------------------------------------------------------------

/** Cosa de todos los días que tiene una forma clara (rueda = círculo, ventana = cuadrado…). */
export function drawThing(scene: Phaser.Scene, thing: ThingId, size: number): C {
  const g = scene.add.graphics();
  const s = size;
  const h = s / 2;
  g.fillStyle(0x000000, 0.1);
  switch (thing) {
    case 'wheel':
      g.fillCircle(0, 6, h * 0.9);
      g.fillStyle(0x3b3b46).fillCircle(0, 0, h * 0.9);
      g.fillStyle(0xb8c2cc).fillCircle(0, 0, h * 0.55);
      g.lineStyle(s * 0.04, 0x7d8894);
      for (let i = 0; i < 6; i++) g.lineBetween(0, 0, Math.cos((i * Math.PI) / 3) * h * 0.5, Math.sin((i * Math.PI) / 3) * h * 0.5);
      g.fillStyle(0x5b6672).fillCircle(0, 0, h * 0.14);
      break;
    case 'clock':
      g.fillCircle(0, 6, h * 0.9);
      g.fillStyle(COLORS.coral).fillCircle(0, 0, h * 0.9);
      g.fillStyle(COLORS.white).fillCircle(0, 0, h * 0.74);
      g.fillStyle(COLORS.ink);
      for (let i = 0; i < 12; i++) g.fillCircle(Math.cos((i * Math.PI) / 6) * h * 0.62, Math.sin((i * Math.PI) / 6) * h * 0.62, s * 0.018);
      g.lineStyle(s * 0.05, COLORS.ink).lineBetween(0, 0, 0, -h * 0.5).lineBetween(0, 0, h * 0.34, h * 0.1);
      break;
    case 'window':
      g.fillRect(-h * 0.85, -h * 0.85 + 6, s * 0.85, s * 0.85);
      g.fillStyle(0xb9773e).fillRect(-h * 0.85, -h * 0.85, s * 0.85, s * 0.85);
      g.fillStyle(0x8fd0ff).fillRect(-h * 0.7, -h * 0.7, s * 0.7, s * 0.7);
      g.fillStyle(0xb9773e).fillRect(-s * 0.03, -h * 0.7, s * 0.06, s * 0.7).fillRect(-h * 0.7, -s * 0.03, s * 0.7, s * 0.06);
      g.fillStyle(COLORS.white, 0.7).fillTriangle(-h * 0.6, -h * 0.6, -h * 0.25, -h * 0.6, -h * 0.6, -h * 0.25);
      break;
    case 'gift':
      g.fillRect(-h * 0.8, -h * 0.7 + 6, s * 0.8, s * 0.8);
      g.fillStyle(COLORS.purple).fillRect(-h * 0.8, -h * 0.7, s * 0.8, s * 0.8);
      g.fillStyle(COLORS.yellow).fillRect(-s * 0.06, -h * 0.7, s * 0.12, s * 0.8).fillRect(-h * 0.8, h * 0.1 - s * 0.06, s * 0.8, s * 0.12);
      g.fillEllipse(-s * 0.12, -h * 0.78, s * 0.22, s * 0.13).fillEllipse(s * 0.12, -h * 0.78, s * 0.22, s * 0.13);
      break;
    case 'pizza':
      poly(g, [[0, 0.46], [-0.42, -0.36], [0.42, -0.36]], s, 0, 6);
      g.fillStyle(0xc98a43);
      poly(g, [[0, 0.46], [-0.42, -0.36], [0.42, -0.36]], s);
      g.fillStyle(0xffd27a);
      poly(g, [[0, 0.36], [-0.34, -0.28], [0.34, -0.28]], s);
      g.fillStyle(COLORS.coral).fillCircle(-s * 0.1, -s * 0.12, s * 0.06).fillCircle(s * 0.12, -s * 0.14, s * 0.06).fillCircle(0, s * 0.1, s * 0.05);
      break;
    case 'sail':
      g.fillStyle(0xb9773e).fillRoundedRect(-h * 0.8, h * 0.62, s * 0.8, s * 0.16, 8);
      g.fillStyle(0x8d5527).fillRect(-s * 0.02, -h * 0.9, s * 0.04, s * 0.78);
      g.fillStyle(COLORS.white);
      poly(g, [[0.04, -0.44], [0.04, 0.26], [0.42, 0.26]], s);
      g.fillStyle(COLORS.coral);
      poly(g, [[-0.04, -0.3], [-0.04, 0.26], [-0.34, 0.26]], s);
      break;
    case 'door':
      g.fillRect(-h * 0.5, -h * 0.9 + 6, s * 0.5, s * 0.9);
      g.fillStyle(0x9c642b).fillRoundedRect(-h * 0.5, -h * 0.9, s * 0.5, s * 0.9, 4);
      g.fillStyle(0xb9773e).fillRect(-h * 0.36, -h * 0.76, s * 0.36, s * 0.32).fillRect(-h * 0.36, h * 0.02, s * 0.36, s * 0.32);
      g.fillStyle(COLORS.yellow).fillCircle(h * 0.32, 0, s * 0.035);
      break;
    case 'book':
      g.fillRect(-h * 0.9, -h * 0.5 + 6, s * 0.9, s * 0.5);
      g.fillStyle(COLORS.white).fillRect(-h * 0.86, -h * 0.42, s * 0.88, s * 0.5);
      g.fillStyle(0x4da3ff).fillRoundedRect(-h * 0.9, -h * 0.5, s * 0.9, s * 0.44, 6);
      g.fillStyle(0x2f78c4).fillRect(-h * 0.9, -h * 0.5, s * 0.07, s * 0.44);
      g.fillStyle(COLORS.yellow).fillRect(-h * 0.3, -h * 0.25, s * 0.4, s * 0.06);
      break;
    case 'egg':
      g.fillEllipse(0, 6, s * 0.62, s * 0.86);
      g.fillStyle(0xf4e3c1).fillEllipse(0, 0, s * 0.62, s * 0.86);
      g.fillStyle(0xd7b98a).fillCircle(-s * 0.1, -s * 0.16, s * 0.05).fillCircle(s * 0.12, s * 0.02, s * 0.06).fillCircle(-s * 0.06, s * 0.2, s * 0.04);
      break;
    case 'starfish': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? 0.48 : 0.2;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        return [Math.cos(a) * r, Math.sin(a) * r] as const;
      });
      poly(g, pts, s, 0, 6);
      g.fillStyle(0xf28c28);
      poly(g, pts, s);
      g.fillStyle(0xffd27a).fillCircle(0, 0, s * 0.05);
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        g.fillCircle(Math.cos(a) * s * 0.24, Math.sin(a) * s * 0.24, s * 0.03);
      }
      break;
    }
    case 'kite':
      poly(g, [[0, -0.44], [0.3, 0], [0, 0.44], [-0.3, 0]], s, 0, 6);
      g.fillStyle(COLORS.coral);
      poly(g, [[0, -0.44], [0.3, 0], [0, 0.44], [-0.3, 0]], s);
      g.fillStyle(COLORS.yellow);
      poly(g, [[0, -0.44], [0.3, 0], [0, 0]], s);
      poly(g, [[0, 0.44], [-0.3, 0], [0, 0]], s);
      g.lineStyle(s * 0.025, COLORS.ink, 0.7).beginPath().moveTo(0, h * 0.88).lineTo(s * 0.08, h * 0.96).lineTo(-s * 0.04, h * 1.02).strokePath();
      break;
    case 'honeycomb': {
      const hex = (r: number): XY[] => Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3) * r, Math.sin((i * Math.PI) / 3) * r] as const);
      poly(g, hex(0.46), s, 0, 6);
      g.fillStyle(0xe0a800);
      poly(g, hex(0.46), s);
      g.fillStyle(0xffd23f);
      poly(g, hex(0.36), s);
      g.fillStyle(0xfff2a8, 0.8).fillEllipse(-s * 0.1, -s * 0.12, s * 0.16, s * 0.09);
      break;
    }
    case 'house':
      poly(g, [[0, -0.46], [0.42, -0.06], [0.42, 0.44], [-0.42, 0.44], [-0.42, -0.06]], s, 0, 6);
      g.fillStyle(0xffd27a);
      poly(g, [[0, -0.46], [0.42, -0.06], [0.42, 0.44], [-0.42, 0.44], [-0.42, -0.06]], s);
      g.fillStyle(COLORS.coral);
      poly(g, [[0, -0.46], [0.42, -0.06], [0.3, -0.06], [0, -0.33], [-0.3, -0.06], [-0.42, -0.06]], s);
      g.fillStyle(0x9c642b).fillRoundedRect(-s * 0.09, s * 0.12, s * 0.18, s * 0.32, 4);
      g.fillStyle(0x8fd0ff).fillRect(s * 0.16, -s * 0.0, s * 0.14, s * 0.14);
      break;
  }
  return scene.add.container(0, 0, [g]);
}

// --- Piezas sin simetría -------------------------------------------------------------------------

/** Contorno de cada pieza en la caja unidad y la marca blanca que la hace aún más «sin simetría». */
const PIECE_SHAPES: Record<PieceId, { pts: XY[]; dot: XY }> = {
  ell: { pts: [[-0.3, -0.46], [-0.1, -0.46], [-0.1, 0.26], [0.36, 0.26], [0.36, 0.46], [-0.3, 0.46]], dot: [0.24, 0.36] },
  flag: { pts: [[-0.3, -0.46], [0.4, -0.26], [-0.14, -0.04], [-0.14, 0.46], [-0.3, 0.46]], dot: [0.06, -0.26] },
  boot: {
    // Bota: caña con vuelta arriba, puntera redonda y tacón.
    pts: [[-0.3, -0.46], [0.14, -0.46], [0.14, -0.3], [0.06, -0.3], [0.06, 0.0], [0.3, 0.06], [0.42, 0.16], [0.46, 0.3], [0.42, 0.38], [-0.04, 0.38], [-0.04, 0.46], [-0.24, 0.46], [-0.24, -0.3], [-0.3, -0.3]],
    dot: [-0.09, -0.12],
  },
  arrow: { pts: [[-0.42, 0.46], [-0.42, -0.06], [0.08, -0.06], [0.08, -0.36], [0.46, 0.04], [0.08, 0.42], [0.08, 0.14], [-0.18, 0.14], [-0.18, 0.46]], dot: [-0.3, 0.32] },
};

/** Contorno de una pieza de lado `size`, girada y volteada, centrada en (0, 0). */
export function piecePoints(piece: PieceId, angle: number, mirrored: boolean, size: number): Phaser.Math.Vector2[] {
  const a = Phaser.Math.DegToRad(angle);
  return PIECE_SHAPES[piece].pts.map(([x, y]) => {
    const mx = mirrored ? -x : x;
    return V((mx * Math.cos(a) - y * Math.sin(a)) * size, (mx * Math.sin(a) + y * Math.cos(a)) * size);
  });
}

/** Pieza de un color, girada `angle` grados y volteada (espejo) si `mirrored`. */
export function drawPiece(scene: Phaser.Scene, piece: PieceId, angle: number, mirrored: boolean, color: number, size: number): C {
  const { pts, dot } = PIECE_SHAPES[piece];
  const a = Phaser.Math.DegToRad(angle);
  const tr = ([x, y]: XY): Phaser.Math.Vector2 => {
    const mx = mirrored ? -x : x;
    return V((mx * Math.cos(a) - y * Math.sin(a)) * size, (mx * Math.sin(a) + y * Math.cos(a)) * size);
  };
  const shape = pts.map(tr);
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.12).fillPoints(shape.map((p) => V(p.x, p.y + size * 0.05)), true);
  g.fillStyle(color).fillPoints(shape, true);
  const d = tr(dot);
  g.fillStyle(COLORS.white).fillCircle(d.x, d.y, size * 0.06);
  return scene.add.container(0, 0, [g]);
}

// --- Huevos y nido -------------------------------------------------------------------------------

/** Colores de los huevos (índice de `egg.color`): azul, amarillo, rosa y verde, bien distintos. */
export const EGG_PALETTE = [0x8fd0ff, 0xffd23f, 0xff9fb2, 0x9ad36a] as const;
const EGG_MARK = [0x3f86c4, 0xc98a1a, 0xd9566e, 0x4f9a33] as const;

/** Huevo de `size` px de alto con su dibujo (liso, manchas o rayas). */
export function drawEgg(scene: Phaser.Scene, color: number, pattern: EggPattern, size: number): C {
  const g = scene.add.graphics();
  const w = size * 0.72;
  const c = EGG_PALETTE[color % EGG_PALETTE.length]!;
  const m = EGG_MARK[color % EGG_MARK.length]!;
  g.fillStyle(0x000000, 0.12).fillEllipse(0, 5, w, size);
  g.fillStyle(c).fillEllipse(0, 0, w, size);
  g.fillStyle(m);
  if (pattern === 'spots') {
    for (const [x, y, r] of [[-0.14, -0.22, 0.08], [0.12, -0.05, 0.1], [-0.12, 0.17, 0.08], [0.1, 0.27, 0.06]] as const) g.fillCircle(x * size, y * size, r * size);
  } else if (pattern === 'stripes') {
    // Dos bandas en zigzag de lado a lado (dentro del huevo).
    for (const y of [-0.12, 0.14]) {
      const half = Math.sqrt(Math.max(0, 1 - (2 * y) ** 2)) * (w / 2) * 0.98;
      const pts: Phaser.Math.Vector2[] = [];
      const n = 6;
      for (let i = 0; i <= n; i++) pts.push(V(-half + (2 * half * i) / n, y * size + (i % 2 === 0 ? -0.04 : 0.04) * size));
      for (let i = n; i >= 0; i--) pts.push(V(-half + (2 * half * i) / n, y * size + (i % 2 === 0 ? 0.04 : 0.12) * size));
      g.fillPoints(pts, true);
    }
  }
  g.fillStyle(COLORS.white, 0.55).fillEllipse(-w * 0.2, -size * 0.25, w * 0.18, size * 0.14);
  return scene.add.container(0, 0, [g]);
}

/** Cuenco del nido (ramitas), de ancho `w`; el borde de arriba queda en y = 0. */
function nestBowl(scene: Phaser.Scene, w: number, front: boolean): G {
  const g = scene.add.graphics();
  if (!front) {
    g.fillStyle(0x7a4a24).fillEllipse(0, 0, w, w * 0.26);
    return g;
  }
  // Media elipse baja: el cuenco no tapa lo que hay dentro.
  const pts = Array.from({ length: 17 }, (_, i) => V(Math.cos((i * Math.PI) / 16) * (w / 2), Math.sin((i * Math.PI) / 16) * w * 0.3));
  g.fillStyle(0x9c642b).fillPoints(pts, true);
  g.fillStyle(0xb9773e).fillEllipse(0, 0, w, w * 0.12);
  g.lineStyle(Math.max(2, w * 0.02), 0x7a4a24);
  for (let i = 0; i < 4; i++) g.lineBetween(-w * 0.36 + i * w * 0.2, w * 0.08, -w * 0.28 + i * w * 0.2, w * 0.2);
  return g;
}

/** Nido con los huevos de la familia de ejemplo. */
export function drawNest(scene: Phaser.Scene, eggs: readonly { color: number; pattern: EggPattern }[], size: number): C {
  const w = size;
  const egg = w * 0.34;
  const c = scene.add.container(0, 0, [nestBowl(scene, w, false)]);
  eggs.forEach((e, i) => {
    const x = (i - (eggs.length - 1) / 2) * egg * 0.85;
    c.add(drawEgg(scene, e.color, e.pattern, egg).setPosition(x, -egg * (i === 1 ? 0.34 : 0.24)));
  });
  c.add(nestBowl(scene, w, true));
  c.y = egg * 0.3;
  return scene.add.container(0, 0, [c]);
}

// --- Dónde está ----------------------------------------------------------------------------------

type Holder = 'nest' | 'box' | 'basket' | 'cave';

/** Bebé dinosaurio: cuerpo redondo, cabeza grande y ojo. */
function drawBaby(scene: Phaser.Scene, size: number): C {
  const g = scene.add.graphics();
  const s = size;
  g.fillStyle(0x6f9a45).fillEllipse(-s * 0.06, s * 0.14, s * 0.62, s * 0.5);
  g.fillTriangle(-s * 0.3, s * 0.1, -s * 0.5, s * 0.3, -s * 0.24, s * 0.3);
  g.fillEllipse(s * 0.18, -s * 0.16, s * 0.5, s * 0.42);
  g.fillStyle(0xe9dcae).fillEllipse(0, s * 0.22, s * 0.36, s * 0.24);
  g.fillStyle(COLORS.white).fillCircle(s * 0.26, -s * 0.2, s * 0.09);
  g.fillStyle(COLORS.ink).fillCircle(s * 0.28, -s * 0.2, s * 0.05);
  g.fillStyle(0xf4e3c1).fillEllipse(-s * 0.02, s * 0.38, s * 0.62, s * 0.18);
  return scene.add.container(0, 0, [g]);
}

/**
 * Lo que guarda la cosa: la parte de atrás (lo que queda detrás de lo de dentro) y la de delante, de ancho
 * `w`, con la boca arriba en y = 0. Cerrada (`closed`), la caja lleva tapa y el cesto un paño: así «encima»
 * no se confunde con «dentro».
 */
function holderParts(scene: Phaser.Scene, holder: Holder, w: number, closed: boolean): { back: G; front: G; height: number } {
  const back = scene.add.graphics();
  const front = scene.add.graphics();
  const h = w * 0.5;
  switch (holder) {
    case 'nest':
      return { back: nestBowl(scene, w, false), front: nestBowl(scene, w, true), height: w * 0.3 };
    case 'box':
      if (!closed) {
        back.fillStyle(0xa8743f).fillRect(-w / 2, -h * 0.05, w, h * 0.1);
        back.fillStyle(0xd9a566).fillPoints([V(-w / 2, 0), V(-w * 0.62, -h * 0.36), V(-w * 0.3, -h * 0.36), V(-w * 0.2, 0)], true);
      }
      front.fillStyle(0xc98f52).fillRect(-w / 2, 0, w, h);
      front.fillStyle(0xd9a566).fillRect(-w / 2, 0, w, h * 0.14);
      if (closed) front.fillStyle(0xb07a42).fillRect(-w * 0.54, -h * 0.06, w * 1.08, h * 0.16);
      front.fillStyle(0xe8c48a).fillRect(-w * 0.06, h * 0.14, w * 0.12, h * 0.3);
      return { back, front, height: h };
    case 'basket':
      if (closed) {
        back.fillStyle(0xff9fb2).fillEllipse(0, 0, w * 1.02, w * 0.2);
      } else {
        back.fillStyle(0x8d5527).fillEllipse(0, 0, w, w * 0.18);
        back.lineStyle(w * 0.05, 0x8d5527).beginPath().arc(0, 0, w * 0.4, Math.PI, 0).strokePath();
      }
      front.fillStyle(0xb9773e).fillRoundedRect(-w / 2, 0, w, h * 0.8, { tl: 0, tr: 0, bl: w * 0.14, br: w * 0.14 });
      front.fillStyle(0xd4904f).fillRect(-w / 2, 0, w, h * 0.16);
      front.lineStyle(3, 0x8d5527);
      for (let i = 1; i < 5; i++) front.lineBetween(-w / 2 + (w * i) / 5, h * 0.2, -w / 2 + (w * i) / 5, h * 0.72);
      return { back, front, height: h * 0.8 };
    case 'cave':
      // La cueva es una roca con el hueco oscuro; lo de dentro se ve en el hueco.
      back.fillStyle(0x6e6476).fillEllipse(0, h * 0.5, w, h * 1.5);
      back.fillStyle(0x2f2838).fillEllipse(0, h * 0.62, w * 0.56, h * 0.9);
      front.fillStyle(0x8a8092).fillEllipse(-w * 0.18, h * 0.02, w * 0.34, h * 0.36).fillEllipse(w * 0.22, h * 0.14, w * 0.26, h * 0.28);
      front.fillStyle(0x6e6476).fillRect(-w * 0.5, h * 1.0, w, h * 0.2);
      return { back, front, height: h * 1.2 };
  }
}

/** Escena de posición: la cosa (huevo o bebé) dentro, fuera, encima, debajo, delante, detrás, a la izquierda o a la derecha. */
export function drawPlace(scene: Phaser.Scene, rel: PlaceRel, thing: 'egg' | 'baby', holder: Holder, w: number, hgt: number): C {
  const hw = Math.min(w * 0.6, hgt * 0.68);
  const { back, front, height } = holderParts(scene, holder, hw, rel !== 'in');
  const t = hw * 0.5;
  const it = thing === 'egg' ? drawEgg(scene, 1, 'spots', t) : drawBaby(scene, t * 1.25);
  // Suelo común: la parte de abajo del dibujo.
  const ground = hgt * 0.44;
  const holderY = ground - height;
  // Techo de lo que guarda (la roca de la cueva sube por encima de su boca).
  const roof = holder === 'cave' ? holderY - hw * 0.13 : holderY;
  const c = scene.add.container(0, 0, [scene.add.graphics().fillStyle(0x000000, 0.08).fillEllipse(0, ground, w * 0.9, hgt * 0.08)]);
  const box = (y = holderY): C => scene.add.container(0, y, [back, front]);
  switch (rel) {
    case 'in':
      // Dentro: asoma la mitad de arriba (en la cueva, entera dentro del hueco).
      it.setPosition(0, holder === 'cave' ? holderY + height * 0.55 : holderY + t * 0.05);
      c.add([back.setY(holderY), it, front.setY(holderY)]);
      return c;
    case 'on':
      it.setPosition(0, roof - t * 0.46);
      c.add([box(), it]);
      return c;
    case 'under':
      // Debajo: la cosa en el suelo y lo que la tapa encima, apoyado en ella.
      it.setPosition(0, ground - t * 0.5);
      c.add([it, box(ground - t * 1.0 - height)]);
      return c;
    case 'behind':
      // Detrás: asoma por arriba y a un lado, más pequeña (está más lejos).
      it.setPosition(hw * 0.3, roof - t * 0.3).setScale(0.85);
      c.add([it, box()]);
      return c;
    case 'front':
      it.setPosition(-hw * 0.1, ground - t * 0.42).setScale(1.1);
      c.add([box(), it]);
      return c;
    case 'out':
    case 'right':
      it.setPosition(hw * 0.5 + t * 0.55, ground - t * 0.5);
      c.add([box().setX(-t * 0.4), it]);
      return c;
    case 'left':
      it.setPosition(-hw * 0.5 - t * 0.55, ground - t * 0.5);
      c.add([box().setX(t * 0.4), it]);
      return c;
  }
}

// --- Fósil ---------------------------------------------------------------------------------------

const SLAB = 0xd8c39a;
const SLAB_DARK = 0xb59c6e;
const BONE = 0xfaf3e0;

/** Un hueso pequeño (con sus dos nudos) centrado en (x, y) dentro de una casilla de lado `cell`. */
function bone(g: G, x: number, y: number, cell: number, turn: boolean): void {
  const l = cell * 0.3;
  const k = cell * 0.1;
  g.fillStyle(BONE);
  if (turn) {
    g.fillRect(x - k * 0.7, y - l, k * 1.4, l * 2);
    g.fillCircle(x - k * 0.8, y - l, k).fillCircle(x + k * 0.8, y - l, k).fillCircle(x - k * 0.8, y + l, k).fillCircle(x + k * 0.8, y + l, k);
  } else {
    g.fillRect(x - l, y - k * 0.7, l * 2, k * 1.4);
    g.fillCircle(x - l, y - k * 0.8, k).fillCircle(x - l, y + k * 0.8, k).fillCircle(x + l, y - k * 0.8, k).fillCircle(x + l, y + k * 0.8, k);
  }
}

/** Losa de piedra con huesos y el hueco (más oscuro y hundido) que hay que llenar. */
export function drawFossil(scene: Phaser.Scene, rows: number, cols: number, hole: readonly GridCell[], w: number, h: number): C {
  const cell = Math.min(w / cols, h / rows) * 0.92;
  const x0 = (-cols * cell) / 2;
  const y0 = (-rows * cell) / 2;
  const g = scene.add.graphics();
  g.fillStyle(SLAB_DARK).fillRoundedRect(x0 - 6, y0 - 6 + 6, cols * cell + 12, rows * cell + 12, 14);
  g.fillStyle(SLAB).fillRoundedRect(x0 - 6, y0 - 6, cols * cell + 12, rows * cell + 12, 14);
  const isHole = (r: number, c: number): boolean => hole.some((x) => x.row === r && x.col === c);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + (c + 0.5) * cell;
      const y = y0 + (r + 0.5) * cell;
      if (isHole(r, c)) {
        g.fillStyle(0x5a4a38).fillRect(x - cell / 2, y - cell / 2, cell, cell);
      } else {
        g.lineStyle(2, SLAB_DARK).strokeRect(x - cell / 2, y - cell / 2, cell, cell);
        bone(g, x, y, cell, (r + c) % 2 === 1);
      }
    }
  }
  // Borde del hueco, para que su forma se lea bien.
  g.lineStyle(5, COLORS.coral);
  for (const { row, col } of hole) {
    const x = x0 + col * cell;
    const y = y0 + row * cell;
    if (!isHole(row - 1, col)) g.lineBetween(x, y, x + cell, y);
    if (!isHole(row + 1, col)) g.lineBetween(x, y + cell, x + cell, y + cell);
    if (!isHole(row, col - 1)) g.lineBetween(x, y, x, y + cell);
    if (!isHole(row, col + 1)) g.lineBetween(x + cell, y, x + cell, y + cell);
  }
  return scene.add.container(0, 0, [g]);
}

/** Trozo de fósil: sus casillas de piedra con hueso, todas del mismo tamaño en cualquier opción. */
export function drawBones(scene: Phaser.Scene, cells: readonly GridCell[], size: number): C {
  const cell = size / 4.2;
  const rows = Math.max(...cells.map((x) => x.row)) + 1;
  const cols = Math.max(...cells.map((x) => x.col)) + 1;
  const x0 = (-cols * cell) / 2;
  const y0 = (-rows * cell) / 2;
  const g = scene.add.graphics();
  for (const { row, col } of cells) g.fillStyle(SLAB_DARK).fillRect(x0 + col * cell, y0 + row * cell + 5, cell, cell);
  for (const { row, col } of cells) {
    g.fillStyle(SLAB).fillRect(x0 + col * cell, y0 + row * cell, cell, cell);
    g.lineStyle(2, SLAB_DARK).strokeRect(x0 + col * cell, y0 + row * cell, cell, cell);
    bone(g, x0 + (col + 0.5) * cell, y0 + (row + 0.5) * cell, cell, (row + col) % 2 === 1);
  }
  return scene.add.container(0, 0, [g]);
}

// --- Piel de escamas -----------------------------------------------------------------------------

/** Colores de las escamas (índice de `tile.color`); cada uno lleva además su marca blanca. */
export const SKIN_PALETTE = [0x58c25a, 0xf28c28, 0x4da3ff, 0x8e6cf0, 0xffc93c] as const;

/** Escama redonda de un color con su marca (punto, triángulo, cuadrado, rombo o aro). */
function scale(g: G, color: number, x: number, y: number, r: number): void {
  g.fillStyle(0x000000, 0.12).fillCircle(x, y + r * 0.12, r);
  g.fillStyle(SKIN_PALETTE[color % SKIN_PALETTE.length]!).fillCircle(x, y, r);
  g.fillStyle(COLORS.white, 0.9);
  const m = r * 0.36;
  switch (color % SKIN_PALETTE.length) {
    case 0:
      g.fillCircle(x, y, m * 0.8);
      break;
    case 1:
      g.fillTriangle(x, y - m, x + m, y + m * 0.8, x - m, y + m * 0.8);
      break;
    case 2:
      g.fillRect(x - m * 0.8, y - m * 0.8, m * 1.6, m * 1.6);
      break;
    case 3:
      g.fillPoints([V(x, y - m), V(x + m * 0.8, y), V(x, y + m), V(x - m * 0.8, y)], true);
      break;
    default:
      g.lineStyle(r * 0.14, COLORS.white, 0.9).strokeCircle(x, y, m);
  }
}

/** Piel de dinosaurio: escamas en filas, con un hueco claro y punteado donde falta una. */
export function drawMosaic(scene: Phaser.Scene, rows: number, cols: number, tiles: readonly number[], w: number, h: number): C {
  const cell = Math.min(w / cols, h / rows) * 0.92;
  const x0 = (-cols * cell) / 2;
  const y0 = (-rows * cell) / 2;
  const g = scene.add.graphics();
  g.fillStyle(0x4f7432).fillRoundedRect(x0 - 8, y0 - 8, cols * cell + 16, rows * cell + 16, 18);
  tiles.forEach((t, i) => {
    const x = x0 + ((i % cols) + 0.5) * cell;
    const y = y0 + (Math.floor(i / cols) + 0.5) * cell;
    if (t < 0) {
      g.fillStyle(COLORS.white, 0.85).fillCircle(x, y, cell * 0.42);
      g.lineStyle(5, COLORS.coral).strokeCircle(x, y, cell * 0.42);
    } else {
      scale(g, t, x, y, cell * 0.42);
    }
  });
  return scene.add.container(0, 0, [g]);
}

export function drawTile(scene: Phaser.Scene, color: number, size: number): C {
  const g = scene.add.graphics();
  scale(g, color, 0, 0, size / 2);
  return scene.add.container(0, 0, [g]);
}

// --- Cuello que crece ----------------------------------------------------------------------------

/** Dinosaurio de cuello largo con `length` trozos de cuello (de colores alternos, para contarlos). */
export function drawNeck(scene: Phaser.Scene, length: number, size: number): C {
  const g = scene.add.graphics();
  const s = size;
  const [body, dark, light] = DINO_COLORS.brachio;
  // El cuerpo siempre en el mismo sitio: así se comparan los cuellos de un vistazo.
  const bx = -s * 0.02;
  const by = s * 0.28;
  g.fillStyle(dark).fillRect(bx - s * 0.2, by, s * 0.08, s * 0.18).fillRect(bx + s * 0.08, by, s * 0.08, s * 0.18);
  g.fillStyle(body).fillTriangle(bx - s * 0.48, by + s * 0.04, bx - s * 0.2, by - s * 0.08, bx - s * 0.2, by + s * 0.08);
  g.fillEllipse(bx, by, s * 0.5, s * 0.26);
  g.fillStyle(light).fillEllipse(bx, by + s * 0.06, s * 0.32, s * 0.08);
  g.fillStyle(body).fillRect(bx - s * 0.12, by, s * 0.08, s * 0.2).fillRect(bx + s * 0.14, by, s * 0.08, s * 0.2);
  // Trozos de cuello hacia arriba y a la derecha.
  const seg = s * 0.085;
  const dx = Math.cos(Phaser.Math.DegToRad(-62)) * seg;
  const dy = Math.sin(Phaser.Math.DegToRad(-62)) * seg;
  let x = bx + s * 0.18;
  let y = by - s * 0.06;
  for (let i = 0; i < length; i++) {
    g.fillStyle(i % 2 === 0 ? body : dark).fillCircle(x, y, seg * 0.62);
    x += dx;
    y += dy;
  }
  g.fillStyle(body).fillEllipse(x + seg * 0.3, y, seg * 1.9, seg * 1.2);
  g.fillStyle(COLORS.ink).fillCircle(x + seg * 0.5, y - seg * 0.15, seg * 0.16);
  return scene.add.container(0, 0, [g]);
}

// --- Cuerpos y rampa -----------------------------------------------------------------------------

/** Cuerpo geométrico con luces y sombras planas: los redondos se ven redondos y los de caras, planos. */
export function drawSolid(scene: Phaser.Scene, solid: SolidId, size: number): C {
  const g = scene.add.graphics();
  const s = size;
  g.fillStyle(0x000000, 0.12).fillEllipse(0, s * 0.4, s * 0.8, s * 0.1);
  switch (solid) {
    case 'ball':
      g.fillStyle(0xff6b5e).fillCircle(0, 0, s * 0.38);
      g.fillStyle(0xc2463b).fillEllipse(s * 0.08, s * 0.12, s * 0.56, s * 0.5);
      g.fillStyle(0xff6b5e).fillCircle(-s * 0.04, -s * 0.04, s * 0.3);
      g.fillStyle(COLORS.white, 0.7).fillEllipse(-s * 0.14, -s * 0.16, s * 0.14, s * 0.09);
      break;
    case 'cylinder':
      // Tumbado: se ve la tapa redonda a un lado.
      g.fillStyle(0x2f78c4).fillRect(-s * 0.3, -s * 0.24, s * 0.56, s * 0.48);
      g.fillStyle(0x4da3ff).fillRect(-s * 0.3, -s * 0.24, s * 0.56, s * 0.2);
      g.fillStyle(0x2f78c4).fillEllipse(-s * 0.3, 0, s * 0.2, s * 0.48);
      g.fillStyle(0x8fc6ff).fillEllipse(s * 0.26, 0, s * 0.2, s * 0.48);
      break;
    case 'cone':
      // Tumbado: la punta a la izquierda y la base redonda a la derecha.
      g.fillStyle(0xe0a800).fillTriangle(-s * 0.4, s * 0.06, s * 0.24, -s * 0.28, s * 0.24, s * 0.36);
      g.fillStyle(0xffd23f).fillTriangle(-s * 0.4, s * 0.06, s * 0.24, -s * 0.28, s * 0.24, s * 0.06);
      g.fillStyle(0xfff2a8).fillEllipse(s * 0.24, s * 0.04, s * 0.2, s * 0.64);
      break;
    case 'cube':
      g.fillStyle(0x58c25a).fillRect(-s * 0.32, -s * 0.18, s * 0.5, s * 0.5);
      g.fillStyle(0x8fdc84).fillPoints([V(-s * 0.32, -s * 0.18), V(-s * 0.16, -s * 0.34), V(s * 0.34, -s * 0.34), V(s * 0.18, -s * 0.18)], true);
      g.fillStyle(0x3f9a43).fillPoints([V(s * 0.18, -s * 0.18), V(s * 0.34, -s * 0.34), V(s * 0.34, s * 0.16), V(s * 0.18, s * 0.32)], true);
      break;
    case 'pyramid':
      g.fillStyle(0x8e6cf0).fillTriangle(0, -s * 0.38, -s * 0.36, s * 0.32, s * 0.16, s * 0.32);
      g.fillStyle(0x6a4bc4).fillTriangle(0, -s * 0.38, s * 0.16, s * 0.32, s * 0.36, s * 0.18);
      break;
    case 'brick':
      g.fillStyle(0xff7a59).fillRect(-s * 0.4, -s * 0.06, s * 0.66, s * 0.36);
      g.fillStyle(0xffa98f).fillPoints([V(-s * 0.4, -s * 0.06), V(-s * 0.26, -s * 0.2), V(s * 0.4, -s * 0.2), V(s * 0.26, -s * 0.06)], true);
      g.fillStyle(0xc9573c).fillPoints([V(s * 0.26, -s * 0.06), V(s * 0.4, -s * 0.2), V(s * 0.4, s * 0.16), V(s * 0.26, s * 0.3)], true);
      break;
  }
  return scene.add.container(0, 0, [g]);
}

/** Rampa de la consigna: con una bola fantasma que gira y baja (rodar) o un cubo fantasma con un tope (quedarse). */
export function drawRamp(scene: Phaser.Scene, ask: 'roll' | 'stay', w: number, h: number): C {
  const g = scene.add.graphics();
  const rw = Math.min(w, h * 1.8) * 0.9;
  const rh = rw * 0.42;
  const left = -rw / 2;
  const base = rh / 2;
  g.fillStyle(0x8d5527).fillTriangle(left, base - rh + 6, left, base + 6, rw / 2, base + 6);
  g.fillStyle(0xb9773e).fillTriangle(left, base - rh, left, base, rw / 2, base);
  g.fillStyle(0x58c25a).fillRect(-rw / 2 - 10, base, rw + 20, 10);
  const slope = Math.atan2(rh, rw);
  const at = (t: number, lift: number): [number, number] => [left + rw * t + Math.sin(slope) * lift, base - rh * (1 - t) - Math.cos(slope) * lift];
  const r = rh * 0.26;
  if (ask === 'roll') {
    // Tres bolas cada vez más abajo, de la más clara a la más fuerte, y una flecha que gira.
    [0.2, 0.45, 0.7].forEach((t, i) => {
      const [x, y] = at(t, r);
      g.fillStyle(0xff6b5e, 0.3 + i * 0.35).fillCircle(x, y, r);
    });
    const [x, y] = at(0.7, r);
    g.lineStyle(6, COLORS.ink).beginPath().arc(x, y, r * 1.5, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340)).strokePath();
    g.fillStyle(COLORS.ink).fillTriangle(x + r * 1.75, y - r * 0.55, x + r * 1.15, y - r * 0.45, x + r * 1.5, y - r * 0.05);
  } else {
    // Un cubo arriba de la rampa, quieto, con dos rayitas de «quieto» y sin estela.
    const [x, y] = at(0.3, r);
    g.save();
    g.translateCanvas(x, y);
    g.rotateCanvas(slope);
    g.fillStyle(0x58c25a).fillRect(-r, -r, r * 2, r * 2);
    g.fillStyle(0x3f9a43).fillRect(-r, r * 0.6, r * 2, r * 0.4);
    g.restore();
    g.lineStyle(6, COLORS.ink).lineBetween(x - r * 1.7, y - r * 1.6, x - r * 1.7, y - r * 0.4).lineBetween(x + r * 1.7, y - r * 2.1, x + r * 1.7, y - r * 0.9);
  }
  return scene.add.container(0, 0, [g]);
}

// --- Formas escondidas ---------------------------------------------------------------------------

/** Dibujo de líneas con triángulos que se solapan, sobre fondo claro. */
export function drawFigure(scene: Phaser.Scene, figure: FigureId, size: number): C {
  const g = scene.add.graphics();
  const h = size / 2;
  const lw = Math.max(5, size * 0.03);
  const tri: XY[] = [[0, -0.9], [0.95, 0.75], [-0.95, 0.75]];
  const P = ([x, y]: XY): Phaser.Math.Vector2 => V(x * h * 0.9, y * h * 0.9);
  const line = (a: XY, b: XY): void => {
    g.lineBetween(P(a).x, P(a).y, P(b).x, P(b).y);
  };
  const mid = (a: XY, b: XY, t = 0.5): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const square = figure === 'diagonal' || figure === 'two-diagonals';
  const corners: XY[] = square ? [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]] : tri;
  g.fillStyle(0xfff2a8).fillPoints(corners.map(P), true);
  g.lineStyle(lw, COLORS.ink);
  g.strokePoints(corners.map(P), true, true);
  const [A, B, Cc] = tri as [XY, XY, XY];
  switch (figure) {
    case 'one':
      break;
    case 'cut-top':
      line(mid(A, Cc), mid(A, B));
      break;
    case 'split-1':
      line(A, mid(Cc, B));
      break;
    case 'split-2':
      line(A, mid(Cc, B, 1 / 3));
      line(A, mid(Cc, B, 2 / 3));
      break;
    case 'triforce':
      line(mid(A, Cc), mid(A, B));
      line(mid(A, B), mid(Cc, B));
      line(mid(Cc, B), mid(A, Cc));
      break;
    case 'diagonal':
      line(corners[0]!, corners[2]!);
      break;
    case 'two-diagonals':
      line(corners[0]!, corners[2]!);
      line(corners[1]!, corners[3]!);
      break;
  }
  return scene.add.container(0, 0, [g]);
}

/** Formas sueltas (triángulos, círculos y cuadrados): en una fila si son pocas, en dos si son más. */
export function drawMix(scene: Phaser.Scene, shapes: readonly { shape: ShapeId; color: number }[], w: number, h: number): C {
  const g = scene.add.graphics();
  const rows = shapes.length <= 4 ? 1 : 2;
  const cols = Math.ceil(shapes.length / rows);
  const cell = Math.min(w / cols, h / rows, 150) * 0.9;
  shapes.forEach(({ shape, color }, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === 0 ? Math.min(cols, shapes.length) : shapes.length - cols;
    const x = ((i % cols) - (inRow - 1) / 2) * cell;
    const y = (row - (rows - 1) / 2) * cell;
    const r = cell * 0.36;
    for (const [dy, c] of [[5, 0x000000], [0, color]] as const) {
      g.fillStyle(c, dy ? 0.12 : 1);
      if (shape === 'triangle') g.fillTriangle(x, y - r + dy, x + r, y + r * 0.8 + dy, x - r, y + r * 0.8 + dy);
      else if (shape === 'circle') g.fillCircle(x, y + dy, r * 0.9);
      else g.fillRect(x - r * 0.8, y - r * 0.8 + dy, r * 1.6, r * 1.6);
    }
  });
  return scene.add.container(0, 0, [g]);
}

// --- Pictogramas ---------------------------------------------------------------------------------

/** Contenido del pictograma de las pruebas de la isla (sobre el círculo amarillo), o `null` si no es una de ellas. */
export function drawIslandPictogram(scene: Phaser.Scene, kind: QuizKind, size: number): Phaser.GameObjects.GameObject[] | null {
  const r = size / 2;
  switch (kind) {
    case 'dino-shadows':
      return [drawDino(scene, 'trex', true, false, r * 0.9).setPosition(r * 0.3, 0), drawDino(scene, 'trex', false, false, r * 0.9).setPosition(-r * 0.3, 0)];
    case 'shape-things':
      return [drawThing(scene, 'wheel', r * 0.9).setPosition(-r * 0.32, 0), drawThing(scene, 'house', r * 0.9).setPosition(r * 0.35, 0)];
    case 'stego-plates':
      return [drawDino(scene, 'stego', false, false, r * 1.5).setPosition(0, r * 0.05)];
    case 'turned-shapes':
      return [drawPiece(scene, 'flag', 0, false, COLORS.coral, r * 0.8).setPosition(-r * 0.35, 0), drawPiece(scene, 'flag', 90, false, COLORS.coral, r * 0.8).setPosition(r * 0.38, 0)];
    case 'nest':
      return [drawPlace(scene, 'in', 'baby', 'nest', r * 1.6, r * 1.3).setPosition(0, -r * 0.02)];
    case 'fossil':
      return [drawBones(scene, [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], r * 2.2)];
    case 'skin-mosaic':
      return [drawMosaic(scene, 2, 2, [0, 1, 1, -1], r * 1.2, r * 1.2)];
    case 'growing-neck':
      return [drawNeck(scene, 2, r * 0.9).setPosition(-r * 0.4, r * 0.1), drawNeck(scene, 4, r * 0.9).setPosition(r * 0.35, r * 0.05)];
    case 'roll-or-not':
      return [drawSolid(scene, 'ball', r * 0.9).setPosition(-r * 0.4, 0), drawSolid(scene, 'cube', r * 0.9).setPosition(r * 0.4, 0)];
    case 'hidden-triangles':
      return [drawFigure(scene, 'triforce', r * 1.3)];
    case 'island-review':
      return [drawDino(scene, 'trici', false, false, r * 1.1).setPosition(0, -r * 0.1)];
    case 'odd-egg':
      return [drawEgg(scene, 0, 'spots', r * 0.75).setPosition(-r * 0.38, 0), drawEgg(scene, 0, 'spots', r * 0.75).setPosition(0, 0), drawEgg(scene, 1, 'stripes', r * 0.75).setPosition(r * 0.4, 0)];
    default:
      return null;
  }
}
