// Alto lógico fijo y ancho adaptable a la proporción de la pantalla (entre 4:3 y 21:9),
// para llenar móviles alargados y tabletas sin bandas.
export const GAME_H = 720;
export const MIN_W = 960;
export const MAX_W = 1680;

/** Ancho lógico para una pantalla de `viewW`×`viewH` píxeles CSS. */
export function fitWidth(viewW: number, viewH: number): number {
  if (viewW <= 0 || viewH <= 0) return MIN_W;
  const w = Math.round((GAME_H * viewW) / viewH);
  return Math.min(MAX_W, Math.max(MIN_W, w));
}

export const FONT = '"Baloo 2", sans-serif';

/** Paleta del diseño. */
export const COLORS = {
  skyTop: 0x8fd3ff,
  skyBottom: 0xe6f6ff,
  grass: 0x5cc46b,
  grassDark: 0x3fa652,
  earth: 0xc98a58,
  hillLight: 0xa9e3a0,
  hill: 0x8fd893,
  yellow: 0xffd23f,
  yellowDark: 0xe0a800,
  coral: 0xff6b5e,
  coralDark: 0xc2463b,
  purple: 0x7b5ea7,
  purpleSoft: 0xe7defa,
  fox: 0xf28c28,
  ink: 0x2b2340,
  white: 0xffffff,
  shadow: 0xc9d6e2,
  shadowLilac: 0xd9cfe0,
  locked: 0xd5dee8,
  lockedDark: 0xb3c0ce,
  path: 0xfff4d6,
  pathDots: 0xe0b873,
  lilacBg: 0xf3eeff,
} as const;

export const INK_CSS = '#2B2340';
