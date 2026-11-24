import type { QuizKind } from './types';

/** Tipo de prueba de cada nivel del mundo de los números (siempre el mismo). */
export const QUIZ_BY_LEVEL: Readonly<Record<number, QuizKind>> = {
  1: 'count',
  2: 'compare',
  3: 'series',
  4: 'shapes',
  5: 'name-letters',
  6: 'recall',
  7: 'share',
  8: 'order',
  9: 'cable-car',
  10: 'tracks',
  11: 'balance',
  12: 'mirror',
};

export function quizForLevel(level: number): QuizKind {
  return QUIZ_BY_LEVEL[level] ?? 'count';
}
