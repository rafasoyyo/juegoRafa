/** «El teleférico»: suben y bajan pasajeros de uno en uno; luego se toca cuántos hay ahora. */

import { distinctQuestions, numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type ObjectId, type Question, type SceneData } from './types';

const PASSENGERS: readonly ObjectId[] = ['hedgehog', 'bee', 'snail'];

type Step = { op: 'in' | 'out'; count: number };

function plan(band: AgeBand, rng: Rng): { start: number; steps: Step[] } {
  if (band === 'small') {
    const start = rng.int(0, 2);
    return { start, steps: [{ op: 'in', count: rng.int(1, Math.min(2, 4 - start)) }] };
  }
  if (band === 'medium') {
    const start = rng.int(1, 6);
    return { start, steps: [{ op: 'in', count: rng.int(1, Math.min(4, 10 - start)) }] };
  }
  for (;;) {
    const start = rng.int(3, 12);
    const steps: Step[] = [];
    if (rng.chance(0.35)) {
      steps.push(rng.chance(0.5) ? { op: 'in', count: rng.int(1, 5) } : { op: 'out', count: rng.int(1, Math.min(5, start)) });
    } else {
      const a: Step = { op: 'in', count: rng.int(1, 5) };
      const b: Step = { op: 'out', count: rng.int(1, 5) };
      steps.push(...(rng.chance(0.5) ? [a, b] : [b, a]));
    }
    let n = start;
    let ok = true;
    for (const s of steps) {
      n += s.op === 'in' ? s.count : -s.count;
      if (n < 0 || n > 20) ok = false;
    }
    if (ok) return { start, steps };
  }
}

export function finalCount(scene: Extract<SceneData, { kind: 'cable-car' }>): number {
  return scene.steps.reduce((n, s) => n + (s.op === 'in' ? s.count : -s.count), scene.start);
}

function question(band: AgeBand, rng: Rng): Question {
  const { start, steps } = plan(band, rng);
  const object = rng.pick(PASSENGERS);
  const scene: SceneData = { kind: 'cable-car', object, start, steps };
  const end = finalCount(scene);
  const count = band === 'big' ? 4 : 3;
  const values = numberChoices(rng, end, count, band === 'big' ? 0 : 1, band === 'small' ? 6 : band === 'medium' ? 12 : 20);
  const options = toOptions(values.map((value) => (band === 'small' ? { type: 'dots' as const, value } : { type: 'digit' as const, value })));
  return {
    kind: 'cable-car',
    prompt: { layout: 'cable-car', items: [], scene },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === (band === 'small' ? `dots:${end}` : `digit:${end}`)).map((o) => o.id) },
    hint: 'count-on',
  };
}

export function cableCarQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
