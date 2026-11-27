/**
 * Huevo del mapa de la isla (`docs/MUNDO-3.md`, «El mapa»): hace el papel de los gajos del arcoíris. Tiene
 * 12 manchas, una por nivel, que se pintan cuando su nivel está hecho o pendiente (la misma regla que
 * `paintedBands`). Las manchas siguen un patrón: van por filas de abajo arriba y sus colores se repiten
 * en serie (turquesa, ámbar, óxido), como los grabados de la isla. TypeScript puro (sin Phaser):
 * `MapScene` lo dibuja y anima.
 */

export type SpotColor = 'turquoise' | 'amber' | 'rust';

/** Orden de los colores de la serie. */
export const SPOT_SERIES: readonly SpotColor[] = ['turquoise', 'amber', 'rust'];

/** Ancho del huevo respecto a su alto. */
export const EGG_ASPECT = 0.76;

export interface EggSpot {
  /** Centro, en fracciones del alto del huevo, desde su centro (la `y` hacia abajo). */
  x: number;
  y: number;
  /** Radio, en fracciones del alto del huevo. */
  r: number;
  color: SpotColor;
}

/** Filas de abajo arriba: altura y posiciones; cada fila se estrecha como el huevo. */
const ROWS: readonly { y: number; xs: readonly number[]; r: number }[] = [
  { y: 0.28, xs: [-0.21, -0.07, 0.07, 0.21], r: 0.055 },
  { y: 0.07, xs: [-0.25, -0.085, 0.085, 0.25], r: 0.06 },
  { y: -0.15, xs: [-0.2, -0.067, 0.067, 0.2], r: 0.052 },
];

/** Las 12 manchas, en el orden en que se pintan (la del nivel 1 primero). */
export const EGG_SPOTS: readonly EggSpot[] = ROWS.flatMap((row) => row.xs.map((x) => ({ x, y: row.y, r: row.r }))).map((s, i) => ({
  ...s,
  color: SPOT_SERIES[i % SPOT_SERIES.length]!,
}));

/** Mancha del nivel `level` (1 a 12); `undefined` fuera de rango. */
export function eggSpot(level: number): EggSpot | undefined {
  return EGG_SPOTS[level - 1];
}

/** ¿Está el punto (x, y), en fracciones del alto, dentro del huevo? Más ancho abajo que arriba. */
export function insideEgg(x: number, y: number): boolean {
  const halfW = EGG_ASPECT / 2;
  // Óvalo de huevo: la mitad de arriba algo más estrecha.
  const w = y < 0 ? halfW * (1 - 0.18 * (-y / 0.5)) : halfW;
  return (x / w) ** 2 + (y / 0.5) ** 2 <= 1;
}
