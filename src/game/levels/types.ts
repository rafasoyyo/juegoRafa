/**
 * Formato de los recorridos (`content/levels/nivel-N.json`) y su geometría.
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * En el JSON las posiciones van en baldosas de 84 px (el tamaño de un bloque «?»), contadas desde el
 * inicio del mundo, para poder editarlo a mano. En el mundo, `y` crece hacia abajo y las alturas se
 * dan en píxeles sobre el suelo (`GROUND_TOP`).
 */

import { BLOCK_SIZE, GROUND_TOP, SCALE } from '../level-course';

/** Una baldosa: el tamaño de un bloque «?». */
export const TILE = BLOCK_SIZE;
/** Un peldaño de escalón: 0,75 baldosas. */
export const STEP_RISE = 63;
/** Altura de la base de un bloque «?» sobre la superficie que tiene debajo. */
export const ROW_BASE = { low: 141, high: 198 } as const;
/** Salida del zorro, en baldosas desde el inicio del mundo. */
export const START_TILE = 6;
/** Distancia de la bandera al final del mundo, en baldosas. */
export const FLAG_TILES_FROM_END = 4;
/** Velocidad de carrera del zorro (también en el aire), en px/s. */
export const RUN_SPEED = 110 * SCALE;

export { GROUND_TOP };

export const AMBIENT_IDS = ['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche', 'playa', 'selva', 'montana', 'nieve', 'desierto', 'nubes'] as const;
export type AmbientId = (typeof AMBIENT_IDS)[number];

export type BlockRow = keyof typeof ROW_BASE;
export const BLOCK_ROWS = Object.keys(ROW_BASE) as BlockRow[];

export const SURFACE_KINDS = ['ground', 'step', 'platform'] as const;
export type SurfaceKind = (typeof SURFACE_KINDS)[number];

/** Tramo de suelo elevado: `x` es su borde izquierdo y `height` va en peldaños (1 o 2). */
export interface StepData {
  x: number;
  width: number;
  height: number;
}

/** Plataforma de un solo sentido: `height` es la altura de su cara superior sobre la superficie de debajo, en baldosas. */
export interface PlatformData {
  x: number;
  width: number;
  height: number;
}

/**
 * Bloque «?»: `x` es su centro. Se apoya en la superficie que tiene debajo de su centro; `on` es solo
 * documentación y la validación comprueba que coincide.
 */
export interface BlockData {
  x: number;
  row: BlockRow;
  on?: SurfaceKind;
}

/** Zona de pinchos en el suelo: `x` es su borde izquierdo y `width` su ancho, en baldosas. */
export interface SpikeData {
  x: number;
  width: number;
}

/** Un nivel tal como está en el JSON (en baldosas), con su nombre para los mensajes de error. */
export interface LevelData {
  id: string;
  ambient: AmbientId;
  /** Longitud del mundo en baldosas, salida y zona de bandera incluidas. */
  length: number;
  steps: StepData[];
  platforms: PlatformData[];
  blocks: BlockData[];
  /** Zonas de pinchos (opcional en el JSON: si falta, no hay ninguna). */
  spikes: SpikeData[];
}

/** Escalón en el mundo: `x` es el borde izquierdo, `height` px sobre el suelo y `top` la `y` de su cara superior. */
export interface WorldStep {
  index: number;
  x: number;
  width: number;
  height: number;
  top: number;
}

/** Plataforma en el mundo: `base` es la altura (px sobre el suelo) de la superficie que tiene debajo. */
export interface WorldPlatform {
  index: number;
  x: number;
  width: number;
  height: number;
  top: number;
  base: number;
}

/** Bloque en el mundo: `x` es el centro y `bottom` la `y` de su base. */
export interface WorldBlock {
  index: number;
  x: number;
  bottom: number;
  row: BlockRow;
  surface: SurfaceKind;
  /** Altura (px sobre el suelo) de la superficie sobre la que está. */
  surfaceHeight: number;
}

/** Zona de pinchos en el mundo: `x` es el borde izquierdo y `width` su ancho, en px. */
export interface WorldSpike {
  index: number;
  x: number;
  width: number;
}

/** Un nivel listo para construir la escena, en píxeles del mundo. */
export interface WorldLevel {
  id: string;
  ambient: AmbientId;
  width: number;
  startX: number;
  flagX: number;
  steps: WorldStep[];
  platforms: WorldPlatform[];
  blocks: WorldBlock[];
  spikes: WorldSpike[];
}

/** `y` del mundo de algo que está `height` px sobre el suelo. */
export function yAbove(height: number): number {
  return GROUND_TOP - height;
}
