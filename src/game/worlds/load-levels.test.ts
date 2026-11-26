import { describe, expect, it } from 'vitest';
import { levelsFrom } from './load-levels';

const level = (ambient: string) => ({ ambient, length: 40, steps: [], platforms: [], blocks: [] });

describe('levelsFrom', () => {
  it('ordena por número (el 10 va después del 9, no del 1)', () => {
    const modules: Record<string, unknown> = {};
    const ambients = ['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche', 'playa', 'selva', 'montana', 'nieve'];
    ambients.forEach((a, i) => (modules[`/x/nivel-${i + 1}.json`] = level(a)));
    const levels = levelsFrom('prueba', modules);
    expect(levels.map((l) => l.id)).toEqual(ambients.map((_, i) => `nivel-${i + 1}`));
    expect(levels.map((l) => l.ambient)).toEqual(ambients);
  });

  it('avisa si falta un nivel o sobra un archivo con otro nombre', () => {
    expect(() => levelsFrom('prueba', { 'nivel-1.json': level('prado'), 'nivel-3.json': level('flores') })).toThrow('falta nivel-2.json');
    expect(() => levelsFrom('prueba', { 'otro.json': level('prado') })).toThrow('otro.json');
  });
});
