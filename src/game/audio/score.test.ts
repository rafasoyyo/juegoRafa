import { describe, expect, it } from 'vitest';
import { noteToMidi, voiceLength } from './notes';
import { eventsBetween, TRACK_SOURCES, TRACKS, type TrackId } from './score';

const PENTATONIC = new Set([0, 2, 4, 7, 9]); // C D E G A
const LOOPED: TrackId[] = ['map', 'level'];

describe('partituras', () => {
  it.each(LOOPED)('cada voz de «%s» dura exactamente el bucle (8 compases)', (id) => {
    const src = TRACK_SOURCES[id];
    expect(voiceLength(src.lead)).toBe(32);
    expect(voiceLength(src.bass)).toBe(32);
    expect(TRACKS[id].length).toBe(32);
  });

  it.each(['map', 'level', 'victory'] as TrackId[])('«%s» solo usa Do mayor pentatónico y sin agudos extremos', (id) => {
    for (const e of TRACKS[id].events) {
      if (e.midi === undefined) continue;
      expect(PENTATONIC.has(e.midi % 12)).toBe(true);
      expect(e.midi).toBeLessThanOrEqual(noteToMidi('C7'));
    }
  });

  it('las piezas con bucle son más lentas en el mapa que en el nivel', () => {
    expect(TRACKS.map.bpm).toBeLessThan(TRACKS.level.bpm);
  });

  it('la victoria no tiene bucle, dura unos 2 s y acaba en Do', () => {
    const v = TRACKS.victory;
    expect(v.loop).toBe(false);
    expect((v.length * 60) / v.bpm).toBeLessThanOrEqual(2.2);
    const leads = v.events.filter((e) => e.voice === 'lead');
    expect(leads[leads.length - 1]!.midi! % 12).toBe(0);
  });
});

describe('eventsBetween', () => {
  const track = TRACKS.level;

  it('una ventana que cruza el final del bucle da el final y el principio, sin duplicados ni huecos', () => {
    const before = eventsBetween(track, 30, 32);
    const after = eventsBetween(track, 32, 34);
    const across = eventsBetween(track, 30, 34);
    expect(across).toEqual([...before, ...after]);
    expect(after.map((e) => e.beat - 32)).toEqual(eventsBetween(track, 0, 2).map((e) => e.beat));
  });

  it('trocear la ventana da los mismos eventos que pedirla entera', () => {
    const whole = eventsBetween(track, 0, 100);
    const pieces = [];
    for (let b = 0; b < 100; b += 0.37) pieces.push(...eventsBetween(track, b, Math.min(100, b + 0.37)));
    expect(pieces).toEqual(whole);
  });

  it('una pieza sin bucle no se repite', () => {
    expect(eventsBetween(TRACKS.victory, TRACKS.victory.length, 100)).toEqual([]);
  });

  it('una ventana vacía o al revés no da eventos', () => {
    expect(eventsBetween(track, 5, 5)).toEqual([]);
    expect(eventsBetween(track, 6, 5)).toEqual([]);
  });
});
