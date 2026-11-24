import type { QuizKind } from './types';

/**
 * Tipo de prueba de cada nivel del mundo de los números (siempre el mismo). Los niveles 7 a 12 repiten
 * el ciclo de los 1 a 6 hasta que tengan pruebas propias.
 */
export const QUIZ_BY_LEVEL: Readonly<Record<number, QuizKind>> = {
  1: 'count',
  2: 'compare',
  3: 'series',
  4: 'shapes',
  5: 'name-letters',
  6: 'recall',
  7: 'count',
  8: 'compare',
  9: 'series',
  10: 'shapes',
  11: 'name-letters',
  12: 'recall',
};

export function quizForLevel(level: number): QuizKind {
  return QUIZ_BY_LEVEL[level] ?? 'count';
}
