import { describe, expect, it } from 'vitest';
import { balanceQuiz, HEAVY, LIGHT } from './balance';
import { cableCarQuiz, finalCount } from './cable-car';
import { createRng } from './rng';
import { createRun, fillLevels, marks, remainingAnswer, tap } from './run';
import { generateQuiz } from './index';
import { GRID_COLS, mirrorQuiz } from './mirror';
import { orderQuiz, SCALES_MEDIUM, SCALES_SMALL } from './order';
import { halfPrims, PICTURE_IDS, primsKey } from './pictures';
import { shareQuiz } from './share';
import { tracksQuiz, walk } from './tracks';
import { questionKey, type AgeBand, type Question, type SceneData } from './types';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

type Of<K extends SceneData['kind']> = Extract<SceneData, { kind: K }>;
function scene<K extends SceneData['kind']>(q: Question, kind: K): Of<K> {
  expect(q.prompt.scene?.kind).toBe(kind);
  return q.prompt.scene as Of<K>;
}

/** Comprobaciones comunes: 3 preguntas distintas y respuesta posible entre las opciones. */
function check(qs: Question[]): void {
  expect(qs).toHaveLength(3);
  expect(new Set(qs.map(questionKey)).size).toBe(3);
  for (const q of qs) {
    q.options.forEach((o, i) => expect(o.id).toBe(i));
    const ids = q.options.map((o) => o.id);
    if (q.answer.form === 'choice') {
      expect(q.answer.correct.length).toBeGreaterThan(0);
      for (const c of q.answer.correct) expect(ids).toContain(c);
      expect(new Set(q.options.map((o) => o.key)).size).toBe(q.options.length);
    } else if (q.answer.form === 'multi') {
      for (const t of q.answer.targets) expect(ids).toContain(t);
    } else {
      for (const s of q.answer.slots) expect(ids).toContain(s.option);
    }
  }
}

/** Una pregunta de repartir hecha a mano: 2 platos (opciones 0 y 1) de 2 galletas y un tarro (2) con 1. */
function shareQ(rest = 1): Question {
  return {
    kind: 'share',
    prompt: { layout: 'share', items: [] },
    options: [
      { id: 0, key: 'p0', visual: { type: 'plate', friend: 'bee' }, place: 'scene' },
      { id: 1, key: 'p1', visual: { type: 'plate', friend: 'snail' }, place: 'scene' },
      { id: 2, key: 'jar', visual: { type: 'jar' }, place: 'scene' },
    ],
    answer: {
      form: 'fill',
      slots: [
        { option: 0, capacity: 2 },
        { option: 1, capacity: 2 },
        { option: 2, capacity: rest, after: [0, 1] },
      ],
    },
    hint: 'deal',
  };
}

describe('repartir (forma fill)', () => {
  it('cada toque suma 1 hasta llenar el plato; al llenar todo, acertada', () => {
    const run = createRun([shareQ(), shareQ(), shareQ()]);
    expect(tap(run, 0)).toEqual({ type: 'progress', option: 0 });
    expect(tap(run, 1)).toEqual({ type: 'progress', option: 1 });
    expect(fillLevels(run).get(0)).toBe(1);
    expect(tap(run, 0).type).toBe('progress');
    expect(tap(run, 1).type).toBe('progress');
    expect(tap(run, 2)).toMatchObject({ type: 'correct', next: 1 });
    expect(marks(run)[0]).toBe('correct');
  });

  it('plato lleno: fallo, y lo ya repartido sigue en su sitio', () => {
    const run = createRun([shareQ(), shareQ(), shareQ()]);
    tap(run, 0);
    tap(run, 0);
    expect(tap(run, 0)).toMatchObject({ type: 'wrong', option: 0, level: 1 });
    expect(fillLevels(run).get(0)).toBe(2);
  });

  it('tarro antes de tiempo: fallo y no se llena', () => {
    const run = createRun([shareQ(), shareQ(), shareQ()]);
    tap(run, 0);
    tap(run, 0);
    expect(tap(run, 2)).toMatchObject({ type: 'wrong' });
    expect(fillLevels(run).get(2)).toBeUndefined();
  });

  it('tarro de capacidad 0: tocarlo siempre es fallo y la pregunta se acierta con los platos', () => {
    const run = createRun([shareQ(0), shareQ(0), shareQ(0)]);
    expect(tap(run, 2).type).toBe('wrong');
    tap(run, 0);
    tap(run, 0);
    tap(run, 1);
    expect(tap(run, 1)).toMatchObject({ type: 'correct' });
  });

  it('tercer fallo: los toques que faltaban', () => {
    const run = createRun([shareQ(), shareQ(), shareQ()]);
    tap(run, 0);
    tap(run, 2);
    tap(run, 2);
    expect(remainingAnswer(run)).toEqual([0, 1, 1, 2]);
    expect(tap(run, 2)).toEqual({ type: 'failed', option: 2, answer: [0, 1, 1, 2], next: 1 });
  });
});

