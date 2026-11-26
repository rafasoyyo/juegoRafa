import Phaser from 'phaser';
import { bridgeChallenge, type BridgeChallenge } from '../../learning/challenges/bridge';
import { countChallenge, countRange, type CountChallenge } from '../../learning/challenges/count-blocks';
import { tally } from '../../learning/challenges/ladder';
import { ageBand } from '../../learning/quiz/age';
import { createRng } from '../../learning/quiz/rng';
import { audio } from '../audio/audio-engine';
import { BridgeChallengeView, bridgeHole } from '../challenges/bridge-challenge-view';
import type { ChallengeView } from '../challenges/challenge-view';
import { CountChallengeView } from '../challenges/count-challenge-view';
import { LaloFlyer } from '../challenges/lalo-flyer';
import { COLORS, GAME_H } from '../config';
import { courseFor, layoutEnemies } from '../enemies/enemy-layout';
import { overlaps } from '../enemies/enemy-motion';
import { createEnemyView, type EnemyView } from '../enemies/enemy-views';
import { BLOCK_SIZE, GROUND_TOP, JUMP_SPEED, KNOCK_VY, MAX_VELOCITY, SCALE } from '../level-course';
import { AMBIENTS, type Ambient } from '../levels/ambients';
import { toWorld } from '../levels/parse';
import {
  CONES_PER_TILE,
  exitSide,
  groundSpans,
  lipNudge,
  nudgeOffSpikes,
  PIT_DEPTH,
  PIT_TIP,
  pitUnder,
  reboundVelocity,
  SPIKE_CONE_H,
  SPIKE_PLATE_H,
  STEEL,
} from '../levels/spikes';
import { RUN_SPEED, TILE, type WorldLevel, type WorldSpike } from '../levels/types';
import { FRUIT_SIZE, FRUIT_VX, FRUIT_VY, loseCookie, pickFruitBlock, powerPhase, type PowerPhase } from '../power/power';
import { activeAge } from '../profile/active';
import { session } from '../state';
import { clampLevel, levelData, showWorld, worldDef } from '../worlds/registry';
import type { WorldDef, WorldId } from '../worlds/types';
import type { QuizData } from './QuizScene';
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
import { addScenery, bump, cookieCounter, drawPlatform, drawStep, fixToCamera, type CookieCounter } from '../ui/widgets';

const VARIABLE_JUMP_MIN = 140 * SCALE;
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

/** Pinchazo (enemigo o pinchos): sin control, protegido (parpadeando) y ritmo del parpadeo. */
const KNOCK_MS = 300;
const PROTECT_MS = 1000;
const BLINK_MS = 80;
const BLINK_ALPHA = 0.35;
/** Brinco del pinchazo de un enemigo: alto y corto hacia atrás (la subida es `KNOCK_VY`). */
const KNOCK_VX = 0.6 * RUN_SPEED;
/** Remaches de la placa del fondo del foso: separación y radio. */
const RIVET_EVERY = 28;
const RIVET_R = 2;
/** Velocidad con que el borde recoloca a Rufo hacia el suelo firme si se para casi sobre el hueco. */
const LIP_NUDGE_SPEED = 0.3 * RUN_SPEED;
/** Galleta que sale despedida de Rufo al pincharse. */
const LOST_COOKIE_MS = 600;

/** Fresa: botecitos cuando se posa (el impulso y el tamaño están en `power.ts`). */
const FRUIT_HOP = 12;
const FRUIT_HOP_MS = 260;

/** Brillo del modo invencible: colores del tinte, ritmo y destellos (todo al doble en `ending`). */
const GLOW_COLORS = [0xffd23f, 0xff6b5e, 0xff9ec4, 0x8fd3ff, 0x9be37a] as const;
const GLOW_STEP_MS = 110;
/** El tinte se aplica en modo pantalla (aclara) con esta fuerza, para que Rufo siga siendo naranja. */
const GLOW_STRENGTH = 0.42;
const SPARKLE_POOL = 14;
const SPARKLE_EVERY_MS = 70;
const SPARKLE_LIFE_MS = 420;
/** Las piernas (Graphics) no admiten tinte: se aclaran hacia el blanco. */
const GLOW_LEG_LIGHTEN = 0.45;

/**
 * Grosor del cuerpo físico de una plataforma: más que lo que cae el zorro en un fotograma a velocidad
 * máxima (1 920 px/s ≈ 32 px a 60 fps), para que nunca la atraviese al caer.
 */
const PLATFORM_BODY = 40;

interface LevelData {
  /** Mundo del nivel; sin dato, el primero. */
  world?: WorldId;
  level?: number;
}

