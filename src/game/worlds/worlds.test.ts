import { describe, expect, it } from 'vitest';
import { QUIZ_KINDS } from '../../learning/quiz';
import { courseFor, enemyCount, freeStretches } from '../enemies/enemy-layout';
import { AMBIENTS } from '../levels/ambients';
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

  it('selector: 123, el río, formas y Aa', () => {
    expect(WORLDS.map((w) => w.id)).toEqual(['arcoiris', 'rio']);
    expect(WORLDS[0]!.selector.label).toBe('123');
    expect(WORLDS[1]!.selector.icon).toBe('icon-ten-frame');
    expect(UPCOMING.map((b) => b.icon ?? b.label)).toEqual(['icon-shapes', 'Aa']);
  });

  it('el río va detrás del interruptor mundo-2-rio y se abre con 6 años o al llegar al nivel 12 del mundo 1', () => {
    expect(worldDef('rio').gate).toEqual({ flag: 'mundo-2-rio', openAge: 6, after: { world: 'arcoiris', level: 12 } });
    expect(WORLDS[0]!.gate).toBeUndefined();
  });

  it('el mundo 1 cuenta estrellas por bloques y no tiene retos; el río, por retos', () => {
    const [arcoiris, rio] = WORLDS;
    expect(arcoiris!.stars).toBe('blocks');
    for (const level of arcoiris!.levels) expect(level.challenges).toEqual([]);
    expect(rio!.stars).toBe('challenges');
  });

  it('el nivel 1 del río lleva 3 retos A (puntos → cifra) y el primero es la demostración', () => {
    const challenges = worldDef('rio').levels[0]!.challenges;
    expect(challenges.map((c) => [c.kind, c.show, c.reverse, c.demo])).toEqual([
      ['count', 'dots', false, true],
      ['count', 'dots', false, false],
      ['count', 'dots', false, false],
    ]);
  });

  it('el nivel 2 del río (borrador) mezcla retos A con marco de diez y dos puentes', () => {
    const challenges = worldDef('rio').levels[1]!.challenges;
    expect(challenges.map((c) => c.kind)).toEqual(['count', 'bridge', 'count', 'bridge']);
  });

  it('el nivel 3 del río (borrador) prueba la barca: la primera con demostración', () => {
    const challenges = worldDef('rio').levels[2]!.challenges;
    expect(challenges.map((c) => [c.kind, c.demo])).toEqual([
      ['boat', true],
      ['count', false],
      ['boat', false],
    ]);
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
