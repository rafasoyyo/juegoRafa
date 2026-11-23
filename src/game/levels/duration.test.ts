import { describe, expect, it } from 'vitest';
import { estimateDuration } from './duration';
import type { LevelData } from './types';

describe('estimateDuration', () => {
  it('calcula la duración a tope y con calma de un nivel de ejemplo', () => {
    // 140 baldosas: salida en la 6 y bandera en la 136 → 130 × 84 px = 10 920 px a 352 px/s = 31,02 s.
    // Con calma: + 4 bloques × 2,5 + 2 plataformas × 1,5 + 3 escalones × 1 = 31,02 + 16 = 47,02 s.
    const level: LevelData = {
      id: 'ejemplo',
      ambient: 'prado',
      length: 140,
      steps: [
        { x: 20, width: 4, height: 1 },
        { x: 24, width: 4, height: 2 },
        { x: 60, width: 5, height: 1 },
      ],
      platforms: [
        { x: 40, width: 4, height: 1.5 },
        { x: 80, width: 4, height: 1.5 },
      ],
      blocks: [
        { x: 14, row: 'low' },
        { x: 42, row: 'low' },
        { x: 100, row: 'high' },
        { x: 120, row: 'low' },
      ],
    };
    const { fastS, calmS } = estimateDuration(level);
    expect(fastS).toBeCloseTo(10920 / 352, 6);
    expect(fastS).toBeCloseTo(31.02, 2);
    expect(calmS).toBeCloseTo(fastS + 16, 6);
    expect(calmS).toBeCloseTo(47.02, 2);
  });
});