/**
 * Nivel de plataformas: mover, saltar, golpear bloques «?» desde abajo y llegar a la bandera.
 * Cada nivel se construye con el recorrido de su mundo (`content/levels/<mundo>/`) y su ambiente. Todavía sin retos
 * educativos (fase 2).
 */
export class LevelScene extends Phaser.Scene {
  /** Mundo al que pertenece el nivel: sus enemigos, su escenario y su número de niveles. */
  private def!: WorldDef;
  private level = 1;
  private world!: WorldLevel;
  private ambient!: Ambient;
  private fox!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private hat!: Phaser.GameObjects.Image;
  private controls!: TouchControls;
  private cookies = 0;
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
  private enemies: EnemyView[] = [];
  /** Erizos y abejas del nivel, para «¿Te acuerdas?». */
  private enemyCounts = { hedgehog: 0, bee: 0 };
  private knockUntil = -Infinity;
  private protectedUntil = -Infinity;
  private hitAt = -Infinity;
  /** Último punto de suelo fuera de los fosos que pisó Rufo: el rebote va hacia ese lado. */
  private lastSafeX: number | undefined;
  /**
   * Rebote de los pinchos en el aire: sin tocar ningún control, Rufo sigue el arco hasta aterrizar
   * fuera del foso aunque ya haya recuperado el control. Mientras sube, la pared del foso no le frena.
   */
  private spikeRebound = false;

  /** Superficies del recorrido (suelo, escalones y plataformas), donde se posa la fresa. */
  private surfaces: Phaser.GameObjects.GameObject[] = [];
  private fruit?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private fruitLanded = false;
  /** Tiempo del último fotograma, para fechar lo que pasa en las retrollamadas de la física. */
  private now = 0;
  private powerStartedAt = -Infinity;
  private powerWas: PowerPhase = 'off';
  /** Enemigos que Rufo invencible está tocando, para que hagan el gesto solo al entrar en contacto. */
  private contacts = new Set<EnemyView>();
  private sparkles: Phaser.GameObjects.Image[] = [];
  private nextSparkleAt = 0;
  private glowing = false;

  /** Retos del recorrido (mundo 2) y Lalo volando para ayudar en ellos. */
  private challenges: ChallengeView[] = [];
  /** Retos generados para esta partida (con la edad del perfil), antes de dibujarlos. */
  private plannedChallenges: (CountChallenge | BridgeChallenge)[] = [];
  /** Huecos de agua de los puentes sin resolver: se sale de ellos rebotando, sin coste. */
  private waterHoles: WorldSpike[] = [];
  private hudLalo?: Phaser.GameObjects.Image;

  private home!: RoundButton;
  private progress!: { container: Phaser.GameObjects.Container; fill: Phaser.GameObjects.Graphics; face: Phaser.GameObjects.Image; barW: number };
  private counter!: CookieCounter;

  constructor() {
    super('Level');
  }

  init(data: LevelData): void {
    this.def = worldDef(data?.world);
    showWorld(this.def.id);
    this.level = clampLevel(this.def, data?.level);
    this.world = toWorld(levelData(this.def, this.level));
    this.ambient = AMBIENTS[this.world.ambient];
    this.cookies = 0;
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
    this.enemies = [];
    this.knockUntil = -Infinity;
    this.protectedUntil = -Infinity;
    this.hitAt = -Infinity;
    this.lastSafeX = undefined;
    this.spikeRebound = false;
    this.surfaces = [];
    this.fruit = undefined;
    this.fruitLanded = false;
    this.now = 0;
    this.powerStartedAt = -Infinity;
    this.powerWas = 'off';
    this.contacts = new Set();
    this.sparkles = [];
    this.nextSparkleAt = 0;
    this.glowing = false;
    this.challenges = [];
    this.plannedChallenges = [];
    this.waterHoles = [];
    this.hudLalo = undefined;
  }

