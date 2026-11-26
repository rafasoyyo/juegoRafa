import { beforeEach, describe, expect, it } from 'vitest';
import { buyHat, completeLevel, createGameState, currentLevel, levelStatus, markPending, session, winMedal, worldProgress, type GameState } from '../state';
import { ARCOIRIS } from '../worlds/arcoiris';
import { activateProfile, activeAge, activeAlias, activeProfileId, DEFAULT_ALIAS, saveActive, savedProfiles, startProfile, useStore } from './active';
import { cleanAlias, isValidProfile, profileId } from './profile-id';
import { decodeProgress, encodeProgress } from './progress-codec';
import { createProfile, listProfiles, loadProgress, saveProgress, type KeyValueStore } from './profile-store';

/** El mundo 1: el progreso guardado antes de los mundos es suyo. */
const W = ARCOIRIS;
const prog = (s: GameState) => worldProgress(s, W.id);

class FakeStore implements KeyValueStore {
  data = new Map<string, string>();
  failWrites = false;
  get length(): number {
    return this.data.size;
  }
  key(i: number): string | null {
    return [...this.data.keys()][i] ?? null;
  }
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    if (this.failWrites) throw new Error('lleno');
    this.data.set(k, v);
  }
}

describe('id del perfil', () => {
  it('alias en minúsculas, sin tildes, y la edad', () => {
    expect(profileId('LUCIA', 5)).toBe('lucia-5');
    expect(profileId('NIÑA', 4)).toBe('nina-4');
    expect(profileId('lucía', 6)).toBe('lucia-6');
  });
  it('limpia el alias y lo limita a 12 letras', () => {
    expect(cleanAlias('a-b 1c')).toBe('ABC');
    expect(cleanAlias('ABCDEFGHIJKLMNO')).toHaveLength(12);
  });
  it('alias vacío o edad fuera de rango no valen', () => {
    expect(isValidProfile('', 5)).toBe(false);
    expect(isValidProfile('123', 5)).toBe(false);
    expect(isValidProfile('ANA', 2)).toBe(false);
    expect(isValidProfile('ANA', 9)).toBe(false);
    expect(isValidProfile('ANA', 3)).toBe(true);
  });
});

describe('progress-codec', () => {
  it('ida y vuelta', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 2, 15);
    s.cookies = 30;
    buyHat(s, 'wool');
    const back = decodeProgress(JSON.parse(JSON.stringify(encodeProgress(s))));
    expect(prog(back).stars.get(1)).toBe(2);
    expect(back.cookies).toBe(20);
    expect(back.hat).toBe('wool');
    expect(back.ownedHats.has('wool')).toBe(true);
  });
  it('ignora datos dañados', () => {
    expect(decodeProgress(null).cookies).toBe(0);
    const s = decodeProgress({ stars: [[1, 9], [99, 2], 'x', [2, 'a']], cookies: -5, ownedHats: ['crown', 'zzz'], hat: 'zzz' });
    expect([...prog(s).stars]).toEqual([[1, 3]]);
    expect(s.cookies).toBe(0);
    expect(s.ownedHats.has('crown')).toBe(true);
    expect(s.hat).toBe('cap');
  });
  it('un gorro puesto que no se tiene vuelve al inicial', () => {
    expect(decodeProgress({ ownedHats: ['cap'], hat: 'crown' }).hat).toBe('cap');
  });
});

describe('progress-codec: niveles pendientes', () => {
  it('ida y vuelta con pendientes', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 2, 3);
    markPending(s, W.id, 2, 1);
    const back = decodeProgress(JSON.parse(JSON.stringify(encodeProgress(s))));
    expect([...prog(back).pending]).toEqual([2]);
    expect(prog(back).stars.get(1)).toBe(2);
    expect(back.cookies).toBe(4);
  });

  it('un registro antiguo sin pending conserva sus niveles hechos', () => {
    const back = decodeProgress({ stars: [[1, 3], [2, 2]], cookies: 7, ownedHats: ['cap'], hat: 'cap' });
    expect(prog(back).pending.size).toBe(0);
    expect(prog(back).stars.get(1)).toBe(3);
    expect(prog(back).stars.get(2)).toBe(2);
  });

  it('un registro guardado con el mundo de 6 niveles, los 6 hechos, sigue valiendo: el 7 es el actual', () => {
    const saved = { stars: [[1, 3], [2, 2], [3, 3], [4, 1], [5, 2], [6, 3]], pending: [], cookies: 40, ownedHats: ['cap', 'none'], hat: 'cap' };
    const back = decodeProgress(saved);
    expect([...prog(back).stars.entries()]).toEqual(saved.stars);
    expect(currentLevel(back, W)).toBe(7);
    expect(levelStatus(back, W, 7)).toBe('current');
    for (let l = 8; l <= 12; l++) expect(levelStatus(back, W, l)).toBe('locked');
  });

  it('ignora pendientes dañados, fuera de rango o ya hechos', () => {
    const back = decodeProgress({ stars: [[1, 3]], pending: [1, 0, 13, 2.5, 'x', null, 3], cookies: 0 });
    expect([...prog(back).pending]).toEqual([3]);
    expect(prog(decodeProgress({ stars: [], pending: 'basura' })).pending.size).toBe(0);
  });
});

