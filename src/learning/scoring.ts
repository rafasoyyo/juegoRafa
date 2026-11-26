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

/**
 * Estrellas por retos del recorrido (mundo 2, `docs/MUNDO-2.md`): 3 con el 75 % o más acertados a la
 * primera, 2 con el 40 % o más y 1 en el resto. Un nivel sin retos da 3.
 */
export function starsForChallenges(firstTry: number, total: number): Stars {
  if (total <= 0) return 3;
  const ok = Math.max(0, Math.min(firstTry, total));
  if (ok * 4 >= total * 3) return 3;
  if (ok * 5 >= total * 2) return 2;
  return 1;
}
