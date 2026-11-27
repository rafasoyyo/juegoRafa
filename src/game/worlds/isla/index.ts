/**
 * Mundo 3, «La isla de los dinosaurios» (`docs/MUNDO-3.md`). BORRADOR: solo el nivel 1, con el reto A
 * («El camino de huellas»), un ambiente provisional de playa negra y la prueba y los enemigos del mundo 1,
 * para poder probarlo en desarrollo. Los retos B, C y D (pasos 2 a 4), los enemigos (paso 5), las pruebas
 * (paso 6), el huevo (paso 7), el castillo (paso 8) y los 12 recorridos con su mapa (paso 9) llegan con
 * sus cambios. Está detrás del interruptor `mundo-3-isla`. TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../../learning/quiz';
import type { EnemyRules } from '../../enemies/enemy-layout';
import type { DurationLimits } from '../../levels/duration';
import { levelsFrom } from '../load-levels';
import type { CourseRules, WorldDef, WorldMap } from '../types';

const LEVELS = levelsFrom('isla', import.meta.glob('../../../../content/levels/isla/nivel-*.json', { eager: true, import: 'default' }));

/** Provisional: el erizo y la abeja hasta que lleguen los pterosaurios, el volcancito y el tiranosaurio (paso 5). */
export const ENEMIES: EnemyRules = {
  perLevel: [2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10].slice(0, LEVELS.length),
  kinds: [
    { kind: 'bee', fromLevel: 2 },
    { kind: 'hedgehog', fromLevel: 1 },
  ],
};

/** Niveles de 90 a 150 s con calma (`docs/MUNDO-3.md`, «Decisiones»). */
function durationLimits(): DurationLimits {
  return { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}

export const COURSE: CourseRules = {
  blockLimits: () => ({ min: 12, max: 25 }),
  // Charcos de lava (fosos) desde el nivel 4.
  spikesPerLevel: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 5, 5].slice(0, LEVELS.length),
  narrowSpikesUntil: 6,
  durationLimits,
};

/** Provisional: las pruebas de la isla llegan en el paso 6. */
function quizFor(): QuizKind {
  return 'series';
}

/** Mapa provisional: el camino sube de la playa al cráter. Solo se dibujan los nodos de los niveles que existen. */
const MAP: WorldMap = {
  sky: 'sky-map',
  screens: LEVELS.length <= 6 ? 1 : 2,
  nodes: [
    [150, 560],
    [330, 470],
    [510, 540],
    [690, 430],
    [870, 520],
    [1050, 380],
    [1230, 480],
    [1400, 540],
    [1580, 420],
    [1760, 500],
    [1930, 380],
    [2100, 450],
    [2250, 330],
  ],
  decor: [
    { at: [80, 690], key: 'decor-palm', size: 150 },
    { at: [610, 690], key: 'tree', size: 0 },
  ],
  clouds: [
    { x: 0.3, y: 160, scale: 1 },
    { x: 1.5, y: 140, scale: 0.9 },
  ],
};

export const ISLA: WorldDef = {
  id: 'isla',
  levels: LEVELS,
  levelCount: LEVELS.length,
  quizFor,
  enemies: ENEMIES,
  course: COURSE,
  horizonRainbow: false,
  map: MAP,
  selector: { color: 0xe4f4e8, shadow: 0xbfe0c6, icon: 'icon-shapes', iconSize: 88 },
  // Abierta con 7 años o más; con menos, al llegar al nivel 12 del río.
  gate: { flag: 'mundo-3-isla', openAge: 7, after: { world: 'rio', level: 12 } },
};
