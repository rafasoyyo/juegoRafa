import { describe, expect, it } from 'vitest';
import { toWorld } from '../levels/parse';
import { ARCOIRIS, ENEMIES } from '../worlds/arcoiris';
import {
  BLOCK_CLEAR,
  courseFor,
  FLAG_CLEAR,
  freeStretches,
  layoutEnemies,
  START_CLEAR,
  type Course,
  type EnemySpawn,
} from './enemy-layout';
import { BEE_DRIFT } from './enemy-motion';

/** Generador con semilla (mulberry32) para repetir los repartos. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Recorridos reales de los niveles 1 a 12 (`COURSES[0]` es el nivel 1). */
const WORLDS = ARCOIRIS.levels.map(toWorld);
const ENEMIES_PER_LEVEL = ENEMIES.perLevel;
const COURSES: Course[] = WORLDS.map(courseFor);
const course = (level: number): Course => COURSES[level - 1]!;
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);
const LEVEL_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);
/** Medio cuerpo del dibujo más ancho (erizo ~100 px, abeja ~90 px). */
const HALF_BODY = 50;

/** Intervalo horizontal que puede ocupar el centro del enemigo en algún momento. */
function reach(e: EnemySpawn): { from: number; to: number } {
  return e.kind === 'hedgehog' ? { from: e.minX, to: e.maxX } : { from: e.x - BEE_DRIFT, to: e.x + BEE_DRIFT };
}

