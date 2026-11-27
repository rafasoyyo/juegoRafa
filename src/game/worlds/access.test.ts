import { describe, expect, it } from 'vitest';
import type { Flags } from '../flags';
import { completeLevel, createGameState, worldProgress, type GameState } from '../state';
import { opensAfter, worldAccess } from './access';
import { ARCOIRIS } from './arcoiris';
import { ISLA } from './isla';
import { RIO } from './rio';

/** Pendiente de un perfil antiguo (antes de las estrellas por objetivos ya no se crean). */
function legacyPending(s: GameState, world: string, level: number): void {
  worldProgress(s, world).pending.add(level);
}

const ON: Flags = { 'mundo-2-rio': true, 'mundo-3-isla': true };
const OFF: Flags = { 'mundo-2-rio': false, 'mundo-3-isla': false };

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
    legacyPending(state, 'arcoiris', 12);
    expect(worldAccess(RIO, state, 4, ON)).toBe('open');
  });

  it('sin perfil (sin edad) solo cuenta el nivel 12 del mundo 1', () => {
    const state = createGameState();
    expect(worldAccess(RIO, state, undefined, ON)).toBe('locked');
    completeLevel(state, 'arcoiris', 12, 2, 0);
    expect(worldAccess(RIO, state, undefined, ON)).toBe('open');
  });
});

describe('mundos que abre el final de otro', () => {
  it('el final del arcoíris abre el río a los menores de 6 años, no a los de 6 o más', () => {
    expect(opensAfter(RIO, ARCOIRIS.id, 5, ON)).toBe(true);
    expect(opensAfter(RIO, ARCOIRIS.id, 3, ON)).toBe(true);
    expect(opensAfter(RIO, ARCOIRIS.id, 6, ON)).toBe(false);
    expect(opensAfter(RIO, ARCOIRIS.id, 8, ON)).toBe(false);
  });

  it('ni el final de otro mundo, ni un mundo sin puerta, ni uno tras un interruptor apagado', () => {
    expect(opensAfter(RIO, RIO.id, 5, ON)).toBe(false);
    expect(opensAfter(ARCOIRIS, ARCOIRIS.id, 5, ON)).toBe(false);
    expect(opensAfter({ ...RIO, gate: { ...RIO.gate, flag: 'mundo-2-rio' } }, ARCOIRIS.id, 5, OFF)).toBe(false);
  });

  it('la isla, sin interruptor: abierta con 7 años o al llegar al nivel 12 del río, también en el juego publicado', () => {
    expect(ISLA.gate).toEqual({ openAge: 7, after: { world: 'rio', level: 12 } });
    expect(worldAccess(ISLA, createGameState(), 8, OFF)).toBe('open');
    expect(worldAccess(ISLA, createGameState(), 7, OFF)).toBe('open');
    expect(worldAccess(ISLA, createGameState(), 6, OFF)).toBe('locked');
    const s = createGameState();
    worldProgress(s, 'rio').stars.set(12, 1);
    expect(worldAccess(ISLA, s, 5, OFF)).toBe('open');
    expect(opensAfter(ISLA, RIO.id, 6, OFF)).toBe(true);
    expect(opensAfter(ISLA, RIO.id, 7, OFF)).toBe(false);
  });
});
