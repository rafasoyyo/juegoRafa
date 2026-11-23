import type { AgeBand } from './types';

/** 3-4 → pequeños, 5-6 → medianos, 7-8 → mayores. Sin edad conocida, medianos. */
export function ageBand(age?: number): AgeBand {
  if (age === undefined || !Number.isFinite(age)) return 'medium';
  if (age <= 4) return 'small';
  if (age <= 6) return 'medium';
  return 'big';
}
