import Phaser from 'phaser';
import { GAME_H, GAME_W } from '../config';
import { TouchControls } from '../ui/touch-controls';

const WORLD_W = 1600;
const GROUND_TOP = GAME_H - 32;

const RUN_SPEED = 110;
const JUMP_SPEED = 330;
const COYOTE_MS = 100; // salto aunque ya haya dejado el borde
const BUFFER_MS = 120; // salto aunque se toque un poco antes de aterrizar

/**
 * Nivel de prueba de la fase 0: mover, saltar, golpear bloques desde abajo y llegar a la meta.
 * Todavía sin retos educativos (fase 2).
 */
export class LevelScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private controls!: TouchControls;
  private coinsText!: Phaser.GameObjects.Text;
  private coins = 0;
  private finished = false;

  private lastGrounded = 0;
  private jumpBufferedAt = -Infinity;
  private prevJump = false;

  constructor() {
    super('Level');
  }

  create(): void {
    this.coins = 0;
    this.finished = false;
    this.lastGrounded = 0;
    this.jumpBufferedAt = -Infinity;
    this.prevJump = false;

    this.physics.world.setBounds(0, 0, WORLD_W, GAME_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, GAME_H);

    this.buildBackground();
    this.buildGround();
    const blocks = this.buildBlocks();
    this.buildPlayer();
    this.buildGoal();

    this.physics.add.collider(this.player, blocks, (_p, block) => this.onBlockCollision(block as Phaser.Physics.Arcade.Image));

    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setDeadzone(40, 20);

    this.controls = new TouchControls(this, GAME_W, GAME_H);
    this.buildHud();
  }

  override update(time: number): void {
    if (this.finished) return;
    const input = this.controls.read();
    const body = this.player.body;

    if (body.blocked.down) this.lastGrounded = time;

    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.player.setVelocityX(dir * RUN_SPEED);
    if (dir !== 0) this.player.setFlipX(dir < 0);

    if (input.jump && !this.prevJump) this.jumpBufferedAt = time;
    this.prevJump = input.jump;

    const wantsJump = time - this.jumpBufferedAt <= BUFFER_MS;
    const canJump = time - this.lastGrounded <= COYOTE_MS;
    if (wantsJump && canJump) {
      this.player.setVelocityY(-JUMP_SPEED);
      this.jumpBufferedAt = -Infinity;
      this.lastGrounded = -Infinity;
    }
    // Salto variable: soltar pronto = salto más corto.
    if (!input.jump && body.velocity.y < -140) this.player.setVelocityY(body.velocity.y * 0.6);
  }

  private buildBackground(): void {
    for (let x = 60; x < WORLD_W; x += 260) {
      this.add.image(x, 40 + ((x / 7) % 30), 'cloud').setScrollFactor(0.3);
    }
    for (let x = 100; x < WORLD_W; x += 380) {
      this.add.image(x, GROUND_TOP - 20, 'hill').setScrollFactor(0.6);
    }
  }

  private buildGround(): void {
    const ground = this.add.tileSprite(WORLD_W / 2, GROUND_TOP + 16, WORLD_W, 32, 'ground');
    this.physics.add.existing(ground, true);
    this.groundBody = ground;
  }
  private groundBody!: Phaser.GameObjects.TileSprite;

  private buildBlocks(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    const xs = [220, 252, 284, 620, 652, 900, 932, 964, 1000, 1240];
    for (const x of xs) {
      const y = x > 800 && x < 1100 ? GROUND_TOP - 70 : GROUND_TOP - 52;
      const block = group.create(x, y, 'block') as Phaser.Physics.Arcade.Image;
      this.add.text(x, y, '?', { fontFamily: 'monospace', fontSize: '12px', color: '#8f4f00' }).setOrigin(0.5).setName(`q-${x}`);
      block.setData('qx', x);
    }
    return group;
  }

  private buildPlayer(): void {
    this.player = this.physics.add.sprite(150, GROUND_TOP - 30, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(12, 22);
    this.player.setMaxVelocity(300, 600);
    this.physics.add.collider(this.player, this.groundBody);
  }

  private buildGoal(): void {
    const flag = this.add.image(WORLD_W - 100, GROUND_TOP - 20, 'flag');
    const zone = this.add.zone(WORLD_W - 100, GROUND_TOP - 20, 24, 40);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => this.onGoal());
    flag.setDepth(1);
  }

  private onBlockCollision(block: Phaser.Physics.Arcade.Image): void {
    if (!this.player.body.touching.up || block.getData('used')) return;
    block.setData('used', true);
    block.setTexture('block-used');

    const label = this.children.getByName(`q-${block.getData('qx') as number}`);
    label?.destroy();

    this.tweens.add({ targets: block, y: block.y - 4, duration: 80, yoyo: true });
    const coin = this.add.image(block.x, block.y - 12, 'coin');
    this.tweens.add({ targets: coin, y: coin.y - 30, alpha: 0, duration: 450, onComplete: () => coin.destroy() });

    this.coins += 1;
    this.coinsText.setText(`x${this.coins}`);
  }

  private onGoal(): void {
    if (this.finished) return;
    this.finished = true;
    this.player.setVelocity(0, 0);
    const msg = this.add
      .text(GAME_W / 2, GAME_H / 2 - 20, '¡Muy bien!', { fontFamily: 'monospace', fontSize: '28px', color: '#ffffff', stroke: '#2b2340', strokeThickness: 4 })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200);
    this.tweens.add({ targets: msg, scale: 1.15, duration: 300, yoyo: true, repeat: 2 });
    this.time.delayedCall(2500, () => this.scene.restart());
  }

  private buildHud(): void {
    this.add.image(16, 14, 'coin').setScrollFactor(0).setDepth(100);
    this.coinsText = this.add
      .text(26, 14, 'x0', { fontFamily: 'monospace', fontSize: '12px', color: '#ffffff', stroke: '#2b2340', strokeThickness: 3 })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }
}