describe('«Reparte las galletas»', () => {
  it('franjas, reparto exacto, sobras y tarro', () => {
    for (const seed of SEEDS) {
      const small = shareQuiz('small', createRng(seed));
      check(small);
      for (const q of small) {
        const s = scene(q, 'share');
        expect(s.plates).toHaveLength(2);
        expect([2, 4, 6]).toContain(s.cookies);
        expect(s.jar).toBe(false);
      }
      const medium = shareQuiz('medium', createRng(seed));
      check(medium);
      for (const q of medium) {
        const s = scene(q, 'share');
        expect([2, 3]).toContain(s.plates.length);
        expect(s.cookies).toBeLessThanOrEqual(12);
        expect(s.cookies % s.plates.length).toBe(0);
        expect(s.cookies / s.plates.length).toBeGreaterThanOrEqual(2);
      }
      const big = shareQuiz('big', createRng(seed));
      check(big);
      let withRest = 0;
      for (const q of big) {
        const s = scene(q, 'share');
        const n = s.plates.length;
        expect([3, 4]).toContain(n);
        expect(s.cookies).toBeLessThanOrEqual(15);
        expect(s.jar).toBe(true);
        const rest = s.cookies % n;
        if (rest >= 1 && rest <= n - 1) withRest++;
        if (q.answer.form !== 'fill') throw new Error('fill');
        const plates = q.answer.slots.slice(0, n);
        expect(plates.every((p) => p.capacity === Math.floor(s.cookies / n))).toBe(true);
        const jar = q.answer.slots[n]!;
        expect(jar.capacity).toBe(rest);
        expect(jar.after).toEqual(plates.map((p) => p.option));
        // Toda la cesta se reparte: platos + tarro = galletas.
        expect(q.answer.slots.reduce((a, b) => a + b.capacity, 0)).toBe(s.cookies);
      }
      expect(withRest).toBeGreaterThanOrEqual(2);
      expect(big[0]!.hint).toBe('deal');
    }
  });

  it('se puede resolver tocando según el plan', () => {
    for (const band of BANDS) {
      const qs = shareQuiz(band, createRng(5));
      const run = createRun(qs);
      for (const q of qs) {
        if (q.answer.form !== 'fill') throw new Error('fill');
        const taps = q.answer.slots.flatMap((s) => Array(s.capacity).fill(s.option) as number[]);
        for (const id of taps) expect(['progress', 'correct']).toContain(tap(run, id).type);
      }
      expect(marks(run)).toEqual(['correct', 'correct', 'correct']);
    }
  });
});

