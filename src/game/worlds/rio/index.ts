/**
 * Mundo 2, «El río de los números» (`docs/MUNDO-2.md`). BORRADOR: niveles 1 a 3 con ambientes y prueba
 * provisionales del mundo 1; el 1 con tres retos A, el 2 con retos A y B (puente) y el 3 con retos C (barca),
 * para probarlos en desarrollo. Las pruebas (paso 7), los enemigos (paso 6) y los 12 recorridos con su mapa
 * (paso 9) llegan con sus cambios. Está detrás del interruptor `mundo-2-rio`. TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../../learning/quiz';
import type { EnemyRules } from '../../enemies/enemy-layout';
import type { DurationLimits } from '../../levels/duration';
import { levelsFrom } from '../load-levels';
import type { CourseRules, WorldDef, WorldMap } from '../types';

const LEVELS = levelsFrom('rio', import.meta.glob('../../../../content/levels/rio/nivel-*.json', { eager: true, import: 'default' }));

/** Provisional: el erizo y la abeja del mundo 1 hasta que lleguen la rana y el cangrejo (paso 6). */
export const ENEMIES: EnemyRules = {
  perLevel: [2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10].slice(0, LEVELS.length),
  beeFromLevel: 2,
};

/** Niveles de 90 a 150 s con calma (`docs/MUNDO-2.md`, «Decisiones»). */
function durationLimits(): DurationLimits {
  return { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}

export const COURSE: CourseRules = {
  blockLimits: () => ({ min: 12, max: 25 }),
  // Fosos de pinchos desde el nivel 4.
  spikesPerLevel: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 5, 5].slice(0, LEVELS.length),
  narrowSpikesUntil: 6,
  durationLimits,
};

/** Provisional: las pruebas del río llegan en el paso 7. */
function quizFor(): QuizKind {
  return 'count';
}

/**
 * Mapa provisional: el río baja de izquierda a derecha en dos pantallas, con 12 tramos y el castillo
 * junto a la desembocadura. Solo se dibujan los nodos de los niveles que existen.
 */
const MAP: WorldMap = {
  sky: 'sky-map',
  // Mientras el borrador tenga pocos niveles, el camino cabe en una pantalla.
  screens: LEVELS.length <= 6 ? 1 : 2,
  nodes: [
    [150, 530],
    [330, 430],
    [510, 520],
    [690, 400],
    [870, 500],
    [1050, 330],
    [1230, 460],
    [1400, 530],
    [1580, 410],
    [1760, 510],
    [1930, 380],
    [2100, 480],
    [2250, 380],
  ],
  decor: [
    { at: [260, 330], key: 'decor-pine-snow', size: 120 },
    { at: [610, 690], key: 'tree', size: 0 },
    { at: [1310, 360], key: 'tree', size: 0 },
    { at: [1860, 690], key: 'decor-palm', size: 150 },
  ],
  clouds: [
    { x: 0.3, y: 160, scale: 1 },
    { x: 1.5, y: 140, scale: 0.9 },
  ],
};

export const RIO: WorldDef = {
  id: 'rio',
  levels: LEVELS,
  levelCount: LEVELS.length,
  quizFor,
  enemies: ENEMIES,
  course: COURSE,
  horizonRainbow: false,
  map: MAP,
  selector: { color: 0xe3f2fd, shadow: 0xb9d9ef, icon: 'icon-ten-frame', iconSize: 104 },
  // Abierto con 6 años o más; con menos, al llegar al nivel 12 del mundo 1.
  gate: { flag: 'mundo-2-rio', openAge: 6, after: { world: 'arcoiris', level: 12 } },
  // Las estrellas cuentan los retos del recorrido acertados a la primera.
  stars: 'challenges',
};
