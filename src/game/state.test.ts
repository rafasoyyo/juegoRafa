import { describe, expect, it } from 'vitest';
import { buyHat, canPlay, castleStatus, winMedal, completeLevel, createGameState, currentLevel, finishWithoutStars, HAT_PRICES, isUnlocked, levelStatus, wearHat, worldProgress, type GameState } from './state';

/** Pendiente de un perfil antiguo (antes de las estrellas por objetivos ya no se crean). */
function legacyPending(s: GameState, world: string, level: number): void {
  worldProgress(s, world).pending.add(level);
}

/** Mundo de prueba de 12 niveles, como el mundo 1. */
const W = { id: 'prueba', levelCount: 12 };
const LEVEL_COUNT = W.levelCount;
const progress = (s: GameState) => worldProgress(s, W.id);

describe('mapa del mundo', () => {
  it('en la primera partida el 1 es el actual y del 2 al 12 están bloqueados', () => {
    const s = createGameState();
    expect(levelStatus(s, W, 1)).toBe('current');
    for (let l = 2; l <= LEVEL_COUNT; l++) expect(levelStatus(s, W, l)).toBe('locked');
  });

  it('tras completar 1 (3★) y 2 (2★) el 3 es el actual', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 3, 0);
    completeLevel(s, W.id, 2, 2, 0);
    expect(levelStatus(s, W, 1)).toBe('done');
    expect(levelStatus(s, W, 2)).toBe('done');
    expect(progress(s).stars.get(1)).toBe(3);
    expect(progress(s).stars.get(2)).toBe(2);
    expect(levelStatus(s, W, 3)).toBe('current');
    expect(currentLevel(s, W)).toBe(3);
    for (let l = 4; l <= LEVEL_COUNT; l++) expect(levelStatus(s, W, l)).toBe('locked');
  });

  it('solo se pueden jugar los hechos y el actual', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 1, 0);
    expect(canPlay(s, W, 1)).toBe(true);
    expect(canPlay(s, W, 2)).toBe(true);
    expect(canPlay(s, W, 3)).toBe(false);
  });

  it('fuera del mundo no hay niveles', () => {
    expect(isUnlocked(createGameState(), W, 13)).toBe(false);
    expect(isUnlocked(createGameState(), W, 0)).toBe(false);
  });

  it('Del seis al siete: con los niveles 1 a 6 hechos, el 7 es el actual y del 8 al 12 están bloqueados', () => {
    const s = createGameState();
    for (let l = 1; l <= 6; l++) completeLevel(s, W.id, l, 3, 0);
    expect(currentLevel(s, W)).toBe(7);
    expect(levelStatus(s, W, 7)).toBe('current');
    for (let l = 8; l <= 12; l++) expect(levelStatus(s, W, l), `nivel ${l}`).toBe('locked');
  });

  it('Mundo terminado: con los 12 hechos no hay nivel actual (el mapa pone el zorro en el 12)', () => {
    const s = createGameState();
    for (let l = 1; l <= 11; l++) completeLevel(s, W.id, l, 2, 0);
    expect(currentLevel(s, W)).toBe(12);
    completeLevel(s, W.id, 12, 2, 0);
    expect(currentLevel(s, W)).toBeNull();
    for (let l = 1; l <= 12; l++) expect(levelStatus(s, W, l)).toBe('done');
  });

  it('con todos los niveles hechos no hay nivel actual', () => {
    const s = createGameState();
    for (let l = 1; l <= LEVEL_COUNT; l++) completeLevel(s, W.id, l, 1, 0);
    expect(currentLevel(s, W)).toBeNull();
  });

  it('cada partida nueva empieza desde cero', () => {
    const a = createGameState();
    completeLevel(a, W.id, 1, 3, 5);
    const b = createGameState();
    expect(levelStatus(b, W, 1)).toBe('current');
    expect(b.cookies).toBe(0);
  });
});

describe('nivel completado', () => {
  it('mantiene la mejor puntuación en estrellas', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 3, 0);
    completeLevel(s, W.id, 1, 1, 0);
    expect(progress(s).stars.get(1)).toBe(3);
  });

  it('suma las galletas: 5 + 4 = 9', () => {
    const s = createGameState();
    s.cookies = 5;
    completeLevel(s, W.id, 1, 2, 4);
    expect(s.cookies).toBe(9);
  });

  it('un nivel sin galletas no cambia el total', () => {
    const s = createGameState();
    s.cookies = 5;
    completeLevel(s, W.id, 1, 1, 0);
    expect(s.cookies).toBe(5);
  });

  it('nunca guarda 0 estrellas', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 0, 0);
    expect(progress(s).stars.get(1)).toBe(1);
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

