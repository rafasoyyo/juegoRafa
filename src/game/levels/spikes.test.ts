import { describe, expect, it } from 'vitest';
import { BLOCK_SIZE, GRAVITY, GROUND_TOP, KNOCK_VY, MAX_VELOCITY } from '../level-course';
import { FRUIT_SIZE, FRUIT_VX, FRUIT_VY } from '../power/power';
import { ARCOIRIS } from '../worlds/arcoiris';

const LEVELS = ARCOIRIS.levels;
import { toWorld } from './parse';
import {
  airTimeUp,
  exitSide,
  FOOT_INSET,
  FOX_HALF_BODY,
  groundSpans,
  jumpReach,
  LIP_MIN_FOOT,
  lipNudge,
  nudgeOffSpikes,
  PIT_DEPTH,
  PIT_TIP,
  pitUnder,
  reboundAirTime,
  reboundTarget,
  reboundVelocity,
  SPIKE_CONE_H,
  SPIKE_PLATE_H,
} from './spikes';
import { TILE, type WorldSpike } from './types';

/** Zona de 2 baldosas que empieza en x = 1000 px. */
const WIDE: WorldSpike = { index: 0, x: 1000, width: 2 * TILE };
const NARROW: WorldSpike = { index: 1, x: 2000, width: TILE };
const ZONES = [WIDE, NARROW];
const BODY_W = 2 * FOX_HALF_BODY;
/** Base del cuerpo de Rufo apoyado en el fondo del foso, sobre las puntas. */
const PIT_FLOOR = GROUND_TOP + PIT_TIP;

/** Dónde cae el centro de Rufo tras rebotar desde el fondo en `x` sin tocar ningún control. */
const landing = (zone: WorldSpike, side: -1 | 1, x: number): number => x + reboundVelocity(zone, side, x) * reboundAirTime();

/** Cuerpo de Rufo con el borde izquierdo en `bodyX`, a partir de cuántos px de pie quedan sobre el borde izquierdo de `zone`. */
const onLeftLip = (zone: WorldSpike, footOnGround: number): number => zone.x - footOnGround - FOOT_INSET;
const onRightLip = (zone: WorldSpike, footOnGround: number): number => zone.x + zone.width + footOnGround + FOOT_INSET - BODY_W;

