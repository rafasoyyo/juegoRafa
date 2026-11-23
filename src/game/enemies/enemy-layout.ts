/**
 * Reparto aleatorio de enemigos por nivel, en zonas seguras.
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * El recorrido se divide en «tramos libres»: lo que queda entre la salida y la bandera (con margen)
 * tras quitar cada zona a evitar (bloques «?», escalones y plataformas) ampliada por los dos lados.
 * Va como mucho un enemigo por tramo, así que entre dos enemigos hay siempre al menos una zona ampliada
 * y nunca hay uno bajo un bloque, sobre un escalón o bajo una plataforma: todos van por el suelo llano.
 */

import { BLOCK_SIZE } from '../level-course';
import type { WorldLevel } from '../levels/types';
import { BEE_DRIFT } from './enemy-motion';

export type EnemyKind = 'hedgehog' | 'bee';

/** Zona a evitar: `x` es su centro y `width` su ancho, en px. */
export interface ClearZone {
  x: number;
  width: number;
}

export interface Course {
  startX: number;
  flagX: number;
  /** Bloques «?», escalones y plataformas. */
  keepClear: readonly ClearZone[];
}

/** Recorrido de un nivel para colocar enemigos: bloques, escalones y plataformas como zonas a evitar. */
export function courseFor(world: WorldLevel): Course {
  return {
    startX: world.startX,
    flagX: world.flagX,
    keepClear: [
      ...world.blocks.map((b) => ({ x: b.x, width: BLOCK_SIZE })),
      ...world.steps.map((s) => ({ x: s.x + s.width / 2, width: s.width })),
      ...world.platforms.map((p) => ({ x: p.x + p.width / 2, width: p.width })),
    ],
  };
}

export interface Stretch {
  from: number;
  to: number;
}

/** Erizo: anda entre `minX` y `maxX` (posiciones de su centro). `phase` (0-1) es el punto inicial de la ida y vuelta. */
export interface HedgehogSpawn {
  kind: 'hedgehog';
  stretch: Stretch;
  minX: number;
  maxX: number;
  phase: number;
}

/** Abeja: vuela sobre `x`. `phase` (0-1) es el punto inicial de su ciclo de subir y bajar. */
export interface BeeSpawn {
  kind: 'bee';
  stretch: Stretch;
  x: number;
  phase: number;
}

export type EnemySpawn = HedgehogSpawn | BeeSpawn;

/** Enemigos en los niveles 1 a 6. */
export const ENEMIES_PER_LEVEL: readonly number[] = [2, 3, 4, 5, 6, 7];
/** Margen sin enemigos tras la salida. */
export const START_CLEAR = 600;
/** Margen sin enemigos antes de la bandera. */
export const FLAG_CLEAR = 400;
/** Margen sin enemigos a cada lado de una zona a evitar (bloque, escalón o plataforma). */
export const BLOCK_CLEAR = 150;
/** Tramo libre más corto en el que cabe un enemigo. */
export const MIN_STRETCH = 200;
/** Recorrido máximo de la patrulla del erizo. */
export const PATROL_MAX = 320;
/** Lo que se descuenta del tramo para que el cuerpo del enemigo no salga de él (medio cuerpo por lado). */
export const BODY_INSET = 50;
/** Nivel desde el que puede salir la abeja. */
export const BEE_FROM_LEVEL = 2;

export type Rng = () => number;

export function enemyCount(level: number): number {
  const i = Math.min(Math.max(Math.round(level), 1), ENEMIES_PER_LEVEL.length) - 1;
  return ENEMIES_PER_LEVEL[i] ?? 0;
}

/** Tramos libres del recorrido, ordenados de izquierda a derecha. */
export function freeStretches(course: Course): Stretch[] {
  const from = course.startX + START_CLEAR;
  const to = course.flagX - FLAG_CLEAR;
  const blocked = course.keepClear
    .map((b) => ({ from: b.x - b.width / 2 - BLOCK_CLEAR, to: b.x + b.width / 2 + BLOCK_CLEAR }))
    .sort((a, b) => a.from - b.from);

  const free: Stretch[] = [];
  let cursor = from;
  for (const b of blocked) {
    if (b.from > cursor) free.push({ from: cursor, to: Math.min(b.from, to) });
    cursor = Math.max(cursor, b.to);
    if (cursor >= to) break;
  }
  if (cursor < to) free.push({ from: cursor, to });
  return free.filter((s) => s.to - s.from >= MIN_STRETCH);
}

/**
 * Elige al azar los enemigos del nivel: tramos sin repetir, tipo (solo erizo en el nivel 1),
 * posición y punto de partida. Si hay menos tramos que enemigos, devuelve los que caben.
 */
export function layoutEnemies(level: number, course: Course, rng: Rng = Math.random): EnemySpawn[] {
  const stretches = freeStretches(course);
  // Fisher-Yates parcial: los primeros `count` tramos quedan elegidos al azar.
  const count = Math.min(enemyCount(level), stretches.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (stretches.length - i));
    [stretches[i], stretches[j]] = [stretches[j]!, stretches[i]!];
  }
  const chosen = stretches.slice(0, count).sort((a, b) => a.from - b.from);

  return chosen.map((stretch) => {
    const bee = level >= BEE_FROM_LEVEL && rng() < 0.5;
    const lo = stretch.from + BODY_INSET;
    const hi = stretch.to - BODY_INSET;
    if (bee) {
      // La abeja deriva a los lados: su punto central deja sitio para la deriva.
      const x = lo + BEE_DRIFT + rng() * (hi - lo - 2 * BEE_DRIFT);
      return { kind: 'bee', stretch, x, phase: rng() };
    }
    const width = Math.min(PATROL_MAX, hi - lo);
    const minX = lo + rng() * (hi - lo - width);
    return { kind: 'hedgehog', stretch, minX, maxX: minX + width, phase: rng() };
  });
}
