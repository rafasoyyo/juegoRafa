import { describe, expect, it } from 'vitest';
import { ageBand } from './age';
import { QUIZ_BY_LEVEL, quizForLevel } from './catalog';
import { compareQuiz } from './compare';
import { countQuiz } from './count';
import { GUIDE_MAX_WORDS, GUIDE_TEXT, guideWordCount } from './guide-text';
import { generateQuiz } from './index';
import { nameLettersQuiz } from './name-letters';
import { recallQuiz } from './recall';
import { createRng } from './rng';
import { createRun, dimmedOptions, isFinished, marks, result, tap } from './run';
import { rowPattern, seriesQuiz } from './series';
import { PIECES_BY_BAND, SHAPES_BY_BAND, shapesQuiz, TARGETS_BY_BAND } from './shapes';
import { QUIZ_KINDS, questionKey, toOptions, type AgeBand, type Question, type QuizContext, type Visual } from './types';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);
const AMBIENTS = ['prado', 'flores', 'bosque', 'otono', 'atardecer', 'noche'];

function ctx(over: Partial<QuizContext['recap']> = {}, alias = 'LUCIA'): QuizContext {
  return {
    alias,
    ambients: AMBIENTS,
    recap: { level: 6, ambient: 'noche', hedgehogs: 3, bees: 2, cookies: 5, blocksHit: 5, blocksTotal: 10, ...over },
  };
}

function correctVisuals(q: Question): Visual[] {
  if (q.answer.form !== 'choice') throw new Error('no es de elegir');
  const ids = q.answer.correct;
  return q.options.filter((o) => ids.includes(o.id)).map((o) => o.visual);
}

/** Comprobaciones comunes de cualquier prueba generada. */
function checkQuiz(qs: Question[]): void {
  expect(qs).toHaveLength(3);
  for (const q of qs) {
    if (q.answer.form === 'choice') {
      expect(q.answer.correct.length).toBeGreaterThan(0);
      // Sin opciones repetidas.
      expect(new Set(q.options.map((o) => o.key)).size).toBe(q.options.length);
    } else if (q.answer.form === 'multi') {
      expect(q.answer.targets.length).toBeGreaterThan(0);
    } else {
      expect(q.answer.slots.length).toBeGreaterThan(0);
    }
    q.options.forEach((o, i) => expect(o.id).toBe(i));
  }
  // Dos preguntas seguidas nunca son idénticas.
  for (let i = 1; i < qs.length; i++) expect(questionKey(qs[i]!)).not.toBe(questionKey(qs[i - 1]!));
}

// ---------------------------------------------------------------------------------------------------

describe('franjas, catálogo y azar', () => {
  it('franjas de edad', () => {
    expect([3, 4].map(ageBand)).toEqual(['small', 'small']);
    expect([5, 6].map(ageBand)).toEqual(['medium', 'medium']);
    expect([7, 8].map(ageBand)).toEqual(['big', 'big']);
    expect(ageBand(undefined)).toBe('medium');
  });

  it('una prueba fija por nivel', () => {
    expect(QUIZ_BY_LEVEL).toEqual({
      1: 'count',
      2: 'compare',
      3: 'series',
      4: 'shapes',
      5: 'name-letters',
      6: 'recall',
      7: 'share',
      8: 'order',
      9: 'cable-car',
      10: 'tracks',
      11: 'balance',
      12: 'mirror',
    });
    expect(quizForLevel(3)).toBe('series');
  });

  it('niveles nuevos: el 7 es «Reparte las galletas» y el 12 «La otra mitad»', () => {
    expect(quizForLevel(7)).toBe('share');
    expect(quizForLevel(12)).toBe('mirror');
    expect(new Set(Array.from({ length: 12 }, (_, i) => quizForLevel(i + 1))).size).toBe(12);
  });

  it('misma semilla, misma secuencia', () => {
    const a = createRng(42);
    const b = createRng(42);
    const xs = Array.from({ length: 20 }, () => a.next());
    expect(Array.from({ length: 20 }, () => b.next())).toEqual(xs);
    expect(new Set(xs).size).toBe(20);
    for (const x of xs) expect(x >= 0 && x < 1).toBe(true);
  });

  it('generateQuiz cubre los 12 tipos y franjas', () => {
    for (let level = 1; level <= 12; level++) {
      for (const band of BANDS) checkQuiz(generateQuiz(quizForLevel(level), band, createRng(level * 7), ctx()));
    }
  });
});

