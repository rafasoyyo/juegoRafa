/**
 * «Sigue la serie»: una fila con un patrón y un hueco; se toca lo que va en el hueco.
 * Los elementos distintos se distinguen siempre por la forma o el dibujo, nunca solo por el color:
 * cada forma lleva siempre el mismo color.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, visualKey, type AgeBand, type Question, type ShapeId, type Visual } from './types';

const SHAPE_COLORS: Partial<Record<ShapeId, number>> = {
  circle: 0xff7a59,
  square: 0x4da3ff,
  triangle: 0xffc93c,
  star: 0x8e6cf0,
  hexagon: 0x58c25a,
};

/** Elementos de las series: objetos del juego y formas (cada una con su color fijo). */
export const SERIES_ELEMENTS: Visual[] = [
  { type: 'object', object: 'cookie' },
  { type: 'object', object: 'star' },
  { type: 'object', object: 'bee' },
  { type: 'object', object: 'hedgehog' },
  ...(Object.entries(SHAPE_COLORS) as [ShapeId, number][]).map(([shape, color]) => ({ type: 'shape' as const, shape, color, scale: 1, angle: 0 })),
];

export type SeriesPattern = 'AB' | 'AAB' | 'ABB' | 'ABC' | 'AABB' | 'ABBC' | 'grow';

const PATTERNS: Record<AgeBand, SeriesPattern[]> = {
  small: ['AB'],
  medium: ['AAB', 'ABB', 'ABC'],
  big: ['AABB', 'ABBC', 'grow'],
};

/** Fila completa (sin hueco) para un patrón de letras con los elementos dados. */
function unfold(pattern: string, elements: Visual[], length: number): Visual[] {
  const unit = [...pattern].map((c) => elements[c.charCodeAt(0) - 65]!);
  return Array.from({ length }, (_, i) => unit[i % unit.length]!);
}

function question(band: AgeBand, rng: Rng): Question {
  const pattern = rng.pick(PATTERNS[band]);
  let row: Visual[];
  let pool: Visual[];

  if (pattern === 'grow') {
    // Cantidades que crecen: 1, 2, 3… puntos.
    const start = rng.int(1, 2);
    const length = 5;
    row = Array.from({ length }, (_, i) => ({ type: 'dots' as const, value: start + i }));
    pool = [];
  } else {
    const distinct = new Set(pattern).size;
    const elements = rng.shuffle(SERIES_ELEMENTS).slice(0, distinct + 1);
    const unitLen = pattern.length;
    // Pequeños: 2 repeticiones (A B A B ?); los demás, 2 repeticiones más un trozo.
    const length = band === 'small' ? rng.pick([5, 6]) : unitLen * 2 + rng.int(1, 2);
    row = unfold(pattern, elements, length);
    pool = elements;
  }

  // El hueco: al final salvo en mayores, que puede ir en cualquier sitio desde la 2.ª repetición.
  const holeIndex = band === 'big' ? rng.int(Math.min(row.length - 1, pattern === 'grow' ? 1 : pattern.length), row.length - 1) : row.length - 1;
  const answer = row[holeIndex]!;

  let choices: Visual[];
  if (pattern === 'grow') {
    const v = (answer as { value: number }).value;
    const others = [v - 1, v + 1, v + 2].filter((x) => x >= 1 && x !== v);
    choices = [answer, ...rng.shuffle(others).slice(0, 2).map((value) => ({ type: 'dots' as const, value }))];
  } else {
    // La respuesta, otro elemento de la serie y uno que no está (o dos de la serie si hay 3).
    const inRow = pool.filter((e) => row.some((r) => visualKey(r) === visualKey(e)));
    const others = rng.shuffle(inRow.filter((e) => visualKey(e) !== visualKey(answer)));
    const outside = pool.filter((e) => !inRow.includes(e));
    choices = [answer, others[0]!, others[1] ?? outside[0]!];
  }

  const options = toOptions(rng.shuffle(choices));
  return {
    kind: 'series',
    prompt: { layout: 'row', items: row, holeIndex },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === visualKey(answer)).map((o) => o.id) },
    hint: 'rhythm',
  };
}

export function seriesQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}

/** Para las pruebas: qué patrón tiene una fila de letras (A, B, C…) según la clave de sus elementos. */
export function rowPattern(row: Visual[]): string {
  const letters = new Map<string, string>();
  return row
    .map((v) => {
      const k = visualKey(v);
      if (!letters.has(k)) letters.set(k, String.fromCharCode(65 + letters.size));
      return letters.get(k)!;
    })
    .join('');
}
