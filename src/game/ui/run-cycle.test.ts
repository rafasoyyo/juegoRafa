import { describe, expect, it } from 'vitest';
import { cycleHz, HIPS, initialRun, legFeet, stepRun, wheelMix, type RunInput, type RunState } from './run-cycle';

const RUN: RunInput = { running: true, grounded: true, finished: false };
const FRAME = 1000 / 60;

function simulate(state: RunState, ms: number, input: RunInput): RunState {
  let s = state;
  for (let t = 0; t < ms; t += FRAME) s = stepRun(s, FRAME, input);
  return s;
}

describe('stepRun', () => {
  it('la intensidad llega a 1 en 500 ms como mucho corriendo por el suelo', () => {
    expect(simulate(initialRun(), 500, RUN).intensity).toBe(1);
  });

  it('empieza en zancada: tras un fotograma la intensidad es baja', () => {
    expect(stepRun(initialRun(), FRAME, RUN).intensity).toBeLessThan(0.1);
  });

  it('vuelve a 0 al parar en el suelo', () => {
    const full = simulate(initialRun(), 600, RUN);
    expect(stepRun(full, FRAME, { running: false, grounded: true, finished: false }).intensity).toBe(0);
  });

  it('vuelve a 0 al llegar a la meta, aunque siga corriendo o en el aire', () => {
    const full = simulate(initialRun(), 600, RUN);
    expect(stepRun(full, FRAME, { running: true, grounded: true, finished: true }).intensity).toBe(0);
    expect(stepRun(full, FRAME, { running: false, grounded: false, finished: true }).intensity).toBe(0);
  });

  it('se congela en el aire, corra o no', () => {
    const half = simulate(initialRun(), 200, RUN);
    expect(simulate(half, 300, { running: true, grounded: false, finished: false }).intensity).toBe(half.intensity);
    expect(simulate(half, 300, { running: false, grounded: false, finished: false }).intensity).toBe(half.intensity);
  });

  it('la fase avanza más deprisa con intensidad 1 que con 0', () => {
    expect(cycleHz(1)).toBeGreaterThan(cycleHz(0));
    const slow = stepRun({ phase: 0, intensity: 0 }, 50, { running: true, grounded: false, finished: false });
    const fast = stepRun({ phase: 0, intensity: 1 }, 50, { running: true, grounded: false, finished: false });
    expect(fast.phase).toBeGreaterThan(slow.phase);
  });

  it('la fase se queda en [0, 1) y no avanza parado', () => {
    const s = simulate(initialRun(), 5000, RUN);
    expect(s.phase).toBeGreaterThanOrEqual(0);
    expect(s.phase).toBeLessThan(1);
    expect(stepRun(s, 100, { running: false, grounded: true, finished: false }).phase).toBe(s.phase);
  });

  it('limita los saltos de tiempo enormes (cambio de pestaña)', () => {
    expect(stepRun(initialRun(), 10_000, RUN).intensity).toBeLessThan(1);
  });
});

describe('legFeet', () => {
  it('los dos pies van desfasados medio ciclo', () => {
    // Respecto a su cadera, cuando un pie está delante el otro está igual de atrás.
    for (const i of [0, 0.5, 1]) {
      for (const p of [0, 0.1, 0.37, 0.8]) {
        const [back, front] = legFeet(p, i);
        expect(back.x - HIPS[0]!.x + (front.x - HIPS[1]!.x)).toBeCloseTo(2 * 2);
      }
    }
    // Y uno está arriba mientras el otro pisa el suelo.
    const [up, down] = legFeet(0.75, 1);
    expect(up.y).toBeLessThan(down.y);
    expect(down.y).toBe(0);
  });

  it('ningún pie baja de y = 0', () => {
    for (let p = 0; p < 1; p += 0.01) {
      for (const i of [0, 0.3, 0.7, 1]) {
        for (const f of legFeet(p, i)) expect(f.y).toBeLessThanOrEqual(0);
      }
    }
  });

  it('con más intensidad la zancada es más larga', () => {
    const span = (i: number): number => {
      let min = Infinity;
      let max = -Infinity;
      for (let p = 0; p < 1; p += 0.01) {
        const [f] = legFeet(p, i);
        min = Math.min(min, f.x);
        max = Math.max(max, f.x);
      }
      return max - min;
    };
    expect(span(1)).toBeGreaterThan(span(0));
  });
});

describe('wheelMix', () => {
  it('vale 0 con intensidad ≤ 0,5 y 1 con intensidad ≥ 0,9', () => {
    expect(wheelMix(0)).toBe(0);
    expect(wheelMix(0.5)).toBe(0);
    expect(wheelMix(0.9)).toBe(1);
    expect(wheelMix(1)).toBe(1);
    expect(wheelMix(0.7)).toBeGreaterThan(0);
    expect(wheelMix(0.7)).toBeLessThan(1);
  });
});