// ---------------------------------------------------------------------------------------------------

/** Pregunta de elegir hecha a mano: opciones 0, 1 y 2; la correcta es la 1. */
function choiceQ(hint: Question['hint'] = 'count-up'): Question {
  return {
    kind: 'count',
    prompt: { layout: 'scatter', items: [] },
    options: toOptions([1, 2, 3].map((value) => ({ type: 'digit', value }))),
    answer: { form: 'choice', correct: [1] },
    hint,
  };
}

function multiQ(ordered: boolean, letters = ['A', 'N', 'A']): Question {
  const options = toOptions(letters.map((char) => ({ type: 'letter' as const, char })));
  return {
    kind: ordered ? 'name-letters' : 'shapes',
    prompt: { layout: 'row', items: [] },
    options,
    answer: { form: 'multi', targets: ordered ? [0, 1, 2] : [0, 2], ordered },
    hint: ordered ? 'dim-wrong' : 'misfit',
  };
}

describe('intentos, pistas y resultado', () => {
  it('primer fallo: demostración; segundo: pista propia; tercero: fallada y siguiente', () => {
    const run = createRun([choiceQ(), choiceQ(), choiceQ()]);
    expect(tap(run, 0)).toEqual({ type: 'wrong', option: 0, level: 1, hint: 'count-up' });
    expect(tap(run, 2)).toEqual({ type: 'wrong', option: 2, level: 2, hint: 'count-up' });
    expect(tap(run, 0)).toEqual({ type: 'failed', option: 0, answer: [1], next: 1 });
    expect(marks(run)).toEqual(['failed', 'pending', 'pending']);
  });

  it('acertar en el 2.º o 3.er intento cuenta como acertada', () => {
    const run = createRun([choiceQ(), choiceQ(), choiceQ()]);
    tap(run, 0);
    expect(tap(run, 1)).toEqual({ type: 'correct', option: 1, next: 1 });
    tap(run, 0);
    tap(run, 2);
    expect(tap(run, 1).type).toBe('correct');
    expect(marks(run).slice(0, 2)).toEqual(['correct', 'correct']);
  });

  it('dos aciertos de tres: superada', () => {
    const run = createRun([choiceQ(), choiceQ(), choiceQ()]);
    tap(run, 1);
    tap(run, 0);
    tap(run, 0);
    tap(run, 0);
    tap(run, 1);
    expect(isFinished(run)).toBe(true);
    expect(result(run)).toEqual({ correct: 2, total: 3, passed: true });
  });

  it('un acierto: no superada', () => {
    const run = createRun([choiceQ(), choiceQ(), choiceQ()]);
    tap(run, 1);
    for (let i = 0; i < 6; i++) tap(run, 0);
    expect(isFinished(run)).toBe(true);
    expect(result(run).passed).toBe(false);
    expect(tap(run, 1)).toEqual({ type: 'ignored' });
  });

  it('dim-wrong apaga una opción incorrecta y tocarla no cuenta', () => {
    const run = createRun([choiceQ('dim-wrong')]);
    tap(run, 0);
    const ev = tap(run, 0);
    expect(ev).toEqual({ type: 'wrong', option: 0, level: 2, hint: 'dim-wrong', dimmed: 0 });
    expect(dimmedOptions(run).has(0)).toBe(true);
    expect(tap(run, 0)).toEqual({ type: 'ignored' });
    expect(tap(run, 1).type).toBe('correct');
  });

  it('tocar varias sin orden: progreso, fallo sin perder lo acertado, y acierto al acabar', () => {
    const run = createRun([multiQ(false)]);
    expect(tap(run, 0)).toEqual({ type: 'progress', option: 0 });
    expect(tap(run, 0)).toEqual({ type: 'ignored' });
    expect(tap(run, 1).type).toBe('wrong');
    expect(tap(run, 2)).toEqual({ type: 'correct', option: 2, next: null });
    expect(result(run).correct).toBe(1);
  });

  it('tocar varias sin orden: tres fallos la dan por fallada con lo que faltaba', () => {
    const run = createRun([multiQ(false)]);
    tap(run, 0);
    tap(run, 1);
    tap(run, 1);
    expect(tap(run, 1)).toEqual({ type: 'failed', option: 1, answer: [2], next: null });
  });

  it('ordenar «ANA»: vale cualquier A en su turno', () => {
    const run = createRun([multiQ(true)]);
    expect(tap(run, 2)).toEqual({ type: 'progress', option: 2 });
    expect(tap(run, 0).type).toBe('wrong');
    expect(tap(run, 1)).toEqual({ type: 'progress', option: 1 });
    expect(tap(run, 0).type).toBe('correct');
  });

  it('ordenar: la letra apagada vuelve a encenderse al acertar el paso', () => {
    const run = createRun([multiQ(true, ['L', 'U', 'Z'])]);
    tap(run, 1);
    const ev = tap(run, 2);
    expect(ev.type === 'wrong' && ev.dimmed).toBe(2);
    expect(tap(run, 0).type).toBe('progress');
    expect(dimmedOptions(run).size).toBe(0);
    expect(tap(run, 1).type).toBe('progress');
    expect(tap(run, 2).type).toBe('correct');
  });
});

