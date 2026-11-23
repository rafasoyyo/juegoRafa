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
  const span = patrol.maxX - patrol.minX;
  if (span <= 0) return { x: patrol.minX, facing: 1 };
  const periodMs = ((2 * span) / HEDGEHOG_SPEED) * 1000;
  const u = frac(timeMs / periodMs + patrol.phase);
  if (u < 0.5) return { x: patrol.minX + span * u * 2, facing: 1 };
  return { x: patrol.maxX - span * (u - 0.5) * 2, facing: -1 };
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
