/**
 * Geometría de las zonas de pinchos: cuándo pisa Rufo los pinchos, hacia dónde rebota y con qué
 * velocidad para aterrizar fuera, y dónde se recoloca la fresa. TypeScript puro (sin Phaser) para
 * poder probarlo en Vitest; `LevelScene` solo lo llama.
 */

import { GRAVITY, JUMP_SPEED, KNOCK_VY, MAX_VELOCITY } from '../level-course';
import { RUN_SPEED, TILE, type WorldSpike } from './types';

/** Margen de perdón: la zona se recorta esto por cada lado al comprobar el contacto, en px. */
export const SPIKE_FORGIVE = 16;
/** Los pies son el cuerpo del zorro recortado esto por cada lado, en px. */
export const FOOT_INSET = 12;
/** Medio cuerpo físico del zorro (mide 56 px de ancho), en px. */
export const FOX_HALF_BODY = 28;
/** El rebote deja a Rufo con el cuerpo a esta distancia del borde de la zona, en px. */
export const REBOUND_CLEAR = 0.75 * TILE;
/** Hueco que deja la fresa al recolocarse fuera de una zona, en px. */
export const FRUIT_CLEAR = 0.25 * TILE;

/** Segundos en el aire con un impulso vertical `vy` hasta volver a la misma altura. */
export function airTime(vy: number): number {
  return (2 * vy) / GRAVITY;
}

/** Lo que recorre el zorro en horizontal con un salto normal corriendo, en px. */
export function jumpReach(): number {
  return RUN_SPEED * airTime(JUMP_SPEED);
}

/** Tramo de los pies para un cuerpo físico que empieza en `bodyX` y mide `bodyW`. */
export function footSpan(bodyX: number, bodyW: number): { from: number; to: number } {
  return { from: bodyX + FOOT_INSET, to: bodyX + bodyW - FOOT_INSET };
}

/**
 * Zona de pinchos que pisan los pies [`footFrom`, `footTo`], o `undefined`. Cada zona se recorta
 * `SPIKE_FORGIVE` px por lado: rozar el borde no cuenta.
 */
export function onSpikes(footFrom: number, footTo: number, spikes: readonly WorldSpike[]): WorldSpike | undefined {
  return spikes.find((z) => footFrom < z.x + z.width - SPIKE_FORGIVE && footTo > z.x + SPIKE_FORGIVE);
}

/** ¿Está `x` (con medio ancho `half`) tocando alguna zona, sin margen de perdón? */
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

/**
 * Velocidad horizontal del rebote (con signo) para que Rufo, saltando con `KNOCK_VY`, aterrice en
 * `reboundTarget`. Limitada por `MAX_VELOCITY.x`.
 */
export function reboundVelocity(zone: WorldSpike, side: -1 | 1, foxX: number): number {
  const distance = Math.abs(reboundTarget(zone, side) - foxX);
  return side * Math.min(distance / airTime(KNOCK_VY), MAX_VELOCITY.x);
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