describe('progress-codec: mundos', () => {
  it('guarda cada mundo bajo su id, sin el formato antiguo', () => {
    const s = createGameState();
    completeLevel(s, W.id, 1, 2, 0);
    markPending(s, W.id, 2, 0);
    const saved = JSON.parse(JSON.stringify(encodeProgress(s)));
    expect(saved.worlds).toEqual({ arcoiris: { stars: [[1, 2]], pending: [2] } });
    expect(saved.stars).toBeUndefined();
    expect(saved.pending).toBeUndefined();
  });

  it('un perfil de antes de los mundos pasa entero al mundo 1 y sigue igual al volver a guardarlo', () => {
    const old = { stars: [[1, 3], [2, 2]], pending: [3], cookies: 9, ownedHats: ['cap', 'none', 'wool'], hat: 'wool' };
    const back = decodeProgress(old);
    expect([...prog(back).stars]).toEqual([[1, 3], [2, 2]]);
    expect([...prog(back).pending]).toEqual([3]);
    expect(currentLevel(back, W)).toBe(4);
    expect(back.cookies).toBe(9);
    expect(back.hat).toBe('wool');
    const again = decodeProgress(JSON.parse(JSON.stringify(encodeProgress(back))));
    expect([...prog(again).stars]).toEqual([[1, 3], [2, 2]]);
    expect([...prog(again).pending]).toEqual([3]);
  });

  it('valida los niveles con el tamaño de cada mundo', () => {
    const otro = { id: 'otro', levelCount: 3 };
    const back = decodeProgress({ worlds: { otro: { stars: [[1, 2], [4, 3]], pending: [3, 4] }, arcoiris: { stars: [[12, 1]], pending: [] } } }, [W, otro]);
    expect([...worldProgress(back, 'otro').stars]).toEqual([[1, 2]]);
    expect([...worldProgress(back, 'otro').pending]).toEqual([3]);
    expect([...prog(back).stars]).toEqual([[12, 1]]);
  });

  it('conserva el progreso de un mundo que no está registrado en esta versión', () => {
    const back = decodeProgress({ worlds: { futuro: { stars: [[1, 2]], pending: [2] }, roto: 'x' } });
    expect([...worldProgress(back, 'futuro').stars]).toEqual([[1, 2]]);
    expect(back.worlds.has('roto')).toBe(false);
    expect(encodeProgress(back).worlds?.futuro).toEqual({ stars: [[1, 2]], pending: [2] });
  });
});

describe('profile-store', () => {
  it('crea, recupera y no duplica el mismo alias y edad', () => {
    const st = new FakeStore();
    const a = createProfile(st, 'LUCIA', 5, 1)!;
    const s = a.progress;
    completeLevel(s, W.id, 1, 3, 4);
    saveProgress(st, a.info.id, s, 2);
    const again = createProfile(st, 'lucia', 5, 3)!;
    expect(prog(again.progress).stars.get(1)).toBe(3);
    expect(listProfiles(st)).toHaveLength(1);
  });
  it('misma alias con otra edad es otro perfil, sin mezclar progreso', () => {
    const st = new FakeStore();
    const a = createProfile(st, 'LUCIA', 5, 1)!;
    completeLevel(a.progress, W.id, 1, 3, 0);
    saveProgress(st, a.info.id, a.progress, 2);
    const b = createProfile(st, 'LUCIA', 6, 3)!;
    expect(prog(b.progress).stars.size).toBe(0);
    expect(listProfiles(st).map((p) => p.id)).toEqual(['lucia-6', 'lucia-5']);
  });
  it('ignora registros dañados y de otra versión, y conserva los demás', () => {
    const st = new FakeStore();
    createProfile(st, 'ANA', 4, 1);
    st.data.set('juegoRafa.profile.roto-5', '{no json');
    st.data.set('juegoRafa.profile.v2-5', JSON.stringify({ v: 2, alias: 'V', age: 5 }));
    expect(listProfiles(st).map((p) => p.id)).toEqual(['ana-4']);
    expect(loadProgress(st, 'roto-5')).toBeNull();
  });
  it('rechaza alias o edad inválidos', () => {
    expect(createProfile(new FakeStore(), '', 5)).toBeNull();
  });
  it('un almacén que falla al escribir no rompe nada', () => {
    const st = new FakeStore();
    st.failWrites = true;
    expect(() => createProfile(st, 'ANA', 4)).not.toThrow();
    expect(listProfiles(st)).toEqual([]);
  });
});

