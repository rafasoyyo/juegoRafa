/**
 * Mundo 3, «La isla de los dinosaurios» (`docs/MUNDO-3.md`): 12 tramos de la playa negra al borde del
 * cráter, con los retos del recorrido (A «El camino de huellas», B «La puerta de la cueva», C «Paseo en
 * braquiosaurio» y D «Las piedras del géiser»), una prueba de la bandera por nivel, el huevo de 12 manchas
 * en el mapa y el nido del cráter como castillo. TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../../learning/quiz';
import type { EnemyRules } from '../../enemies/enemy-layout';
import type { DurationLimits } from '../../levels/duration';
import type { CastleDef } from '../../castle/castle';
import { levelsFrom } from '../load-levels';
import type { CourseRules, WorldDef, WorldMap } from '../types';

const LEVELS = levelsFrom('isla', import.meta.glob('../../../../content/levels/isla/nivel-*.json', { eager: true, import: 'default' }));

/** El erizo y la abeja, y los de la isla: pterosaurios desde el nivel 3, volcancito desde el 5 y tiranosaurio desde el 7. */
export const ENEMIES: EnemyRules = {
  perLevel: [2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10],
  kinds: [
    { kind: 'bee', fromLevel: 2 },
    { kind: 'hedgehog', fromLevel: 1 },
    { kind: 'ptero', fromLevel: 3 },
    { kind: 'volcano', fromLevel: 5 },
    { kind: 'trex', fromLevel: 7 },
  ],
};

/** Niveles de 90 a 150 s con calma (`docs/MUNDO-3.md`, «Decisiones»). */
function durationLimits(): DurationLimits {
  return { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}

export const COURSE: CourseRules = {
  blockLimits: () => ({ min: 12, max: 25 }),
  // Charcos de lava (fosos) desde el nivel 4.
  spikesPerLevel: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 5, 5],
  narrowSpikesUntil: 6,
  durationLimits,
};

/** Prueba de la bandera de cada nivel (`docs/MUNDO-3.md`, tabla de niveles). */
const QUIZ_BY_LEVEL: Record<number, QuizKind> = {
  1: 'dino-shadows',
  2: 'shape-things',
  3: 'stego-plates',
  4: 'turned-shapes',
  5: 'nest',
  6: 'odd-egg',
  7: 'fossil',
  8: 'skin-mosaic',
  9: 'growing-neck',
  10: 'roll-or-not',
  11: 'hidden-triangles',
  12: 'island-review',
};

/**
 * El nido del cráter (`docs/MUNDO-3.md`, «El castillo»): uno de cada reto que se resuelve golpeando
 * bloques (A, B y C) y dos preguntas de las pruebas de la bandera de la isla (sin el repaso), distintas
 * entre sí. Da la medalla de la huella.
 */
const CASTLE_QUIZZES: readonly QuizKind[] = [
  'dino-shadows', 'shape-things', 'stego-plates', 'turned-shapes', 'nest', 'odd-egg', 'fossil', 'skin-mosaic', 'growing-neck', 'roll-or-not', 'hidden-triangles',
];

export const CASTLE: CastleDef = {
  ambient: 'borde-crater',
  steps: [{ challenge: 'footprints' }, { challenge: 'door' }, { challenge: 'brachio' }, { quiz: CASTLE_QUIZZES }, { quiz: CASTLE_QUIZZES }],
  medal: 'medal-footprint',
  icon: 'nest',
};

function quizFor(level: number): QuizKind {
  return QUIZ_BY_LEVEL[level] ?? 'dino-shadows';
}

/**
 * Mapa del volcán (`docs/MUNDO-3.md`, «El mapa»): dos pantallas en las que el camino sube de la playa negra,
 * a la izquierda, por la selva, las charcas, las ruinas y el pantano hasta las columnas, los fósiles, la cueva
 * de cristales y los ríos de lava, al pie del gran volcán; el nido del cráter (el castillo) está en su cima.
 * Encima de los niveles del medio, el huevo de 12 manchas.
 */
const MAP: WorldMap = {
  sky: 'sky-map',
  skyline: [
    { x: 0, ambient: 'playa-negra' },
    { x: 260, ambient: 'playa-negra' },
    { x: 400, ambient: 'helechos' },
    { x: 560, ambient: 'geiseres' },
    { x: 730, ambient: 'huellas' },
    { x: 900, ambient: 'cascada-templada' },
    { x: 1060, ambient: 'pantano' },
    { x: 1150, ambient: 'pantano' },
    { x: 1260, ambient: 'cuellos-largos' },
    { x: 1440, ambient: 'columnas' },
    { x: 1600, ambient: 'yacimiento' },
    { x: 1960, ambient: 'rios-lava' },
    { x: 2200, ambient: 'borde-crater' },
  ],
  screens: 2,
  nodes: [
    [180, 540],
    [350, 470],
    [520, 530],
    [700, 430],
    [870, 510],
    [1050, 400],
    [1230, 520],
    // Del 8 al 12, por debajo del huevo y como mucho a la altura de los más bajos: más abajo, el selector
    // de mundos taparía sus estrellas.
    [1400, 520],
    [1570, 480],
    [1740, 530],
    [1910, 470],
    [2060, 420],
    // El nido, en el cráter del gran volcán.
    [2240, 330],
  ],
  // El huevo, arriba, sobre los niveles del medio del camino.
  egg: { center: [1480, 220], size: 240 },
  decor: [
    // El gran volcán, al final del camino, con el nido en el cráter.
    { at: [2240, 830], key: 'decor-volcano', size: 1000 },
    { at: [70, 690], key: 'decor-palm', size: 160 },
    { at: [260, 400], key: 'decor-palm', size: 120 },
    { at: [440, 690], key: 'decor-fern', size: 120 },
    { at: [610, 420], key: 'decor-geyser', size: 120 },
    { at: [790, 360], key: 'decor-column', size: 120 },
    { at: [960, 690], key: 'decor-leaf', size: 110 },
    { at: [1130, 300], key: 'decor-moon', size: 90 },
    { at: [1320, 410], key: 'decor-fern', size: 110 },
    { at: [1480, 690], key: 'decor-basalt', size: 130 },
    { at: [1660, 400], key: 'decor-column', size: 110 },
    { at: [1820, 690], key: 'decor-crystal', size: 120 },
  ],
  clouds: [
    { x: 0.35, y: 150, scale: 1 },
    { x: 1.05, y: 120, scale: 0.8 },
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
  // Al pintar la última mancha: el huevo se abre en el nido del cráter.
  finale: 'hatch',
  map: MAP,
  selector: { color: 0xe4f4e8, shadow: 0xbfe0c6, icon: 'icon-shapes', iconSize: 88 },
  castle: CASTLE,
  // Abierta con 7 años o más; con menos, al llegar al nivel 12 del río.
  gate: { openAge: 7, after: { world: 'rio', level: 12 } },
};
