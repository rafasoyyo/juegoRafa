/**
 * Ambientes visuales de los niveles: cielo, colinas, suelo, nubes, decoración del fondo y aspecto de
 * las plataformas. Solo datos (TypeScript puro); `BootScene` y `widgets.ts` los dibujan por código.
 *
 * El zorro, los bloques «?», la bandera, los enemigos y el HUD nunca cambian de color: los ambientes
 * solo tocan el escenario.
 */

import type { AmbientId } from './types';

/** Decoración de fondo de cada ambiente. */
export type DecorKind =
  | 'clouds' | 'flowers' | 'trees' | 'autumn-trees' | 'sunset' | 'night' | 'beach' | 'jungle' | 'mountains' | 'snow' | 'desert' | 'rainbow'
  // Los de la isla (`docs/MUNDO-3.md`): helechos, vapor de géiseres, ruinas, luciérnagas, columnas de basalto, cristales y brasas.
  | 'ferns' | 'geysers' | 'ruins' | 'fireflies' | 'basalt' | 'crystals' | 'embers';

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
  /** Qué hay en el fondo de los fosos: pinchos de acero (si falta) o un charco de lava (la isla). */
  pit?: 'spikes' | 'lava';
  /** Color del mar de la playa (`decor: 'beach'`); si falta, el azul claro de los mundos 1 y 2. */
  sea?: number;
  /** El gran volcán de la isla humea al fondo, detrás de las colinas. */
  volcano?: boolean;
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
  // Río de los números (`docs/MUNDO-2.md`): un paisaje por tramo del río, con la decoración del mundo 1.
  manantial: {
    id: 'manantial',
    sky: [
      [0, '#9AD6FF'],
      [0.7, '#E8F6FF'],
      [1, '#EEF8FF'],
    ],
    hillLight: 0xc4d4ea,
    hill: 0x9cc2a4,
    grass: 0x74c47a,
    grassDark: 0x54a460,
    earth: 0xa98466,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'mountains',
    platform: 'log',
    ground: 'grass',
  },
  arroyo: {
    id: 'arroyo',
    sky: [
      [0, '#80CFE0'],
      [0.7, '#DDF4EE'],
      [1, '#E4F7F0'],
    ],
    hillLight: 0x96d3ae,
    hill: 0x72c092,
    grass: 0x4cb46a,
    grassDark: 0x349650,
    earth: 0xab7a52,
    cloud: { tint: 0xffffff, alpha: 0.85 },
    decor: 'trees',
    platform: 'log',
    ground: 'grass',
  },
  cascada: {
    id: 'cascada',
    sky: [
      [0, '#8CCBEF'],
      [0.7, '#E6F4FB'],
      [1, '#F0F8FC'],
    ],
    hillLight: 0xa9cfe0,
    hill: 0x86bfa8,
    grass: 0x62b978,
    grassDark: 0x47995c,
    earth: 0x9c8068,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'mountains',
    platform: 'log',
    ground: 'grass',
  },
  molino: {
    id: 'molino',
    sky: [
      [0, '#93D0FA'],
      [0.7, '#F2F4E4'],
      [1, '#F6F6E6'],
    ],
    hillLight: 0xc6e4a0,
    hill: 0xa6d488,
    grass: 0x66c06a,
    grassDark: 0x48a253,
    earth: 0xc48a58,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'clouds',
    platform: 'log',
    ground: 'grass',
  },
  canaveral: {
    id: 'canaveral',
    sky: [
      [0, '#86D2C4'],
      [0.7, '#E4F4D6'],
      [1, '#ECF6DC'],
    ],
    hillLight: 0x9ccf8e,
    hill: 0x7cbc74,
    grass: 0x56b35c,
    grassDark: 0x3c9446,
    earth: 0x957048,
    cloud: { tint: 0xffffff, alpha: 0.85 },
    decor: 'jungle',
    platform: 'log',
    ground: 'grass',
  },
  lago: {
    id: 'lago',
    sky: [
      [0, '#263F78'],
      [1, '#4F6BA8'],
    ],
    hillLight: 0x6f86c0,
    hill: 0x5a72ae,
    grass: 0x4aa06a,
    grassDark: 0x388658,
    earth: 0x8f6a5a,
    cloud: { tint: 0xa9bce0, alpha: 0.35 },
    decor: 'night',
    platform: 'log',
    ground: 'grass',
  },
  embarcadero: {
    id: 'embarcadero',
    sky: [
      [0, '#7F98DD'],
      [0.45, '#F2B0B8'],
      [0.8, '#FFD0A8'],
      [1, '#FFDDBC'],
    ],
    hillLight: 0xd9b6c6,
    hill: 0xc29ab2,
    grass: 0x6abb70,
    grassDark: 0x4c9c5a,
    earth: 0xb9805a,
    cloud: { tint: 0xffd6d6, alpha: 0.8 },
    decor: 'sunset',
    platform: 'log',
    ground: 'grass',
  },
  puente: {
    id: 'puente',
    sky: [
      [0, '#9DCBEA'],
      [0.55, '#F3E4CC'],
      [1, '#F8ECD8'],
    ],
    hillLight: 0xdcc89a,
    hill: 0xc9ac78,
    grass: 0x92c25a,
    grassDark: 0x72a343,
    earth: 0xa8805a,
    cloud: { tint: 0xfff8ee, alpha: 0.9 },
    decor: 'autumn-trees',
    platform: 'log',
    ground: 'grass',
  },
  huertas: {
    id: 'huertas',
    sky: [
      [0, '#98D6FF'],
      [0.7, '#FDF2DE'],
      [1, '#FDF4E2'],
    ],
    hillLight: 0xc4e6a0,
    hill: 0xa4d684,
    grass: 0x70c664,
    grassDark: 0x52a84f,
    earth: 0xc78e5a,
    cloud: { tint: 0xffffff, alpha: 0.95 },
    decor: 'flowers',
    platform: 'log',
    ground: 'grass',
  },
  lluvia: {
    id: 'lluvia',
    sky: [
      [0, '#8FA8C4'],
      [0.7, '#D6E2EE'],
      [1, '#DEE7F0'],
    ],
    hillLight: 0xa6c4b4,
    hill: 0x86b098,
    grass: 0x5cb46c,
    grassDark: 0x419654,
    earth: 0x9c7a5e,
    cloud: { tint: 0xdde4ee, alpha: 1 },
    decor: 'clouds',
    platform: 'log',
    ground: 'grass',
  },
  puerto: {
    id: 'puerto',
    sky: [
      [0, '#78CEF4'],
      [0.65, '#D2F0FA'],
      [1, '#FFF2DA'],
    ],
    hillLight: 0x9edcd4,
    hill: 0x7ccab8,
    grass: 0xf5dca0,
    grassDark: 0xe2c27e,
    earth: 0xd4b278,
    cloud: { tint: 0xffffff, alpha: 1 },
    decor: 'beach',
    platform: 'log',
    ground: 'sand',
  },
  desembocadura: {
    id: 'desembocadura',
    sky: [
      [0, '#86C6F0'],
      [0.6, '#F6DCCB'],
      [1, '#FFE8D2'],
    ],
    hillLight: 0xa6d8d0,
    hill: 0x88c6b6,
    grass: 0xf6deaa,
    grassDark: 0xe3c488,
    earth: 0xd6b47c,
    cloud: { tint: 0xfff4ee, alpha: 0.95 },
    decor: 'beach',
    platform: 'log',
    ground: 'sand',
  },
  // Isla de los dinosaurios (`docs/MUNDO-3.md`): atardecer volcánico, selva oscura y basalto. Los fosos son
  // charcos de lava y, salvo de noche, en el yacimiento, en la cueva o en el borde del cráter, el gran volcán humea al fondo.
  'playa-negra': {
    id: 'playa-negra',
    sky: [
      [0, '#5B6B8C'],
      [0.6, '#C98A86'],
      [1, '#F0B88E'],
    ],
    hillLight: 0x6f7f86,
    hill: 0x4f6168,
    grass: 0x4a4a52,
    grassDark: 0x35353c,
    earth: 0x2c2b31,
    cloud: { tint: 0xf3d6cf, alpha: 0.8 },
    decor: 'beach',
    platform: 'log',
    ground: 'sand',
    // Mar oscuro de atardecer, a juego con la arena negra.
    sea: 0x4f7f96,
    pit: 'lava',
    volcano: true,
  },
  'helechos': {
    id: 'helechos',
    sky: [
      [0, '#4F6E7A'],
      [0.7, '#9DB8A8'],
      [1, '#C4D6BE'],
    ],
    hillLight: 0x4f7d66,
    hill: 0x3c6852,
    grass: 0x3b7a4a,
    grassDark: 0x2c5f3a,
    earth: 0x4a3a30,
    cloud: { tint: 0xe2ece4, alpha: 0.7 },
    decor: 'ferns',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
    volcano: true,
  },
  'geiseres': {
    id: 'geiseres',
    sky: [
      [0, '#6A7590'],
      [0.65, '#B9A2A0'],
      [1, '#D8C2B0'],
    ],
    hillLight: 0x7a7068,
    hill: 0x5e564f,
    grass: 0x7a6a52,
    grassDark: 0x5e4f3c,
    earth: 0x3e332b,
    cloud: { tint: 0xf2e6e2, alpha: 0.85 },
    decor: 'geysers',
    platform: 'log',
    ground: 'sand',
    pit: 'lava',
    volcano: true,
  },
  'huellas': {
    id: 'huellas',
    sky: [
      [0, '#5E6F8E'],
      [0.6, '#C8A08A'],
      [1, '#E5C3A0'],
    ],
    hillLight: 0x8a7a66,
    hill: 0x6e604f,
    grass: 0x6f8a4f,
    grassDark: 0x55703c,
    earth: 0x5a4636,
    cloud: { tint: 0xf3dccf, alpha: 0.8 },
    decor: 'ruins',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
    volcano: true,
  },
  'cascada-templada': {
    id: 'cascada-templada',
    sky: [
      [0, '#4E7C8C'],
      [0.7, '#A8CCC8'],
      [1, '#D4E6DC'],
    ],
    hillLight: 0x4f8a78,
    hill: 0x3a705e,
    grass: 0x3f8f5a,
    grassDark: 0x2f7347,
    earth: 0x4f4038,
    cloud: { tint: 0xffffff, alpha: 0.75 },
    decor: 'jungle',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
    volcano: true,
  },
  'pantano': {
    id: 'pantano',
    sky: [
      [0, '#1E2840'],
      [1, '#3A4A66'],
    ],
    hillLight: 0x2f4a4a,
    hill: 0x243c3c,
    grass: 0x3a6a4a,
    grassDark: 0x2a5038,
    earth: 0x2e2a2c,
    cloud: { tint: 0x8a98b0, alpha: 0.3 },
    decor: 'fireflies',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
  },
  'cuellos-largos': {
    id: 'cuellos-largos',
    sky: [
      [0, '#5A6488'],
      [0.5, '#D49A8C'],
      [1, '#EDC4A2'],
    ],
    hillLight: 0x7f8a5a,
    hill: 0x66733f,
    grass: 0x7a9a4a,
    grassDark: 0x5e7d36,
    earth: 0x5f4a34,
    cloud: { tint: 0xf6d2c6, alpha: 0.8 },
    decor: 'sunset',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
    volcano: true,
  },
  'columnas': {
    id: 'columnas',
    sky: [
      [0, '#4A5570'],
      [0.7, '#8E8FA0'],
      [1, '#B8B4B8'],
    ],
    hillLight: 0x5a5868,
    hill: 0x45434f,
    grass: 0x5a5a62,
    grassDark: 0x434349,
    earth: 0x2f2e34,
    cloud: { tint: 0xd8d8e0, alpha: 0.6 },
    decor: 'basalt',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
    volcano: true,
  },
  'yacimiento': {
    id: 'yacimiento',
    sky: [
      [0, '#6C7C98'],
      [0.6, '#D8B898'],
      [1, '#EAD2B0'],
    ],
    hillLight: 0xb59a74,
    hill: 0x9a7e5a,
    grass: 0xb8a07a,
    grassDark: 0x9a835f,
    earth: 0x7a6448,
    cloud: { tint: 0xfaeadc, alpha: 0.85 },
    decor: 'ruins',
    platform: 'log',
    ground: 'sand',
    pit: 'lava',
  },
  'cristales': {
    id: 'cristales',
    sky: [
      [0, '#2A2440'],
      [1, '#4A3E66'],
    ],
    hillLight: 0x4a4070,
    hill: 0x3a3258,
    grass: 0x5a5470,
    grassDark: 0x46405a,
    earth: 0x2a2636,
    cloud: { tint: 0x9a8ec0, alpha: 0.25 },
    decor: 'crystals',
    platform: 'log',
    ground: 'grass',
    pit: 'lava',
  },
  'rios-lava': {
    id: 'rios-lava',
    sky: [
      [0, '#3A2E3E'],
      [0.6, '#7A4A48'],
      [1, '#A86450'],
    ],
    hillLight: 0x5a3a40,
    hill: 0x48303a,
    grass: 0x3e3a40,
    grassDark: 0x2c292e,
    earth: 0x221f24,
    cloud: { tint: 0xc89a90, alpha: 0.5 },
    decor: 'embers',
    platform: 'log',
    ground: 'sand',
    pit: 'lava',
    volcano: true,
  },
  'borde-crater': {
    id: 'borde-crater',
    sky: [
      [0, '#3E3550'],
      [0.6, '#9A5A5A'],
      [1, '#C87860'],
    ],
    hillLight: 0x6a4a56,
    hill: 0x553a46,
    grass: 0x4a4048,
    grassDark: 0x36303a,
    earth: 0x26222a,
    cloud: { tint: 0xd8a8a0, alpha: 0.55 },
    decor: 'embers',
    platform: 'log',
    ground: 'sand',
    pit: 'lava',
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
  'decor-fern',
  'decor-column',
  'decor-basalt',
  'decor-crystal',
  'decor-geyser',
  'decor-volcano',
  'decor-ember',
  'decor-firefly',
] as const;
