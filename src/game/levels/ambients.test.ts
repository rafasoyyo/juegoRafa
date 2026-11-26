import { describe, expect, it } from 'vitest';
import { COLORS } from '../config';
import { AMBIENTS, INK, pitWall, PIT_WALL_MIX } from './ambients';
import { RAINBOW_ALPHA } from './horizon-rainbow';
import { STEEL } from './spikes';
import { ARCOIRIS } from '../worlds/arcoiris';

const LEVELS = ARCOIRIS.levels;
import { AMBIENT_IDS } from './types';

const hex = (css: string): number => parseInt(css.slice(1), 16);

/** Color en CIELAB (D65). */
function lab(color: number): [number, number, number] {
  const lin = [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const [r, g, b] = lin;
  const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** Diferencia de color perceptible (ΔE CIE76): a partir de ~25 se distinguen a simple vista sin esfuerzo. */
function deltaE(a: number, b: number): number {
  const [l1, a1, b1] = lab(a);
  const [l2, a2, b2] = lab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/** Umbral de la prueba de contraste (el mínimo de los ambientes de los niveles 1 a 6 es ≈ 31). */
const MIN_DELTA_E = 30;
/** Color que nunca cambia con el ambiente: el zorro (el bloque «?» y el acero de los pinchos van en `COLORS` y `STEEL`). */
const FOX = 0xf28c28;

describe('ambientes', () => {
  it('existen los 12 ambientes y cada uno se llama como su clave', () => {
    expect(AMBIENT_IDS).toHaveLength(12);
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

  it('los 6 ambientes antiguos tienen suelo de hierba; nieve, arena y nube en los nuevos', () => {
    for (const id of ['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche'] as const) expect(AMBIENTS[id].ground, id).toBe('grass');
    expect(AMBIENTS.playa.ground).toBe('sand');
    expect(AMBIENTS.desierto.ground).toBe('sand');
    expect(AMBIENTS.nieve.ground).toBe('snow');
    expect(AMBIENTS.nubes.ground).toBe('cloud');
    expect(AMBIENTS.nubes.platform).toBe('cloud');
    for (const id of ['playa', 'selva', 'montana', 'nieve', 'desierto'] as const) expect(AMBIENTS[id].platform, id).toBe('log');
  });

  it('el desierto es de arena pálida, no naranja', () => {
    const [l, , b] = lab(AMBIENTS.desierto.grass);
    expect(l).toBeGreaterThan(85);
    expect(deltaE(AMBIENTS.desierto.grass, FOX)).toBeGreaterThan(40);
    expect(deltaE(AMBIENTS.desierto.earth, FOX)).toBeGreaterThan(MIN_DELTA_E);
    expect(b).toBeLessThan(30);
  });

  it.each(AMBIENT_IDS.map((id) => [id]))('%s: el zorro y el bloque destacan sobre el suelo y el cielo', (id) => {
    const a = AMBIENTS[id];
    const sky = a.sky.map(([, c]) => hex(c));
    const ground = [a.grass, a.earth];
    const check = (name: string, color: number, against: number[]): void => {
      for (const bg of against) {
        expect(deltaE(color, bg), `${id}: ${name} contra #${bg.toString(16)}`).toBeGreaterThanOrEqual(MIN_DELTA_E);
      }
    };
    check('zorro', FOX, [...sky, ...ground]);
    check('bloque', COLORS.yellow, [...sky, ...ground]);
  });

  it('la noche es el único ambiente con el arcoíris más tenue, y toda opacidad está entre 0 y 1', () => {
    const fainter = AMBIENT_IDS.filter((id) => (AMBIENTS[id].rainbowAlpha ?? RAINBOW_ALPHA) < RAINBOW_ALPHA);
    expect(fainter).toEqual(['noche']);
    expect(AMBIENTS.noche.rainbowAlpha).toBeCloseTo(RAINBOW_ALPHA / 2, 1);
    for (const id of AMBIENT_IDS) {
      const alpha = AMBIENTS[id].rainbowAlpha ?? RAINBOW_ALPHA;
      expect(alpha, id).toBeGreaterThan(0);
      expect(alpha, id).toBeLessThanOrEqual(1);
    }
  });

  it('la pared del foso es la tierra mezclada al 42 % con la tinta', () => {
    expect(PIT_WALL_MIX).toBe(0.42);
    expect(pitWall(AMBIENTS.prado)).toBe(0x875f4e);
    expect(pitWall({ ...AMBIENTS.prado, earth: INK })).toBe(INK);
  });

  it.each(AMBIENT_IDS.map((id) => [id]))('%s: el acero de los pinchos destaca sobre la pared del foso', (id) => {
    const wall = pitWall(AMBIENTS[id]);
    for (const [name, steel] of [['claro', STEEL.light], ['medio', STEEL.mid]] as const) {
      expect(deltaE(steel, wall), `${id}: acero ${name} contra #${wall.toString(16)}`).toBeGreaterThanOrEqual(MIN_DELTA_E);
    }
  });
});
