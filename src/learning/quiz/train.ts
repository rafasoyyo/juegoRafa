/**
 * «El tren» (mundo 2, nivel 8): ordinales. Una tarjeta dice el puesto (con puntos o con su número) y se
 * toca el vagón que va en ese puesto contando desde la locomotora. Hasta el 3.º, el 5.º o el 7.º.
 */

import { COUNTABLE, distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type ObjectId, type Question, type Visual } from './types';

const WAGONS: Record<AgeBand, number> = { small: 3, medium: 5, big: 7 };

function question(band: AgeBand, rng: Rng): Question {
  const wagons = WAGONS[band];
  const target = rng.int(band === 'small' ? 1 : 2, wagons);
  const kinds: ObjectId[] = [...COUNTABLE, 'snail'];
  const objects = Array.from({ length: wagons }, () => rng.pick(kinds));
  // Cada vagón es una opción en el dibujo; su clave es su puesto.
  const options = toOptions(
    Array.from({ length: wagons }, (_, i): Visual => ({ type: 'digit', value: i + 1 })),
    'scene',
  );
  const card: Visual = band === 'small' ? { type: 'dots', value: target } : { type: 'digit', value: target };
  return {
    kind: 'train',
    prompt: { layout: 'train', items: [card], scene: { kind: 'train', wagons, target, objects } },
    options,
    answer: { form: 'choice', correct: [target - 1] },
    hint: 'hop',
  };
}

export function trainQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
