/**
 * Ambientes visuales de los niveles: cielo, colinas, suelo, nubes, decoración del fondo y aspecto de
 * las plataformas. Solo datos (TypeScript puro); `BootScene` y `widgets.ts` los dibujan por código.
 *
 * El zorro, los bloques «?», la bandera, los enemigos y el HUD nunca cambian de color: los ambientes
 * solo tocan el escenario.
 */

import type { AmbientId } from './types';

/** Decoración de fondo de cada ambiente. */
export type DecorKind = 'clouds' | 'flowers' | 'trees' | 'autumn-trees' | 'sunset' | 'night' | 'beach' | 'jungle' | 'mountains' | 'snow' | 'desert' | 'rainbow';

/** Borde superior del suelo: hierba, arena lisa, nieve redondeada o nube festoneada. */
export type GroundStyle = 'grass' | 'sand' | 'snow' | 'cloud';

/** Las plataformas se dibujan como un tronco o como una nube mullida. */
export type PlatformStyle = 'log' | 'cloud';

export interface Ambient {
  id: AmbientId;
  /** Paradas del degradado vertical del cielo (0 arriba, 1 abajo), en CSS. */
  sky: readonly (readonly [number, string])[];
  /** Colinas lejanas (más claras) y cercanas. */
  hillLight: number;
  hill: number;
  /** Colores del suelo: la capa de arriba (`grass`, aunque sea arena, nieve o nube), su sombra y la base. */
  grass: number;
  grassDark: number;
  earth: number;
  /** Tinte y opacidad de las nubes del fondo. */
  cloud: { tint: number; alpha: number };
  decor: DecorKind;
  platform: PlatformStyle;
  ground: GroundStyle;
  /** Cuánta tinta lleva la pared del foso de los pinchos (0 a 1); si falta, `PIT_WALL_MIX`. */
  pitMix?: number;
  /** Opacidad del arcoíris del horizonte (0 a 1); si falta, `RAINBOW_ALPHA` (`horizon-rainbow.ts`). */
  rainbowAlpha?: number;
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
    ground: 'grass',
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
    ground: 'grass',
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
    ground: 'grass',
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
    ground: 'grass',
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
    ground: 'grass',
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
    ground: 'grass',
    // Arcoíris de luna: a la mitad de la opacidad normal, para que la luna y las estrellas se reconozcan.
    rainbowAlpha: 0.38,
  },
  playa: {
    id: 'playa',
    sky: [
      [0, '#7FD3F2'],
      [0.65, '#D6F3FA'],
      [1, '#FFF4DC'],
    ],
    hillLight: 0xa8e0d0,
    hill: 0x86cfb4,
    grass: 0xf7e0a6,
    grassDark: 0xe5c784,
    earth: 0xd9b77a,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'beach',
    platform: 'log',
    ground: 'sand',
  },
  selva: {
    id: 'selva',
    sky: [
      [0, '#78CDB4'],
      [0.7, '#DCF2D2'],
      [1, '#E6F6D8'],
    ],
    hillLight: 0x6fc08a,
    hill: 0x4fa872,
    grass: 0x3fae5a,
    grassDark: 0x2d8f47,
    earth: 0x8f6440,
    cloud: { tint: 0xffffff, alpha: 0.8 },
    decor: 'jungle',
    platform: 'log',
    ground: 'grass',
  },
  montana: {
    id: 'montana',
    sky: [
      [0, '#8EC2F0'],
      [0.7, '#E2EEFA'],
      [1, '#ECF3FA'],
    ],
    hillLight: 0xb9cbe2,
    hill: 0x93b89c,
    grass: 0x6cbf74,
    grassDark: 0x4d9e5a,
    earth: 0xa98466,
    cloud: { tint: 0xffffff, alpha: 0.95 },
    decor: 'mountains',
    platform: 'log',
    ground: 'grass',
  },
  nieve: {
    id: 'nieve',
    sky: [
      [0, '#A6CCEE'],
      [0.7, '#E8F1FA'],
      [1, '#F0F5FB'],
    ],
    hillLight: 0xdde8f4,
    hill: 0xc6d7ea,
    grass: 0xf7fbff,
    grassDark: 0xd3e1f0,
    earth: 0x9fb3c8,
    cloud: { tint: 0xf4f8ff, alpha: 0.9 },
    decor: 'snow',
    platform: 'log',
    ground: 'snow',
    // Suelo muy claro: la pared del foso lleva más tinta para que el acero destaque (ΔE ≥ 30).
    pitMix: 0.52,
  },
  desierto: {
    id: 'desierto',
    sky: [
      [0, '#9CD2EF'],
      [0.6, '#F1E9D6'],
      [1, '#F6EDD8'],
    ],
    hillLight: 0xefd9a8,
    hill: 0xe3c68c,
    // Arena pálida y tierra marrón clara, nunca naranja: el zorro tiene que destacar.
    grass: 0xf2dfb0,
    grassDark: 0xdcc38a,
    earth: 0xc9a774,
    cloud: { tint: 0xfffaf0, alpha: 0.7 },
    decor: 'desert',
    platform: 'log',
    ground: 'sand',
  },
  nubes: {
    id: 'nubes',
    sky: [
      [0, '#B3A6EE'],
      [0.5, '#F1CBE8'],
      [1, '#FCE6EF'],
    ],
    hillLight: 0xf7eeff,
    hill: 0xeadff8,
    grass: 0xffffff,
    grassDark: 0xdcd3ee,
    earth: 0xc9bfe3,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'rainbow',
    platform: 'cloud',
    ground: 'cloud',
    // Suelo muy claro: la pared del foso lleva más tinta para que el acero destaque (ΔE ≥ 30).
    pitMix: 0.52,
  },
};

/** Tinta de la paleta (`COLORS.ink`): oscurece la tierra en la pared del foso de los pinchos. */
export const INK = 0x2b2340;
/** Mezcla de tinta de la pared del foso por defecto. */
export const PIT_WALL_MIX = 0.42;

/** Mezcla `a` hacia `b` (`t` de 0 a 1), canal a canal. */
export function mixColor(a: number, b: number, t: number): number {
  const ch = (shift: number): number => Math.round(((a >> shift) & 0xff) * (1 - t) + ((b >> shift) & 0xff) * t) << shift;
  return ch(16) | ch(8) | ch(0);
}

/** Color de la pared del foso de los pinchos: la tierra del ambiente oscurecida con la tinta. */
export function pitWall(ambient: Ambient): number {
  return mixColor(ambient.earth, INK, ambient.pitMix ?? PIT_WALL_MIX);
}

/** Clave de la textura del cielo de un ambiente (la crea `BootScene`). */
export function skyKey(id: AmbientId): string {
  return `sky-${id}`;
}

/** Texturas de decoración generadas por código en `BootScene`. */
export const DECOR_TEXTURES = [
  'decor-tree',
  'decor-tree-autumn',
  'decor-flowers',
  'decor-sun',
  'decor-moon',
  'decor-star',
  'decor-palm',
  'decor-leaf',
  'decor-vine',
  'decor-peak',
  'decor-pine-snow',
  'decor-flake',
  'decor-cactus',
  'decor-rainbow',
] as const;
