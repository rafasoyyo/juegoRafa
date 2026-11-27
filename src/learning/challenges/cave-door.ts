/**
 * Reto B de la isla, «La puerta de la cueva» (`docs/MUNDO-3.md`): una losa tapa la entrada del templo y
 * tiene un hueco con una forma; el niño golpea el bloque con la forma que encaja. La pieza del bloque
 * está siempre derecha y gira al volar hasta el hueco. TypeScript puro y con semilla.
 *
 * - 3-4 años: círculo, cuadrado y triángulo, sin girar.
 * - 5-6 años: además estrella, rombo y óvalo; el hueco puede estar girado un cuarto de vuelta.
 * - 7-8 años: piezas compuestas sin simetría, con el hueco girado; uno de los bloques es la misma pieza
 *   volteada, que no encaja por mucho que gire.
 */

import type { Rng } from '../quiz/rng';
import { PIECES, type AgeBand, type PieceId, type ShapeId } from '../quiz/types';

/** Lo que lleva un bloque o el hueco: una forma simple o una pieza compuesta, con su giro en grados. */
export type DoorShape = { type: 'shape'; shape: ShapeId; angle: number } | { type: 'piece'; piece: PieceId; angle: number; mirrored: boolean };

export interface CaveDoorChallenge {
  kind: 'door';
  /** El hueco de la losa. */
  hole: DoorShape;
  /** Los tres bloques, siempre derechos. */
  options: DoorShape[];
  correct: number;
}

export const DOOR_SHAPES: Record<'small' | 'medium', readonly ShapeId[]> = {
  small: ['circle', 'square', 'triangle'],
  medium: ['circle', 'square', 'triangle', 'star', 'diamond', 'oval'],
};

/** Formas a las que un cuarto de vuelta les cambia la cara (el círculo y el cuadrado se ven igual). */
const TURN_SHOWS: readonly ShapeId[] = ['triangle', 'star', 'diamond', 'oval'];

/** Clave de lo que se ve en un bloque, sin el giro (los bloques van derechos). */
export function doorKey(d: DoorShape): string {
  return d.type === 'shape' ? `shape:${d.shape}` : `piece:${d.piece}:${d.mirrored ? 'm' : 'n'}`;
}

export function caveDoorChallenge(band: AgeBand, rng: Rng): CaveDoorChallenge {
  let hole: DoorShape;
  let options: DoorShape[];
  if (band === 'big') {
    const [piece, other] = rng.shuffle(PIECES) as [PieceId, PieceId];
    hole = { type: 'piece', piece, angle: rng.pick([90, 180, 270]), mirrored: false };
    options = [
      { type: 'piece', piece, angle: 0, mirrored: false },
      { type: 'piece', piece, angle: 0, mirrored: true },
      { type: 'piece', piece: other, angle: 0, mirrored: false },
    ];
  } else {
    const pool = DOOR_SHAPES[band];
    const [shape, ...others] = rng.shuffle(pool) as ShapeId[];
    const turned = band === 'medium' && TURN_SHOWS.includes(shape!) && rng.chance(0.5);
    hole = { type: 'shape', shape: shape!, angle: turned ? 90 : 0 };
    options = [shape!, ...others.slice(0, 2)].map((s) => ({ type: 'shape' as const, shape: s, angle: 0 }));
  }
  const answer = doorKey(options[0]!);
  options = rng.shuffle(options);
  return { kind: 'door', hole, options, correct: options.findIndex((o) => doorKey(o) === answer) };
}
