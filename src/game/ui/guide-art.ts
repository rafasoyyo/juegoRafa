import Phaser from 'phaser';
import { COLORS, INK_CSS, FONT } from '../config';

/** Lápiz con «Aa» en un círculo: «escribe las letras». Centro en (x, y). Dibujo propio del proyecto. */
export function pencilIcon(scene: Phaser.Scene, x: number, y: number, size = 84): Phaser.GameObjects.Container {
  const r = size / 2;
  const g = scene.add.graphics();
  g.fillStyle(COLORS.yellow).fillCircle(0, 0, r);
  // Lápiz inclinado: cuerpo, goma y punta.
  const pencil = scene.add.graphics();
  pencil.fillStyle(COLORS.coral).fillRoundedRect(-7, -r * 0.62, 14, r * 0.78, 4);
  pencil.fillStyle(COLORS.purple).fillRoundedRect(-7, -r * 0.62, 14, 9, 4);
  pencil.fillStyle(0xf6d7b0).fillTriangle(-7, r * 0.16, 7, r * 0.16, 0, r * 0.46);
  pencil.fillStyle(COLORS.ink).fillTriangle(-2.5, r * 0.36, 2.5, r * 0.36, 0, r * 0.46);
  pencil.setAngle(35).setPosition(r * 0.3, r * 0.08);
  const aa = scene.add
    .text(-r * 0.3, -r * 0.05, 'Aa', { fontFamily: FONT, fontStyle: '800', fontSize: `${Math.round(size * 0.36)}px`, color: INK_CSS, padding: { top: 2, bottom: 2 } })
    .setOrigin(0.5);
  return scene.add.container(x, y, [g, aa, pencil]);
}

/** Tarta con tres velas: «tu edad». Centro en (x, y). Dibujo propio del proyecto. */
export function cakeIcon(scene: Phaser.Scene, x: number, y: number, size = 72): Phaser.GameObjects.Container {
  const w = size;
  const g = scene.add.graphics();
  // Base y glaseado.
  g.fillStyle(COLORS.coral).fillRoundedRect(-w / 2, -2, w, w * 0.45, 10);
  g.fillStyle(COLORS.white).fillRoundedRect(-w / 2, -w * 0.16, w, w * 0.2, 9);
  // Velas con llama.
  [-w * 0.26, 0, w * 0.26].forEach((cx) => {
    g.fillStyle(COLORS.purple).fillRoundedRect(cx - 4, -w * 0.46, 8, w * 0.3, 3);
    g.fillStyle(COLORS.yellow).fillEllipse(cx, -w * 0.55, 10, 15);
  });
  return scene.add.container(x, y - w * 0.1, [g]);
}

/** Flecha que rebota señalando un punto. `dir` es hacia dónde apunta. */
export function bouncingArrow(scene: Phaser.Scene, x: number, y: number, dir: 'down' | 'up'): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.coral).fillRoundedRect(-9, -34, 18, 34, 6).fillTriangle(-26, 0, 26, 0, 0, 30);
  g.setPosition(x, y).setAngle(dir === 'down' ? 0 : 180);
  const sign = dir === 'down' ? 1 : -1;
  scene.tweens.add({ targets: g, y: y + sign * 14, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  return g;
}
