/**
 * Notas y notación compacta de las partituras. TypeScript puro (sin Phaser ni Web Audio).
 *
 * Notación de una voz: fragmentos separados por espacios, cada uno `nota/duración` en pulsos,
 * p. ej. `"C5/1 E5/.5 -/.5 G5/2"`. `-` es un silencio. Admite sostenidos (`C#5`) y bemoles (`Db5`).
 */

export interface NoteEvent {
  /** Inicio en pulsos desde el principio de la voz. */
  beat: number;
  midi: number;
  /** Duración en pulsos. */
  dur: number;
}

const STEPS: Readonly<Record<string, number>> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NOTE_RE = /^([A-G])([#b]?)(-?\d)$/;

/** Frecuencia en Hz de una nota MIDI (A4 = 69 = 440 Hz). */
export function midiToHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

/** Número MIDI de una nota escrita como `C4`, `F#3` o `Bb5` (C4 = 60). */
export function noteToMidi(note: string): number {
  const m = NOTE_RE.exec(note);
  if (!m) throw new Error(`Nota no válida: «${note}»`);
  const [, letter, accidental, octave] = m;
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  return (Number(octave) + 1) * 12 + STEPS[letter!]! + shift;
}

/** Convierte una voz en notación compacta en eventos con su pulso de inicio. */
export function parseVoice(text: string): NoteEvent[] {
  const events: NoteEvent[] = [];
  let beat = 0;
  for (const token of text.trim().split(/\s+/)) {
    if (!token) continue;
    const [name, durText, extra] = token.split('/');
    const dur = Number(durText);
    if (!name || durText === undefined || extra !== undefined || !Number.isFinite(dur) || dur <= 0) {
      throw new Error(`Fragmento no válido: «${token}»`);
    }
    if (name !== '-') {
      let midi: number;
      try {
        midi = noteToMidi(name);
      } catch {
        throw new Error(`Fragmento no válido: «${token}»`);
      }
      events.push({ beat, midi, dur });
    }
    beat += dur;
  }
  return events;
}

/** Suma de las duraciones de una voz, silencios incluidos. */
export function voiceLength(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, token) => sum + Number(token.split('/')[1]), 0);
}