describe('layoutEnemies', () => {
  it('nivel 1: exactamente dos enemigos y son erizos', () => {
    for (const seed of SEEDS) {
      const enemies = layoutEnemies(ENEMIES, 1, course(1), seeded(seed));
      expect(enemies).toHaveLength(2);
      expect(enemies.every((e) => e.kind === 'hedgehog')).toBe(true);
    }
  });

  it('niveles 1 a 12: 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9 y 10 enemigos; los 12 recorridos reales tienen sitio para todos', () => {
    expect(ENEMIES_PER_LEVEL).toEqual([2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10]);
    for (const level of LEVEL_NUMBERS) {
      expect(freeStretches(course(level)).length, `nivel ${level}`).toBeGreaterThanOrEqual(ENEMIES_PER_LEVEL[level - 1]!);
      for (const seed of SEEDS) expect(layoutEnemies(ENEMIES, level, course(level), seeded(seed))).toHaveLength(ENEMIES_PER_LEVEL[level - 1]!);
    }
  });

  it('respeta las zonas seguras de la salida, la bandera, los bloques, los escalones, las plataformas y los pinchos', () => {
    for (const level of LEVEL_NUMBERS) {
      const c = course(level);
      for (const seed of SEEDS) {
        for (const e of layoutEnemies(ENEMIES, level, c, seeded(seed))) {
          const r = reach(e);
          expect(r.from - HALF_BODY).toBeGreaterThanOrEqual(c.startX + START_CLEAR);
          expect(r.to + HALF_BODY).toBeLessThanOrEqual(c.flagX - FLAG_CLEAR);
          for (const z of c.keepClear) {
            const left = z.x - z.width / 2 - BLOCK_CLEAR;
            const right = z.x + z.width / 2 + BLOCK_CLEAR;
            const clear = r.to + HALF_BODY <= left || r.from - HALF_BODY >= right;
            expect(clear, `nivel ${level}: ${e.kind} en [${r.from}, ${r.to}] junto a la zona ${z.x}`).toBe(true);
          }
        }
      }
    }
  });

  it('ningún enemigo cae sobre un escalón, junto a sus lados ni bajo una plataforma', () => {
    for (const level of LEVEL_NUMBERS) {
      const world = WORLDS[level - 1]!;
      const zones = [...world.steps, ...world.platforms].map((z) => ({ from: z.x - BLOCK_CLEAR, to: z.x + z.width + BLOCK_CLEAR }));
      for (const seed of SEEDS) {
        for (const e of layoutEnemies(ENEMIES, level, course(level), seeded(seed))) {
          const r = reach(e);
          for (const z of zones) {
            const clear = r.to + HALF_BODY <= z.from || r.from - HALF_BODY >= z.to;
            expect(clear, `nivel ${level}: ${e.kind} en [${r.from}, ${r.to}] sobre o bajo [${z.from}, ${z.to}]`).toBe(true);
          }
        }
      }
    }
  });

  it('ningún enemigo ni ninguna patrulla de erizo a menos de BLOCK_CLEAR de una zona de pinchos', () => {
    for (const level of LEVEL_NUMBERS.slice(6)) {
      const world = WORLDS[level - 1]!;
      expect(world.spikes.length, `nivel ${level}`).toBeGreaterThan(0);
      const zones = world.spikes.map((z) => ({ from: z.x - BLOCK_CLEAR, to: z.x + z.width + BLOCK_CLEAR }));
      for (const seed of SEEDS) {
        for (const e of layoutEnemies(ENEMIES, level, course(level), seeded(seed))) {
          const r = reach(e);
          for (const z of zones) {
            const clear = r.to + HALF_BODY <= z.from || r.from - HALF_BODY >= z.to;
            expect(clear, `nivel ${level}: ${e.kind} en [${r.from}, ${r.to}] junto a los pinchos [${z.from}, ${z.to}]`).toBe(true);
          }
        }
      }
    }
  });

  it('los niveles 1 a 6 siguen igual: sin pinchos, mismas zonas a evitar y mismos enemigos', () => {
    expect(ENEMIES_PER_LEVEL.slice(0, 6)).toEqual([2, 3, 4, 5, 6, 7]);
    for (const level of LEVEL_NUMBERS.slice(0, 6)) {
      const world = WORLDS[level - 1]!;
      expect(world.spikes).toEqual([]);
      expect(course(level).keepClear).toHaveLength(world.blocks.length + world.steps.length + world.platforms.length);
    }
  });

  it('courseFor evita bloques, escalones, plataformas y pinchos', () => {
    const spiky = WORLDS[11]!;
    expect(course(12).keepClear).toHaveLength(spiky.blocks.length + spiky.steps.length + spiky.platforms.length + spiky.spikes.length);
    const zone = spiky.spikes[0]!;
    expect(course(12).keepClear).toContainEqual({ x: zone.x + zone.width / 2, width: zone.width });
    const world = WORLDS[5]!;
    expect(course(6).keepClear).toHaveLength(world.blocks.length + world.steps.length + world.platforms.length);
    const step = world.steps[0]!;
    expect(course(6).keepClear).toContainEqual({ x: step.x + step.width / 2, width: step.width });
  });

  it('nunca pone dos enemigos en el mismo tramo libre', () => {
    for (const seed of SEEDS) {
      const enemies = layoutEnemies(ENEMIES, 6, course(6), seeded(seed));
      const froms = enemies.map((e) => e.stretch.from);
      expect(new Set(froms).size).toBe(enemies.length);
    }
  });

  it('con semillas distintas cambian las posiciones o los tipos', () => {
    const signature = (seed: number): string =>
      layoutEnemies(ENEMIES, 4, course(4), seeded(seed))
        .map((e) => `${e.kind}@${Math.round(reach(e).from)}`)
        .join('|');
    const distinct = new Set(SEEDS.map(signature));
    expect(distinct.size).toBeGreaterThan(10);
  });

  it('desde el nivel 2 aparecen abejas con alguna semilla', () => {
    for (const level of LEVEL_NUMBERS.slice(1)) {
      const kinds = SEEDS.flatMap((seed) => layoutEnemies(ENEMIES, level, course(level), seeded(seed)).map((e) => e.kind));
      expect(kinds).toContain('bee');
      expect(kinds).toContain('hedgehog');
    }
  });

  it('si hay menos tramos que enemigos devuelve los que caben, sin error', () => {
    const crowded: Course = { startX: 0, flagX: 2000, keepClear: [{ x: 1000, width: 84 }] };
    expect(freeStretches(crowded)).toHaveLength(2);
    expect(layoutEnemies(ENEMIES, 6, crowded, seeded(7))).toHaveLength(2);
    const noRoom: Course = { startX: 0, flagX: 1100, keepClear: [] };
    expect(layoutEnemies(ENEMIES, 6, noRoom, seeded(7))).toEqual([]);
  });

  it('un escalón o una plataforma parten un tramo libre igual que un bloque', () => {
    const open: Course = { startX: 0, flagX: 3000, keepClear: [] };
    expect(freeStretches(open)).toHaveLength(1);
    const withStep: Course = { ...open, keepClear: [{ x: 1500, width: 420 }] };
    const [left, right] = freeStretches(withStep);
    expect(left!.to).toBe(1500 - 210 - BLOCK_CLEAR);
    expect(right!.from).toBe(1500 + 210 + BLOCK_CLEAR);
  });
});
