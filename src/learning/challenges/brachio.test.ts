import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { area, bounds, brachioChallenge, EMBLEM_UNITS, EMBLEMS, EMBLEMS_BY_BAND, polyKey, turn, type EmblemId, type Poly } from './brachio';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];

describe('paseo en braquiosaurio: los emblemas', () => {
  it.each(Object.keys(EMBLEMS) as EmblemId[])('%s: sus piezas caben en la cuadrícula y no se pisan', (id) => {
    const pieces = EMBLEMS[id] as readonly Poly[];
    for (const p of pieces) {
      const b = bounds(p);
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(EMBLEM_UNITS + 1e-9);
      expect(b.y + b.h).toBeLessThanOrEqual(EMBLEM_UNITS + 1e-9);
    }
    // Sin solaparse: muestreando la cuadrícula, ningún punto cae en dos piezas.
    const inside = (p: Poly, x: number, y: number): boolean => {
      let c = false;
      p.forEach(([x0, y0], i) => {
        const [x1, y1] = p[(i + 1) % p.length]!;
        if (y0 > y !== y1 > y && x < ((x1 - x0) * (y - y0)) / (y1 - y0) + x0) c = !c;
      });
      return c;
    };
    for (let x = 0.05; x < EMBLEM_UNITS; x += 0.1) {
      for (let y = 0.05; y < EMBLEM_UNITS; y += 0.1) expect(pieces.filter((p) => inside(p, x, y)).length).toBeLessThanOrEqual(1);
    }
  });

  it('dos mitades para los pequeños, 2 o 3 piezas para los medianos y 4 para los mayores', () => {
    const counts = (band: AgeBand): number[] => [...new Set(EMBLEMS_BY_BAND[band].map((e) => EMBLEMS[e].length))].sort();
    expect(counts('small')).toEqual([2]);
    expect(counts('medium')).toEqual([2, 3]);
    expect(counts('big')).toEqual([4]);
  });

  it('las dos mitades de los pequeños son iguales de grandes', () => {
    for (const e of EMBLEMS_BY_BAND.small) {
      const [a, b] = EMBLEMS[e] as readonly Poly[];
      expect(area(a!)).toBeCloseTo(area(b!), 5);
    }
  });

  it('girar cuatro cuartos de vuelta deja la pieza como estaba', () => {
    const p = EMBLEMS.tablet[1] as Poly;
    expect(polyKey(turn(turn(turn(turn(p)))))).toBe(polyKey(p));
    expect(polyKey(turn(p))).not.toBe(polyKey(p));
  });
});

describe('paseo en braquiosaurio: el reto', () => {
  it.each(BANDS)('%s: tres bloques distintos y el bueno tiene la forma del hueco', (band) => {
    for (let seed = 1; seed <= 300; seed++) {
      const c = brachioChallenge(band, createRng(seed));
      expect(EMBLEMS_BY_BAND[band]).toContain(c.emblem);
      expect(c.options).toHaveLength(3);
      expect(new Set(c.options.map(polyKey)).size).toBe(3);
      const hole = polyKey(c.pieces[c.missing]!);
      expect(c.options.filter((o) => polyKey(o) === hole)).toHaveLength(1);
      expect(polyKey(c.options[c.correct]!)).toBe(hole);
    }
  });

  it('pequeños: los otros bloques son mitades del mismo lado de otros emblemas', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const c = brachioChallenge('small', createRng(seed));
      const halves = EMBLEMS_BY_BAND.small.map((e) => polyKey(EMBLEMS[e][c.missing] as Poly));
      for (const o of c.options) expect(halves).toContain(polyKey(o));
    }
  });

  it('mayores: a veces uno de los bloques es la pieza buena girada', () => {
    let turned = 0;
    for (let seed = 1; seed <= 100; seed++) {
      const c = brachioChallenge('big', createRng(seed));
      const good = c.options[c.correct]!;
      if (c.options.some((o, i) => i !== c.correct && polyKey(o) === polyKey(turn(good)))) turned++;
    }
    expect(turned).toBeGreaterThan(50);
  });

  it('salen emblemas y huecos variados', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      const c = brachioChallenge('medium', createRng(seed));
      seen.add(`${c.emblem}:${c.missing}`);
    }
    expect(seen.size).toBeGreaterThan(10);
  });

  it('con la misma semilla sale el mismo reto', () => {
    expect(brachioChallenge('big', createRng(7))).toEqual(brachioChallenge('big', createRng(7)));
  });
});
