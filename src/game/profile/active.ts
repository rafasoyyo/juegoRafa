/**
 * Perfil activo: carga su progreso dentro de `session` (sin reemplazarla) y lo guarda al cambiar.
 */

import { createGameState, session, type GameState, type HatId } from '../state';
import { cleanAlias } from './profile-id';
import { createProfile, listProfiles, loadProgress, profileInfo, saveProgress, type KeyValueStore, type ProfileInfo } from './profile-store';

let store: KeyValueStore | null | undefined;
let activeId: string | null = null;
/** Alias y edad del perfil en juego, también cuando se juega sin almacenamiento. */
let alias: string | null = null;
let age: number | undefined;

/** Alias que usa la prueba cuando no hay perfil (p. ej. al abrir una escena directamente en desarrollo). */
export const DEFAULT_ALIAS = 'ZORRO';

/** Almacén en uso: `localStorage` si está disponible; `null` si no. */
function storage(): KeyValueStore | null {
  if (store !== undefined) return store;
  try {
    store = typeof window !== 'undefined' ? window.localStorage : null;
    // Algunos navegadores solo fallan al usarlo.
    store?.getItem('juegoRafa.probe');
  } catch {
    store = null;
  }
  return store;
}

/** Para las pruebas: cambia el almacén y olvida el perfil activo. */
export function useStore(next: KeyValueStore | null): void {
  store = next;
  activeId = null;
  alias = null;
  age = undefined;
}

export function activeProfileId(): string | null {
  return activeId;
}

/** Alias del perfil en juego, en mayúsculas; `DEFAULT_ALIAS` si no hay perfil. */
export function activeAlias(): string {
  return alias ?? DEFAULT_ALIAS;
}

/** Edad del perfil en juego; `undefined` si no hay perfil. */
export function activeAge(): number | undefined {
  return age;
}

export function savedProfiles(): ProfileInfo[] {
  const s = storage();
  return s ? listProfiles(s) : [];
}

/** Perfiles guardados con el gorro que lleva cada niño (para dibujar su zorro en la lista). */
export function savedProfilesWithHat(): (ProfileInfo & { hat: HatId })[] {
  const s = storage();
  if (!s) return [];
  return listProfiles(s).map((p) => ({ ...p, hat: loadProgress(s, p.id)?.hat ?? 'cap' }));
}

function fill(progress: GameState): void {
  session.stars = progress.stars;
  session.pending = progress.pending;
  session.cookies = progress.cookies;
  session.ownedHats = progress.ownedHats;
  session.hat = progress.hat;
}

/** Elige un perfil guardado y carga su progreso. Devuelve `false` si ya no se puede leer. */
export function activateProfile(id: string): boolean {
  const s = storage();
  const progress = s ? loadProgress(s, id) : null;
  const info = s ? profileInfo(s, id) : null;
  if (!progress || !info) return false;
  activeId = id;
  alias = info.alias;
  age = info.age;
  fill(progress);
  if (s) saveProgress(s, id, progress);
  return true;
}

/** Crea (o recupera) el perfil de ese alias y edad y lo deja activo. Sin almacenamiento, se juega sin guardar. */
export function startProfile(newAlias: string, newAge: number): boolean {
  const s = storage();
  if (!s) {
    activeId = null;
    alias = cleanAlias(newAlias) || DEFAULT_ALIAS;
    age = newAge;
    fill(createGameState());
    return true;
  }
  const created = createProfile(s, newAlias, newAge);
  if (!created) return false;
  alias = created.info.alias;
  age = created.info.age;
  // Si no se pudo escribir, el perfil no existe en el almacén y no se podrá guardar.
  activeId = loadProgress(s, created.info.id) ? created.info.id : null;
  fill(created.progress);
  return true;
}

/** Guarda el progreso de `session` en el perfil activo; sin perfil o sin almacenamiento no hace nada. */
export function saveActive(): void {
  const s = storage();
  if (s && activeId) saveProgress(s, activeId, session);
}