describe('niveles pendientes de perfiles antiguos', () => {
  it('prueba no superada: 1 hecho, 2 pendiente, 3 actual, 4-12 bloqueados', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 2, 0);
    legacyPending(s, W.id, 2);
    expect(levelStatus(s, W, 1)).toBe('done');
    expect(levelStatus(s, W, 2)).toBe('pending');
    expect(levelStatus(s, W, 3)).toBe('current');
    expect(currentLevel(s, W)).toBe(3);
    for (let l = 4; l <= LEVEL_COUNT; l++) expect(levelStatus(s, W, l)).toBe('locked');
    expect(progress(s).stars.has(2)).toBe(false);
  });

  it('un pendiente desbloquea el siguiente y se puede jugar', () => {
    const s = createGameState();
    legacyPending(s, W.id, 1);
    expect(isUnlocked(s, W, 2)).toBe(true);
    expect(canPlay(s, W, 1)).toBe(true);
    expect(canPlay(s, W, 2)).toBe(true);
    expect(canPlay(s, W, 3)).toBe(false);
  });

  it('Solo quedan pendientes: con los 12 jugados y el 4 pendiente, el zorro va al 4', () => {
    const s = createGameState();
    for (let l = 1; l <= LEVEL_COUNT; l++) {
      if (l === 4) legacyPending(s, W.id, l);
      else completeLevel(s, W.id, l, 1, 0);
    }
    expect(currentLevel(s, W)).toBe(4);
    expect(levelStatus(s, W, 4)).toBe('current');
  });

  it('pendiente superado más tarde pasa a hecho con sus estrellas', () => {
    const s = createGameState();
    legacyPending(s, W.id, 1);
    completeLevel(s, W.id, 1, 2, 0);
    expect(levelStatus(s, W, 1)).toBe('done');
    expect(progress(s).stars.get(1)).toBe(2);
    expect(progress(s).pending.has(1)).toBe(false);
  });

  it('repetir un nivel hecho y sacar 0 estrellas no lo deshace', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 2, 0);
    finishWithoutStars(s, 0);
    expect(levelStatus(s, W, 1)).toBe('done');
    expect(progress(s).stars.get(1)).toBe(2);
  });
});

describe('fase con 0 estrellas', () => {
  it('suma las galletas y no deja el nivel hecho ni pendiente', () => {
    const s = createGameState();
    s.cookies = 5;
    finishWithoutStars(s, 3);
    expect(s.cookies).toBe(8);
    expect(levelStatus(s, W, 1)).toBe('current');
    expect(isUnlocked(s, W, 2)).toBe(false);
    expect(s.worlds.size).toBe(0);
  });
});

describe('progreso por mundo', () => {
  const OTRO = { id: 'otro', levelCount: 5 };

  it('cada mundo lleva su progreso y comparten galletas y gorros', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 3, 4);
    legacyPending(s, W.id, 2);
    s.cookies += 1;
    expect(currentLevel(s, W)).toBe(3);
    expect(currentLevel(s, OTRO)).toBe(1);
    expect(levelStatus(s, OTRO, 2)).toBe('locked');
    completeLevel(s, OTRO.id, 1, 2, 2);
    expect(levelStatus(s, OTRO, 1)).toBe('done');
    expect(levelStatus(s, W, 1)).toBe('done');
    expect(worldProgress(s, OTRO.id).stars.get(1)).toBe(2);
    expect(progress(s).stars.get(1)).toBe(3);
    expect(s.cookies).toBe(7);
  });

  it('cada mundo tiene su número de niveles', () => {
    const s = createGameState();
    for (let l = 1; l <= OTRO.levelCount; l++) completeLevel(s, OTRO.id, l, 1, 0);
    expect(currentLevel(s, OTRO)).toBeNull();
    expect(isUnlocked(s, OTRO, 6)).toBe(false);
    expect(currentLevel(s, W)).toBe(1);
  });

  it('leer el estado de un mundo no lo crea', () => {
    const s = createGameState();
    levelStatus(s, W, 1);
    currentLevel(s, W);
    expect(s.worlds.size).toBe(0);
  });
});

describe('castillo y medalla', () => {
  const W = { id: 'rio', levelCount: 12 };

  it('cerrado hasta jugar el último nivel, hecho o pendiente', () => {
    const s = createGameState();
    expect(castleStatus(s, W)).toBe('locked');
    for (let l = 1; l <= 11; l++) completeLevel(s, 'rio', l, 2, 0);
    expect(castleStatus(s, W)).toBe('locked');
    legacyPending(s, 'rio', 12);
    expect(castleStatus(s, W)).toBe('open');
  });

  it('terminarlo siempre da la medalla y las galletas, y no se pierde al repetirlo', () => {
    const s = createGameState();
    for (let l = 1; l <= 12; l++) completeLevel(s, 'rio', l, 1, 0);
    winMedal(s, 'rio', 4);
    expect(castleStatus(s, W)).toBe('done');
    expect(worldProgress(s, 'rio').medal).toBe(true);
    expect(s.cookies).toBe(4);
    winMedal(s, 'rio', 0);
    expect(castleStatus(s, W)).toBe('done');
  });

  it('la medalla es de cada mundo', () => {
    const s = createGameState();
    winMedal(s, 'rio', 0);
    expect(worldProgress(s, 'arcoiris').medal).toBe(false);
  });
});
