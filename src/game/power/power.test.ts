import { describe, expect, it } from 'vitest';
import { loseCookie, pickFruitBlock, POWER_MS, POWER_WARN_MS, powerPhase } from './power';

/** Generador con semilla (mulberry32) para repetir las elecciones. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEEDS = Array.from({ length: 50 }, (_, i) => i + 1);

describe('pickFruitBlock', () => {
  it.each([1, 2, 5, 9])('con %i bloques siempre elige un índice válido', (n) => {
    for (const seed of SEEDS) {
      const i = pickFruitBlock(n, seeded(seed));
      expect(Number.isInteger(i)).toBe(true);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(n - 1);
    }
  });

  it('con semillas distintas sale de bloques distintos', () => {
    const picked = new Set(SEEDS.map((seed) => pickFruitBlock(6, seeded(seed))));
    expect(picked.size).toBeGreaterThan(1);
  });

  it('con la misma semilla repite el bloque', () => {
    expect(pickFruitBlock(7, seeded(3))).toBe(pickFruitBlock(7, seeded(3)));
  });

  it('sin bloques devuelve -1', () => {
    expect(pickFruitBlock(0, seeded(1))).toBe(-1);
  });

  it('aguanta un rng que devuelve el borde superior', () => {
    expect(pickFruitBlock(4, () => 1)).toBe(3);
    expect(pickFruitBlock(4, () => 0)).toBe(0);
  });
});

describe('loseCookie', () => {
  it('con 3 galletas pasa a 2 y se pierde una', () => {
    expect(loseCookie(3)).toEqual({ cookies: 2, lost: true });
  });

  it('con 1 galleta pasa a 0', () => {
    expect(loseCookie(1)).toEqual({ cookies: 0, lost: true });
  });

  it('con 0 galletas se queda en 0 sin perder nada', () => {
    expect(loseCookie(0)).toEqual({ cookies: 0, lost: false });
  });
});

describe('powerPhase', () => {
  const start = 10_000;

  it('dura 8 s y avisa en los 2 últimos', () => {
    expect(POWER_MS).toBe(8000);
    expect(POWER_WARN_MS).toBe(2000);
  });

  it('está encendido de 0 a 5 999 ms', () => {
    expect(powerPhase(start, start)).toBe('on');
    expect(powerPhase(start + 5999, start)).toBe('on');
  });

  it('avisa de 6 000 a 7 999 ms', () => {
    expect(powerPhase(start + 6000, start)).toBe('ending');
    expect(powerPhase(start + 7999, start)).toBe('ending');
  });

  it('se apaga a los 8 000 ms', () => {
    expect(powerPhase(start + 8000, start)).toBe('off');
    expect(powerPhase(start + 60_000, start)).toBe('off');
  });

  it('está apagado si nunca empezó', () => {
    expect(powerPhase(start, -Infinity)).toBe('off');
    expect(powerPhase(0, -Infinity)).toBe('off');
  });

  it('está apagado antes de empezar', () => {
    expect(powerPhase(start - 1, start)).toBe('off');
  });
});
