import { describe, expect, it } from 'vitest';
import { dinoShadowsQuiz } from './dino-shadows';
import { nestQuiz, PLACES_BY_BAND } from './nest';
import { oddEggQuiz } from './odd-egg';
import { createRng } from './rng';
import { shapeThingsQuiz, THING_SHAPES } from './shape-things';
import { CORNERS, stegoPlatesQuiz } from './stego-plates';
import { turnedShapesQuiz } from './turned-shapes';
import { FOSSIL_BOARD, fossilQuiz, normalize, orientations } from './fossil';
import { skinIndex, skinMosaicQuiz } from './skin-mosaic';
import { growingNeckQuiz, MAX_NECK } from './growing-neck';
import { ROLLS, rollOrNotQuiz } from './roll-or-not';
import { hiddenTrianglesQuiz, TRIANGLES } from './hidden-triangles';
import { islandReviewQuiz } from './island-review';
import { questionKey, THINGS, type AgeBand, type Question, type Visual } from './types';

const BANDS: AgeBand[] = ['small', 'medium', 'big'];
const SEEDS = Array.from({ length: 150 }, (_, i) => i + 1);

/** Tres preguntas distintas, opciones distintas y una sola respuesta, que está entre ellas. */
function check(qs: Question[]): void {
  expect(qs).toHaveLength(3);
  expect(new Set(qs.map(questionKey)).size).toBe(3);
  for (const q of qs) {
    q.options.forEach((o, i) => expect(o.id).toBe(i));
    expect(new Set(q.options.map((o) => o.key)).size).toBe(q.options.length);
    expect(q.answer.form).toBe('choice');
    if (q.answer.form === 'choice') expect(q.answer.correct).toHaveLength(1);
  }
}

function correct(q: Question): Visual {
  if (q.answer.form !== 'choice') throw new Error('choice');
  return q.options[q.answer.correct[0]!]!.visual;
}

function of<T extends Visual['type']>(v: Visual | undefined, type: T): Extract<Visual, { type: T }> {
  expect(v?.type).toBe(type);
  return v as Extract<Visual, { type: T }>;
}

