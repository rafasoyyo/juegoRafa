import { describe, expect, it } from 'vitest';
import { enemyCount } from '../../enemies/enemy-layout';
import type { LevelData } from '../../levels/types';
import { ARCOIRIS, COURSE, ENEMIES } from '.';

const LEVELS = ARCOIRIS.levels;

/** Cantidades que miden la dificultad de un nivel. */
function axes(level: LevelData, n: number): Record<string, number> {
  return {
    longitud: level.length,
    bloques: level.blocks.length,
    escalones: level.steps.length,
    plataformas: level.platforms.length,
    enemigos: enemyCount(ENEMIES, n),
    pinchos: level.spikes.length,
  };
}

describe('mundo 1, el camino del arcoíris', () => {
  it('tiene 12 niveles', () => {
    expect(ARCOIRIS.id).toBe('arcoiris');
    expect(ARCOIRIS.levelCount).toBe(12);
    expect(LEVELS).toHaveLength(12);
  });

  it('bloques: 12–20 en los niveles 1 a 6, 20–25 en los 7 a 12 y ninguno menos que el anterior', () => {
    for (let n = 1; n <= 6; n++) expect(COURSE.blockLimits(n)).toEqual({ min: 12, max: 20 });
    for (let n = 7; n <= 12; n++) expect(COURSE.blockLimits(n)).toEqual({ min: 20, max: 25 });
    const counts = LEVELS.map((l) => l.blocks.length);
    for (let i = 1; i < counts.length; i++) expect(counts[i], LEVELS[i]!.id).toBeGreaterThanOrEqual(counts[i - 1]!);
  });

  it('pinchos: ninguno en los niveles 1 a 6; 2, 3, 3, 4, 5 y 6 zonas en los 7 a 12, de 1 baldosa en el 7 y el 8', () => {
    expect(COURSE.spikesPerLevel).toEqual([0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 6]);
    expect(COURSE.narrowSpikesUntil).toBe(8);
    expect(LEVELS.map((l) => l.spikes.length)).toEqual(COURSE.spikesPerLevel);
  });

  it('duración: 60–120 s y 30 s en los niveles 1 a 6; 90–150 s y 35 s en los 7 a 12', () => {
    for (let level = 1; level <= 6; level++) expect(COURSE.durationLimits(level)).toEqual({ minFastS: 30, minCalmS: 60, maxCalmS: 120 });
    for (let level = 7; level <= 12; level++) expect(COURSE.durationLimits(level)).toEqual({ minFastS: 35, minCalmS: 90, maxCalmS: 150 });
  });

  it('enemigos: 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9 y 10; la abeja desde el nivel 2', () => {
    expect(ENEMIES.perLevel).toEqual([2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10]);
    expect(ENEMIES.kinds).toEqual([
      { kind: 'bee', fromLevel: 2 },
      { kind: 'hedgehog', fromLevel: 1 },
    ]);
  });

  it('pruebas de la bandera: una distinta en cada nivel', () => {
    const kinds = Array.from({ length: 12 }, (_, i) => ARCOIRIS.quizFor(i + 1));
    expect(kinds).toEqual(['count', 'compare', 'series', 'shapes', 'name-letters', 'recall', 'share', 'order', 'cable-car', 'tracks', 'balance', 'mirror']);
  });

  it('lleva el arcoíris del horizonte', () => {
    expect(ARCOIRIS.horizonRainbow).toBe(true);
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
