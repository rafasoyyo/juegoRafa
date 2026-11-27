/**
 * «El nido» (mundo 3, nivel 5): dentro, fuera, encima, debajo… Lalo enseña al bebé dinosaurio en un sitio
 * respecto al nido, y se elige el dibujo en el que el huevo está igual respecto a la caja o al cesto o a la cueva. Se compara la
 * posición, no el dibujo.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type PlaceRel, type Question } from './types';

export const PLACES_BY_BAND: Record<AgeBand, PlaceRel[]> = {
  small: ['in', 'out'],
  medium: ['in', 'out', 'on', 'under', 'front', 'behind'],
  big: ['on', 'under', 'front', 'behind', 'left', 'right'],
};

/** Posiciones que se confunden: se ofrecen juntas para que haya que mirar bien. */
const OPPOSITE: Record<PlaceRel, PlaceRel> = { in: 'out', out: 'in', on: 'under', under: 'on', front: 'behind', behind: 'front', left: 'right', right: 'left' };

function question(band: AgeBand, rng: Rng, rel: PlaceRel, holder: 'box' | 'basket' | 'cave'): Question {
  const pool = PLACES_BY_BAND[band];
  const rels = band === 'small' ? [rel, OPPOSITE[rel]] : [rel, OPPOSITE[rel], rng.pick(pool.filter((r) => r !== rel && r !== OPPOSITE[rel]))];
  const options = toOptions(rng.shuffle(rels).map((r) => ({ type: 'place' as const, rel: r, thing: 'egg' as const, holder })));
  return {
    kind: 'nest',
    prompt: { layout: 'model', items: [{ type: 'place', rel, thing: 'baby', holder: 'nest' }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual.type === 'place' && o.visual.rel === rel).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function nestQuiz(band: AgeBand, rng: Rng): Question[] {
  const rels = rng.shuffle(PLACES_BY_BAND[band]);
  // El huevo va en una caja, un cesto o una cueva: lo que cuenta es dónde está, no el dibujo.
  return distinctQuestions((i) => question(band, rng, rels[i % rels.length]!, (['box', 'basket', 'cave'] as const)[i % 3]!));
}