  create(): void {
    enter(this);
    audio.playMusic('level');
    const worldW = this.world.width;
    this.physics.world.setBounds(0, 0, worldW, GAME_H);
    this.cameras.main.setBounds(0, 0, worldW, GAME_H);

    this.planChallenges();
    const gaps = [...this.world.spikes, ...this.waterHoles].sort((a, b) => a.x - b.x);
    const spans = groundSpans(worldW, gaps);
    const pits = gaps.map((z) => ({ from: z.x, to: z.x + z.width }));
    const horizon = this.def.horizonRainbow ? { level: this.level, lastLevel: this.def.levelCount } : null;
    addScenery(this, this.ambient, worldW, GROUND_TOP, horizon, this.scale.width, { spans, pits });
    // Suelo por tramos entre los fosos y, en cada foso, un fondo a la altura de las puntas.
    const ground = spans.map((span) => this.staticZone(span.from, GROUND_TOP, span.to - span.from, 100));
    const pitFloors = pits.map((pit) => this.staticZone(pit.from, GROUND_TOP + PIT_TIP, pit.to - pit.from, 100 - PIT_TIP));
    const steps = this.buildSteps();
    const platforms = this.buildPlatforms();
    const blocks = this.buildBlocks();
    this.buildSpikes();
    // La fresa solo se posa en el recorrido, nunca en el fondo de un foso.
    this.surfaces = [...ground, ...steps, ...platforms];
    this.buildFox();
    this.buildGoal();
    this.buildEnemies();
    this.buildChallenges();

    this.physics.add.collider(this.fox, ground, undefined, () => this.groundIsSolid(), this);
    this.physics.add.collider(this.fox, pitFloors);
    this.physics.add.collider(this.fox, steps);
    this.physics.add.collider(this.fox, platforms);
    this.physics.add.collider(this.fox, blocks, (_f, block) => this.onBlockCollision(block as Phaser.Physics.Arcade.Image));

    this.cameras.main.startFollow(this.fox, false, 1, 0.15);
    this.cameras.main.setDeadzone(40 * SCALE, 20 * SCALE);

    this.controls = new TouchControls(this);
    this.buildHud();
    this.layout(this.scale.width, this.scale.height);
    onResize(this, (w, h) => this.layout(w, h));
  }

