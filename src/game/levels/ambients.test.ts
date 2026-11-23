import { describe, expect, it } from 'vitest';
import { COLORS } from '../config';
import { AMBIENTS } from './ambients';
import { LEVELS } from './catalog';
import { AMBIENT_IDS } from './types';

const hex = (css: string): number => parseInt(css.slice(1), 16);

describe('ambientes', () => {
  it('existen los 6 ambientes y cada uno se llama como su clave', () => {
    expect(Object.keys(AMBIENTS).sort()).toEqual([...AMBIENT_IDS].sort());
    for (const id of AMBIENT_IDS) expect(AMBIENTS[id].id).toBe(id);
  });

  it('todo nivel apunta a un ambiente que existe', () => {
    for (const level of LEVELS) expect(AMBIENTS[level.ambient], level.id).toBeDefined();
  });

  it('el prado tiene los colores de la paleta del diseño (el escenario de antes)', () => {
    const prado = AMBIENTS.prado;
    expect(hex(prado.sky[0]![1])).toBe(COLORS.skyTop);
    expect(hex(prado.sky[prado.sky.length - 1]![1])).toBe(COLORS.skyBottom);
    expect(prado.hillLight).toBe(COLORS.hillLight);
    expect(prado.hill).toBe(COLORS.hill);
    expect(prado.grass).toBe(COLORS.grass);
    expect(prado.grassDark).toBe(COLORS.grassDark);
    expect(prado.earth).toBe(COLORS.earth);
    expect(prado.cloud).toEqual({ tint: 0xffffff, alpha: 1 });
    expect(prado.decor).toBe('clouds');
  });

  it('cada ambiente tiene otro cielo, otras colinas y otra decoración', () => {
    const all = Object.values(AMBIENTS);
    expect(new Set(all.map((a) => JSON.stringify(a.sky))).size).toBe(all.length);
    expect(new Set(all.map((a) => a.hill)).size).toBe(all.length);
    expect(new Set(all.map((a) => a.grass)).size).toBe(all.length);
    expect(new Set(all.map((a) => a.decor)).size).toBe(all.length);
  });

  it('las paradas del cielo van de 0 a 1 en orden', () => {
    for (const a of Object.values(AMBIENTS)) {
      const at = a.sky.map(([t]) => t);
      expect(at[0], a.id).toBe(0);
      expect(at[at.length - 1], a.id).toBe(1);
      expect([...at].sort((x, y) => x - y), a.id).toEqual(at);
    }
  });
});