describe('pruebas de la bandera de la isla (niveles 1 a 6)', () => {
  it.each(BANDS)('%s: las seis generan tres preguntas válidas con cualquier semilla', (band) => {
    for (const seed of SEEDS) {
      for (const make of [dinoShadowsQuiz, shapeThingsQuiz, stegoPlatesQuiz, turnedShapesQuiz, nestQuiz, oddEggQuiz]) check(make(band, createRng(seed)));
    }
  });

  it('sombras: la buena es la sombra del dinosaurio del modelo; las demás, de otros', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        for (const q of dinoShadowsQuiz(band, createRng(seed))) {
          const model = of(q.prompt.items[0], 'dino');
          expect(model.shadow).toBe(false);
          const ok = of(correct(q), 'dino');
          expect([ok.dino, ok.shadow]).toEqual([model.dino, true]);
          const others = q.options.map((o) => of(o.visual, 'dino')).filter((d) => d !== ok);
          for (const d of others) expect(d.dino).not.toBe(model.dino);
          if (band !== 'big') for (const o of q.options) expect(of(o.visual, 'dino').flip).toBe(false);
        }
      }
    }
  });

  it('formas en las cosas: la respuesta es la forma de la cosa y solo salen formas de la franja', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        for (const q of shapeThingsQuiz(band, createRng(seed))) {
          const thing = of(q.prompt.items[0], 'thing').thing;
          expect(of(correct(q), 'shape').shape).toBe(THINGS[thing]);
          for (const o of q.options) expect(THING_SHAPES[band]).toContain(of(o.visual, 'shape').shape);
        }
      }
    }
  });

  it('placas: la primera es el triángulo; los mayores eligen por el número de esquinas', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        const qs = stegoPlatesQuiz(band, createRng(seed));
        expect(of(correct(qs[0]!), 'shape').shape).toBe('triangle');
        for (const q of qs) {
          const ok = of(correct(q), 'shape');
          if (band === 'big') {
            const corners = of(q.prompt.items[0], 'dots').value;
            expect(CORNERS[ok.shape]).toBe(corners);
            for (const o of q.options) if (o.visual !== ok) expect(CORNERS[of(o.visual, 'shape').shape]).not.toBe(corners);
          } else {
            expect(ok.shape).toBe(of(q.prompt.items[0], 'shape').shape);
          }
          if (band === 'small') for (const o of q.options) expect(of(o.visual, 'shape').angle).toBe(0);
        }
      }
    }
  });

  it('igual aunque gire: sin giro, un cuarto de vuelta o cualquiera; los mayores tienen la volteada como trampa', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        for (const q of turnedShapesQuiz(band, createRng(seed))) {
          const model = of(q.prompt.items[0], 'piece');
          const ok = of(correct(q), 'piece');
          expect([ok.piece, ok.mirrored]).toEqual([model.piece, false]);
          if (band === 'small') expect(ok.angle).toBe(0);
          if (band === 'medium') expect([90, 270]).toContain(ok.angle);
          if (band === 'big') {
            expect(ok.angle).not.toBe(0);
            expect(q.options.some((o) => o.visual.type === 'piece' && o.visual.piece === model.piece && o.visual.mirrored)).toBe(true);
          }
        }
      }
    }
  });

  it('el nido: la respuesta es el huevo en el mismo sitio que el bebé; dentro y fuera para los pequeños', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        for (const q of nestQuiz(band, createRng(seed))) {
          const model = of(q.prompt.items[0], 'place');
          expect([model.thing, model.holder]).toEqual(['baby', 'nest']);
          const ok = of(correct(q), 'place');
          expect([ok.rel, ok.thing]).toEqual([model.rel, 'egg']);
          expect(['box', 'basket', 'cave']).toContain(ok.holder);
          for (const o of q.options) expect(PLACES_BY_BAND[band]).toContain(of(o.visual, 'place').rel);
          expect(q.options).toHaveLength(band === 'small' ? 2 : 3);
        }
      }
    }
  });

  it('los huevos de la familia: los tres del nido comparten el rasgo y el raro no', () => {
    for (const band of BANDS) {
      for (const seed of SEEDS) {
        for (const q of oddEggQuiz(band, createRng(seed))) {
          const nest = of(q.prompt.items[0], 'nest').eggs;
          const odd = of(correct(q), 'egg');
          const family = q.options.map((o) => of(o.visual, 'egg')).filter((e) => e !== odd);
          expect(family).toHaveLength(3);
          const fits = (e: { color: number; pattern: string }): boolean =>
            band === 'small' ? e.color === nest[0]!.color : band === 'medium' ? e.pattern === nest[0]!.pattern : e.color === nest[0]!.color && e.pattern === nest[0]!.pattern;
          for (const e of [...nest, ...family]) expect(fits(e)).toBe(true);
          expect(fits(odd)).toBe(false);
          // Mayores: el raro comparte uno de los dos rasgos.
          if (band === 'big') expect(odd.color === nest[0]!.color || odd.pattern === nest[0]!.pattern).toBe(true);
        }
      }
    }
  });
});

