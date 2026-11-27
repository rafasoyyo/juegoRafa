/**
 * Tipos de la prueba de la bandera. TypeScript puro: sin Phaser ni Firebase.
 *
 * Una pregunta es solo datos: qué se enseña arriba (`prompt`), qué se puede tocar (`options`) y cuál es
 * la respuesta (`answer`). La escena traduce cada `Visual` a dibujo; aquí no se sabe nada de píxeles.
 */

export const QUIZ_KINDS = [
  'count',
  'compare',
  'series',
  'shapes',
  'name-letters',
  'recall',
  'share',
  'order',
  'cable-car',
  'tracks',
  'balance',
  'mirror',
  // Mundo 2, el río de los números (`docs/MUNDO-2.md`).
  'fingers',
  'ten-frame',
  'memory',
  'neighbor',
  'number-line',
  'biggest',
  'ten-friends',
  'train',
  'socks',
  'frog-jumps',
  'boats',
  'river-review',
  // Mundo 3, la isla de los dinosaurios (`docs/MUNDO-3.md`).
  'dino-shadows',
  'shape-things',
  'stego-plates',
  'turned-shapes',
  'nest',
  'odd-egg',
] as const;
export type QuizKind = (typeof QUIZ_KINDS)[number];

/** Franja de edad: pequeños (3-4), medianos (5-6) y mayores (7-8). */
export type AgeBand = 'small' | 'medium' | 'big';

/** Objetos del juego que pueden aparecer en las preguntas. */
export type ObjectId = 'cookie' | 'hedgehog' | 'bee' | 'star' | 'snail';

export const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon', 'rectangle', 'oval', 'pentagon'] as const;
export type ShapeId = (typeof SHAPES)[number];

/** Dinosaurios de la isla (estilo A documental). */
export const DINOS = ['trex', 'brachio', 'trici', 'stego', 'ptero'] as const;
export type DinoId = (typeof DINOS)[number];

/** Cosas de todos los días con una forma clara, para «Formas en las cosas». */
export const THINGS = {
  wheel: 'circle',
  clock: 'circle',
  window: 'square',
  gift: 'square',
  pizza: 'triangle',
  sail: 'triangle',
  door: 'rectangle',
  book: 'rectangle',
  egg: 'oval',
  starfish: 'star',
  kite: 'diamond',
  honeycomb: 'hexagon',
  house: 'pentagon',
} as const satisfies Record<string, ShapeId>;
export type ThingId = keyof typeof THINGS;

/** Piezas sin simetría para «Igual aunque gire»: girarlas cambia cómo se ven y voltearlas da otra pieza. */
export const PIECES = ['ell', 'flag', 'boot', 'arrow'] as const;
export type PieceId = (typeof PIECES)[number];

/** Dónde está una cosa respecto a otra («El nido»). */
export const PLACES = ['in', 'out', 'on', 'under', 'front', 'behind', 'left', 'right'] as const;
export type PlaceRel = (typeof PLACES)[number];

/** Dibujo de la cáscara de un huevo. */
export type EggPattern = 'plain' | 'spots' | 'stripes';

/** Iconos de consigna de «¿Te acuerdas?»: de qué trata la pregunta. */
export type TopicIcon = 'landscape' | 'block' | 'path';

