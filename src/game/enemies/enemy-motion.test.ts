import { describe, expect, it } from 'vitest';
import { GROUND_TOP } from '../level-course';
import {
  BEE_PERIOD_MS,
  beeBox,
  beePosition,
  CRAB_BOX,
  CRAB_SPEED,
  crabBox,
  crabX,
  FROG_AIR_MS,
  FROG_BOX,
  FROG_CROUCH_MS,
  FROG_JUMP_H,
  FROG_PERIOD_MS,
  FROG_SIT_MS,
  frogBox,
  frogState,
  HEDGEHOG_BOX,
  HEDGEHOG_SPEED,
  hedgehogBox,
  hedgehogX,
  overlaps,
  PTERO_BOTTOM_Y,
  PTERO_DRIFT,
  PTERO_PERIOD_MS,
  PTERO_SPACING,
  PTERO_TOP_Y,
  pteroBox,
  pteroPosition,
  ROCK_RISE,
  rockBox,
  TREX_BOX,
  TREX_ROAR_MS,
  TREX_SPEED,
  TREX_WALK_MS,
  trexBox,
  trexState,
  VOLCANO_PERIOD_MS,
  VOLCANO_SHAKE_MS,
  volcanoBox,
  volcanoState,
  type Rect,
} from './enemy-motion';

const GROUND = GROUND_TOP;

/** Cuerpo del zorro de pie (56×87), con la parte de arriba en y ≈ 528 como en el diseño. */
const FOX_STANDING: Rect = { x: 1000 - 28, y: 528, w: 56, h: GROUND_TOP - 528 };
/** Altura del salto del zorro: 1056² / (2 · 2880). */
const FOX_JUMP_HEIGHT = 1056 ** 2 / (2 * 2880);

describe('hedgehogX', () => {
  const patrol = { minX: 1200, maxX: 1520, phase: 0.3 };
  /** Tres idas y vueltas completas. */
  const SPAN_MS = ((3 * 2 * (patrol.maxX - patrol.minX)) / HEDGEHOG_SPEED) * 1000;

  it('nunca sale de [minX, maxX]', () => {
    for (let t = 0; t < SPAN_MS; t += 7) {
      const { x } = hedgehogX(t, patrol);
      expect(x).toBeGreaterThanOrEqual(patrol.minX);
      expect(x).toBeLessThanOrEqual(patrol.maxX);
    }
  });

  it('cambia de sentido en cada extremo y mira hacia donde anda', () => {
    let prev = hedgehogX(0, patrol);
    const turns: number[] = [];
    for (let t = 10; t < SPAN_MS; t += 10) {
      const cur = hedgehogX(t, patrol);
      if (cur.facing !== prev.facing) turns.push(cur.x);
      else expect(Math.sign(cur.x - prev.x) || cur.facing).toBe(cur.facing);
      prev = cur;
    }
    expect(turns.length).toBeGreaterThanOrEqual(5);
    for (const x of turns) expect(Math.min(Math.abs(x - patrol.minX), Math.abs(x - patrol.maxX))).toBeLessThan(2);
  });

  it('con tramo nulo se queda quieto', () => {
    expect(hedgehogX(1234, { minX: 900, maxX: 900, phase: 0.5 }).x).toBe(900);
  });

  it('su caja es mucho más baja que el salto del zorro', () => {
    expect(HEDGEHOG_BOX.h).toBeLessThan(FOX_JUMP_HEIGHT / 3);
    expect(hedgehogBox(1000, GROUND_TOP).y + HEDGEHOG_BOX.h).toBe(GROUND_TOP);
  });
});

describe('beePosition', () => {
  const bee = { x: 1000, phase: 0.17 };

  it('pasa al menos 1 s de cada ciclo lo bastante alta para pasar por debajo', () => {
    const step = 5;
    let clearMs = 0;
    for (let t = 0; t < BEE_PERIOD_MS; t += step) {
      const p = beePosition(t, bee);
      const box = beeBox(p.x, p.y);
      if (box.y + box.h < FOX_STANDING.y) clearMs += step;
    }
    expect(clearMs).toBeGreaterThanOrEqual(1000);
  });

  it('en su punto más bajo corta el paso a un zorro de pie', () => {
    let lowest = beePosition(0, bee);
    for (let t = 0; t < BEE_PERIOD_MS; t += 5) {
      const p = beePosition(t, bee);
      if (p.y > lowest.y) lowest = p;
    }
    const fox = { ...FOX_STANDING, x: lowest.x - FOX_STANDING.w / 2 };
    expect(overlaps(fox, beeBox(lowest.x, lowest.y))).toBe(true);
  });

  it('su deriva horizontal no pasa de 30 px', () => {
    for (let t = 0; t < 2 * BEE_PERIOD_MS; t += 11) expect(Math.abs(beePosition(t, bee).x - bee.x)).toBeLessThanOrEqual(30);
  });
});