describe('pruebas de la bandera de la isla (niveles 7 a 12)', () => {
  it.each(BANDS)('%s: las cinco nuevas y el repaso generan tres preguntas válidas con cualquier semilla', (band) => {
    for (const seed of SEEDS) {
      for (const make of [fossilQuiz, skinMosaicQuiz, growingNeckQuiz, rollOrNotQuiz, hiddenTrianglesQuiz]) check(make(band, createRng(seed)));
      const review = islandReviewQuiz(band, createRng(seed));
      expect(review).toHaveLength(3);
      expect(new Set(review.map((q) => q.kind)).size).toBe(3);
    }
  });

  it.each(BANDS)('%s: el fósil se llena con la pieza del hueco, tal cual y sin girar', (band) => {
    const { rows, cols, size } = FOSSIL_BOARD[band];
    for (const seed of SEEDS) {
      for (const q of fossilQuiz(band, createRng(seed))) {
        const f = of(q.prompt.items[0], 'fossil');
        expect([f.rows, f.cols, f.hole.length]).toEqual([rows, cols, size]);
        for (const c of f.hole) expect(c.row >= 0 && c.row < rows && c.col >= 0 && c.col < cols).toBe(true);
        expect(of(correct(q), 'bones').cells).toEqual(normalize(f.hole));
        // Mayores: entre las falsas está la misma pieza girada.
        if (band === 'big') {
          const turned = q.options.filter((o) => o.visual.type === 'bones' && orientations(f.hole).some((p) => JSON.stringify(p) === JSON.stringify(o.visual.type === 'bones' ? o.visual.cells : [])));
          expect(turned.length).toBe(2);
        }
      }
    }
  });

  it.each(BANDS)('%s: a la piel le falta la escama que pide su dibujo', (band) => {
    for (const seed of SEEDS) {
      for (const q of skinMosaicQuiz(band, createRng(seed))) {
        const m = of(q.prompt.items[0], 'mosaic');
        const hole = m.tiles.indexOf(-1);
        expect(m.tiles.filter((t) => t === -1)).toHaveLength(1);
        // Alguna otra escama de la misma clase del dibujo tiene el color de la respuesta.
        const answer = of(correct(q), 'tile').color;
        const same = m.tiles.filter((t, i) => i !== hole && t === answer);
        expect(same.length).toBeGreaterThan(0);
        // El dibujo se cumple en todas las escamas: misma clase, mismo color.
        const fits = (['rows', 'cols', 'checker', 'blocks', 'diagonal'] as const).some((pattern) => {
          const byClass = new Map<number, number>();
          const ok = m.tiles.every((t, i) => {
            const k = skinIndex(pattern, Math.floor(i / m.cols), i % m.cols);
            const color = i === hole ? answer : t;
            if (!byClass.has(k)) byClass.set(k, color);
            return byClass.get(k) === color;
          });
          return ok && new Set(byClass.values()).size === byClass.size;
        });
        expect(fits).toBe(true);
      }
    }
  });

  it.each(BANDS)('%s: el cuello crece siempre lo mismo y la respuesta es el que falta', (band) => {
    for (const seed of SEEDS) {
      for (const q of growingNeckQuiz(band, createRng(seed))) {
        const lens = q.prompt.items.map((v) => of(v, 'neck').length);
        const step = lens[1]! - lens[0]!;
        expect(step).toBeGreaterThan(0);
        lens.forEach((l, i) => expect(l).toBe(lens[0]! + i * step));
        expect(Math.max(...lens)).toBeLessThanOrEqual(MAX_NECK);
        expect(of(correct(q), 'neck').length).toBe(lens[q.prompt.holeIndex!]);
        if (band !== 'big') expect(q.prompt.holeIndex).toBe(lens.length - 1);
        if (band !== 'big') expect(step).toBe(1);
      }
    }
  });

  it.each(BANDS)('%s: en la rampa solo uno rueda (o solo uno se queda quieto)', (band) => {
    for (const seed of SEEDS) {
      for (const q of rollOrNotQuiz(band, createRng(seed))) {
        const { ask } = of(q.prompt.items[0], 'ramp');
        if (band === 'small') expect(ask).toBe('roll');
        const good = q.options.filter((o) => o.visual.type === 'solid' && ROLLS[o.visual.solid] === (ask === 'roll'));
        expect(good).toHaveLength(1);
        expect(correct(q)).toBe(good[0]!.visual);
        if (band !== 'big') expect(q.options.some((o) => o.visual.type === 'solid' && o.visual.solid === 'cone')).toBe(false);
      }
    }
  });

  it('formas escondidas: los triángulos de cada dibujo', () => {
    expect(TRIANGLES).toEqual({ one: 1, 'cut-top': 2, diagonal: 2, 'split-1': 3, triforce: 5, 'split-2': 6, 'two-diagonals': 8 });
  });

  it.each(BANDS)('%s: la respuesta es el número de triángulos del dibujo', (band) => {
    for (const seed of SEEDS) {
      for (const q of hiddenTrianglesQuiz(band, createRng(seed))) {
        const item = q.prompt.items[0]!;
        const answer = correct(q);
        if (band === 'small') {
          const mix = of(item, 'mix');
          expect(of(answer, 'dots').value).toBe(mix.shapes.filter((s) => s.shape === 'triangle').length);
        } else {
          expect(of(answer, 'digit').value).toBe(TRIANGLES[of(item, 'figure').figure]);
        }
      }
    }
  });
});
