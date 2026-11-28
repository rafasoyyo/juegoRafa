/**
 * Grabados de la isla (`docs/MUNDO-3.md`, «Dirección de arte»): formas talladas en piedra que se
 * iluminan en turquesa, ámbar u óxido, y los bloques de piedra con borde dorado que se golpean en este
 * mundo. Planos y sin contornos negros.
 */

import Phaser from 'phaser';
import type { Glyph, GlyphColor } from '../../learning/challenges/footprints';
import { BLOCK_SIZE } from '../level-course';
import { bakeShared } from '../ui/bake';
import { fillShape } from '../ui/quiz-art';

export const GLYPH_HEX: Record<GlyphColor, number> = {
  turquoise: 0x3fd0c9,
  amber: 0xf3b23a,
  rust: 0xe0703f,
};

/** Piedra gris de las ruinas: luz, base y sombra. */
export const STONE = { light: 0x8f939c, base: 0x6f737c, dark: 0x4c5058, groove: 0x3b3e45 } as const;
export const GOLD = 0xd9a441;
export const GOLD_DARK = 0xa9782a;

/** Alfa de un grabado apagado: se ve, pero brilla más al encenderse. */
const DIM = 0.78;

export interface GlyphView {
  container: Phaser.GameObjects.Container;
  /** La parte de color, que se enciende. */
  glow: Phaser.GameObjects.Image;
}

/**
 * Grabado de `size` px de lado: el surco oscuro de la talla y, encima, la forma de color. Con varias
 * formas (series que crecen), en fila y más pequeñas. Se hornea en dos imágenes (surco y color).
 */
export function drawGlyph(scene: Phaser.Scene, glyph: Glyph, size: number): GlyphView {
  const n = Math.max(1, glyph.count);
  const cols = n <= 3 ? n : Math.ceil(n / 2);
  const rows = n <= 3 ? 1 : 2;
  const cell = Math.min(size / cols, size / rows / 0.95);
  const s = cell * (n === 1 ? 0.86 : 0.78);
  const draw = (g: Phaser.GameObjects.Graphics, color: number, grow: number, dy: number): void => {
    g.fillStyle(color);
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols);
      const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
      const c = i - r * cols;
      const x = (c - (inRow - 1) / 2) * cell;
      const y = (r - (rows - 1) / 2) * cell * 0.95;
      g.save();
      g.translateCanvas(x, y + dy);
      fillShape(g, glyph.shape, s + grow);
      g.restore();
    }
  };
  // Holgado: cada forma cabe en su celda y el surco baja 3 px. Los grabados iguales comparten textura.
  const rect = { x: -size * 0.6 - 4, y: -size * 0.6 - 4, width: size * 1.2 + 8, height: size * 1.2 + 12 };
  const id = `glyph-${glyph.shape}-${n}-${Math.round(size)}`;
  const groove = bakeShared(scene, `${id}-groove`, rect, (g) => draw(g, STONE.groove, 4, 3));
  const glow = bakeShared(scene, `${id}-${glyph.color}`, rect, (g) => draw(g, GLYPH_HEX[glyph.color], 0, 0)).setAlpha(DIM);
  return { container: scene.add.container(0, 0, [groove, glow]), glow };
}

/** Enciende un grabado: brilla del todo y da un pulso. */
export function lightGlyph(scene: Phaser.Scene, view: GlyphView, keep = false): void {
  view.glow.setAlpha(1);
  scene.tweens.add({ targets: view.container, scale: 1.18, duration: 140, yoyo: true });
  if (!keep) scene.time.delayedCall(420, () => view.glow.setAlpha(DIM));
}

/**
 * Bloque de piedra con borde dorado, centrado en (0, 0), para meter en el contenedor del bloque. Horneado
 * en una imagen.
 */
export function drawStoneBlock(scene: Phaser.Scene): Phaser.GameObjects.Image {
  const h = BLOCK_SIZE / 2;
  return bakeShared(scene, 'stone-block', { x: -h, y: -h, width: BLOCK_SIZE, height: BLOCK_SIZE + 6 }, (g) => {
    g.fillStyle(GOLD_DARK).fillRoundedRect(-h, -h + 6, BLOCK_SIZE, BLOCK_SIZE, 16);
    g.fillStyle(GOLD).fillRoundedRect(-h, -h, BLOCK_SIZE, BLOCK_SIZE, 16);
    g.fillStyle(STONE.base).fillRoundedRect(-h + 7, -h + 7, BLOCK_SIZE - 14, BLOCK_SIZE - 14, 11);
    g.fillStyle(STONE.light).fillRoundedRect(-h + 7, -h + 7, BLOCK_SIZE - 14, 10, { tl: 11, tr: 11, bl: 0, br: 0 });
  });
}
