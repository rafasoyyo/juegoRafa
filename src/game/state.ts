/**
 * Estado del juego en memoria: progreso del mundo, galletas y gorros.
 * TypeScript puro (sin Phaser) para poder probarlo y, en la fase 3, guardarlo en Firestore.
 */

/** Niveles del mundo de los números. */
export const LEVEL_COUNT = 12;

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

export type LevelStatus = 'done' | 'pending' | 'current' | 'locked';

export interface GameState {
  /** Mejor puntuación en estrellas de cada nivel completado (1..3). Un nivel está hecho si está aquí. */
  stars: Map<number, number>;
  /** Niveles jugados hasta la bandera sin superar su prueba. Nunca contiene un nivel hecho. */
  pending: Set<number>;
  cookies: number;
  ownedHats: Set<HatId>;
  hat: HatId;
}

export function createGameState(): GameState {
  return { stars: new Map(), pending: new Set(), cookies: 0, ownedHats: new Set<HatId>(['cap', 'none']), hat: 'cap' };
}

/** Un nivel está jugado si está hecho o pendiente. */
function reached(state: GameState, level: number): boolean {
  return state.stars.has(level) || state.pending.has(level);
}

/**
 * Nivel en el que se pone el zorro: el primero sin jugar; si todos se han jugado, el primer pendiente;
 * `null` si están todos hechos.
 */
export function currentLevel(state: GameState): number | null {
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    if (!reached(state, level)) return level;
  }
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    if (state.pending.has(level)) return level;
  }
  return null;
}

/** El nivel 1 siempre está desbloqueado; los demás, si el anterior está hecho o pendiente. */
export function isUnlocked(state: GameState, level: number): boolean {
  if (level < 1 || level > LEVEL_COUNT) return false;
  return level === 1 || reached(state, level - 1);
}

export function levelStatus(state: GameState, level: number): LevelStatus {
  if (state.stars.has(level)) return 'done';
  if (currentLevel(state) === level) return 'current';
  if (state.pending.has(level)) return 'pending';
  return isUnlocked(state, level) ? 'current' : 'locked';
}

export function canPlay(state: GameState, level: number): boolean {
  return levelStatus(state, level) !== 'locked';
}

/** Guarda la mejor puntuación en estrellas, suma las galletas y deja el nivel hecho (ya no pendiente). */
export function completeLevel(state: GameState, level: number, stars: number, cookies: number): void {
  const clamped = Math.max(1, Math.min(3, Math.round(stars)));
  state.stars.set(level, Math.max(state.stars.get(level) ?? 0, clamped));
  state.pending.delete(level);
  state.cookies += Math.max(0, Math.floor(cookies));
}

/**
 * Prueba de la bandera no superada: suma las galletas y deja el nivel pendiente, salvo que ya estuviera
 * hecho (repetir un nivel hecho y fallar no lo deshace). El siguiente nivel queda desbloqueado.
 */
export function markPending(state: GameState, level: number, cookies: number): void {
  if (!state.stars.has(level)) state.pending.add(level);
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
