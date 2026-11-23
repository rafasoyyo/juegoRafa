import { describe, expect, it } from 'vitest';
import { BLOCK_SIZE, BLOCKS, FLAG_X, START_X } from '../level-course';
import {
  BLOCK_CLEAR,
  ENEMIES_PER_LEVEL,
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

const COURSE: Course = { startX: START_X, flagX: FLAG_X, blocks: BLOCKS.map((b) => ({ x: b.x, width: BLOCK_SIZE })) };
const SEEDS = Array.from({ length: 50 }, (_, i) => i + 1);
/** Medio cuerpo del dibujo más ancho (erizo ~100 px, abeja ~90 px). */
const HALF_BODY = 50;

/** Intervalo horizontal que puede ocupar el centro del enemigo en algún momento. */
function reach(e: EnemySpawn): { from: number; to: number } {
  return e.kind === 'hedgehog' ? { from: e.minX, to: e.maxX } : { from: e.x - BEE_DRIFT, to: e.x + BEE_DRIFT };
}

describe('layoutEnemies', () => {
  it('nivel 1: exactamente un enemigo y es un erizo', () => {
    for (const seed of SEEDS) {
      const enemies = layoutEnemies(1, COURSE, seeded(seed));
      expect(enemies).toHaveLength(1);
      expect(enemies[0]!.kind).toBe('hedgehog');
    }
  });

  it('niveles 1 a 6: 1, 2, 2, 3, 3 y 4 enemigos con el recorrido actual', () => {
    expect(ENEMIES_PER_LEVEL).toEqual([1, 2, 2, 3, 3, 4]);
    for (let level = 1; level <= 6; level++) {
      for (const seed of SEEDS) expect(layoutEnemies(level, COURSE, seeded(seed))).toHaveLength(ENEMIES_PER_LEVEL[level - 1]!);
    }
  });

  it('respeta las zonas seguras de la salida, la bandera y los bloques', () => {
    for (let level = 1; level <= 6; level++) {
      for (const seed of SEEDS) {
        for (const e of layoutEnemies(level, COURSE, seeded(seed))) {
          const r = reach(e);
          expect(r.from - HALF_BODY).toBeGreaterThanOrEqual(START_X + START_CLEAR);
          expect(r.to + HALF_BODY).toBeLessThanOrEqual(FLAG_X - FLAG_CLEAR);
          for (const b of COURSE.blocks) {
            const left = b.x - b.width / 2 - BLOCK_CLEAR;
            const right = b.x + b.width / 2 + BLOCK_CLEAR;
            const clear = r.to + HALF_BODY <= left || r.from - HALF_BODY >= right;
            expect(clear, `${e.kind} en [${r.from}, ${r.to}] junto al bloque ${b.x}`).toBe(true);
          }
        }
      }
    }
  });

  it('nunca pone dos enemigos en el mismo tramo libre', () => {
    for (const seed of SEEDS) {
      const enemies = layoutEnemies(6, COURSE, seeded(seed));
      const froms = enemies.map((e) => e.stretch.from);
      expect(new Set(froms).size).toBe(enemies.length);
    }
  });

  it('con semillas distintas cambian las posiciones o los tipos', () => {
    const signature = (seed: number): string =>
      layoutEnemies(4, COURSE, seeded(seed))
        .map((e) => `${e.kind}@${Math.round(reach(e).from)}`)
        .join('|');
    const distinct = new Set(SEEDS.map(signature));
    expect(distinct.size).toBeGreaterThan(10);
  });

  it('desde el nivel 2 aparecen abejas con alguna semilla', () => {
    for (let level = 2; level <= 6; level++) {
      const kinds = SEEDS.flatMap((seed) => layoutEnemies(level, COURSE, seeded(seed)).map((e) => e.kind));
      expect(kinds).toContain('bee');
      expect(kinds).toContain('hedgehog');
    }
  });

  it('si hay menos tramos que enemigos devuelve los que caben, sin error', () => {
    const crowded: Course = { startX: 0, flagX: 2000, blocks: [{ x: 1000, width: 84 }] };
    expect(freeStretches(crowded)).toHaveLength(2);
    expect(layoutEnemies(6, crowded, seeded(7))).toHaveLength(2);
    const noRoom: Course = { startX: 0, flagX: 1100, blocks: [] };
    expect(layoutEnemies(6, noRoom, seeded(7))).toEqual([]);
  });

  it('el recorrido actual tiene 4 tramos libres', () => {
    expect(freeStretches(COURSE)).toHaveLength(4);
  });
});