describe('overlaps', () => {
  const a: Rect = { x: 0, y: 0, w: 10, h: 10 };

  it('cajas que se cruzan chocan', () => {
    expect(overlaps(a, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
    expect(overlaps(a, { x: 2, y: 2, w: 2, h: 2 })).toBe(true);
  });

  it('cajas que solo se tocan por el borde no chocan', () => {
    expect(overlaps(a, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
    expect(overlaps(a, { x: 0, y: 10, w: 10, h: 10 })).toBe(false);
  });

  it('cajas separadas no chocan', () => {
    expect(overlaps(a, { x: 30, y: 30, w: 5, h: 5 })).toBe(false);
  });
});

describe('rana', () => {
  const at = (t: number) => frogState(t, { phase: 0 });

  it('quieta, luego agachada (el aviso) y luego en el aire, siempre en el mismo ciclo', () => {
    expect(at(0).pose).toBe('sit');
    expect(at(FROG_SIT_MS - 1).pose).toBe('sit');
    expect(at(FROG_SIT_MS + 10).pose).toBe('crouch');
    expect(at(FROG_SIT_MS + FROG_CROUCH_MS + 10).pose).toBe('air');
    expect(at(FROG_PERIOD_MS).pose).toBe('sit');
  });

  it('siempre se agacha antes de saltar, al menos 400 ms', () => {
    expect(FROG_CROUCH_MS).toBeGreaterThanOrEqual(400);
    let prev = at(0).pose;
    for (let t = 0; t < FROG_PERIOD_MS * 3; t += 10) {
      const pose = at(t).pose;
      if (pose === 'air' && prev !== 'air') expect(prev).toBe('crouch');
      prev = pose;
    }
  });

  it('en lo alto del salto el zorro pasa andando por debajo; quieta, se salta por encima', () => {
    const FOX_H = 87;
    const top = FROG_SIT_MS + FROG_CROUCH_MS + FROG_AIR_MS / 2;
    const s = at(top);
    expect(s.height).toBeCloseTo(FROG_JUMP_H);
    const fox = { x: 500 - 28, y: GROUND - FOX_H, w: 56, h: FOX_H };
    expect(overlaps(fox, frogBox(500, s.height, GROUND))).toBe(false);
    expect(overlaps(fox, frogBox(500, 0, GROUND))).toBe(true);
    // Ventana para pasar por debajo: más de lo que tarda el zorro en cruzarla (100 px a 352 px/s).
    let clearMs = 0;
    for (let t = 0; t < FROG_PERIOD_MS; t += 5) if (!overlaps(fox, frogBox(500, at(t).height, GROUND))) clearMs += 5;
    expect(clearMs).toBeGreaterThan((100 / 352) * 1000 + 150);
    // Quieta mide menos que un salto bajo.
    expect(FROG_BOX.h).toBeLessThan(60);
  });
});

describe('cangrejo', () => {
  it('va y vuelve entre sus límites, más despacio que el erizo', () => {
    expect(CRAB_SPEED).toBeLessThan(HEDGEHOG_SPEED);
    const patrol = { minX: 100, maxX: 300, phase: 0 };
    expect(crabX(0, patrol).x).toBe(100);
    expect(crabX(((300 - 100) / CRAB_SPEED) * 1000, patrol).x).toBeCloseTo(300);
    for (let t = 0; t < 20000; t += 97) {
      const { x } = crabX(t, patrol);
      expect(x).toBeGreaterThanOrEqual(100);
      expect(x).toBeLessThanOrEqual(300);
    }
  });

  it('su caja está en el suelo', () => {
    const b = crabBox(200, GROUND);
    expect(b.y + b.h).toBe(GROUND);
    expect(b.w).toBe(CRAB_BOX.w);
  });
});

describe('enemigos de la isla', () => {
  const JUMP_APEX = 193; // altura de los pies en lo alto de un salto normal (v² / 2g)

  it('pterosaurio: abajo choca con el zorro de pie y arriba deja pasar por debajo', () => {
    const fila = { x: 1000, phase: 0, of: 3, spacing: PTERO_SPACING, drift: 0 };
    let hits = 0;
    let clear = 0;
    for (let t = 0; t < PTERO_PERIOD_MS; t += 20) {
      const p = pteroPosition(t, fila, 1);
      const box = pteroBox(p.x, p.y);
      const fox = { ...FOX_STANDING, x: p.x - 28 };
      if (overlaps(box, fox)) hits++;
      else if (box.y + box.h < FOX_STANDING.y - 10) clear++;
    }
    expect(hits).toBeGreaterThan(0);
    expect(clear).toBeGreaterThan(PTERO_PERIOD_MS / 20 / 4);
  });

  it('pterosaurio: los de una fila van a la misma altura, separados y en ola', () => {
    const fila = { x: 1000, phase: 0.3, of: 3, spacing: PTERO_SPACING, drift: PTERO_DRIFT };
    const ys = new Set<number>();
    for (let t = 0; t < 2 * PTERO_PERIOD_MS; t += 50) {
      const [a, b, c] = [0, 1, 2].map((i) => pteroPosition(t, fila, i));
      expect(b!.x - a!.x).toBeCloseTo(PTERO_SPACING);
      expect(c!.x - b!.x).toBeCloseTo(PTERO_SPACING);
      for (const p of [a!, b!, c!]) {
        expect(p.y).toBeGreaterThanOrEqual(PTERO_TOP_Y - 0.001);
        expect(p.y).toBeLessThanOrEqual(PTERO_BOTTOM_Y + 0.001);
      }
      ys.add(Math.round(a!.y - b!.y));
    }
    expect(ys.size).toBeGreaterThan(1);
  });

  it('volcancito: tiembla antes de lanzar y la piedra nunca sale de su columna ni del cráter al caer', () => {
    let sawShakeBeforeAir = false;
    let prev = volcanoState(0, { phase: 0 }).pose;
    for (let t = 0; t <= 2 * VOLCANO_PERIOD_MS; t += 10) {
      const s = volcanoState(t, { phase: 0 });
      if (s.pose === 'air' && prev !== 'air') expect(prev).toBe('shake');
      if (prev === 'shake' && s.pose === 'air') sawShakeBeforeAir = true;
      prev = s.pose;
      expect(s.rock).toBeGreaterThanOrEqual(0);
      expect(s.rock).toBeLessThanOrEqual(ROCK_RISE + 0.001);
      const box = rockBox(1000, s.rock, GROUND);
      expect(box.x + box.w / 2).toBe(1000);
    }
    expect(sawShakeBeforeAir).toBe(true);
    expect(VOLCANO_SHAKE_MS).toBeGreaterThanOrEqual(600);
  });

  it('volcancito: con la piedra arriba se puede saltar; el cono solo es bajo', () => {
    // En lo alto del vuelo la piedra está muy por encima de la cabeza del zorro en lo alto de un salto.
    const top = rockBox(1000, ROCK_RISE, GROUND);
    expect(top.y + top.h).toBeLessThan(GROUND - JUMP_APEX - 87 - 40);
    expect(volcanoBox(1000, GROUND).h).toBeLessThan(JUMP_APEX - 60);
    // La mitad del vuelo, al menos, la piedra va por encima de un zorro que salta.
    let high = 0;
    for (let u = 0; u < 1; u += 0.01) if (rockBox(1000, 4 * ROCK_RISE * u * (1 - u), GROUND).y + 42 < GROUND - JUMP_APEX - 87) high++;
    expect(high).toBeGreaterThanOrEqual(40);
  });

  it('tiranosaurio: camina, se para a rugir y mientras ruge está quieto; se le salta por encima', () => {
    const t = { minX: 1000, maxX: 1360, phase: 0 };
    const s1 = trexState(TREX_WALK_MS + 100, t);
    const s2 = trexState(TREX_WALK_MS + TREX_ROAR_MS - 100, t);
    expect(s1.pose).toBe('roar');
    expect(s2.x).toBe(s1.x);
    expect(trexState(100, t).pose).toBe('walk');
    for (let ms = 0; ms < 40000; ms += 37) {
      const s = trexState(ms, t);
      expect(s.x).toBeGreaterThanOrEqual(t.minX - 0.001);
      expect(s.x).toBeLessThanOrEqual(t.maxX + 0.001);
    }
    expect(TREX_BOX.h).toBeLessThan(JUMP_APEX - 60);
    expect(trexBox(1000, GROUND).y).toBe(GROUND - TREX_BOX.h);
    expect(TREX_SPEED).toBeLessThan(HEDGEHOG_SPEED);
  });
});
