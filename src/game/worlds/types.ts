/**
 * Definición de un mundo: todo lo que el motor necesita saber de él. Cada mundo vive en su carpeta
 * (`src/game/worlds/<id>/` y `content/levels/<id>/`) y se da de alta en `registry.ts`; el motor
 * (escenas, física, enemigos, pruebas, castillo y selector) es común y no conoce ningún mundo concreto.
 * TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../learning/quiz';
import type { CastleDef } from '../castle/castle';
import type { FlagId } from '../flags';
import type { EnemyRules } from '../enemies/enemy-layout';
import type { DurationLimits } from '../levels/duration';
import type { LevelData } from '../levels/types';
import type { SkyStop } from '../map/map-sky';
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
  /** Al tocarlo se abre el nivel 1 con el prólogo del mundo (la madriguera del mundo 1). */
  prologue?: boolean;
}

/** Aspecto del mapa del mundo, en el artboard de diseño de `MapScene` (pantallas de 1180×820). */
export interface WorldMap {
  /** Textura del cielo (la crea `BootScene`); si hay `skyline`, solo se usa de reserva. */
  sky: string;
  /**
   * Paisaje que cambia a lo ancho del camino: paradas en x del artboard (de 0 a 1180 × `screens`), cada
   * una con el cielo y la tierra de un ambiente (`map/map-sky.ts`). Sin él, el cielo `sky` fijo.
   */
  skyline?: readonly SkyStop[];
  /**
   * Arcoíris de gajos, uno por nivel, que se pintan al hacer los niveles (`map/rainbow-arc.ts`): centro de
   * su base en el artboard, radio exterior y grosor de cada una de sus 6 bandas (estos dos, en px del
   * artboard escalados con el alto, para que sea un semicírculo en cualquier pantalla).
   */
  rainbow?: { center: readonly [number, number]; radius: number; band: number };
  /**
   * Huevo de 12 manchas, una por nivel, que se pintan al hacer los niveles (`map/egg-spots.ts`): centro en
   * el artboard y alto en px del artboard escalados con el alto.
   */
  egg?: { center: readonly [number, number]; size: number };
  /** Pantallas de ancho que mide el camino. */
  screens: number;
  /** Posición de cada nivel (`nodes[0]` es el nivel 1) y, tras el último, la del castillo si lo hay. */
  nodes: readonly (readonly [number, number])[];
  /**
   * Río que acompaña al camino por debajo, desde `from` hasta `to` pasando junto a cada parada, `offset`
   * px más abajo que ella. Sin él, el camino va solo.
   */
  river?: { from: readonly [number, number]; to: readonly [number, number]; offset: number };
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

/**
 * Cuándo se abre un mundo desde el selector. Sin puerta, siempre. Con interruptor apagado, nunca
 * (se ve como un mundo que aún no existe). Si no, con la edad `openAge` o más, o al llegar (hecho o
 * pendiente) al nivel `after.level` del mundo `after.world`.
 */
export interface WorldGate {
  flag?: FlagId;
  openAge?: number;
  after?: { world: WorldId; level: number };
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
  /**
   * Prólogo al empezar el nivel 1 la primera vez (`story/prologue.ts`): Rufo sale de la madriguera y
   * Lalo le señala el arcoíris. Sin él, el nivel 1 empieza sin más.
   */
  prologue?: boolean;
  /**
   * Final al volver al mapa con todos los niveles jugados, una vez por perfil (`story/finale.ts`): `rain`,
   * la lluvia sobre la montaña hace nacer el río (mundo 1); `hatch`, el huevo se abre en el nido del
   * cráter (mundo 3). Abre con una animación los mundos cuya puerta depende de terminar este (`gate.after`).
   */
  finale?: 'rain' | 'hatch';
  map: WorldMap;
  selector: SelectorButton;
  gate?: WorldGate;
  /** Castillo tras el último nivel: sus retos y su paisaje. Sin él, el mapa acaba en el último nivel. */
  castle?: CastleDef;
}
