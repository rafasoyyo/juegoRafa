import Phaser from 'phaser';
import { COLORS, GAME_H, MAX_W } from '../config';
import { LEVEL_COUNT, session } from '../state';
import { drawLalo, FOX_UNITS, makeHat, placeHat, type FoxPose } from '../ui/characters';
import { RoundButton } from '../ui/round-button';
import { TouchControls } from '../ui/touch-controls';
import {
  FOOT_RX,
  FOOT_RY,
  footPath,
  GHOSTS,
  HIPS,
  initialRun,
  LEG_WIDTH,
  legFeet,
  RUN_COLORS,
  stepRun,
  wheelMix,
  type FootPoint,
  type RunState,
} from '../ui/run-cycle';
import { enter, goTo, onResize } from '../ui/transition';
import { addClouds, addSky, bump, coinCounter, drawGround, drawHills, fixToCamera, type CoinCounter } from '../ui/widgets';

// Recorrido y físicas de la fase 0 escalados ×3,2 (de 225 a 720 px de alto).
const SCALE = 3.2;
const WORLD_W = 1600 * SCALE;
const GROUND_TOP = 620;
const START_X = 150 * SCALE;
const FLAG_X = WORLD_W - 100 * SCALE;
const BLOCK_SIZE = 84;
/** Posiciones x de los bloques «?» (datos del nivel hasta los niveles en JSON de la fase 4). */
const BLOCKS: readonly { x: number; high: boolean }[] = [220, 252, 284, 620, 652, 900, 932, 964, 1000, 1240].map((x) => ({
  x: Math.round(x * SCALE),
  high: x > 800 && x < 1100,
}));

const RUN_SPEED = 110 * SCALE;
const JUMP_SPEED = 330 * SCALE;
const VARIABLE_JUMP_MIN = 140 * SCALE;
const MAX_VELOCITY = { x: 300 * SCALE, y: 600 * SCALE };
const COYOTE_MS = 100; // salto aunque ya haya dejado el borde
const BUFFER_MS = 120; // salto aunque se toque un poco antes de aterrizar

const FOX_SIZE = 120;
const CELEBRATE_MS = 1200;
const HUD_DEPTH = 100;

/** Altura del suelo en unidades del zorro respecto a la base de su textura (la caja acaba en 117). */
const FOX_GROUND_Y = -3;
/** Inclinación hacia delante con las piernas en rueda, en grados. */
const RUN_LEAN_DEG = 10;
/** Polvo al correr en rueda. */
const DUST_POOL = 6;
const DUST_EVERY_MS = 90;
const DUST_LIFE_MS = 350;

interface LevelData {
  level?: number;
}

/**
 * Nivel de plataformas: mover, saltar, golpear bloques «?» desde abajo y llegar a la bandera.
 * Todavía sin retos educativos (fase 2): los 6 niveles del mapa usan este mismo recorrido.
 */
export class LevelScene extends Phaser.Scene {
  private level = 1;
  private fox!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private hat!: Phaser.GameObjects.Image;
  private controls!: TouchControls;
  private coins = 0;
  private blocksHit = 0;
  private finished = false;
  private pose: FoxPose = 'idle';
  private faceLeft = false;

  private lastGrounded = 0;
  private jumpBufferedAt = -Infinity;
  private prevJump = false;
  private wasGrounded = true;
  private fallSpeed = 0;
  private squash = { amount: 0 };
  private nextHopAt = 0;
  private run: RunState = initialRun();
  private legs!: Phaser.GameObjects.Graphics;
  private dust: Phaser.GameObjects.Image[] = [];
  private nextDustAt = 0;

  private home!: RoundButton;
  private progress!: { container: Phaser.GameObjects.Container; fill: Phaser.GameObjects.Graphics; face: Phaser.GameObjects.Image; barW: number };
  private counter!: CoinCounter;

  constructor() {
    super('Level');
  }

