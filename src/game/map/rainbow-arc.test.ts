import { describe, expect, it } from 'vitest';
import { completeLevel, createGameState, finishWithoutStars, worldProgress } from '../state';
import { bandAngles, paintedBands, RainbowMemory } from './rainbow-arc';

const WORLD = { id: 'arcoiris', levelCount: 12 };

describe('paintedBands', () => {
  it('un perfil nuevo no tiene ningún gajo pintado', () => {
    expect(paintedBands(createGameState(), WORLD)).toEqual([]);
  });

  it('con los 12 niveles hechos están los 12', () => {
    const state = createGameState();
    for (let l = 1; l <= 12; l++) completeLevel(state, WORLD.id, l, 2, 0);
    expect(paintedBands(state, WORLD)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('un nivel pendiente pinta su gajo', () => {
    const state = createGameState();
    for (let l = 1; l <= 3; l++) completeLevel(state, WORLD.id, l, 3, 0);
    worldProgress(state, WORLD.id).pending.add(4);
    expect(paintedBands(state, WORLD)).toEqual([1, 2, 3, 4]);
  });

  it('terminar con 0 estrellas no pinta el gajo', () => {
    const state = createGameState();
    completeLevel(state, WORLD.id, 1, 1, 0);
    finishWithoutStars(state, 0);
    expect(paintedBands(state, WORLD)).toEqual([1]);
  });

  it('el progreso de otro mundo no pinta gajos', () => {
    const state = createGameState();
    completeLevel(state, 'rio', 1, 3, 0);
    expect(paintedBands(state, WORLD)).toEqual([]);
  });
});

describe('bandAngles', () => {
  it('los gajos van de izquierda a derecha por arriba y no se tocan', () => {
    let prevEnd = Math.PI;
    for (let l = 1; l <= 12; l++) {
      const { start, end } = bandAngles(l, 12);
      expect(start).toBeGreaterThan(prevEnd - 1e-9);
      expect(end).toBeGreaterThan(start);
      prevEnd = end;
    }
    expect(bandAngles(1, 12).start).toBeGreaterThan(Math.PI);
    expect(bandAngles(12, 12).end).toBeLessThan(2 * Math.PI);
    // El gajo 6 acaba justo antes de lo alto del arco y el 7 empieza justo después.
    expect(bandAngles(6, 12).end).toBeLessThan(1.5 * Math.PI);
    expect(bandAngles(7, 12).start).toBeGreaterThan(1.5 * Math.PI);
  });
});

describe('RainbowMemory', () => {
  it('la primera vez no hay gajos nuevos, aunque haya pintados', () => {
    const memory = new RainbowMemory();
    expect(memory.take('p1/arcoiris', [1, 2, 3, 4, 5])).toEqual([]);
  });

  it('después devuelve solo los nuevos, una sola vez', () => {
    const memory = new RainbowMemory();
    memory.take('p1/arcoiris', []);
    expect(memory.take('p1/arcoiris', [1])).toEqual([1]);
    expect(memory.take('p1/arcoiris', [1])).toEqual([]);
    expect(memory.take('p1/arcoiris', [1, 2, 3])).toEqual([2, 3]);
  });

  it('cada perfil y cada mundo llevan su cuenta', () => {
    const memory = new RainbowMemory();
    memory.take('p1/arcoiris', []);
    memory.take('p2/arcoiris', [1, 2]);
    expect(memory.take('p1/arcoiris', [1])).toEqual([1]);
    expect(memory.take('p2/arcoiris', [1, 2, 3])).toEqual([3]);
    expect(memory.take('p1/rio', [1])).toEqual([]);
  });
});
