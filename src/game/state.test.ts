import { describe, expect, it } from 'vitest';
import { buyHat, canPlay, completeLevel, createGameState, currentLevel, HAT_PRICES, isUnlocked, LEVEL_COUNT, levelStatus, markPending, wearHat } from './state';

describe('mapa del mundo', () => {
  it('en la primera partida el 1 es el actual y del 2 al 12 están bloqueados', () => {
    const s = createGameState();
    expect(levelStatus(s, 1)).toBe('current');
    for (let l = 2; l <= LEVEL_COUNT; l++) expect(levelStatus(s, l)).toBe('locked');
  });

  it('tras completar 1 (3★) y 2 (2★) el 3 es el actual', () => {
    const s = createGameState();
    completeLevel(s, 1, 3, 0);
    completeLevel(s, 2, 2, 0);
    expect(levelStatus(s, 1)).toBe('done');
    expect(levelStatus(s, 2)).toBe('done');
    expect(s.stars.get(1)).toBe(3);
    expect(s.stars.get(2)).toBe(2);
    expect(levelStatus(s, 3)).toBe('current');
    expect(currentLevel(s)).toBe(3);
    for (let l = 4; l <= LEVEL_COUNT; l++) expect(levelStatus(s, l)).toBe('locked');
  });

  it('solo se pueden jugar los hechos y el actual', () => {
    const s = createGameState();
    completeLevel(s, 1, 1, 0);
    expect(canPlay(s, 1)).toBe(true);
    expect(canPlay(s, 2)).toBe(true);
    expect(canPlay(s, 3)).toBe(false);
  });

  it('el mundo tiene 12 niveles', () => {
    expect(LEVEL_COUNT).toBe(12);
    expect(isUnlocked(createGameState(), 13)).toBe(false);
  });

  it('Del seis al siete: con los niveles 1 a 6 hechos, el 7 es el actual y del 8 al 12 están bloqueados', () => {
    const s = createGameState();
    for (let l = 1; l <= 6; l++) completeLevel(s, l, 3, 0);
    expect(currentLevel(s)).toBe(7);
    expect(levelStatus(s, 7)).toBe('current');
    for (let l = 8; l <= 12; l++) expect(levelStatus(s, l), `nivel ${l}`).toBe('locked');
  });

  it('Mundo terminado: con los 12 hechos no hay nivel actual (el mapa pone el zorro en el 12)', () => {
    const s = createGameState();
    for (let l = 1; l <= 11; l++) completeLevel(s, l, 2, 0);
    expect(currentLevel(s)).toBe(12);
    completeLevel(s, 12, 2, 0);
    expect(currentLevel(s)).toBeNull();
    for (let l = 1; l <= 12; l++) expect(levelStatus(s, l)).toBe('done');
  });

  it('con todos los niveles hechos no hay nivel actual', () => {
    const s = createGameState();
    for (let l = 1; l <= LEVEL_COUNT; l++) completeLevel(s, l, 1, 0);
    expect(currentLevel(s)).toBeNull();
  });

  it('cada partida nueva empieza desde cero', () => {
    const a = createGameState();
    completeLevel(a, 1, 3, 5);
    const b = createGameState();
    expect(levelStatus(b, 1)).toBe('current');
    expect(b.cookies).toBe(0);
  });
});

describe('nivel completado', () => {
  it('mantiene la mejor puntuación en estrellas', () => {
    const s = createGameState();
    completeLevel(s, 1, 3, 0);
    completeLevel(s, 1, 1, 0);
    expect(s.stars.get(1)).toBe(3);
  });

  it('suma las galletas: 5 + 4 = 9', () => {
    const s = createGameState();
    s.cookies = 5;
    completeLevel(s, 1, 2, 4);
    expect(s.cookies).toBe(9);
  });

  it('un nivel sin galletas no cambia el total', () => {
    const s = createGameState();
    s.cookies = 5;
    completeLevel(s, 1, 1, 0);
    expect(s.cookies).toBe(5);
  });

  it('nunca guarda 0 estrellas', () => {
    const s = createGameState();
    completeLevel(s, 1, 0, 0);
    expect(s.stars.get(1)).toBe(1);
  });
});

