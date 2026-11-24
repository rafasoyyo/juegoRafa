import { describe, expect, it } from 'vitest';
import { KNOCK_VY, MAX_VELOCITY } from '../level-course';
import {
  airTime,
  exitSide,
  footSpan,
  FOX_HALF_BODY,
  jumpReach,
  nudgeOffSpikes,
  onSpikes,
  reboundTarget,
  reboundVelocity,
  SPIKE_FORGIVE,
} from './spikes';
import { TILE, type WorldSpike } from './types';

/** Zona de 2 baldosas que empieza en x = 1000 px. */
const WIDE: WorldSpike = { index: 0, x: 1000, width: 2 * TILE };
const NARROW: WorldSpike = { index: 1, x: 2000, width: TILE };
const ZONES = [WIDE, NARROW];

/** Pies de un zorro con el centro en `x` (cuerpo de 56 px). */
const feet = (x: number): [number, number] => {
  const f = footSpan(x - FOX_HALF_BODY, 2 * FOX_HALF_BODY);
  return [f.from, f.to];
};

/** Dónde cae el centro de Rufo tras rebotar desde `x` sin tocar ningún control. */
const landing = (zone: WorldSpike, side: -1 | 1, x: number): number => x + reboundVelocity(zone, side, x) * airTime(KNOCK_VY);

describe('zonas de pinchos', () => {
  it('un salto normal cruza ≈ 3 baldosas', () => {
    expect(jumpReach() / TILE).toBeCloseTo(3.07, 1);
  });

  it('pisar claramente una zona es contacto; fuera de ella, no', () => {
    expect(onSpikes(...feet(WIDE.x + TILE), ZONES)).toBe(WIDE);
    expect(onSpikes(...feet(NARROW.x + TILE / 2), ZONES)).toBe(NARROW);
    expect(onSpikes(...feet(500), ZONES)).toBeUndefined();
    expect(onSpikes(...feet(1600), ZONES)).toBeUndefined();
  });

  it('Margen de perdón: la punta del pie en el borde no cuenta', () => {
    // Pie derecho justo dentro del borde izquierdo, menos que el margen.
    const [from, to] = feet(WIDE.x - FOX_HALF_BODY + 12 + SPIKE_FORGIVE - 1);
    expect(to).toBeLessThan(WIDE.x + SPIKE_FORGIVE);
    expect(to).toBeGreaterThan(WIDE.x);
    expect(onSpikes(from, to, ZONES)).toBeUndefined();
    // Pie izquierdo apenas dentro del borde derecho.
    expect(onSpikes(WIDE.x + WIDE.width - SPIKE_FORGIVE + 1, WIDE.x + WIDE.width + 40, ZONES)).toBeUndefined();
    // Un poco más dentro, sí.
    expect(onSpikes(WIDE.x + WIDE.width - SPIKE_FORGIVE - 4, WIDE.x + WIDE.width + 40, ZONES)).toBe(WIDE);
  });

  it('Entrar andando hacia la derecha: rebota a la izquierda y aterriza fuera', () => {
    const x = WIDE.x + 4; // primer fotograma con los pies dentro
    const side = exitSide(WIDE, WIDE.x - 40, x);
    expect(side).toBe(-1);
    const land = landing(WIDE, side, x);
    expect(land + FOX_HALF_BODY).toBeLessThan(WIDE.x);
    expect(land).toBeCloseTo(reboundTarget(WIDE, -1), 6);
  });

  it('Caer en medio de un salto hacia la izquierda: rebota a la derecha, por donde venía', () => {
    const x = WIDE.x + WIDE.width / 2;
    const side = exitSide(WIDE, WIDE.x + WIDE.width + 150, x);
    expect(side).toBe(1);
    expect(landing(WIDE, side, x) - FOX_HALF_BODY).toBeGreaterThan(WIDE.x + WIDE.width);
  });

  it('sin suelo seguro conocido, rebota hacia el borde más cercano', () => {
    expect(exitSide(WIDE, undefined, WIDE.x + 20)).toBe(-1);
    expect(exitSide(WIDE, undefined, WIDE.x + WIDE.width - 20)).toBe(1);
  });

  it('peor zona (2 baldosas, entrando por el lado opuesto): aterriza fuera y sin pasar del límite', () => {
    for (const side of [-1, 1] as const) {
      const x = side < 0 ? WIDE.x + WIDE.width : WIDE.x; // en el borde opuesto a la salida
      const v = reboundVelocity(WIDE, side, x);
      expect(Math.abs(v)).toBeLessThanOrEqual(MAX_VELOCITY.x);
      expect(Math.abs(v)).toBeLessThan(600);
      const land = landing(WIDE, side, x);
      const [from, to] = feet(land);
      expect(onSpikes(from, to, ZONES)).toBeUndefined();
      expect(side < 0 ? land + FOX_HALF_BODY <= WIDE.x : land - FOX_HALF_BODY >= WIDE.x + WIDE.width).toBe(true);
      // Aterriza a menos de 1,5 baldosas del borde, lejos de escalones y plataformas (≥ 2 baldosas).
      const gap = side < 0 ? WIDE.x - land : land - (WIDE.x + WIDE.width);
      expect(gap).toBeLessThan(1.5 * TILE);
    }
  });

  it('la fresa nunca se queda sobre una zona', () => {
    expect(nudgeOffSpikes(500, ZONES, 28)).toBe(500);
    const left = nudgeOffSpikes(WIDE.x + 30, ZONES, 28);
    expect(left + 28).toBeLessThanOrEqual(WIDE.x);
    const right = nudgeOffSpikes(WIDE.x + WIDE.width - 30, ZONES, 28);
    expect(right - 28).toBeGreaterThanOrEqual(WIDE.x + WIDE.width);
    // Asomando por el borde también se aparta.
    expect(nudgeOffSpikes(NARROW.x - 10, ZONES, 28) + 28).toBeLessThanOrEqual(NARROW.x);
  });
});
