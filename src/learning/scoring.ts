/** Estrellas de una fase: de 0 a 3. Con 0 la fase no queda superada y hay que empezar de nuevo. */
export type Stars = 0 | 1 | 2 | 3;

export interface StarGoals {
  /** Galletas que lleva al tocar la bandera, ya descontados los pinchazos. */
  cookies: number;
  /** Galletas que se pueden ganar en la fase (bloques «?» y premios de los retos del recorrido). */
  cookiesTotal: number;
  /** Preguntas acertadas de la prueba de la bandera, en cualquier intento. */
  quizCorrect: number;
  /** Preguntas de la prueba de la bandera. */
  quizTotal: number;
}

/**
 * Estrellas por objetivos, iguales en todos los mundos: 1 por llegar con al menos el 50 % de las
 * galletas de la fase y otra por acertar al menos 1 pregunta de la prueba, independientes entre sí.
 * Las 3 exigen el 80 % de las galletas y todas las preguntas. Una fase sin galletas cuenta como el 100 %.
 */
export function starsForGoals({ cookies, cookiesTotal, quizCorrect, quizTotal }: StarGoals): Stars {
  const total = Math.max(0, Math.floor(cookiesTotal));
  const got = Math.max(0, Math.min(Math.floor(cookies), total));
  const questions = Math.max(0, Math.floor(quizTotal));
  const correct = Math.max(0, Math.min(Math.floor(quizCorrect), questions));
  const share = (num: number, den: number): boolean => total === 0 || got * den >= total * num;
  if (share(4, 5) && questions > 0 && correct >= questions) return 3;
  return ((share(1, 2) ? 1 : 0) + (correct >= 1 ? 1 : 0)) as Stars;
}
