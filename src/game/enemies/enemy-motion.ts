/**
 * Movimiento y cajas de choque de los enemigos como funciones del tiempo (sin estado).
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * Coordenadas del mundo: y crece hacia abajo; el tiempo va en milisegundos.
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Velocidad del erizo (el zorro corre a 352 px/s). */
export const HEDGEHOG_SPEED = 60;
/** Caja de choque del erizo, más pequeña que su dibujo (~100×70) para ser tolerante. */
export const HEDGEHOG_BOX = { w: 48, h: 30 } as const;

/** Rana: ciclo de saltar en el sitio. Quieta, se agacha (aviso) y salta. */
export const FROG_PERIOD_MS = 2600;
export const FROG_SIT_MS = 1400;
export const FROG_CROUCH_MS = 450;
/** Lo que queda del ciclo, en el aire. */
export const FROG_AIR_MS = FROG_PERIOD_MS - FROG_SIT_MS - FROG_CROUCH_MS;
/** Altura del salto: en lo alto deja pasar al zorro por debajo (su cuerpo mide 87 px). */
export const FROG_JUMP_H = 210;
export const FROG_BOX = { w: 46, h: 34 } as const;

/** Cangrejo: anda de lado, más despacio que el erizo, por un tramo corto. */
export const CRAB_SPEED = 40;
export const CRAB_PATROL_MAX = 200;
export const CRAB_BOX = { w: 54, h: 30 } as const;

/** Ciclo de subir y bajar de la abeja. */
export const BEE_PERIOD_MS = 3200;
/** Centro de la abeja en su punto más alto y más bajo. */
export const BEE_TOP_Y = 430;
export const BEE_BOTTOM_Y = 585;
/** Deriva horizontal de la abeja a cada lado, con el doble de periodo. */
export const BEE_DRIFT = 30;
/** Caja de choque de la abeja, más pequeña que su dibujo (~90×80). */
export const BEE_BOX = { w: 50, h: 44 } as const;

const TAU = Math.PI * 2;

/** Parte fraccionaria siempre positiva. */
function frac(v: number): number {
  return v - Math.floor(v);
}

/**
 * Erizo: ida y vuelta (onda triangular) entre `minX` y `maxX` a velocidad constante.
 * `phase` (0-1) es el punto de partida del ciclo. `facing` es 1 hacia la derecha y −1 hacia la izquierda.
 */
export function hedgehogX(timeMs: number, patrol: { minX: number; maxX: number; phase: number }): { x: number; facing: 1 | -1 } {
  return patrolX(timeMs, patrol, HEDGEHOG_SPEED);
}

/** Cangrejo: la misma ida y vuelta que el erizo, más despacio. */
export function crabX(timeMs: number, patrol: { minX: number; maxX: number; phase: number }): { x: number; facing: 1 | -1 } {
  return patrolX(timeMs, patrol, CRAB_SPEED);
}

function patrolX(timeMs: number, patrol: { minX: number; maxX: number; phase: number }, speed: number): { x: number; facing: 1 | -1 } {
  const span = patrol.maxX - patrol.minX;
  if (span <= 0) return { x: patrol.minX, facing: 1 };
  const periodMs = ((2 * span) / speed) * 1000;
  const u = frac(timeMs / periodMs + patrol.phase);
  if (u < 0.5) return { x: patrol.minX + span * u * 2, facing: 1 };
  return { x: patrol.maxX - span * (u - 0.5) * 2, facing: -1 };
}

/** Caja de choque del cangrejo con su centro en `x`, apoyado en el suelo `groundY`. */
export function crabBox(x: number, groundY: number): Rect {
  return { x: x - CRAB_BOX.w / 2, y: groundY - CRAB_BOX.h, w: CRAB_BOX.w, h: CRAB_BOX.h };
}

export type FrogPose = 'sit' | 'crouch' | 'air';

/**
 * Rana: quieta, agachada (el aviso) o en el aire, y a qué altura sobre el suelo (parábola de
 * `FROG_JUMP_H` en lo alto). `phase` (0-1) es el punto de partida del ciclo.
 */
