/**
 * «Sombras de dinosaurios» (mundo 3, nivel 1): emparejar un dinosaurio con su silueta. Los pequeños
 * eligen entre siluetas muy distintas; los mayores, entre parecidas y alguna mirando al otro lado.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { DINOS, toOptions, type AgeBand, type DinoId, type Question, type Visual } from './types';

/** Parejas que se parecen de silueta (cuello largo, cuatro patas, de pie sobre dos patas). */
const LOOKALIKES: Record<DinoId, DinoId[]> = {
  trex: ['stego', 'trici'],
  brachio: ['stego', 'trici'],
  trici: ['stego', 'brachio'],
  stego: ['trici', 'brachio'],
  ptero: ['trex'],
};

function question(band: AgeBand, rng: Rng, model: DinoId): Question {
  let others: DinoId[];
  if (band === 'small') others = rng.shuffle(DINOS.filter((d) => d !== model && !LOOKALIKES[model].slice(0, 1).includes(d))).slice(0, 2);
  else others = rng.shuffle(LOOKALIKES[model]).concat(rng.shuffle(DINOS.filter((d) => d !== model))).filter((d, i, a) => d !== model && a.indexOf(d) === i).slice(0, 2);
  // Mayores: la sombra buena puede mirar al otro lado (sigue siendo el mismo dinosaurio).
  const flip = band === 'big' && rng.chance(0.5);
  const shadows: Visual[] = [model, ...others].map((dino, i) => ({ type: 'dino', dino, shadow: true, flip: i === 0 ? flip : rng.chance(band === 'big' ? 0.5 : 0) }));
  const options = toOptions(rng.shuffle(shadows));
  return {
    kind: 'dino-shadows',
    prompt: { layout: 'model', items: [{ type: 'dino', dino: model, shadow: false, flip: false }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual.type === 'dino' && o.visual.dino === model).map((o) => o.id) },
    hint: 'misfit',
  };
}

export function dinoShadowsQuiz(band: AgeBand, rng: Rng): Question[] {
  const models = rng.shuffle(DINOS);
  return distinctQuestions((i) => question(band, rng, models[i % models.length]!));
}
