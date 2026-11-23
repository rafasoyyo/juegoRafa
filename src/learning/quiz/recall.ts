/** «¿Te acuerdas?»: preguntas sobre el nivel recién jugado, que ya no se ve. */

import { numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type ObjectId, type Question, type QuizContext, type TopicIcon, type Visual } from './types';

function choice(topic: Visual, visuals: Visual[], isCorrect: (v: Visual) => boolean, rng: Rng): Question {
  const options = toOptions(rng.shuffle(visuals));
  return {
    kind: 'recall',
    prompt: { layout: 'think', items: [topic] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => isCorrect(o.visual)).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

const topic = (icon: TopicIcon): Visual => ({ type: 'topic', icon });
const obj = (object: ObjectId): Visual => ({ type: 'object', object });

function landscape(ctx: QuizContext, rng: Rng): Question {
  const others = rng.shuffle(ctx.ambients.filter((a) => a !== ctx.recap.ambient)).slice(0, 2);
  const visuals = [ctx.recap.ambient, ...others].map((id): Visual => ({ type: 'ambient', id }));
  return choice(topic('landscape'), visuals, (v) => v.type === 'ambient' && v.id === ctx.recap.ambient, rng);
}

function blocks(rng: Rng): Question {
  return choice(topic('block'), [obj('cookie'), obj('star'), obj('snail')], (v) => v.type === 'object' && v.object === 'cookie', rng);
}

function met(ctx: QuizContext, rng: Rng): Question {
  const seen = new Set<ObjectId>();
  if (ctx.recap.hedgehogs > 0) seen.add('hedgehog');
  if (ctx.recap.bees > 0) seen.add('bee');
  return choice(topic('path'), [obj('hedgehog'), obj('bee'), obj('snail')], (v) => v.type === 'object' && seen.has(v.object), rng);
}

function howMany(about: ObjectId, correct: number, n: number, rng: Rng): Question {
  const values = numberChoices(rng, correct, n, 0, Math.max(9, correct + 3));
  return choice(obj(about), values.map((value): Visual => ({ type: 'digit', value })), (v) => v.type === 'digit' && v.value === correct, rng);
}

export function recallQuiz(band: AgeBand, rng: Rng, ctx: QuizContext): Question[] {
  const { hedgehogs, bees, cookies } = ctx.recap;
  if (band === 'small') return [landscape(ctx, rng), blocks(rng), met(ctx, rng)];
  if (band === 'medium') {
    const kinds: [ObjectId, number][] = [
      ['hedgehog', hedgehogs],
      ['bee', bees],
    ];
    const present = kinds.filter(([, n]) => n > 0);
    const [kind, n] = rng.pick(present.length > 0 ? present : kinds);
    return [landscape(ctx, rng), howMany(kind, n, 3, rng), howMany('cookie', cookies, 3, rng)];
  }
  return [howMany('hedgehog', hedgehogs, 4, rng), howMany('bee', bees, 4, rng), howMany('cookie', cookies, 4, rng)];
}
