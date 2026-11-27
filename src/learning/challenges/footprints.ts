/**
 * Reto A de la isla, «El camino de huellas» (`docs/MUNDO-3.md`): un puente de cinco losas sobre la lava,
 * cada una con una forma grabada que sigue una serie, al que le falta una. El niño elige la forma que
 * sigue. TypeScript puro y con semilla.
 */

import type { Rng } from '../quiz/rng';
import type { AgeBand, ShapeId } from '../quiz/types';

export const FOOTPRINT_SLABS = 5;

/** Color del grabado: la piedra se ilumina en turquesa, ámbar u óxido. */
export const GLYPH_COLORS = ['turquoise', 'amber', 'rust'] as const;
export type GlyphColor = (typeof GLYPH_COLORS)[number];

/** Grabado de una losa o de un bloque: `count` formas iguales (1 salvo en las series que crecen). */
export interface Glyph {
  shape: ShapeId;
  color: GlyphColor;
  count: number;
}

export type FootprintPattern = 'AB' | 'ABB' | 'AAB' | 'ABC' | 'grow';

export const FOOTPRINT_PATTERNS: Record<AgeBand, readonly FootprintPattern[]> = {
  small: ['AB'],
  medium: ['AB', 'ABB', 'AAB'],
  big: ['ABC', 'grow'],
};

/** Formas de las series de los medianos y los mayores (los pequeños ven solo círculos de colores). */
export const FOOTPRINT_SHAPES: Record<AgeBand, readonly ShapeId[]> = {
  small: ['circle'],
  medium: ['circle', 'square', 'triangle', 'star', 'diamond'],
  big: ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'],
};

/** Formas que caben en una losa en las series que crecen. */
export const MAX_GLYPH_COUNT = 5;

export interface FootprintsChallenge {
  kind: 'footprints';
  pattern: FootprintPattern;
  /** Grabado de cada losa, de izquierda a derecha (también el de la que falta). */
  slabs: Glyph[];
  /** Índice de la losa que falta. */
  gap: number;
  /** Nota de cada losa (0, 1, 2…): la misma forma suena siempre igual, para que el ritmo se oiga. */
  notes: number[];
  /** Los tres grabados de los bloques. */
  options: Glyph[];
  correct: number;
}

export function glyphKey(g: Glyph): string {
  return `${g.shape}:${g.color}:${g.count}`;
}

/** Hueco: siempre con una vuelta entera de la serie delante (y dos losas como mínimo, donde van los bloques). */
function gapFor(pattern: FootprintPattern, rng: Rng): number {
  const unit = pattern === 'grow' ? 2 : pattern.length;
  return rng.int(Math.max(unit, 2) + (pattern === 'AB' ? 1 : 0), FOOTPRINT_SLABS - 1);
}

export function footprintsChallenge(band: AgeBand, rng: Rng): FootprintsChallenge {
  const pattern = rng.pick(FOOTPRINT_PATTERNS[band]);
  const gap = gapFor(pattern, rng);
  let slabs: Glyph[];
  let notes: number[];
  let pool: Glyph[];

  if (pattern === 'grow') {
    // La misma forma, una más en cada losa: 1, 2, 3, 4, 5.
    const shape = rng.pick(FOOTPRINT_SHAPES[band]);
    const color = rng.pick(GLYPH_COLORS);
    slabs = Array.from({ length: FOOTPRINT_SLABS }, (_, i) => ({ shape, color, count: i + 1 }));
    notes = slabs.map((_, i) => i);
    const v = gap + 1;
    pool = [v - 1, v + 1, v - 2].filter((c) => c >= 1 && c <= MAX_GLYPH_COUNT).slice(0, 2).map((count) => ({ shape, color, count }));
  } else {
    const distinct = new Set(pattern).size;
    // Uno más de los que salen en la serie, para tener una opción que no está.
    let elements: Glyph[];
    if (band === 'small') {
      // AB con colores: la misma forma, cada losa de un color.
      elements = rng.shuffle(GLYPH_COLORS).slice(0, distinct + 1).map((color) => ({ shape: 'circle', color, count: 1 }));
    } else {
      const color = rng.pick(GLYPH_COLORS);
      elements = rng.shuffle(FOOTPRINT_SHAPES[band]).slice(0, distinct + 1).map((shape) => ({ shape, color, count: 1 }));
    }
    const letters = [...pattern].map((c) => c.charCodeAt(0) - 65);
    notes = Array.from({ length: FOOTPRINT_SLABS }, (_, i) => letters[i % letters.length]!);
    slabs = notes.map((n) => elements[n]!);
    // Los de la serie que no son la respuesta y, si solo hay dos, el que no está.
    const answerKey = glyphKey(slabs[gap]!);
    pool = elements.filter((e) => glyphKey(e) !== answerKey).slice(0, 2);
  }

  const answer = slabs[gap]!;
  const options = rng.shuffle([answer, ...pool.slice(0, 2)]);
  return {
    kind: 'footprints',
    pattern,
    slabs,
    gap,
    notes,
    options,
    correct: options.findIndex((o) => glyphKey(o) === glyphKey(answer)),
  };
}