  init(data: LevelData): void {
    this.level = Phaser.Math.Clamp(data?.level ?? 1, 1, LEVEL_COUNT);
    this.coins = 0;
    this.blocksHit = 0;
    this.finished = false;
    this.pose = 'idle';
    this.faceLeft = false;
    this.lastGrounded = 0;
    this.jumpBufferedAt = -Infinity;
    this.prevJump = false;
    this.wasGrounded = true;
    this.fallSpeed = 0;
    this.squash = { amount: 0 };
    this.run = initialRun();
    this.dust = [];
    this.nextDustAt = 0;
  }

  create(): void {
    enter(this);
    this.physics.world.setBounds(0, 0, WORLD_W, GAME_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, GAME_H);

    this.buildScenery();
    const ground = this.add.zone(WORLD_W / 2, GROUND_TOP + 50, WORLD_W, 100);
    this.physics.add.existing(ground, true);
    const blocks = this.buildBlocks();
    this.buildFox();
    this.buildGoal();

    this.physics.add.collider(this.fox, ground);
    this.physics.add.collider(this.fox, blocks, (_f, block) => this.onBlockCollision(block as Phaser.Physics.Arcade.Image));

    this.cameras.main.startFollow(this.fox, true, 0.15, 0.15);
    this.cameras.main.setDeadzone(40 * SCALE, 20 * SCALE);

    this.controls = new TouchControls(this);
    this.buildHud();
    this.layout(this.scale.width, this.scale.height);
    onResize(this, (w, h) => this.layout(w, h));
  }

  override update(time: number, delta: number): void {
    const body = this.fox.body;
    const grounded = body.blocked.down || body.touching.down;

    if (this.finished) {
      this.fox.setVelocityX(0);
      if (grounded && time >= this.nextHopAt) {
        this.fox.setVelocityY(-JUMP_SPEED * 0.5);
        this.nextHopAt = time + 450;
      }
      this.animateFox(time, delta, grounded, 0);
      return;
    }

    const input = this.controls.read();
    if (grounded) this.lastGrounded = time;

    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.fox.setVelocityX(dir * RUN_SPEED);
    if (dir !== 0) this.faceLeft = dir < 0;

    if (input.jump && !this.prevJump) this.jumpBufferedAt = time;
    this.prevJump = input.jump;

    const wantsJump = time - this.jumpBufferedAt <= BUFFER_MS;
    const canJump = time - this.lastGrounded <= COYOTE_MS;
    if (wantsJump && canJump) {
      this.fox.setVelocityY(-JUMP_SPEED);
      this.jumpBufferedAt = -Infinity;
      this.lastGrounded = -Infinity;
    }
    // Salto variable: soltar pronto = salto más corto.
    if (!input.jump && body.velocity.y < -VARIABLE_JUMP_MIN) this.fox.setVelocityY(body.velocity.y * 0.6);

    this.animateFox(time, delta, grounded, dir);
    this.updateProgress();
  }

