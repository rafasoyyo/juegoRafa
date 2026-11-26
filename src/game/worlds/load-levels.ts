/**
 * Carga de los recorridos de un mundo desde los módulos de `import.meta.glob` de su carpeta
 * (`content/levels/<mundo>/nivel-N.json`). Vite los mete en el bundle, así que funcionan sin conexión
 * dentro de la PWA. TypeScript puro (sin Phaser).
 */

import { parseLevel } from '../levels/parse';
import type { LevelData } from '../levels/types';

const FILE = /nivel-(\d+)\.json$/;

/**
 * Niveles en orden a partir de `{ ruta: json }`. Los archivos tienen que ser `nivel-1.json` a
 * `nivel-N.json`, sin huecos; si no, lanza un error con lo que falta.
 */
export function levelsFrom(world: string, modules: Readonly<Record<string, unknown>>): LevelData[] {
  const byNumber = new Map<number, unknown>();
  for (const [path, json] of Object.entries(modules)) {
    const match = FILE.exec(path);
    if (!match) throw new Error(`${world}: archivo de nivel con nombre inesperado: ${path}`);
    byNumber.set(Number(match[1]), json);
  }
  const levels: LevelData[] = [];
  for (let n = 1; n <= byNumber.size; n++) {
    if (!byNumber.has(n)) throw new Error(`${world}: falta nivel-${n}.json`);
    levels.push(parseLevel(`nivel-${n}`, byNumber.get(n)));
  }
  return levels;
}
