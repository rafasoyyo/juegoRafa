import { describe, expect, it } from 'vitest';
import { midiToHz, noteToMidi, parseVoice, voiceLength } from './notes';

describe('midiToHz y noteToMidi', () => {
  it('A4 es 440 Hz y C4 es 60', () => {
    expect(midiToHz(noteToMidi('A4'))).toBe(440);
    expect(noteToMidi('C4')).toBe(60);
  });

  it('sostenidos y bemoles equivalentes dan la misma nota', () => {
    expect(noteToMidi('C#5')).toBe(noteToMidi('Db5'));
    expect(noteToMidi('C#5')).toBe(73);
  });

  it('una octava más es el doble de frecuencia', () => {
    expect(midiToHz(noteToMidi('C6'))).toBeCloseTo(2 * midiToHz(noteToMidi('C5')), 6);
  });
});

describe('parseVoice', () => {
  it('acumula el tiempo y los silencios lo avanzan sin crear evento', () => {
    expect(parseVoice('C5/1 E5/.5 -/.5 G5/2')).toEqual([
      { beat: 0, midi: 72, dur: 1 },
      { beat: 1, midi: 76, dur: 0.5 },
      { beat: 2, midi: 79, dur: 2 },
    ]);
  });

  it('la longitud suma todas las duraciones', () => {
    expect(voiceLength('C5/1 E5/.5 -/.5 G5/2')).toBe(4);
  });

  it('una nota mal escrita da un error que nombra el fragmento', () => {
    expect(() => parseVoice('C5/1 H5/1')).toThrow('«H5/1»');
    expect(() => parseVoice('C5')).toThrow('«C5»');
    expect(() => parseVoice('C5/0')).toThrow('«C5/0»');
  });
});
