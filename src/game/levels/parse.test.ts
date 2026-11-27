import { describe, expect, it } from 'vitest';
import { GROUND_TOP } from '../level-course';
import { LevelFormatError, parseLevel, toWorld } from './parse';
import { ROW_BASE, STEP_RISE, TILE } from './types';

const VALID = {
  ambient: 'bosque',
  length: 60,
  steps: [{ x: 20, width: 5, height: 1 }],
  platforms: [{ x: 34, width: 4, height: 1.5 }],
  blocks: [
    { x: 14, row: 'low' },
    { x: 22.5, row: 'high', on: 'step' },
    { x: 36, row: 'low', on: 'platform' },
  ],
};

/** Copia profunda del nivel válido para estropearla en cada prueba. */
function variant(): Record<string, unknown> & typeof VALID {
  return structuredClone(VALID);
}

describe('parseLevel', () => {
  it('lee un JSON válido', () => {
    const level = parseLevel('nivel-x', VALID);
    expect(level).toEqual({ id: 'nivel-x', ...VALID, spikes: [], challenges: [] });
  });

  it('lee los retos con sus valores por defecto y rechaza los mal formados', () => {
    const withChallenges = { ...variant(), challenges: [{ kind: 'count', x: 30, demo: true }, { kind: 'count', x: 50, show: 'tenframe', reverse: true }] };
    expect(parseLevel('nivel-x', withChallenges).challenges).toEqual([
      { kind: 'count', x: 30, show: 'dots', reverse: false, demo: true },
      { kind: 'count', x: 50, show: 'tenframe', reverse: true, demo: false },
    ]);
    expect(() => parseLevel('nivel-9', { ...variant(), challenges: [{ kind: 'puente', x: 3 }] })).toThrow(/nivel-9: challenges\[0\]\.kind/);
    expect(() => parseLevel('nivel-9', { ...variant(), challenges: [{ kind: 'count', x: 3, show: 'dedos' }] })).toThrow(/challenges\[0\]\.show/);
    expect(() => parseLevel('nivel-9', { ...variant(), challenges: [{ kind: 'count', x: 3, demo: 'sí' }] })).toThrow(/challenges\[0\]\.demo/);
  });

  it('un nivel sin «spikes» no tiene pinchos; con zonas, las lee', () => {
    expect(parseLevel('nivel-x', VALID).spikes).toEqual([]);
    const withSpikes = { ...variant(), spikes: [{ x: 26, width: 2 }] };
    expect(parseLevel('nivel-x', withSpikes).spikes).toEqual([{ x: 26, width: 2 }]);
    expect(() => parseLevel('nivel-9', { ...variant(), spikes: [{ x: 26 }] })).toThrow(/nivel-9: spikes\[0\] no tiene «width»/);
    expect(() => parseLevel('nivel-9', { ...variant(), spikes: {} })).toThrow(/nivel-9: spikes no es una lista/);
  });

  it('un campo que falta da un error con el nivel y el elemento', () => {
    const noLength = variant() as Record<string, unknown>;
    delete noLength.length;
    expect(() => parseLevel('nivel-3', noLength)).toThrow(LevelFormatError);
    expect(() => parseLevel('nivel-3', noLength)).toThrow(/nivel-3: .*length/);

    const noRow = variant();
    delete (noRow.blocks[1] as { row?: string }).row;
    expect(() => parseLevel('nivel-3', noRow)).toThrow(/nivel-3: blocks\[1\] no tiene «row»/);

    const noWidth = variant();
    delete (noWidth.platforms[0] as { width?: number }).width;
    expect(() => parseLevel('nivel-3', noWidth)).toThrow(/nivel-3: platforms\[0\] no tiene «width»/);
  });

  it('rechaza tipos y valores que no entiende', () => {
    const badAmbient = { ...variant(), ambient: 'luna' };
    expect(() => parseLevel('nivel-2', badAmbient)).toThrow(/nivel-2: ambient/);
    const badRow = variant();
    badRow.blocks[0]!.row = 'medium';
    expect(() => parseLevel('nivel-2', badRow)).toThrow(/nivel-2: blocks\[0\]\.row/);
    const badX = variant();
    (badX.steps[0] as { x: unknown }).x = '20';
    expect(() => parseLevel('nivel-2', badX)).toThrow(/nivel-2: steps\[0\]\.x no es un número/);
    expect(() => parseLevel('nivel-2', [])).toThrow(/nivel-2: el archivo/);
  });
});

describe('toWorld', () => {
  const world = toWorld(parseLevel('nivel-x', VALID));

  it('salida, bandera y ancho del mundo en píxeles', () => {
    expect(world.width).toBe(60 * TILE);
    expect(world.startX).toBe(6 * TILE);
    expect(world.flagX).toBe(56 * TILE);
  });

  it('escalones y plataformas en píxeles', () => {
    expect(world.steps[0]).toMatchObject({ x: 20 * TILE, width: 5 * TILE, height: STEP_RISE, top: GROUND_TOP - STEP_RISE });
    expect(world.platforms[0]).toMatchObject({ x: 34 * TILE, width: 4 * TILE, height: 126, top: GROUND_TOP - 126, base: 0 });
  });

  it('un bloque sobre el suelo tiene la base a su fila sobre el suelo', () => {
    expect(world.blocks[0]).toMatchObject({ x: 14 * TILE, surface: 'ground', bottom: GROUND_TOP - ROW_BASE.low });
  });

  it('un bloque sobre un escalón se apoya en el escalón', () => {
    expect(world.blocks[1]).toMatchObject({ surface: 'step', surfaceHeight: STEP_RISE, bottom: GROUND_TOP - STEP_RISE - ROW_BASE.high });
  });

  it('un bloque sobre una plataforma se apoya en la plataforma', () => {
    expect(world.blocks[2]).toMatchObject({ x: 36 * TILE, surface: 'platform', surfaceHeight: 126, bottom: GROUND_TOP - 126 - ROW_BASE.low });
  });

  it('sin pinchos, la lista del mundo está vacía; con zonas, van en píxeles', () => {
    expect(world.spikes).toEqual([]);
    const level = parseLevel('nivel-z', { ...VALID, spikes: [{ x: 28, width: 1 }, { x: 44.5, width: 2 }] });
    expect(toWorld(level).spikes).toEqual([
      { index: 0, x: 28 * TILE, width: TILE },
      { index: 1, x: 44.5 * TILE, width: 2 * TILE },
    ]);
  });

  it('una plataforma sobre un escalón mide su altura desde el escalón', () => {
    const level = parseLevel('nivel-y', { ...VALID, platforms: [{ x: 21, width: 3, height: 1 }], blocks: [] });
    const p = toWorld(level).platforms[0]!;
    expect(p.base).toBe(STEP_RISE);
    expect(p.height).toBe(STEP_RISE + TILE);
  });
});