/** Direcciones de las flechas de «Huellas en la nieve». */
export type Dir = 'up' | 'down' | 'left' | 'right';
export interface GridCell {
  row: number;
  col: number;
}
/** Hitos del mapa de nieve. */
export type LandmarkId = 'pine' | 'snowman' | 'igloo';
/** Objetos de «La balanza»: pesados (sandía, piedra, calabaza) y ligeros (pluma, hoja, fresa). */
export type WeightId = 'melon' | 'rock' | 'pumpkin' | 'feather' | 'leaf' | 'berry';
/** Dibujos simétricos de «La otra mitad». */
export type PictureId = 'butterfly' | 'kite' | 'lalo' | 'house' | 'flower' | 'fish';

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
  | { type: 'basket'; full: boolean }
  /** Un objeto con su tamaño relativo (0-1), para ordenar por tamaño. */
  | { type: 'sized'; object: ObjectId; scale: number }
  /** Tira de flechas. */
  | { type: 'arrows'; dirs: Dir[] }
  /** Mitad izquierda de un dibujo (`mirrored` = la mitad reflejada) con su variante de detalle. */
  | { type: 'half'; picture: PictureId; mirrored: boolean; variant: number }
  /** Casilla de una cuadrícula, pintada o no. */
  | { type: 'cell'; row: number; col: number; painted: boolean }
  /** Plato con el amigo al que se le reparte. */
  | { type: 'plate'; friend: ObjectId }
  | { type: 'jar' }
  /** Platillo de la balanza. */
  | { type: 'pan'; side: 'left' | 'right' }
  | { type: 'landmark'; id: LandmarkId }
  | { type: 'weight'; id: WeightId }
  /** Calcetín del color `color` (índice de la paleta de calcetines) con su dibujo `pattern`. */
  | { type: 'sock'; color: number; pattern: number }
  /** Respuesta de pares y nones: todos con pareja o sobra uno. */
  | { type: 'pairs'; odd: boolean }
  /** Dinosaurio de la isla, a color o como sombra; `flip` lo pone mirando a la izquierda. */
  | { type: 'dino'; dino: DinoId; shadow: boolean; flip: boolean }
  | { type: 'thing'; thing: ThingId }
  /** Pieza sin simetría, girada `angle` grados y volteada si `mirrored`. */
  | { type: 'piece'; piece: PieceId; angle: number; mirrored: boolean; color: number }
  /** Escena de posición: `thing` (huevo o bebé) respecto a `holder` (nido, caja, cesto o cueva). */
  | { type: 'place'; rel: PlaceRel; thing: 'egg' | 'baby'; holder: 'nest' | 'box' | 'basket' | 'cave' }
  /** Huevo con color (índice de la paleta de huevos), dibujo y tamaño relativo. */
  | { type: 'egg'; color: number; pattern: EggPattern; scale: number }
  /** Nido con los huevos de la familia de ejemplo. */
  | { type: 'nest'; eggs: { color: number; pattern: EggPattern }[] };

/**
 * Cómo se dibuja la parte de arriba de la pregunta:
 * - `scatter` / `rows` / `tenframes`: objetos que hay que contar (`items` es un solo `objects`).
 * - `row`: una fila de elementos (serie o alias) con `holeIndex` o `highlightIndex`.
 * - `model`: un marco con el modelo que hay que buscar.
 * - `think`: un globo de pensamiento de Lalo con el tema de la pregunta.
 * - `basket`: la cesta de «más» o «menos».
 * - `picture`: un dibujo grande (`items[0]`), sin marco.
 * - `share`, `order`, `cable-car`, `tracks`, `balance`, `mirror`: escenas propias (ver `Prompt.scene`).
 */
export type PromptLayout = 'scatter' | 'rows' | 'tenframes' | 'row' | 'model' | 'think' | 'basket' | 'picture' | SceneData['kind'];

/** Datos de la escena de las pruebas nuevas: lo que no cabe en `items` y que la vista necesita para animar. */
export type SceneData =
  | { kind: 'share'; plates: ObjectId[]; cookies: number; jar: boolean }
  | { kind: 'order'; direction: 'up' | 'down' }
  | { kind: 'cable-car'; object: ObjectId; start: number; steps: { op: 'in' | 'out'; count: number }[] }
  | {
      kind: 'tracks';
      size: number;
      start: GridCell;
      /** Casilla de la fresa (solo en mayores). */
      goal?: GridCell;
      /** El camino correcto. */
      path: Dir[];
      /** Si la tira del camino se ve en la consigna (en mayores se elige entre tiras). */
      showStrip: boolean;
      /** Casilla a la que llega el camino. */
      end: GridCell;
      landmarks: { cell: GridCell; id: LandmarkId }[];
    }
  | { kind: 'balance'; mode: 'weigh'; left: WeightId; right: WeightId }
  | { kind: 'balance'; mode: 'gap'; left: number; right: number }
  | { kind: 'balance'; mode: 'equiv'; cookies: number; berries: number }
  | { kind: 'mirror'; mode: 'picture'; picture: PictureId }
  | { kind: 'mirror'; mode: 'grid'; rows: number; cols: number; painted: GridCell[] }
  /** Manos con dedos levantados (uno por mano, de 0 a 5). */
  | { kind: 'fingers'; hands: number[] }
  /** Marco de 5 o de 10 con `filled` fichas; se pregunta cuántas hay o cuántas faltan para llenarlo. */
  | { kind: 'ten-frame'; cells: 5 | 10 | 20; filled: number; ask: 'count' | 'missing'; whole?: boolean }
  /** Cartas que se ven `showMs` y se dan la vuelta; la de la consigna (`items[0]`) es su pareja. */
  | { kind: 'memory'; showMs: number }
  /** Recta de `from` a `to` de `step` en `step`, con algunos números a la vista (`labels`). */
  | { kind: 'number-line'; from: number; to: number; step: number; labels: number[]; target: number; jumps?: { start: number; size: number; count: number } }
  /** Tren de `wagons` vagones tras la locomotora; hay que tocar el que va en el puesto `target` (1 = el primero). */
  | { kind: 'train'; wagons: number; target: number; objects: ObjectId[] }
  /** Calcetines: pares y nones (`socks` colores en fila) o buscar la pareja de `model`. */
  | { kind: 'socks'; mode: 'parity'; socks: number[] }
  | { kind: 'socks'; mode: 'match'; model: number };

