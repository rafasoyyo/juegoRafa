import Phaser from 'phaser';

export interface ControlState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Controles táctiles (izquierda, derecha, saltar) + teclado para probar en escritorio.
 * Zonas grandes y generosas: se detecta el dedo por posición, no por el sprite del botón,
 * así un toque ligeramente desviado sigue contando.
 */
export class TouchControls {
  private readonly zones: Record<keyof ControlState, Zone>;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private readonly keyA: Phaser.Input.Keyboard.Key | undefined;
  private readonly keyD: Phaser.Input.Keyboard.Key | undefined;
  private readonly keyW: Phaser.Input.Keyboard.Key | undefined;
  private readonly buttons: Phaser.GameObjects.Image[] = [];

  constructor(private readonly scene: Phaser.Scene, width: number, height: number) {
    this.zones = {
      left: { x: 0, y: height * 0.45, w: width * 0.17, h: height * 0.55 },
      right: { x: width * 0.17, y: height * 0.45, w: width * 0.17, h: height * 0.55 },
      jump: { x: width * 0.66, y: height * 0.35, w: width * 0.34, h: height * 0.65 },
    };

    const kb = scene.input.keyboard;
    this.cursors = kb?.createCursorKeys();
    this.keyA = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.drawButtons(width, height);
  }

  read(): ControlState {
    const pointers = [this.scene.input.mousePointer, ...this.scene.input.manager.pointers];
    const down = (zone: Zone): boolean =>
      pointers.some((p) => p.isDown && p.x >= zone.x && p.x <= zone.x + zone.w && p.y >= zone.y && p.y <= zone.y + zone.h);

    const state: ControlState = {
      left: down(this.zones.left) || !!this.cursors?.left.isDown || !!this.keyA?.isDown,
      right: down(this.zones.right) || !!this.cursors?.right.isDown || !!this.keyD?.isDown,
      jump:
        down(this.zones.jump) || !!this.cursors?.up.isDown || !!this.cursors?.space.isDown || !!this.keyW?.isDown,
    };
    this.buttons[0]?.setAlpha(state.left ? 0.95 : 0.55);
    this.buttons[1]?.setAlpha(state.right ? 0.95 : 0.55);
    this.buttons[2]?.setAlpha(state.jump ? 0.95 : 0.55);
    return state;
  }

  private drawButtons(width: number, height: number): void {
    const make = (key: string, size: number, draw: (g: Phaser.GameObjects.Graphics) => void): void => {
      const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
      draw(g);
      g.generateTexture(key, size, size);
      g.destroy();
    };
    make('btn-left', 44, (g) => {
      g.fillStyle(0xffffff).fillCircle(22, 22, 22);
      g.fillStyle(0x2b2340).fillTriangle(28, 10, 28, 34, 12, 22);
    });
    make('btn-right', 44, (g) => {
      g.fillStyle(0xffffff).fillCircle(22, 22, 22);
      g.fillStyle(0x2b2340).fillTriangle(16, 10, 16, 34, 32, 22);
    });
    make('btn-jump', 64, (g) => {
      g.fillStyle(0xff6b5e).fillCircle(32, 32, 32);
      g.fillStyle(0xffffff).fillTriangle(32, 14, 14, 38, 50, 38).fillRect(26, 36, 12, 14);
    });

    const add = (key: string, x: number, y: number): void => {
      const img = this.scene.add.image(x, y, key).setScrollFactor(0).setDepth(100).setAlpha(0.55);
      this.buttons.push(img);
    };
    add('btn-left', 36, height - 34);
    add('btn-right', 36 + 56, height - 34);
    add('btn-jump', width - 48, height - 42);
  }
}
