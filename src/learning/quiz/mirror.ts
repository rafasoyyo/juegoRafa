/**
 * «La otra mitad»: se ve la mitad de un dibujo junto a una línea de espejo y hay que completar la otra.
 * Pequeños y medianos eligen una mitad; mayores tocan las casillas de la derecha que reflejan las pintadas.
 */

import { distinctQuestions } from './helpers';
import { PICTURE_IDS } from './pictures';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type GridCell, type PictureId, type Question } from './types';

export const GRID_ROWS = 4;
export const GRID_COLS = 6;

function pictureQuestion(band: AgeBand, rng: Rng): Question {
  const picture = rng.pick(PICTURE_IDS);
  const half = (p: PictureId, mirrored: boolean, variant: number) => ({ type: 'half' as const, picture: p, mirrored, variant });
  const correct = half(picture, true, 0);
  const wrong =
    band === 'small'
      ? rng.shuffle(PICTURE_IDS.filter((p) => p !== picture)).slice(0, 2).map((p) => half(p, true, 0))
      : [half(picture, false, 0), half(picture, true, 1)];
  const options = toOptions(rng.shuffle([correct, ...wrong]));
  return {
    kind: 'mirror',
    prompt: { layout: 'mirror', items: [half(picture, false, 0)], scene: { kind: 'mirror', mode: 'picture', picture } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === 'half:' + picture + ':m:0').map((o) => o.id) },
    hint: 'fold',
  };
}

function gridQuestion(rng: Rng): Question {
  const half = GRID_COLS / 2;
  const leftCells: GridCell[] = [];
  for (let row = 0; row < GRID_ROWS; row++) for (let col = 0; col < half; col++) leftCells.push({ row, col });
  const painted = rng.shuffle(leftCells).slice(0, rng.int(3, 6)).sort((a, b) => a.row - b.row || a.col - b.col);
  // Opciones: las 12 casillas de la derecha, por filas.
  const rightCells: GridCell[] = [];
  for (let row = 0; row < GRID_ROWS; row++) for (let col = half; col < GRID_COLS; col++) rightCells.push({ row, col });
  const options = toOptions(
    rightCells.map((c) => ({ type: 'cell' as const, row: c.row, col: c.col, painted: false })),
    'scene',
  );
  const targets = painted.map((c) => rightCells.findIndex((r) => r.row === c.row && r.col === GRID_COLS - 1 - c.col));
  return {
    kind: 'mirror',
    prompt: { layout: 'mirror', items: [], scene: { kind: 'mirror', mode: 'grid', rows: GRID_ROWS, cols: GRID_COLS, painted } },
    options,
    answer: { form: 'multi', targets, ordered: false },
    hint: 'fold',
  };
}

export function mirrorQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => (band === 'big' ? gridQuestion(rng) : pictureQuestion(band, rng)));
}