export function frogState(timeMs: number, frog: { phase: number }): { pose: FrogPose; height: number; crouch: number } {
  const t = frac(timeMs / FROG_PERIOD_MS + frog.phase) * FROG_PERIOD_MS;
  if (t < FROG_SIT_MS) return { pose: 'sit', height: 0, crouch: 0 };
  if (t < FROG_SIT_MS + FROG_CROUCH_MS) return { pose: 'crouch', height: 0, crouch: (t - FROG_SIT_MS) / FROG_CROUCH_MS };
  const u = (t - FROG_SIT_MS - FROG_CROUCH_MS) / FROG_AIR_MS;
  return { pose: 'air', height: 4 * FROG_JUMP_H * u * (1 - u), crouch: 0 };
}

/** Caja de choque de la rana con su centro en `x`, a `height` px sobre el suelo `groundY`. */
export function frogBox(x: number, height: number, groundY: number): Rect {
  return { x: x - FROG_BOX.w / 2, y: groundY - height - FROG_BOX.h, w: FROG_BOX.w, h: FROG_BOX.h };
}

/** Caja de choque del erizo con su centro en `x`, apoyado en el suelo `groundY`. */
export function hedgehogBox(x: number, groundY: number): Rect {
  return { x: x - HEDGEHOG_BOX.w / 2, y: groundY - HEDGEHOG_BOX.h, w: HEDGEHOG_BOX.w, h: HEDGEHOG_BOX.h };
}

/**
 * Abeja: sube y baja en senoide entre `BEE_TOP_Y` y `BEE_BOTTOM_Y` y deriva a los lados.
 * `facing` sigue el sentido de la deriva.
 */
export function beePosition(timeMs: number, bee: { x: number; phase: number }): { x: number; y: number; facing: 1 | -1 } {
  const mid = (BEE_TOP_Y + BEE_BOTTOM_Y) / 2;
  const amp = (BEE_BOTTOM_Y - BEE_TOP_Y) / 2;
  const a = TAU * (timeMs / BEE_PERIOD_MS + bee.phase);
  const d = TAU * (timeMs / (2 * BEE_PERIOD_MS) + bee.phase);
  return {
    x: bee.x + BEE_DRIFT * Math.sin(d),
    y: mid + amp * Math.sin(a),
    facing: Math.cos(d) >= 0 ? 1 : -1,
  };
}

/** Caja de choque de la abeja con su centro en (`x`, `y`). */
export function beeBox(x: number, y: number): Rect {
  return { x: x - BEE_BOX.w / 2, y: y - BEE_BOX.h / 2, w: BEE_BOX.w, h: BEE_BOX.h };
}

/**
 * Pterosaurio (`docs/MUNDO-3.md`): vuela en fila de dos o tres a la misma altura, en ondas regulares, y
 * la fila va y viene despacio sobre su tramo. Cada uno sube y baja un poco después del de delante, como
 * una ola. Abajo choca con el zorro de pie; arriba deja pasar por debajo.
 */
export const PTERO_PERIOD_MS = 3600;
export const PTERO_TOP_Y = 440;
export const PTERO_BOTTOM_Y = 570;
/** Distancia entre los pterosaurios de una fila y retraso de la ola de uno a otro (fracción del ciclo). */
export const PTERO_SPACING = 120;
export const PTERO_WAVE_LAG = 0.08;
/** Ida y vuelta de la fila a cada lado, con el doble de periodo. */
export const PTERO_DRIFT = 40;
export const PTERO_BOX = { w: 66, h: 30 } as const;

/** Pterosaurio `slot` (0..`of`−1) de una fila centrada en `x`. */
export function pteroPosition(
  timeMs: number,
  ptero: { x: number; phase: number; of: number; spacing: number; drift: number },
  slot: number,
): { x: number; y: number; facing: 1 | -1 } {
  const mid = (PTERO_TOP_Y + PTERO_BOTTOM_Y) / 2;
  const amp = (PTERO_BOTTOM_Y - PTERO_TOP_Y) / 2;
  const a = TAU * (timeMs / PTERO_PERIOD_MS + ptero.phase - slot * PTERO_WAVE_LAG);
  const d = TAU * (timeMs / (2 * PTERO_PERIOD_MS) + ptero.phase);
  return {
    x: ptero.x + (slot - (ptero.of - 1) / 2) * ptero.spacing + ptero.drift * Math.sin(d),
    y: mid + amp * Math.sin(a),
    facing: Math.cos(d) >= 0 ? 1 : -1,
  };
}

