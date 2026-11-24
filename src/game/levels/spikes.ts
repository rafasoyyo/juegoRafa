/**
 * Geometría de las zonas de pinchos, que son fosos hundidos bajo el suelo: tramos de suelo firme,
 * cuándo está Rufo dentro del foso, cómo le recoloca el borde, hacia dónde rebota y con qué velocidad
 * para aterrizar fuera, y dónde se recoloca la fresa. TypeScript puro (sin Phaser) para poder probarlo
 * en Vitest; `LevelScene`, `BootScene` y `widgets.ts` solo lo llaman.
 */

import { GRAVITY, GROUND_TOP, JUMP_SPEED, KNOCK_VY, MAX_VELOCITY } from '../level-course';
import { RUN_SPEED, TILE, type WorldSpike } from './types';

/** Hondura del foso desde la línea del suelo hasta su fondo, en px. */
export const PIT_DEPTH = 64;
/** Las puntas de los pinchos quedan esto por debajo de la línea del suelo, en px. */
export const PIT_TIP = 22;
/** Radio de las esquinas redondeadas del suelo en el borde del foso, en px. */
export const PIT_LIP_RADIUS = 10;
/** Alto de un cono de pincho y de la placa con remaches en la que se apoya, en px. */
export const SPIKE_CONE_H = 33;
export const SPIKE_PLATE_H = 9;
/** Conos de pincho por baldosa. */
export const CONES_PER_TILE = 3;
/** Si Rufo se para en el borde con menos de esto del pie sobre el suelo firme, se recoloca, en px. */
export const LIP_MIN_FOOT = 12;

/** Acero de los pinchos, igual en todos los ambientes: cara de luz, cara media y cara de sombra. */
export const STEEL = { light: 0xe6ecf3, mid: 0xb4bfcc, dark: 0x7f8c9d } as const;

/** Los pies son el cuerpo del zorro recortado esto por cada lado, en px. */
export const FOOT_INSET = 12;
/** Medio cuerpo físico del zorro (mide 56 px de ancho), en px. */
export const FOX_HALF_BODY = 28;
/** El rebote deja a Rufo con el cuerpo a esta distancia del borde de la zona, en px. */
export const REBOUND_CLEAR = 0.75 * TILE;
/** Hueco que deja la fresa al recolocarse fuera de una zona, en px. */
export const FRUIT_CLEAR = 0.25 * TILE;

/** Tramo horizontal [`from`, `to`) del mundo, en px. */
export interface Span {
  from: number;
  to: number;
}

/** Segundos en el aire con un impulso vertical `vy` hasta volver a la misma altura. */
export function airTime(vy: number): number {
  return (2 * vy) / GRAVITY;
}

/**
 * Segundos en el aire con un impulso vertical `vy` hasta aterrizar `rise` px por encima del despegue
 * (en la bajada). Con `rise` 0 es `airTime`.
 */
export function airTimeUp(vy: number, rise: number): number {
  return (vy + Math.sqrt(vy * vy - 2 * GRAVITY * rise)) / GRAVITY;
}

/** Lo que recorre el zorro en horizontal con un salto normal corriendo, en px. */
export function jumpReach(): number {
  return RUN_SPEED * airTime(JUMP_SPEED);
}

/** Tramo de los pies para un cuerpo físico que empieza en `bodyX` y mide `bodyW`. */
export function footSpan(bodyX: number, bodyW: number): Span {
  return { from: bodyX + FOOT_INSET, to: bodyX + bodyW - FOOT_INSET };
}

/** Tramos de suelo firme de un mundo de ancho `worldW`: todo salvo las zonas de pinchos, en orden. */
export function groundSpans(worldW: number, spikes: readonly WorldSpike[]): Span[] {
  const spans: Span[] = [];
  let from = 0;
  for (const z of [...spikes].sort((a, b) => a.x - b.x)) {
    if (z.x > from) spans.push({ from, to: z.x });
    from = Math.max(from, z.x + z.width);
  }
  if (from < worldW) spans.push({ from, to: worldW });
  return spans;
}

