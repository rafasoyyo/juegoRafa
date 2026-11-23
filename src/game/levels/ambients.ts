/**
 * Ambientes visuales de los niveles: cielo, colinas, suelo, nubes, decoración del fondo y aspecto de
 * las plataformas. Solo datos (TypeScript puro); `BootScene` y `widgets.ts` los dibujan por código.
 *
 * El zorro, los bloques «?», la bandera, los enemigos y el HUD nunca cambian de color: los ambientes
 * solo tocan el escenario.
 */

import type { AmbientId } from './types';

/** Decoración de fondo de cada ambiente. */
export type DecorKind = 'clouds' | 'flowers' | 'trees' | 'autumn-trees' | 'sunset' | 'night';

/** Las plataformas se dibujan como un tronco o como una nube mullida. */
export type PlatformStyle = 'log' | 'cloud';

export interface Ambient {
  id: AmbientId;
  /** Paradas del degradado vertical del cielo (0 arriba, 1 abajo), en CSS. */
  sky: readonly (readonly [number, string])[];
  /** Colinas lejanas (más claras) y cercanas. */
  hillLight: number;
  hill: number;
  grass: number;
  grassDark: number;
  earth: number;
  /** Tinte y opacidad de las nubes del fondo. */
  cloud: { tint: number; alpha: number };
  decor: DecorKind;
  platform: PlatformStyle;
}

export const AMBIENTS: Readonly<Record<AmbientId, Ambient>> = {
  prado: {
    id: 'prado',
    sky: [
      [0, '#8FD3FF'],
      [0.7, '#E6F6FF'],
      [1, '#E6F6FF'],
    ],
    hillLight: 0xa9e3a0,
    hill: 0x8fd893,
    grass: 0x5cc46b,
    grassDark: 0x3fa652,
    earth: 0xc98a58,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'clouds',
    platform: 'log',
  },
  flores: {
    id: 'flores',
    sky: [
      [0, '#9CD9FF'],
      [0.7, '#FFF0E6'],
      [1, '#FFF0E6'],
    ],
    hillLight: 0xbde9a6,
    hill: 0x9edc8c,
    grass: 0x6ccb6a,
    grassDark: 0x4aac55,
    earth: 0xd0905c,
    cloud: { tint: 0xffffff, alpha: 0.95 },
    decor: 'flowers',
    platform: 'log',
  },
  bosque: {
    id: 'bosque',
    sky: [
      [0, '#86D3DC'],
      [0.7, '#E2F6EA'],
      [1, '#E2F6EA'],
    ],
    hillLight: 0x9cd6a2,
    hill: 0x7cc68a,
    grass: 0x4fb865,
    grassDark: 0x379a4f,
    earth: 0xb47c52,
    cloud: { tint: 0xffffff, alpha: 0.85 },
    decor: 'trees',
    platform: 'log',
  },
  otono: {
    id: 'otono',
    sky: [
      [0, '#A6CDEB'],
      [0.55, '#FBE3C8'],
      [1, '#FFEBD4'],
    ],
    hillLight: 0xecca8a,
    hill: 0xdcac6a,
    grass: 0x9cc45a,
    grassDark: 0x7aa543,
    earth: 0xb8794a,
    cloud: { tint: 0xfff6ea, alpha: 0.9 },
    decor: 'autumn-trees',
    platform: 'log',
  },
  atardecer: {
    id: 'atardecer',
    sky: [
      [0, '#8A8FDB'],
      [0.45, '#F5A8BC'],
      [0.8, '#FFC9AA'],
      [1, '#FFD8BC'],
    ],
    hillLight: 0xe2b0c8,
    hill: 0xcc94b6,
    grass: 0x6fbf6a,
    grassDark: 0x4f9f55,
    earth: 0xb9805a,
    cloud: { tint: 0xffd0dc, alpha: 0.8 },
    decor: 'sunset',
    platform: 'cloud',
  },
  noche: {
    id: 'noche',
    sky: [
      [0, '#2E3A7A'],
      [1, '#5B5FA8'],
    ],
    hillLight: 0x7f7ac4,
    hill: 0x6b66b2,
    grass: 0x4ea568,
    grassDark: 0x3a8a57,
    earth: 0x8f6a5a,
    cloud: { tint: 0xa9acdf, alpha: 0.35 },
    decor: 'night',
    platform: 'cloud',
  },
};

/** Clave de la textura del cielo de un ambiente (la crea `BootScene`). */
export function skyKey(id: AmbientId): string {
  return `sky-${id}`;
}

/** Texturas de decoración generadas por código en `BootScene`. */
export const DECOR_TEXTURES = ['decor-tree', 'decor-tree-autumn', 'decor-flowers', 'decor-sun', 'decor-moon', 'decor-star'] as const;