// ---------------------------------------------------------------------------------------------------

describe('«¿Cuántos hay?»', () => {
  const RANGES: Record<AgeBand, [number, number]> = { small: [1, 3], medium: [1, 10], big: [8, 20] };

  it.each(BANDS)('rangos, formato y respuestas (%s)', (band) => {
    for (const seed of SEEDS) {
      const qs = countQuiz(band, createRng(seed));
      checkQuiz(qs);
      const amounts = new Set<number>();
      const objects = new Set<string>();
      for (const q of qs) {
        const item = q.prompt.items[0]!;
        if (item.type !== 'objects') throw new Error('sin objetos');
        amounts.add(item.count);
        objects.add(item.object);
        const [min, max] = RANGES[band];
        expect(item.count).toBeGreaterThanOrEqual(min);
        expect(item.count).toBeLessThanOrEqual(max);
        expect(q.options).toHaveLength(band === 'big' ? 4 : 3);
        for (const o of q.options) expect(o.visual.type).toBe(band === 'small' ? 'dots' : 'digit');
        const correct = correctVisuals(q);
        expect(correct).toHaveLength(1);
        expect((correct[0] as { value: number }).value).toBe(item.count);
        expect(q.prompt.layout).toBe(band === 'big' ? 'tenframes' : item.count <= 5 ? 'scatter' : 'rows');
      }
      expect(amounts.size).toBe(3);
      expect(objects.size).toBe(3);
    }
  });
});

describe('«¿Dónde hay más?»', () => {
  it.each(BANDS)('sin empates y coherente con más o menos (%s)', (band) => {
    let sawLess = false;
    let sizeMisleads = false;
    for (const seed of SEEDS) {
      const qs = compareQuiz(band, createRng(seed));
      checkQuiz(qs);
      for (const q of qs) {
        const groups = q.options.map((o) => o.visual as Extract<Visual, { type: 'objects' }>);
        const counts = groups.map((g) => g.count);
        expect(groups).toHaveLength(band === 'big' ? 3 : 2);
        expect(new Set(counts).size).toBe(counts.length);
        const basket = q.prompt.items[0] as Extract<Visual, { type: 'basket' }>;
        if (!basket.full) sawLess = true;
        const want = basket.full ? Math.max(...counts) : Math.min(...counts);
        const correct = correctVisuals(q);
        expect(correct).toHaveLength(1);
        expect((correct[0] as { count: number }).count).toBe(want);
        if (band === 'small') {
          expect(basket.full).toBe(true);
          expect(Math.abs(counts[0]! - counts[1]!)).toBeGreaterThanOrEqual(3);
          for (const c of counts) expect(c >= 1 && c <= 6).toBe(true);
        }
        if (band === 'medium') for (const c of counts) expect(c >= 1 && c <= 10).toBe(true);
        if (band === 'big') {
          for (const c of counts) expect(c >= 1 && c <= 15).toBe(true);
          expect(new Set(groups.map((g) => g.scale)).size).toBe(3);
          const area = groups.map((g) => g.count * g.scale * g.scale);
          if (basket.full && area.indexOf(Math.max(...area)) !== counts.indexOf(want)) sizeMisleads = true;
        }
      }
    }
    expect(sawLess).toBe(band !== 'small');
    if (band === 'big') expect(sizeMisleads).toBe(true);
  });
});

