/**
 * Registro de los tipos de reto del recorrido (spec `world-isolation`): una entrada por tipo con todo lo
 * que `LevelScene` necesita para montarlo. La parte pura (su zona y su tiempo de calma) está en
 * `CHALLENGE_SHAPES` (`levels/types.ts`). Para añadir un tipo: su lógica en `src/learning/challenges/`, su
 * vista aquí al lado y una entrada en cada uno de los dos registros; ninguna escena cambia.
 */

import Phaser from 'phaser';
import { boatChallenge, type BoatChallenge } from '../../learning/challenges/boat';
import { brachioChallenge, type BrachioChallenge } from '../../learning/challenges/brachio';
import { bridgeChallenge, type BridgeChallenge } from '../../learning/challenges/bridge';
import { caveDoorChallenge, type CaveDoorChallenge } from '../../learning/challenges/cave-door';
import { countChallenge, countRange } from '../../learning/challenges/count-blocks';
import { footprintsChallenge, type FootprintsChallenge } from '../../learning/challenges/footprints';
import { geyserChallenge, type GeyserChallenge } from '../../learning/challenges/geyser';
import type { AgeBand } from '../../learning/quiz/types';
import type { Rng } from '../../learning/quiz/rng';
import { BOAT_LAKE, GEYSER_LAKE, TILE, type ChallengeData, type ChallengeKind, type WorldSpike } from '../levels/types';
import { BoatChallengeView } from './boat-challenge-view';
import { BrachioChallengeView } from './brachio-challenge-view';
import { BridgeChallengeView, bridgeHole } from './bridge-challenge-view';
import { CaveDoorChallengeView } from './cave-door-challenge-view';
import type { ChallengeHooks, ChallengeView } from './challenge-view';
import { CountChallengeView } from './count-challenge-view';
import { FootprintsChallengeView } from './footprints-challenge-view';
import { GeyserChallengeView } from './geyser-challenge-view';

/** Un reto del nivel, en px del mundo. */
export type WorldChallenge = ChallengeData & { index: number };
type Fox = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

/**
 * Mecánica de un tipo de reto con su plan `P` (los valores que salen de la franja de edad y cambian en
 * cada partida). Se declaran como métodos para que una entrada con su plan concreto quepa en el registro.
 */
export interface ChallengeMechanic<P = unknown> {
  /**
   * Prepara el plan de los retos de este tipo de un nivel: devuelve la función que da el plan de cada
   * uno, en orden. Lo que comparten los retos del mismo nivel (p. ej. no repetir respuestas) vive aquí.
   */
  planner(band: AgeBand, rng: Rng): (data: WorldChallenge) => P;
  /** Agua o lava del reto antes de resolverlo, para el suelo y los enemigos. */
  holes(x: number, plan: P): WorldSpike[];
  view(scene: Phaser.Scene, fox: Fox, data: WorldChallenge, plan: P, hooks: ChallengeHooks): ChallengeView;
}

/** Mantiene el tipo del plan dentro de la entrada y lo borra hacia fuera (la escena solo lo devuelve a la misma entrada). */
function mechanic<P>(m: ChallengeMechanic<P>): ChallengeMechanic {
  return m as ChallengeMechanic;
}

/** Plan sin estado compartido: cada reto sale solo de la franja y el azar. */
function each<P>(make: (band: AgeBand, rng: Rng) => P): (band: AgeBand, rng: Rng) => () => P {
  return (band, rng) => () => make(band, rng);
}

const lake = (width: number) => (x: number): WorldSpike[] => [{ index: -1, x, width: width * TILE }];

export const CHALLENGE_MECHANICS: Readonly<Record<ChallengeKind, ChallengeMechanic>> = {
  count: mechanic({
    planner(band, rng) {
      // Respuestas distintas entre los retos A del nivel mientras quepan en el rango.
      const [min, max] = countRange(band);
      const pool = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i));
      let next = 0;
      return (c) => countChallenge(band, rng, c, pool[next++ % pool.length]!);
    },
    holes: () => [],
    view: (scene, fox, c, plan, hooks) => new CountChallengeView(scene, fox, c, plan, hooks),
  }),
  bridge: mechanic<BridgeChallenge>({
    planner: each(bridgeChallenge),
    holes: (x, plan) => [bridgeHole(x, plan)],
    view: (scene, fox, c, plan, hooks) => new BridgeChallengeView(scene, fox, c, plan, hooks),
  }),
  footprints: mechanic<FootprintsChallenge>({
    planner: each(footprintsChallenge),
    holes: (x, plan) => [bridgeHole(x, plan)],
    view: (scene, fox, c, plan, hooks) => new FootprintsChallengeView(scene, fox, c, plan, hooks),
  }),
  door: mechanic<CaveDoorChallenge>({
    planner: each(caveDoorChallenge),
    holes: () => [],
    view: (scene, fox, c, plan, hooks) => new CaveDoorChallengeView(scene, fox, c, plan, hooks),
  }),
  boat: mechanic<BoatChallenge>({
    planner: each(boatChallenge),
    holes: lake(BOAT_LAKE),
    view: (scene, fox, c, plan, hooks) => new BoatChallengeView(scene, fox, c, plan, hooks),
  }),
  brachio: mechanic<BrachioChallenge>({
    planner: each(brachioChallenge),
    holes: lake(BOAT_LAKE),
    view: (scene, fox, c, plan, hooks) => new BrachioChallengeView(scene, fox, c, plan, hooks),
  }),
  geyser: mechanic<GeyserChallenge>({
    planner: each(geyserChallenge),
    holes: lake(GEYSER_LAKE),
    view: (scene, fox, c, plan, hooks) => new GeyserChallengeView(scene, fox, c, plan, hooks),
  }),
};
