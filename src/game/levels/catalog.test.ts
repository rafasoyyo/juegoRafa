import { describe, expect, it } from 'vitest';
import { enemyCount } from '../enemies/enemy-layout';
import { LEVEL_COUNT } from '../state';
import { LEVELS } from './catalog';
import { durationLimits, estimateDuration } from './duration';
import type { LevelData } from './types';
import { blockLimits, NARROW_SPIKES_UNTIL, SPIKES_PER_LEVEL, validateLevel } from './validate';

/** Número de nivel (1..12) de cada recorrido. */
const numbered = LEVELS.map((l, i) => [l.id, i + 1, l] as const);

/** Cantidades que miden la dificultad de un nivel. */
function axes(level: LevelData, n: number): Record<string, number> {
  return {
    longitud: level.length,
    bloques: level.blocks.length,
    escalones: level.steps.length,
    plataformas: level.platforms.length,
    enemigos: enemyCount(n),
    pinchos: level.spikes.length,
  };
}

describe('catálogo de niveles', () => {
  it('hay un recorrido por cada nivel del mapa', () => {
    expect(LEVEL_COUNT).toBe(12);
    expect(LEVELS).toHaveLength(LEVEL_COUNT);
    expect(LEVELS.map((l) => l.id)).toEqual(Array.from({ length: 12 }, (_, i) => `nivel-${i + 1}`));
  });

  it.each(numbered)('%s cumple todas las reglas de diseño', (_id, _n, level) => {
    expect(validateLevel(level)).toEqual([]);
  });

  it.each(numbered)('%s dura lo que le toca a tope y con calma', (_id, n, level) => {
    const { fastS, calmS } = estimateDuration(level);
    const limits = durationLimits(n);
    expect(fastS).toBeGreaterThanOrEqual(limits.minFastS);
    expect(calmS).toBeGreaterThanOrEqual(limits.minCalmS);
    expect(calmS).toBeLessThanOrEqual(limits.maxCalmS);
  });

  it('bloques: 12–20 en los niveles 1 a 6, 20–25 en los 7 a 12 y ninguno menos que el anterior', () => {
    const counts = LEVELS.map((l) => l.blocks.length);
    for (const [i, count] of counts.entries()) {
      const { min, max } = blockLimits(i + 1);
      expect(count, LEVELS[i]!.id).toBeGreaterThanOrEqual(min);
      expect(count, LEVELS[i]!.id).toBeLessThanOrEqual(max);
      if (i > 0) expect(count, LEVELS[i]!.id).toBeGreaterThanOrEqual(counts[i - 1]!);
    }
  });

  it('pinchos: ninguno en los niveles 1 a 6; 2, 3, 3, 4, 5 y 6 zonas en los 7 a 12, de 1 baldosa en el 7 y el 8', () => {
    expect(LEVELS.map((l) => l.spikes.length)).toEqual(SPIKES_PER_LEVEL);
    expect(SPIKES_PER_LEVEL).toEqual([0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 6]);
    for (const [i, level] of LEVELS.entries()) {
      if (i + 1 <= NARROW_SPIKES_UNTIL) for (const z of level.spikes) expect(z.width, level.id).toBe(1);
    }
  });

  it('no hay dos niveles con la misma disposición ni el mismo ambiente', () => {
    const layout = (level: LevelData): string => {
      const { steps, platforms, blocks, spikes, length } = level;
      return JSON.stringify({ length, steps, platforms, blocks, spikes });
    };
    expect(new Set(LEVELS.map(layout)).size).toBe(LEVELS.length);
    expect(new Set(LEVELS.map((l) => l.ambient)).size).toBe(LEVELS.length);
  });

  it('ambientes en orden', () => {
    expect(LEVELS.map((l) => l.ambient)).toEqual(['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche', 'playa', 'selva', 'montana', 'nieve', 'desierto', 'nubes']);
  });

  it('dificultad creciente: el 1 llano, escalones desde el 2, plataformas desde el 3 y el 6 con más que los niveles 1 a 5', () => {
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

  it('el 7 es más difícil que el 6: más largo, al menos lo mismo de todo y con pinchos', () => {
    const six = axes(LEVELS[5]!, 6);
    const seven = axes(LEVELS[6]!, 7);
    expect(seven.longitud).toBeGreaterThan(six.longitud!);
    for (const key of ['bloques', 'escalones', 'plataformas', 'enemigos'] as const) expect(seven[key], key).toBeGreaterThanOrEqual(six[key]!);
    expect(seven.pinchos).toBeGreaterThan(0);
  });

  it('del 7 al 12 ningún eje baja, y el 12 es el más largo y el que más plataformas, escalones y pinchos tiene', () => {
    for (let n = 8; n <= 12; n++) {
      const prev = axes(LEVELS[n - 2]!, n - 1);
      const cur = axes(LEVELS[n - 1]!, n);
      for (const key of Object.keys(cur)) expect(cur[key], `nivel ${n}: ${key}`).toBeGreaterThanOrEqual(prev[key]!);
    }
    const last = LEVELS[11]!;
    for (const level of LEVELS.slice(0, 11)) {
      expect(last.length, level.id).toBeGreaterThan(level.length);
      expect(last.platforms.length, level.id).toBeGreaterThan(level.platforms.length);
      expect(last.steps.length, level.id).toBeGreaterThan(level.steps.length);
      expect(last.spikes.length, level.id).toBeGreaterThan(level.spikes.length);
    }
  });
});