describe('mi personaje', () => {
  it('empieza con la gorra azul puesta y «sin gorro» conseguido', () => {
    const s = createGameState();
    expect(s.hat).toBe('cap');
    expect(s.ownedHats.has('cap')).toBe(true);
    expect(s.ownedHats.has('none')).toBe(true);
    expect(s.ownedHats.size).toBe(2);
  });

  it('con 12 galletas compra un gorro de 10 y le quedan 2', () => {
    const s = createGameState();
    s.cookies = 12;
    expect(HAT_PRICES.wool).toBe(10);
    expect(buyHat(s, 'wool')).toBe(true);
    expect(s.cookies).toBe(2);
    expect(s.ownedHats.has('wool')).toBe(true);
    expect(s.hat).toBe('wool');
  });

  it('con 3 galletas no puede comprar un gorro de 10 y nada cambia', () => {
    const s = createGameState();
    s.cookies = 3;
    expect(buyHat(s, 'wool')).toBe(false);
    expect(s.cookies).toBe(3);
    expect(s.ownedHats.has('wool')).toBe(false);
    expect(s.hat).toBe('cap');
  });

  it('cambiar a un gorro conseguido no cuesta nada', () => {
    const s = createGameState();
    s.cookies = 4;
    expect(buyHat(s, 'none')).toBe(true);
    expect(s.hat).toBe('none');
    expect(buyHat(s, 'cap')).toBe(true);
    expect(s.hat).toBe('cap');
    expect(s.cookies).toBe(4);
  });

  it('no se puede poner un gorro no conseguido', () => {
    const s = createGameState();
    expect(wearHat(s, 'crown')).toBe(false);
    expect(s.hat).toBe('cap');
  });
});

describe('niveles pendientes (prueba no superada)', () => {
  it('prueba no superada: 1 hecho, 2 pendiente, 3 actual, 4-12 bloqueados', () => {
    const s = createGameState();
    completeLevel(s, 1, 2, 0);
    markPending(s, 2, 0);
    expect(levelStatus(s, 1)).toBe('done');
    expect(levelStatus(s, 2)).toBe('pending');
    expect(levelStatus(s, 3)).toBe('current');
    expect(currentLevel(s)).toBe(3);
    for (let l = 4; l <= LEVEL_COUNT; l++) expect(levelStatus(s, l)).toBe('locked');
    expect(s.stars.has(2)).toBe(false);
  });

  it('un pendiente desbloquea el siguiente y se puede jugar', () => {
    const s = createGameState();
    markPending(s, 1, 0);
    expect(isUnlocked(s, 2)).toBe(true);
    expect(canPlay(s, 1)).toBe(true);
    expect(canPlay(s, 2)).toBe(true);
    expect(canPlay(s, 3)).toBe(false);
  });

  it('Solo quedan pendientes: con los 12 jugados y el 4 pendiente, el zorro va al 4', () => {
    const s = createGameState();
    for (let l = 1; l <= LEVEL_COUNT; l++) {
      if (l === 4) markPending(s, l, 0);
      else completeLevel(s, l, 1, 0);
    }
    expect(currentLevel(s)).toBe(4);
    expect(levelStatus(s, 4)).toBe('current');
  });

  it('pendiente superado más tarde pasa a hecho con sus estrellas', () => {
    const s = createGameState();
    markPending(s, 1, 0);
    completeLevel(s, 1, 2, 0);
    expect(levelStatus(s, 1)).toBe('done');
    expect(s.stars.get(1)).toBe(2);
    expect(s.pending.has(1)).toBe(false);
  });

  it('repetir un nivel hecho y fallar no lo deshace', () => {
    const s = createGameState();
    completeLevel(s, 1, 2, 0);
    markPending(s, 1, 0);
    expect(levelStatus(s, 1)).toBe('done');
    expect(s.stars.get(1)).toBe(2);
    expect(s.pending.has(1)).toBe(false);
  });

  it('las galletas se suman aunque la prueba no se supere', () => {
    const s = createGameState();
    s.cookies = 5;
    markPending(s, 2, 3);
    expect(s.cookies).toBe(8);
  });
});
