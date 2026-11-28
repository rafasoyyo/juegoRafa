/**
 * Mundo 2, «El río de los números» (`docs/MUNDO-2.md`): 12 tramos del río, del manantial a la
 * desembocadura, con los retos del recorrido (contar, puente y barca), una prueba de la bandera por nivel
 * y el castillo con la medalla. TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../../learning/quiz';
import type { CastleDef } from '../../castle/castle';
import type { EnemyRules } from '../../enemies/enemy-layout';
import type { DurationLimits } from '../../levels/duration';
import { levelsFrom } from '../load-levels';
import type { CourseRules, WorldDef, WorldMap } from '../types';

const LEVELS = levelsFrom('rio', import.meta.glob('../../../../content/levels/rio/nivel-*.json', { eager: true, import: 'default' }));

/** El erizo y la abeja del mundo 1, la rana desde el nivel 3 y el cangrejo desde el 7 (`docs/MUNDO-2.md`). */
export const ENEMIES: EnemyRules = {
  perLevel: [2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10],
  kinds: [
    { kind: 'bee', fromLevel: 2 },
    { kind: 'hedgehog', fromLevel: 1 },
    { kind: 'frog', fromLevel: 3 },
    { kind: 'crab', fromLevel: 7 },
  ],
};

/** Niveles de 90 a 150 s con calma (`docs/MUNDO-2.md`, «Decisiones»). */
function durationLimits(): DurationLimits {
  return { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}

export const COURSE: CourseRules = {
  blockLimits: () => ({ min: 12, max: 25 }),
  // Fosos de pinchos desde el nivel 4.
  spikesPerLevel: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 5, 5],
  narrowSpikesUntil: 6,
  durationLimits,
};

/**
 * Prueba de la bandera de cada nivel del río (`docs/MUNDO-2.md`, «Los 12 tramos del río»); el 12, un repaso.
 */
export const QUIZ_BY_LEVEL: Readonly<Record<number, QuizKind>> = {
  1: 'fingers',
  2: 'ten-frame',
  3: 'memory',
  4: 'neighbor',
  5: 'number-line',
  6: 'biggest',
  7: 'ten-friends',
  8: 'train',
  9: 'socks',
  10: 'frog-jumps',
  11: 'boats',
  12: 'river-review',
};

/**
 * Castillo junto a la desembocadura: uno de cada reto del recorrido y dos preguntas de las pruebas del
 * río (las del repaso, sin cartas que memorizar), distintas entre sí.
 */
const CASTLE_QUIZZES: readonly QuizKind[] = ['fingers', 'ten-frame', 'neighbor', 'number-line', 'biggest', 'ten-friends', 'train', 'frog-jumps'];

export const CASTLE: CastleDef = {
  ambient: 'desembocadura',
  steps: [{ challenge: 'count' }, { challenge: 'bridge' }, { challenge: 'boat' }, { quiz: CASTLE_QUIZZES }, { quiz: CASTLE_QUIZZES }],
};

function quizFor(level: number): QuizKind {
  return QUIZ_BY_LEVEL[level] ?? 'count';
}

/**
 * Mapa del río: baja de izquierda a derecha en dos pantallas, del manantial de la montaña a la
 * desembocadura, con el camino por la orilla y el castillo al final.
 */
const MAP: WorldMap = {
  sky: 'sky-map',
  screens: 2,
  nodes: [
    [150, 530],
    [330, 430],
    [510, 520],
    [690, 400],
    [870, 500],
    [1050, 330],
    [1230, 460],
    // Como en el mundo 1, como mucho a la altura de los más bajos: más abajo, el selector taparía las estrellas.
    [1400, 530],
    [1580, 410],
    [1760, 510],
    [1930, 380],
    [2100, 480],
    // El castillo, junto a la desembocadura.
    [2250, 370],
  ],
  river: { from: [40, 330], to: [2360, 560], offset: 70 },
  decor: [
    { at: [70, 360], key: 'decor-peak', size: 170 },
    { at: [250, 330], key: 'decor-pine-snow', size: 110 },
    { at: [610, 690], key: 'tree', size: 0 },
    { at: [960, 300], key: 'tree', size: 0 },
    { at: [1310, 360], key: 'decor-tree-autumn', size: 110 },
    { at: [1490, 700], key: 'decor-flowers', size: 110 },
    { at: [1850, 330], key: 'tree', size: 0 },
    { at: [2020, 700], key: 'decor-palm', size: 150 },
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
  // Abierto con 6 años o más; con menos, al llegar al nivel 12 del mundo 1 (hecho o pendiente).
  castle: CASTLE,
  gate: { openAge: 6, after: { world: 'arcoiris', level: 12 } },
};
