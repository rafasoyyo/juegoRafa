/**
 * «El fósil» (mundo 3, nivel 7): a la losa de huesos le falta un trozo y se elige la pieza que lo llena,
 * tal cual, sin girarla. Pequeños: hueco de 2 casillas entre piezas de otro tamaño o de otra forma.
 * Medianos: hueco de 3. Mayores: hueco de 4, y una de las piezas es la misma girada (ya no encaja).
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, visualKey, type AgeBand, type GridCell, type Question, type Visual } from './types';

type Cells = GridCell[];
const c = (row: number, col: number): GridCell => ({ row, col });

/** Lleva la pieza a (0, 0) y ordena sus casillas. */
export function normalize(cells: readonly GridCell[]): Cells {
  const r0 = Math.min(...cells.map((x) => x.row));
  const c0 = Math.min(...cells.map((x) => x.col));
  return cells.map((x) => c(x.row - r0, x.col - c0)).sort((a, b) => a.row - b.row || a.col - b.col);
}

const key = (cells: readonly GridCell[]): string => normalize(cells).map((x) => `${x.row}.${x.col}`).join('|');
const rotate = (cells: readonly GridCell[]): Cells => normalize(cells.map((x) => c(x.col, -x.row)));
const mirror = (cells: readonly GridCell[]): Cells => normalize(cells.map((x) => c(x.row, -x.col)));

/** Todas las colocaciones distintas de una pieza al girarla y voltearla. */
export function orientations(cells: readonly GridCell[]): Cells[] {
  const out = new Map<string, Cells>();
  for (const start of [normalize(cells), mirror(cells)]) {
    let p = start;
    for (let i = 0; i < 4; i++) {
      out.set(key(p), p);
      p = rotate(p);
    }
  }
  return [...out.values()];
}

/** Piezas de base de cada tamaño (I, L; de 4: I, O, T, L, S). */
const BASE: Record<number, Cells[]> = {
  1: [[c(0, 0)]],
  2: [[c(0, 0), c(0, 1)]],
  3: [
    [c(0, 0), c(0, 1), c(0, 2)],
    [c(0, 0), c(1, 0), c(1, 1)],
  ],
  4: [
    [c(0, 0), c(0, 1), c(0, 2), c(0, 3)],
    [c(0, 0), c(0, 1), c(1, 0), c(1, 1)],
    [c(0, 0), c(0, 1), c(0, 2), c(1, 1)],
    [c(0, 0), c(1, 0), c(2, 0), c(2, 1)],
    [c(0, 1), c(0, 2), c(1, 0), c(1, 1)],
  ],
};

/** Todas las piezas de `size` casillas en todas sus posiciones. */
export function fixedPieces(size: number): Cells[] {
  return (BASE[size] ?? []).flatMap(orientations);
}

/** Losa (filas × columnas) y tamaño del hueco de cada franja. */
export const FOSSIL_BOARD: Record<AgeBand, { rows: number; cols: number; size: number }> = {
  small: { rows: 3, cols: 3, size: 2 },
  medium: { rows: 3, cols: 4, size: 3 },
  big: { rows: 4, cols: 4, size: 4 },
};

const bones = (cells: readonly GridCell[]): Visual => ({ type: 'bones', cells: normalize(cells) });

function question(band: AgeBand, rng: Rng): Question {
  const { rows, cols, size } = FOSSIL_BOARD[band];
  // Mayores: el cuadrado no vale de hueco porque girado sigue igual.
  const shapes = fixedPieces(size).filter((p) => band !== 'big' || orientations(p).length > 1);
  const piece = rng.pick(shapes);
  const h = Math.max(...piece.map((x) => x.row)) + 1;
  const w = Math.max(...piece.map((x) => x.col)) + 1;
  const r0 = rng.int(0, rows - h);
  const c0 = rng.int(0, cols - w);
  const hole = piece.map((x) => c(x.row + r0, x.col + c0));
  const others = (list: Cells[]): Cells[] => rng.shuffle(list.filter((p) => key(p) !== key(piece)));

  let wrong: Cells[];
  if (band === 'small') {
    wrong = [rng.pick(fixedPieces(1).concat(fixedPieces(3))), others(fixedPieces(2))[0] ?? rng.pick(fixedPieces(3))];
  } else if (band === 'medium') {
    wrong = others(fixedPieces(3)).slice(0, 2);
  } else {
    const turned = others(orientations(piece))[0]!;
    const other = others(fixedPieces(4)).find((p) => !orientations(piece).some((o) => key(o) === key(p)))!;
    wrong = [turned, other];
  }
  const answer = bones(piece);
  // Si dos piezas falsas salen iguales, se cambia una por otra de su tamaño.
  const visuals = [answer, ...wrong.map(bones)].filter((v, i, a) => a.findIndex((x) => visualKey(x) === visualKey(v)) === i);
  for (const p of rng.shuffle(fixedPieces(size + (band === 'small' ? 1 : 0)))) {
    if (visuals.length >= 3) break;
    if (!visuals.some((v) => visualKey(v) === visualKey(bones(p)))) visuals.push(bones(p));
  }
  const options = toOptions(rng.shuffle(visuals));
  return {
    kind: 'fossil',
    prompt: { layout: 'model', items: [{ type: 'fossil', rows, cols, hole }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === visualKey(answer)).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function fossilQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
