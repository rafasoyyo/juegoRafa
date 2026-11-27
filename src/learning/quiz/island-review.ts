/**
 * «Repaso de la isla» (mundo 3, nivel 12): una pregunta de tres pruebas anteriores de la isla, distintas
 * entre sí. Cada pregunta conserva su tipo, así que se dibuja como en su nivel.
 */

import { dinoShadowsQuiz } from './dino-shadows';
import { fossilQuiz } from './fossil';
import { growingNeckQuiz } from './growing-neck';
import { hiddenTrianglesQuiz } from './hidden-triangles';
import { nestQuiz } from './nest';
import { oddEggQuiz } from './odd-egg';
import type { Rng } from './rng';
import { rollOrNotQuiz } from './roll-or-not';
import { shapeThingsQuiz } from './shape-things';
import { skinMosaicQuiz } from './skin-mosaic';
import { stegoPlatesQuiz } from './stego-plates';
import { turnedShapesQuiz } from './turned-shapes';
import type { AgeBand, Question } from './types';

/** Pruebas que entran en el repaso: las once de la isla. */
export const ISLAND_REVIEW_POOL = [
  dinoShadowsQuiz,
  shapeThingsQuiz,
  stegoPlatesQuiz,
  turnedShapesQuiz,
  nestQuiz,
  oddEggQuiz,
  fossilQuiz,
  skinMosaicQuiz,
  growingNeckQuiz,
  rollOrNotQuiz,
  hiddenTrianglesQuiz,
] as const;

export function islandReviewQuiz(band: AgeBand, rng: Rng): Question[] {
  return rng
    .shuffle([...ISLAND_REVIEW_POOL])
    .slice(0, 3)
    .map((make) => make(band, rng)[0]!);
}
