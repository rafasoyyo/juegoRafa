/**
 * «Reparte las galletas»: cada toque en un plato lleva una galleta de la cesta. Se acierta cuando la
 * cesta queda vacía y todos los platos tienen lo mismo; en mayores, lo que sobra va al tarro de Lalo.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type FillSlot, type ObjectId, type Option, type Question } from './types';

const FRIENDS: readonly ObjectId[] = ['hedgehog', 'bee', 'snail', 'star'];

interface Plan {
  plates: number;
  total: number;
}

function plan(band: AgeBand, rng: Rng, noRest: boolean): Plan {
  if (band === 'small') return { plates: 2, total: rng.pick([2, 4, 6]) };
  if (band === 'medium') {
    const plates = rng.int(2, 3);
    const maxK = Math.floor(12 / plates);
    return { plates, total: plates * rng.int(2, maxK) };
  }
  const plates = rng.int(3, 4);
  const rest = noRest ? 0 : rng.int(1, plates - 1);
  const maxK = Math.floor((15 - rest) / plates);
  return { plates, total: plates * rng.int(2, maxK) + rest };
}

function question(band: AgeBand, rng: Rng, noRest: boolean): Question {
  const { plates, total } = plan(band, rng, noRest);
  const each = Math.floor(total / plates);
  const rest = total - each * plates;
  const jar = band === 'big';
  const friends = rng.shuffle(FRIENDS).slice(0, plates);
  const options: Option[] = toOptions(friends.map((friend) => ({ type: 'plate' as const, friend })), 'scene');
  const plateIds = options.map((o) => o.id);
  const slots: FillSlot[] = plateIds.map((option) => ({ option, capacity: each }));
  if (jar) {
    const id = options.length;
    options.push({ id, key: 'jar', visual: { type: 'jar' }, place: 'scene' });
    slots.push({ option: id, capacity: rest, after: plateIds });
  }
  return {
    kind: 'share',
    prompt: {
      layout: 'share',
      items: [{ type: 'objects', object: 'cookie', count: total, scale: 1 }],
      scene: { kind: 'share', plates: friends, cookies: total, jar },
    },
    options,
    answer: { form: 'fill', slots },
    hint: 'deal',
  };
}

export function shareQuiz(band: AgeBand, rng: Rng): Question[] {
  // Mayores: como mucho una de las 3 preguntas sin sobras.
  const noRestIdx = band === 'big' ? rng.int(0, 3) : -1;
  return distinctQuestions((i) => question(band, rng, i === noRestIdx));
}
