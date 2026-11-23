export type Stars = 1 | 2 | 3;

/**
 * Regla PROVISIONAL de estrellas hasta que existan retos (fase 2):
 * 1 por llegar a la meta, +1 con al menos la mitad de los bloques «?» y +1 con todos.
 * Nunca da 0 estrellas. Un nivel sin bloques da 3.
 */
export function starsFor(blocksHit: number, blocksTotal: number): Stars {
  if (blocksTotal <= 0) return 3;
  const hit = Math.max(0, Math.min(blocksHit, blocksTotal));
  if (hit >= blocksTotal) return 3;
  if (hit * 2 >= blocksTotal) return 2;
  return 1;
}