  /**
   * Poses, carrera con piernas que pasan de zancadas a rueda, estiramiento al saltar,
   * aplastamiento al aterrizar y respiración.
   */
  private animateFox(time: number, delta: number, grounded: boolean, dir: number): void {
    const vy = this.fox.body.velocity.y;
    if (grounded && !this.wasGrounded && this.fallSpeed > 300) this.squashFox(1);
    this.wasGrounded = grounded;
    if (!grounded) this.fallSpeed = Math.max(0, vy);

    const running = dir !== 0;
    this.run = stepRun(this.run, delta, { running, grounded, finished: this.finished });
    const mix = wheelMix(this.run.intensity);

    const pose: FoxPose = this.finished ? 'celebrate' : !grounded ? 'jump' : running ? 'run' : 'idle';
    if (pose !== this.pose) {
      // Al frenar, el cuerpo baja a la pose quieta: un aplastamiento lo convierte en un frenazo.
      if (this.pose === 'run' && pose === 'idle') this.squashFox(0.5);
      this.pose = pose;
      this.fox.setTexture(`fox-${pose}`);
    }

    const dirSign = this.faceLeft ? -1 : 1;
    let sx = 1;
    let sy = 1;
    let angle = 0;
    if (!grounded) {
      const rising = vy < 0;
      sx = rising ? 0.92 : 0.97;
      sy = rising ? 1.09 : 1.03;
    } else if (pose === 'run') {
      const stride = Math.sin(this.run.phase * Math.PI * 2);
      angle = stride * 6 * (1 - mix) + dirSign * RUN_LEAN_DEG * mix;
      // Mismo rebote que el antiguo balanceo: la caja de Arcade escala con el sprite.
      sy = 1 + Math.abs(stride) * 0.03;
    } else {
      const breath = Math.sin(time * 0.004);
      sy = 1 + breath * 0.025;
      sx = 1 - breath * 0.01;
    }
    const q = this.squash.amount;
    this.fox.setScale(sx * (1 + 0.18 * q), sy * (1 - 0.18 * q));
    this.fox.setAngle(angle);
    // El dibujo mira de frente con la cola a la derecha: para ir a la derecha, la cola va detrás.
    this.fox.setFlipX(!this.faceLeft);
    placeHat(this.hat, this.fox, this.pose, this.faceLeft);

    this.drawLegs(pose === 'run', mix, dirSign);
    if (pose === 'run' && mix > 0.5 && time >= this.nextDustAt) {
      this.puffDust(dirSign);
      this.nextDustAt = time + DUST_EVERY_MS;
    }
  }

  private squashFox(amount: number): void {
    this.tweens.killTweensOf(this.squash);
    this.squash.amount = amount;
    this.tweens.add({ targets: this.squash, amount: 0, duration: 180, ease: 'Quad.easeOut' });
  }

