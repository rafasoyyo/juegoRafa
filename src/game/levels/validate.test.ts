import { describe, expect, it } from 'vitest';
import type { LevelData } from './types';
import { RULES, validateLevel } from './validate';

/** Nivel corto y válido: salida en la baldosa 6, bandera en la 56. */
const VALID: LevelData = {
  id: 'prueba',
  ambient: 'prado',
  length: 60,
  steps: [{ x: 20, width: 5, height: 1 }],
  platforms: [{ x: 34, width: 4, height: 1.5 }],
  blocks: [
    { x: 14, row: 'low' },
    { x: 22.5, row: 'high', on: 'step' },
    { x: 36, row: 'low', on: 'platform' },
    { x: 46, row: 'high' },
  ],
};

function withChanges(change: (level: LevelData) => void): LevelData {
  const level = structuredClone(VALID);
  change(level);
  return level;
}

/** Comprueba que el nivel falla y que algún error menciona el elemento y el motivo. */
function expectError(level: LevelData, element: string, reason: RegExp): void {
  const errors = validateLevel(level);
  const match = errors.find((e) => e.startsWith(`prueba: ${element} `) && reason.test(e));
  expect(match, `se esperaba un error de ${element} que case con ${reason}; hay: ${JSON.stringify(errors)}`).toBeDefined();
}

describe('validateLevel', () => {
  it('un nivel bien hecho no tiene errores', () => {
    expect(validateLevel(VALID)).toEqual([]);
  });

  it('subidas: una plataforma más alta que un salto cómodo', () => {
    expectError(withChanges((l) => (l.platforms[0]!.height = 2)), 'platforms[0]', /máximo 126/);
  });

  it('subidas: un escalón de 3 peldaños', () => {
    expectError(withChanges((l) => (l.steps[0]!.height = 3)), 'steps[0]', /3 peldaños/);
  });

  it('tamaños: una plataforma demasiado estrecha', () => {
    expectError(withChanges((l) => (l.platforms[0]!.width = 2)), 'platforms[0]', /mínimo 3/);
  });

  it('alcance de la cabeza: un bloque que la cabeza no alcanza', () => {
    const errors = validateLevel(VALID, { ...RULES, maxHeadReach: 150 });
    expect(errors.some((e) => e.startsWith('prueba: blocks[1] ') && /la cabeza llega a 150/.test(e))).toBe(true);
  });

  it('hueco para estar de pie: un bloque bajo pegado a un escalón', () => {
    expectError(withChanges((l) => (l.blocks[0]!.x = 19.2)), 'blocks[0]', /deja 78 px sobre steps\[0\]/);
  });

  it('banda del HUD: un bloque alto sobre una plataforma sobre un escalón alto', () => {
    const level = withChanges((l) => {
      l.steps[0]!.height = 2;
      l.platforms = [{ x: 21, width: 3, height: 1.5 }];
      l.blocks = [{ x: 14, row: 'low' }, { x: 22.5, row: 'high', on: 'platform' }, { x: 40, row: 'low' }];
    });
    expectError(level, 'blocks[1]', /bajo el HUD/);
  });

  it('huecos entre escalones: ni 0 ni al menos 2 baldosas', () => {
    expectError(withChanges((l) => l.steps.push({ x: 26, width: 3, height: 2 })), 'steps[1]', /hueco de 1 baldosas/);
  });

  it('huecos entre escalones: pegados con la misma altura', () => {
    expectError(withChanges((l) => l.steps.push({ x: 25, width: 3, height: 1 })), 'steps[1]', /misma altura/);
  });

  it('salida libre: un bloque a menos de 6 baldosas de la salida', () => {
    expectError(withChanges((l) => (l.blocks[0]!.x = 9)), 'blocks[0]', /de la salida/);
  });

  it('bandera libre: un bloque a menos de 5 baldosas de la bandera', () => {
    expectError(withChanges((l) => (l.blocks[3]!.x = 53)), 'blocks[3]', /de la bandera/);
  });

  it('densidad: más de 8 s corriendo sin ningún elemento', () => {
    expectError(withChanges((l) => (l.length = 100)), 'la bandera', /baldosas vacías de blocks\[3\]/);
    const lateStart = withChanges((l) => {
      l.length = 100;
      l.steps = [];
      l.platforms = [];
      l.blocks = [{ x: 45, row: 'low' }, { x: 60, row: 'low' }, { x: 75, row: 'low' }];
    });
    expectError(lateStart, 'blocks[0]', /38.5 baldosas vacías de la salida/);
  });

  it('límites: un bloque más allá de la bandera', () => {
    expectError(withChanges((l) => (l.blocks[3]!.x = 58)), 'blocks[3]', /más allá de la bandera/);
  });

  it('solapes: escalones, plataformas y bloques', () => {
    expectError(withChanges((l) => l.steps.push({ x: 23, width: 4, height: 2 })), 'steps[1]', /se solapa con steps\[0\]/);
    expectError(withChanges((l) => l.platforms.push({ x: 36, width: 4, height: 1 })), 'platforms[1]', /se solapa con platforms\[0\]/);
    expectError(withChanges((l) => l.blocks.push({ x: 14.5, row: 'high' })), 'blocks[4]', /se solapa con blocks\[0\]/);
  });

  it('`on` tiene que coincidir con la superficie real', () => {
    expectError(withChanges((l) => (l.blocks[0]!.on = 'platform')), 'blocks[0]', /sobre «ground»/);
  });
});
