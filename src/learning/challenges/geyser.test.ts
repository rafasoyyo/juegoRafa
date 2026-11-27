import { describe, expect, it } from 'vitest';
import { createRng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import { badPattern, fits, GEYSER_SHAPES, GEYSER_STONES, geyserChallenge } from './geyser';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];

describe('las piedras del géiser', () => {
  it.each(BANDS)('%s: seis piedras, las buenas cumplen lo del tótem y nunca hay dos malas seguidas', (band) => {
    for (let seed = 1; seed <= 300; seed++) {
      const c = geyserChallenge(band, createRng(seed));
      expect(c.stones).toHaveLength(GEYSER_STONES);
      for (const s of c.stones) {
        expect(GEYSER_SHAPES[band]).toContain(s.shape);
        expect(fits(c.totem, s)).toBe(s.good);
      }
      c.stones.forEach((s, i) => expect(!s.good && c.stones[i + 1]?.good === false).toBe(false));
      expect(c.stones.filter((s) => !s.good).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('pequeños: todo del mismo color y del mismo tamaño', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const c = geyserChallenge('small', createRng(seed));
      for (const s of c.stones) {
        expect(s.color).toBe(c.totem.color);
        expect(s.size).toBe('normal');
      }
    }
  });

  it('medianos: el tótem no tiene color y las buenas no son todas iguales', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const c = geyserChallenge('medium', createRng(seed));
      expect(c.totem.color).toBeNull();
      const goods = c.stones.filter((s) => s.good);
      expect(new Set(goods.map((s) => `${s.color}:${s.size}`)).size).toBeGreaterThan(1);
    }
  });

  it('mayores: entre las malas hay una con la forma y otro color y otra con el color y otra forma', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const c = geyserChallenge('big', createRng(seed));
      const bad = c.stones.filter((s) => !s.good);
      expect(bad.some((s) => s.shape === c.totem.shape && s.color !== c.totem.color)).toBe(true);
      expect(bad.some((s) => s.shape !== c.totem.shape && s.color === c.totem.color)).toBe(true);
    }
  });

  it('el patrón de malas cambia y respeta la cuenta', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 100; seed++) {
      const p = badPattern(6, 3, createRng(seed));
      expect(p.filter(Boolean)).toHaveLength(3);
      seen.add(p.map((b) => (b ? 'x' : '.')).join(''));
    }
    expect(seen.size).toBeGreaterThan(3);
  });

  it('con la misma semilla sale el mismo reto', () => {
    expect(geyserChallenge('big', createRng(9))).toEqual(geyserChallenge('big', createRng(9)));
  });
});
