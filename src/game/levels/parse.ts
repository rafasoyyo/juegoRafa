/**
 * Lectura de un nivel en JSON y conversión a píxeles del mundo.
 * TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 */

import {
  AMBIENT_IDS,
  BLOCK_ROWS,
  FLAG_TILES_FROM_END,
  ROW_BASE,
  START_TILE,
  STEP_RISE,
  SURFACE_KINDS,
  TILE,
  yAbove,
  type AmbientId,
  type BlockData,
  type BlockRow,
  type LevelData,
  type PlatformData,
  type StepData,
  type SurfaceKind,
  type WorldLevel,
  type WorldPlatform,
  type WorldStep,
} from './types';

/** Error de forma de un archivo de nivel; el mensaje nombra el nivel y el elemento. */
export class LevelFormatError extends Error {
  constructor(levelId: string, where: string, problem: string) {
    super(`${levelId}: ${where} ${problem}`);
    this.name = 'LevelFormatError';
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Comprueba la forma del JSON de un nivel y lo devuelve tipado. Lanza `LevelFormatError` con el
 * nivel y el elemento si falta un campo o tiene un tipo o valor que no se entiende.
 */
export function parseLevel(id: string, json: unknown): LevelData {
  const fail = (where: string, problem: string): never => {
    throw new LevelFormatError(id, where, problem);
  };
  if (!isObject(json)) return fail('el archivo', 'no es un objeto JSON');

  const num = (obj: Record<string, unknown>, key: string, where: string, positive = true): number => {
    const v = obj[key];
    if (v === undefined) return fail(where, `no tiene «${key}»`);
    if (typeof v !== 'number' || !Number.isFinite(v)) return fail(`${where}.${key}`, 'no es un número');
    if (positive && v <= 0) return fail(`${where}.${key}`, 'debe ser mayor que 0');
    return v;
  };
  const list = (key: string): Record<string, unknown>[] => {
    const v = json[key];
    if (v === undefined) return fail('el nivel', `no tiene «${key}»`);
    if (!Array.isArray(v)) return fail(key, 'no es una lista');
    return v.map((item, i) => (isObject(item) ? item : fail(`${key}[${i}]`, 'no es un objeto')));
  };

  const ambient = json.ambient;
  if (ambient === undefined) fail('el nivel', 'no tiene «ambient»');
  if (typeof ambient !== 'string' || !(AMBIENT_IDS as readonly string[]).includes(ambient)) {
    fail('ambient', `debe ser uno de ${AMBIENT_IDS.join(', ')}`);
  }
  const length = num(json, 'length', 'el nivel');

  const steps: StepData[] = list('steps').map((s, i) => {
    const where = `steps[${i}]`;
    return { x: num(s, 'x', where, false), width: num(s, 'width', where), height: num(s, 'height', where) };
  });
  const platforms: PlatformData[] = list('platforms').map((p, i) => {
    const where = `platforms[${i}]`;
    return { x: num(p, 'x', where, false), width: num(p, 'width', where), height: num(p, 'height', where) };
  });
  const blocks: BlockData[] = list('blocks').map((b, i) => {
    const where = `blocks[${i}]`;
    const x = num(b, 'x', where, false);
    if (b.row === undefined) fail(where, 'no tiene «row»');
    if (typeof b.row !== 'string' || !(BLOCK_ROWS as string[]).includes(b.row)) fail(`${where}.row`, `debe ser ${BLOCK_ROWS.join(' o ')}`);
    const block: BlockData = { x, row: b.row as BlockRow };
    if (b.on !== undefined) {
      if (typeof b.on !== 'string' || !(SURFACE_KINDS as readonly string[]).includes(b.on)) {
        fail(`${where}.on`, `debe ser ${SURFACE_KINDS.join(', ')}`);
      }
      block.on = b.on as SurfaceKind;
    }
    return block;
  });

  return { id, ambient: ambient as AmbientId, length, steps, platforms, blocks };
}

/** Superficie sobre la que se puede estar: tramo horizontal en baldosas y altura en px sobre el suelo. */
export interface Surface {
  kind: SurfaceKind;
  /** Índice del escalón o de la plataforma (−1 para el suelo). */
  index: number;
  from: number;
  to: number;
  height: number;
}

/** Altura en px de un escalón (sus `height` peldaños). */
export function stepHeight(step: StepData): number {
  return step.height * STEP_RISE;
}

/** Suelo, escalones y plataformas del nivel como superficies, en baldosas. */
export function surfaces(level: LevelData): Surface[] {
  const ground: Surface = { kind: 'ground', index: -1, from: -Infinity, to: Infinity, height: 0 };
  const steps = level.steps.map((s, index): Surface => ({ kind: 'step', index, from: s.x, to: s.x + s.width, height: stepHeight(s) }));
  const platforms = level.platforms.map((p, index): Surface => {
    const base = highest([ground, ...steps], p.x, p.x + p.width).height;
    return { kind: 'platform', index, from: p.x, to: p.x + p.width, height: base + p.height * TILE };
  });
  return [ground, ...steps, ...platforms];
}

/** Superficies que pisan el tramo [`from`, `to`] (en baldosas). */
export function surfacesUnder(all: readonly Surface[], from: number, to: number): Surface[] {
  return all.filter((s) => s.from < to && s.to > from);
}

/** La superficie más alta que pisa el tramo [`from`, `to`]; si `from` = `to`, la que hay en ese punto. */
export function highest(all: readonly Surface[], from: number, to: number): Surface {
  const under = from === to ? all.filter((s) => s.from <= from && s.to > from) : surfacesUnder(all, from, to);
  return under.reduce((a, b) => (b.height > a.height ? b : a));
}

/** Bandera en baldosas (la salida es `START_TILE`). */
export function flagTile(level: LevelData): number {
  return level.length - FLAG_TILES_FROM_END;
}

/**
 * Convierte el nivel a píxeles del mundo: salida, bandera, escalones, plataformas y la `y` de cada
 * bloque según la superficie que tiene bajo su centro (suelo, escalón o plataforma).
 */
export function toWorld(level: LevelData): WorldLevel {
  const all = surfaces(level);
  const steps = level.steps.map((s, index): WorldStep => {
    const height = stepHeight(s);
    return { index, x: s.x * TILE, width: s.width * TILE, height, top: yAbove(height) };
  });
  const platforms = level.platforms.map((p, index): WorldPlatform => {
    const surface = all.find((s) => s.kind === 'platform' && s.index === index)!;
    return { index, x: p.x * TILE, width: p.width * TILE, height: surface.height, top: yAbove(surface.height), base: surface.height - p.height * TILE };
  });
  const blocks = level.blocks.map((b, index) => {
    const surface = highest(all, b.x, b.x);
    return {
      index,
      x: b.x * TILE,
      bottom: yAbove(surface.height + ROW_BASE[b.row]),
      row: b.row,
      surface: surface.kind,
      surfaceHeight: surface.height,
    };
  });
  return {
    id: level.id,
    ambient: level.ambient,
    width: level.length * TILE,
    startX: START_TILE * TILE,
    flagX: flagTile(level) * TILE,
    steps,
    platforms,
    blocks,
  };
}
