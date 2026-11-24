/** La prueba de la bandera: genera las tres preguntas del tipo y la franja de edad que tocan. */

import { balanceQuiz } from './balance';
import { cableCarQuiz } from './cable-car';
import { compareQuiz } from './compare';
import { countQuiz } from './count';
import { mirrorQuiz } from './mirror';
import { nameLettersQuiz } from './name-letters';
import { orderQuiz } from './order';
import { recallQuiz } from './recall';
import type { Rng } from './rng';
import { seriesQuiz } from './series';
import { shapesQuiz } from './shapes';
import { shareQuiz } from './share';
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
  }
}

export { ageBand } from './age';
export { quizForLevel, QUIZ_BY_LEVEL } from './catalog';
export { GUIDE_MAX_WORDS, GUIDE_TEXT, guideWordCount, type GuideText } from './guide-text';
export { createRng, type Rng } from './rng';
export * from './run';
export * from './types';
