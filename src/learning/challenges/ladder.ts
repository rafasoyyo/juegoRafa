/**
 * Escalera de fallos de un reto del recorrido (`docs/MUNDO-2.md`): común a las tres mecánicas.
 * TypeScript puro.
 */

/**
 * Qué pasa al golpear un bloque: `correct` (resuelto), `wobble` (1.er fallo), `count-up` (2.º fallo)
 * o `solved-by-lalo` (3.er fallo: Lalo lo resuelve). `ignored` si el reto ya estaba resuelto.
 */
export type ChallengeEvent = 'correct' | 'wobble' | 'count-up' | 'solved-by-lalo' | 'ignored';

export const FAILS_UNTIL_LALO = 3;

export interface ChallengeRun {
  readonly correct: number;
  fails: number;
  solved: boolean;
  /** Resuelto con el primer golpe. */
  firstTry: boolean;
}

export function startChallenge(correct: number): ChallengeRun {
  return { correct, fails: 0, solved: false, firstTry: false };
}

export function hitBlock(run: ChallengeRun, index: number): ChallengeEvent {
  if (run.solved) return 'ignored';
  if (index === run.correct) {
    run.firstTry = run.fails === 0;
    run.solved = true;
    return 'correct';
  }
  run.fails += 1;
  if (run.fails >= FAILS_UNTIL_LALO) {
    run.solved = true;
    return 'solved-by-lalo';
  }
  return run.fails === 1 ? 'wobble' : 'count-up';
}

/** Recuento del nivel: los de demostración no cuentan. */
export interface ChallengeTally {
  firstTry: number;
  total: number;
}

export function tally(runs: readonly { run: ChallengeRun; demo: boolean }[]): ChallengeTally {
  const counted = runs.filter((r) => !r.demo);
  return { firstTry: counted.filter((r) => r.run.solved && r.run.firstTry).length, total: counted.length };
}
