import { describe, expect, it } from 'vitest';
import { ageBand, createRng, generateCastleQuiz, QUIZ_KINDS, type QuizKind } from '../../learning/quiz';
import { castleQuizKinds } from '../../learning/quiz/castle-quiz';
import { courseFor, freeStretches } from '../enemies/enemy-layout';
import { estimateDuration } from '../levels/duration';
import { toWorld } from '../levels/parse';
import { challengeZone } from '../levels/types';
import { validateLevel } from '../levels/validate';
import { WORLDS } from '../worlds/registry';
import { castleChallenges, castleCourse, castleQuizPools, type CastleDef } from './castle';

const ALL: CastleDef = {
  ambient: 'playa',
  steps: [{ challenge: 'count' }, { challenge: 'bridge' }, { challenge: 'boat' }, { quiz: ['fingers', 'biggest'] }, { quiz: ['fingers', 'biggest'] }],
};

describe('recorrido del castillo', () => {
  it('pone los retos del recorrido en orden, seguidos y sin demostración', () => {
    const course = castleCourse(ALL);
    expect(course.challenges.map((c) => c.kind)).toEqual(['count', 'bridge', 'boat']);
    expect(course.challenges.every((c) => !c.demo)).toBe(true);
    const zones = course.challenges.map(challengeZone);
    for (let i = 1; i < zones.length; i++) expect(zones[i]!.from - zones[i - 1]!.to).toBe(4);
    expect(course.blocks).toEqual([]);
    expect(course.spikes).toEqual([]);
  });

  it.each([
    ['los tres retos', ALL],
    ['solo preguntas (como podría ser el del mundo 1)', { ambient: 'nubes', steps: [{ quiz: ['count'] }, { quiz: ['shapes'] }] } as CastleDef],
    ['dos barcas', { ambient: 'playa', steps: [{ challenge: 'boat' }, { challenge: 'boat' }] } as CastleDef],
  ])('con %s cumple las reglas de diseño y no deja sitio a enemigos', (_n, castle) => {
    const course = castleCourse(castle);
    expect(validateLevel(course)).toEqual([]);
    if (castleChallenges(castle).length > 0) expect(freeStretches(courseFor(toWorld(course)))).toEqual([]);
    expect(estimateDuration(course).calmS).toBeGreaterThan(0);
  });

  it('separa los retos del recorrido de las preguntas de la bandera', () => {
    expect(castleChallenges(ALL)).toEqual(['count', 'bridge', 'boat']);
    expect(castleQuizPools(ALL)).toEqual([['fingers', 'biggest'], ['fingers', 'biggest']]);
  });
});

const CTX = {
  alias: 'ANA',
  recap: { level: 12, ambient: 'playa' as const, hedgehogs: 0, bees: 0, cookies: 0, blocksHit: 0, blocksTotal: 0 },
  ambients: ['playa'],
};

describe('preguntas del castillo', () => {
  it('una por paso, de tipos distintos mientras se pueda', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const kinds = castleQuizKinds([['fingers', 'biggest'], ['fingers', 'biggest']], createRng(seed));
      expect(new Set(kinds).size).toBe(2);
    }
    expect(castleQuizKinds([['count'], ['count']], createRng(3))).toEqual(['count', 'count']);
  });

  it('cada pregunta conserva su tipo y su respuesta', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const qs = generateCastleQuiz(castleQuizPools(ALL), ageBand(5), createRng(seed), CTX);
      expect(qs).toHaveLength(2);
      for (const q of qs) expect(['fingers', 'biggest']).toContain(q.kind);
    }
  });
});

describe.each(WORLDS.filter((w) => w.castle).map((w) => [w.id, w] as const))('castillo del mundo %s', (_id, world) => {
  const castle = world.castle!;

  it('tiene un nodo en el mapa tras el último nivel', () => {
    expect(world.map.nodes.length).toBeGreaterThan(world.levelCount);
  });

  it('su recorrido cumple las reglas y sus pruebas existen', () => {
    expect(validateLevel(castleCourse(castle))).toEqual([]);
    for (const pool of castleQuizPools(castle)) for (const k of pool) expect(QUIZ_KINDS).toContain(k as QuizKind);
  });

  it('tiene 5 retos y sus preguntas son de las pruebas de la bandera del mundo', () => {
    expect(castle.steps).toHaveLength(5);
    // Su catálogo tiene 12 niveles.
    const worldQuizzes = Array.from({ length: 12 }, (_, i) => world.quizFor(i + 1));
    for (const pool of castleQuizPools(castle)) for (const k of pool) expect(worldQuizzes).toContain(k);
  });

  it('su nodo va a la derecha del último nivel y dentro del mapa', () => {
    const last = world.map.nodes[world.levelCount - 1]!;
    const node = world.map.nodes[world.levelCount]!;
    expect(node[0]).toBeGreaterThan(last[0]);
    expect(node[0] + 62).toBeLessThanOrEqual(1180 * world.map.screens);
  });
});

describe('castillos de cada mundo', () => {
  const byId = (id: string) => WORLDS.find((w) => w.id === id)!.castle!;

  it('el del río tiene uno de cada mecánica y dos preguntas de la bandera', () => {
    const castle = byId('rio');
    expect([...castleChallenges(castle)].sort()).toEqual(['boat', 'bridge', 'count']);
    expect(castleQuizPools(castle)).toHaveLength(2);
  });

  it('el del arcoíris es un paseo por las nubes con 5 preguntas de pruebas distintas', () => {
    const castle = byId('arcoiris');
    expect(castle.ambient).toBe('nubes');
    expect(castleChallenges(castle)).toEqual([]);
    const pools = castleQuizPools(castle);
    expect(pools.flat()).toEqual(['count', 'compare', 'series', 'share', 'balance']);
    for (const age of [4, 5, 6]) {
      for (let seed = 1; seed <= 20; seed++) {
        const qs = generateCastleQuiz(pools, ageBand(age), createRng(seed), CTX);
        expect(qs.map((q) => q.kind)).toEqual(['count', 'compare', 'series', 'share', 'balance']);
      }
    }
  });
});
