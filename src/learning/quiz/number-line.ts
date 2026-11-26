/**
 * «¿Dónde va?» (mundo 2, nivel 5): una recta con algunos números a la vista y una tarjeta con otro; se toca
 * su sitio en la recta. Los pequeños, del 1 al 5 con puntos; los medianos, del 0 al 10; los mayores, del 0
 * al 20 de 2 en 2.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

const LINES: Record<AgeBand, { from: number; to: number; step: number; labels: number[] }> = {
  small: { from: 1, to: 5, step: 1, labels: [1] },
  medium: { from: 0, to: 10, step: 1, labels: [0, 5, 10] },
  big: { from: 0, to: 20, step: 2, labels: [0, 10, 20] },
};

function question(band: AgeBand, rng: Rng): Question {
  const line = LINES[band];
  const points = Array.from({ length: (line.to - line.from) / line.step + 1 }, (_, i) => line.from + i * line.step);
  const free = points.filter((v) => !line.labels.includes(v));
  const target = rng.pick(free);
  // Sitios que se pueden tocar: separados al menos dos marcas (caben dedos de niño) salvo en la recta corta.
  let spots: number[];
  if (band === 'small') spots = free;
  else {
    // Tres sitios separados al menos dos marcas, para que quepan los dedos (y cerca del bueno si se puede).
    const gap = 2 * line.step;
    spots = [target];
    // Primero los cercanos (a cinco marcas como mucho) en desorden, para que el bueno no quede siempre en medio.
    const others = free.filter((v) => v !== target);
    const near = [...rng.shuffle(others.filter((v) => Math.abs(v - target) <= 5 * line.step)), ...others.filter((v) => Math.abs(v - target) > 5 * line.step)];
    for (const v of near) {
      if (spots.length >= 3) break;
      if (spots.every((o) => Math.abs(o - v) >= gap)) spots.push(v);
    }
    spots.sort((a, b) => a - b);
  }
  const options = toOptions(
    spots.map((v): Visual => ({ type: 'digit', value: v })),
    'scene',
  );
  const card: Visual = band === 'small' ? { type: 'dots', value: target } : { type: 'digit', value: target };
  return {
    kind: 'number-line',
    prompt: { layout: 'number-line', items: [card], scene: { kind: 'number-line', ...line, target } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual.type === 'digit' && o.visual.value === target).map((o) => o.id) },
    hint: 'hop',
  };
}

export function numberLineQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
