/**
 * Estado del juego en memoria: progreso de cada mundo, galletas y gorros.
 * TypeScript puro (sin Phaser) para poder probarlo y, en la fase 3, guardarlo en Firestore.
 *
 * Un nivel se identifica por su mundo y su número dentro de él (1..`levelCount`). Las galletas y los
 * gorros son del perfil, compartidos por todos los mundos.
 */

/** Identificador de un mundo (p. ej. `arcoiris`); los mundos se registran en `src/game/worlds/`. */
export type WorldId = string;

/** Lo que el progreso necesita saber de un mundo: su id y cuántos niveles tiene. */
export interface WorldShape {
  id: WorldId;
  levelCount: number;
}

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

/** Progreso de un mundo. */
export interface WorldProgress {
  /** Mejor puntuación en estrellas de cada nivel completado (1..3). Un nivel está hecho si está aquí. */
  stars: Map<number, number>;
  /** Niveles jugados hasta la bandera sin superar su prueba. Nunca contiene un nivel hecho. */
  pending: Set<number>;
  /** Medalla del castillo del mundo: se gana al terminar el castillo y no se pierde. */
  medal: boolean;
}

export interface GameState {
  /** Progreso de cada mundo jugado; un mundo sin entrada no se ha empezado. */
  worlds: Map<WorldId, WorldProgress>;
  cookies: number;
  ownedHats: Set<HatId>;
  hat: HatId;
}

export function createWorldProgress(): WorldProgress {
  return { stars: new Map(), pending: new Set(), medal: false };
}

export function createGameState(): GameState {
  return { worlds: new Map(), cookies: 0, ownedHats: new Set<HatId>(['cap', 'none']), hat: 'cap' };
}

/** Progreso del mundo `world`; si aún no tiene, se crea vacío y se guarda en el estado. */
export function worldProgress(state: GameState, world: WorldId): WorldProgress {
  let progress = state.worlds.get(world);
  if (!progress) {
    progress = createWorldProgress();
    state.worlds.set(world, progress);
  }
  return progress;
}

/** Progreso de un mundo para leerlo, sin crearlo si aún no existe. */
function read(state: GameState, world: WorldId): WorldProgress {
  return state.worlds.get(world) ?? createWorldProgress();
}

/** Un nivel está jugado si está hecho o pendiente. */
function reached(progress: WorldProgress, level: number): boolean {
  return progress.stars.has(level) || progress.pending.has(level);
}

/**
 * Nivel del mundo en el que se pone el zorro: el primero sin jugar; si todos se han jugado, el primer
 * pendiente; `null` si están todos hechos.
 */
export function currentLevel(state: GameState, world: WorldShape): number | null {
  const progress = read(state, world.id);
  for (let level = 1; level <= world.levelCount; level++) {
    if (!reached(progress, level)) return level;
  }
  for (let level = 1; level <= world.levelCount; level++) {
    if (progress.pending.has(level)) return level;
  }
  return null;
}

/** El nivel 1 de cada mundo siempre está desbloqueado; los demás, si el anterior está hecho o pendiente. */
export function isUnlocked(state: GameState, world: WorldShape, level: number): boolean {
  if (level < 1 || level > world.levelCount) return false;
  return level === 1 || reached(read(state, world.id), level - 1);
}

export function levelStatus(state: GameState, world: WorldShape, level: number): LevelStatus {
  const progress = read(state, world.id);
  if (progress.stars.has(level)) return 'done';
  if (currentLevel(state, world) === level) return 'current';
  if (progress.pending.has(level)) return 'pending';
  return isUnlocked(state, world, level) ? 'current' : 'locked';
}

export function canPlay(state: GameState, world: WorldShape, level: number): boolean {
  return levelStatus(state, world, level) !== 'locked';
}

/**
 * Estado del castillo de un mundo: cerrado hasta jugar (hecho o pendiente) el último nivel; abierto
 * hasta ganar la medalla y, después, hecho (se puede volver a jugar).
 */
export type CastleStatus = 'locked' | 'open' | 'done';

export function castleStatus(state: GameState, world: WorldShape): CastleStatus {
  const progress = read(state, world.id);
  if (progress.medal) return 'done';
  return reached(progress, world.levelCount) ? 'open' : 'locked';
}

/** Castillo terminado: siempre da la medalla del mundo (sin estrellas) y suma las galletas. */
export function winMedal(state: GameState, world: WorldId, cookies: number): void {
  worldProgress(state, world).medal = true;
  state.cookies += Math.max(0, Math.floor(cookies));
}

/** Guarda la mejor puntuación en estrellas, suma las galletas y deja el nivel hecho (ya no pendiente). */
export function completeLevel(state: GameState, world: WorldId, level: number, stars: number, cookies: number): void {
  const progress = worldProgress(state, world);
  const clamped = Math.max(1, Math.min(3, Math.round(stars)));
  progress.stars.set(level, Math.max(progress.stars.get(level) ?? 0, clamped));
  progress.pending.delete(level);
  state.cookies += Math.max(0, Math.floor(cookies));
}

/**
 * Prueba de la bandera no superada: suma las galletas y deja el nivel pendiente, salvo que ya estuviera
 * hecho (repetir un nivel hecho y fallar no lo deshace). El siguiente nivel queda desbloqueado.
 */
export function markPending(state: GameState, world: WorldId, level: number, cookies: number): void {
  const progress = worldProgress(state, world);
  if (!progress.stars.has(level)) progress.pending.add(level);
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
