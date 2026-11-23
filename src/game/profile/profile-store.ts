/**
 * Perfiles de niño guardados en el navegador: un registro por perfil, sin servidor.
 * Todo está protegido con try/catch: si el almacenamiento falla, el juego sigue sin guardar.
 */

import { createGameState, type GameState } from '../state';
import { cleanAlias, isValidProfile, profileId } from './profile-id';
import { decodeProgress, encodeProgress } from './progress-codec';

/** Lo mínimo que se usa de `localStorage` (y de un almacén falso en las pruebas). */
export interface KeyValueStore {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const PREFIX = 'juegoRafa.profile.';
const LAST_KEY = 'juegoRafa.last';
const VERSION = 1;

export interface ProfileInfo {
  id: string;
  alias: string;
  age: number;
  lastPlayed: number;
}

interface Record_ extends ProfileInfo {
  v: number;
  progress: unknown;
}

function parse(text: string | null): Record_ | null {
  if (text === null) return null;
  try {
    const r = JSON.parse(text) as Partial<Record_> | null;
    if (!r || typeof r !== 'object' || r.v !== VERSION) return null;
    if (typeof r.alias !== 'string' || typeof r.age !== 'number' || !isValidProfile(r.alias, r.age)) return null;
    const lastPlayed = typeof r.lastPlayed === 'number' ? r.lastPlayed : 0;
    return { v: VERSION, id: profileId(r.alias, r.age), alias: cleanAlias(r.alias), age: r.age, lastPlayed, progress: r.progress };
  } catch {
    return null;
  }
}

function read(store: KeyValueStore, id: string): Record_ | null {
  try {
    return parse(store.getItem(PREFIX + id));
  } catch {
    return null;
  }
}

/** Perfiles guardados y legibles, el último usado primero. */
export function listProfiles(store: KeyValueStore): ProfileInfo[] {
  const out: ProfileInfo[] = [];
  try {
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      const r = read(store, key.slice(PREFIX.length));
      if (r && PREFIX + r.id === key) out.push({ id: r.id, alias: r.alias, age: r.age, lastPlayed: r.lastPlayed });
    }
  } catch {
    return [];
  }
  return out.sort((a, b) => b.lastPlayed - a.lastPlayed || a.id.localeCompare(b.id));
}

function write(store: KeyValueStore, r: Record_): void {
  try {
    store.setItem(PREFIX + r.id, JSON.stringify(r));
    store.setItem(LAST_KEY, r.id);
  } catch {
    /* sin almacenamiento: se juega sin guardar */
  }
}

/**
 * Perfil para ese alias y esa edad: el existente si ya estaba (con su progreso) o uno nuevo.
 * Devuelve `null` si el alias o la edad no son válidos.
 */
export function createProfile(store: KeyValueStore, alias: string, age: number, now = Date.now()): { info: ProfileInfo; progress: GameState } | null {
  if (!isValidProfile(alias, age)) return null;
  const id = profileId(alias, age);
  const existing = read(store, id);
  const record: Record_ = existing
    ? { ...existing, lastPlayed: now }
    : { v: VERSION, id, alias: cleanAlias(alias), age, lastPlayed: now, progress: encodeProgress(createGameState()) };
  write(store, record);
  return { info: { id, alias: record.alias, age, lastPlayed: now }, progress: decodeProgress(record.progress) };
}

/** Alias y edad de un perfil guardado; `null` si no existe o no se puede leer. */
export function profileInfo(store: KeyValueStore, id: string): ProfileInfo | null {
  const r = read(store, id);
  return r ? { id: r.id, alias: r.alias, age: r.age, lastPlayed: r.lastPlayed } : null;
}

/** Progreso guardado de un perfil; `null` si no existe o no se puede leer. */
export function loadProgress(store: KeyValueStore, id: string): GameState | null {
  const r = read(store, id);
  return r ? decodeProgress(r.progress) : null;
}

/** Guarda el progreso del perfil `id` (debe existir) y lo marca como el último usado. */
export function saveProgress(store: KeyValueStore, id: string, state: GameState, now = Date.now()): void {
  const r = read(store, id);
  if (!r) return;
  write(store, { ...r, lastPlayed: now, progress: encodeProgress(state) });
}

export function lastProfileId(store: KeyValueStore): string | null {
  try {
    return store.getItem(LAST_KEY);
  } catch {
    return null;
  }
}
