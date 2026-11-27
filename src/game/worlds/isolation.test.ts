/**
 * Vigilancia de la spec `world-isolation`: el motor no nombra mundos y las escenas no comparan tipos de
 * reto, de enemigo ni de prueba uno a uno. Los identificadores y los tipos salen de los registros, así que
 * la comprobación crece sola con cada mundo o mecánica nuevos.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { QUIZ_KINDS } from '../../learning/quiz';
import { ENEMY_KINDS } from '../enemies/enemy-layout';
import { CHALLENGE_KINDS } from '../levels/types';
import { WORLDS } from './registry';

const SRC = join(__dirname, '..', '..');

/** Archivos `.ts` de `src/` sin las pruebas, con su ruta relativa a `src/` (con `/`). */
function sources(dir: string = SRC): { path: string; text: string }[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.test.ts')) return [];
    return [{ path: relative(SRC, full).split(sep).join('/'), text: readFileSync(full, 'utf8') }];
  });
}

const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Líneas de `text` que casan con `re`, con su número. */
function offending(text: string, re: RegExp): string[] {
  return text.split('\n').flatMap((line, i) => (re.test(line) ? [`${i + 1}: ${line.trim()}`] : []));
}

describe('aislamiento de los mundos', () => {
  const files = sources();

  it('lee el código', () => {
    expect(files.some((f) => f.path === 'game/scenes/LevelScene.ts')).toBe(true);
  });

  /** Fuera de las carpetas de los mundos (`game/worlds/<id>/`) y del registro: el motor. */
  const engine = files.filter((f) => !WORLDS.some((w) => f.path.startsWith(`game/worlds/${w.id}/`)) && f.path !== 'game/worlds/registry.ts');

  it.each(WORLDS.map((w) => [w.id] as const))('fuera de las carpetas de los mundos nadie nombra «%s» ni importa su carpeta', (id) => {
    // El id entre comillas (un literal) o como carpeta en una ruta de importación.
    const re = new RegExp(`['"]${escape(id)}['"]|/${escape(id)}(?:/[\\w.-]*)?['"]`);
    const found = engine.flatMap((f) => offending(f.text, re).map((line) => `${f.path}:${line}`));
    expect(found).toEqual([]);
  });

  it('las escenas no comparan tipos de reto, de enemigo ni de prueba uno a uno', () => {
    const kinds = [...new Set<string>([...CHALLENGE_KINDS, ...ENEMY_KINDS, ...QUIZ_KINDS])].map(escape).join('|');
    const re = new RegExp(`kind\\s*[!=]==?\\s*['"](?:${kinds})['"]|case\\s+['"](?:${kinds})['"]\\s*:`);
    const found = files.filter((f) => f.path.startsWith('game/scenes/')).flatMap((f) => offending(f.text, re).map((line) => `${f.path}:${line}`));
    expect(found).toEqual([]);
  });
});
