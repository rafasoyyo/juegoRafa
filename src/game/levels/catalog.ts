/**
 * Los 6 recorridos del mundo, leídos de `content/levels/` (Vite los mete en el bundle, así que
 * funcionan sin conexión dentro de la PWA). TypeScript puro (sin Phaser).
 */

import nivel1 from '../../../content/levels/nivel-1.json';
import nivel2 from '../../../content/levels/nivel-2.json';
import nivel3 from '../../../content/levels/nivel-3.json';
import nivel4 from '../../../content/levels/nivel-4.json';
import nivel5 from '../../../content/levels/nivel-5.json';
import nivel6 from '../../../content/levels/nivel-6.json';
import { parseLevel } from './parse';
import type { LevelData } from './types';

/** Niveles 1 a 6 en orden (`LEVELS[0]` es el nivel 1). */
export const LEVELS: readonly LevelData[] = [nivel1, nivel2, nivel3, nivel4, nivel5, nivel6].map((json, i) => parseLevel(`nivel-${i + 1}`, json));

/** Datos del nivel `level` (1..6); fuera de rango da el más cercano. */
export function levelData(level: number): LevelData {
  const i = Math.min(Math.max(Math.round(level), 1), LEVELS.length) - 1;
  return LEVELS[i]!;
}
