/**
 * Los 12 recorridos del mundo, leídos de `content/levels/` (Vite los mete en el bundle, así que
 * funcionan sin conexión dentro de la PWA). TypeScript puro (sin Phaser).
 */

import nivel1 from '../../../content/levels/nivel-1.json';
import nivel2 from '../../../content/levels/nivel-2.json';
import nivel3 from '../../../content/levels/nivel-3.json';
import nivel4 from '../../../content/levels/nivel-4.json';
import nivel5 from '../../../content/levels/nivel-5.json';
import nivel6 from '../../../content/levels/nivel-6.json';
import nivel7 from '../../../content/levels/nivel-7.json';
import nivel8 from '../../../content/levels/nivel-8.json';
import nivel9 from '../../../content/levels/nivel-9.json';
import nivel10 from '../../../content/levels/nivel-10.json';
import nivel11 from '../../../content/levels/nivel-11.json';
import nivel12 from '../../../content/levels/nivel-12.json';
import { parseLevel } from './parse';
import type { LevelData } from './types';

/** Niveles 1 a 12 en orden (`LEVELS[0]` es el nivel 1). */
export const LEVELS: readonly LevelData[] = [nivel1, nivel2, nivel3, nivel4, nivel5, nivel6, nivel7, nivel8, nivel9, nivel10, nivel11, nivel12].map((json, i) =>
  parseLevel(`nivel-${i + 1}`, json),
);

/** Datos del nivel `level` (1..12); fuera de rango da el más cercano. */
export function levelData(level: number): LevelData {
  const i = Math.min(Math.max(Math.round(level), 1), LEVELS.length) - 1;
  return LEVELS[i]!;
}
