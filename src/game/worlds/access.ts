/**
 * Si un mundo se puede abrir desde el selector: según el interruptor de desarrollo, la edad del perfil
 * y el progreso en otro mundo. TypeScript puro (sin Phaser).
 */

import type { Flags } from '../flags';
import type { GameState } from '../state';
import type { WorldDef } from './types';

/** `open`: se abre al tocarlo. `locked`: con candado. `soon`: aún no existe para el niño. */
export type WorldAccess = 'open' | 'locked' | 'soon';

export function worldAccess(def: WorldDef, state: GameState, age: number | undefined, flags: Flags): WorldAccess {
  const gate = def.gate;
  if (!gate) return 'open';
  if (gate.flag && !flags[gate.flag]) return 'soon';
  if (gate.openAge !== undefined && age !== undefined && age >= gate.openAge) return 'open';
  if (gate.after) {
    const progress = state.worlds.get(gate.after.world);
    const level = gate.after.level;
    if (progress && (progress.stars.has(level) || progress.pending.has(level))) return 'open';
  }
  return 'locked';
}
