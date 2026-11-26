/**
 * Formato de los recorridos (`content/levels/<mundo>/nivel-N.json`) y su geometría.
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

/** Mecánicas de reto del recorrido (`docs/MUNDO-2.md`): A, «Bloques que cuentan», y B, «El puente de los números». */
export const CHALLENGE_KINDS = ['count', 'bridge'] as const;
export type ChallengeKind = (typeof CHALLENGE_KINDS)[number];
export const QUANTITY_SHOWS = ['dots', 'tenframe'] as const;
export type QuantityShowId = (typeof QUANTITY_SHOWS)[number];

/**
 * Reto del recorrido, siempre sobre el suelo. En `count`, `x` es el centro del bloque central y ocupa de
 * `x + CHALLENGE_ZONE.from` (cartel) a `x + CHALLENGE_ZONE.to` (compuerta). En `bridge`, `x` es el borde
 * izquierdo del puente. Su zona la da `challengeZone`.
 */
export interface ChallengeData {
  kind: ChallengeKind;
  x: number;
  /** Cómo se muestra la cantidad (los pequeños siempre ven puntos y los mayores, marcos). */
  show: QuantityShowId;
  /** Al revés: el cartel lleva la cifra y los bloques, la cantidad. */
  reverse: boolean;
  /** Lalo hace la demostración en este reto; no cuenta para las estrellas. */
  demo: boolean;
}

/** Geometría de un reto respecto a su `x`, en baldosas. */
export const CHALLENGE_ZONE = { from: -6, to: 4 } as const;
export const CHALLENGE_SIGN_X = -4.5;
export const CHALLENGE_BLOCK_XS = [-1.5, 0, 1.5] as const;
export const CHALLENGE_GATE_X = 3;

/** Puente: tramos de 3,5 baldosas (más de lo que alcanza un salto, también desde un bloque). */
export const BRIDGE_SECTION = 3.5;
export const BRIDGE_SECTIONS = 5;
/** Margen de suelo llano a cada lado del puente, en baldosas. */
export const BRIDGE_MARGIN = 1;
/** Centros de los bloques del puente respecto al borde izquierdo del hueco, en baldosas. */
export const BRIDGE_BLOCK_XS = [-4.5, -3, -1.5] as const;

/** Tramo que ocupa un reto, en baldosas. */
export function challengeZone(c: { kind: ChallengeKind; x: number }): { from: number; to: number } {
  if (c.kind === 'bridge') return { from: c.x - BRIDGE_MARGIN, to: c.x + BRIDGE_SECTIONS * BRIDGE_SECTION + BRIDGE_MARGIN };
  return { from: c.x + CHALLENGE_ZONE.from, to: c.x + CHALLENGE_ZONE.to };
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
  /** Retos del recorrido (opcional en el JSON). */
  challenges: ChallengeData[];
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
  /** Retos con `x` (centro del bloque central) en px. */
  challenges: (ChallengeData & { index: number })[];
}

/** `y` del mundo de algo que está `height` px sobre el suelo. */
export function yAbove(height: number): number {
  return GROUND_TOP - height;
}
