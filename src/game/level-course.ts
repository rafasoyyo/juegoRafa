/**
 * Constantes geométricas comunes a todos los niveles. Los recorridos de cada nivel están en
 * `content/levels/` (ver `src/game/levels/`). TypeScript puro.
 */

// Recorrido y físicas de la fase 0 escalados ×3,2 (de 225 a 720 px de alto).
export const SCALE = 3.2;
export const GROUND_TOP = 620;
export const BLOCK_SIZE = 84;

/** Física del zorro (px/s y px/s²): gravedad del mundo, impulso del salto y velocidad máxima. */
export const GRAVITY = 900 * SCALE;
export const JUMP_SPEED = 330 * SCALE;
export const MAX_VELOCITY = { x: 300 * SCALE, y: 600 * SCALE } as const;
/** Impulso vertical del brinco de un pinchazo (enemigo o pinchos). */
export const KNOCK_VY = 0.8 * JUMP_SPEED;
