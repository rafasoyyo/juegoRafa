/** «Las letras de tu nombre»: el alias del perfil, en letras grandes. */

import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

export const ALPHABET = [...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'];

const letter = (char: string): Visual => ({ type: 'letter', char });

/** Letras que no están en el alias, para los distractores. */
function distractors(rng: Rng, alias: string, n: number): string[] {
  const used = new Set(alias);
  return rng.shuffle(ALPHABET.filter((c) => !used.has(c))).slice(0, n);
}

/** Posiciones para tres preguntas: distintas si el alias lo permite. */
function positions(rng: Rng, alias: string, sequential: boolean): number[] {
  const all = Array.from({ length: alias.length }, (_, i) => i);
  const picked = sequential ? all : rng.shuffle(all);
  return [0, 1, 2].map((i) => picked[i % picked.length]!);
}

function choiceQuestion(rng: Rng, alias: string, index: number, nOptions: number, mode: 'highlight' | 'hole'): Question {
  const char = alias[index]!;
  const options = toOptions(rng.shuffle([char, ...distractors(rng, alias, nOptions - 1)]).map(letter));
  return {
    kind: 'name-letters',
    prompt: { layout: 'row', items: [...alias].map(letter), ...(mode === 'hole' ? { holeIndex: index } : { highlightIndex: index }) },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `letter:${char}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

function orderQuestion(rng: Rng, alias: string): Question {
  const chars = [...alias];
  let shuffled = rng.shuffle(chars);
  // Que no salga ya ordenado (si el alias tiene letras distintas).
  for (let t = 0; t < 10 && shuffled.join('') === alias; t++) shuffled = rng.shuffle(chars);
  const options = toOptions(shuffled.map(letter));
  // Objetivo: para cada letra del alias, una opción con esa letra (en el orden del alias).
  const free = new Set(options.map((o) => o.id));
  const targets = chars.map((c) => {
    const o = options.find((op) => free.has(op.id) && op.key === `letter:${c}`)!;
    free.delete(o.id);
    return o.id;
  });
  return {
    kind: 'name-letters',
    prompt: { layout: 'row', items: chars.map(() => ({ type: 'letter' as const, char: '' })) },
    options,
    answer: { form: 'multi', targets, ordered: true },
    hint: 'dim-wrong',
  };
}

export function nameLettersQuiz(band: AgeBand, rng: Rng, alias: string): Question[] {
  const name = alias.length > 0 ? alias : 'ZORRO';
  if (band === 'small') return positions(rng, name, true).map((i) => choiceQuestion(rng, name, i, 3, 'highlight'));
  if (band === 'medium') return positions(rng, name, false).map((i) => choiceQuestion(rng, name, i, 3, 'hole'));
  const [a, b, c] = positions(rng, name, false);
  const holes = [choiceQuestion(rng, name, a!, 4, 'hole'), choiceQuestion(rng, name, b!, 4, 'hole')];
  return [...holes, name.length >= 2 ? orderQuestion(rng, name) : choiceQuestion(rng, name, c!, 4, 'hole')];
}
