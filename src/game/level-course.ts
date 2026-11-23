/**
 * Recorrido del nivel (datos del nivel hasta los niveles en JSON de la fase 4).
 * TypeScript puro: lo usan la escena y la colocación de enemigos.
 */

// Recorrido y físicas de la fase 0 escalados ×3,2 (de 225 a 720 px de alto).
export const SCALE = 3.2;
export const WORLD_W = 1600 * SCALE;
export const GROUND_TOP = 620;
export const START_X = 150 * SCALE;
export const FLAG_X = WORLD_W - 100 * SCALE;
export const BLOCK_SIZE = 84;
/** Posiciones x de los bloques «?». */
export const BLOCKS: readonly { x: number; high: boolean }[] = [220, 252, 284, 620, 652, 900, 932, 964, 1000, 1240].map((x) => ({
  x: Math.round(x * SCALE),
  high: x > 800 && x < 1100,
}));
