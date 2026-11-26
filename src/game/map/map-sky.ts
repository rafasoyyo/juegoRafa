/**
 * Cielo del mapa que cambia a lo ancho (`WorldMap.skyline`): en cada parada, el paisaje de un ambiente
 * (su cielo arriba y, bajo el horizonte, su tierra, de las colinas lejanas al suelo); entre dos
 * paradas, la mezcla de los dos. TypeScript puro (sin Phaser): `MapScene` lo pinta
 * en una textura pequeña que estira a lo ancho del camino.
 */

import { AMBIENTS } from '../levels/ambients';
import type { AmbientId } from '../levels/types';

/** Parada del cielo: `x` en el artboard del mapa, cielo del ambiente `ambient`. */
export interface SkyStop {
  x: number;
  ambient: AmbientId;
}

export type Rgb = readonly [number, number, number];

function parseHex(css: string): Rgb {
  const n = parseInt(css.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Color del degradado vertical de un ambiente a la altura `v` (0 arriba, 1 abajo). */
export function ambientSkyAt(ambient: AmbientId, v: number): Rgb {
  const stops = AMBIENTS[ambient].sky;
  const first = stops[0]!;
  if (v <= first[0]) return parseHex(first[1]);
  for (let i = 1; i < stops.length; i++) {
    const [at, color] = stops[i]!;
    const [prevAt, prevColor] = stops[i - 1]!;
    if (v <= at) return mix(parseHex(prevColor), parseHex(color), at > prevAt ? (v - prevAt) / (at - prevAt) : 1);
  }
  return parseHex(stops[stops.length - 1]![1]);
}

/** Altura del horizonte (de 0 arriba a 1 abajo) y ancho del fundido entre cielo y tierra. */
export const HORIZON = 0.56;
const HORIZON_BLEND = 0.04;

function hexRgb(n: number): Rgb {
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Color del paisaje de un ambiente a la altura `v`: su cielo sobre el horizonte y su tierra debajo. */
export function ambientViewAt(ambient: AmbientId, v: number): Rgb {
  const a = AMBIENTS[ambient];
  const sky = (y: number): Rgb => ambientSkyAt(ambient, Math.min(1, y / HORIZON));
  const land = (y: number): Rgb => mix(hexRgb(a.hillLight), hexRgb(a.grass), Math.max(0, Math.min(1, (y - HORIZON) / (1 - HORIZON))));
  const lo = HORIZON - HORIZON_BLEND / 2;
  const hi = HORIZON + HORIZON_BLEND / 2;
  if (v <= lo) return sky(v);
  if (v >= hi) return land(v);
  return mix(sky(lo), land(hi), (v - lo) / (hi - lo));
}

/**
 * Color del mapa en el punto (`x`, `v`): `x` en el artboard y `v` de 0 (arriba) a 1 (abajo).
 * Antes de la primera parada y después de la última, el paisaje de la parada del extremo.
 */
export function skyColorAt(skyline: readonly SkyStop[], x: number, v: number): Rgb {
  const first = skyline[0];
  if (!first) return [255, 255, 255];
  if (x <= first.x) return ambientViewAt(first.ambient, v);
  for (let i = 1; i < skyline.length; i++) {
    const stop = skyline[i]!;
    const prev = skyline[i - 1]!;
    if (x <= stop.x) {
      const t = stop.x > prev.x ? (x - prev.x) / (stop.x - prev.x) : 1;
      return mix(ambientViewAt(prev.ambient, v), ambientViewAt(stop.ambient, v), t);
    }
  }
  return ambientViewAt(skyline[skyline.length - 1]!.ambient, v);
}
