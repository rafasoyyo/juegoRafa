/**
 * «Los huevos de la familia» (mundo 3, nivel 6): en el nido hay tres huevos de una familia; de los cuatro
 * de abajo, uno no es de ella. Pequeños: la familia es de un color. Medianos: la familia es de un dibujo
 * (manchas o rayas) aunque cambie el color. Mayores: la familia tiene un color y un dibujo, y el que no es
 * comparte uno de los dos.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type EggPattern, type Question, type Visual } from './types';

/** Colores de los huevos (índices de la paleta de `quiz/island-art`). */
export const EGG_COLORS = 4;
const PATTERNS: EggPattern[] = ['plain', 'spots', 'stripes'];

type Egg = { color: number; pattern: EggPattern };

function question(band: AgeBand, rng: Rng): Question {
  const colors = rng.shuffle(Array.from({ length: EGG_COLORS }, (_, i) => i));
  const patterns = rng.shuffle(PATTERNS);
  let family: () => Egg;
  let odd: Egg;
  if (band === 'small') {
    const p = rng.pick(PATTERNS);
    family = () => ({ color: colors[0]!, pattern: p });
    odd = { color: colors[1]!, pattern: p };
  } else if (band === 'medium') {
    // Mismo dibujo, color variado; el raro tiene otro dibujo.
    let k = 0;
    family = () => ({ color: colors[k++ % 3]!, pattern: patterns[0]! });
    odd = { color: rng.pick(colors.slice(0, 3)), pattern: patterns[1]! };
  } else {
    family = () => ({ color: colors[0]!, pattern: patterns[0]! });
    odd = rng.chance(0.5) ? { color: colors[0]!, pattern: patterns[1]! } : { color: colors[1]!, pattern: patterns[0]! };
  }
  const nest = [family(), family(), family()];
  const eggs: Visual[] = [family(), family(), family()].map((e) => ({ type: 'egg', ...e, scale: band === 'small' ? 1 : rng.pick([0.8, 0.9, 1]) }));
  const oddVisual: Visual = { type: 'egg', ...odd, scale: 0.9 };
  // Cada opción ha de ser distinta: si dos huevos de la familia salen iguales, se cambia el tamaño.
  const seen = new Set<string>();
  const scales = [1, 0.9, 0.8, 0.7];
  for (const e of eggs) {
    if (e.type !== 'egg') continue;
    let i = 0;
    while (seen.has(`${e.color}${e.pattern}${e.scale}`)) e.scale = scales[i++]!;
    seen.add(`${e.color}${e.pattern}${e.scale}`);
  }
  const options = toOptions(rng.shuffle([...eggs, oddVisual]));
  return {
    kind: 'odd-egg',
    prompt: { layout: 'picture', items: [{ type: 'nest', eggs: nest }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual === oddVisual).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function oddEggQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
