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

/** Solapamiento estricto: dos cajas que solo se tocan por el borde no chocan. */
export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}
