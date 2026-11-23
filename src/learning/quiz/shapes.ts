/** «Caza de formas»: se tocan todas las piezas con la forma del modelo. El color no indica la forma. */

import { PIECE_COLORS } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type ShapeId, type Visual } from './types';

export const SHAPES_BY_BAND: Record<AgeBand, ShapeId[]> = {
  small: ['circle', 'square'],
  medium: ['circle', 'square', 'triangle'],
  big: ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon', 'rectangle'],
};

export const PIECES_BY_BAND: Record<AgeBand, number> = { small: 6, medium: 8, big: 10 };
export const TARGETS_BY_BAND: Record<AgeBand, [number, number]> = { small: [2, 3], medium: [3, 4], big: [3, 5] };

/** Formas que se confunden con cada una, para que los mayores tengan distractores parecidos. */
const LOOKALIKES: Partial<Record<ShapeId, ShapeId[]>> = {
  square: ['rectangle', 'diamond'],
  rectangle: ['square'],
  diamond: ['square', 'triangle'],
  hexagon: ['circle'],
  circle: ['hexagon'],
  star: ['hexagon'],
  triangle: ['diamond'],
};

function piece(band: AgeBand, rng: Rng, shape: ShapeId): Visual {
  const scale = band === 'small' ? 1 : rng.pick([0.65, 0.8, 1]);
  // Giros pequeños: un cuadrado girado 45° sería un rombo.
  const angle = band === 'big' && shape !== 'circle' ? rng.int(-20, 20) : 0;
  return { type: 'shape', shape, color: rng.pick(PIECE_COLORS), scale, angle };
}

function question(band: AgeBand, rng: Rng, model: ShapeId): Question {
  const total = PIECES_BY_BAND[band];
  const [tMin, tMax] = TARGETS_BY_BAND[band];
  const targets = rng.int(tMin, tMax);
  const others = SHAPES_BY_BAND[band].filter((s) => s !== model);
  const similar = (LOOKALIKES[model] ?? []).filter((s) => others.includes(s));

  const pieces: Visual[] = [];
  for (let i = 0; i < targets; i++) pieces.push(piece(band, rng, model));
  for (let i = targets; i < total; i++) {
    const useSimilar = band === 'big' && similar.length > 0 && i === targets;
    pieces.push(piece(band, rng, useSimilar ? rng.pick(similar) : rng.pick(others)));
  }
  const options = toOptions(rng.shuffle(pieces));
  return {
    kind: 'shapes',
    prompt: { layout: 'model', items: [{ type: 'shape', shape: model, color: rng.pick(PIECE_COLORS), scale: 1, angle: 0 }] },
    options,
    answer: { form: 'multi', targets: options.filter((o) => o.key === `shape:${model}`).map((o) => o.id), ordered: false },
    hint: 'misfit',
  };
}

export function shapesQuiz(band: AgeBand, rng: Rng): Question[] {
  // Modelos: dos preguntas seguidas nunca buscan la misma forma.
  const shapes = SHAPES_BY_BAND[band];
  const models: ShapeId[] = [];
  for (let i = 0; i < 3; i++) {
    const prev = models[i - 1];
    models.push(rng.pick(shapes.filter((s) => s !== prev)));
  }
  return models.map((m) => question(band, rng, m));
}
