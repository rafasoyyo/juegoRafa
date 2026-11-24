/**
 * «La balanza»: pequeños tocan el platillo que bajará; medianos, cuántas galletas faltan; mayores,
 * cuántas galletas equivalen a unas fresas según una balanza modelo.
 */

import { distinctQuestions, numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type WeightId } from './types';

export const HEAVY: readonly WeightId[] = ['melon', 'rock', 'pumpkin'];
export const LIGHT: readonly WeightId[] = ['feather', 'leaf', 'berry'];

function weigh(rng: Rng): Question {
  const heavy = rng.pick(HEAVY);
  const light = rng.pick(LIGHT);
  const heavyLeft = rng.chance(0.5);
  const options = toOptions([{ type: 'pan', side: 'left' }, { type: 'pan', side: 'right' }], 'scene');
  return {
    kind: 'balance',
    prompt: {
      layout: 'balance',
      items: [],
      scene: { kind: 'balance', mode: 'weigh', left: heavyLeft ? heavy : light, right: heavyLeft ? light : heavy },
    },
    options,
    answer: { form: 'choice', correct: [heavyLeft ? 0 : 1] },
    hint: 'heft',
  };
}

function gap(rng: Rng): Question {
  let a: number;
  let b: number;
  do {
    a = rng.int(1, 9);
    b = rng.int(1, 9);
  } while (a === b);
  const missing = Math.abs(a - b);
  const values = numberChoices(rng, missing, 3, 1, 8);
  const options = toOptions(values.map((value) => ({ type: 'digit' as const, value })));
  return {
    kind: 'balance',
    prompt: { layout: 'balance', items: [], scene: { kind: 'balance', mode: 'gap', left: a, right: b } },
    options,
    answer: { form: 'choice', correct: [values.indexOf(missing)] },
    hint: 'pair-up',
  };
}

function equiv(rng: Rng): Question {
  let k: number;
  let n: number;
  do {
    k = rng.int(2, 4);
    n = rng.int(2, 3);
  } while (n * k > 12);
  const total = n * k;
  const values = numberChoices(rng, total, 4, 1, 12, [k, -k, 1, -1, 2, -2]);
  const options = toOptions(values.map((value) => ({ type: 'digit' as const, value })));
  return {
    kind: 'balance',
    prompt: { layout: 'balance', items: [], scene: { kind: 'balance', mode: 'equiv', cookies: k, berries: n } },
    options,
    answer: { form: 'choice', correct: [values.indexOf(total)] },
    hint: 'swap-fruit',
  };
}

export function balanceQuiz(band: AgeBand, rng: Rng): Question[] {
  const make = band === 'small' ? weigh : band === 'medium' ? gap : equiv;
  return distinctQuestions(() => make(rng));
}
