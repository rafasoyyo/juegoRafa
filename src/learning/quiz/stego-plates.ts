/**
 * «Las placas del estegosaurio» (mundo 3, nivel 3): una placa con forma de triángulo (u otra) y tres
 * placas para elegir la misma forma, aunque cambie de tamaño, color o giro. Los mayores cuentan esquinas:
 * se ven unos puntos (las esquinas) y se elige la forma que tiene esas.
 */

import { distinctQuestions, PIECE_COLORS } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type ShapeId, type Visual } from './types';

const SHAPES: Record<AgeBand, ShapeId[]> = {
  small: ['triangle', 'square', 'circle'],
  medium: ['triangle', 'square', 'circle', 'rectangle', 'diamond'],
  big: ['triangle', 'square', 'pentagon', 'hexagon'],
};

/** Esquinas de cada forma con lados rectos. */
export const CORNERS: Partial<Record<ShapeId, number>> = { triangle: 3, square: 4, rectangle: 4, diamond: 4, pentagon: 5, hexagon: 6 };

function plate(rng: Rng, shape: ShapeId, band: AgeBand): Visual {
  const scale = band === 'small' ? rng.pick([0.8, 1]) : rng.pick([0.6, 0.8, 1]);
  // Giros pequeños: un cuadrado girado 45° se vería como un rombo.
  const angle = band === 'small' || shape === 'circle' ? 0 : rng.int(-25, 25);
  return { type: 'shape', shape, color: rng.pick(PIECE_COLORS), scale, angle };
}

function question(band: AgeBand, rng: Rng, target: ShapeId): Question {
  // Mayores: las otras tienen otro número de esquinas.
  const others = rng.shuffle(SHAPES[band].filter((s) => s !== target && (band !== 'big' || CORNERS[s] !== CORNERS[target]))).slice(0, 2);
  const options = toOptions(rng.shuffle([target, ...others]).map((s) => plate(rng, s, band)));
  const prompt: Visual =
    band === 'big' ? { type: 'dots', value: CORNERS[target]! } : { type: 'shape', shape: target, color: 0xb0552f, scale: 1, angle: 0 };
  return {
    kind: 'stego-plates',
    prompt: { layout: 'model', items: [prompt] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `shape:${target}`).map((o) => o.id) },
    hint: band === 'big' ? 'dim-wrong' : 'misfit',
  };
}

export function stegoPlatesQuiz(band: AgeBand, rng: Rng): Question[] {
  // La primera siempre es el triángulo de las placas; luego, otras.
  const targets: ShapeId[] = ['triangle', ...rng.shuffle(SHAPES[band].filter((s) => s !== 'triangle'))];
  return distinctQuestions((i) => question(band, rng, targets[i % targets.length]!));
}
