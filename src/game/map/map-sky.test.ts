import { describe, expect, it } from 'vitest';
import { AMBIENTS } from '../levels/ambients';
import { ambientSkyAt, ambientViewAt, HORIZON, skyColorAt, type SkyStop } from './map-sky';

const SKYLINE: SkyStop[] = [
  { x: 0, ambient: 'prado' },
  { x: 100, ambient: 'prado' },
  { x: 300, ambient: 'noche' },
];

describe('ambientSkyAt', () => {
  it('arriba y abajo dan los colores de los extremos del degradado', () => {
    expect(ambientSkyAt('noche', 0)).toEqual([0x2e, 0x3a, 0x7a]);
    expect(ambientSkyAt('noche', 1)).toEqual([0x5b, 0x5f, 0xa8]);
  });

  it('a media altura mezcla las paradas vecinas', () => {
    const [r] = ambientSkyAt('noche', 0.5);
    expect(r).toBeCloseTo((0x2e + 0x5b) / 2);
  });
});

describe('ambientViewAt', () => {
  it('arriba es el cielo del ambiente y abajo del todo, su suelo', () => {
    expect(ambientViewAt('noche', 0)).toEqual(ambientSkyAt('noche', 0));
    const grass = AMBIENTS.playa.grass;
    expect(ambientViewAt('playa', 1)).toEqual([(grass >> 16) & 0xff, (grass >> 8) & 0xff, grass & 0xff]);
  });

  it('justo bajo el horizonte empiezan las colinas lejanas', () => {
    const light = AMBIENTS.prado.hillLight;
    const [r, g, b] = ambientViewAt('prado', HORIZON + 0.021);
    expect(r).toBeCloseTo((light >> 16) & 0xff, -1);
    expect(g).toBeCloseTo((light >> 8) & 0xff, -1);
    expect(b).toBeCloseTo(light & 0xff, -1);
  });
});

describe('skyColorAt', () => {
  it('en una parada da el paisaje de su ambiente', () => {
    expect(skyColorAt(SKYLINE, 300, 0.2)).toEqual(ambientViewAt('noche', 0.2));
    expect(skyColorAt(SKYLINE, 50, 0.8)).toEqual(ambientViewAt('prado', 0.8));
  });

  it('a medio camino entre dos paradas, la mezcla', () => {
    const day = ambientViewAt('prado', 0);
    const night = ambientViewAt('noche', 0);
    const [r, g, b] = skyColorAt(SKYLINE, 200, 0);
    expect(r).toBeCloseTo((day[0] + night[0]) / 2);
    expect(g).toBeCloseTo((day[1] + night[1]) / 2);
    expect(b).toBeCloseTo((day[2] + night[2]) / 2);
  });

  it('fuera de los extremos, el cielo del extremo', () => {
    expect(skyColorAt(SKYLINE, -50, 0.5)).toEqual(ambientViewAt('prado', 0.5));
    expect(skyColorAt(SKYLINE, 900, 0.5)).toEqual(ambientViewAt('noche', 0.5));
  });
});
