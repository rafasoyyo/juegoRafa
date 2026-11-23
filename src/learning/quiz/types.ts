/**
 * Tipos de la prueba de la bandera. TypeScript puro: sin Phaser ni Firebase.
 *
 * Una pregunta es solo datos: qué se enseña arriba (`prompt`), qué se puede tocar (`options`) y cuál es
 * la respuesta (`answer`). La escena traduce cada `Visual` a dibujo; aquí no se sabe nada de píxeles.
 */

export const QUIZ_KINDS = ['count', 'compare', 'series', 'shapes', 'name-letters', 'recall'] as const;
export type QuizKind = (typeof QUIZ_KINDS)[number];

/** Franja de edad: pequeños (3-4), medianos (5-6) y mayores (7-8). */
export type AgeBand = 'small' | 'medium' | 'big';

/** Objetos del juego que pueden aparecer en las preguntas. */
export type ObjectId = 'cookie' | 'hedgehog' | 'bee' | 'star' | 'snail';

export const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon', 'rectangle'] as const;
export type ShapeId = (typeof SHAPES)[number];

/** Iconos de consigna de «¿Te acuerdas?»: de qué trata la pregunta. */
export type TopicIcon = 'landscape' | 'block' | 'path';

export type Visual =
  /** Un grupo de `count` objetos iguales; `scale` (0.6-1) es su tamaño relativo. */
  | { type: 'objects'; object: ObjectId; count: number; scale: number }
  | { type: 'object'; object: ObjectId }
  | { type: 'digit'; value: number }
  | { type: 'dots'; value: number }
  | { type: 'letter'; char: string }
  /** Forma con color (0xRRGGBB), tamaño relativo (0.6-1) y giro en grados. */
  | { type: 'shape'; shape: ShapeId; color: number; scale: number; angle: number }
  | { type: 'ambient'; id: string }
  | { type: 'topic'; icon: TopicIcon }
  /** Consigna de «¿Dónde hay más?»: cesta llena (más) o casi vacía (menos). */
  | { type: 'basket'; full: boolean };

/**
 * Cómo se dibuja la parte de arriba de la pregunta:
 * - `scatter` / `rows` / `tenframes`: objetos que hay que contar (`items` es un solo `objects`).
 * - `row`: una fila de elementos (serie o alias) con `holeIndex` o `highlightIndex`.
 * - `model`: un marco con el modelo que hay que buscar.
 * - `think`: un globo de pensamiento de Lalo con el tema de la pregunta.
 * - `basket`: la cesta de «más» o «menos».
 */
export type PromptLayout = 'scatter' | 'rows' | 'tenframes' | 'row' | 'model' | 'think' | 'basket';

export interface Prompt {
  layout: PromptLayout;
  items: Visual[];
  holeIndex?: number;
  highlightIndex?: number;
}

/** Una opción que se puede tocar. `key` identifica su contenido (dos opciones con la misma `key` valen igual). */
export interface Option {
  id: number;
  key: string;
  visual: Visual;
}

export type Answer =
  /** Elegir: vale tocar cualquiera de `correct` (ids). */
  | { form: 'choice'; correct: number[] }
  /**
   * Tocar varias: hay que tocar todas las `targets` (ids). Con `ordered`, en ese orden, aunque vale
   * cualquier opción con la misma `key` que la que toca.
   */
  | { form: 'multi'; targets: number[]; ordered: boolean };

/** La pista propia de cada prueba (la del 2.º fallo). */
export type HintKind = 'count-up' | 'pair-up' | 'rhythm' | 'misfit' | 'dim-wrong';

export interface Question {
  kind: QuizKind;
  prompt: Prompt;
  options: Option[];
  answer: Answer;
  hint: HintKind;
}

/** Lo que pasó en el nivel, para «¿Te acuerdas?». */
export interface LevelRecap {
  level: number;
  ambient: string;
  hedgehogs: number;
  bees: number;
  cookies: number;
  blocksHit: number;
  blocksTotal: number;
}

/** Datos del niño y del nivel que necesitan algunos generadores. */
export interface QuizContext {
  /** Alias en mayúsculas (A-Z y Ñ). */
  alias: string;
  recap: LevelRecap;
  /** Todos los ambientes posibles, para las miniaturas de paisaje. */
  ambients: readonly string[];
}

/** Clave de un `Visual`: dos visuales con la misma clave se ven igual. */
export function visualKey(v: Visual): string {
  switch (v.type) {
    case 'objects':
      return `objects:${v.object}:${v.count}`;
    case 'object':
      return `object:${v.object}`;
    case 'digit':
      return `digit:${v.value}`;
    case 'dots':
      return `dots:${v.value}`;
    case 'letter':
      return `letter:${v.char}`;
    case 'shape':
      return `shape:${v.shape}`;
    case 'ambient':
      return `ambient:${v.id}`;
    case 'topic':
      return `topic:${v.icon}`;
    case 'basket':
      return `basket:${v.full ? 'full' : 'empty'}`;
  }
}

/** Clave de una pregunta entera, para no repetir dos iguales en la misma prueba. */
export function questionKey(q: Question): string {
  const prompt = q.prompt.items.map(visualKey).join(',');
  const opts = q.options.map((o) => o.key).sort().join(',');
  return `${q.kind}|${q.prompt.layout}|${prompt}|${q.prompt.holeIndex ?? ''}|${q.prompt.highlightIndex ?? ''}|${opts}`;
}

/** Monta las opciones (con ids 0..n-1) a partir de sus visuales. */
export function toOptions(visuals: Visual[]): Option[] {
  return visuals.map((visual, id) => ({ id, key: visualKey(visual), visual }));
}
