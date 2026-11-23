/**
 * Partituras del hilo musical, compuestas para este proyecto (ver LICENSES.md). TypeScript puro.
 *
 * Todo en Do mayor pentatónico (C D E G A): sin semitonos, suena amable con cualquier combinación.
 * Cada compás es de 4 pulsos.
 */
import { parseVoice, voiceLength } from './notes';

export type TrackId = 'map' | 'level' | 'victory';
export type Voice = 'lead' | 'bass' | 'hat' | 'kick';

export interface ScoreEvent {
  /** Pulso de inicio. En `eventsBetween` es absoluto (cuenta las vueltas del bucle). */
  beat: number;
  dur: number;
  voice: Voice;
  /** Nota MIDI (solo `lead` y `bass`). */
  midi?: number;
}

export interface TrackSource {
  bpm: number;
  loop: boolean;
  /** Voces con altura, en notación compacta (ver `notes.ts`). */
  lead: string;
  bass: string;
  /** Percusión: pulsos (dentro de un compás) en los que suena cada golpe, repetidos en cada compás. */
  drums?: { hat?: number[]; kick?: number[] };
}

export interface Track {
  id: TrackId;
  bpm: number;
  loop: boolean;
  /** Longitud en pulsos. */
  length: number;
  /** Eventos ordenados por pulso, todos dentro de `[0, length)`. */
  events: ScoreEvent[];
}

const BAR = 4;

export const TRACK_SOURCES: Readonly<Record<TrackId, TrackSource>> = {
  // Mapa y mi personaje: tranquila, como un paseo por la colina.
  map: {
    bpm: 92,
    loop: true,
    lead: [
      'E5/1 G5/1 A5/2',
      'G5/1 E5/1 D5/2',
      'C5/1 D5/1 E5/1 G5/1',
      'E5/3 -/1',
      'A5/1 G5/1 E5/1 G5/1',
      'A5/1 C6/1 A5/2',
      'G5/1 E5/1 D5/1 E5/1',
      'C5/3 -/1',
    ].join(' '),
    bass: [
      'C3/2 G3/2',
      'A2/2 E3/2',
      'C3/2 G3/2',
      'G2/2 D3/2',
      'A2/2 E3/2',
      'C3/2 G3/2',
      'G2/2 D3/2',
      'C3/2 G2/2',
    ].join(' '),
  },
  // Nivel: saltarina, con corcheas y charles a contratiempo.
  level: {
    bpm: 132,
    loop: true,
    lead: [
      'C5/.5 E5/.5 G5/.5 E5/.5 A5/1 G5/1',
      'E5/.5 D5/.5 C5/.5 D5/.5 E5/2',
      'G5/.5 A5/.5 G5/.5 E5/.5 D5/1 E5/1',
      'C5/.5 D5/.5 E5/.5 G5/.5 A5/2',
      'C6/.5 A5/.5 G5/.5 A5/.5 C6/1 A5/1',
      'G5/.5 E5/.5 D5/.5 E5/.5 G5/2',
      'A5/.5 G5/.5 E5/.5 D5/.5 C5/1 D5/1',
      'E5/1 D5/.5 E5/.5 C5/2',
    ].join(' '),
    bass: [
      'C3/1 G3/1 C3/1 G3/1',
      'A2/1 E3/1 A2/1 E3/1',
      'G2/1 D3/1 G2/1 D3/1',
      'C3/1 G3/1 C3/1 G3/1',
      'A2/1 E3/1 A2/1 E3/1',
      'C3/1 G3/1 C3/1 G3/1',
      'G2/1 D3/1 G2/1 D3/1',
      'C3/1 G3/1 C3/2',
    ].join(' '),
    drums: { hat: [0.5, 1.5, 2.5, 3.5], kick: [0, 2] },
  },
  // Victoria al llegar a la bandera: arpegio que sube y acaba en Do.
  victory: {
    bpm: 150,
    loop: false,
    lead: 'C5/.5 E5/.5 G5/.5 A5/.5 G5/.5 C6/2',
    bass: 'C3/2.5 G2/.5 C3/1.5',
  },
};

function buildTrack(id: TrackId, src: TrackSource): Track {
  const length = Math.max(voiceLength(src.lead), voiceLength(src.bass));
  const events: ScoreEvent[] = [
    ...parseVoice(src.lead).map((e) => ({ ...e, voice: 'lead' as const })),
    ...parseVoice(src.bass).map((e) => ({ ...e, voice: 'bass' as const })),
  ];
  for (let bar = 0; bar < length; bar += BAR) {
    for (const beat of src.drums?.hat ?? []) events.push({ beat: bar + beat, dur: 0.25, voice: 'hat' });
    for (const beat of src.drums?.kick ?? []) events.push({ beat: bar + beat, dur: 0.25, voice: 'kick' });
  }
  events.sort((a, b) => a.beat - b.beat);
  return { id, bpm: src.bpm, loop: src.loop, length, events };
}

export const TRACKS: Readonly<Record<TrackId, Track>> = {
  map: buildTrack('map', TRACK_SOURCES.map),
  level: buildTrack('level', TRACK_SOURCES.level),
  victory: buildTrack('victory', TRACK_SOURCES.victory),
};

/** Segundos que dura un pulso. */
export function secondsPerBeat(track: Track): number {
  return 60 / track.bpm;
}

/**
 * Eventos que empiezan en `[fromBeat, toBeat)`, con su pulso absoluto. En las piezas con bucle se
 * repiten indefinidamente; en las demás solo existe la primera vuelta.
 */
export function eventsBetween(track: Track, fromBeat: number, toBeat: number): ScoreEvent[] {
  if (toBeat <= fromBeat) return [];
  const out: ScoreEvent[] = [];
  const len = track.length;
  const firstCycle = track.loop ? Math.floor(fromBeat / len) : 0;
  const lastCycle = track.loop ? Math.floor(toBeat / len) : 0;
  for (let cycle = Math.max(0, firstCycle); cycle <= lastCycle; cycle++) {
    for (const e of track.events) {
      const beat = cycle * len + e.beat;
      if (beat >= fromBeat && beat < toBeat) out.push({ ...e, beat });
    }
  }
  return out;
}