describe('«Sigue la serie»', () => {
  const ALLOWED: Record<AgeBand, RegExp> = {
    small: /^(AB)+A?$/,
    medium: /^((AAB)+(A|AA)?|(ABB)+(A|AB)?|(ABC)+(A|AB)?)$/,
    big: /^((AABB)+(A|AA)?|(ABBC)+(A|AB)?|ABCDE)$/,
  };

  it.each(BANDS)('patrones, hueco y respuesta única (%s)', (band) => {
    for (const seed of SEEDS) {
      const qs = seriesQuiz(band, createRng(seed));
      checkQuiz(qs);
      for (const q of qs) {
        const row = q.prompt.items;
        expect(rowPattern(row)).toMatch(ALLOWED[band]);
        if (band !== 'big') expect(q.prompt.holeIndex).toBe(row.length - 1);
        expect(q.options).toHaveLength(3);
        const correct = correctVisuals(q);
        expect(correct).toHaveLength(1);
        expect(JSON.stringify(correct[0])).toBe(JSON.stringify(row[q.prompt.holeIndex!]));
        // Los elementos distintos se distinguen por la forma o el dibujo, no solo por el color.
        const shapeOf = (v: Visual): string => (v.type === 'shape' ? `shape:${v.shape}` : v.type === 'object' ? `object:${v.object}` : `dots:${(v as { value: number }).value}`);
        const keys = new Set([...row, ...q.options.map((o) => o.visual)].map((v) => JSON.stringify(v)));
        const shapes = new Set([...row, ...q.options.map((o) => o.visual)].map(shapeOf));
        expect(shapes.size).toBe(keys.size);
      }
    }
  });

  it('pequeños: galleta, estrella, galleta, estrella, hueco → galleta entre las respuestas', () => {
    for (const seed of SEEDS) {
      for (const q of seriesQuiz('small', createRng(seed))) {
        const row = q.prompt.items;
        if (row.length !== 5) continue;
        expect(JSON.stringify(correctVisuals(q)[0])).toBe(JSON.stringify(row[0]));
        return;
      }
    }
    throw new Error('ninguna serie de 5');
  });
});

describe('«Caza de formas»', () => {
  it.each(BANDS)('formas, piezas y objetivos (%s)', (band) => {
    const colorsByShape = new Map<string, Set<number>>();
    for (const seed of SEEDS) {
      const qs = shapesQuiz(band, createRng(seed));
      checkQuiz(qs);
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i]!;
        const model = q.prompt.items[0] as Extract<Visual, { type: 'shape' }>;
        if (i > 0) expect(model.shape).not.toBe((qs[i - 1]!.prompt.items[0] as { shape: string }).shape);
        expect(q.options).toHaveLength(PIECES_BY_BAND[band]);
        if (q.answer.form !== 'multi') throw new Error('debe ser de tocar varias');
        const [tMin, tMax] = TARGETS_BY_BAND[band];
        expect(q.answer.targets.length).toBeGreaterThanOrEqual(tMin);
        expect(q.answer.targets.length).toBeLessThanOrEqual(tMax);
        expect(q.options.length - q.answer.targets.length).toBeGreaterThan(0);
        for (const o of q.options) {
          const v = o.visual as Extract<Visual, { type: 'shape' }>;
          expect(SHAPES_BY_BAND[band]).toContain(v.shape);
          expect(q.answer.targets.includes(o.id)).toBe(v.shape === model.shape);
          if (q.answer.targets.includes(o.id)) {
            if (!colorsByShape.has(v.shape)) colorsByShape.set(v.shape, new Set());
            colorsByShape.get(v.shape)!.add(v.color);
          }
        }
      }
    }
    // El color no se correlaciona con la forma: cada forma buscada sale en varios colores.
    for (const colors of colorsByShape.values()) expect(colors.size).toBeGreaterThanOrEqual(2);
  });
});

