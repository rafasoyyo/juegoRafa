/**
 * Arcoíris del horizonte de los niveles: la meta lejana de «El camino del arcoíris» (`docs/MUNDO-1.md`).
 * Crece de un nivel al siguiente y en el 12 es el mayor, el del escenario de nubes, con Rufo corriendo
 * bajo el arco. TypeScript puro (sin Phaser): `addScenery` lo dibuja con la textura `decor-rainbow`.
 *
 * Todas las medidas van en píxeles lógicos (alto fijo de 720 y ancho de la vista entre 960 y 1680).
 */

import type { Ambient } from './ambients';
import { GROUND_TOP } from './types';

/** Opacidad normal del arcoíris: más apagado que el recorrido, como la decoración. */
export const RAINBOW_ALPHA = 0.75;

/** Último nivel del mundo: el del escenario de nubes. */
const LAST_LEVEL = 12;
/** Ancho exterior del arco en el nivel 1 (pequeño, casi en el horizonte) y en el 11 (medio cielo). */
const FIRST_WIDTH = 180;
const ELEVENTH_WIDTH = 640;
/** Ancho del arco del nivel 12: el mayor de todos, Rufo corre bajo él, y aún cabe entero bajo el borde de arriba. */
const LAST_WIDTH = 1000;
/** Centro del arco a la salida, en fracción de la vista: a la derecha, hacia donde corre Rufo. */
const START_X = 0.78;
/** En el 12 el arco es tan ancho que ya cubre la pantalla: va más centrado. */
const LAST_START_X = 0.6;
/** Cuánto se desplaza el arco por la pantalla de la salida a la bandera, en fracción de la vista. */
const DRIFT = 0.3;
/** Base del arco sobre el suelo: justo detrás de la cresta de las colinas lejanas, que esconden sus patas. */
const BASE_ABOVE_GROUND = 90;

export interface HorizonRainbow {
  /** Ancho exterior del arco. */
  width: number;
  /** Centro horizontal del arco en el mundo (con `scrollFactor`, a la salida es su `x` en la pantalla). */
  x: number;
  /** `y` de la base del arco. */
  bottom: number;
  alpha: number;
  /** Paralaje horizontal: de la salida a la bandera el arco se desplaza `DRIFT` vistas hacia la izquierda. */
  scrollFactor: number;
}

/**
 * Arcoíris del nivel `level` (1..12; fuera de rango, el más cercano) con su ambiente, el ancho de la
 * vista `viewW` y el ancho del mundo `worldW`.
 */
export function horizonRainbow(level: number, ambient: Ambient, viewW: number, worldW: number): HorizonRainbow {
  const n = Math.min(Math.max(Math.round(level), 1), LAST_LEVEL);
  const last = n === LAST_LEVEL;
  const width = last ? LAST_WIDTH : FIRST_WIDTH + ((ELEVENTH_WIDTH - FIRST_WIDTH) * (n - 1)) / (LAST_LEVEL - 2);
  const scroll = Math.max(0, worldW - viewW);
  return {
    width,
    x: viewW * (last ? LAST_START_X : START_X),
    bottom: GROUND_TOP - BASE_ABOVE_GROUND,
    alpha: ambient.rainbowAlpha ?? RAINBOW_ALPHA,
    scrollFactor: scroll > 0 ? (DRIFT * viewW) / scroll : 0,
  };
}
