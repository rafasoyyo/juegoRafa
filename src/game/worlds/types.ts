/**
 * Definición de un mundo: todo lo que el motor necesita saber de él. Cada mundo vive en su carpeta
 * (`src/game/worlds/<id>/` y `content/levels/<id>/`) y se da de alta en `registry.ts`; el motor
 * (escenas, física, enemigos, pruebas, castillo y selector) es común y no conoce ningún mundo concreto.
 * TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../learning/quiz';
import type { EnemyRules } from '../enemies/enemy-layout';
import type { DurationLimits } from '../levels/duration';
import type { LevelData } from '../levels/types';
import type { WorldId, WorldShape } from '../state';

export type { WorldId };

/** Reglas de diseño de los recorridos del mundo, que se comprueban en las pruebas de su contenido. */
export interface CourseRules {
  /** Bloques «?» que puede tener el nivel `level`. */
  blockLimits(level: number): { min: number; max: number };
  /** Zonas de pinchos de cada nivel (`spikesPerLevel[0]` es el nivel 1). */
  spikesPerLevel: readonly number[];
  /** Hasta este nivel las zonas de pinchos miden solo 1 baldosa. */
  narrowSpikesUntil: number;
  /** Duración que debe tener el nivel `level`. */
  durationLimits(level: number): DurationLimits;
}

/** Adorno del fondo del mapa: posición en el artboard, textura y tamaño (0 = el de la textura). */
export interface MapDecor {
  at: readonly [number, number];
  key: string;
  size: number;
}

/** Aspecto del mapa del mundo, en el artboard de diseño de `MapScene` (pantallas de 1180×820). */
export interface WorldMap {
  /** Textura del cielo (la crea `BootScene`). */
  sky: string;
  /** Pantallas de ancho que mide el camino. */
  screens: number;
  /** Posición de cada nivel (`nodes[0]` es el nivel 1). */
  nodes: readonly (readonly [number, number])[];
  decor: readonly MapDecor[];
  /** Nubes del fondo: `x` en pantallas, `y` en px lógicos y escala. */
  clouds: readonly { x: number; y: number; scale: number }[];
}

/** Botón del mundo en el selector del mapa. */
export interface SelectorButton {
  color: number;
  shadow: number;
  label?: string;
  icon?: string;
  iconSize?: number;
}

export interface WorldDef extends WorldShape {
  /** Recorridos en orden (`levels[0]` es el nivel 1). */
  levels: readonly LevelData[];
  /** Tipo de prueba de la bandera de cada nivel (siempre el mismo). */
  quizFor(level: number): QuizKind;
  enemies: EnemyRules;
  course: CourseRules;
  /** Arcoíris del horizonte que crece de nivel en nivel (`horizon-rainbow.ts`). */
  horizonRainbow: boolean;
  map: WorldMap;
  selector: SelectorButton;
}
