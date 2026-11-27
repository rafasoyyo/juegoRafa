/**
 * Reto D de la isla, «Las piedras del géiser» (`docs/MUNDO-3.md`): un tótem muestra una forma y sobre un
 * lago de lava hay una fila de piedras con formas. Las que cumplen lo del tótem aguantan; las otras se
 * hunden despacio. Siempre hay un camino de piedras buenas que se puede saltar: nunca hay dos malas
 * seguidas (las orillas cuentan como buenas). TypeScript puro y con semilla.
 *
 * - 3-4 años: la forma, con todo del mismo color.
 * - 5-6 años: la forma, aunque cambie de color o de tamaño (el tótem es piedra, sin color).
 * - 7-8 años: dos rasgos a la vez (forma y color); entre las malas, una con la forma y otro color y otra
 *   con el color y otra forma.
 */

import type { Rng } from '../quiz/rng';
import type { AgeBand, ShapeId } from '../quiz/types';
import { GLYPH_COLORS, type GlyphColor } from './footprints';

export const GEYSER_STONES = 6;
export const STONE_SIZES = ['small', 'normal', 'big'] as const;
export type StoneSize = (typeof STONE_SIZES)[number];

export interface GeyserStone {
  shape: ShapeId;
  color: GlyphColor;
  size: StoneSize;
  /** Aguanta (cumple lo del tótem). */
  good: boolean;
}

export interface GeyserChallenge {
  kind: 'geyser';
  /** Lo que pide el tótem: la forma y, para los mayores, también el color (`null`: sin color). */
  totem: { shape: ShapeId; color: GlyphColor | null };
  stones: GeyserStone[];
}

export const GEYSER_SHAPES: Record<AgeBand, readonly ShapeId[]> = {
  small: ['circle', 'square', 'triangle'],
  medium: ['circle', 'square', 'triangle', 'star', 'diamond'],
  big: ['circle', 'square', 'triangle', 'star', 'diamond'],
};

/** Piedras malas por franja. */
const BAD_COUNT: Record<AgeBand, readonly number[]> = { small: [2], medium: [2, 3], big: [3] };

/** ¿Cumple la piedra lo que pide el tótem? */
export function fits(totem: GeyserChallenge['totem'], stone: { shape: ShapeId; color: GlyphColor }): boolean {
  return stone.shape === totem.shape && (totem.color === null || stone.color === totem.color);
}

/** Qué piedras son malas: `bad` de `n`, nunca dos seguidas. */
export function badPattern(n: number, bad: number, rng: Rng): boolean[] {
  for (;;) {
    const picks = new Set(rng.shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, bad));
    const pattern = Array.from({ length: n }, (_, i) => picks.has(i));
    if (pattern.every((b, i) => !(b && pattern[i + 1]))) return pattern;
  }
}

export function geyserChallenge(band: AgeBand, rng: Rng): GeyserChallenge {
  const shapes = GEYSER_SHAPES[band];
  const target = rng.pick(shapes);
  const others = shapes.filter((s) => s !== target);
  const bad = badPattern(GEYSER_STONES, rng.pick(BAD_COUNT[band]), rng);

  if (band === 'small') {
    const color = rng.pick(GLYPH_COLORS);
    const stones = bad.map((b) => ({ shape: b ? rng.pick(others) : target, color, size: 'normal' as const, good: !b }));
    return { kind: 'geyser', totem: { shape: target, color }, stones };
  }

  if (band === 'medium') {
    const size = (): StoneSize => rng.pick(STONE_SIZES);
    const stones = bad.map((b) => ({ shape: b ? rng.pick(others) : target, color: rng.pick(GLYPH_COLORS), size: size(), good: !b }));
    // Que se note: las buenas no son todas iguales.
    const goods = stones.filter((s) => s.good);
    if (goods.every((s) => s.color === goods[0]!.color && s.size === goods[0]!.size)) {
      const last = goods[goods.length - 1]!;
      last.color = GLYPH_COLORS[(GLYPH_COLORS.indexOf(last.color) + 1) % GLYPH_COLORS.length]!;
    }
    return { kind: 'geyser', totem: { shape: target, color: null }, stones };
  }

  const color = rng.pick(GLYPH_COLORS);
  const otherColors = GLYPH_COLORS.filter((c) => c !== color);
  // Trampas: la forma con otro color, el color con otra forma y, la tercera, cualquiera de las dos.
  const traps = rng.shuffle(['shape', 'color', rng.pick(['shape', 'color'] as const)] as const);
  let t = 0;
  const stones = bad.map((b): GeyserStone => {
    if (!b) return { shape: target, color, size: 'normal', good: true };
    const trap = traps[t++ % traps.length]!;
    return trap === 'shape'
      ? { shape: target, color: rng.pick(otherColors), size: 'normal', good: false }
      : { shape: rng.pick(others), color, size: 'normal', good: false };
  });
  return { kind: 'geyser', totem: { shape: target, color }, stones };
}
