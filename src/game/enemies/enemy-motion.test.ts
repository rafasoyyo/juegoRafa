import { describe, expect, it } from 'vitest';
import { GROUND_TOP } from '../level-course';
import { BEE_PERIOD_MS, beeBox, beePosition, HEDGEHOG_BOX, HEDGEHOG_SPEED, hedgehogBox, hedgehogX, overlaps, type Rect } from './enemy-motion';

/** Cuerpo del zorro de pie (56×87), con la parte de arriba en y ≈ 528 como en el diseño. */
const FOX_STANDING: Rect = { x: 1000 - 28, y: 528, w: 56, h: GROUND_TOP - 528 };
/** Altura del salto del zorro: 1056² / (2 · 2880). */
const FOX_JUMP_HEIGHT = 1056 ** 2 / (2 * 2880);

describe('hedgehogX', () => {
  const patrol = { minX: 1200, maxX: 1520, phase: 0.3 };
  /** Tres idas y vueltas completas. */
  const SPAN_MS = ((3 * 2 * (patrol.maxX - patrol.minX)) / HEDGEHOG_SPEED) * 1000;

  it('nunca sale de [minX, maxX]', () => {
    for (let t = 0; t < SPAN_MS; t += 7) {
      const { x } = hedgehogX(t, patrol);
      expect(x).toBeGreaterThanOrEqual(patrol.minX);
      expect(x).toBeLessThanOrEqual(patrol.maxX);
    }
  });

  it('cambia de sentido en cada extremo y mira hacia donde anda', () => {
    let prev = hedgehogX(0, patrol);
    const turns: number[] = [];
    for (let t = 10; t < SPAN_MS; t += 10) {
      const cur = hedgehogX(t, patrol);
      if (cur.facing !== prev.facing) turns.push(cur.x);
      else expect(Math.sign(cur.x - prev.x) || cur.facing).toBe(cur.facing);
      prev = cur;
    }
    expect(turns.length).toBeGreaterThanOrEqual(5);
    for (const x of turns) expect(Math.min(Math.abs(x - patrol.minX), Math.abs(x - patrol.maxX))).toBeLessThan(2);
  });

  it('con tramo nulo se queda quieto', () => {
    expect(hedgehogX(1234, { minX: 900, maxX: 900, phase: 0.5 }).x).toBe(900);
  });

  it('su caja es mucho más baja que el salto del zorro', () => {
    expect(HEDGEHOG_BOX.h).toBeLessThan(FOX_JUMP_HEIGHT / 3);
    expect(hedgehogBox(1000, GROUND_TOP).y + HEDGEHOG_BOX.h).toBe(GROUND_TOP);
  });
});

describe('beePosition', () => {
  const bee = { x: 1000, phase: 0.17 };

  it('pasa al menos 1 s de cada ciclo lo bastante alta para pasar por debajo', () => {
    const step = 5;
    let clearMs = 0;
    for (let t = 0; t < BEE_PERIOD_MS; t += step) {
      const p = beePosition(t, bee);
      const box = beeBox(p.x, p.y);
      if (box.y + box.h < FOX_STANDING.y) clearMs += step;
    }
    expect(clearMs).toBeGreaterThanOrEqual(1000);
  });

  it('en su punto más bajo corta el paso a un zorro de pie', () => {
    let lowest = beePosition(0, bee);
    for (let t = 0; t < BEE_PERIOD_MS; t += 5) {
      const p = beePosition(t, bee);
      if (p.y > lowest.y) lowest = p;
    }
    const fox = { ...FOX_STANDING, x: lowest.x - FOX_STANDING.w / 2 };
    expect(overlaps(fox, beeBox(lowest.x, lowest.y))).toBe(true);
  });

  it('su deriva horizontal no pasa de 30 px', () => {
    for (let t = 0; t < 2 * BEE_PERIOD_MS; t += 11) expect(Math.abs(beePosition(t, bee).x - bee.x)).toBeLessThanOrEqual(30);
  });
});

describe('overlaps', () => {
  const a: Rect = { x: 0, y: 0, w: 10, h: 10 };

  it('cajas que se cruzan chocan', () => {
    expect(overlaps(a, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
    expect(overlaps(a, { x: 2, y: 2, w: 2, h: 2 })).toBe(true);
  });

  it('cajas que solo se tocan por el borde no chocan', () => {
    expect(overlaps(a, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
    expect(overlaps(a, { x: 0, y: 10, w: 10, h: 10 })).toBe(false);
  });

  it('cajas separadas no chocan', () => {
    expect(overlaps(a, { x: 30, y: 30, w: 5, h: 5 })).toBe(false);
  });
});
