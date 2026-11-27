/**
 * Reparto aleatorio de enemigos por nivel, en zonas seguras.
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * El recorrido se divide en «tramos libres»: lo que queda entre la salida y la bandera (con margen)
 * tras quitar cada zona a evitar (bloques «?», escalones, plataformas y pinchos) ampliada por los dos lados.
 * Va como mucho un enemigo por tramo, así que entre dos enemigos hay siempre al menos una zona ampliada
 * y nunca hay uno bajo un bloque, sobre un escalón o bajo una plataforma: todos van por el suelo llano.
 */

import { BLOCK_SIZE } from '../level-course';
import { challengeZone, TILE, type WorldLevel } from '../levels/types';
import { BEE_DRIFT, CRAB_PATROL_MAX, PTERO_DRIFT, PTERO_SPACING, TREX_PATROL_MAX } from './enemy-motion';

/**
 * Tipos de enemigo. Cada uno tiene una entrada en `SPAWNERS` y `REACH` (aquí) y en `ENEMY_VIEWS`
 * (`enemy-views.ts`); si falta alguna, la compilación falla (spec `world-isolation`).
 */
export const ENEMY_KINDS = ['hedgehog', 'bee', 'frog', 'crab', 'ptero', 'volcano', 'trex'] as const;
export type EnemyKind = (typeof ENEMY_KINDS)[number];

/** Contador a cero de cada tipo de enemigo. */
export function emptyEnemyCounts(): Record<EnemyKind, number> {
  return Object.fromEntries(ENEMY_KINDS.map((k) => [k, 0])) as Record<EnemyKind, number>;
}

/** Zona a evitar: `x` es su centro y `width` su ancho, en px. */
export interface ClearZone {
  x: number;
  width: number;
}

export interface Course {
  startX: number;
  flagX: number;
  /** Bloques «?», escalones, plataformas y zonas de pinchos. */
  keepClear: readonly ClearZone[];
}

