import Phaser from 'phaser';
import { COLORS, MAX_W } from '../config';
import { session } from '../state';
import { drawFox } from '../ui/characters';
import { RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { addClouds, addSky, drawGround, drawHills } from '../ui/widgets';

const GROUND_TOP = 600;

/** Pantalla de inicio: el zorro y un botón grande de jugar. Cualquier toque abre el mapa. */
export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create(): void {
    enter(this);
    this.build(this.scale.width);
    onResize(this, (w) => {
      this.tweens.killAll();
      this.children.removeAll(true);
      this.build(w);
    });
    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => this.start());
  }

  private build(width: number): void {
    addSky(this);
    addClouds(this, 140, MAX_W, 430, 1);
    drawHills(this, GROUND_TOP, -100, MAX_W + 400, 760, COLORS.hillLight);
    drawHills(this, GROUND_TOP + 30, 200, MAX_W + 400, 820, COLORS.hill);
    this.add.image(width * 0.9, GROUND_TOP + 4, 'tree').setOrigin(0.5, 1).setScale(1.4);
    drawGround(this, 0, MAX_W, GROUND_TOP);

    const fox = drawFox(this, width * 0.32, GROUND_TOP + 10, 'idle', session.hat, 340);
    this.tweens.add({ targets: fox, scaleY: 1.03, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const play = new RoundButton(this, width * 0.66, 330, {
      width: 260,
      height: 170,
      radius: 85,
      color: COLORS.coral,
      shadowColor: COLORS.coralDark,
      shadowDepth: 12,
      icon: 'icon-play-white',
      iconSize: 110,
      onTap: () => this.start(),
    });
    this.tweens.add({ targets: play, scale: 1.06, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private start(): void {
    unlockAudio(this);
    goTo(this, 'Map');
  }
}

/** Desbloquea el audio (iOS) dentro del gesto del primer toque. */
function unlockAudio(scene: Phaser.Scene): void {
  const sound = scene.sound as Partial<Phaser.Sound.WebAudioSoundManager>;
  const ctx = sound.context;
  if (ctx && ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
}