describe('«Las letras de tu nombre»', () => {
  const ALIASES = ['LUCIA', 'ANA', 'Ñ', 'MARIAJOSEFAA'];

  it.each(ALIASES)('distractores fuera del alias y forma según la franja (%s)', (alias) => {
    for (const band of BANDS) {
      for (const seed of SEEDS.slice(0, 50)) {
        const qs = nameLettersQuiz(band, createRng(seed), alias);
        expect(qs).toHaveLength(3);
        for (const q of qs) {
          if (q.answer.form === 'choice') {
            expect(q.options).toHaveLength(band === 'big' ? 4 : 3);
            const right = correctVisuals(q);
            expect(right).toHaveLength(1);
            for (const o of q.options) {
              const c = (o.visual as { char: string }).char;
              if (!right.includes(o.visual)) expect(alias.includes(c)).toBe(false);
            }
            const idx = band === 'small' ? q.prompt.highlightIndex : q.prompt.holeIndex;
            expect(idx).toBeDefined();
            expect((right[0] as { char: string }).char).toBe(alias[idx!]);
          } else {
            expect(band).toBe('big');
            expect(q.answer.form === 'multi' && q.answer.ordered).toBe(true);
            expect(q.options.map((o) => (o.visual as { char: string }).char).sort().join('')).toBe([...alias].sort().join(''));
          }
        }
        const ordering = qs.filter((q) => q.answer.form === 'multi').length;
        expect(ordering).toBe(band === 'big' && alias.length >= 2 ? 1 : 0);
      }
    }
  });

  it('pequeños con «LUCIA»: la L destacada primero', () => {
    const q = nameLettersQuiz('small', createRng(1), 'LUCIA')[0]!;
    expect(q.prompt.highlightIndex).toBe(0);
    expect(q.prompt.items.map((v) => (v as { char: string }).char).join('')).toBe('LUCIA');
    expect(q.options.some((o) => o.key === 'letter:L')).toBe(true);
  });

  it('alias de 1 letra: las tres preguntas usan esa letra', () => {
    for (const band of BANDS) {
      for (const q of nameLettersQuiz(band, createRng(3), 'Ñ')) expect((correctVisuals(q)[0] as { char: string }).char).toBe('Ñ');
    }
  });

  it('ordenar «ANA» se puede resolver tocando cualquier A primero', () => {
    for (const seed of SEEDS.slice(0, 30)) {
      const q = nameLettersQuiz('big', createRng(seed), 'ANA')[2]!;
      const run = createRun([q]);
      const as = q.options.filter((o) => o.key === 'letter:A').map((o) => o.id);
      const n = q.options.find((o) => o.key === 'letter:N')!.id;
      expect(tap(run, as[1]!).type).toBe('progress');
      expect(tap(run, n).type).toBe('progress');
      expect(tap(run, as[0]!).type).toBe('correct');
    }
  });
});