/** Recorrido de un nivel para colocar enemigos: bloques, escalones, plataformas y pinchos como zonas a evitar. */
export function courseFor(world: WorldLevel): Course {
  return {
    startX: world.startX,
    flagX: world.flagX,
    keepClear: [
      ...world.blocks.map((b) => ({ x: b.x, width: BLOCK_SIZE })),
      ...world.steps.map((s) => ({ x: s.x + s.width / 2, width: s.width })),
      ...world.platforms.map((p) => ({ x: p.x + p.width / 2, width: p.width })),
      ...world.spikes.map((z) => ({ x: z.x + z.width / 2, width: z.width })),
      // Los retos se piensan con calma: ningún enemigo en su zona.
      ...world.challenges.map((c) => {
        const zone = challengeZone({ kind: c.kind, x: c.x / TILE });
        return { x: ((zone.from + zone.to) / 2) * TILE, width: (zone.to - zone.from) * TILE };
      }),
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

/** Rana: salta en el sitio sobre `x`. `phase` (0-1) es el punto inicial de su ciclo. */
export interface FrogSpawn {
  kind: 'frog';
  stretch: Stretch;
  x: number;
  phase: number;
}

/** Cangrejo: anda de lado entre `minX` y `maxX`, como el erizo pero más despacio y menos trecho. */
export interface CrabSpawn {
  kind: 'crab';
  stretch: Stretch;
  minX: number;
  maxX: number;
  phase: number;
}

/** Fila de `of` pterosaurios (2 o 3) centrada en `x`: cuenta como un enemigo y ocupa un tramo. */
export interface PteroSpawn {
  kind: 'ptero';
  stretch: Stretch;
  x: number;
  phase: number;
  of: number;
  /** Distancia entre uno y otro y vaivén de la fila a cada lado: los de `enemy-motion` o menos si el tramo es corto. */
  spacing: number;
  drift: number;
}

/** Volcancito en `x`: su piedra sube y baja siempre en esa columna. */
export interface VolcanoSpawn {
  kind: 'volcano';
  stretch: Stretch;
  x: number;
  phase: number;
}

/** Tiranosaurio: camina entre `minX` y `maxX` (su centro) y se para a rugir. */
export interface TrexSpawn {
  kind: 'trex';
  stretch: Stretch;
  minX: number;
  maxX: number;
  phase: number;
}

export type EnemySpawn = HedgehogSpawn | BeeSpawn | FrogSpawn | CrabSpawn | PteroSpawn | VolcanoSpawn | TrexSpawn;
/** El `EnemySpawn` del tipo `K`. */
export type SpawnOf<K extends EnemyKind> = Extract<EnemySpawn, { kind: K }>;

/** Enemigos de un mundo (los fija su definición en `src/game/worlds/`). */
export interface EnemyRules {
  /** Enemigos de cada nivel (`perLevel[0]` es el nivel 1). */
  perLevel: readonly number[];
  /**
   * Tipos que pueden salir y desde qué nivel. Cada enemigo elige al azar entre los que ya han llegado,
   * con la misma probabilidad.
   */
  kinds: readonly { kind: EnemyKind; fromLevel: number }[];
}

/** Margen sin enemigos tras la salida. */
export const START_CLEAR = 600;
/** Margen sin enemigos antes de la bandera. */
export const FLAG_CLEAR = 400;
/** Margen sin enemigos a cada lado de una zona a evitar (bloque, escalón, plataforma o pinchos). */
export const BLOCK_CLEAR = 150;
/** Tramo libre más corto en el que cabe un enemigo. */
export const MIN_STRETCH = 200;
/** Tipos que pueden salir en el nivel `level`, en el orden de las reglas. */
export function kindsAt(rules: EnemyRules, level: number): EnemyKind[] {
  return rules.kinds.filter((k) => level >= k.fromLevel).map((k) => k.kind);
}

/** Recorrido máximo de la patrulla del erizo. */
export const PATROL_MAX = 320;
/** Lo que se descuenta del tramo para que el cuerpo del enemigo no salga de él (medio cuerpo por lado). */
export const BODY_INSET = 50;
/** El tiranosaurio es más largo: medio cuerpo (con la cabeza y la cola) por lado. */
export const TREX_INSET = 140;

export type Rng = () => number;

/**
 * Intervalo que puede ocupar el centro del enemigo (o de cualquiera de una fila de pterosaurios) en
 * algún momento, y su medio cuerpo.
 */
export function spawnReach(e: EnemySpawn): Reach {
  return (REACH[e.kind] as (e: EnemySpawn) => Reach)(e);
}

type Reach = { from: number; to: number; half: number };

const PATROL_REACH = (e: { minX: number; maxX: number }): Reach => ({ from: e.minX, to: e.maxX, half: BODY_INSET });
const STILL_REACH = (e: { x: number }): Reach => ({ from: e.x, to: e.x, half: BODY_INSET });

/** Alcance de cada tipo de enemigo. */
const REACH: { readonly [K in EnemyKind]: (e: SpawnOf<K>) => Reach } = {
  hedgehog: PATROL_REACH,
  crab: PATROL_REACH,
  trex: (e) => ({ from: e.minX, to: e.maxX, half: TREX_INSET }),
  frog: STILL_REACH,
  volcano: STILL_REACH,
  bee: (e) => ({ from: e.x - BEE_DRIFT, to: e.x + BEE_DRIFT, half: BODY_INSET }),
  ptero: (e) => {
    const half = ((e.of - 1) * e.spacing) / 2 + e.drift;
    return { from: e.x - half, to: e.x + half, half: BODY_INSET };
  },
};

/** Enemigos del nivel `level`; fuera de rango, los del más cercano. */
export function enemyCount(rules: EnemyRules, level: number): number {
  const i = Math.min(Math.max(Math.round(level), 1), rules.perLevel.length) - 1;
  return rules.perLevel[i] ?? 0;
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
 * Elige al azar los enemigos del nivel según las reglas del mundo: tramos sin repetir, tipo (entre los
 * que ya han llegado en ese nivel), posición y punto de partida. Si hay menos tramos que enemigos,
 * devuelve los que caben.
 */
export function layoutEnemies(rules: EnemyRules, level: number, course: Course, rng: Rng = Math.random): EnemySpawn[] {
  const stretches = freeStretches(course);
  // Fisher-Yates parcial: los primeros `count` tramos quedan elegidos al azar.
  const count = Math.min(enemyCount(rules, level), stretches.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (stretches.length - i));
    [stretches[i], stretches[j]] = [stretches[j]!, stretches[i]!];
  }
  const chosen = stretches.slice(0, count).sort((a, b) => a.from - b.from);

  const kinds = kindsAt(rules, level);
  return chosen.map((stretch): EnemySpawn => {
    // Con un solo tipo no se gasta azar (así el reparto de un mundo no cambia al añadir tipos a otro).
    const kind = kinds.length > 1 ? kinds[Math.floor(rng() * kinds.length)]! : (kinds[0] ?? 'hedgehog');
    return (SPAWNERS[kind] as Spawner<EnemyKind>)(stretch, stretch.from + BODY_INSET, stretch.to - BODY_INSET, rng);
  });
}

/** Coloca un enemigo del tipo `K` en el tramo `stretch`; `lo` y `hi` dejan medio cuerpo a cada lado. */
type Spawner<K extends EnemyKind> = (stretch: Stretch, lo: number, hi: number, rng: Rng) => SpawnOf<K>;

/** Patrulla de como mucho `max` px dentro de [`lo`, `hi`]. */
function patrol(lo: number, hi: number, max: number, rng: Rng): { minX: number; maxX: number } {
  const width = Math.min(max, hi - lo);
  const minX = lo + rng() * (hi - lo - width);
  return { minX, maxX: minX + width };
}

/**
 * Colocación de cada tipo de enemigo. El orden de las llamadas a `rng` de cada uno no debe cambiar: con
 * la misma semilla sale el mismo reparto.
 */
const SPAWNERS: { readonly [K in EnemyKind]: Spawner<K> } = {
  hedgehog: (stretch, lo, hi, rng) => ({ kind: 'hedgehog', stretch, ...patrol(lo, hi, PATROL_MAX, rng), phase: rng() }),
  crab: (stretch, lo, hi, rng) => ({ kind: 'crab', stretch, ...patrol(lo, hi, CRAB_PATROL_MAX, rng), phase: rng() }),
  trex: (stretch, _lo, _hi, rng) => {
    const tlo = stretch.from + TREX_INSET;
    const thi = Math.max(tlo, stretch.to - TREX_INSET);
    return { kind: 'trex', stretch, ...patrol(tlo, thi, TREX_PATROL_MAX, rng), phase: rng() };
  },
  frog: (stretch, lo, hi, rng) => ({ kind: 'frog', stretch, x: lo + rng() * (hi - lo), phase: rng() }),
  volcano: (stretch, lo, hi, rng) => ({ kind: 'volcano', stretch, x: lo + rng() * (hi - lo), phase: rng() }),
  // La abeja deriva a los lados: su punto central deja sitio para la deriva.
  bee: (stretch, lo, hi, rng) => ({ kind: 'bee', stretch, x: lo + BEE_DRIFT + rng() * (hi - lo - 2 * BEE_DRIFT), phase: rng() }),
  ptero: (stretch, lo, hi, rng) => {
    // Fila de tres si cabe con su vaivén; si no, de dos, más juntos y con menos vaivén si hace falta.
    const room = hi - lo;
    const of = room >= 2 * PTERO_SPACING + 2 * PTERO_DRIFT && rng() < 0.5 ? 3 : 2;
    const spacing = Math.min(PTERO_SPACING, room / (of - 1));
    const drift = Math.max(0, Math.min(PTERO_DRIFT, (room - (of - 1) * spacing) / 2));
    const half = ((of - 1) * spacing) / 2 + drift;
    const x = lo + half + rng() * Math.max(0, room - 2 * half);
    return { kind: 'ptero', stretch, x, phase: rng(), of, spacing, drift };
  },
};
