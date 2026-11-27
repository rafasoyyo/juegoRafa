import { describe, expect, it } from 'vitest';
import { challengeZone, type LevelData } from './types';
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
  spikes: [],
  challenges: [],
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

describe('validateLevel: zonas de pinchos', () => {
  /** El nivel válido con dos zonas bien puestas: una de 1 baldosa y otra de 2. */
  const withSpikes = (change: (level: LevelData) => void = () => {}): LevelData =>
    withChanges((l) => {
      l.spikes = [
        { x: 29, width: 1 },
        { x: 40.5, width: 2 },
      ];
      change(l);
    });

  it('un nivel con pinchos bien puestos no tiene errores', () => {
    expect(validateLevel(withSpikes())).toEqual([]);
  });

  it('ancho: entre 1 y 2 baldosas', () => {
    expectError(withSpikes((l) => (l.spikes[0]!.width = 0.5)), 'spikes[0]', /mide 0.5 baldosas \(entre 1 y 2\)/);
    expectError(withSpikes((l) => (l.spikes[1]!.width = 3)), 'spikes[1]', /mide 3 baldosas/);
  });

  it('saltable: el ancho más los márgenes cabe en un salto normal', () => {
    expect(RULES.jumpReach).toBeGreaterThan(2 + 2 * RULES.spikeTakeoff);
    const errors = validateLevel(withSpikes(), { ...RULES, jumpReach: 2.5 });
    expect(errors.some((e) => e.startsWith('prueba: spikes[1] ') && /no se cruza con un salto normal/.test(e))).toBe(true);
    expect(errors.some((e) => e.startsWith('prueba: spikes[0] '))).toBe(false);
  });

  it('solo en el suelo: ni sobre un escalón ni bajo una plataforma', () => {
    expectError(withSpikes((l) => (l.spikes[0]!.x = 22)), 'spikes[0]', /está sobre steps\[0\]/);
    expectError(withSpikes((l) => (l.spikes[0]!.x = 35)), 'spikes[0]', /está bajo platforms\[0\]/);
  });

  it('salida y bandera: a 10 baldosas o más', () => {
    expectError(withSpikes((l) => (l.spikes[0]!.x = 12)), 'spikes[0]', /a menos de 10 baldosas de la salida/);
    expectError(withSpikes((l) => (l.spikes[1]!.x = 47)), 'spikes[1]', /a menos de 10 baldosas de la bandera/);
    expectError(withSpikes((l) => (l.spikes[1]!.x = 57)), 'spikes[1]', /más allá de la bandera/);
  });

  it('a 2 baldosas o más de bloques, escalones y plataformas', () => {
    expectError(withSpikes((l) => (l.spikes[1]!.x = 43.5)), 'spikes[1]', /a menos de 2 baldosas de blocks\[3\]/);
    expectError(withSpikes((l) => (l.spikes[0]!.x = 26)), 'spikes[0]', /a menos de 2 baldosas de steps\[0\]/);
    expectError(withSpikes((l) => (l.spikes[1]!.x = 38.5)), 'spikes[1]', /a menos de 2 baldosas de platforms\[0\]/);
  });

  it('a 6 baldosas o más entre zonas', () => {
    expectError(withSpikes((l) => (l.spikes[1]!.x = 31)), 'spikes[1]', /deja 1 baldosas con spikes\[0\] \(mínimo 6\)/);
  });

  it('densidad: una zona de pinchos cuenta como elemento', () => {
    const long = withChanges((l) => (l.length = 100));
    expectError(long, 'la bandera', /baldosas vacías/);
    const withZone = withChanges((l) => {
      l.length = 100;
      l.spikes = [{ x: 70, width: 1 }];
    });
    expect(validateLevel(withZone)).toEqual([]);
  });

  it('cada error nombra el nivel y la zona', () => {
    const errors = validateLevel({ ...withSpikes((l) => (l.spikes[0]!.x = 12)), id: 'nivel-9' });
    expect(errors.some((e) => e.startsWith('nivel-9: spikes[0] '))).toBe(true);
  });
});