  /**
   * Piernas en el espacio local del zorro: «delante» es +x y el suelo está en `FOX_GROUND_Y`.
   * Con `mix` 0 se ven dos piernas nítidas; con 1, una rueda borrosa de pies con estela y líneas
   * de velocidad.
   */
  private drawLegs(visible: boolean, mix: number, dirSign: number): void {
    const g = this.legs.clear();
    g.setVisible(visible);
    if (!visible) return;
    const u = this.fox.displayHeight / FOX_UNITS / Math.abs(this.fox.scaleY);
    g.setPosition(this.fox.x, this.fox.y)
      .setRotation(this.fox.rotation)
      .setScale(dirSign * u * this.fox.scaleX, u * this.fox.scaleY);

    const { phase, intensity } = this.run;
    const y0 = FOX_GROUND_Y;
    const foot = (f: FootPoint, alpha: number): void => {
      g.fillStyle(RUN_COLORS.foot, alpha).fillEllipse(f.x + 2, y0 + f.y - FOOT_RY, FOOT_RX * 2, FOOT_RY * 2);
    };
    const leg = (hip: { x: number; y: number }, f: FootPoint, alpha: number): void => {
      g.lineStyle(LEG_WIDTH, RUN_COLORS.leg, alpha).lineBetween(hip.x, y0 + hip.y, f.x, y0 + f.y - FOOT_RY);
      g.fillStyle(RUN_COLORS.leg, alpha).fillCircle(f.x, y0 + f.y - FOOT_RY, LEG_WIDTH / 2);
    };

    if (mix > 0) {
      // Líneas de velocidad detrás del cuerpo.
      for (const [i, ly] of [-36, -52, -68].entries()) {
        const len = 20 + Math.random() * 16 + i * 4;
        const lx = -40 - i * 4;
        g.lineStyle(5, RUN_COLORS.speedLine, 0.2 * mix).lineBetween(lx, y0 + ly, lx - len, y0 + ly);
      }
      // Rueda: borrón naranja de piernas (arcos que giran) y estela de pies fantasma.
      const path = footPath(intensity);
      const cx = path.dx;
      const cy = y0 + path.cy - FOOT_RY;
      const rx = path.rx + 6;
      const ry = path.ry;
      g.fillStyle(RUN_COLORS.leg, 0.28 * mix).fillEllipse(cx, cy, rx * 2, ry * 2);
      const spin = phase * Math.PI * 2;
      for (let k = 0; k < 3; k++) {
        const a0 = spin + (k * Math.PI * 2) / 3;
        g.lineStyle(5, RUN_COLORS.leg, 0.75 * mix).beginPath();
        for (let t = 0; t <= 8; t++) {
          const a = a0 - (t / 8) * 1.3;
          const px = cx + rx * 0.85 * Math.cos(a);
          const py = cy + ry * 0.85 * Math.sin(a);
          if (t === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.strokePath();
      }
      for (const ghost of GHOSTS) {
        for (const f of legFeet(phase - ghost.lag, intensity)) foot(f, ghost.alpha * mix);
      }
    }
    const feet = legFeet(phase, intensity);
    const legAlpha = 1 - 0.65 * mix;
    feet.forEach((f, i) => leg(HIPS[i]!, f, legAlpha));
    for (const f of feet) foot(f, 1 - 0.3 * mix);
  }

  /** Suelta una mota de polvo del pool en el pie trasero, que crece y se desvanece. */
  private puffDust(dirSign: number): void {
    const mote = this.dust.find((d) => !d.active);
    if (!mote) return;
    this.tweens.killTweensOf(mote);
    const x = this.fox.x - dirSign * (14 + Math.random() * 10);
    const y = this.fox.y + FOX_GROUND_Y - 4;
    mote.setActive(true).setVisible(true).setPosition(x, y).setScale(0.35).setAlpha(0.85);
    this.tweens.add({
      targets: mote,
      x: x - dirSign * 18,
      y: y - 10,
      scale: 0.9,
      alpha: 0,
      duration: DUST_LIFE_MS,
      ease: 'Quad.easeOut',
      onComplete: () => mote.setActive(false).setVisible(false),
    });
  }

  private buildScenery(): void {
    addSky(this);
    addClouds(this, 120, WORLD_W * 0.3 + MAX_W, 520, 0.3);
    drawHills(this, GROUND_TOP, -200, WORLD_W * 0.45 + MAX_W, 900, COLORS.hillLight, 0.45);
    drawHills(this, GROUND_TOP + 30, -200, WORLD_W * 0.6 + MAX_W, 800, COLORS.hill, 0.6, 420);
    drawGround(this, 0, WORLD_W, GROUND_TOP);
  }

  private buildBlocks(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    for (const { x, high } of BLOCKS) {
      const bottom = GROUND_TOP - (high ? 62 : 44) * SCALE;
      group.create(x, bottom - BLOCK_SIZE / 2, 'block');
    }
    return group;
  }

  private buildFox(): void {
    this.fox = this.physics.add.sprite(START_X, GROUND_TOP - 2, 'fox-idle').setOrigin(0.5, 1);
    this.fox.body.setSize(56, 87, false).setOffset(32, 30);
    this.fox.setCollideWorldBounds(true);
    this.fox.setMaxVelocity(MAX_VELOCITY.x, MAX_VELOCITY.y);
    this.fox.setDepth(10);
    this.legs = this.add.graphics().setDepth(9).setVisible(false);
    for (let i = 0; i < DUST_POOL; i++) {
      this.dust.push(this.add.image(0, 0, 'dust').setDepth(8).setActive(false).setVisible(false));
    }
    this.hat = makeHat(this, session.hat, FOX_SIZE).setDepth(11);
    placeHat(this.hat, this.fox, 'idle', false);
  }

  private buildGoal(): void {
    this.add.image(FLAG_X, GROUND_TOP + 4, 'flag').setOrigin(0.1, 1).setDepth(5);
    const zone = this.add.zone(FLAG_X, GROUND_TOP - 20 * SCALE, 24 * SCALE, 40 * SCALE);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.fox, zone, () => this.onGoal());
  }

  private onBlockCollision(block: Phaser.Physics.Arcade.Image): void {
    if (this.finished || !this.fox.body.touching.up || block.getData('used')) return;
    block.setData('used', true);
    block.setTexture('block-used');
    this.tweens.add({ targets: block, y: block.y - 14, duration: 80, yoyo: true });

    const coin = this.add.image(block.x, block.y - BLOCK_SIZE / 2 - 20, 'coin').setDepth(6);
    this.tweens.add({ targets: coin, y: coin.y - 110, alpha: 0, duration: 520, ease: 'Quad.easeOut', onComplete: () => coin.destroy() });

    this.blocksHit += 1;
    this.coins += 1;
    this.counter.setValue(this.coins);
    this.layout(this.scale.width, this.scale.height);
    bump(this, this.counter.container);
  }

  private onGoal(): void {
    if (this.finished) return;
    this.finished = true;
    this.fox.setVelocity(0, Math.min(this.fox.body.velocity.y, 0));
    this.nextHopAt = this.time.now + 120;
    this.controls.read();
    this.updateProgress(1);
    this.time.delayedCall(CELEBRATE_MS, () =>
      goTo(this, 'LevelComplete', {
        level: this.level,
        blocksHit: this.blocksHit,
        blocksTotal: BLOCKS.length,
        coins: this.coins,
      }),
    );
  }

  private buildHud(): void {
    this.home = new RoundButton(this, 0, 0, {
      width: 96,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-home',
      iconSize: 48,
      onTap: () => {
        if (!this.finished) goTo(this, 'Map');
      },
    });

    const barW = 300;
    const pillW = barW + 32 + 60;
    const container = this.add.container(0, 0);
    const pill = this.add.graphics();
    pill.fillStyle(COLORS.shadow).fillRoundedRect(-pillW / 2, -36 + 6, pillW, 72, 36);
    pill.fillStyle(COLORS.white).fillRoundedRect(-pillW / 2, -36, pillW, 72, 36);
    const barX = -pillW / 2 + 24;
    pill.fillStyle(0xe3eaf2).fillRoundedRect(barX, -8, barW, 16, 8);
    const fill = this.add.graphics();
    const flag = this.add.image(barX + barW + 34, 0, 'icon-flag').setDisplaySize(44, 44);
    const face = this.add.image(barX, 0, 'icon-fox-face').setDisplaySize(46, 46);
    container.add([pill, fill, flag, face]);
    container.setData('barX', barX);
    this.progress = { container, fill, face, barW };

    this.counter = coinCounter(this, 0, 0, 0);
    const lalo = drawLalo(this, 32, 140);

    for (const obj of [this.home, container, this.counter.container, lalo]) fixToCamera(obj.setDepth(HUD_DEPTH));
    this.updateProgress();
  }

  private updateProgress(force?: number): void {
    const t = force ?? Phaser.Math.Clamp((this.fox.x - START_X) / (FLAG_X - START_X), 0, 1);
    const barX = this.progress.container.getData('barX') as number;
    const w = Math.max(16, this.progress.barW * t);
    this.progress.fill.clear().fillStyle(COLORS.grass).fillRoundedRect(barX, -8, w, 16, 8);
    this.progress.face.x = barX + this.progress.barW * t;
  }

  /** Ancla el HUD y los controles a los bordes cuando cambia el ancho lógico. */
  private layout(width: number, height: number): void {
    this.home.setPosition(32 + 48, 28 + 48);
    this.progress.container.setPosition(width / 2, 28 + 48);
    this.counter.container.setPosition(width - 32 - this.counter.width / 2, 28 + 48);
    this.controls.layout(width, height);
  }
}
