import { describe, expect, it } from 'vitest';
import { LEVEL_COUNT } from '../state';
import { LEVELS } from './catalog';
import { estimateDuration } from './duration';
import { MAX_BLOCKS, MIN_BLOCKS, validateLevel } from './validate';

describe('catálogo de niveles', () => {
  it('hay un recorrido por cada nivel del mapa', () => {
    expect(LEVELS).toHaveLength(LEVEL_COUNT);
    expect(LEVELS.map((l) => l.id)).toEqual(['nivel-1', 'nivel-2', 'nivel-3', 'nivel-4', 'nivel-5', 'nivel-6']);
  });

  it.each(LEVELS.map((l) => [l.id, l] as const))('%s cumple todas las reglas de diseño', (_id, level) => {
    expect(validateLevel(level)).toEqual([]);
  });

  it.each(LEVELS.map((l) => [l.id, l] as const))('%s dura al menos 30 s a tope y entre 60 y 120 s con calma', (_id, level) => {
    const { fastS, calmS } = estimateDuration(level);
    expect(fastS).toBeGreaterThanOrEqual(30);
    expect(calmS).toBeGreaterThanOrEqual(60);
    expect(calmS).toBeLessThanOrEqual(120);
  });

  it(`cada nivel tiene entre ${MIN_BLOCKS} y ${MAX_BLOCKS} bloques y ninguno menos que el anterior`, () => {
    const counts = LEVELS.map((l) => l.blocks.length);
    for (const [i, count] of counts.entries()) {
      expect(count, LEVELS[i]!.id).toBeGreaterThanOrEqual(MIN_BLOCKS);
      expect(count, LEVELS[i]!.id).toBeLessThanOrEqual(MAX_BLOCKS);
      if (i > 0) expect(count, LEVELS[i]!.id).toBeGreaterThanOrEqual(counts[i - 1]!);
    }
  });

  it('no hay dos niveles con la misma disposición ni el mismo ambiente', () => {
    const layout = (i: number): string => {
      const { steps, platforms, blocks, length } = LEVELS[i]!;
      return JSON.stringify({ length, steps, platforms, blocks });
    };
    expect(new Set(LEVELS.map((_, i) => layout(i))).size).toBe(LEVELS.length);
    expect(new Set(LEVELS.map((l) => l.ambient)).size).toBe(LEVELS.length);
  });

  it('ambientes en orden: prado, flores, bosque, otoño, atardecer y noche', () => {
    expect(LEVELS.map((l) => l.ambient)).toEqual(['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche']);
  });

  it('dificultad creciente: el 1 llano, escalones desde el 2, plataformas desde el 3 y el 6 con más que ninguno', () => {
    const [n1, n2, n3, ...rest] = LEVELS;
    expect(n1!.steps).toEqual([]);
    expect(n1!.platforms).toEqual([]);
    expect(n1!.blocks.every((b) => (b.on ?? 'ground') === 'ground')).toBe(true);
    expect(n2!.steps.length).toBeGreaterThan(0);
    expect(n2!.platforms).toEqual([]);
    for (const level of [n3!, ...rest]) {
      expect(level.steps.length, level.id).toBeGreaterThan(0);
      expect(level.platforms.length, level.id).toBeGreaterThan(0);
    }
    const n6 = LEVELS[5]!;
    for (const level of LEVELS.slice(0, 5)) {
      expect(n6.steps.length, level.id).toBeGreaterThan(level.steps.length);
      expect(n6.platforms.length, level.id).toBeGreaterThan(level.platforms.length);
    }
  });
});
