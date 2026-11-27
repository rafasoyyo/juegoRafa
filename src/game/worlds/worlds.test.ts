import { describe, expect, it } from 'vitest';
import { QUIZ_KINDS } from '../../learning/quiz';
import { courseFor, enemyCount, freeStretches } from '../enemies/enemy-layout';
import { AMBIENTS } from '../levels/ambients';
import { ARCOIRIS } from './arcoiris';
import { estimateDuration } from '../levels/duration';
import { toWorld } from '../levels/parse';
import { validateLevel } from '../levels/validate';
import { clampLevel, levelData, UPCOMING, WORLDS, worldDef } from './registry';

/** Reglas que cumple el contenido de cualquier mundo registrado, con las tablas de su definición. */
describe.each(WORLDS.map((w) => [w.id, w] as const))('mundo %s', (_id, world) => {
  const numbered = world.levels.map((l, i) => [l.id, i + 1, l] as const);

  it('tiene niveles nivel-1 a nivel-N, un nodo del mapa para cada uno y tablas de su tamaño', () => {
    expect(world.levelCount).toBe(world.levels.length);
    expect(world.levelCount).toBeGreaterThan(0);
    expect(world.levels.map((l) => l.id)).toEqual(Array.from({ length: world.levelCount }, (_, i) => `nivel-${i + 1}`));
    expect(world.map.nodes.length).toBeGreaterThanOrEqual(world.levelCount);
    expect(world.enemies.perLevel).toHaveLength(world.levelCount);
    expect(world.course.spikesPerLevel).toHaveLength(world.levelCount);
  });

  it.each(numbered)('%s cumple todas las reglas de diseño', (_n, _i, level) => {
    expect(validateLevel(level)).toEqual([]);
  });

  it.each(numbered)('%s dura lo que le toca a tope y con calma', (_n, n, level) => {
    const { fastS, calmS } = estimateDuration(level);
    const limits = world.course.durationLimits(n);
    expect(fastS).toBeGreaterThanOrEqual(limits.minFastS);
    expect(calmS).toBeGreaterThanOrEqual(limits.minCalmS);
    expect(calmS).toBeLessThanOrEqual(limits.maxCalmS);
  });

  it.each(numbered)('%s tiene los bloques, los pinchos, el ambiente, la prueba y el sitio para los enemigos que le tocan', (_n, n, level) => {
    const { min, max } = world.course.blockLimits(n);
    expect(level.blocks.length).toBeGreaterThanOrEqual(min);
    expect(level.blocks.length).toBeLessThanOrEqual(max);
    expect(level.spikes).toHaveLength(world.course.spikesPerLevel[n - 1]!);
    if (n <= world.course.narrowSpikesUntil) for (const z of level.spikes) expect(z.width).toBe(1);
    expect(AMBIENTS[level.ambient]).toBeDefined();
    expect(QUIZ_KINDS).toContain(world.quizFor(n));
    expect(freeStretches(courseFor(toWorld(level))).length).toBeGreaterThanOrEqual(enemyCount(world.enemies, n));
  });
});

