/**
 * «Huellas en la nieve»: Rufo da un paso por cada flecha de la tira. Pequeños y medianos tocan la casilla
 * a la que llega; mayores eligen entre 3 tiras la que lo lleva hasta la fresa.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Dir, type GridCell, type LandmarkId, type Option, type Question } from './types';

export const DIRS: readonly Dir[] = ['up', 'down', 'left', 'right'];
const STEP: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const LANDMARKS: readonly LandmarkId[] = ['pine', 'snowman', 'igloo'];

/** Casilla a la que se llega, o `null` si algún paso sale de la cuadrícula. */
export function walk(start: GridCell, path: readonly Dir[], size: number): GridCell | null {
  let { row, col } = start;
  for (const d of path) {
    row += STEP[d][0];
    col += STEP[d][1];
    if (row < 0 || col < 0 || row >= size || col >= size) return null;
  }
  return { row, col };
}

const same = (a: GridCell, b: GridCell): boolean => a.row === b.row && a.col === b.col;

/** Paseo aleatorio de `len` pasos que no sale de la cuadrícula y no acaba en la salida. */
function randomPath(rng: Rng, size: number, start: GridCell, len: number): { path: Dir[]; end: GridCell } {
  for (;;) {
    const path: Dir[] = [];
    let cur = start;
    for (let i = 0; i < len; i++) {
      const options = DIRS.filter((d) => walk(cur, [d], size));
      const d = rng.pick(options);
      path.push(d);
      cur = walk(cur, [d], size)!;
    }
    if (!same(cur, start)) return { path, end: cur };
  }
}

/** Mutaciones de una tira (cambiar una flecha o intercambiar dos) que siguen dentro y no acaban en `goal`. */
function mutations(rng: Rng, size: number, start: GridCell, path: Dir[], goal: GridCell): Dir[][] {
  const out = new Map<string, Dir[]>();
  const add = (p: Dir[]): void => {
    const end = walk(start, p, size);
    if (end && !same(end, goal) && p.join() !== path.join()) out.set(p.join(), p);
  };
  for (let i = 0; i < path.length; i++) {
    for (const d of DIRS) if (d !== path[i]) add(path.map((x, k) => (k === i ? d : x)));
    for (let j = i + 1; j < path.length; j++) {
      if (path[i] === path[j]) continue;
      const p = [...path];
      [p[i], p[j]] = [p[j]!, p[i]!];
      add(p);
    }
  }
  return rng.shuffle([...out.values()]);
}

function question(band: AgeBand, rng: Rng): Question {
  const size = band === 'small' ? 3 : 4;
  const len = band === 'small' ? rng.int(1, 2) : band === 'medium' ? rng.int(3, 4) : rng.int(4, 6);
  for (;;) {
    const start: GridCell = { row: rng.int(0, size - 1), col: rng.int(0, size - 1) };
    const { path, end } = randomPath(rng, size, start, len);

    if (band === 'big') {
      const wrong = mutations(rng, size, start, path, end).slice(0, 2);
      if (wrong.length < 2) continue;
      const strips = rng.shuffle([path, ...wrong]);
      const options = toOptions(strips.map((dirs) => ({ type: 'arrows' as const, dirs })));
      const correct = strips.indexOf(path);
      return {
        kind: 'tracks',
        prompt: {
          layout: 'tracks',
          items: [],
          scene: { kind: 'tracks', size, start, goal: end, path, showStrip: false, end, landmarks: [] },
        },
        options,
        answer: { form: 'choice', correct: [correct] },
        hint: 'dim-wrong',
      };
    }

    const cells: GridCell[] = [];
    for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) if (!(row === start.row && col === start.col)) cells.push({ row, col });
    let options: Option[];
    let correct: number;
    let landmarks: { cell: GridCell; id: LandmarkId }[] = [];
    if (band === 'small') {
      // 3 destinos con dibujo distinto, uno de ellos la casilla a la que llega Rufo.
      const others = rng.shuffle(cells.filter((c) => !same(c, end))).slice(0, 2);
      const spots = rng.shuffle([end, ...others]);
      const ids = rng.shuffle(LANDMARKS);
      landmarks = spots.map((cell, i) => ({ cell, id: ids[i]! }));
      options = toOptions(landmarks.map((l) => ({ type: 'landmark' as const, id: l.id })), 'scene');
      correct = spots.findIndex((c) => same(c, end));
    } else {
      options = toOptions(cells.map((c) => ({ type: 'cell' as const, row: c.row, col: c.col, painted: false })), 'scene');
      correct = cells.findIndex((c) => same(c, end));
    }
    return {
      kind: 'tracks',
      prompt: {
        layout: 'tracks',
        items: [{ type: 'arrows', dirs: path }],
        scene: { kind: 'tracks', size, start, path, showStrip: true, end, landmarks },
      },
      options,
      answer: { form: 'choice', correct: [correct] },
      hint: 'ghost-walk',
    };
  }
}

export function tracksQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