describe('«De pequeño a grande»', () => {
  it('elementos, razones de escala, sentido y orden de los targets', () => {
    for (const seed of SEEDS) {
      for (const band of BANDS) {
        const qs = orderQuiz(band, createRng(seed));
        check(qs);
        for (const q of qs) {
          const dir = scene(q, 'order').direction;
          if (q.answer.form !== 'multi') throw new Error('multi');
          expect(q.answer.ordered).toBe(true);
          expect(q.options.every((o) => o.place === 'scene')).toBe(true);
          const n = band === 'small' ? 3 : band === 'medium' ? 4 : 5;
          expect(q.options).toHaveLength(n);
          if (band === 'small') expect(dir).toBe('up');
          const values = q.answer.targets.map((t) => {
            const v = q.options[t]!.visual;
            return v.type === 'sized' ? v.scale : v.type === 'digit' ? v.value : NaN;
          });
          expect(values.every((v) => !Number.isNaN(v))).toBe(true);
          const asc = [...values].sort((a, b) => a - b);
          expect(values).toEqual(dir === 'up' ? asc : [...asc].reverse());
          if (band !== 'big') {
            const min = band === 'small' ? 1.4 : 1.2;
            for (let i = 1; i < asc.length; i++) expect(asc[i]! / asc[i - 1]!).toBeGreaterThanOrEqual(min);
          } else {
            expect(new Set(values).size).toBe(5);
            for (const v of values) expect(v >= 1 && v <= 20).toBe(true);
          }
          expect(q.hint).toBe('compare-two');
        }
      }
    }
    expect(SCALES_SMALL.length).toBe(4);
    expect(SCALES_MEDIUM.length).toBe(5);
  });

  it('tocar fuera de orden es fallo y lo colocado sigue', () => {
    const qs = orderQuiz('medium', createRng(3));
    const run = createRun(qs);
    const q = qs[0]!;
    if (q.answer.form !== 'multi') throw new Error('multi');
    const [a, b, , d] = q.answer.targets;
    expect(tap(run, a!).type).toBe('progress');
    expect(tap(run, b!).type).toBe('progress');
    expect(tap(run, d!).type).toBe('wrong');
    expect(remainingAnswer(run)).toEqual(q.answer.targets.slice(2));
  });
});

describe('«El teleférico»', () => {
  it('rangos de cada franja, respuestas y pista', () => {
    for (const seed of SEEDS) {
      for (const band of BANDS) {
        const qs = cableCarQuiz(band, createRng(seed));
        check(qs);
        for (const q of qs) {
          const s = scene(q, 'cable-car');
          const end = finalCount(s);
          expect(q.hint).toBe('count-on');
          let n = s.start;
          for (const step of s.steps) {
            n += step.op === 'in' ? step.count : -step.count;
            expect(n >= 0 && n <= 20).toBe(true);
          }
          if (q.answer.form !== 'choice') throw new Error('choice');
          const right = q.options[q.answer.correct[0]!]!.visual;
          expect(right).toEqual(band === 'small' ? { type: 'dots', value: end } : { type: 'digit', value: end });
          if (band === 'small') {
            expect(s.start).toBeLessThanOrEqual(2);
            expect(s.steps).toHaveLength(1);
            expect(s.steps[0]).toMatchObject({ op: 'in' });
            expect(s.steps[0]!.count).toBeLessThanOrEqual(2);
            expect(end).toBeLessThanOrEqual(4);
            expect(q.options).toHaveLength(3);
            expect(q.options.every((o) => o.visual.type === 'dots')).toBe(true);
          } else if (band === 'medium') {
            expect(s.start >= 1 && s.start <= 6).toBe(true);
            expect(s.steps).toHaveLength(1);
            expect(s.steps[0]).toMatchObject({ op: 'in' });
            expect(s.steps[0]!.count).toBeLessThanOrEqual(4);
            expect(end).toBeLessThanOrEqual(10);
            expect(q.options).toHaveLength(3);
          } else {
            expect(s.start >= 3 && s.start <= 12).toBe(true);
            expect(s.steps.length >= 1 && s.steps.length <= 2).toBe(true);
            for (const st of s.steps) expect(st.count >= 1 && st.count <= 5).toBe(true);
            if (s.steps.length === 2) expect(new Set(s.steps.map((x) => x.op)).size).toBe(2);
            expect(q.options).toHaveLength(4);
          }
        }
      }
    }
  });
});

