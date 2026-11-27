import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { caveDoorChallenge, doorKey, DOOR_SHAPES } from './cave-door';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];

describe('la puerta de la cueva', () => {
  it.each(BANDS)('%s: tres bloques distintos y derechos, y el bueno es la forma del hueco', (band) => {
    for (let seed = 1; seed <= 200; seed++) {
      const c = caveDoorChallenge(band, createRng(seed));
      expect(c.options).toHaveLength(3);
      expect(new Set(c.options.map(doorKey)).size).toBe(3);
      for (const o of c.options) expect(o.angle).toBe(0);
      expect(doorKey(c.options[c.correct]!)).toBe(doorKey({ ...c.hole, angle: 0 }));
    }
  });

  it('pequeños: círculo, cuadrado y triángulo, sin girar', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const c = caveDoorChallenge('small', createRng(seed));
      expect(c.hole.angle).toBe(0);
      for (const o of c.options) expect(o.type === 'shape' && DOOR_SHAPES.small.includes(o.shape)).toBe(true);
    }
  });

  it('medianos: a veces el hueco está girado un cuarto de vuelta, solo si se nota', () => {
    const angles = new Set<number>();
    for (let seed = 1; seed <= 200; seed++) {
      const c = caveDoorChallenge('medium', createRng(seed));
      angles.add(c.hole.angle);
      expect([0, 90]).toContain(c.hole.angle);
      if (c.hole.type === 'shape' && (c.hole.shape === 'circle' || c.hole.shape === 'square')) expect(c.hole.angle).toBe(0);
    }
    expect(angles).toEqual(new Set([0, 90]));
  });

  it('mayores: pieza girada y, entre los bloques, la misma volteada', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const c = caveDoorChallenge('big', createRng(seed));
      if (c.hole.type !== 'piece') throw new Error('pieza');
      expect(c.hole.angle).not.toBe(0);
      expect(c.hole.mirrored).toBe(false);
      const hole = c.hole;
      expect(c.options.some((o) => o.type === 'piece' && o.piece === hole.piece && o.mirrored)).toBe(true);
    }
  });

  it('con la misma semilla sale lo mismo', () => {
    expect(caveDoorChallenge('medium', createRng(7))).toEqual(caveDoorChallenge('medium', createRng(7)));
  });
});
