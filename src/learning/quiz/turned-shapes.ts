/**
 * «Igual aunque gire» (mundo 3, nivel 4): una pieza sin simetría y tres para elegir la misma. Pequeños:
 * sin girar, entre piezas distintas. Medianos: girada un cuarto de vuelta. Mayores: cualquier giro, y una
 * de las otras es la misma pieza volteada (que ya no es la misma).
 */

import { distinctQuestions, PIECE_COLORS } from './helpers';
import type { Rng } from './rng';
import { PIECES, toOptions, type AgeBand, type PieceId, type Question, type Visual } from './types';

function piece(piece: PieceId, angle: number, mirrored: boolean, color: number): Visual {
  return { type: 'piece', piece, angle, mirrored, color };
}

function question(band: AgeBand, rng: Rng, model: PieceId): Question {
  const color = rng.pick(PIECE_COLORS);
  const others = rng.shuffle(PIECES.filter((p) => p !== model));
  let turn = 0;
  if (band === 'medium') turn = rng.pick([90, 270]);
  if (band === 'big') turn = rng.pick([90, 180, 270]);
  const answer = piece(model, turn, false, color);
  const wrong: Visual[] =
    band === 'big'
      ? [piece(model, rng.pick([0, 90, 180, 270]), true, color), piece(others[0]!, turn, false, color)]
      : [piece(others[0]!, turn, false, color), piece(others[1]!, turn, false, color)];
  const options = toOptions(rng.shuffle([answer, ...wrong]));
  const key = options.find((o) => o.visual === answer)!.key;
  return {
    kind: 'turned-shapes',
    prompt: { layout: 'model', items: [piece(model, 0, false, color)] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === key).map((o) => o.id) },
    hint: 'misfit',
  };
}

export function turnedShapesQuiz(band: AgeBand, rng: Rng): Question[] {
  const models = rng.shuffle(PIECES);
  return distinctQuestions((i) => question(band, rng, models[i % models.length]!));
}
