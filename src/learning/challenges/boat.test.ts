import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { boatCapacity, boatChallenge } from './boat';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];

describe('la barca de diez', () => {
  it('capacidad por franja: 5, 10 y 20', () => {
    expect(BANDS.map(boatCapacity)).toEqual([5, 10, 20]);
  });

  it.each(BANDS)('%s: alguien sentado, algún asiento libre y tres opciones distintas en rango', (band) => {
    for (let seed = 1; seed <= 300; seed++) {
      const b = boatChallenge(band, createRng(seed));
      expect(b.capacity).toBe(boatCapacity(band));
      expect(b.seated).toBeGreaterThanOrEqual(1);
      expect(b.value).toBeGreaterThanOrEqual(1);
      expect(b.seated + b.value).toBe(b.capacity);
      const opts = b.options.map((o) => o.value);
      expect(new Set(opts).size).toBe(3);
      expect(opts[b.correct]).toBe(b.value);
      for (const v of opts) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThan(b.capacity);
      }
    }
  });

  it('caras: puntos en la barca de 5 y de 10, marcos en la doble', () => {
    expect(boatChallenge('small', createRng(3)).options.every((o) => o.type === 'dots')).toBe(true);
    expect(boatChallenge('medium', createRng(3)).options.every((o) => o.type === 'dots')).toBe(true);
    expect(boatChallenge('big', createRng(3)).options.every((o) => o.type === 'tenframe')).toBe(true);
  });

  it('pequeños: los bloques van de 1 a 4 puntos', () => {
    for (let seed = 1; seed <= 100; seed++) {
      for (const o of boatChallenge('small', createRng(seed)).options) expect(o.value).toBeLessThanOrEqual(4);
    }
  });

  it('misma semilla, misma barca; las respuestas varían', () => {
    expect(boatChallenge('medium', createRng(42))).toEqual(boatChallenge('medium', createRng(42)));
    const values = new Set(Array.from({ length: 50 }, (_, s) => boatChallenge('medium', createRng(s + 1)).value));
    expect(values.size).toBeGreaterThan(5);
  });
});
