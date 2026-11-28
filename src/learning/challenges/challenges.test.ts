import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { countChallenges, countRange, type CountSpec, type Face } from './count-blocks';
import { hitBlock, startChallenge, tally } from './ladder';

const SPECS: CountSpec[] = [
  { show: 'dots', reverse: false },
  { show: 'tenframe', reverse: false },
  { show: 'tenframe', reverse: true },
];
const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const isQty = (f: Face): boolean => f.type !== 'digit';

describe('bloques que cuentan', () => {
  it.each(BANDS)('%s: tres bloques distintos, uno correcto, dentro del rango', (band) => {
    const [min, max] = countRange(band);
    for (let seed = 1; seed <= 200; seed++) {
      for (const c of countChallenges(band, createRng(seed), SPECS)) {
        expect(c.options).toHaveLength(3);
        const values = c.options.map((o) => o.value);
        expect(new Set(values).size).toBe(3);
        expect(c.options[c.correct]!.value).toBe(c.value);
        expect(c.sign.value).toBe(c.value);
        for (const v of values) {
          expect(v).toBeGreaterThanOrEqual(min);
          expect(v).toBeLessThanOrEqual(max);
        }
      }
    }
  });

  it('respuestas distintas en un nivel', () => {
    for (let seed = 1; seed <= 100; seed++) {
      for (const band of BANDS) {
        const values = countChallenges(band, createRng(seed), SPECS).map((c) => c.value);
        expect(new Set(values).size).toBe(values.length);
      }
    }
  });

  it('pequeños: puntos con puntos, también al revés', () => {
    for (const c of countChallenges('small', createRng(7), SPECS)) {
      expect(c.sign.type).toBe('dots');
      for (const o of c.options) expect(o.type).toBe('dots');
    }
  });

  it('medianos: de la cantidad a la cifra y, al revés, de la cifra a la cantidad', () => {
    const [dots, frame, reverse] = countChallenges('medium', createRng(3), SPECS);
    expect(dots!.sign.type).toBe('dots');
    expect(frame!.sign.type).toBe('tenframe');
    for (const o of [...dots!.options, ...frame!.options]) expect(o.type).toBe('digit');
    expect(reverse!.sign.type).toBe('digit');
    for (const o of reverse!.options) expect(o.type).toBe('tenframe');
  });

  it('mayores: dos marcos de diez hasta 20', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const [first, , reverse] = countChallenges('big', createRng(seed), SPECS);
      expect(first!.sign.type).toBe('tenframe');
      expect(reverse!.options.every(isQty)).toBe(true);
    }
  });

  it('determinista con la misma semilla', () => {
    expect(countChallenges('medium', createRng(42), SPECS)).toEqual(countChallenges('medium', createRng(42), SPECS));
  });
});

describe('escalera de fallos', () => {
  it('acierto a la primera', () => {
    const run = startChallenge(1);
    expect(hitBlock(run, 1)).toBe('correct');
    expect(run.firstTry).toBe(true);
    expect(hitBlock(run, 0)).toBe('ignored');
  });

  it('tambaleo, conteo y Lalo', () => {
    const run = startChallenge(2);
    expect(hitBlock(run, 0)).toBe('wobble');
    expect(hitBlock(run, 1)).toBe('count-up');
    expect(hitBlock(run, 0)).toBe('solved-by-lalo');
    expect(run.solved).toBe(true);
    expect(run.firstTry).toBe(false);
  });

  it('acierto tras un fallo: resuelto pero no a la primera', () => {
    const run = startChallenge(0);
    hitBlock(run, 1);
    expect(hitBlock(run, 0)).toBe('correct');
    expect(run.firstTry).toBe(false);
  });

  it('la demostración no cuenta', () => {
    const a = startChallenge(0);
    const b = startChallenge(0);
    const c = startChallenge(0);
    hitBlock(a, 0);
    hitBlock(b, 0);
    hitBlock(c, 1);
    hitBlock(c, 0);
    expect(tally([{ run: a, demo: true }, { run: b, demo: false }, { run: c, demo: false }])).toEqual({ firstTry: 1, total: 2 });
  });
});
