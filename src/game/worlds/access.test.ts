import { describe, expect, it } from 'vitest';
import type { Flags } from '../flags';
import { completeLevel, createGameState, markPending } from '../state';
import { worldAccess } from './access';
import { ARCOIRIS } from './arcoiris';
import { RIO } from './rio';

const ON: Flags = { 'mundo-2-rio': true };
const OFF: Flags = { 'mundo-2-rio': false };

describe('puerta de los mundos', () => {
  it('el mundo 1 no tiene puerta: siempre abierto', () => {
    expect(worldAccess(ARCOIRIS, createGameState(), 3, OFF)).toBe('open');
    expect(worldAccess(ARCOIRIS, createGameState(), undefined, OFF)).toBe('open');
  });

  it('el río ya no depende del interruptor: está abierto también en el juego publicado', () => {
    expect(RIO.gate?.flag).toBeUndefined();
    expect(worldAccess(RIO, createGameState(), 6, OFF)).toBe('open');
  });

  it('un mundo con el interruptor apagado aún no existe para nadie', () => {
    const building = { ...RIO, gate: { ...RIO.gate, flag: 'mundo-2-rio' as const } };
    const state = createGameState();
    completeLevel(state, 'arcoiris', 12, 3, 0);
    for (const age of [3, 5, 6, 8, undefined]) expect(worldAccess(building, state, age, OFF)).toBe('soon');
    expect(worldAccess(building, state, 6, ON)).toBe('open');
  });

  it('con 6 años o más, el río está abierto desde el principio', () => {
    expect(worldAccess(RIO, createGameState(), 6, ON)).toBe('open');
    expect(worldAccess(RIO, createGameState(), 8, ON)).toBe('open');
  });

  it('de 3 a 5 años, con candado hasta llegar al nivel 12 del mundo 1', () => {
    const state = createGameState();
    for (let level = 1; level <= 11; level++) completeLevel(state, 'arcoiris', level, 3, 0);
    expect(worldAccess(RIO, state, 5, ON)).toBe('locked');
    expect(worldAccess(RIO, state, 3, ON)).toBe('locked');
    completeLevel(state, 'arcoiris', 12, 1, 0);
    expect(worldAccess(RIO, state, 5, ON)).toBe('open');
  });

  it('el nivel 12 pendiente también abre el río', () => {
    const state = createGameState();
    markPending(state, 'arcoiris', 12, 0);
    expect(worldAccess(RIO, state, 4, ON)).toBe('open');
  });

  it('sin perfil (sin edad) solo cuenta el nivel 12 del mundo 1', () => {
    const state = createGameState();
    expect(worldAccess(RIO, state, undefined, ON)).toBe('locked');
    completeLevel(state, 'arcoiris', 12, 2, 0);
    expect(worldAccess(RIO, state, undefined, ON)).toBe('open');
  });
});
