/**
 * «La piel del dinosaurio» (mundo 3, nivel 8): la piel es un mosaico de escamas que sigue un dibujo y
 * falta una; se elige la escama que va. Pequeños: rayas de dos colores. Medianos: rayas o damero.
 * Mayores: damero de bloques o diagonales de tres colores.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

/** Colores de las escamas (índices de la paleta de `ui/quiz/island-art`), cada uno con su marca. */
export const SKIN_COLORS = 5;

export type SkinPattern = 'rows' | 'cols' | 'checker' | 'blocks' | 'diagonal';

export const SKIN_PATTERNS: Record<AgeBand, SkinPattern[]> = {
  small: ['rows', 'cols'],
  medium: ['rows', 'cols', 'checker'],
  big: ['checker', 'blocks', 'diagonal'],
};

/** Qué color (0, 1 o 2 del juego de colores) lleva la escama (r, c) en cada dibujo. */
export function skinIndex(pattern: SkinPattern, r: number, c: number): number {
  switch (pattern) {
    case 'rows':
      return r % 2;
    case 'cols':
      return c % 2;
    case 'checker':
      return (r + c) % 2;
    case 'blocks':
      return (Math.floor(r / 2) + Math.floor(c / 2)) % 2;
    case 'diagonal':
      return (r + c) % 3;
  }
}

function question(band: AgeBand, rng: Rng): Question {
  const pattern = rng.pick(SKIN_PATTERNS[band]);
  const rows = band === 'small' ? 3 : 4;
  const cols = band === 'small' ? 3 : 4;
  const colors = rng.shuffle(Array.from({ length: SKIN_COLORS }, (_, i) => i)).slice(0, 3);
  const tiles = Array.from({ length: rows * cols }, (_, i) => colors[skinIndex(pattern, Math.floor(i / cols), i % cols)]!);
  // Pequeños: falta una de la última fila; los demás, cualquiera.
  const hole = band === 'small' ? (rows - 1) * cols + rng.int(0, cols - 1) : rng.int(0, tiles.length - 1);
  const answer = tiles[hole]!;
  tiles[hole] = -1;
  // Las opciones: los colores del dibujo y, si son dos, otro que no está.
  const options = toOptions(rng.shuffle(colors).map((color): Visual => ({ type: 'tile', color })));
  return {
    kind: 'skin-mosaic',
    prompt: { layout: 'model', items: [{ type: 'mosaic', rows, cols, tiles }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `tile:${answer}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function skinMosaicQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
