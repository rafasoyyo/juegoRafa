/**
 * Dibujos simétricos de «La otra mitad», como datos puros: primitivas de la mitad izquierda en una caja
 * de 1×1 cuyo borde derecho (x = 1) es la línea de espejo. Ninguna primitiva cruza el eje.
 * Cada dibujo tiene una variante con un detalle cambiado, para la trampa de los medianos.
 */

import type { PictureId } from './types';

export type Prim =
  | { t: 'e'; cx: number; cy: number; rx: number; ry: number; color: number }
  | { t: 'r'; x: number; y: number; w: number; h: number; color: number }
  | { t: 't'; pts: [number, number][]; color: number };

const C = { coral: 0xff6b5e, yellow: 0xffd23f, purple: 0x7b5ea7, blue: 0x4da3ff, green: 0x58c25a, brown: 0xb9773e, white: 0xffffff, ink: 0x2b2340 } as const;

interface Picture {
  base: Prim[];
  /** Mismo dibujo con un detalle cambiado (una primitiva distinta). */
  variant: Prim[];
}

function withChange(base: Prim[], index: number, change: Prim): Prim[] {
  return base.map((p, i) => (i === index ? change : p));
}

function make(base: Prim[], index: number, change: Prim): Picture {
  return { base, variant: withChange(base, index, change) };
}

export const PICTURES: Record<PictureId, Picture> = {
  butterfly: make(
    [
      { t: 'e', cx: 0.45, cy: 0.3, rx: 0.42, ry: 0.28, color: C.coral },
      { t: 'e', cx: 0.52, cy: 0.72, rx: 0.32, ry: 0.22, color: C.purple },
      { t: 'r', x: 0.9, y: 0.12, w: 0.1, h: 0.8, color: C.ink },
      { t: 'e', cx: 0.4, cy: 0.28, rx: 0.12, ry: 0.12, color: C.white },
      { t: 't', pts: [[0.95, 0.12], [0.55, 0.0], [0.8, 0.14]], color: C.ink },
    ],
    3,
    { t: 't', pts: [[0.25, 0.4], [0.55, 0.4], [0.4, 0.14]], color: C.white },
  ),
  kite: make(
    [
      { t: 't', pts: [[1, 0.02], [0.02, 0.46], [1, 0.46]], color: C.coral },
      { t: 't', pts: [[1, 0.46], [0.02, 0.46], [1, 0.9]], color: C.yellow },
      { t: 'r', x: 0.95, y: 0.9, w: 0.05, h: 0.1, color: C.ink },
      { t: 'e', cx: 0.82, cy: 0.96, rx: 0.1, ry: 0.04, color: C.purple },
      { t: 't', pts: [[1, 0.2], [0.35, 0.46], [1, 0.46]], color: C.white },
    ],
    1,
    { t: 't', pts: [[1, 0.46], [0.02, 0.46], [1, 0.9]], color: C.blue },
  ),
  lalo: make(
    [
      { t: 'r', x: 0.05, y: 0.12, w: 0.95, h: 0.86, color: C.brown },
      { t: 't', pts: [[0.05, 0.12], [0.5, 0.12], [0.1, 0.0]], color: C.brown },
      { t: 'e', cx: 0.55, cy: 0.4, rx: 0.3, ry: 0.24, color: C.white },
      { t: 'e', cx: 0.62, cy: 0.42, rx: 0.11, ry: 0.11, color: C.ink },
      { t: 't', pts: [[1, 0.5], [0.78, 0.66], [1, 0.8]], color: C.yellow },
    ],
    2,
    { t: 'e', cx: 0.55, cy: 0.4, rx: 0.3, ry: 0.24, color: C.yellow },
  ),
  house: make(
    [
      { t: 'r', x: 0.08, y: 0.45, w: 0.92, h: 0.55, color: C.coral },
      { t: 't', pts: [[0.0, 0.45], [1, 0.08], [1, 0.45]], color: C.purple },
      { t: 'r', x: 0.68, y: 0.64, w: 0.32, h: 0.36, color: C.yellow },
      { t: 'r', x: 0.16, y: 0.58, w: 0.28, h: 0.24, color: C.blue },
      { t: 'r', x: 0.8, y: 0.0, w: 0.12, h: 0.2, color: C.ink },
    ],
    3,
    { t: 'e', cx: 0.3, cy: 0.7, rx: 0.14, ry: 0.14, color: C.blue },
  ),
  flower: make(
    [
      { t: 'e', cx: 0.5, cy: 0.18, rx: 0.2, ry: 0.16, color: C.coral },
      { t: 'e', cx: 0.2, cy: 0.42, rx: 0.17, ry: 0.2, color: C.coral },
      { t: 'e', cx: 0.82, cy: 0.42, rx: 0.17, ry: 0.15, color: C.yellow },
      { t: 'r', x: 0.9, y: 0.55, w: 0.1, h: 0.45, color: C.green },
      { t: 'e', cx: 0.3, cy: 0.82, rx: 0.28, ry: 0.1, color: C.green },
    ],
    1,
    { t: 't', pts: [[0.1, 0.42], [0.35, 0.18], [0.35, 0.66]], color: C.coral },
  ),
  fish: make(
    [
      { t: 'e', cx: 0.62, cy: 0.5, rx: 0.36, ry: 0.4, color: C.coral },
      { t: 't', pts: [[0.3, 0.4], [0.0, 0.62], [0.32, 0.72]], color: C.purple },
      { t: 't', pts: [[1, 0.88], [0.4, 1], [1, 1]], color: C.purple },
      { t: 'e', cx: 0.74, cy: 0.28, rx: 0.1, ry: 0.1, color: C.white },
      { t: 'e', cx: 0.78, cy: 0.3, rx: 0.05, ry: 0.05, color: C.ink },
    ],
    1,
    { t: 't', pts: [[0.3, 0.4], [0.0, 0.62], [0.32, 0.72]], color: C.blue },
  ),
};

export const PICTURE_IDS = Object.keys(PICTURES) as PictureId[];

export function mirrorPrim(p: Prim): Prim {
  switch (p.t) {
    case 'e':
      return { ...p, cx: 1 - p.cx };
    case 'r':
      return { ...p, x: 1 - p.x - p.w };
    case 't':
      return { ...p, pts: p.pts.map(([x, y]) => [1 - x, y] as [number, number]) };
  }
}

/** Primitivas de una mitad: la dibujada (izquierda) o su reflejo, con la variante pedida (0 o 1). */
export function halfPrims(picture: PictureId, mirrored: boolean, variant: number): Prim[] {
  const src = variant === 0 ? PICTURES[picture].base : PICTURES[picture].variant;
  return mirrored ? src.map(mirrorPrim) : src;
}

/** Texto canónico de una lista de primitivas (para comparar mitades). */
export function primsKey(prims: readonly Prim[]): string {
  return prims.map((p) => JSON.stringify(p)).sort().join('|');
}
