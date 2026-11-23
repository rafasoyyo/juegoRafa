import Phaser from 'phaser';

/**
 * Genera el arte PROVISIONAL por código (sin archivos).
 * El personaje es un placeholder: el juego no depende de quién sea.
 * Se sustituye por sprites propios en public/assets/ cuando estén listos.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.makeTexture('ground', 16, 16, (g) => {
      g.fillStyle(0xc8662a).fillRect(0, 0, 16, 16);
      g.fillStyle(0x8f3f14).fillRect(0, 7, 16, 1).fillRect(0, 15, 16, 1).fillRect(7, 0, 1, 8).fillRect(3, 8, 1, 8).fillRect(11, 8, 1, 8);
    });
    this.makeTexture('block', 16, 16, (g) => {
      g.fillStyle(0xffc83c).fillRect(0, 0, 16, 16);
      g.fillStyle(0xc88c14).fillRect(0, 0, 16, 1).fillRect(0, 15, 16, 1).fillRect(0, 0, 1, 16).fillRect(15, 0, 1, 16);
    });
    this.makeTexture('block-used', 16, 16, (g) => {
      g.fillStyle(0x9a7a4a).fillRect(0, 0, 16, 16);
      g.fillStyle(0x6b5230).fillRect(0, 0, 16, 1).fillRect(0, 15, 16, 1).fillRect(0, 0, 1, 16).fillRect(15, 0, 1, 16);
    });
    this.makeTexture('player', 14, 22, (g) => {
      // Niño original: cabeza grande, pelo castaño, camiseta verde, pantalón azul.
      g.fillStyle(0x3fa652).fillRect(3, 11, 8, 5); // camiseta
      g.fillStyle(0xffd2a1).fillRect(1, 12, 2, 4).fillRect(11, 12, 2, 4); // brazos
      g.fillStyle(0x2f6fe0).fillRect(3, 16, 8, 4); // pantalón
      g.fillStyle(0x6b3a1a).fillRect(2, 20, 4, 2).fillRect(8, 20, 4, 2); // zapatillas
      g.fillStyle(0xffd2a1).fillRect(2, 2, 10, 9); // cabeza
      g.fillStyle(0x6b3a1a).fillRect(2, 0, 10, 3).fillRect(2, 3, 2, 3); // pelo
      g.fillStyle(0x2b2340).fillRect(8, 6, 2, 2); // ojo
      g.fillStyle(0xff8f8f).fillRect(10, 8, 1, 1); // mejilla
    });
    this.makeTexture('coin', 8, 10, (g) => {
      g.fillStyle(0xffd23f).fillRect(1, 0, 6, 10).fillRect(0, 2, 8, 6);
    });
    this.makeTexture('cloud', 48, 20, (g) => {
      g.fillStyle(0xffffff).fillRect(6, 8, 36, 10).fillRect(12, 2, 14, 8).fillRect(24, 4, 12, 6);
    });
    this.makeTexture('hill', 96, 40, (g) => {
      g.fillStyle(0x3fa652);
      for (let y = 0; y < 40; y++) {
        const half = 8 + y * 1.1;
        g.fillRect(48 - half, y, half * 2, 1);
      }
    });
    this.makeTexture('flag', 24, 40, (g) => {
      g.fillStyle(0xffffff).fillRect(2, 0, 2, 40);
      g.fillStyle(0xff6b5e).fillRect(4, 2, 18, 12);
    });

    this.scene.start('Level');
  }

  private makeTexture(key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
