/**
 * Paso pendiente de la pantalla de nuevo perfil: a dónde señala Lalo.
 * TypeScript puro para poder probarlo en Vitest.
 */

import { isValidProfile } from './profile-id';

export type GuideStep = 'alias' | 'age' | 'accept';

/** Sin alias → alias; con alias y sin edad → edad; con ambos → aceptar. */
export function guideStep(alias: string, age: number): GuideStep {
  if (isValidProfile(alias, age)) return 'accept';
  return alias.length === 0 ? 'alias' : 'age';
}

/** Gancho para la voz de Lalo (fase 2): de momento no hace nada. */
export function speak(_step: GuideStep): void {
  /* sin voces todavía */
}
