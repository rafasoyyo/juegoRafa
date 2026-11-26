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
  // Erizo desde el nivel 1 y abeja desde el 2, mitad y mitad. (El orden, abeja primero, conserva los
  // repartos con semilla de antes de que hubiera más tipos.)
  kinds: [
    { kind: 'bee', fromLevel: 2 },
    { kind: 'hedgehog', fromLevel: 1 },
  ],
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
 * Mapa de dos pantallas (`docs/MUNDO-1.md`, «3. El mapa del arcoíris»): el camino sale de la madriguera,
 * a la izquierda, y sube por el día hasta la noche en lo alto de la colina (nivel 6); baja a la playa al
 * amanecer (7) y sigue por la selva, la montaña, la nieve y el desierto hasta las nubes (12). Encima de
 * los últimos niveles, el arcoíris de 12 gajos que se pinta nivel a nivel.
 */
const MAP: WorldMap = {
  sky: 'sky-map',
  skyline: [
    { x: 0, ambient: 'prado' },
    { x: 560, ambient: 'prado' },
    { x: 700, ambient: 'otono' },
    { x: 880, ambient: 'atardecer' },
    { x: 1010, ambient: 'noche' },
    { x: 1100, ambient: 'noche' },
    { x: 1220, ambient: 'playa' },
    { x: 1410, ambient: 'selva' },
    { x: 1590, ambient: 'montana' },
    { x: 1760, ambient: 'nieve' },
    { x: 1940, ambient: 'desierto' },
    { x: 2130, ambient: 'nubes' },
  ],
  screens: 2,
  nodes: [
    [190, 545],
    [350, 470],
    [520, 520],
    [700, 420],
    [870, 455],
    [1040, 340],
    [1230, 535],
    // Del 8 al 12, por debajo del arcoíris y como mucho a la altura de los más bajos de la primera
    // pantalla: más abajo, el selector de mundos taparía sus estrellas.
    [1410, 515],
    [1590, 490],
    [1770, 525],
    [1950, 490],
    [2190, 475],
  ],
  rainbow: { center: [1940, 395], radius: 300, band: 13 },
  decor: [
    { at: [95, 640], key: 'decor-burrow', size: 190, prologue: true },
    { at: [265, 420], key: 'tree', size: 0 },
    { at: [610, 420], key: 'tree', size: 0 },
    { at: [790, 330], key: 'decor-tree-autumn', size: 110 },
    { at: [905, 390], key: 'decor-sun', size: 150 },
    { at: [1115, 210], key: 'decor-moon', size: 110 },
    { at: [960, 170], key: 'decor-star', size: 26 },
    { at: [1010, 250], key: 'decor-star', size: 18 },
    { at: [1150, 290], key: 'decor-star', size: 22 },
    { at: [1080, 120], key: 'decor-star', size: 18 },
    { at: [1320, 470], key: 'decor-palm', size: 140 },
    { at: [1500, 690], key: 'decor-leaf', size: 110 },
    { at: [1680, 450], key: 'decor-pine-snow', size: 110 },
    { at: [1860, 690], key: 'decor-cactus', size: 100 },
  ],
  clouds: [
    { x: 0.39, y: 150, scale: 1 },
    { x: 1.3, y: 120, scale: 0.8 },
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
  prologue: true,
  map: MAP,
  selector: { color: 0xffe9e6, shadow: 0xf2c4bd, label: '123' },
};
