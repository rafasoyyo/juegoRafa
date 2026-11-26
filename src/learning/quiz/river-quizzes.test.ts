import { describe, expect, it } from 'vitest';
import { biggestQuiz } from './biggest';
import { fingersQuiz, handsFor } from './fingers';
import { memoryQuiz } from './memory';
import { neighborQuiz } from './neighbor';
import { numberLineQuiz } from './number-line';
import { createRng } from './rng';
import { tenFrameQuiz } from './ten-frame';
import { questionKey, type AgeBand, type Question, type SceneData, type Visual } from './types';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const SEEDS = Array.from({ length: 150 }, (_, i) => i + 1);

/** Tres preguntas distintas, opciones distintas y una sola respuesta, que está entre ellas. */
function check(qs: Question[]): void {
  expect(qs).toHaveLength(3);
  expect(new Set(qs.map(questionKey)).size).toBe(3);
  for (const q of qs) {
    q.options.forEach((o, i) => expect(o.id).toBe(i));
    expect(new Set(q.options.map((o) => o.key)).size).toBe(q.options.length);
    expect(q.answer.form).toBe('choice');
    if (q.answer.form === 'choice') expect(q.answer.correct).toHaveLength(1);
  }
}

const value = (v: Visual): number => (v.type === 'digit' || v.type === 'dots' ? v.value : NaN);
const answer = (q: Question): number => {
  if (q.answer.form !== 'choice') throw new Error('choice');
  return value(q.options[q.answer.correct[0]!]!.visual);
};
type Of<K extends SceneData['kind']> = Extract<SceneData, { kind: K }>;
const scene = <K extends SceneData['kind']>(q: Question, kind: K): Of<K> => {
  expect(q.prompt.scene?.kind).toBe(kind);
  return q.prompt.scene as Of<K>;
};

describe('¿Cuántos dedos?', () => {
  it.each(BANDS)('%s: la respuesta es la suma de los dedos, con manos de 0 a 5', (band) => {
    for (const seed of SEEDS) {
      const qs = fingersQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const { hands } = scene(q, 'fingers');
        for (const h of hands) expect(h).toBeGreaterThanOrEqual(0), expect(h).toBeLessThanOrEqual(5);
        expect(answer(q)).toBe(hands.reduce((a, b) => a + b, 0));
        expect(q.options.every((o) => o.visual.type === (band === 'small' ? 'dots' : 'digit'))).toBe(true);
      }
    }
  });

  it('pequeños, una mano; medianos, la primera llena antes de usar la segunda', () => {
    expect(handsFor('small', 4, createRng(1))).toEqual([4]);
    expect(handsFor('medium', 4, createRng(1))).toEqual([4]);
    expect(handsFor('medium', 8, createRng(1))).toEqual([5, 3]);
  });
});

describe('El marco de diez', () => {
  it.each(BANDS)('%s: marco de 5 o de 10 y pregunta por las fichas (o lo que falta, los mayores)', (band) => {
    for (const seed of SEEDS) {
      const qs = tenFrameQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const s = scene(q, 'ten-frame');
        expect(s.cells).toBe(band === 'small' ? 5 : 10);
        expect(s.filled).toBeGreaterThanOrEqual(1);
        expect(s.filled).toBeLessThanOrEqual(s.cells);
        expect(answer(q)).toBe(s.ask === 'missing' ? s.cells - s.filled : s.filled);
        expect(s.ask).toBe(band === 'big' ? 'missing' : 'count');
      }
    }
  });
});

describe('Parejas', () => {
  it.each(BANDS)('%s: una carta hace pareja con la cantidad de la consigna', (band) => {
    for (const seed of SEEDS) {
      const qs = memoryQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const item = q.prompt.items[0]!;
        expect(item.type).toBe('objects');
        if (item.type === 'objects') expect(answer(q)).toBe(item.count);
        expect(q.options.every((o) => o.place === 'scene')).toBe(true);
        expect(scene(q, 'memory').showMs).toBeGreaterThanOrEqual(2500);
      }
    }
  });
});

describe('El vecino', () => {
  it.each(BANDS)('%s: el hueco es el anterior, el siguiente o el de en medio', (band) => {
    const max = band === 'small' ? 5 : band === 'medium' ? 10 : 20;
    for (const seed of SEEDS) {
      const qs = neighborQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const items = q.prompt.items.map(value);
        const hole = q.prompt.holeIndex!;
        const a = answer(q);
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(max);
        items.forEach((v, i) => {
          if (i !== hole) expect(v).toBe(a + (i - hole));
        });
        if (band === 'small') expect(hole).toBe(items.length - 1);
      }
    }
  });
});

describe('¿Dónde va?', () => {
  it.each(BANDS)('%s: el sitio bueno es el del número de la tarjeta y los sitios están separados', (band) => {
    for (const seed of SEEDS) {
      const qs = numberLineQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const s = scene(q, 'number-line');
        expect(answer(q)).toBe(s.target);
        expect(value(q.prompt.items[0]!)).toBe(s.target);
        expect(s.labels).not.toContain(s.target);
        const spots = q.options.map((o) => value(o.visual)).sort((x, y) => x - y);
        expect(spots.length).toBeGreaterThanOrEqual(3);
        for (const v of spots) expect((v - s.from) % s.step).toBe(0);
        if (band !== 'small') for (let i = 1; i < spots.length; i++) expect(spots[i]! - spots[i - 1]!).toBeGreaterThanOrEqual(2 * s.step);
      }
    }
  });

  it('el bueno no está siempre en medio', () => {
    const positions = new Set(SEEDS.map((seed) => {
      const q = numberLineQuiz('medium', createRng(seed))[0]!;
      return q.answer.form === 'choice' ? q.answer.correct[0] : -1;
    }));
    expect(positions.size).toBe(3);
  });
});

describe('El número más grande', () => {
  it.each(BANDS)('%s: la cesta llena pide el mayor y la vacía, el menor', (band) => {
    for (const seed of SEEDS) {
      const qs = biggestQuiz(band, createRng(seed));
      check(qs);
      for (const q of qs) {
        const vs = q.options.map((o) => value(o.visual));
        const basket = q.prompt.items[0]!;
        if (basket.type !== 'basket') throw new Error('cesta');
        expect(answer(q)).toBe(basket.full ? Math.max(...vs) : Math.min(...vs));
        if (band === 'small') expect(basket.full).toBe(true);
      }
    }
  });
});
