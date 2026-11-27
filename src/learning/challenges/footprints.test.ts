import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { FOOTPRINT_PATTERNS, FOOTPRINT_SLABS, footprintsChallenge, glyphKey, MAX_GLYPH_COUNT, type FootprintsChallenge } from './footprints';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];

/** Letras de la serie (A, B, C…) según los grabados de las losas. */
function letters(c: FootprintsChallenge): string {
  const seen = new Map<string, string>();
  return c.slabs
    .map((g) => {
      const k = glyphKey(g);
      if (!seen.has(k)) seen.set(k, String.fromCharCode(65 + seen.size));
      return seen.get(k)!;
    })
    .join('');
}

describe('el camino de huellas', () => {
  it.each(BANDS)('%s: 5 losas, una vuelta entera antes del hueco y tres bloques distintos con la respuesta', (band) => {
    for (let seed = 1; seed <= 300; seed++) {
      const c = footprintsChallenge(band, createRng(seed));
      expect(FOOTPRINT_PATTERNS[band]).toContain(c.pattern);
      expect(c.slabs).toHaveLength(FOOTPRINT_SLABS);
      expect(c.notes).toHaveLength(FOOTPRINT_SLABS);
      expect(c.gap).toBeGreaterThanOrEqual(c.pattern === 'grow' ? 2 : c.pattern.length);
      expect(c.gap).toBeLessThan(FOOTPRINT_SLABS);
      expect(new Set(c.options.map(glyphKey)).size).toBe(3);
      expect(glyphKey(c.options[c.correct]!)).toBe(glyphKey(c.slabs[c.gap]!));
      // La misma forma suena siempre igual.
      for (let i = 0; i < FOOTPRINT_SLABS; i++) {
        for (let j = 0; j < FOOTPRINT_SLABS; j++) {
          expect(c.notes[i] === c.notes[j]).toBe(glyphKey(c.slabs[i]!) === glyphKey(c.slabs[j]!));
        }
      }
    }
  });

  it('pequeños: AB de círculos que solo cambian de color', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const c = footprintsChallenge('small', createRng(seed));
      expect(letters(c)).toBe('ABABA');
      expect(c.gap).toBeGreaterThanOrEqual(3);
      for (const g of [...c.slabs, ...c.options]) expect([g.shape, g.count]).toEqual(['circle', 1]);
      expect(new Set(c.options.map((g) => g.color)).size).toBe(3);
    }
  });

  it('medianos: AB, ABB y AAB con formas de un solo color', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      const c = footprintsChallenge('medium', createRng(seed));
      const unit = c.pattern;
      expect(letters(c)).toBe(Array.from({ length: FOOTPRINT_SLABS }, (_, i) => unit[i % unit.length]).join(''));
      expect(new Set([...c.slabs, ...c.options].map((g) => g.color)).size).toBe(1);
      expect(new Set(c.options.map((g) => g.shape)).size).toBe(3);
      seen.add(unit);
    }
    expect(seen).toEqual(new Set(['AB', 'ABB', 'AAB']));
  });

  it('mayores: ABC con tres formas y series que crecen de una en una', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      const c = footprintsChallenge('big', createRng(seed));
      seen.add(c.pattern);
      if (c.pattern === 'ABC') {
        expect(letters(c)).toBe('ABCAB');
        expect(new Set(c.options.map((g) => g.shape)).size).toBe(3);
      } else {
        expect(c.slabs.map((g) => g.count)).toEqual([1, 2, 3, 4, 5]);
        for (const g of c.options) {
          expect(g.count).toBeGreaterThanOrEqual(1);
          expect(g.count).toBeLessThanOrEqual(MAX_GLYPH_COUNT);
          expect(g.shape).toBe(c.slabs[0]!.shape);
        }
      }
    }
    expect(seen).toEqual(new Set(['ABC', 'grow']));
  });

  it('misma semilla, mismo puente; las series varían', () => {
    expect(footprintsChallenge('medium', createRng(42))).toEqual(footprintsChallenge('medium', createRng(42)));
    const rows = new Set(Array.from({ length: 40 }, (_, s) => footprintsChallenge('medium', createRng(s + 1)).slabs.map(glyphKey).join('|')));
    expect(rows.size).toBeGreaterThan(10);
  });
});
