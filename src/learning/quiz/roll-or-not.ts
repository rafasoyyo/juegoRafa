/**
 * «Pelota, caja y cono» (mundo 3, nivel 10): en la rampa, ¿cuál baja rodando? (o, a veces, ¿cuál se queda
 * quieto?). Pequeños: siempre rodar, con la bola entre cuerpos con caras planas. Medianos: rodar o
 * quedarse, con bola y cilindro. Mayores: también el cono, que rueda aunque tenga una punta.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { SOLIDS, toOptions, type AgeBand, type Question, type SolidId } from './types';

/** Los que ruedan por la rampa. */
export const ROLLS: Record<SolidId, boolean> = { ball: true, cylinder: true, cone: true, cube: false, pyramid: false, brick: false };

const ROLLERS: Record<AgeBand, SolidId[]> = { small: ['ball'], medium: ['ball', 'cylinder'], big: ['ball', 'cylinder', 'cone'] };
const STILL: SolidId[] = SOLIDS.filter((s) => !ROLLS[s]);

function question(band: AgeBand, rng: Rng): Question {
  const ask = band === 'small' ? 'roll' : rng.pick(['roll', 'stay'] as const);
  const good = ask === 'roll' ? ROLLERS[band] : STILL;
  const bad = ask === 'roll' ? STILL : ROLLERS[band];
  const target = rng.pick(good);
  const others = rng.shuffle(bad).slice(0, 2);
  const options = toOptions(rng.shuffle([target, ...others]).map((solid) => ({ type: 'solid' as const, solid })));
  return {
    kind: 'roll-or-not',
    prompt: { layout: 'picture', items: [{ type: 'ramp', ask }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `solid:${target}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function rollOrNotQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
