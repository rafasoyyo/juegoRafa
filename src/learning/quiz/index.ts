/** La prueba de la bandera: genera las tres preguntas del tipo y la franja de edad que tocan. */

import { compareQuiz } from './compare';
import { countQuiz } from './count';
import { nameLettersQuiz } from './name-letters';
import { recallQuiz } from './recall';
import type { Rng } from './rng';
import { seriesQuiz } from './series';
import { shapesQuiz } from './shapes';
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
  }
}

export { ageBand } from './age';
export { quizForLevel, QUIZ_BY_LEVEL } from './catalog';
export { GUIDE_MAX_WORDS, GUIDE_TEXT, guideWordCount, type GuideText } from './guide-text';
export { createRng, type Rng } from './rng';
export * from './run';
export * from './types';
