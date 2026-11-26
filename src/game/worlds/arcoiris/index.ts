/**
 * Mundo 1, «El camino del arcoíris» (`docs/MUNDO-1.md`): los 12 recorridos de `content/levels/arcoiris/`,
 * sus pruebas, sus enemigos, sus reglas de diseño y su mapa. TypeScript puro (sin Phaser).
 */

import { quizForLevel } from '../../../learning/quiz/catalog';
import type { EnemyRules } from '../../enemies/enemy-layout';
import type { DurationLimits } from '../../levels/duration';
import { levelsFrom } from '../load-levels';
import type { CourseRules, WorldDef, WorldMap } from '../types';

const LEVELS = levelsFrom('arcoiris', import.meta.glob('../../../../content/levels/arcoiris/nivel-*.json', { eager: true, import: 'default' }));

/** Enemigos de los niveles 1 a 12; la abeja sale desde el nivel 2. */
export const ENEMIES: EnemyRules = {
  perLevel: [2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10],
  beeFromLevel: 2,
};

/** Bloques «?»: 12–20 en los niveles 1 a 6 y 20–25 en los 7 a 12. */
function blockLimits(level: number): { min: number; max: number } {
  return level <= 6 ? { min: 12, max: 20 } : { min: 20, max: 25 };
}

/** Duración: los niveles 7 a 12 son más largos. */
function durationLimits(level: number): DurationLimits {
  return level <= 6 ? { minFastS: 30, minCalmS: 60, maxCalmS: 120 } : { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}

export const COURSE: CourseRules = {
  blockLimits,
  // Los niveles 1 a 6 no tienen pinchos.
  spikesPerLevel: [0, 0, 0, 0, 0, 0, 2, 3, 3, 4, 5, 6],
  narrowSpikesUntil: 8,
  durationLimits,
};

/**
 * Mapa de dos pantallas: los 6 primeros niveles llenan la primera y los otros 6 siguen el camino.
 * Árboles en la primera mitad y algunos de los ambientes nuevos en la segunda.
 */
const MAP: WorldMap = {
  sky: 'sky-map',
  screens: 2,
  nodes: [
    [150, 530],
    [330, 440],
    [520, 530],
    [710, 390],
    [880, 490],
    [1040, 310],
    [1220, 470],
    // Como mucho a la altura de los más bajos de la primera pantalla: más abajo, el selector de mundos
    // taparía sus estrellas.
    [1400, 530],
    [1580, 420],
    [1760, 520],
    [1940, 370],
    [2150, 480],
  ],
  decor: [
    { at: [115, 450], key: 'tree', size: 0 },
    { at: [605, 370], key: 'tree', size: 0 },
    { at: [975, 680], key: 'tree', size: 0 },
    { at: [1310, 360], key: 'decor-palm', size: 150 },
    { at: [1480, 720], key: 'tree', size: 0 },
    { at: [1690, 330], key: 'decor-pine-snow', size: 120 },
    { at: [1860, 690], key: 'decor-cactus', size: 105 },
    { at: [2290, 700], key: 'tree', size: 0 },
  ],
  clouds: [
    { x: 0.39, y: 170, scale: 1 },
    { x: 1.45, y: 150, scale: 0.9 },
  ],
};

export const ARCOIRIS: WorldDef = {
  id: 'arcoiris',
  levels: LEVELS,
  levelCount: LEVELS.length,
  quizFor: quizForLevel,
  enemies: ENEMIES,
  course: COURSE,
  horizonRainbow: true,
  map: MAP,
  selector: { color: 0xffe9e6, shadow: 0xf2c4bd, label: '123' },
  stars: 'blocks',
};