describe('«Huellas en la nieve»', () => {
  it('ningún paso sale de la cuadrícula y el destino no es la salida', () => {
    for (const seed of SEEDS) {
      for (const band of BANDS) {
        const qs = tracksQuiz(band, createRng(seed));
        check(qs);
        for (const q of qs) {
          const s = scene(q, 'tracks');
          expect(s.size).toBe(band === 'small' ? 3 : 4);
          const end = walk(s.start, s.path, s.size);
          expect(end).toEqual(s.end);
          expect(end).not.toBeNull();
          expect(end).not.toEqual(s.start);
          // Cada paso intermedio también está dentro.
          for (let i = 1; i <= s.path.length; i++) expect(walk(s.start, s.path.slice(0, i), s.size)).not.toBeNull();
          if (q.answer.form !== 'choice') throw new Error('choice');
          const lengths = { small: [1, 2], medium: [3, 4], big: [4, 6] }[band];
          expect(s.path.length >= lengths[0]! && s.path.length <= lengths[1]!).toBe(true);
          if (band === 'small') {
            expect(s.landmarks).toHaveLength(3);
            expect(new Set(s.landmarks.map((l) => l.id)).size).toBe(3);
            expect(new Set(s.landmarks.map((l) => `${l.cell.row},${l.cell.col}`)).size).toBe(3);
            expect(s.landmarks.some((l) => l.cell.row === s.start.row && l.cell.col === s.start.col)).toBe(false);
            const right = q.options[q.answer.correct[0]!]!.visual;
            expect(s.landmarks.find((l) => l.cell.row === s.end.row && l.cell.col === s.end.col)!.id).toBe((right as { id: string }).id);
            expect(q.hint).toBe('ghost-walk');
          } else if (band === 'medium') {
            expect(q.options.every((o) => o.visual.type === 'cell' && o.place === 'scene')).toBe(true);
            const right = q.options[q.answer.correct[0]!]!.visual as { row: number; col: number };
            expect(right).toMatchObject(s.end);
            expect(q.hint).toBe('ghost-walk');
          } else {
            expect(q.options).toHaveLength(3);
            expect(q.hint).toBe('dim-wrong');
            expect(s.goal).toEqual(s.end);
            let hits = 0;
            q.options.forEach((o, i) => {
              if (o.visual.type !== 'arrows') throw new Error('arrows');
              const e = walk(s.start, o.visual.dirs, s.size);
              expect(e).not.toBeNull();
              const reaches = e!.row === s.goal!.row && e!.col === s.goal!.col;
              if (reaches) hits++;
              expect(q.answer.form === 'choice' && q.answer.correct.includes(i)).toBe(reaches);
            });
            expect(hits).toBe(1);
          }
        }
      }
    }
  });
});

describe('«La balanza»', () => {
  it('cada franja con su pregunta y su pista', () => {
    for (const seed of SEEDS) {
      const small = balanceQuiz('small', createRng(seed));
      check(small);
      for (const q of small) {
        const s = scene(q, 'balance');
        if (s.mode !== 'weigh') throw new Error('weigh');
        const heavyLeft = (HEAVY as readonly string[]).includes(s.left);
        expect((HEAVY as readonly string[]).includes(heavyLeft ? s.left : s.right)).toBe(true);
        expect((LIGHT as readonly string[]).includes(heavyLeft ? s.right : s.left)).toBe(true);
        expect(q.options.every((o) => o.place === 'scene')).toBe(true);
        if (q.answer.form !== 'choice') throw new Error('choice');
        expect(q.answer.correct).toEqual([heavyLeft ? 0 : 1]);
        expect(q.hint).toBe('heft');
      }
      const medium = balanceQuiz('medium', createRng(seed));
      check(medium);
      for (const q of medium) {
        const s = scene(q, 'balance');
        if (s.mode !== 'gap') throw new Error('gap');
        expect(s.left).not.toBe(s.right);
        expect(s.left >= 1 && s.left <= 9 && s.right >= 1 && s.right <= 9).toBe(true);
        expect(q.options).toHaveLength(3);
        if (q.answer.form !== 'choice') throw new Error('choice');
        expect(q.options[q.answer.correct[0]!]!.visual).toEqual({ type: 'digit', value: Math.abs(s.left - s.right) });
        expect(q.hint).toBe('pair-up');
      }
      const big = balanceQuiz('big', createRng(seed));
      check(big);
      for (const q of big) {
        const s = scene(q, 'balance');
        if (s.mode !== 'equiv') throw new Error('equiv');
        expect(s.cookies >= 2 && s.cookies <= 4).toBe(true);
        expect(s.berries >= 2 && s.berries <= 3).toBe(true);
        expect(s.cookies * s.berries).toBeLessThanOrEqual(12);
        expect(q.options).toHaveLength(4);
        if (q.answer.form !== 'choice') throw new Error('choice');
        expect(q.options[q.answer.correct[0]!]!.visual).toEqual({ type: 'digit', value: s.cookies * s.berries });
        expect(q.hint).toBe('swap-fruit');
      }
    }
  });
});