/**
 * Foso en el que está Rufo apoyado, o `undefined`. Solo se puede apoyar por debajo del suelo en el
 * fondo de un foso, sobre las puntas: estar ahí es tocar los pinchos. `bodyBottom` es la base de su
 * cuerpo físico y `foxX` su centro.
 */
export function pitUnder(bodyBottom: number, foxX: number, spikes: readonly WorldSpike[]): WorldSpike | undefined {
  if (bodyBottom <= GROUND_TOP + 2) return undefined;
  return spikes.find((z) => foxX >= z.x && foxX <= z.x + z.width);
}

/**
 * Hacia dónde recolocar a Rufo apoyado en el suelo junto al borde de un foso (−1 izquierda, 1 derecha):
 * hacia el suelo firme si le quedan menos de `LIP_MIN_FOOT` px del pie sobre él. Si no, 0. Nunca hacia
 * los pinchos.
 */
export function lipNudge(bodyX: number, bodyW: number, spikes: readonly WorldSpike[]): -1 | 0 | 1 {
  const right = bodyX + bodyW;
  const feet = footSpan(bodyX, bodyW);
  for (const z of spikes) {
    const end = z.x + z.width;
    // Borde izquierdo del foso: el suelo firme queda a la izquierda.
    if (bodyX < z.x && right > z.x && z.x - feet.from < LIP_MIN_FOOT) return -1;
    // Borde derecho: el suelo firme queda a la derecha.
    if (bodyX < end && right > end && feet.to - end < LIP_MIN_FOOT) return 1;
  }
  return 0;
}

/** ¿Está `x` (con medio ancho `half`) tocando alguna zona, sin margen? */
function touching(x: number, half: number, spikes: readonly WorldSpike[]): WorldSpike | undefined {
  return spikes.find((z) => x + half > z.x && x - half < z.x + z.width);
}

/**
 * Lado (−1 izquierda, 1 derecha) hacia el que rebota Rufo: por donde entró, que es el lado del último
 * suelo seguro que pisó (`lastSafeX`). Sin él, hacia el borde más cercano a `foxX`.
 */
export function exitSide(zone: WorldSpike, lastSafeX: number | undefined, foxX: number): -1 | 1 {
  const center = zone.x + zone.width / 2;
  const ref = lastSafeX !== undefined && Number.isFinite(lastSafeX) && lastSafeX !== center ? lastSafeX : foxX;
  return ref < center ? -1 : 1;
}

/** `x` del centro de Rufo al aterrizar tras rebotar hacia `side`: fuera de la zona, junto a su borde. */
export function reboundTarget(zone: WorldSpike, side: -1 | 1): number {
  return side < 0 ? zone.x - REBOUND_CLEAR - FOX_HALF_BODY : zone.x + zone.width + REBOUND_CLEAR + FOX_HALF_BODY;
}

/** Segundos del rebote: despega desde el fondo (`PIT_TIP` bajo el suelo) y aterriza en el suelo. */
export function reboundAirTime(): number {
  return airTimeUp(KNOCK_VY, PIT_TIP);
}

/**
 * Velocidad horizontal del rebote (con signo) para que Rufo, saltando con `KNOCK_VY` desde el fondo del
 * foso, aterrice en `reboundTarget`. Limitada por `MAX_VELOCITY.x`.
 */
export function reboundVelocity(zone: WorldSpike, side: -1 | 1, foxX: number): number {
  const distance = Math.abs(reboundTarget(zone, side) - foxX);
  return side * Math.min(distance / reboundAirTime(), MAX_VELOCITY.x);
}

/**
 * Si algo centrado en `x` y de medio ancho `half` (la fresa) está sobre una zona, lo lleva fuera por el
 * borde más cercano; si no, devuelve `x` igual.
 */
export function nudgeOffSpikes(x: number, spikes: readonly WorldSpike[], half = 0): number {
  const zone = touching(x, half, spikes);
  if (!zone) return x;
  const center = zone.x + zone.width / 2;
  return x < center ? zone.x - half - FRUIT_CLEAR : zone.x + zone.width + half + FRUIT_CLEAR;
}
