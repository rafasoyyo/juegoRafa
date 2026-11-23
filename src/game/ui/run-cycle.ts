/**
 * Cinemática de la carrera del zorro: zancadas que se aceleran hasta formar una rueda borrosa.
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * Todo va en unidades del zorro (caja de 120), con el origen en el centro de la base de los pies,
 * «delante» hacia +x e y creciendo hacia abajo (y = 0 es el suelo).
 */

/** Tiempo de corrida en el suelo para pasar de zancada lenta (0) a rueda (1). */
export const RAMP_MS = 400;
/** Ciclos de zancada por segundo con intensidad 0 y 1. */
export const MIN_HZ = 3;
export const MAX_HZ = 8;
/** Paso máximo que se integra de una vez (tras cambiar de pestaña llegan deltas enormes). */
const MAX_STEP_MS = 100;

/** Caderas de las dos piernas (pie trasero y delantero). */
export const HIPS: readonly { x: number; y: number }[] = [
  { x: -6, y: -22 },
  { x: 6, y: -22 },
];
/** Medio ancho y medio alto del pie. */
export const FOOT_RX = 10;
export const FOOT_RY = 6;
/** Grosor de la pierna. */
export const LEG_WIDTH = 8;
/** Trayectoria del pie: elipse cuyo tamaño crece con la intensidad. */
const PATH_RX = { min: 8, max: 18 };
const PATH_RY = { min: 5, max: 14 };
/** Adelanto del centro de la trayectoria respecto a la cadera. */
const PATH_FORWARD = 2;

/** Estela de la rueda: desfases (en ciclos) y opacidades de los pies fantasma. */
export const GHOSTS: readonly { lag: number; alpha: number }[] = [
  { lag: 0.06, alpha: 0.6 },
  { lag: 0.12, alpha: 0.4 },
  { lag: 0.18, alpha: 0.25 },
  { lag: 0.24, alpha: 0.15 },
];

export const RUN_COLORS = {
  leg: 0xf28c28,
  foot: 0xb85c10,
  speedLine: 0x2b2340,
  dust: 0xfff4e0,
} as const;

export interface RunState {
  /** Posición en el ciclo de zancada, en [0, 1). */
  phase: number;
  /** 0 = zancada lenta, 1 = rueda. */
  intensity: number;
}

export interface RunInput {
  running: boolean;
  grounded: boolean;
  finished: boolean;
}

export function initialRun(): RunState {
  return { phase: 0, intensity: 0 };
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Ciclos por segundo para una intensidad. */
export function cycleHz(intensity: number): number {
  return lerp(MIN_HZ, MAX_HZ, intensity);
}

/**
 * Avanza el estado de carrera `dtMs` milisegundos.
 * - En el suelo corriendo, la intensidad sube hasta 1 en `RAMP_MS`.
 * - En el aire se congela, para aterrizar ya en rueda.
 * - Parado en el suelo o en la meta vuelve a 0 en el acto.
 */
export function stepRun(state: RunState, dtMs: number, input: RunInput): RunState {
  const dt = Math.min(Math.max(dtMs, 0), MAX_STEP_MS);
  let intensity = state.intensity;
  if (input.finished || (input.grounded && !input.running)) intensity = 0;
  else if (input.grounded) intensity = Math.min(1, intensity + dt / RAMP_MS);

  const moving = !input.finished && (input.running || !input.grounded);
  const phase = moving ? (state.phase + (dt / 1000) * cycleHz(intensity)) % 1 : state.phase;
  return { phase, intensity };
}

/** Reparto de opacidad entre piernas nítidas (1 − mix) y rueda (mix). */
export function wheelMix(intensity: number): number {
  return smoothstep(0.5, 0.9, intensity);
}

export interface FootPoint {
  /** Centro horizontal del pie. */
  x: number;
  /** Planta del pie (nunca por debajo del suelo, y ≤ 0). */
  y: number;
}

/** Elipse que recorre el pie (centro relativo a la cadera y semiejes) para una intensidad. */
export function footPath(intensity: number): { dx: number; cy: number; rx: number; ry: number } {
  const rx = lerp(PATH_RX.min, PATH_RX.max, intensity);
  const ry = lerp(PATH_RY.min, PATH_RY.max, intensity);
  return { dx: PATH_FORWARD, cy: -ry * 0.7, rx, ry };
}

/**
 * Posición de un pie en la fase dada. La trayectoria es una elipse que gira «hacia delante»:
 * arriba el pie avanza y abajo retrocede (empuja el suelo). Su parte baja queda recortada en el
 * suelo.
 */
export function footAt(hip: { x: number; y: number }, phase: number, intensity: number): FootPoint {
  const { dx, cy, rx, ry } = footPath(intensity);
  const cx = hip.x + dx;
  const a = phase * Math.PI * 2;
  return { x: cx + rx * Math.cos(a), y: Math.min(0, cy + ry * Math.sin(a)) };
}

/** Los dos pies, desfasados medio ciclo. */
export function legFeet(phase: number, intensity: number): [FootPoint, FootPoint] {
  return [footAt(HIPS[0]!, phase, intensity), footAt(HIPS[1]!, phase + 0.5, intensity)];
}