  override update(time: number, delta: number): void {
    const body = this.fox.body;
    const grounded = body.blocked.down || body.touching.down;
    for (const enemy of this.enemies) enemy.update(time);
    this.now = time;
    this.settleFruit();

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

    // Durante el rebote se ignoran las flechas y el salto: si no, volvería a chocar.
    const knocked = time < this.knockUntil;
    const dir = knocked ? 0 : (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (this.spikeRebound && grounded && !knocked) this.spikeRebound = false;
    // Tras el rebote de los pinchos, si el niño no toca nada, Rufo acaba el arco fuera de la zona.
    const coasting = this.spikeRebound && dir === 0;
    if (!knocked && !coasting) this.fox.setVelocityX(dir * RUN_SPEED);
    // Parado en el borde de un foso casi sobre el hueco: se desliza hacia el suelo firme.
    if (!knocked && !this.spikeRebound && dir === 0 && grounded && Math.abs(body.bottom - GROUND_TOP) <= 2) {
      const nudge = lipNudge(body.x, body.width, [...this.world.spikes, ...this.waterHoles]);
      if (nudge !== 0) this.fox.setVelocityX(nudge * LIP_NUDGE_SPEED);
    }
    if (dir !== 0) this.faceLeft = dir < 0;

    if (input.jump && !this.prevJump && !knocked) this.jumpBufferedAt = time;
    this.prevJump = input.jump;

    const wantsJump = time - this.jumpBufferedAt <= BUFFER_MS;
    const canJump = time - this.lastGrounded <= COYOTE_MS;
    if (wantsJump && canJump) {
      this.fox.setVelocityY(-JUMP_SPEED);
      audio.sfx('jump');
      this.jumpBufferedAt = -Infinity;
      this.lastGrounded = -Infinity;
    }
    // Salto variable: soltar pronto = salto más corto (no recorta el saltito del rebote).
    if (!knocked && !input.jump && body.velocity.y < -VARIABLE_JUMP_MIN) this.fox.setVelocityY(body.velocity.y * 0.6);

    this.tickPower(time);
    this.checkEnemies(time);
    this.checkSpikes(time, grounded);
    for (const c of this.challenges) c.update(this.fox.x);
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
      // Sin balanceo ni rebote por zancada: vibraban. Solo la inclinación fija de la rueda.
      angle = dirSign * RUN_LEAN_DEG * mix;
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

    this.drawLegs(pose === 'run', mix, dirSign, this.glowing);
    if (pose === 'run' && mix > 0.5 && time >= this.nextDustAt) {
      this.puffDust(dirSign);
      this.nextDustAt = time + DUST_EVERY_MS;
    }
    this.blinkFox(time);
  }

  /** Parpadeo del zorro (con gorro y piernas) mientras está protegido tras chocar. */
  private blinkFox(time: number): void {
    const blinking = !this.finished && time < this.protectedUntil;
    const alpha = blinking && Math.floor((time - this.hitAt) / BLINK_MS) % 2 === 0 ? BLINK_ALPHA : 1;
    this.fox.setAlpha(alpha);
    this.hat.setAlpha(alpha);
    this.legs.setAlpha(alpha);
  }

  /** Enemigos al azar en zonas seguras (suelo llano); cambian cada vez que se entra en el nivel. */
  private buildEnemies(): void {
    const spawns = layoutEnemies(this.def.enemies, this.level, courseFor(this.world));
    this.enemyCounts = { hedgehog: 0, bee: 0 };
    for (const spawn of spawns) this.enemyCounts[spawn.kind] += 1;
    this.enemies = spawns.map((spawn) => createEnemyView(this, spawn, GROUND_TOP));
    for (const enemy of this.enemies) enemy.update(this.time.now);
  }

  /**
   * Retos del recorrido: sus valores salen de la franja de edad del perfil y cambian en cada partida.
   * Fallar no quita galletas; abrir la compuerta da `GATE_COOKIES`.
   */
  private planChallenges(): void {
    const data = this.world.challenges;
    if (data.length === 0) return;
    const rng = createRng((Date.now() ^ (this.level * 104729)) >>> 0);
    const band = ageBand(activeAge());
    // Respuestas distintas entre los retos A del nivel mientras quepan en el rango.
    const [min, max] = countRange(band);
    const pool = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i));
    let next = 0;
    this.plannedChallenges = data.map((c) => (c.kind === 'bridge' ? bridgeChallenge(band, rng) : countChallenge(band, rng, c, pool[next++ % pool.length]!)));
    this.waterHoles = data.flatMap((c, i) => {
      const plan = this.plannedChallenges[i]!;
      return plan.kind === 'bridge' ? [bridgeHole(c.x, plan)] : [];
    });
  }

  private buildChallenges(): void {
    const data = this.world.challenges;
    if (data.length === 0) return;
    const lalo = new LaloFlyer(this, () => this.hudLalo);
    const hooks = {
      lalo,
      reward: (count: number, x: number, y: number) => this.rainCookies(count, x, y),
      closeHole: (hole: WorldSpike) => this.closeHole(hole),
    };
    this.challenges = data.map((c, i) => {
      const plan = this.plannedChallenges[i]!;
      if (plan.kind === 'bridge') return new BridgeChallengeView(this, this.fox, c, plan, hooks);
      return new CountChallengeView(this, this.fox, c, plan, hooks);
    });
  }

  /** Tabla del puente colocada: el hueco pasa a ser suelo firme. */
  private closeHole(hole: WorldSpike): void {
    this.waterHoles = this.waterHoles.filter((h) => h.x !== hole.x);
    const plank = this.staticZone(hole.x, GROUND_TOP, hole.width, 100);
    this.physics.add.collider(this.fox, plank);
    this.surfaces.push(plank);
  }

  /** Lluvia de galletas que suben del punto (x, y) y se suman al contador. */
  private rainCookies(count: number, x: number, y: number): void {
    for (let i = 0; i < count; i++) {
      const cookie = this.add.image(x, y, 'cookie').setDepth(6);
      this.tweens.add({
        targets: cookie,
        x: x + (i - (count - 1) / 2) * 70,
        y: y - 90,
        alpha: 0,
        delay: i * 120,
        duration: 600,
        ease: 'Quad.easeOut',
        onStart: () => audio.sfx('cookie'),
        onComplete: () => cookie.destroy(),
      });
    }
    this.cookies += count;
    this.counter.setValue(this.cookies);
    this.layout(this.scale.width, this.scale.height);
    bump(this, this.counter.container);
  }

  /** Enemigos que tocan ahora la caja del zorro. */
  private touchingEnemies(): EnemyView[] {
    const body = this.fox.body;
    const fox = { x: body.x, y: body.y, w: body.width, h: body.height };
    return this.enemies.filter((e) => overlaps(fox, e.box()));
  }

  /**
   * Los enemigos no se tocan: cualquier contacto, también desde arriba, es un pinchazo. En modo
   * invencible se atraviesan y solo hacen su gesto al entrar en contacto.
   */
  private checkEnemies(time: number): void {
    if (powerPhase(time, this.powerStartedAt) !== 'off') {
      const touching = new Set(this.touchingEnemies());
      for (const enemy of touching) if (!this.contacts.has(enemy)) enemy.gesture();
      this.contacts = touching;
      return;
    }
    this.contacts.clear();
    if (time < this.protectedUntil) return;
    const enemy = this.touchingEnemies()[0];
    if (enemy) this.onEnemyHit(enemy, time);
  }

  /** Pinchazo de un enemigo: brinco corto hacia el lado contrario al enemigo. */
  private onEnemyHit(enemy: EnemyView, time: number): void {
    const box = enemy.box();
    let side = Math.sign(this.fox.x - (box.x + box.w / 2));
    if (side === 0) side = this.faceLeft ? 1 : -1;
    enemy.gesture();
    this.knock(time, side, side * KNOCK_VX, 'bump');
  }

  /** Zona estática de física con la cara de arriba en `top`, de `x` a `x + width`. */
  private staticZone(x: number, top: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + width / 2, top + height / 2, width, height);
    this.physics.add.existing(zone, true);
    return zone;
  }

  /**
   * ¿Choca Rufo con un tramo de suelo? Siempre, salvo con la pared de un foso mientras sube rebotando
   * desde el fondo (pies por debajo del suelo): así nada le corta el rebote. Al bajar sí choca, para
   * aterrizar en el suelo.
   */
  private groundIsSolid(): boolean {
    const body = this.fox.body;
    return !(this.spikeRebound && body.velocity.y < 0 && body.bottom > GROUND_TOP);
  }

  /**
   * Fondo de cada foso: la placa redondeada con remaches, la hilera de conos de acero con la base sobre
   * ella y las puntas `PIT_TIP` px bajo el suelo, y un destello en la primera punta.
   */
  private buildSpikes(): void {
    const plateTop = GROUND_TOP + PIT_DEPTH - SPIKE_PLATE_H;
    for (const z of this.world.spikes) {
      const g = this.add.graphics().setDepth(4);
      g.fillStyle(STEEL.dark).fillRoundedRect(z.x, plateTop, z.width, SPIKE_PLATE_H, SPIKE_PLATE_H / 2);
      g.fillStyle(STEEL.mid).fillRoundedRect(z.x + 3, plateTop, z.width - 6, 3, 1.5);
      g.fillStyle(STEEL.light);
      for (let x = z.x + RIVET_EVERY / 2; x < z.x + z.width; x += RIVET_EVERY) g.fillCircle(x, plateTop + SPIKE_PLATE_H / 2 + 1, RIVET_R);
      this.add.tileSprite(z.x, plateTop, z.width, SPIKE_CONE_H, 'spikes').setOrigin(0, 1).setDepth(4);
      this.add.image(z.x + TILE / CONES_PER_TILE / 2, GROUND_TOP + PIT_TIP + 1, 'spike-glint').setDepth(4);
    }
  }

  /**
   * Pinchos: Rufo apoyado en el fondo de un foso está sobre las puntas y rebota fuera por donde entró.
   * Cuesta una galleta salvo si está protegido o es invencible. Mientras pisa algo fuera de los fosos
   * (suelo, escalón o plataforma) se recuerda dónde, para rebotar hacia ese lado.
   */
  private checkSpikes(time: number, grounded: boolean): void {
    const zone = grounded ? pitUnder(this.fox.body.bottom, this.fox.x, [...this.world.spikes, ...this.waterHoles]) : undefined;
    if (grounded && !zone) this.lastSafeX = this.fox.x;
    if (!zone) return;
    if (this.waterHoles.includes(zone)) {
      // Agua del puente: rebote fuera por donde entró, sin galleta ni parpadeo.
      const side = exitSide(zone, this.lastSafeX, this.fox.x);
      this.knock(time, side, reboundVelocity(zone, side, this.fox.x), 'bump', false);
      this.spikeRebound = true;
      return;
    }
    const costsCookie = powerPhase(time, this.powerStartedAt) === 'off' && time >= this.protectedUntil;
    const side = exitSide(zone, this.lastSafeX, this.fox.x);
    this.knock(time, side, reboundVelocity(zone, side, this.fox.x), 'spikes', costsCookie);
    this.spikeRebound = true;
  }

  /**
   * Pinchazo común: brinco hacia arriba con `vx` y sin control un momento. Si `costsCookie`, además
   * protegido (parpadeando) y una galleta menos (nunca bajo 0) que sale despedida hacia `side`; si no
   * (pinchos con protección o fresa), solo el brinco y el sonido. No toca bloques ni estrellas.
   */
  private knock(time: number, side: number, vx: number, sound: 'bump' | 'spikes', costsCookie = true): void {
    this.fox.setVelocity(vx, -KNOCK_VY);
    this.knockUntil = time + KNOCK_MS;
    this.jumpBufferedAt = -Infinity;
    this.lastGrounded = -Infinity;
    this.spikeRebound = false;
    audio.sfx(sound);
    if (!costsCookie) return;
    this.protectedUntil = time + PROTECT_MS;
    this.hitAt = time;

    const { cookies, lost } = loseCookie(this.cookies);
    if (!lost) return;
    this.cookies = cookies;
    this.counter.setValue(this.cookies);
    this.layout(this.scale.width, this.scale.height);
    bump(this, this.counter.container);
    this.dropCookie(side);
  }

  /** Galleta que sale de Rufo en arco hacia atrás (`side`) y se desvanece. */
  private dropCookie(side: number): void {
    const x0 = this.fox.x;
    const y0 = this.fox.y - this.fox.displayHeight * 0.6;
    const cookie = this.add.image(x0, y0, 'cookie').setDepth(12);
    const arc = { t: 0 };
    this.tweens.add({
      targets: arc,
      t: 1,
      duration: LOST_COOKIE_MS,
      ease: 'Linear',
      onUpdate: () => {
        const t = arc.t;
        cookie.setPosition(x0 + side * 120 * t, y0 - 150 * t + 190 * t * t);
        cookie.setAngle(side * 300 * t);
        cookie.setAlpha(t < 0.5 ? 1 : 2 * (1 - t));
      },
      onComplete: () => cookie.destroy(),
    });
  }

  /** Fresa: sale del bloque hacia arriba y hacia donde mira Rufo, y cae sobre el recorrido. */
  private spawnFruit(block: Phaser.Physics.Arcade.Image): void {
    const fruit = this.physics.add.image(block.x, block.y - BLOCK_SIZE / 2, 'strawberry').setOrigin(0.5, 1).setDepth(6);
    fruit.setDisplaySize(FRUIT_SIZE, FRUIT_SIZE);
    fruit.setCollideWorldBounds(true);
    fruit.setVelocity((this.faceLeft ? -1 : 1) * FRUIT_VX, -FRUIT_VY);
    this.physics.add.collider(fruit, this.surfaces);
    this.physics.add.overlap(this.fox, fruit, () => this.eatFruit());
    this.fruit = fruit;
    this.fruitLanded = false;
    audio.sfx('fruit');
  }

  /** Cuando la fresa se posa, se queda quieta dando botecitos. */
  private settleFruit(): void {
    const fruit = this.fruit;
    if (!fruit || this.fruitLanded || !fruit.active) return;
    const body = fruit.body;
    if (!(body.blocked.down || body.touching.down)) return;
    this.fruitLanded = true;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    body.moves = false;
    // Por seguridad: nunca se queda sobre un foso (las reglas de colocación ya lo evitan).
    const x = nudgeOffSpikes(fruit.x, this.world.spikes, FRUIT_SIZE / 2);
    if (x !== fruit.x) body.reset(x, fruit.y);
    this.tweens.add({ targets: fruit, y: fruit.y - FRUIT_HOP, duration: FRUIT_HOP_MS, ease: 'Quad.easeOut', yoyo: true, repeat: -1, repeatDelay: 120 });
  }

  /** Rufo come la fresa: destello y modo invencible. No toca el contador. */
  private eatFruit(): void {
    const fruit = this.fruit;
    if (!fruit?.active || this.finished) return;
    this.fruit = undefined;
    const { x } = fruit;
    const y = fruit.y - fruit.displayHeight / 2;
    this.tweens.killTweensOf(fruit);
    fruit.destroy();
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      this.sparkleAt(x, y, GLOW_COLORS[k % GLOW_COLORS.length]!, Math.cos(a) * 60, Math.sin(a) * 60, SPARKLE_LIFE_MS);
    }
    this.powerStartedAt = this.now;
    this.contacts = new Set(this.touchingEnemies());
    audio.sfx('power');
  }

  /**
   * Modo invencible: brillo mientras dura y, al acabar, su tintineo. Si acaba tocando un enemigo, da la
   * misma protección (con parpadeo) que un pinchazo, para no pincharse en el fotograma siguiente. En
   * los pinchos no hace falta: no se puede estar en un foso sin rebotar.
   */
  private tickPower(time: number): void {
    const phase = powerPhase(time, this.powerStartedAt);
    if (phase === 'off' && this.powerWas !== 'off') {
      audio.sfx('power-off');
      this.clearGlow();
      if (this.touchingEnemies().length > 0) {
        this.protectedUntil = time + PROTECT_MS;
        this.hitAt = time;
      }
    }
    this.powerWas = phase;
    if (phase !== 'off') this.glow(time, phase);
  }

  /** Tinte de colores que cambia (más deprisa al final) y destellos alrededor de Rufo. */
  private glow(time: number, phase: PowerPhase): void {
    const speed = phase === 'ending' ? 2 : 1;
    const step = Math.floor(((time - this.powerStartedAt) * speed) / GLOW_STEP_MS);
    const color = scaleColor(GLOW_COLORS[step % GLOW_COLORS.length]!, GLOW_STRENGTH);
    if (!this.glowing) {
      this.fox.setTintMode(Phaser.TintModes.SCREEN);
      this.hat.setTintMode(Phaser.TintModes.SCREEN);
      this.glowing = true;
    }
    this.fox.setTint(color);
    this.hat.setTint(color);

    if (time < this.nextSparkleAt) return;
    this.nextSparkleAt = time + SPARKLE_EVERY_MS / speed;
    const h = this.fox.displayHeight;
    const x = this.fox.x + Phaser.Math.Between(-48, 48);
    const y = this.fox.y - Phaser.Math.FloatBetween(0.1, 1) * h;
    const tint = GLOW_COLORS[Phaser.Math.Between(0, GLOW_COLORS.length - 1)]!;
    this.sparkleAt(x, y, tint, Phaser.Math.Between(-14, 14), -Phaser.Math.Between(10, 30), SPARKLE_LIFE_MS / speed);
  }

  /** Suelta un destello del pool en (x, y) que crece, gira, se desplaza (dx, dy) y se desvanece. */
  private sparkleAt(x: number, y: number, tint: number, dx: number, dy: number, life: number): void {
    const s = this.sparkles.find((d) => !d.active);
    if (!s) return;
    this.tweens.killTweensOf(s);
    s.setActive(true).setVisible(true).setPosition(x, y).setTint(tint).setScale(0.5).setAlpha(1).setAngle(0);
    this.tweens.add({
      targets: s,
      x: x + dx,
      y: y + dy,
      scale: { from: 0.5, to: 1.6 },
      angle: 90,
      alpha: 0,
      duration: life,
      ease: 'Quad.easeOut',
      onComplete: () => s.setActive(false).setVisible(false),
    });
  }

  private clearGlow(): void {
    if (!this.glowing) return;
    this.glowing = false;
    this.fox.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
    this.hat.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
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
  private drawLegs(visible: boolean, mix: number, dirSign: number, glowing: boolean): void {
    const g = this.legs.clear();
    g.setVisible(visible);
    if (!visible) return;
    const u = this.fox.displayHeight / FOX_UNITS / Math.abs(this.fox.scaleY);
    g.setPosition(this.fox.x, this.fox.y)
      .setRotation(this.fox.rotation)
      .setScale(dirSign * u * this.fox.scaleX, u * this.fox.scaleY);

    const { phase, intensity } = this.run;
    const y0 = FOX_GROUND_Y;
    const legColor = glowing ? lighten(RUN_COLORS.leg, GLOW_LEG_LIGHTEN) : RUN_COLORS.leg;
    const footColor = glowing ? lighten(RUN_COLORS.foot, GLOW_LEG_LIGHTEN) : RUN_COLORS.foot;
    const foot = (f: FootPoint, alpha: number): void => {
      g.fillStyle(footColor, alpha).fillEllipse(f.x + 2, y0 + f.y - FOOT_RY, FOOT_RX * 2, FOOT_RY * 2);
    };
    const leg = (hip: { x: number; y: number }, f: FootPoint, alpha: number): void => {
      g.lineStyle(LEG_WIDTH, legColor, alpha).lineBetween(hip.x, y0 + hip.y, f.x, y0 + f.y - FOOT_RY);
      g.fillStyle(legColor, alpha).fillCircle(f.x, y0 + f.y - FOOT_RY, LEG_WIDTH / 2);
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
      g.fillStyle(legColor, 0.28 * mix).fillEllipse(cx, cy, rx * 2, ry * 2);
      const spin = phase * Math.PI * 2;
      for (let k = 0; k < 3; k++) {
        const a0 = spin + (k * Math.PI * 2) / 3;
        g.lineStyle(5, legColor, 0.75 * mix).beginPath();
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

  /** Escalones: tramos de suelo elevado, sólidos por arriba y por los lados. */
  private buildSteps(): Phaser.GameObjects.Zone[] {
    return this.world.steps.map((s) => {
      drawStep(this, s.x, s.width, s.top, GROUND_TOP, this.ambient);
      const zone = this.add.zone(s.x + s.width / 2, (s.top + GROUND_TOP) / 2, s.width, s.height);
      this.physics.add.existing(zone, true);
      return zone;
    });
  }

  /** Plataformas de un solo sentido: se atraviesan saltando desde abajo y se aterriza encima. */
  private buildPlatforms(): Phaser.GameObjects.Zone[] {
    return this.world.platforms.map((p) => {
      drawPlatform(this, p.x, p.width, p.top, this.ambient);
      const zone = this.add.zone(p.x + p.width / 2, p.top + PLATFORM_BODY / 2, p.width, PLATFORM_BODY);
      this.physics.add.existing(zone, true);
      const body = zone.body as Phaser.Physics.Arcade.StaticBody;
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
      return zone;
    });
  }

  /** Bloques «?» apoyados en la superficie que tienen debajo (suelo, escalón o plataforma). */
  /** Uno de ellos, al azar en cada partida, esconde la fresa; por fuera es igual que los demás. */
  private buildBlocks(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    const fruitAt = pickFruitBlock(this.world.blocks.length);
    this.world.blocks.forEach((b, i) => {
      const block = group.create(b.x, b.bottom - BLOCK_SIZE / 2, 'block') as Phaser.Physics.Arcade.Image;
      if (i === fruitAt) block.setData('fruit', true);
    });
    return group;
  }

  private buildFox(): void {
    this.fox = this.physics.add.sprite(this.world.startX, GROUND_TOP - 2, 'fox-idle').setOrigin(0.5, 1);
    this.fox.body.setSize(56, 87, false).setOffset(32, 30);
    this.fox.setCollideWorldBounds(true);
    this.fox.setMaxVelocity(MAX_VELOCITY.x, MAX_VELOCITY.y);
    this.fox.setDepth(10);
    this.legs = this.add.graphics().setDepth(9).setVisible(false);
    for (let i = 0; i < DUST_POOL; i++) {
      this.dust.push(this.add.image(0, 0, 'dust').setDepth(8).setActive(false).setVisible(false));
    }
    for (let i = 0; i < SPARKLE_POOL; i++) {
      this.sparkles.push(this.add.image(0, 0, 'sparkle').setDepth(12).setActive(false).setVisible(false));
    }
    this.hat = makeHat(this, session.hat, FOX_SIZE).setDepth(11);
    placeHat(this.hat, this.fox, 'idle', false);
  }

  private buildGoal(): void {
    const flagX = this.world.flagX;
    this.add.image(flagX, GROUND_TOP + 4, 'flag').setOrigin(0.1, 1).setDepth(5);
    const zone = this.add.zone(flagX, GROUND_TOP - 20 * SCALE, 24 * SCALE, 40 * SCALE);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.fox, zone, () => this.onGoal());
  }

  private onBlockCollision(block: Phaser.Physics.Arcade.Image): void {
    if (this.finished || !this.fox.body.touching.up || block.getData('used')) return;
    block.setData('used', true);
    audio.sfx('block');
    audio.sfx('cookie');
    block.setTexture('block-used');
    this.tweens.add({ targets: block, y: block.y - 14, duration: 80, yoyo: true });

    const cookie = this.add.image(block.x, block.y - BLOCK_SIZE / 2 - 20, 'cookie').setDepth(6);
    this.tweens.add({ targets: cookie, y: cookie.y - 110, alpha: 0, duration: 520, ease: 'Quad.easeOut', onComplete: () => cookie.destroy() });

    this.blocksHit += 1;
    this.cookies += 1;
    this.counter.setValue(this.cookies);
    this.layout(this.scale.width, this.scale.height);
    bump(this, this.counter.container);
    if (block.getData('fruit')) this.spawnFruit(block);
  }

  private onGoal(): void {
    if (this.finished) return;
    this.finished = true;
    this.powerStartedAt = -Infinity;
    this.powerWas = 'off';
    this.contacts.clear();
    this.clearGlow();
    audio.stopMusic(300);
    audio.sfx('goal');
    this.fox.setVelocity(0, Math.min(this.fox.body.velocity.y, 0));
    this.nextHopAt = this.time.now + 120;
    this.controls.read();
    this.updateProgress(1);
    this.time.delayedCall(CELEBRATE_MS, () =>
      goTo(this, 'Quiz', {
        world: this.def.id,
        level: this.level,
        ambient: this.world.ambient,
        hedgehogs: this.enemyCounts.hedgehog,
        bees: this.enemyCounts.bee,
        cookies: this.cookies,
        blocksHit: this.blocksHit,
        blocksTotal: this.world.blocks.length,
        challenges: tally(this.challenges),
      } satisfies QuizData),
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
        if (!this.finished) goTo(this, 'Map', { world: this.def.id });
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

    this.counter = cookieCounter(this, 0, 0, 0);
    const lalo = drawLalo(this, 32, 140);
    this.hudLalo = lalo.list[0] as Phaser.GameObjects.Image;

    for (const obj of [this.home, container, this.counter.container, lalo]) fixToCamera(obj.setDepth(HUD_DEPTH));
    this.updateProgress();
  }

  private updateProgress(force?: number): void {
    const { startX, flagX } = this.world;
    const t = force ?? Phaser.Math.Clamp((this.fox.x - startX) / (flagX - startX), 0, 1);
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

/** Multiplica cada canal de un color por `k` (0 a 1): con `k` bajo, el tinte en modo pantalla aclara poco. */
function scaleColor(color: number, k: number): number {
  const ch = (shift: number): number => Math.round(((color >> shift) & 0xff) * k) << shift;
  return ch(16) | ch(8) | ch(0);
}

/** Mezcla un color hacia el blanco (`t` de 0 a 1). */
function lighten(color: number, t: number): number {
  const ch = (shift: number): number => {
    const c = (color >> shift) & 0xff;
    return Math.round(c + (255 - c) * t) << shift;
  };
  return ch(16) | ch(8) | ch(0);
}