export interface Prompt {
  layout: PromptLayout;
  items: Visual[];
  holeIndex?: number;
  highlightIndex?: number;
  scene?: SceneData;
}

/** Una opción que se puede tocar. `key` identifica su contenido (dos opciones con la misma `key` valen igual). */
export interface Option {
  id: number;
  key: string;
  visual: Visual;
  /** Dónde se pone: en la fila de respuestas (por defecto) o dentro del dibujo (la vista la coloca). */
  place?: 'row' | 'scene';
}

export type Answer =
  /** Elegir: vale tocar cualquiera de `correct` (ids). */
  | { form: 'choice'; correct: number[] }
  /**
   * Tocar varias: hay que tocar todas las `targets` (ids). Con `ordered`, en ese orden, aunque vale
   * cualquier opción con la misma `key` que la que toca.
   */
  | { form: 'multi'; targets: number[]; ordered: boolean }
  /**
   * Repartir: cada toque en un hueco con capacidad libre suma 1. `after` son huecos (ids de opción) que
   * deben estar llenos antes. Tocar un hueco lleno o cuyo `after` no esté lleno es un fallo.
   */
  | { form: 'fill'; slots: FillSlot[] };

export interface FillSlot {
  option: number;
  capacity: number;
  after?: number[];
}

/** La pista propia de cada prueba (la del 2.º fallo). */
export type HintKind =
  | 'count-up'
  | 'pair-up'
  | 'rhythm'
  | 'misfit'
  | 'dim-wrong'
  | 'deal'
  | 'compare-two'
  | 'count-on'
  | 'ghost-walk'
  | 'heft'
  | 'swap-fruit'
  | 'fold'
  | 'peek'
  | 'hop';

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
    case 'sized':
      return `sized:${v.object}:${v.scale}`;
    case 'arrows':
      return `arrows:${v.dirs.join('')}`;
    case 'half':
      return `half:${v.picture}:${v.mirrored ? 'm' : 'n'}:${v.variant}`;
    case 'cell':
      return `cell:${v.row}:${v.col}`;
    case 'plate':
      return `plate:${v.friend}`;
    case 'jar':
      return 'jar';
    case 'pan':
      return `pan:${v.side}`;
    case 'landmark':
      return `landmark:${v.id}`;
    case 'weight':
      return `weight:${v.id}`;
    case 'sock':
      return `sock:${v.color}:${v.pattern}`;
    case 'pairs':
      return `pairs:${v.odd ? 'odd' : 'even'}`;
    case 'dino':
      return `dino:${v.dino}:${v.shadow ? 's' : 'c'}:${v.flip ? 'l' : 'r'}`;
    case 'thing':
      return `thing:${v.thing}`;
    case 'piece':
      return `piece:${v.piece}:${v.mirrored ? 'm' : 'n'}:${(((v.angle % 360) + 360) % 360)}`;
    case 'place':
      return `place:${v.rel}:${v.thing}:${v.holder}`;
    case 'egg':
      return `egg:${v.color}:${v.pattern}:${v.scale}`;
    case 'nest':
      return `nest:${v.eggs.map((e) => `${e.color}${e.pattern}`).join(',')}`;
  }
}

/** Clave de una pregunta entera, para no repetir dos iguales en la misma prueba. */
export function questionKey(q: Question): string {
  const prompt = q.prompt.items.map(visualKey).join(',');
  const opts = q.options.map((o) => o.key).sort().join(',');
  const scene = q.prompt.scene ? JSON.stringify(q.prompt.scene) : '';
  return `${q.kind}|${q.prompt.layout}|${prompt}|${q.prompt.holeIndex ?? ''}|${q.prompt.highlightIndex ?? ''}|${opts}|${scene}`;
}

/** Monta las opciones (con ids 0..n-1) a partir de sus visuales. */
export function toOptions(visuals: Visual[], place?: 'row' | 'scene'): Option[] {
  return visuals.map((visual, id) => (place ? { id, key: visualKey(visual), visual, place } : { id, key: visualKey(visual), visual }));
}
