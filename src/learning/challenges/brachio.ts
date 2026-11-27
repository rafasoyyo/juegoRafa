/**
 * Reto C de la isla, «Paseo en braquiosaurio» (`docs/MUNDO-3.md`): en el lomo del braquiosaurio hay un
 * emblema tallado (una flecha, un escudo, una casa, la cabeza de un dinosaurio…) al que le falta una
 * pieza. El niño golpea el bloque con la pieza que lo completa. Las piezas no giran: la buena es la que
 * tiene la forma del hueco tal cual. TypeScript puro y con semilla.
 *
 * - 3-4 años: dos mitades (falta una).
 * - 5-6 años: emblemas de 2 o 3 piezas.
 * - 7-8 años: tangram de 4 piezas; uno de los bloques es la pieza buena girada, que no encaja.
 *
 * Los emblemas se dibujan en una cuadrícula de 4 × 4 unidades, con `y` hacia abajo.
 */

import type { Rng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';

export type Pt = readonly [number, number];
/** Una pieza: polígono de vértices en unidades de la cuadrícula. */
export type Poly = readonly Pt[];

/** Lado del emblema, en unidades. */
export const EMBLEM_UNITS = 4;

/** Medio disco de radio 2 con centro en (2, 2): `side` -1 es la mitad izquierda y 1 la derecha. */
function halfDisc(side: -1 | 1): Poly {
  const n = 12;
  return Array.from({ length: n + 1 }, (_, i): Pt => {
    const a = -Math.PI / 2 + (Math.PI * i) / n;
    return [2 + side * 2 * Math.cos(a), 2 + 2 * Math.sin(a)];
  });
}

const rect = (x0: number, y0: number, x1: number, y1: number): Poly => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

export const EMBLEMS = {
  // Dos mitades (3-4 años).
  disc: [halfDisc(-1), halfDisc(1)],
  block: [rect(0, 0, 2, 4), rect(2, 0, 4, 4)],
  peak: [[[0, 4], [2, 0], [2, 4]], [[2, 0], [4, 4], [2, 4]]],
  gem: [[[2, 0], [2, 4], [0, 2]], [[2, 0], [4, 2], [2, 4]]],
  // Dos o tres piezas (5-6 años).
  arrow: [[[2, 0], [4, 2], [2, 4]], rect(0, 1, 2, 3)],
  shield: [rect(0, 0, 4, 2), [[0, 2], [4, 2], [2, 4]]],
  house: [[[0, 2], [2, 0], [4, 2]], rect(0, 2, 4, 4)],
  'shield-3': [rect(0, 0, 4, 2), [[0, 2], [2, 2], [2, 4]], [[2, 2], [4, 2], [2, 4]]],
  'house-3': [[[0, 2], [2, 0], [4, 2]], rect(0, 2, 2, 4), rect(2, 2, 4, 4)],
  'dino-3': [rect(0, 0, 2, 2), [[2, 0], [4, 2], [2, 2]], rect(0, 2, 1, 4)],
  // Tangram de cuatro piezas (7-8 años).
  tablet: [[[0, 0], [4, 0], [0, 4]], [[4, 0], [4, 2], [2, 2]], rect(2, 2, 4, 4), [[2, 2], [2, 4], [0, 4]]],
  'arrow-4': [[[2, 0], [4, 2], [2, 2]], [[2, 2], [4, 2], [2, 4]], [[0, 1], [2, 1], [0, 3]], [[2, 1], [2, 3], [0, 3]]],
  'house-4': [[[0, 2], [2, 0], [4, 2]], rect(0, 2, 2, 4), [[2, 2], [4, 2], [4, 4]], [[2, 2], [4, 4], [2, 4]]],
  'dino-4': [rect(0, 0, 2, 2), [[2, 0], [4, 2], [2, 2]], rect(0, 2, 1, 4), [[1, 2], [2, 2], [1, 3]]],
} as const satisfies Record<string, readonly Poly[]>;

export type EmblemId = keyof typeof EMBLEMS;

export const EMBLEMS_BY_BAND: Record<AgeBand, readonly EmblemId[]> = {
  small: ['disc', 'block', 'peak', 'gem'],
  medium: ['arrow', 'shield', 'house', 'shield-3', 'house-3', 'dino-3'],
  big: ['tablet', 'arrow-4', 'house-4', 'dino-4'],
};

export interface BrachioChallenge {
  kind: 'brachio';
  emblem: EmblemId;
  /** Las piezas del emblema en su sitio, en unidades. */
  pieces: readonly Poly[];
  /** La que falta (el hueco). */
  missing: number;
  /** Las piezas de los tres bloques, con la esquina de su caja en (0, 0). */
  options: Poly[];
  correct: number;
}

const round = (v: number): number => Math.round(v * 1000) / 1000;

/** Caja de un polígono. */
export function bounds(p: Poly): { x: number; y: number; w: number; h: number } {
  const xs = p.map(([x]) => x);
  const ys = p.map(([, y]) => y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/** El polígono movido para que su caja empiece en (0, 0). */
export function normalize(p: Poly): Poly {
  const b = bounds(p);
  return p.map(([x, y]): Pt => [round(x - b.x), round(y - b.y)]);
}

/** Clave de la forma tal como se ve (sin girar): igual para dos piezas que encajan en el mismo hueco. */
export function polyKey(p: Poly): string {
  const pts = normalize(p).map(([x, y]) => `${x},${y}`);
  const variants: string[] = [];
  for (const list of [pts, [...pts].reverse()]) {
    for (let i = 0; i < list.length; i++) variants.push([...list.slice(i), ...list.slice(0, i)].join(' '));
  }
  return variants.sort()[0]!;
}

/** Un cuarto de vuelta a la derecha. */
export function turn(p: Poly): Poly {
  return normalize(p.map(([x, y]): Pt => [-y, x]));
}

/** Área de un polígono (fórmula del cordón). */
export function area(p: Poly): number {
  let s = 0;
  p.forEach(([x0, y0], i) => {
    const [x1, y1] = p[(i + 1) % p.length]!;
    s += x0 * y1 - x1 * y0;
  });
  return Math.abs(s) / 2;
}

export function brachioChallenge(band: AgeBand, rng: Rng): BrachioChallenge {
  const emblem = rng.pick(EMBLEMS_BY_BAND[band]);
  const pieces = EMBLEMS[emblem] as readonly Poly[];
  const missing = rng.int(0, pieces.length - 1);
  const good = normalize(pieces[missing]!);
  const goodKey = polyKey(good);
  const picked: Poly[] = [];
  const keys = new Set([goodKey]);
  const add = (p: Poly): void => {
    const k = polyKey(p);
    if (picked.length < 2 && !keys.has(k)) {
      keys.add(k);
      picked.push(normalize(p));
    }
  };
  // Mayores: la pieza buena girada, si así ya no encaja.
  if (band === 'big') add(turn(good));
  // Para los pequeños, las mitades del mismo lado de los otros emblemas; si no, cualquier pieza de la franja.
  const pool = EMBLEMS_BY_BAND[band].filter((e) => e !== emblem).flatMap((e) => {
    const ps = EMBLEMS[e] as readonly Poly[];
    return band === 'small' ? [ps[missing]!] : ps;
  });
  for (const p of rng.shuffle(pool)) add(p);
  const options = rng.shuffle([good, ...picked]);
  return { kind: 'brachio', emblem, pieces, missing, options, correct: options.findIndex((o) => polyKey(o) === goodKey) };
}
