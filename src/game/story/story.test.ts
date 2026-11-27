import { describe, expect, it } from 'vitest';
import { completeLevel, createGameState, worldProgress } from '../state';
import { markSeen, shouldPlayFinale, shouldPlayPrologue, storyKey } from './story';

const W1 = { id: 'arcoiris', levelCount: 12, prologue: true };
const RIO = { id: 'rio', levelCount: 12 };

describe('shouldPlayPrologue', () => {
  it('un perfil nuevo lo ve al entrar en el nivel 1', () => {
    expect(shouldPlayPrologue(createGameState(), W1, 1)).toBe(true);
  });

  it('solo en el nivel 1 y en los mundos que lo tienen', () => {
    expect(shouldPlayPrologue(createGameState(), W1, 2)).toBe(false);
    expect(shouldPlayPrologue(createGameState(), RIO, 1)).toBe(false);
    expect(shouldPlayPrologue(createGameState(), RIO, 1, true)).toBe(false);
  });

  it('una vez visto no vuelve a salir solo', () => {
    const s = createGameState();
    markSeen(s, 'prologo', W1.id);
    expect(s.seen.has(storyKey('prologo', 'arcoiris'))).toBe(true);
    expect(shouldPlayPrologue(s, W1, 1)).toBe(false);
  });

  it('un perfil con progreso en el mundo (antiguo) no lo ve; con progreso en otro mundo, sí', () => {
    const done = createGameState();
    completeLevel(done, W1.id, 1, 2, 0);
    expect(shouldPlayPrologue(done, W1, 1)).toBe(false);
    const pending = createGameState();
    worldProgress(pending, W1.id).pending.add(1);
    expect(shouldPlayPrologue(pending, W1, 1)).toBe(false);
    const other = createGameState();
    completeLevel(other, 'rio', 1, 3, 0);
    expect(shouldPlayPrologue(other, W1, 1)).toBe(true);
  });

  it('al tocar la madriguera se ve aunque ya se haya visto', () => {
    const s = createGameState();
    completeLevel(s, W1.id, 1, 3, 0);
    markSeen(s, 'prologo', W1.id);
    expect(shouldPlayPrologue(s, W1, 1, true)).toBe(true);
  });
});

describe('shouldPlayFinale', () => {
  const W = { id: 'arcoiris', levelCount: 12, finale: true };
  const finishAll = (s = createGameState()) => {
    for (let l = 1; l <= 12; l++) completeLevel(s, W.id, l, 2, 0);
    return s;
  };

  it('sin terminar el mundo no sale', () => {
    const s = createGameState();
    for (let l = 1; l <= 11; l++) completeLevel(s, W.id, l, 2, 0);
    expect(shouldPlayFinale(s, W)).toBe(false);
    expect(shouldPlayFinale(createGameState(), W)).toBe(false);
  });

  it('con los 12 niveles hechos sale una vez', () => {
    const s = finishAll();
    expect(shouldPlayFinale(s, W)).toBe(true);
    markSeen(s, 'final', W.id);
    expect(shouldPlayFinale(s, W)).toBe(false);
  });

  it('un nivel 12 pendiente cuenta', () => {
    const s = createGameState();
    for (let l = 1; l <= 11; l++) completeLevel(s, W.id, l, 2, 0);
    worldProgress(s, W.id).pending.add(12);
    expect(shouldPlayFinale(s, W)).toBe(true);
  });

  it('un mundo sin final no lo tiene', () => {
    expect(shouldPlayFinale(finishAll(), { id: 'arcoiris', levelCount: 12 })).toBe(false);
  });
});
