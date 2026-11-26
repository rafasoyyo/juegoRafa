import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { BRIDGE_SECTIONS, bridgeChallenge, MIN_FIRM_BEFORE } from './bridge';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const RANGE: Record<AgeBand, [number, number]> = { small: [1, 5], medium: [1, 10], big: [0, 20] };

describe('el puente de los números', () => {
  it.each(BANDS)('%s: 5 tramos, hueco con dos firmes delante y tres opciones distintas en el rango', (band) => {
    const [min, max] = RANGE[band];
    for (let seed = 1; seed <= 300; seed++) {
      const b = bridgeChallenge(band, createRng(seed));
      expect(b.values).toHaveLength(BRIDGE_SECTIONS);
      expect(b.gap).toBeGreaterThanOrEqual(MIN_FIRM_BEFORE);
      expect(b.gap).toBeLessThan(BRIDGE_SECTIONS);
      expect(b.value).toBe(b.values[b.gap]);
      expect(b.shown[b.gap]).toBe(false);
      expect(b.shown.some(Boolean)).toBe(true);
      const opts = b.options.map((o) => o.value);
      expect(new Set(opts).size).toBe(3);
      expect(opts[b.correct]).toBe(b.value);
      for (const v of [...b.values, ...opts]) {
        expect(v).toBeGreaterThanOrEqual(min);
        expect(v).toBeLessThanOrEqual(max);
      }
    }
  });

  it('pequeños: el siguiente del 1 al 5, con puntos y solo los tramos de antes', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const b = bridgeChallenge('small', createRng(seed));
      expect(b.values).toEqual([1, 2, 3, 4, 5]);
      expect(b.shown).toEqual(b.values.map((_, i) => i < b.gap));
      for (const f of [...b.faces, ...b.options]) expect(f.type).toBe('dots');
    }
  });

  it('medianos: unas veces el siguiente (se ven los de antes) y otras el anterior (se ven los de después)', () => {
    const kinds = new Set<string>();
    for (let seed = 1; seed <= 100; seed++) {
      const b = bridgeChallenge('medium', createRng(seed));
      for (let i = 1; i < b.values.length; i++) expect(b.values[i]! - b.values[i - 1]!).toBe(1);
      const before = b.shown.slice(0, b.gap).every(Boolean) && !b.shown.slice(b.gap + 1).some(Boolean);
      const after = !b.shown.slice(0, b.gap).some(Boolean) && b.shown.slice(b.gap + 1).every(Boolean) && b.gap < BRIDGE_SECTIONS - 1;
      expect(before || after).toBe(true);
      kinds.add(before ? 'siguiente' : 'anterior');
      for (const f of b.options) expect(f.type).toBe('digit');
    }
    expect(kinds).toEqual(new Set(['siguiente', 'anterior']));
  });

  it('mayores: de 2 en 2, todo a la vista', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const b = bridgeChallenge('big', createRng(seed));
      for (let i = 1; i < b.values.length; i++) expect(b.values[i]! - b.values[i - 1]!).toBe(2);
      expect(b.shown.filter(Boolean)).toHaveLength(BRIDGE_SECTIONS - 1);
    }
  });

  it('determinista con la misma semilla', () => {
    expect(bridgeChallenge('medium', createRng(9))).toEqual(bridgeChallenge('medium', createRng(9)));
  });
});