describe('retos del recorrido', () => {
  /** Nivel largo con un reto en el tramo llano de 55 a 65. */
  const withChallenge = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 90;
      l.blocks.push({ x: 70, row: 'low' });
      l.challenges.push({ kind: 'count', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('un reto sobre suelo llano y libre es válido', () => {
    expect(validateLevel(withChallenge(61))).toEqual([]);
  });

  it('un reto con un bloque, un escalón o pinchos en su zona falla', () => {
    expectError(withChallenge(50), 'challenges[0]', /blocks\[3\]/);
    expectError(withChallenge(61, (l) => l.steps.push({ x: 63, width: 2, height: 1 })), 'challenges[0]', /steps\[1\]/);
    expectError(withChallenge(61, (l) => l.spikes.push({ x: 56, width: 1 })), 'challenges[0]', /spikes\[0\]/);
  });

  it('un reto fuera del recorrido o pegado a la bandera falla', () => {
    expectError(withChallenge(80), 'challenges[0]', /bandera/);
  });

  it('dos retos que se solapan fallan', () => {
    expectError(withChallenge(61, (l) => l.challenges.push({ kind: 'count', x: 66, show: 'dots', reverse: false, demo: false })), 'challenges[1]', /se solapa/);
  });
});

describe('puentes', () => {
  const withBridge = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 100;
      l.blocks.push({ x: 82, row: 'low' });
      l.challenges.push({ kind: 'bridge', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('un puente sobre suelo llano y libre es válido', () => {
    expect(validateLevel(withBridge(54))).toEqual([]);
  });

  it('un puente con una plataforma encima falla', () => {
    expectError(withBridge(54, (l) => l.platforms.push({ x: 60, width: 4, height: 1.5 })), 'challenges[0]', /platforms\[1\]/);
  });
});

describe('barcas', () => {
  const withBoat = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 100;
      l.blocks.push({ x: 82, row: 'low' });
      l.challenges.push({ kind: 'boat', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('una barca con su muelle y su lago sobre suelo llano y libre es válida', () => {
    expect(validateLevel(withBoat(60))).toEqual([]);
  });

  it('un escalón en el muelle de la barca falla', () => {
    expectError(withBoat(60, (l) => l.steps.push({ x: 55, width: 2, height: 1 })), 'challenges[0]', /steps\[/);
  });
});

describe('caminos de huellas (isla)', () => {
  const withFootprints = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 100;
      l.blocks.push({ x: 82, row: 'low' });
      l.challenges.push({ kind: 'footprints', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('ocupan lo mismo que un puente: sobre suelo llano y libre es válido', () => {
    expect(validateLevel(withFootprints(54))).toEqual([]);
    expect(challengeZone({ kind: 'footprints', x: 54 })).toEqual(challengeZone({ kind: 'bridge', x: 54 }));
  });

  it('con un escalón encima falla', () => {
    expectError(withFootprints(54, (l) => l.steps.push({ x: 60, width: 3, height: 1 })), 'challenges[0]', /steps/);
  });
});

describe('puertas de la cueva (isla)', () => {
  const withDoor = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 100;
      l.blocks.push({ x: 82, row: 'low' });
      l.challenges.push({ kind: 'door', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('ocupan lo de unos bloques que cuentan y sitio para el triceratops detrás', () => {
    expect(validateLevel(withDoor(54))).toEqual([]);
    expect(challengeZone({ kind: 'door', x: 54 })).toEqual({ from: challengeZone({ kind: 'count', x: 54 }).from, to: challengeZone({ kind: 'count', x: 54 }).to + 2.5 });
  });

  it('con un foso en el sitio del triceratops falla', () => {
    expectError(withDoor(54, (l) => l.spikes.push({ x: 60, width: 1 })), 'challenges[0]', /spikes/);
  });
});

describe('paseos en braquiosaurio (isla)', () => {
  const withBrachio = (x: number, extra: (l: LevelData) => void = () => undefined): LevelData =>
    withChanges((l) => {
      l.length = 100;
      l.blocks.push({ x: 82, row: 'low' });
      l.challenges.push({ kind: 'brachio', x, show: 'dots', reverse: false, demo: false });
      extra(l);
    });

  it('ocupan lo mismo que una barca: con su orilla y su río sobre suelo llano y libre es válido', () => {
    expect(validateLevel(withBrachio(60))).toEqual([]);
    expect(challengeZone({ kind: 'brachio', x: 60 })).toEqual(challengeZone({ kind: 'boat', x: 60 }));
  });

  it('un escalón en la orilla falla', () => {
    expectError(withBrachio(60, (l) => l.steps.push({ x: 55, width: 2, height: 1 })), 'challenges[0]', /steps\[/);
  });
});