describe('zonas de pinchos', () => {
  it('un salto normal cruza ≈ 3 baldosas', () => {
    expect(jumpReach() / TILE).toBeCloseTo(3.07, 1);
  });

  it('el foso cabe justo: puntas a 22 px bajo el suelo, conos y placa hasta el fondo', () => {
    expect(PIT_TIP + SPIKE_CONE_H + SPIKE_PLATE_H).toBe(PIT_DEPTH);
  });

  describe('tramos de suelo', () => {
    it('cubren todo el mundo salvo las zonas, en orden y sin solaparse', () => {
      const worldW = 5000;
      const spans = groundSpans(worldW, [NARROW, WIDE]);
      expect(spans).toEqual([
        { from: 0, to: WIDE.x },
        { from: WIDE.x + WIDE.width, to: NARROW.x },
        { from: NARROW.x + NARROW.width, to: worldW },
      ]);
      const covered = spans.reduce((sum, s) => sum + s.to - s.from, 0) + WIDE.width + NARROW.width;
      expect(covered).toBe(worldW);
      for (let k = 1; k < spans.length; k++) expect(spans[k]!.from).toBeGreaterThan(spans[k - 1]!.to);
    });

    it('un nivel sin zonas da un solo tramo', () => {
      expect(groundSpans(3000, [])).toEqual([{ from: 0, to: 3000 }]);
    });
  });

  describe('dentro del foso', () => {
    it('apoyado en el fondo de un foso es tocar los pinchos', () => {
      expect(pitUnder(PIT_FLOOR, WIDE.x + TILE, ZONES)).toBe(WIDE);
      expect(pitUnder(PIT_FLOOR, NARROW.x + TILE / 2, ZONES)).toBe(NARROW);
    });

    it('a la altura del suelo, en el borde, no cuenta', () => {
      expect(pitUnder(GROUND_TOP, WIDE.x + 10, ZONES)).toBeUndefined();
      expect(pitUnder(GROUND_TOP + 2, WIDE.x + 10, ZONES)).toBeUndefined();
    });

    it('Saltar rozando: en el aire sobre el foso no cuenta', () => {
      expect(pitUnder(GROUND_TOP - 1, WIDE.x + TILE, ZONES)).toBeUndefined();
      expect(pitUnder(GROUND_TOP - 200, NARROW.x + TILE / 2, ZONES)).toBeUndefined();
    });

    it('fuera de las zonas no hay foso', () => {
      expect(pitUnder(PIT_FLOOR, 500, ZONES)).toBeUndefined();
      expect(pitUnder(PIT_FLOOR, 1600, ZONES)).toBeUndefined();
    });
  });

  describe('el borde sostiene y recoloca', () => {
    it('Pararse en el borde: con menos de 12 px de pie sobre el suelo, hacia el suelo firme', () => {
      expect(lipNudge(onLeftLip(WIDE, LIP_MIN_FOOT - 1), BODY_W, ZONES)).toBe(-1);
      expect(lipNudge(onRightLip(WIDE, LIP_MIN_FOOT - 1), BODY_W, ZONES)).toBe(1);
      expect(lipNudge(onLeftLip(NARROW, 4), BODY_W, ZONES)).toBe(-1);
      expect(lipNudge(onRightLip(NARROW, 4), BODY_W, ZONES)).toBe(1);
    });

    it('con el pie bien apoyado no se mueve', () => {
      expect(lipNudge(onLeftLip(WIDE, LIP_MIN_FOOT), BODY_W, ZONES)).toBe(0);
      expect(lipNudge(onRightLip(WIDE, 20), BODY_W, ZONES)).toBe(0);
    });

    it('Margen de perdón: con la punta del pie en el borde, hacia el suelo firme y nunca hacia el foso', () => {
      // De la punta del pie (1 px) a todo el pie sobre el hueco, mientras el cuerpo aún pisa el borde.
      for (let foot = 1; foot >= -FOOT_INSET + 1; foot--) {
        expect(lipNudge(onLeftLip(WIDE, foot), BODY_W, ZONES), `izquierda ${foot}`).toBe(-1);
        expect(lipNudge(onRightLip(WIDE, foot), BODY_W, ZONES), `derecha ${foot}`).toBe(1);
      }
    });

    it('lejos de un foso no empuja', () => {
      expect(lipNudge(500, BODY_W, ZONES)).toBe(0);
      expect(lipNudge(WIDE.x - BODY_W - 1, BODY_W, ZONES)).toBe(0);
      expect(lipNudge(WIDE.x + WIDE.width + 1, BODY_W, ZONES)).toBe(0);
    });
  });

  describe('rebote desde el fondo', () => {
    it('el aire del rebote cuenta con despegar 22 px bajo el suelo', () => {
      expect(reboundAirTime()).toBeCloseTo(0.559, 3);
      expect(reboundAirTime()).toBeLessThan((2 * KNOCK_VY) / GRAVITY);
    });

    it('Entrar andando hacia la derecha: rebota a la izquierda y aterriza fuera', () => {
      const x = WIDE.x + FOX_HALF_BODY + 40; // acaba de caer del borde izquierdo
      const side = exitSide(WIDE, WIDE.x - 10, x);
      expect(side).toBe(-1);
      const land = landing(WIDE, side, x);
      expect(land + FOX_HALF_BODY).toBeLessThan(WIDE.x);
      expect(land).toBeCloseTo(reboundTarget(WIDE, -1), 6);
    });

    it('Caer en medio de un salto hacia la izquierda: rebota a la derecha, por donde venía', () => {
      const x = WIDE.x + WIDE.width / 2;
      const side = exitSide(WIDE, WIDE.x + WIDE.width + 150, x);
      expect(side).toBe(1);
      expect(landing(WIDE, side, x) - FOX_HALF_BODY).toBeGreaterThan(WIDE.x + WIDE.width);
    });

    it('sin suelo seguro conocido, rebota hacia el borde más cercano', () => {
      expect(exitSide(WIDE, undefined, WIDE.x + 20)).toBe(-1);
      expect(exitSide(WIDE, undefined, WIDE.x + WIDE.width - 20)).toBe(1);
    });

    it('Salir del foso: sube por encima del suelo antes de que los pies lleguen a la pared y aterriza fuera', () => {
      const dt = 1 / 600;
      for (const zone of ZONES) {
        for (const side of [-1, 1] as const) {
          for (let x0 = zone.x + FOX_HALF_BODY; x0 <= zone.x + zone.width - FOX_HALF_BODY; x0 += 4) {
            const vx = reboundVelocity(zone, side, x0);
            const wall = side < 0 ? zone.x : zone.x + zone.width;
            let t = 0;
            let x = x0;
            let bottom = PIT_FLOOR;
            do {
              t += dt;
              x = x0 + vx * t;
              bottom = PIT_FLOOR - KNOCK_VY * t + (GRAVITY * t * t) / 2;
              const foot = side < 0 ? x - FOX_HALF_BODY + FOOT_INSET : x + FOX_HALF_BODY - FOOT_INSET;
              const inWall = side < 0 ? foot < wall : foot > wall;
              if (bottom > GROUND_TOP && t < KNOCK_VY / GRAVITY) expect(inWall, `${zone.index} ${side} ${x0}: pies en la pared`).toBe(false);
            } while (t < KNOCK_VY / GRAVITY || bottom < GROUND_TOP);
            // Aterriza fuera, con el cuerpo a ≥ 0,75 baldosas del borde.
            const gap = side < 0 ? wall - (x + FOX_HALF_BODY) : x - FOX_HALF_BODY - wall;
            expect(gap, `${zone.index} ${side} ${x0}`).toBeGreaterThanOrEqual(0.75 * TILE - 2);
          }
        }
      }
    });

    it('peor caso (2 baldosas, pegado a la pared contraria): no pasa del límite y aterriza cerca del borde', () => {
      for (const side of [-1, 1] as const) {
        const x = side < 0 ? WIDE.x + WIDE.width - FOX_HALF_BODY : WIDE.x + FOX_HALF_BODY;
        const v = reboundVelocity(WIDE, side, x);
        expect(Math.abs(v)).toBeLessThanOrEqual(MAX_VELOCITY.x);
        expect(Math.abs(v)).toBeCloseTo(413, -1);
        const land = landing(WIDE, side, x);
        expect(pitUnder(PIT_FLOOR, land, ZONES)).toBeUndefined();
        // Aterriza a menos de 1,5 baldosas del borde, lejos de escalones y plataformas (≥ 2 baldosas).
        const gap = side < 0 ? WIDE.x - land : land - (WIDE.x + WIDE.width);
        expect(gap).toBeLessThan(1.5 * TILE);
      }
    });
  });

  describe('fresa', () => {
    it('nunca se queda sobre una zona', () => {
      expect(nudgeOffSpikes(500, ZONES, 28)).toBe(500);
      const left = nudgeOffSpikes(WIDE.x + 30, ZONES, 28);
      expect(left + 28).toBeLessThanOrEqual(WIDE.x);
      const right = nudgeOffSpikes(WIDE.x + WIDE.width - 30, ZONES, 28);
      expect(right - 28).toBeGreaterThanOrEqual(WIDE.x + WIDE.width);
      // Asomando por el borde también se aparta.
      expect(nudgeOffSpikes(NARROW.x - 10, ZONES, 28) + 28).toBeLessThanOrEqual(NARROW.x);
    });

    it('niveles 7 a 12: la fresa de ningún bloque se posa sobre un foso', () => {
      const levels = LEVELS.slice(6).map(toWorld);
      expect(levels).toHaveLength(6);
      for (const world of levels) {
        expect(world.spikes.length, world.id).toBeGreaterThan(0);
        for (const b of world.blocks) {
          // Peor caso: sale de lo alto del bloque y cae hasta el suelo sin tocar nada antes.
          const height = GROUND_TOP - (b.bottom - BLOCK_SIZE);
          const drift = FRUIT_VX * airTimeUp(FRUIT_VY, -height) + FRUIT_SIZE / 2;
          const hit = world.spikes.find((z) => b.x + drift > z.x && b.x - drift < z.x + z.width);
          expect(hit, `${world.id} bloque ${b.index}`).toBeUndefined();
        }
      }
    });
  });
});
