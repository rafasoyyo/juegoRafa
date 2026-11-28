/**
 * «Repaso del río» (mundo 2, nivel 12): una pregunta de tres pruebas anteriores del río, distintas entre
 * sí. Cada pregunta conserva su tipo, así que se dibuja como en su nivel.
 */

import { biggestQuiz } from './biggest';
import { fingersQuiz } from './fingers';
import { frogJumpsQuiz } from './frog-jumps';
import { neighborQuiz } from './neighbor';
import { numberLineQuiz } from './number-line';
import type { Rng } from './rng';
import { tenFrameQuiz } from './ten-frame';
import { tenFriendsQuiz } from './ten-friends';
import { trainQuiz } from './train';
import type { AgeBand, Question } from './types';

/** Pruebas que entran en el repaso: las de elegir una respuesta, sin cartas que memorizar. */
export const REVIEW_POOL = [fingersQuiz, tenFrameQuiz, neighborQuiz, numberLineQuiz, biggestQuiz, tenFriendsQuiz, trainQuiz, frogJumpsQuiz] as const;

export function riverReviewQuiz(band: AgeBand, rng: Rng): Question[] {
  return rng
    .shuffle([...REVIEW_POOL])
    .slice(0, 3)
    .map((make) => make(band, rng)[0]!);
}
