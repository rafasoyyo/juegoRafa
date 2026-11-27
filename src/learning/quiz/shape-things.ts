/**
 * «Formas en las cosas» (mundo 3, nivel 2): la rueda es un círculo y la ventana un cuadrado. Se ve una
 * cosa y se toca su forma.
 */

import { distinctQuestions, PIECE_COLORS } from './helpers';
import type { Rng } from './rng';
import { THINGS, toOptions, type AgeBand, type Question, type ShapeId, type ThingId } from './types';

/** Formas que conoce cada franja (`docs/MUNDO-3.md`, «Nombrar formas»). */
export const THING_SHAPES: Record<AgeBand, ShapeId[]> = {
  small: ['circle', 'square', 'triangle'],
  medium: ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'diamond'],
  big: ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'diamond', 'pentagon', 'hexagon'],
};

export function thingsFor(band: AgeBand): ThingId[] {
  return (Object.keys(THINGS) as ThingId[]).filter((t) => THING_SHAPES[band].includes(THINGS[t]));
}

function question(band: AgeBand, rng: Rng, thing: ThingId): Question {
  const shape = THINGS[thing];
  const others = rng.shuffle(THING_SHAPES[band].filter((s) => s !== shape)).slice(0, 2);
  // El color no dice la forma: cada opción de un color al azar.
  const options = toOptions(rng.shuffle([shape, ...others]).map((s) => ({ type: 'shape' as const, shape: s, color: rng.pick(PIECE_COLORS), scale: 1, angle: 0 })));
  return {
    kind: 'shape-things',
    prompt: { layout: 'model', items: [{ type: 'thing', thing }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `shape:${shape}`).map((o) => o.id) },
    hint: 'misfit',
  };
}

export function shapeThingsQuiz(band: AgeBand, rng: Rng): Question[] {
  // Tres cosas de formas distintas.
  const byShape = new Map<ShapeId, ThingId[]>();
  for (const t of rng.shuffle(thingsFor(band))) byShape.set(THINGS[t], [...(byShape.get(THINGS[t]) ?? []), t]);
  const picks = rng.shuffle([...byShape.values()]).map((ts) => ts[0]!);
  return distinctQuestions((i) => question(band, rng, picks[i % picks.length]!));
}