describe('registro de mundos', () => {
  it('ids distintos y un botón del selector por mundo, más los huecos', () => {
    expect(new Set(WORLDS.map((w) => w.id)).size).toBe(WORLDS.length);
    expect(WORLDS.length + UPCOMING.length).toBe(4);
  });

  it('selector: 123, el río, formas (la isla) y Aa', () => {
    expect(WORLDS.map((w) => w.id)).toEqual(['arcoiris', 'rio', 'isla']);
    expect(WORLDS[0]!.selector.label).toBe('123');
    expect(WORLDS[1]!.selector.icon).toBe('icon-ten-frame');
    expect(WORLDS[2]!.selector.icon).toBe('icon-shapes');
    expect(UPCOMING.map((b) => b.icon ?? b.label)).toEqual(['Aa']);
  });

  it('el río se abre con 6 años o al llegar al nivel 12 del mundo 1, sin interruptor de desarrollo', () => {
    expect(worldDef('rio').gate).toEqual({ openAge: 6, after: { world: 'arcoiris', level: 12 } });
    expect(WORLDS[0]!.gate).toBeUndefined();
  });

  it('el nivel 1 de la isla lleva 3 caminos de huellas y el primero es la demostración', () => {
    const challenges = worldDef('isla').levels[0]!.challenges;
    expect(challenges.map((c) => [c.kind, c.demo])).toEqual([
      ['footprints', true],
      ['footprints', false],
      ['footprints', false],
    ]);
  });

  it('el mundo 1 no tiene retos del recorrido', () => {
    const [arcoiris] = WORLDS;
    for (const level of arcoiris!.levels) expect(level.challenges).toEqual([]);
  });

  it('el nivel 1 del río lleva 3 retos A (puntos → cifra) y el primero es la demostración', () => {
    const challenges = worldDef('rio').levels[0]!.challenges;
    expect(challenges.map((c) => [c.kind, c.show, c.reverse, c.demo])).toEqual([
      ['count', 'dots', false, true],
      ['count', 'dots', false, false],
      ['count', 'dots', false, false],
    ]);
  });

  it('los 12 tramos del río siguen la tabla de docs/MUNDO-2.md: retos, paisajes y novedades', () => {
    const rio = worldDef('rio');
    expect(rio.levelCount).toBe(12);
    const K = { count: 'A', bridge: 'B', boat: 'C', footprints: '-' } as const;
    const mix = rio.levels.map((l) => l.challenges.map((c) => K[c.kind]).sort().join(''));
    expect(mix).toEqual(['AAA', 'AAA', 'AAA', 'AABB', 'BBBB', 'AABB', 'AACC', 'BBCC', 'ABBCC', 'BBBCC', 'ABBCC', 'ABBCC']);
    expect(rio.levels.map((l) => l.ambient)).toEqual([
      'manantial', 'arroyo', 'cascada', 'molino', 'canaveral', 'lago', 'embarcadero', 'puente', 'huertas', 'lluvia', 'puerto', 'desembocadura',
    ]);
    // Lalo hace la demostración la primera vez que sale cada mecánica, y solo entonces.
    const demos = rio.levels.flatMap((l, i) => l.challenges.filter((c) => c.demo).map((c) => [i + 1, c.kind]));
    expect(demos).toEqual([[1, 'count'], [4, 'bridge'], [7, 'boat']]);
    for (const [n, kind] of demos as [number, string][]) expect(rio.levels[n - 1]!.challenges.find((c) => c.kind === kind)!.demo).toBe(true);
    // Nivel 1: puntos; 2: marco de diez; 3: al revés.
    expect(rio.levels[1]!.challenges.every((c) => c.show === 'tenframe' && !c.reverse)).toBe(true);
    expect(rio.levels[2]!.challenges.every((c) => c.reverse)).toBe(true);
    // Primeros escalones en el 2, primeros fosos en el 4, primeras plataformas en el 5.
    const first = (has: (l: (typeof rio.levels)[number]) => boolean): number => rio.levels.findIndex(has) + 1;
    expect(first((l) => l.steps.length > 0)).toBe(2);
    expect(first((l) => l.spikes.length > 0)).toBe(4);
    expect(first((l) => l.platforms.length > 0)).toBe(5);
  });

  it('pruebas de la bandera del río: una propia en cada nivel y el repaso en el 12', () => {
    const rio = worldDef('rio');
    const kinds = Array.from({ length: 12 }, (_, i) => rio.quizFor(i + 1));
    expect(kinds).toEqual(['fingers', 'ten-frame', 'memory', 'neighbor', 'number-line', 'biggest', 'ten-friends', 'train', 'socks', 'frog-jumps', 'boats', 'river-review']);
    expect(new Set(kinds).size).toBe(12);
  });

  it('un mundo desconocido o sin dato da el primero', () => {
    expect(worldDef(undefined)).toBe(WORLDS[0]);
    expect(worldDef('no-existe')).toBe(WORLDS[0]);
  });

  it('el nivel fuera de rango se lleva al más cercano', () => {
    const w = WORLDS[0]!;
    expect(clampLevel(w, undefined)).toBe(1);
    expect(clampLevel(w, 0)).toBe(1);
    expect(clampLevel(w, w.levelCount + 5)).toBe(w.levelCount);
    expect(levelData(w, 99)).toBe(w.levels[w.levelCount - 1]);
  });
});

describe('mapa del arcoíris', () => {
  const map = ARCOIRIS.map;

  it('tiene arco y paisaje con paradas ordenadas, dentro del camino y de ambientes que existen', () => {
    expect(map.rainbow).toBeDefined();
    const skyline = map.skyline ?? [];
    expect(skyline.length).toBeGreaterThan(1);
    for (let i = 1; i < skyline.length; i++) expect(skyline[i]!.x).toBeGreaterThan(skyline[i - 1]!.x);
    for (const stop of skyline) {
      expect(AMBIENTS[stop.ambient]).toBeDefined();
      expect(stop.x).toBeLessThanOrEqual(1180 * map.screens);
    }
  });

  it('el cielo sigue el viaje: noche sobre el 6, playa sobre el 7 y nubes sobre el 12', () => {
    const skyline = map.skyline ?? [];
    const at = (level: number): string | undefined => {
      const x = map.nodes[level - 1]![0];
      return [...skyline].reverse().find((s) => s.x <= x)?.ambient;
    };
    expect(at(6)).toBe('noche');
    expect(at(7)).toBe('playa');
    expect(at(12)).toBe('nubes');
  });

  it('el arco queda por encima de los nodos, sin que ninguno lo tape', () => {
    const { center, radius } = map.rainbow!;
    // Los pies del arco están a la altura de su centro; los nodos (radio de 64 px del artboard) más abajo.
    for (const [, y] of map.nodes.slice(0, ARCOIRIS.levelCount)) expect(y - 64).toBeGreaterThan(center[1] - radius);
    for (const [x, y] of map.nodes.slice(7, ARCOIRIS.levelCount)) {
      if (Math.abs(x - center[0]) < radius) expect(y - 64).toBeGreaterThanOrEqual(center[1]);
    }
  });

  it('los demás mundos no tienen arco', () => {
    for (const w of WORLDS.filter((w) => w.id !== ARCOIRIS.id)) expect(w.map.rainbow).toBeUndefined();
  });
});
