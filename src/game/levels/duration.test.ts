import { describe, expect, it } from 'vitest';
import { LEVELS } from './catalog';
import { durationLimits, estimateDuration } from './duration';
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
      spikes: [],
    };
    const { fastS, calmS } = estimateDuration(level);
    expect(fastS).toBeCloseTo(10920 / 352, 6);
    expect(fastS).toBeCloseTo(31.02, 2);
    expect(calmS).toBeCloseTo(fastS + 16, 6);
    expect(calmS).toBeCloseTo(47.02, 2);
  });

  it('cada zona de pinchos suma 1 s con calma y nada a tope', () => {
    const base: LevelData = { id: 'x', ambient: 'prado', length: 140, steps: [], platforms: [], blocks: [], spikes: [] };
    const spiky: LevelData = { ...base, spikes: [{ x: 40, width: 1 }, { x: 60, width: 2 }] };
    expect(estimateDuration(spiky).fastS).toBe(estimateDuration(base).fastS);
    expect(estimateDuration(spiky).calmS).toBeCloseTo(estimateDuration(base).calmS + 2, 6);
  });

  it('los niveles 1 a 6 dan los mismos valores que antes (sin pinchos)', () => {
    // Valores de la fórmula anterior: (length − 10) · 84 / 352 y +2,5 / 1,5 / 1 por bloque, plataforma y escalón.
    for (const level of LEVELS.slice(0, 6)) {
      const fast = ((level.length - 10) * 84) / 352;
      const calm = fast + 2.5 * level.blocks.length + 1.5 * level.platforms.length + level.steps.length;
      expect(level.spikes, level.id).toEqual([]);
      expect(estimateDuration(level).fastS, level.id).toBeCloseTo(fast, 6);
      expect(estimateDuration(level).calmS, level.id).toBeCloseTo(calm, 6);
    }
  });
});

describe('durationLimits', () => {
  it('60–120 s y 30 s en los niveles 1 a 6; 90–150 s y 35 s en los 7 a 12', () => {
    for (let level = 1; level <= 6; level++) expect(durationLimits(level)).toEqual({ minFastS: 30, minCalmS: 60, maxCalmS: 120 });
    for (let level = 7; level <= 12; level++) expect(durationLimits(level)).toEqual({ minFastS: 35, minCalmS: 90, maxCalmS: 150 });
  });
});
