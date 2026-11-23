/**
 * Estado del juego en memoria: progreso del mundo, galletas y gorros.
 * TypeScript puro (sin Phaser) para poder probarlo y, en la fase 3, guardarlo en Firestore.
 */

export const LEVEL_COUNT = 6;

export const HATS = ['cap', 'wool', 'party', 'helmet', 'crown', 'none'] as const;
export type HatId = (typeof HATS)[number];

/** Precios provisionales en galletas; se ajustarán tras jugarlo. */
export const HAT_PRICES: Readonly<Record<HatId, number>> = {
  cap: 0,
  wool: 10,
  party: 15,
  helmet: 20,
  crown: 30,
  none: 0,
};

export type LevelStatus = 'done' | 'current' | 'locked';

export interface GameState {
  /** Mejor puntuación en estrellas de cada nivel completado (1..3). */
  stars: Map<number, number>;
  cookies: number;
  ownedHats: Set<HatId>;
  hat: HatId;
}

export function createGameState(): GameState {
  return { stars: new Map(), cookies: 0, ownedHats: new Set<HatId>(['cap', 'none']), hat: 'cap' };
}

/** Primer nivel sin completar, o `null` si están todos hechos. */
export function currentLevel(state: GameState): number | null {
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    if (!state.stars.has(level)) return level;
  }
  return null;
}

export function levelStatus(state: GameState, level: number): LevelStatus {
  if (state.stars.has(level)) return 'done';
  return currentLevel(state) === level ? 'current' : 'locked';
}

export function canPlay(state: GameState, level: number): boolean {
  return levelStatus(state, level) !== 'locked';
}

/** Guarda la mejor puntuación en estrellas, suma las galletas y desbloquea el siguiente nivel. */
export function completeLevel(state: GameState, level: number, stars: number, cookies: number): void {
  const clamped = Math.max(1, Math.min(3, Math.round(stars)));
  state.stars.set(level, Math.max(state.stars.get(level) ?? 0, clamped));
  state.cookies += Math.max(0, Math.floor(cookies));
}

/** Se pone un gorro ya conseguido. Devuelve `false` si no lo tiene. */
export function wearHat(state: GameState, hat: HatId): boolean {
  if (!state.ownedHats.has(hat)) return false;
  state.hat = hat;
  return true;
}

/**
 * Compra (si hace falta) y se pone un gorro. Si ya lo tiene, solo se lo pone.
 * Devuelve `false`, sin cambiar nada, si no hay galletas suficientes.
 */
export function buyHat(state: GameState, hat: HatId): boolean {
  if (state.ownedHats.has(hat)) return wearHat(state, hat);
  const price = HAT_PRICES[hat];
  if (state.cookies < price) return false;
  state.cookies -= price;
  state.ownedHats.add(hat);
  state.hat = hat;
  return true;
}

/** Instancia única compartida por las escenas mientras la aplicación siga abierta. */
export const session: GameState = createGameState();
