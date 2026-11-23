/**
 * Convierte el progreso de `GameState` a un objeto JSON y de vuelta, validando lo leído.
 */

import { HATS, LEVEL_COUNT, createGameState, type GameState, type HatId } from '../state';

export interface SavedProgress {
  /** Pares [nivel, estrellas]. */
  stars: [number, number][];
  /** Niveles pendientes (jugados sin superar la prueba). Falta en el progreso guardado antes de las pruebas. */
  pending?: number[];
  cookies: number;
  ownedHats: string[];
  hat: string;
}

export function encodeProgress(state: GameState): SavedProgress {
  return { stars: [...state.stars], pending: [...state.pending], cookies: state.cookies, ownedHats: [...state.ownedHats], hat: state.hat };
}

const isHat = (v: unknown): v is HatId => typeof v === 'string' && (HATS as readonly string[]).includes(v);

/** Estado a partir de lo guardado. Lo que no sea válido se ignora; con basura total sale un estado nuevo. */
export function decodeProgress(raw: unknown): GameState {
  const state = createGameState();
  if (typeof raw !== 'object' || raw === null) return state;
  const r = raw as Record<string, unknown>;

  if (Array.isArray(r.stars)) {
    for (const pair of r.stars) {
      if (!Array.isArray(pair)) continue;
      const [level, stars] = pair as unknown[];
      if (typeof level !== 'number' || typeof stars !== 'number') continue;
      if (!Number.isInteger(level) || level < 1 || level > LEVEL_COUNT || !Number.isFinite(stars)) continue;
      state.stars.set(level, Math.max(1, Math.min(3, Math.round(stars))));
    }
  }
  if (Array.isArray(r.pending)) {
    for (const level of r.pending) {
      if (typeof level !== 'number' || !Number.isInteger(level) || level < 1 || level > LEVEL_COUNT) continue;
      if (!state.stars.has(level)) state.pending.add(level);
    }
  }
  if (typeof r.cookies === 'number' && Number.isFinite(r.cookies)) state.cookies = Math.max(0, Math.floor(r.cookies));
  if (Array.isArray(r.ownedHats)) for (const h of r.ownedHats) if (isHat(h)) state.ownedHats.add(h);
  if (isHat(r.hat) && state.ownedHats.has(r.hat)) state.hat = r.hat;
  return state;
}
