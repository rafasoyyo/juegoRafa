import type { Rng } from './rng';
import { questionKey, type Question } from './types';

export const QUESTIONS_PER_QUIZ = 3;

/** Objetos que se pueden contar o comparar. */
export const COUNTABLE = ['cookie', 'hedgehog', 'bee', 'star'] as const;

/** Colores de las piezas (no indican nunca la forma). */
export const PIECE_COLORS = [0xff7a59, 0x4da3ff, 0xffc93c, 0x8e6cf0, 0x58c25a] as const;

/**
 * `count` números distintos con `correct` entre ellos, dentro de [min, max]. Se prefieren los
 * desplazamientos de `offsets` (por ejemplo ±1, ±10) y luego cualquiera cercano.
 */
export function numberChoices(rng: Rng, correct: number, count: number, min: number, max: number, offsets: number[] = [1, -1, 2, -2]): number[] {
  const out = new Set<number>([correct]);
  for (const off of rng.shuffle(offsets)) {
    if (out.size >= count) break;
    const v = correct + off;
    if (v >= min && v <= max) out.add(v);
  }
  for (let d = 1; out.size < count && d <= max - min; d++) {
    for (const v of rng.shuffle([correct + d, correct - d])) {
      if (out.size < count && v >= min && v <= max) out.add(v);
    }
  }
  return rng.shuffle([...out]);
}

/**
 * Genera las preguntas de una prueba con `make(i)`, reintentando si una sale igual a otra ya hecha.
 */
export function distinctQuestions(make: (i: number) => Question, n = QUESTIONS_PER_QUIZ, tries = 30): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < n; i++) {
    let q = make(i);
    for (let t = 0; t < tries && seen.has(questionKey(q)); t++) q = make(i);
    seen.add(questionKey(q));
    out.push(q);
  }
  return out;
}