describe('«¿Te acuerdas?»', () => {
  it('paisaje de noche entre tres miniaturas', () => {
    for (const seed of SEEDS.slice(0, 50)) {
      const q = recallQuiz('medium', createRng(seed), ctx())[0]!;
      expect(q.options).toHaveLength(3);
      expect(q.options.every((o) => o.visual.type === 'ambient')).toBe(true);
      expect(correctVisuals(q)).toEqual([{ type: 'ambient', id: 'noche' }]);
    }
  });

  it('pequeños: erizo y abeja valen si aparecieron; el caracol nunca', () => {
    const q = recallQuiz('small', createRng(1), ctx())[2]!;
    const right = correctVisuals(q).map((v) => (v as { object: string }).object).sort();
    expect(right).toEqual(['bee', 'hedgehog']);
    const onlyBees = recallQuiz('small', createRng(1), ctx({ hedgehogs: 0 }))[2]!;
    expect(correctVisuals(onlyBees).map((v) => (v as { object: string }).object)).toEqual(['bee']);
    const blocks = recallQuiz('small', createRng(1), ctx())[1]!;
    expect(correctVisuals(blocks)).toEqual([{ type: 'object', object: 'cookie' }]);
  });

  it('mayores: contar de memoria 3 erizos, 2 abejas y las galletas, con 4 respuestas', () => {
    for (const seed of SEEDS.slice(0, 50)) {
      const [h, b, c] = recallQuiz('big', createRng(seed), ctx());
      for (const q of [h!, b!, c!]) expect(q.options).toHaveLength(4);
      expect(correctVisuals(h!)).toEqual([{ type: 'digit', value: 3 }]);
      expect(correctVisuals(b!)).toEqual([{ type: 'digit', value: 2 }]);
      expect(correctVisuals(c!)).toEqual([{ type: 'digit', value: 5 }]);
    }
  });

  it('nivel 12 con un ambiente nuevo y 10 enemigos: paisaje de nubes y recuentos de memoria', () => {
    const all = [...AMBIENTS, 'playa', 'selva', 'montana', 'nieve', 'desierto', 'nubes'];
    const recap = { level: 12, ambient: 'nubes', hedgehogs: 6, bees: 4, cookies: 22, blocksHit: 25, blocksTotal: 25 };
    for (const seed of SEEDS.slice(0, 50)) {
      const c: QuizContext = { alias: 'LUCIA', ambients: all, recap };
      const small = recallQuiz('small', createRng(seed), c);
      checkQuiz(small);
      expect(correctVisuals(small[0]!)).toEqual([{ type: 'ambient', id: 'nubes' }]);
      expect(small[0]!.options.every((o) => o.visual.type === 'ambient' && all.includes(o.visual.id))).toBe(true);
      const big = recallQuiz('big', createRng(seed), c);
      checkQuiz(big);
      expect(correctVisuals(big[0]!)).toEqual([{ type: 'digit', value: 6 }]);
      expect(correctVisuals(big[1]!)).toEqual([{ type: 'digit', value: 4 }]);
      expect(correctVisuals(big[2]!)).toEqual([{ type: 'digit', value: 22 }]);
      checkQuiz(recallQuiz('medium', createRng(seed), c));
    }
  });

  it('medianos: 3 respuestas en cifras y 0 es posible si no hubo abejas', () => {
    const qs = recallQuiz('medium', createRng(9), ctx({ bees: 0 }));
    expect(qs[1]!.options).toHaveLength(3);
    expect(qs[1]!.prompt.items[0]).toEqual({ type: 'object', object: 'hedgehog' });
    const big = recallQuiz('big', createRng(9), ctx({ bees: 0 }));
    expect(correctVisuals(big[1]!)).toEqual([{ type: 'digit', value: 0 }]);
  });
});

describe('texto del bocadillo de Lalo', () => {
  it('cada tipo de prueba tiene título, objetivo y frase, y caben en el bocadillo', () => {
    for (const kind of QUIZ_KINDS) {
      const t = GUIDE_TEXT[kind];
      expect(t.title.trim(), kind).not.toBe('');
      expect(t.goal.trim(), kind).not.toBe('');
      expect(t.how.trim(), kind).not.toBe('');
      expect(guideWordCount(t), kind).toBeLessThanOrEqual(GUIDE_MAX_WORDS);
    }
  });

  it('los títulos son distintos entre sí', () => {
    const titles = QUIZ_KINDS.map((k) => GUIDE_TEXT[k].title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
