import Phaser from 'phaser';
import { COLORS } from '../config';
import { RoundButton } from './round-button';
import { fixToCamera } from './widgets';

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

const MOVE_SIZE = 120;
const JUMP_SIZE = 168;
const MARGIN = 40;
const GAP = 24;

/**
 * Controles táctiles (izquierda, derecha, saltar) + teclado para probar en escritorio.
 * Zonas grandes y generosas: se detecta el dedo por posición, no por el botón dibujado,
 * así un toque ligeramente desviado sigue contando. El botón activo se ve hundido.
 */
export class TouchControls {
  private zones!: Record<keyof ControlState, Zone>;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private readonly keyA: Phaser.Input.Keyboard.Key | undefined;
  private readonly keyD: Phaser.Input.Keyboard.Key | undefined;
  private readonly keyW: Phaser.Input.Keyboard.Key | undefined;
  private readonly buttons: Record<keyof ControlState, RoundButton>;

  constructor(private readonly scene: Phaser.Scene) {
    const kb = scene.input.keyboard;
    this.cursors = kb?.createCursorKeys();
    this.keyA = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    const move = (icon: string): RoundButton =>
      new RoundButton(scene, 0, 0, {
        width: MOVE_SIZE,
        color: COLORS.white,
        shadowColor: COLORS.shadow,
        shadowDepth: 8,
        icon,
        iconSize: 56,
        interactive: false,
      });
    this.buttons = {
      left: move('icon-arrow-left'),
      right: move('icon-arrow-right'),
      jump: new RoundButton(scene, 0, 0, {
        width: JUMP_SIZE,
        color: COLORS.coral,
        shadowColor: COLORS.coralDark,
        shadowDepth: 10,
        icon: 'icon-arrow-up-white',
        iconSize: 84,
        interactive: false,
      }),
    };
    for (const b of Object.values(this.buttons)) fixToCamera(b.setDepth(100));
    this.layout(scene.scale.width, scene.scale.height);
  }

  /** Recoloca botones y zonas al cambiar el ancho lógico. */
  layout(width: number, height: number): void {
    const moveY = height - MARGIN - 10 - MOVE_SIZE / 2;
    const leftX = MARGIN + MOVE_SIZE / 2;
    const rightX = leftX + MOVE_SIZE + GAP;
    const jumpX = width - MARGIN - JUMP_SIZE / 2;
    const jumpY = height - MARGIN - 10 - JUMP_SIZE / 2;
    this.buttons.left.setPosition(leftX, moveY);
    this.buttons.right.setPosition(rightX, moveY);
    this.buttons.jump.setPosition(jumpX, jumpY);

    const split = leftX + (MOVE_SIZE + GAP) / 2;
    const moveTop = height * 0.45;
    this.zones = {
      left: { x: 0, y: moveTop, w: split, h: height - moveTop },
      right: { x: split, y: moveTop, w: rightX + MOVE_SIZE / 2 + 60 - split, h: height - moveTop },
      jump: { x: width * 0.66, y: height * 0.35, w: width * 0.34, h: height * 0.65 },
    };
  }

  read(): ControlState {
    const pointers = [this.scene.input.mousePointer, ...this.scene.input.manager.pointers];
    const down = (zone: Zone): boolean =>
      pointers.some((p) => p?.isDown && p.x >= zone.x && p.x <= zone.x + zone.w && p.y >= zone.y && p.y <= zone.y + zone.h);

    const state: ControlState = {
      left: down(this.zones.left) || !!this.cursors?.left.isDown || !!this.keyA?.isDown,
      right: down(this.zones.right) || !!this.cursors?.right.isDown || !!this.keyD?.isDown,
      jump:
        down(this.zones.jump) || !!this.cursors?.up.isDown || !!this.cursors?.space.isDown || !!this.keyW?.isDown,
    };
    this.buttons.left.setPressed(state.left);
    this.buttons.right.setPressed(state.right);
    this.buttons.jump.setPressed(state.jump);
    return state;
  }
}
