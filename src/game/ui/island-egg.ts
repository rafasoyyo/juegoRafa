/**
 * Dibujo del huevo de la isla (`map/egg-spots.ts`): cáscara crema con luz y sombra planas y sus 12
 * manchas. Las pintadas van en su color; las que faltan, como un hueco claro. Lo usan el mapa y el final.
 */

import Phaser from 'phaser';
import { EGG_ASPECT, EGG_SPOTS, type SpotColor } from '../map/egg-spots';
import { GLYPH_HEX } from '../challenges/glyphs';

export const SHELL = 0xf1e6cc;
export const SHELL_DARK = 0xd9c79f;
const SHELL_LIGHT = 0xfbf5e6;

export const SPOT_HEX: Record<SpotColor, number> = GLYPH_HEX;

/** Contorno del huevo de alto `size`, centrado en (0, 0): algo más estrecho arriba. */
export function eggPoints(size: number, n = 48): Phaser.Math.Vector2[] {
  const h = size / 2;
  const w = (size * EGG_ASPECT) / 2;
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const y = Math.sin(a) * h;
    const narrow = y < 0 ? 1 - 0.18 * (-y / h) : 1;
    return new Phaser.Math.Vector2(Math.cos(a) * w * narrow, y);
  });
}

/** Cáscara sin manchas: sombra a la derecha y abajo, luz arriba a la izquierda. */
export function drawShell(g: Phaser.GameObjects.Graphics, size: number): void {
  g.fillStyle(SHELL_DARK).fillPoints(eggPoints(size).map((p) => new Phaser.Math.Vector2(p.x + size * 0.03, p.y + size * 0.02)), true);
  g.fillStyle(SHELL).fillPoints(eggPoints(size), true);
  g.fillStyle(SHELL_LIGHT, 0.8).fillEllipse(-size * 0.11, -size * 0.2, size * 0.16, size * 0.24);
}

/** Una mancha (`level` de 1 a 12), pintada o como hueco. */
export function drawSpot(g: Phaser.GameObjects.Graphics, level: number, size: number, painted: boolean): void {
  const s = EGG_SPOTS[level - 1];
  if (!s) return;
  if (painted) g.fillStyle(SPOT_HEX[s.color]).fillCircle(s.x * size, s.y * size, s.r * size);
  else g.fillStyle(SHELL_DARK, 0.55).fillCircle(s.x * size, s.y * size, s.r * size * 0.8);
}

/** Huevo completo de alto `size` con las manchas de `painted` pintadas, centrado en (0, 0). */
export function drawIslandEgg(scene: Phaser.Scene, size: number, painted: readonly number[]): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  drawShell(g, size);
  for (let level = 1; level <= EGG_SPOTS.length; level++) drawSpot(g, level, size, painted.includes(level));
  return g;
}
