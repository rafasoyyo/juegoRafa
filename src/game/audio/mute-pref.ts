/**
 * Preferencia de silencio guardada en el dispositivo. Sin identificadores: solo "1" o "0".
 * Si el almacenamiento falla (navegación privada, datos bloqueados) se juega con sonido.
 */

export const MUTE_KEY = 'juegoRafa.muted';

type MinimalStorage = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStorage(): MinimalStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function loadMuted(storage: MinimalStorage | undefined = defaultStorage()): boolean {
  try {
    return storage?.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMuted(storage: MinimalStorage | undefined, muted: boolean): void {
  try {
    storage?.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // Sin almacenamiento: la preferencia dura solo esta sesión.
  }
}

/** Guarda en el almacenamiento por defecto del navegador. */
export function saveMutedLocally(muted: boolean): void {
  saveMuted(defaultStorage(), muted);
}
