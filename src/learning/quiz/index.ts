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

export function generateQuiz(kind: QuizKind, band: AgeBand, rng: Rng, ctx: QuizContext): Question[] {
  switch (kind) {
    case 'count':
      return countQuiz(band, rng);
    case 'compare':
      return compareQuiz(band, rng);
    case 'series':
      return seriesQuiz(band, rng);
    case 'shapes':
      return shapesQuiz(band, rng);
    case 'name-letters':
      return nameLettersQuiz(band, rng, ctx.alias);
    case 'recall':
      return recallQuiz(band, rng, ctx);
    case 'share':
      return shareQuiz(band, rng);
    case 'order':
      return orderQuiz(band, rng);
    case 'cable-car':
      return cableCarQuiz(band, rng);
    case 'tracks':
      return tracksQuiz(band, rng);
    case 'balance':
      return balanceQuiz(band, rng);
    case 'mirror':
      return mirrorQuiz(band, rng);
    case 'fingers':
      return fingersQuiz(band, rng);
    case 'ten-frame':
      return tenFrameQuiz(band, rng);
    case 'memory':
      return memoryQuiz(band, rng);
    case 'neighbor':
      return neighborQuiz(band, rng);
    case 'number-line':
      return numberLineQuiz(band, rng);
    case 'biggest':
      return biggestQuiz(band, rng);
    case 'ten-friends':
      return tenFriendsQuiz(band, rng);
    case 'train':
      return trainQuiz(band, rng);
    case 'socks':
      return socksQuiz(band, rng);
    case 'frog-jumps':
      return frogJumpsQuiz(band, rng);
    case 'boats':
      return boatsQuiz(band, rng);
    case 'river-review':
      return riverReviewQuiz(band, rng);
    case 'dino-shadows':
      return dinoShadowsQuiz(band, rng);
    case 'shape-things':
      return shapeThingsQuiz(band, rng);
    case 'stego-plates':
      return stegoPlatesQuiz(band, rng);
    case 'turned-shapes':
      return turnedShapesQuiz(band, rng);
    case 'nest':
      return nestQuiz(band, rng);
    case 'odd-egg':
      return oddEggQuiz(band, rng);
    case 'fossil':
      return fossilQuiz(band, rng);
    case 'skin-mosaic':
      return skinMosaicQuiz(band, rng);
    case 'growing-neck':
      return growingNeckQuiz(band, rng);
    case 'roll-or-not':
      return rollOrNotQuiz(band, rng);
    case 'hidden-triangles':
      return hiddenTrianglesQuiz(band, rng);
    case 'island-review':
      return islandReviewQuiz(band, rng);
  }
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