describe('«La otra mitad»', () => {
  it('ninguna mitad es simétrica respecto a su eje', () => {
    for (const p of PICTURE_IDS) {
      for (const v of [0, 1]) expect(primsKey(halfPrims(p, false, v))).not.toBe(primsKey(halfPrims(p, true, v)));
      // La variante cambia el dibujo.
      expect(primsKey(halfPrims(p, true, 0))).not.toBe(primsKey(halfPrims(p, true, 1)));
      // Ninguna primitiva cruza el eje.
      for (const prim of halfPrims(p, false, 0)) {
        if (prim.t === 'e') expect(prim.cx + prim.rx).toBeLessThanOrEqual(1.0001);
        if (prim.t === 'r') expect(prim.x + prim.w).toBeLessThanOrEqual(1.0001);
        if (prim.t === 't') for (const [x] of prim.pts) expect(x).toBeLessThanOrEqual(1.0001);
      }
    }
  });

  it('pequeños, medianos y mayores', () => {
    for (const seed of SEEDS) {
      const small = mirrorQuiz('small', createRng(seed));
      check(small);
      for (const q of small) {
        const s = scene(q, 'mirror');
        if (s.mode !== 'picture') throw new Error('picture');
        if (q.answer.form !== 'choice') throw new Error('choice');
        expect(q.options).toHaveLength(3);
        const good = q.answer.correct[0]!;
        expect(q.options[good]!.visual).toEqual({ type: 'half', picture: s.picture, mirrored: true, variant: 0 });
        const others = q.options.filter((_, i) => i !== good);
        for (const o of others) expect(o.visual.type === 'half' && o.visual.picture !== s.picture).toBe(true);
        expect(q.hint).toBe('fold');
      }
      const medium = mirrorQuiz('medium', createRng(seed));
      check(medium);
      for (const q of medium) {
        const s = scene(q, 'mirror');
        if (s.mode !== 'picture') throw new Error('picture');
        if (q.answer.form !== 'choice') throw new Error('choice');
        const keys = q.options.map((o) => o.key).sort();
        expect(keys).toEqual([`half:${s.picture}:m:0`, `half:${s.picture}:m:1`, `half:${s.picture}:n:0`].sort());
        expect(q.answer.correct).toHaveLength(1);
        expect(q.options[q.answer.correct[0]!]!.key).toBe(`half:${s.picture}:m:0`);
      }
      const big = mirrorQuiz('big', createRng(seed));
      check(big);
      for (const q of big) {
        const s = scene(q, 'mirror');
        if (s.mode !== 'grid') throw new Error('grid');
        if (q.answer.form !== 'multi') throw new Error('multi');
        expect([s.rows, s.cols]).toEqual([4, 6]);
        expect(s.painted.length >= 3 && s.painted.length <= 6).toBe(true);
        for (const c of s.painted) expect(c.col).toBeLessThan(3);
        expect(q.options).toHaveLength(12);
        expect(q.answer.ordered).toBe(false);
        expect(q.answer.targets).toHaveLength(s.painted.length);
        const cells = q.answer.targets.map((t) => q.options[t]!.visual as { row: number; col: number });
        for (const c of s.painted) expect(cells).toContainEqual(expect.objectContaining({ row: c.row, col: GRID_COLS - 1 - c.col }));
      }
    }
  });
});

describe('generateQuiz con las pruebas nuevas', () => {
  it('cubre los 6 tipos y las 3 franjas', () => {
    const ctx = { alias: 'LUCIA', ambients: ['prado'], recap: { level: 7, ambient: 'prado', hedgehogs: 0, bees: 0, cookies: 0, blocksHit: 0, blocksTotal: 0 } };
    for (const kind of ['share', 'order', 'cable-car', 'tracks', 'balance', 'mirror'] as const) {
      for (const band of BANDS) check(generateQuiz(kind, band, createRng(9), ctx));
    }
  });
});