describe('perfil activo', () => {
  beforeEach(() => {
    useStore(new FakeStore());
    Object.assign(session, createGameState());
  });

  it('cargar otro perfil no mezcla el progreso', () => {
    startProfile('ANA', 4);
    completeLevel(session, W.id, 1, 3, 12);
    saveActive();
    startProfile('BEA', 5);
    expect(prog(session).stars.size).toBe(0);
    expect(session.cookies).toBe(0);
    expect(activateProfile('ana-4')).toBe(true);
    expect(prog(session).stars.get(1)).toBe(3);
    expect(session.cookies).toBe(12);
    expect(savedProfiles()).toHaveLength(2);
  });

  it('el mismo alias y edad recuperan el progreso', () => {
    startProfile('ANA', 4);
    completeLevel(session, W.id, 1, 2, 0);
    saveActive();
    startProfile('ana', 4);
    expect(prog(session).stars.get(1)).toBe(2);
  });

  it('conserva gorro y galletas', () => {
    startProfile('ANA', 4);
    session.cookies = 20;
    buyHat(session, 'wool');
    saveActive();
    startProfile('BEA', 5);
    activateProfile('ana-4');
    expect(session.hat).toBe('wool');
    expect(session.cookies).toBe(10);
  });

  it('sin almacenamiento se juega sin guardar y sin errores', () => {
    useStore(null);
    expect(startProfile('ANA', 4)).toBe(true);
    expect(activeProfileId()).toBeNull();
    expect(() => saveActive()).not.toThrow();
    expect(savedProfiles()).toEqual([]);
  });

  it('el pendiente se guarda y se recupera', () => {
    startProfile('ANA', 4);
    markPending(session, W.id, 1, 2);
    saveActive();
    startProfile('BEA', 5);
    expect(prog(session).pending.size).toBe(0);
    activateProfile('ana-4');
    expect(prog(session).pending.has(1)).toBe(true);
    expect(session.cookies).toBe(2);
  });

  it('alias y edad del perfil activo', () => {
    expect(activeAlias()).toBe(DEFAULT_ALIAS);
    expect(activeAge()).toBeUndefined();
    startProfile('lucía', 5);
    expect(activeAlias()).toBe('LUCIA');
    expect(activeAge()).toBe(5);
    startProfile('BEA', 7);
    activateProfile('lucia-5');
    expect(activeAlias()).toBe('LUCIA');
    expect(activeAge()).toBe(5);
  });

  it('alias y edad también sin almacenamiento', () => {
    useStore(null);
    startProfile('NIÑA', 3);
    expect(activeAlias()).toBe('NIÑA');
    expect(activeAge()).toBe(3);
  });

  it('activar un perfil inexistente devuelve false', () => {
    expect(activateProfile('nadie-5')).toBe(false);
  });
});

describe('paso pendiente', () => {
  it('alias → edad → aceptar', async () => {
    const { guideStep } = await import('./guide-step');
    expect(guideStep('', 0)).toBe('alias');
    expect(guideStep('', 5)).toBe('alias');
    expect(guideStep('A', 0)).toBe('age');
    expect(guideStep('ANA', 5)).toBe('accept');
  });
});

describe('progress-codec: medalla del castillo', () => {
  it('ida y vuelta con la medalla; sin medalla no se guarda el campo', () => {
    const s = createGameState();
    completeLevel(s, 'arcoiris', 1, 2, 0);
    winMedal(s, 'rio', 0);
    const saved = encodeProgress(s);
    expect(saved.worlds?.rio).toEqual({ stars: [], pending: [], medal: true });
    expect(saved.worlds?.arcoiris).toEqual({ stars: [[1, 2]], pending: [] });
    const back = decodeProgress(JSON.parse(JSON.stringify(saved)));
    expect(back.worlds.get('rio')?.medal).toBe(true);
    expect(back.worlds.get('arcoiris')?.medal).toBe(false);
  });

  it('una medalla dañada no cuenta', () => {
    const back = decodeProgress({ worlds: { rio: { stars: [[1, 2]], pending: [], medal: 'si' } } });
    expect(back.worlds.get('rio')?.medal).toBe(false);
  });
});
