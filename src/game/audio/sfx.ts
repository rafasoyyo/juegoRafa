/**
 * Efectos de sonido como datos: capas de tono o de ruido con su envolvente. TypeScript puro; el
 * motor (`audio-engine.ts`) las convierte en nodos de Web Audio. Todos los tiempos en segundos.
 *
 * Envolvente de cada capa: sube de 0 a `gain` en `attack` y cae exponencialmente hasta el final
 * de la capa (`start + dur`). Timbres suaves (seno y triangular) para un público de 4 a 6 años.
 */
import { midiToHz, noteToMidi } from './notes';
import { secondsPerBeat, TRACKS } from './score';

export type Wave = 'sine' | 'triangle' | 'square' | 'sawtooth';

interface LayerBase {
  start: number;
  dur: number;
  attack: number;
  /** Ganancia de pico (0..1). */
  gain: number;
}

export interface ToneLayer extends LayerBase {
  kind: 'tone';
  wave: Wave;
  /** Frecuencia fija o puntos `[segundos desde el inicio de la capa, Hz]` unidos con rampas. */
  freq: number | readonly (readonly [number, number])[];
  vibrato?: { rate: number; depth: number };
}

export interface NoiseLayer extends LayerBase {
  kind: 'noise';
  /** Frecuencia central del filtro paso banda. */
  filterHz: number;
  q?: number;
}

export type Layer = ToneLayer | NoiseLayer;
export interface Recipe {
  layers: readonly Layer[];
}

export type SfxName = 'tap' | 'nope' | 'jump' | 'block' | 'cookie' | 'bump' | 'prize' | 'star' | 'goal';
export interface SfxOptions {
  /** Para `star`: 0, 1 o 2; cada una más aguda. */
  index?: number;
}

const hz = (note: string): number => midiToHz(noteToMidi(note));

const tone = (start: number, dur: number, wave: Wave, freq: ToneLayer['freq'], gain: number, attack = 0.008): ToneLayer => ({
  kind: 'tone',
  start,
  dur,
  wave,
  freq,
  gain,
  attack,
});

const STAR_NOTES = ['C6', 'E6', 'G6'];

/** Jingle de victoria a partir de la partitura `victory`. */
function victoryRecipe(): Recipe {
  const track = TRACKS.victory;
  const spb = secondsPerBeat(track);
  const layers = track.events.map((e) => {
    const bass = e.voice === 'bass';
    return tone(e.beat * spb, e.dur * spb, bass ? 'sine' : 'triangle', midiToHz(e.midi!), bass ? 0.45 : 0.35, 0.01);
  });
  return { layers };
}

const VICTORY = victoryRecipe();

/** Receta de un efecto. */
export function recipe(name: SfxName, opts: SfxOptions = {}): Recipe {
  switch (name) {
    case 'tap':
      // «Pop» corto y redondo al hundir un botón.
      return { layers: [tone(0, 0.08, 'triangle', [[0, 620], [0.06, 900]], 0.3, 0.005)] };
    case 'nope':
      // «Ah-ah» amable, dos notas que bajan, nada de zumbidos de error.
      return {
        layers: [tone(0, 0.13, 'sine', [[0, 392], [0.12, 349]], 0.4, 0.01), tone(0.16, 0.17, 'sine', [[0, 330], [0.16, 277]], 0.4, 0.01)],
      };
    case 'jump':
      // «Buip» que sube.
      return { layers: [tone(0, 0.18, 'triangle', [[0, 300], [0.15, 720]], 0.32, 0.006)] };
    case 'block':
      // Golpe de madera: seno grave que cae y un pellizco de ruido.
      return {
        layers: [
          tone(0, 0.12, 'sine', [[0, 190], [0.1, 120]], 0.55, 0.005),
          { kind: 'noise', start: 0, dur: 0.06, attack: 0.005, gain: 0.25, filterHz: 900, q: 1.2 },
        ],
      };
    case 'cookie':
      // Tintineo de dos campanitas.
      return { layers: [tone(0.08, 0.25, 'sine', hz('E6'), 0.3), tone(0.15, 0.4, 'sine', hz('A6'), 0.3)] };
    case 'bump':
      // «Boing»: baja y vuelve a subir con un poco de vibrato. Gracioso, no de castigo.
      return {
        layers: [{ ...tone(0, 0.36, 'sine', [[0, 330], [0.12, 200], [0.32, 440]], 0.45, 0.008), vibrato: { rate: 14, depth: 22 } }],
      };
    case 'prize':
      // Arpegio de premio que sube hasta Do agudo con un brillo final.
      return {
        layers: [
          ...['C6', 'E6', 'G6', 'C7'].map((n, i) => tone(i * 0.08, 0.3, 'triangle', hz(n), 0.28)),
          tone(0.32, 0.6, 'sine', hz('G6'), 0.18),
        ],
      };
    case 'star': {
      const i = Math.max(0, Math.min(STAR_NOTES.length - 1, Math.round(opts.index ?? 0)));
      const f = hz(STAR_NOTES[i]!);
      // Campana: fundamental y una octava más suave.
      return { layers: [tone(0, 0.6, 'sine', f, 0.35, 0.006), tone(0, 0.35, 'sine', f * 2, 0.12, 0.006)] };
    }
    case 'goal':
      return VICTORY;
  }
}

/** Duración total de una receta en segundos. */
export function recipeDuration(r: Recipe): number {
  return Math.max(0, ...r.layers.map((l) => l.start + l.dur));
}

/** Todas las frecuencias que aparecen en una receta (tonos, vibrato incluido, y filtros). */
export function recipeFrequencies(r: Recipe): number[] {
  const out: number[] = [];
  for (const l of r.layers) {
    if (l.kind === 'noise') {
      out.push(l.filterHz);
      continue;
    }
    const base = typeof l.freq === 'number' ? [l.freq] : l.freq.map(([, f]) => f);
    const depth = l.vibrato?.depth ?? 0;
    for (const f of base) out.push(f - depth, f + depth);
  }
  return out;
}

export const SFX_NAMES: readonly SfxName[] = ['tap', 'nope', 'jump', 'block', 'cookie', 'bump', 'prize', 'star', 'goal'];
