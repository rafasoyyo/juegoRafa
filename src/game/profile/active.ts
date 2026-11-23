/**
 * Perfil activo: carga su progreso dentro de `session` (sin reemplazarla) y lo guarda al cambiar.
 */

import { createGameState, session, type GameState, type HatId } from '../state';
import { createProfile, listProfiles, loadProgress, saveProgress, type KeyValueStore, type ProfileInfo } from './profile-store';

let store: KeyValueStore | null | undefined;
let activeId: string | null = null;

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
}

export function activeProfileId(): string | null {
  return activeId;
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
  session.cookies = progress.cookies;
  session.ownedHats = progress.ownedHats;
  session.hat = progress.hat;
}

/** Elige un perfil guardado y carga su progreso. Devuelve `false` si ya no se puede leer. */
export function activateProfile(id: string): boolean {
  const s = storage();
  const progress = s ? loadProgress(s, id) : null;
  if (!progress) return false;
  activeId = id;
  fill(progress);
  if (s) saveProgress(s, id, progress);
  return true;
}

/** Crea (o recupera) el perfil de ese alias y edad y lo deja activo. Sin almacenamiento, se juega sin guardar. */
export function startProfile(alias: string, age: number): boolean {
  const s = storage();
  if (!s) {
    activeId = null;
    fill(createGameState());
    return true;
  }
  const created = createProfile(s, alias, age);
  if (!created) return false;
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
