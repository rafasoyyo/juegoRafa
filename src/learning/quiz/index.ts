/** La prueba de la bandera: genera las tres preguntas del tipo y la franja de edad que tocan. */

import { balanceQuiz } from './balance';
import { dinoShadowsQuiz } from './dino-shadows';
import { nestQuiz } from './nest';
import { oddEggQuiz } from './odd-egg';
import { fossilQuiz } from './fossil';
import { skinMosaicQuiz } from './skin-mosaic';
import { growingNeckQuiz } from './growing-neck';
import { rollOrNotQuiz } from './roll-or-not';
import { hiddenTrianglesQuiz } from './hidden-triangles';
import { islandReviewQuiz } from './island-review';
import { shapeThingsQuiz } from './shape-things';
import { stegoPlatesQuiz } from './stego-plates';
import { turnedShapesQuiz } from './turned-shapes';
import { biggestQuiz } from './biggest';
import { boatsQuiz } from './boats';
import { frogJumpsQuiz } from './frog-jumps';
import { riverReviewQuiz } from './river-review';
import { socksQuiz } from './socks';
import { tenFriendsQuiz } from './ten-friends';
import { trainQuiz } from './train';
import { cableCarQuiz } from './cable-car';
import { castleQuiz } from './castle-quiz';
import { compareQuiz } from './compare';
import { countQuiz } from './count';
import { fingersQuiz } from './fingers';
import { memoryQuiz } from './memory';
import { mirrorQuiz } from './mirror';
import { nameLettersQuiz } from './name-letters';
import { neighborQuiz } from './neighbor';
import { numberLineQuiz } from './number-line';
import { orderQuiz } from './order';
import { recallQuiz } from './recall';
import type { Rng } from './rng';
import { seriesQuiz } from './series';
import { shapesQuiz } from './shapes';
import { shareQuiz } from './share';
import { tenFrameQuiz } from './ten-frame';
import { tracksQuiz } from './tracks';
import type { AgeBand, Question, QuizContext, QuizKind } from './types';

/**
 * Generador de cada tipo de prueba de la bandera (spec `world-isolation`: una entrada por tipo). Si a un
 * tipo de `QUIZ_KINDS` le falta la suya, la compilación falla.
 */
export const QUIZ_GENERATORS: Readonly<Record<QuizKind, (band: AgeBand, rng: Rng, ctx: QuizContext) => Question[]>> = {
  count: (band, rng) => countQuiz(band, rng),
  compare: (band, rng) => compareQuiz(band, rng),
  series: (band, rng) => seriesQuiz(band, rng),
  shapes: (band, rng) => shapesQuiz(band, rng),
  'name-letters': (band, rng, ctx) => nameLettersQuiz(band, rng, ctx.alias),
  recall: (band, rng, ctx) => recallQuiz(band, rng, ctx),
  share: (band, rng) => shareQuiz(band, rng),
  order: (band, rng) => orderQuiz(band, rng),
  'cable-car': (band, rng) => cableCarQuiz(band, rng),
  tracks: (band, rng) => tracksQuiz(band, rng),
  balance: (band, rng) => balanceQuiz(band, rng),
  mirror: (band, rng) => mirrorQuiz(band, rng),
  fingers: (band, rng) => fingersQuiz(band, rng),
  'ten-frame': (band, rng) => tenFrameQuiz(band, rng),
  memory: (band, rng) => memoryQuiz(band, rng),
  neighbor: (band, rng) => neighborQuiz(band, rng),
  'number-line': (band, rng) => numberLineQuiz(band, rng),
  biggest: (band, rng) => biggestQuiz(band, rng),
  'ten-friends': (band, rng) => tenFriendsQuiz(band, rng),
  train: (band, rng) => trainQuiz(band, rng),
  socks: (band, rng) => socksQuiz(band, rng),
  'frog-jumps': (band, rng) => frogJumpsQuiz(band, rng),
  boats: (band, rng) => boatsQuiz(band, rng),
  'river-review': (band, rng) => riverReviewQuiz(band, rng),
  'dino-shadows': (band, rng) => dinoShadowsQuiz(band, rng),
  'shape-things': (band, rng) => shapeThingsQuiz(band, rng),
  'stego-plates': (band, rng) => stegoPlatesQuiz(band, rng),
  'turned-shapes': (band, rng) => turnedShapesQuiz(band, rng),
  nest: (band, rng) => nestQuiz(band, rng),
  'odd-egg': (band, rng) => oddEggQuiz(band, rng),
  fossil: (band, rng) => fossilQuiz(band, rng),
  'skin-mosaic': (band, rng) => skinMosaicQuiz(band, rng),
  'growing-neck': (band, rng) => growingNeckQuiz(band, rng),
  'roll-or-not': (band, rng) => rollOrNotQuiz(band, rng),
  'hidden-triangles': (band, rng) => hiddenTrianglesQuiz(band, rng),
  'island-review': (band, rng) => islandReviewQuiz(band, rng),
};

export function generateQuiz(kind: QuizKind, band: AgeBand, rng: Rng, ctx: QuizContext): Question[] {
  return QUIZ_GENERATORS[kind](band, rng, ctx);
}

export { ageBand } from './age';
export { quizForLevel, QUIZ_BY_LEVEL } from './catalog';
export { GUIDE_MAX_WORDS, GUIDE_TEXT, guideWordCount, type GuideText } from './guide-text';
export { createRng, type Rng } from './rng';
export * from './run';
export * from './types';
export { castleQuizKinds } from './castle-quiz';

/** Preguntas de la bandera del castillo: una de cada paso (`castle-quiz.ts`). */
export function generateCastleQuiz(pools: readonly (readonly QuizKind[])[], band: AgeBand, rng: Rng, ctx: QuizContext): Question[] {
  return castleQuiz(pools, band, rng, ctx, generateQuiz);
}
