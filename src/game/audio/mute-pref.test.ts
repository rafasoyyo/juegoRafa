import { describe, expect, it } from 'vitest';
import { loadMuted, MUTE_KEY, saveMuted } from './mute-pref';

function memoryStorage(initial: Record<string, string> = {}): Pick<Storage, 'getItem' | 'setItem'> & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const broken: Pick<Storage, 'getItem' | 'setItem'> = {
  getItem: () => {
    throw new Error('bloqueado');
  },
  setItem: () => {
    throw new Error('bloqueado');
  },
};

describe('preferencia de silencio', () => {
  it('por defecto se juega con sonido', () => {
    expect(loadMuted(memoryStorage())).toBe(false);
    expect(loadMuted(undefined)).toBe(false);
  });

  it('ida y vuelta', () => {
    const s = memoryStorage();
    saveMuted(s, true);
    expect(s.data[MUTE_KEY]).toBe('1');
    expect(loadMuted(s)).toBe(true);
    saveMuted(s, false);
    expect(loadMuted(s)).toBe(false);
  });

  it('un valor corrupto cuenta como con sonido', () => {
    expect(loadMuted(memoryStorage({ [MUTE_KEY]: 'quizás' }))).toBe(false);
  });

  it('un almacenamiento que lanza no rompe nada', () => {
    expect(loadMuted(broken)).toBe(false);
    expect(() => saveMuted(broken, true)).not.toThrow();
  });
});
