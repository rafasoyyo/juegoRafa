import { describe, expect, it } from 'vitest';
import { AMBIENTS } from './ambients';
import { ARCOIRIS } from '../worlds/arcoiris';
import { horizonRainbow } from './horizon-rainbow';
import { TILE } from './types';

const LEVELS = ARCOIRIS.levels;

/** Anchos lógicos de la vista: 4:3 (mínimo), un móvil de 844×390 y 21:9 (máximo). */
const VIEWS = [960, 1558, 1680] as const;

/** Arcoíris del nivel `n` (1..12) con su ambiente y su longitud reales. */
function rainbowOf(n: number, viewW: number) {
  const level = LEVELS[n - 1]!;
  return horizonRainbow(n, 12, AMBIENTS[level.ambient], viewW, level.length * TILE);
}

const NUMBERS = LEVELS.map((_, i) => i + 1);

describe('arcoíris del horizonte', () => {
  it('crece estrictamente del nivel 1 al 11 y el 12 es el mayor', () => {
    for (const viewW of VIEWS) {
      const widths = NUMBERS.map((n) => rainbowOf(n, viewW).width);
      for (let i = 1; i < 11; i++) expect(widths[i]!, `nivel ${i + 1}`).toBeGreaterThan(widths[i - 1]!);
      expect(widths[11]).toBe(Math.max(...widths));
      expect(widths[11]).toBeGreaterThan(widths[10]!);
    }
  });

  it('en el 11 ocupa al menos un tercio de la vista más estrecha', () => {
    expect(rainbowOf(11, 960).width).toBeGreaterThanOrEqual(960 / 3);
  });

  it('de noche es más tenue que al atardecer y en la playa, y nunca pasa de 0,8', () => {
    const alpha = (id: keyof typeof AMBIENTS): number => horizonRainbow(1, 12, AMBIENTS[id], 1558, 14000).alpha;
    expect(alpha('noche')).toBeLessThan(alpha('atardecer'));
    expect(alpha('noche')).toBeLessThan(alpha('playa'));
    for (const n of NUMBERS) expect(rainbowOf(n, 1558).alpha, `nivel ${n}`).toBeLessThanOrEqual(0.8);
  });

  it.each(NUMBERS.map((n) => [n]))('nivel %i: el centro del arco sigue a la vista de la salida a la bandera', (n) => {
    const level = LEVELS[n - 1]!;
    const worldW = level.length * TILE;
    for (const viewW of VIEWS) {
      const r = rainbowOf(n, viewW);
      // En la pantalla: x − scrollX · scrollFactor.
      const atStart = r.x;
      const atFlag = r.x - (worldW - viewW) * r.scrollFactor;
      for (const [where, x] of [['salida', atStart], ['bandera', atFlag]] as const) {
        expect(x, `${viewW} px, ${where}`).toBeGreaterThan(0);
        expect(x, `${viewW} px, ${where}`).toBeLessThan(viewW);
      }
      if (n !== 12) expect(atStart, `${viewW} px`).toBeGreaterThan(viewW / 2);
      // Se acerca al centro, no se aleja.
      expect(atFlag, `${viewW} px`).toBeLessThan(atStart);
    }
  });

  it('fuera de rango, el nivel se acota a 1..12', () => {
    const prado = AMBIENTS.prado;
    expect(horizonRainbow(0, 12, prado, 1558, 14000)).toEqual(horizonRainbow(1, 12, prado, 1558, 14000));
    expect(horizonRainbow(13, 12, prado, 1558, 14000)).toEqual(horizonRainbow(12, 12, prado, 1558, 14000));
  });

  it('si el mundo no es más ancho que la vista, el arco no se desplaza', () => {
    expect(horizonRainbow(1, 12, AMBIENTS.prado, 1558, 1000).scrollFactor).toBe(0);
  });
});
