import { describe, expect, it } from 'vitest';
import { recipe, recipeDuration, recipeFrequencies, SFX_NAMES, type Recipe, type SfxName, type ToneLayer } from './sfx';

type Case = { name: SfxName; r: Recipe };
const ALL: Case[] = SFX_NAMES.flatMap((name): Case[] =>
  name === 'star' ? [0, 1, 2].map((index) => ({ name, r: recipe(name, { index }) })) : [{ name, r: recipe(name) }],
);

describe('recetas de efectos', () => {
  it.each(ALL)('«$name» es suave: ataque ≥ 5 ms y pico ≤ 1', ({ r }) => {
    expect(r.layers.length).toBeGreaterThan(0);
    for (const l of r.layers) {
      expect(l.attack).toBeGreaterThanOrEqual(0.005);
      expect(l.attack).toBeLessThan(l.dur);
      expect(l.gain).toBeGreaterThan(0);
      expect(l.gain).toBeLessThanOrEqual(1);
    }
  });

  it.each(ALL)('«$name» dura 2,5 s como mucho', ({ r }) => {
    expect(recipeDuration(r)).toBeLessThanOrEqual(2.5);
  });

  it.each(ALL)('«$name» se mueve entre 60 Hz y 4 kHz', ({ r }) => {
    for (const f of recipeFrequencies(r)) {
      expect(f).toBeGreaterThanOrEqual(60);
      expect(f).toBeLessThanOrEqual(4000);
    }
  });

  it('el choque, el «todavía no» y la fruta no usan ondas ásperas', () => {
    for (const name of ['bump', 'nope', 'fruit', 'power', 'power-off'] as const) {
      for (const l of recipe(name).layers) {
        if (l.kind === 'tone') expect(['sine', 'triangle']).toContain(l.wave);
      }
    }
  });

  /** Primera y última altura de una receta, por orden de inicio de sus capas de tono. */
  const ends = (name: SfxName): { first: number; last: number } => {
    const tones = recipe(name)
      .layers.filter((l): l is ToneLayer => l.kind === 'tone')
      .sort((a, b) => a.start - b.start);
    const at = (l: ToneLayer, end: boolean): number => (typeof l.freq === 'number' ? l.freq : l.freq[end ? l.freq.length - 1 : 0]![1]);
    return { first: at(tones[0]!, false), last: at(tones[tones.length - 1]!, true) };
  };

  it('el poder sube y su final baja', () => {
    expect(ends('power').last).toBeGreaterThan(ends('power').first);
    expect(ends('power-off').last).toBeLessThan(ends('power-off').first);
    expect(ends('fruit').last).toBeGreaterThan(ends('fruit').first);
  });

  it('el final del poder es suave: solo seno', () => {
    for (const l of recipe('power-off').layers) expect(l.kind === 'tone' && l.wave).toBe('sine');
  });

  it('el poder dura más que el premio y la fruta es distinta de la galleta', () => {
    expect(recipeDuration(recipe('power'))).toBeGreaterThan(recipeDuration(recipe('prize')));
    expect(recipe('fruit')).not.toEqual(recipe('cookie'));
  });

  it('cada estrella suena más aguda que la anterior', () => {
    const pitch = (index: number): number => (recipe('star', { index }).layers[0] as ToneLayer).freq as number;
    expect(pitch(1)).toBeGreaterThan(pitch(0));
    expect(pitch(2)).toBeGreaterThan(pitch(1));
  });

  it('los puntos de un barrido van en orden dentro de su capa', () => {
    for (const { r } of ALL) {
      for (const l of r.layers) {
        if (l.kind !== 'tone' || typeof l.freq === 'number') continue;
        const times = l.freq.map(([t]) => t);
        expect([...times].sort((a, b) => a - b)).toEqual(times);
        expect(times[times.length - 1]!).toBeLessThanOrEqual(l.dur);
      }
    }
  });
});
