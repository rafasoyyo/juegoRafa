/**
 * Caras de los carteles y bloques de los retos: cifra, puntos o marco de diez. Cada punto es un objeto
 * aparte para poder encenderlos de uno en uno al contar.
 */

import Phaser from 'phaser';
import type { Face } from '../../learning/challenges/count-blocks';
import { COLORS } from '../config';
import { digits } from '../ui/round-button';

export const FRAME_BLUE = 0x4da3ff;
const FRAME_BLUE_DARK = 0x2f7fd6;
const CELL = 0xffffff;
const DOT_LIT = COLORS.yellow;

export interface FaceView {
  container: Phaser.GameObjects.Container;
  /** Puntos en orden de conteo (vacío en una cifra). */
  dots: Phaser.GameObjects.Arc[];
}

/** Posiciones de dado (en cuartos del lado) hasta 9. */
const DIE: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  7: [[-1, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
  8: [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
  9: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
};

/** Cara de `size` px de lado (el marco de diez se ajusta a ese ancho). */
export function drawFace(scene: Phaser.Scene, face: Face, size: number): FaceView {
  const container = scene.add.container(0, 0);
  const dots: Phaser.GameObjects.Arc[] = [];
  if (face.type === 'digit') {
    container.add(digits(scene, 0, 2, String(face.value), size * 0.66));
    return { container, dots };
  }
  if (face.type === 'dots') {
    const spots = DIE[face.value];
    if (spots) {
      const q = size * 0.27;
      for (const [x, y] of spots) dots.push(scene.add.circle(x * q, y * q, size * 0.1, COLORS.ink));
    } else {
      const per = 5;
      const rows = Math.ceil(face.value / per);
      const step = (size * 0.9) / per;
      for (let i = 0; i < face.value; i++) {
        const x = -size * 0.45 + step * ((i % per) + 0.5);
        const y = -((rows - 1) * step) / 2 + Math.floor(i / per) * step;
        dots.push(scene.add.circle(x, y, step * 0.32, COLORS.ink));
      }
    }
    container.add(dots);
    return { container, dots };
  }
  // Marco de diez: uno hasta 10, dos (uno encima de otro) hasta 20.
  const frames = face.value > 10 ? 2 : 1;
  const w = size * 0.98;
  const cell = w / 5;
  const h = cell * 2;
  const gap = cell * 0.3;
  const total = frames * h + (frames - 1) * gap;
  const g = scene.add.graphics();
  container.add(g);
  for (let f = 0; f < frames; f++) {
    const top = -total / 2 + f * (h + gap);
    g.fillStyle(FRAME_BLUE_DARK).fillRoundedRect(-w / 2, top + 3, w, h, cell * 0.25);
    g.fillStyle(FRAME_BLUE).fillRoundedRect(-w / 2, top, w, h, cell * 0.25);
    for (let i = 0; i < 10; i++) {
      const cx = -w / 2 + cell * ((i % 5) + 0.5);
      const cy = top + cell * (Math.floor(i / 5) + 0.5);
      g.fillStyle(CELL).fillRoundedRect(cx - cell * 0.4, cy - cell * 0.4, cell * 0.8, cell * 0.8, cell * 0.2);
      if (f * 10 + i < face.value) dots.push(scene.add.circle(cx, cy, cell * 0.3, COLORS.coral));
    }
  }
  container.add(dots);
  return { container, dots };
}

/** Enciende un punto: crece y cambia a amarillo. */
export function lightDot(scene: Phaser.Scene, dot: Phaser.GameObjects.Arc): void {
  const base = dot.fillColor;
  dot.setFillStyle(DOT_LIT);
  dot.setStrokeStyle(3, COLORS.yellowDark);
  scene.tweens.add({ targets: dot, scale: 1.35, duration: 140, yoyo: true });
  dot.setData('base', base);
}

/** Apaga los puntos encendidos. */
export function resetDots(dots: readonly Phaser.GameObjects.Arc[]): void {
  for (const d of dots) {
    const base = d.getData('base') as number | undefined;
    if (base !== undefined) d.setFillStyle(base);
    d.setStrokeStyle();
  }
}