export function pteroBox(x: number, y: number): Rect {
  return { x: x - PTERO_BOX.w / 2, y: y - PTERO_BOX.h / 2, w: PTERO_BOX.w, h: PTERO_BOX.h };
}

/**
 * Volcancito: reposa, tiembla y echa humo (el aviso) y lanza una piedra grande que sube y vuelve a caer
 * en el mismo cráter, siempre en vertical. Se salta el volcán mientras la piedra está arriba.
 */
export const VOLCANO_PERIOD_MS = 3800;
export const VOLCANO_REST_MS = 1500;
export const VOLCANO_SHAKE_MS = 800;
export const VOLCANO_AIR_MS = VOLCANO_PERIOD_MS - VOLCANO_REST_MS - VOLCANO_SHAKE_MS;
/** Altura del cráter sobre el suelo y altura que alcanza la piedra sobre el cráter. */
export const VOLCANO_H = 56;
export const ROCK_RISE = 430;
export const ROCK_SIZE = 52;
export const VOLCANO_BOX = { w: 66, h: 44 } as const;

export type VolcanoPose = 'rest' | 'shake' | 'air';

/** Fase del volcancito y altura de la piedra sobre el cráter (0 dentro de él). */
export function volcanoState(timeMs: number, volcano: { phase: number }): { pose: VolcanoPose; rock: number; shake: number } {
  const t = frac(timeMs / VOLCANO_PERIOD_MS + volcano.phase) * VOLCANO_PERIOD_MS;
  if (t < VOLCANO_REST_MS) return { pose: 'rest', rock: 0, shake: 0 };
  if (t < VOLCANO_REST_MS + VOLCANO_SHAKE_MS) return { pose: 'shake', rock: 0, shake: (t - VOLCANO_REST_MS) / VOLCANO_SHAKE_MS };
  const u = (t - VOLCANO_REST_MS - VOLCANO_SHAKE_MS) / VOLCANO_AIR_MS;
  return { pose: 'air', rock: 4 * ROCK_RISE * u * (1 - u), shake: 0 };
}

/** Caja del cono del volcancito con su centro en `x`. */
export function volcanoBox(x: number, groundY: number): Rect {
  return { x: x - VOLCANO_BOX.w / 2, y: groundY - VOLCANO_BOX.h, w: VOLCANO_BOX.w, h: VOLCANO_BOX.h };
}

/** Caja de la piedra, siempre en la columna del volcán (`x`), `rock` px sobre el cráter. */
export function rockBox(x: number, rock: number, groundY: number): Rect {
  const s = ROCK_SIZE - 10;
  return { x: x - s / 2, y: groundY - VOLCANO_H - rock - s, w: s, h: s };
}

/**
 * Tiranosaurio: camina de un lado a otro de su tramo y cada pocos pasos se para a rugir. Mientras ruge
 * está quieto y se le salta por encima.
 */
export const TREX_SPEED = 55;
export const TREX_WALK_MS = 2600;
export const TREX_ROAR_MS = 1800;
export const TREX_PATROL_MAX = 360;
/** Caja del tronco y las patas: más baja que el dibujo (la cabeza queda fuera) para que se pueda saltar. */
export const TREX_BOX = { w: 120, h: 96 } as const;

export type TrexPose = 'walk' | 'roar';

export function trexState(timeMs: number, trex: { minX: number; maxX: number; phase: number }): { x: number; facing: 1 | -1; pose: TrexPose; roar: number } {
  const cycle = TREX_WALK_MS + TREX_ROAR_MS;
  const t = Math.max(0, timeMs + trex.phase * cycle);
  const k = Math.floor(t / cycle);
  const inCycle = t - k * cycle;
  const walked = k * TREX_WALK_MS + Math.min(inCycle, TREX_WALK_MS);
  const pos = patrolX(walked, { minX: trex.minX, maxX: trex.maxX, phase: 0 }, TREX_SPEED);
  if (inCycle < TREX_WALK_MS) return { ...pos, pose: 'walk', roar: 0 };
  return { ...pos, pose: 'roar', roar: (inCycle - TREX_WALK_MS) / TREX_ROAR_MS };
}

export function trexBox(x: number, groundY: number): Rect {
  return { x: x - TREX_BOX.w / 2, y: groundY - TREX_BOX.h, w: TREX_BOX.w, h: TREX_BOX.h };
}

/** Solapamiento estricto: dos cajas que solo se tocan por el borde no chocan. */
export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}
