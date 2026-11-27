import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H, MAX_W } from '../config';
import { FLAGS } from '../flags';
import { skyColorAt, type SkyStop } from '../map/map-sky';
import { eggSpot } from '../map/egg-spots';
import { bandAngles, paintedBands, rainbowMemory } from '../map/rainbow-arc';
import { activeAge, activeProfileId, saveActive } from '../profile/active';
import { Finale } from '../story/finale';
import { HatchFinale } from '../story/hatch-finale';
import { markSeen, shouldPlayFinale } from '../story/story';
import { castleStatus, currentLevel, levelStatus, session, type CastleStatus } from '../state';
import { drawFox, drawLalo } from '../ui/characters';
import { drawIslandEgg, drawSpot, SPOT_HEX } from '../ui/island-egg';
import { digits, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { cookieCounter, fixToCamera } from '../ui/widgets';
import { castleTexture, medalTexture } from '../castle/castle';
import { opensAfter, worldAccess, type WorldAccess } from '../worlds/access';
import { showWorld, shownWorld, UPCOMING, WORLDS, worldDef } from '../worlds/registry';
import type { SelectorButton, WorldDef, WorldId } from '../worlds/types';

/** Artboard de diseño de una pantalla del mapa; los nodos y adornos de cada mundo van en él. */
const DESIGN_W = 1180;
const DESIGN_H = 820;
/** Lo que hay que mover el dedo para que un toque pase a ser un arrastre del mapa, en px. */
const DRAG_THRESHOLD = 12;
/** Las flechas desplazan el mapa esta fracción del ancho visible. */
const ARROW_STEP = 0.7;
const ARROW_MS = 450;
const HUD_DEPTH = 100;

/** Las 6 bandas del arcoíris, de fuera adentro (las mismas que `decor-rainbow`). */
const BAND_COLORS = [0xff9b93, 0xffc27a, 0xffe58a, 0x9fdc8f, 0x8fc7f2, 0xb9a6ee];
/** Tamaño de la textura del paisaje a lo ancho: se estira al camino entero. */
const SKY_TEX_W = 256;
const SKY_TEX_H = 72;
/** Animación del gajo nuevo: viaje de la cámara, cada banda, pausas y salto del zorro (ms). */
const PAN_MS = 650;
const BAND_MS = 150;
const BAND_GAP_MS = 220;
const HOLD_MS = 350;
const HOP_MS = 520;

/** Animación de la mancha nueva del huevo (ms). */
const SPOT_MS = 520;

/** Huevo del mapa en px lógicos: centro y alto. */
interface Egg {
  x: number;
  y: number;
  size: number;
}

/** Geometría del arco del mapa en px lógicos. */
interface Arc {
  x: number;
  y: number;
  radius: number;
  band: number;
}

interface MapData {
  /** Mundo que se muestra; sin dato, el último abierto en esta sesión. */
  world?: WorldId;
}

/**
 * Mapa de un mundo (lo describe su `WorldDef.map`): sus niveles en un camino más ancho que la
 * pantalla, el zorro sobre el actual. Se desplaza arrastrando o con las flechas; el contador, Lalo, mi personaje y el selector de
 * mundos quedan fijos.
 */
export class MapScene extends Phaser.Scene {
  /** Botones que se mueven con el mapa: un arrastre cancela su toque. */
  private nodeButtons: RoundButton[] = [];
  private arrows?: { left: RoundButton; right: RoundButton };
  private maxScroll = 0;
  private drag?: { startX: number; startScroll: number; dragging: boolean };
  private def!: WorldDef;
  /** Gajos que se están animando; mientras haya, un toque acaba la animación. */
  private animating: number[] = [];
  /** El final del mundo está en marcha (tras los gajos nuevos, si los hay). */
  private inFinale = false;
  /** Mundos que se abren al acabar el final: su botón lleva candado hasta entonces. */
  private unlocking: WorldId[] = [];
  /** Candado de cada botón del selector que lo lleva. */
  private selectorLocks = new Map<WorldId, Phaser.GameObjects.GameObject[]>();
  private selectorButtons = new Map<WorldId, RoundButton>();
  /** Cambia cada vez que se construye el mapa: los pasos pendientes de una animación anterior se descartan. */
  private buildId = 0;

  constructor() {
    super('Map');
  }

  init(data: MapData): void {
    const asked = data?.world ? worldDef(data.world) : shownWorld();
    // Un mundo que el perfil no puede abrir (p. ej. tras cambiar de perfil) deja paso al primero.
    this.def = this.access(asked) === 'open' ? asked : WORLDS[0]!;
    showWorld(this.def.id);
  }

  create(): void {
    enter(this);
    audio.playMusic('map');
    this.drag = undefined;
    // Gajos pintados desde la última vez que se vio este mapa con este perfil: se pintan delante del niño.
    const painted = this.def.map.rainbow || this.def.map.egg ? paintedBands(session, this.def) : [];
    this.animating = rainbowMemory.take(`${activeProfileId() ?? '-'}/${this.def.id}`, painted);
    // Final del mundo: una vez por perfil, marcado ya al empezar para que salir o recargar no lo repita.
    this.inFinale = shouldPlayFinale(session, this.def);
    this.unlocking = [];
    if (this.inFinale) {
      markSeen(session, 'final', this.def.id);
      saveActive();
      this.unlocking = WORLDS.filter((w) => opensAfter(w, this.def.id, activeAge(), FLAGS)).map((w) => w.id);
    }
    this.build(this.scale.width);
    onResize(this, () => this.rebuild());

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => {
      if (this.busy) {
        // Un toque durante la animación la acaba: todo en su sitio, sin abrir nada.
        this.rebuild();
        return;
      }
      this.drag = {
        startX: p.x,
        startScroll: this.cameras.main.scrollX,
        dragging: false,
      };
    });
    this.input.on(Phaser.Input.Events.POINTER_MOVE, (p: Phaser.Input.Pointer) => {
      const drag = this.drag;
      if (!drag || !p.isDown) return;
      const dx = p.x - drag.startX;
      if (!drag.dragging && Math.abs(dx) > DRAG_THRESHOLD) {
        drag.dragging = true;
        // Al empezar a arrastrar, ningún nivel se abre al soltar.
        for (const b of this.nodeButtons) b.setPressed(false);
        this.tweens.killTweensOf(this.cameras.main);
      }
      if (drag.dragging) this.scrollTo(drag.startScroll - dx);
    });
    const end = (): void => {
      this.drag = undefined;
    };
    this.input.on(Phaser.Input.Events.POINTER_UP, end);
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, end);
  }

  override update(): void {
    if (!this.arrows) return;
    const x = this.cameras.main.scrollX;
    this.arrows.left.setVisible(x > 2);
    this.arrows.right.setVisible(x < this.maxScroll - 2);
  }

  /** Vuelve a montar el mapa en su estado final, sin animación. */
  private rebuild(): void {
    this.animating = [];
    this.inFinale = false;
    this.unlocking = [];
    this.tweens.killAll();
    this.time.removeAllEvents();
    this.children.removeAll(true);
    this.build(this.scale.width);
  }

  private access(def: WorldDef): WorldAccess {
    return worldAccess(def, session, activeAge(), FLAGS);
  }

  private scrollTo(x: number): void {
    this.cameras.main.scrollX = Phaser.Math.Clamp(x, 0, this.maxScroll);
  }

  private build(width: number): void {
    const sx = width / DESIGN_W;
    const sy = GAME_H / DESIGN_H;
    const at = ([x, y]: readonly [number, number]): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x * sx, y * sy);
    const map = this.def.map;
    const worldW = width * map.screens;
    this.maxScroll = worldW - width;
    this.nodeButtons = [];
    this.selectorLocks.clear();
    this.selectorButtons.clear();
    this.buildId++;
    this.cameras.main.setBounds(0, 0, worldW, GAME_H);

    if (map.skyline) this.add.image(0, 0, this.skylineTexture(map.skyline, map.screens)).setOrigin(0, 0).setDisplaySize(worldW, GAME_H);
    else this.add.image(0, 0, map.sky).setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
    for (const d of map.decor) {
      const p = at(d.at);
      const img = this.add.image(p.x, p.y, d.key).setOrigin(0.5, 1);
      if (d.size > 0) img.setScale(d.size / Math.max(img.width, img.height));
      if (d.prologue) {
        // La madriguera: tocarla abre el nivel 1 con el prólogo (arrastrar desde ella no abre nada).
        const zone = this.add.zone(img.x, img.y - img.displayHeight / 2, Math.max(120, img.displayWidth), Math.max(120, img.displayHeight));
        zone.setInteractive({ useHandCursor: true });
        zone.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          if (this.drag?.dragging || this.busy) return;
          audio.sfx('tap');
          goTo(this, 'Level', { world: this.def.id, level: 1, prologue: true });
        });
      }
    }
    for (const c of map.clouds) this.add.image(width * c.x, c.y, 'cloud').setScale(c.scale);
    const arc: Arc | undefined = map.rainbow && {
      x: map.rainbow.center[0] * sx,
      y: map.rainbow.center[1] * sy,
      radius: map.rainbow.radius * sy,
      band: map.rainbow.band * sy,
    };
    const fresh = this.animating;
    if (arc) this.drawArc(arc, paintedBands(session, this.def).filter((l) => !fresh.includes(l)));
    const egg: Egg | undefined = map.egg && { x: map.egg.center[0] * sx, y: map.egg.center[1] * sy, size: map.egg.size * sy };
    const eggG = egg && drawIslandEgg(this, egg.size, paintedBands(session, this.def).filter((l) => !fresh.includes(l))).setPosition(egg.x, egg.y);
    if (map.river) {
      const { from, to, offset } = map.river;
      const stops = map.nodes.slice(0, this.def.levelCount + (this.def.castle ? 1 : 0)).map(([x, y]) => [x, y + offset] as const);
      this.drawRiver([from, ...stops, to].map(at));
    }

    const nodes = map.nodes.slice(0, this.def.levelCount);
    // El castillo, si el mundo tiene, es la parada siguiente al último nivel.
    const castleNode = this.def.castle ? map.nodes[this.def.levelCount] : undefined;
    this.drawPath([...nodes, ...(castleNode ? [castleNode] : [])].map(at));

    const level = currentLevel(session, this.def);
    const current = level ?? this.def.levelCount;
    nodes.forEach((node, i) => this.buildNode(i + 1, at(node)));
    const castle = castleNode ? castleStatus(session, this.def) : 'locked';
    if (castleNode) this.buildCastle(at(castleNode), castle);

    // Con todos los niveles hechos, el zorro espera en el castillo.
    const onCastle = castleNode !== undefined && level === null && castle !== 'locked';
    const foxAt = at(onCastle ? castleNode : nodes[current - 1]!);
    const nodeR = onCastle ? 60 : levelStatus(session, this.def, current) === 'current' ? 56 : 48;
    const foxEnd = new Phaser.Math.Vector2(foxAt.x, foxAt.y - nodeR + 6);
    // Con gajos nuevos, el zorro empieza en el último nivel terminado y salta al actual al acabar.
    const lastFresh = fresh[fresh.length - 1];
    const fromNode = lastFresh !== undefined && (arc || egg) ? nodes[lastFresh - 1] : undefined;
    const foxStart = fromNode ? at(fromNode).add(new Phaser.Math.Vector2(0, -48 + 6)) : foxEnd;
    const fox = drawFox(this, foxStart.x, foxStart.y, 'idle', session.hat, 104);
    const bob = (): void => {
      this.tweens.add({ targets: fox, y: foxEnd.y - 8, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    };
    // Se abre con el nivel actual centrado (o lo más centrado posible).
    this.scrollTo(foxStart.x - width / 2);
    const afterFox = (): void => (this.inFinale ? this.playFinale(fox, foxEnd, width, bob) : this.ready(bob));
    if (this.busy) for (const b of this.nodeButtons) b.disableInteractive();
    if (arc && fresh.length > 0) {
      this.paintFresh(arc, fresh, () => this.hopFox(fox, foxEnd, width, afterFox));
    } else if (egg && eggG && fresh.length > 0) {
      this.paintFreshSpots(egg, eggG, fresh, () => this.hopFox(fox, foxEnd, width, afterFox));
    } else if (this.inFinale) {
      // Sin la animación del gajo, se espera a que entre la escena.
      const id = this.buildId;
      this.time.delayedCall(500, () => id === this.buildId && this.playFinale(fox, foxEnd, width, bob));
    } else {
      bob();
    }

    // Barra superior: galletas, Lalo y acceso a mi personaje (fijos a la cámara).
    const hud: Phaser.GameObjects.GameObject[] = [];
    const counter = cookieCounter(this, 0, 76, session.cookies);
    counter.container.x = 32 + counter.width / 2;
    hud.push(counter.container, drawLalo(this, 32, 140));
    hud.push(
      new RoundButton(this, width - 32 - 48, 76, {
        width: 96,
        color: COLORS.white,
        shadowColor: COLORS.shadow,
        icon: 'icon-fox-face',
        iconSize: 64,
        onTap: () => goTo(this, 'Wardrobe'),
      }),
    );
    hud.push(...this.buildWorldSelector(width));
    hud.push(...this.buildArrows(width));
    for (const obj of hud) fixToCamera((obj as Phaser.GameObjects.Container).setDepth(HUD_DEPTH));
  }

  /**
   * Paisaje a lo ancho (`WorldMap.skyline`): una textura pequeña por mundo, pintada punto a punto, que se
   * estira a todo el camino.
   */
  private skylineTexture(skyline: readonly SkyStop[], screens: number): string {
    const key = `map-sky-${this.def.id}`;
    if (this.textures.exists(key)) return key;
    const tex = this.textures.createCanvas(key, SKY_TEX_W, SKY_TEX_H);
    if (!tex) return this.def.map.sky;
    const ctx = tex.context;
    const img = ctx.createImageData(SKY_TEX_W, SKY_TEX_H);
    const artW = DESIGN_W * screens;
    for (let j = 0; j < SKY_TEX_H; j++) {
      for (let i = 0; i < SKY_TEX_W; i++) {
        const [r, g, b] = skyColorAt(skyline, ((i + 0.5) / SKY_TEX_W) * artW, (j + 0.5) / SKY_TEX_H);
        const k = (j * SKY_TEX_W + i) * 4;
        img.data[k] = r;
        img.data[k + 1] = g;
        img.data[k + 2] = b;
        img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    tex.refresh();
    return key;
  }

  /** Arco de gajos: los de `painted` con sus 6 bandas y el resto como una silueta clara, con dos nubes al pie. */
  private drawArc(arc: Arc, painted: readonly number[]): void {
    const count = this.def.levelCount;
    const g = this.add.graphics();
    const thick = arc.band * BAND_COLORS.length;
    for (let level = 1; level <= count; level++) {
      const { start, end } = bandAngles(level, count);
      if (painted.includes(level)) {
        for (let k = 0; k < BAND_COLORS.length; k++) this.strokeBand(g, arc, k, start, end);
      } else {
        g.lineStyle(thick, COLORS.white, 0.5).beginPath();
        g.arc(arc.x, arc.y, arc.radius - thick / 2, start, end, false);
        g.strokePath();
      }
    }
    const mid = arc.radius - thick / 2;
    for (const dir of [-1, 1]) {
      const cloud = this.add.image(arc.x + dir * mid, arc.y + arc.band, 'cloud');
      cloud.setScale((thick * 2.1) / cloud.width);
    }
  }

  /** Banda `k` (0 la de fuera) de un gajo, entre los ángulos `start` y `end`. */
  private strokeBand(g: Phaser.GameObjects.Graphics, arc: Arc, k: number, start: number, end: number): void {
    g.lineStyle(arc.band + 0.5, BAND_COLORS[k]!).beginPath();
    g.arc(arc.x, arc.y, arc.radius - arc.band * (k + 0.5), start, end, false);
    g.strokePath();
  }

  /**
   * Pinta los gajos nuevos delante del niño: la cámara va al arco, cada gajo se colorea banda a banda,
   * de fuera adentro, con una nota y destellos, y al final llama a `done`. El final del mundo (paso 4 de
   * `docs/MUNDO-1.md`) puede encadenar aquí lo que pase con el último gajo.
   */
  private paintFresh(arc: Arc, fresh: readonly number[], done: () => void): void {
    const id = this.buildId;
    const cam = this.cameras.main;
    const g = this.add.graphics();
    const count = this.def.levelCount;
    const later = (ms: number, fn: () => void): void => {
      this.time.delayedCall(ms, () => {
        if (id === this.buildId) fn();
      });
    };
    this.tweens.add({
      targets: cam,
      scrollX: Phaser.Math.Clamp(arc.x - this.scale.width / 2, 0, this.maxScroll),
      duration: PAN_MS,
      ease: 'Sine.easeInOut',
    });
    let t = PAN_MS + 150;
    for (const level of fresh) {
      const { start, end } = bandAngles(level, count);
      for (let k = 0; k < BAND_COLORS.length; k++) {
        later(t, () => {
          this.strokeBand(g, arc, k, start, end);
          audio.sfx('band', { index: k });
          const a = (start + end) / 2;
          const r = arc.radius - arc.band * (k + 0.5);
          this.sparkle(arc.x + Math.cos(a) * r, arc.y + Math.sin(a) * r, BAND_COLORS[k]!);
        });
        t += BAND_MS;
      }
      t += BAND_GAP_MS;
    }
    later(t + HOLD_MS, done);
  }

  /**
   * Pinta las manchas nuevas del huevo delante del niño: la cámara va al huevo, que se mueve un poco, y
   * cada mancha aparece creciendo con una nota y destellos de su color; al final llama a `done`.
   */
  private paintFreshSpots(egg: Egg, g: Phaser.GameObjects.Graphics, fresh: readonly number[], done: () => void): void {
    const id = this.buildId;
    const later = (ms: number, fn: () => void): void => {
      this.time.delayedCall(ms, () => {
        if (id === this.buildId) fn();
      });
    };
    this.tweens.add({
      targets: this.cameras.main,
      scrollX: Phaser.Math.Clamp(egg.x - this.scale.width / 2, 0, this.maxScroll),
      duration: PAN_MS,
      ease: 'Sine.easeInOut',
    });
    let t = PAN_MS + 150;
    for (const level of fresh) {
      const spot = eggSpot(level);
      if (!spot) continue;
      later(t, () => {
        this.tweens.add({ targets: g, angle: { from: -4, to: 4 }, duration: 90, yoyo: true, repeat: 1, onComplete: () => g.setAngle(0) });
        const x = egg.x + spot.x * egg.size;
        const y = egg.y + spot.y * egg.size;
        const color = SPOT_HEX[spot.color];
        const grow = this.add.circle(x, y, spot.r * egg.size, color).setScale(0);
        audio.sfx('glyph', { index: (level - 1) % 5 });
        this.tweens.add({
          targets: grow,
          scale: 1,
          duration: SPOT_MS,
          ease: 'Back.easeOut',
          onComplete: () => {
            drawSpot(g, level, egg.size, true);
            grow.destroy();
          },
        });
        this.sparkle(x, y, color);
      });
      t += SPOT_MS + BAND_GAP_MS;
    }
    later(t + HOLD_MS, done);
  }

  /** Destello que crece, gira y se desvanece. */
  private sparkle(x: number, y: number, tint: number): void {
    for (let i = 0; i < 2; i++) {
      const s = this.add.image(x, y, 'sparkle').setTint(i === 0 ? tint : COLORS.white).setScale(0.6);
      const a = Math.random() * Math.PI * 2;
      this.tweens.add({
        targets: s,
        x: x + Math.cos(a) * 34,
        y: y + Math.sin(a) * 34,
        scale: 1.6,
        angle: 90,
        alpha: 0,
        duration: 520,
        ease: 'Quad.easeOut',
        onComplete: () => s.destroy(),
      });
    }
  }

  /** Hay una animación en marcha (gajos o final): un toque la acaba y los niveles no se abren. */
  private get busy(): boolean {
    return this.animating.length > 0 || this.inFinale;
  }

  /** Acabadas las animaciones: los niveles vuelven a abrirse y el zorro respira. */
  private ready(bob: () => void): void {
    this.animating = [];
    this.inFinale = false;
    for (const b of this.nodeButtons) b.setInteractive({ useHandCursor: true });
    bob();
  }

  /**
   * Final del mundo (`story/finale.ts`): Rufo salta de alegría sobre el último nivel, la viñeta de la
   * lluvia y el manantial y, al acabar, el candado de los mundos que se abren salta.
   */
  private playFinale(fox: Phaser.GameObjects.Container, at: Phaser.Math.Vector2, width: number, bob: () => void): void {
    const id = this.buildId;
    this.tweens.killTweensOf(fox);
    fox.setPosition(at.x, at.y);
    this.scrollTo(at.x - width / 2);
    audio.sfx('goal');
    this.tweens.add({ targets: fox, y: at.y - 46, duration: 260, yoyo: true, repeat: 2, repeatDelay: 80, ease: 'Quad.easeOut' });
    this.time.delayedCall(1300, () => {
      if (id !== this.buildId) return;
      const card = this.def.finale === 'hatch' ? new HatchFinale(this, width) : new Finale(this, width);
      card.play(() => {
        if (id !== this.buildId) return;
        const locks = this.unlocking.flatMap((w) => this.selectorLocks.get(w) ?? []);
        this.unlocking = [];
        if (locks.length === 0) return this.ready(bob);
        audio.sfx('prize');
        for (const [w, btn] of this.selectorButtons) if (locks.some((l) => (this.selectorLocks.get(w) ?? []).includes(l))) this.tweens.add({ targets: btn.face, alpha: 1, duration: 400 });
        // Al acabar se vuelve a montar el mapa, con esos mundos ya abiertos al tocarlos.
        this.tweens.add({ targets: locks, scale: 1.8, alpha: 0, angle: 25, duration: 600, ease: 'Back.easeIn', onComplete: () => id === this.buildId && this.rebuild() });
      });
    });
  }

  /** Tras pintar los gajos: la cámara vuelve al zorro, que salta al nivel actual; luego, todo listo para jugar. */
  private hopFox(fox: Phaser.GameObjects.Container, to: Phaser.Math.Vector2, width: number, done: () => void): void {
    const id = this.buildId;
    const cam = this.cameras.main;
    const from = new Phaser.Math.Vector2(fox.x, fox.y);
    const finish = (): void => {
      if (id !== this.buildId) return;
      this.animating = [];
      done();
    };
    this.tweens.add({
      targets: cam,
      scrollX: Phaser.Math.Clamp((from.x + to.x) / 2 - width / 2, 0, this.maxScroll),
      duration: PAN_MS,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        if (id !== this.buildId) return;
        if (from.distance(to) < 1) return finish();
        audio.sfx('jump');
        const hop = { t: 0 };
        const height = 90 + Math.abs(to.x - from.x) * 0.15;
        this.tweens.add({
          targets: hop,
          t: 1,
          duration: HOP_MS,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            fox.x = from.x + (to.x - from.x) * hop.t;
            fox.y = from.y + (to.y - from.y) * hop.t - Math.sin(hop.t * Math.PI) * height;
          },
          onComplete: finish,
        });
      },
    });
  }

  /** Flechas grandes a los lados: solo se ven si queda camino por ese lado. */
  private buildArrows(width: number): RoundButton[] {
    const y = GAME_H * 0.5;
    const arrow = (x: number, icon: string, dir: -1 | 1): RoundButton =>
      new RoundButton(this, x, y, {
        width: 88,
        color: COLORS.white,
        shadowColor: COLORS.shadow,
        icon,
        iconSize: 52,
        onTap: () => {
          const cam = this.cameras.main;
          const to = Phaser.Math.Clamp(cam.scrollX + dir * width * ARROW_STEP, 0, this.maxScroll);
          this.tweens.killTweensOf(cam);
          this.tweens.add({
            targets: cam,
            scrollX: to,
            duration: ARROW_MS,
            ease: 'Sine.easeInOut',
          });
        },
      });
    const left = arrow(24 + 44, 'icon-arrow-left', -1);
    const right = arrow(width - 24 - 44, 'icon-arrow-right', 1);
    this.arrows = { left, right };
    this.update();
    return [left, right];
  }

  /** Río ancho y azul bajo el camino, con un reflejo claro en el centro. */
  private drawRiver(points: Phaser.Math.Vector2[]): void {
    const spline = new Phaser.Curves.Spline(points).getPoints(200);
    const g = this.add.graphics();
    g.lineStyle(64, 0x8fd3ff).strokePoints(spline);
    g.lineStyle(18, 0xc9ecff).strokePoints(spline);
  }

  private drawPath(points: Phaser.Math.Vector2[]): void {
    if (points.length < 2) return;
    const spline = new Phaser.Curves.Spline(points);
    const g = this.add.graphics();
    g.lineStyle(30, COLORS.path);
    g.strokePoints(spline.getPoints(160));
    g.fillStyle(COLORS.path);
    for (const p of [points[0]!, points[points.length - 1]!]) g.fillCircle(p.x, p.y, 15);
    g.fillStyle(COLORS.pathDots);
    const dots = Math.floor(spline.getLength() / 22);
    for (const p of spline.getSpacedPoints(dots)) g.fillCircle(p.x, p.y, 3);
  }

  private buildNode(level: number, p: Phaser.Math.Vector2): void {
    const status = levelStatus(session, this.def, level);
    const last = level === this.def.levelCount;
    if (last) this.add.image(p.x + 46, p.y - 52, 'icon-flag').setOrigin(0.2, 0.9).setDisplaySize(64, 64);

    if (status === 'locked') {
      const btn: RoundButton = new RoundButton(this, p.x, p.y, {
        width: 96,
        color: COLORS.locked,
        shadowColor: COLORS.lockedDark,
        icon: 'icon-lock',
        iconSize: 44,
        onTap: () => btn.shake(),
      });
      this.nodeButtons.push(btn);
      return;
    }

    const play = (): void => goTo(this, 'Level', { world: this.def.id, level });
    if (status === 'current') {
      const halo = this.add.circle(p.x, p.y + 4, 66, COLORS.white, 0.55);
      this.tweens.add({
        targets: halo,
        scale: 1.08,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      this.nodeButtons.push(
        new RoundButton(this, p.x, p.y, {
          width: 112,
          color: COLORS.coral,
          shadowColor: COLORS.coralDark,
          shadowDepth: 9,
          label: String(level),
          labelSize: 64,
          labelColor: '#FFFFFF',
          onTap: play,
        }),
      );
      return;
    }

    if (status === 'pending') {
      // Jugado sin superar la prueba: amarillo, con un globo de Lalo con «?» y sin estrellas.
      this.nodeButtons.push(
        new RoundButton(this, p.x, p.y, {
          width: 96,
          color: COLORS.yellow,
          shadowColor: COLORS.yellowDark,
          label: String(level),
          labelSize: 54,
          onTap: play,
        }),
      );
      const bx = p.x + 50;
      const by = p.y - 50;
      const bubble = this.add.graphics();
      bubble.fillStyle(COLORS.shadow).fillCircle(bx, by + 4, 30);
      bubble.fillStyle(COLORS.white).fillCircle(bx, by, 30).fillTriangle(bx - 22, by + 12, bx - 8, by + 26, bx - 34, by + 32);
      this.add.image(bx - 6, by, 'lalo').setDisplaySize(30, 34);
      digits(this, bx + 14, by + 2, '?', 30, '#FF6B5E');
      return;
    }

    this.nodeButtons.push(
      new RoundButton(this, p.x, p.y, {
        width: 96,
        color: COLORS.grass,
        shadowColor: COLORS.grassDark,
        label: String(level),
        labelSize: 54,
        labelColor: '#FFFFFF',
        onTap: play,
      }),
    );
    const stars = session.worlds.get(this.def.id)?.stars.get(level) ?? 0;
    for (let i = 0; i < 3; i++) {
      this.add.image(p.x + (i - 1) * 34, p.y + 48 + 26, i < stars ? 'star' : 'star-empty').setDisplaySize(34, 34);
    }
  }

  /**
   * Castillo tras el último nivel: cerrado (con candado) hasta jugar ese nivel; abierto, con un halo; y,
   * ganada la medalla, verde y con ella al lado. Se vuelve a jugar desde aquí como un nivel, sin estrellas.
   */
  private buildCastle(p: Phaser.Math.Vector2, status: CastleStatus): void {
    const locked = status === 'locked';
    if (status === 'open') {
      const halo = this.add.circle(p.x, p.y + 4, 74, COLORS.white, 0.55);
      this.tweens.add({ targets: halo, scale: 1.08, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    const btn: RoundButton = new RoundButton(this, p.x, p.y, {
      width: 124,
      color: locked ? COLORS.locked : status === 'done' ? COLORS.grass : COLORS.white,
      shadowColor: locked ? COLORS.lockedDark : status === 'done' ? COLORS.grassDark : COLORS.shadow,
      shadowDepth: 8,
      icon: castleTexture(this.def.castle),
      iconSize: 100,
      onTap: () => (locked ? btn.shake() : goTo(this, 'Level', { world: this.def.id, castle: true })),
    });
    this.nodeButtons.push(btn);
    if (locked) {
      btn.face.setAlpha(0.75);
      btn.add([this.add.circle(40, -40, 24, COLORS.white), this.add.image(40, -41, 'icon-lock').setDisplaySize(30, 30)]);
    }
    if (status === 'done') {
      const medal = this.add.image(p.x + 64, p.y + 40, medalTexture(this.def.castle)).setDisplaySize(64, 64);
      this.tweens.add({ targets: medal, angle: { from: -8, to: 8 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private buildWorldSelector(width: number): Phaser.GameObjects.GameObject[] {
    const bw = 150;
    const bh = 96;
    const gap = 12;
    const pad = 12;
    const count = WORLDS.length + UPCOMING.length;
    const panelW = bw * count + gap * (count - 1) + pad * 2;
    const panelH = bh + pad * 2 + 8;
    const cy = GAME_H - 24 - panelH / 2;
    const g = this.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(width / 2 - panelW / 2, cy - panelH / 2 + 6, panelW, panelH, 44);
    g.fillStyle(COLORS.white).fillRoundedRect(width / 2 - panelW / 2, cy - panelH / 2, panelW, panelH, 44);
    const parts: Phaser.GameObjects.GameObject[] = [g];

    // Los mundos del registro, en su orden, y después los huecos de los que aún no existen.
    const worlds: (SelectorButton & { id?: WorldId; active?: boolean; access: WorldAccess })[] = [
      // Los mundos que abre el final en marcha se ven con candado hasta que acaba.
      ...WORLDS.map((w) => ({ ...w.selector, id: w.id, active: w.id === this.def.id, access: this.unlocking.includes(w.id) ? ('locked' as const) : this.access(w) })),
      ...UPCOMING.map((b) => ({ ...b, access: 'soon' as const })),
    ];
    worlds.forEach((w, i) => {
      const x = width / 2 - panelW / 2 + pad + bw / 2 + i * (bw + gap);
      const btn = new RoundButton(this, x, cy - 4, {
        width: bw,
        height: bh,
        radius: 32,
        color: w.color,
        shadowColor: w.shadow,
        shadowDepth: 6,
        border: w.active ? { width: 4, color: COLORS.coral } : undefined,
        label: w.label,
        labelSize: 48,
        icon: w.icon,
        iconSize: w.iconSize,
        onTap: () => {
          if (w.active) return;
          if (w.id && w.access === 'open') goTo(this, 'Map', { world: w.id });
          else btn.shake();
        },
      });
      if (w.access !== 'open') btn.face.setAlpha(0.7);
      if (w.id && session.worlds.get(w.id)?.medal) {
        // La medalla del castillo del mundo, en la esquina de su botón.
        btn.add(this.add.image(-bw / 2 + 14, -bh / 2 + 12, medalTexture(worldDef(w.id).castle)).setDisplaySize(42, 42));
      }
      if (w.access === 'locked') {
        // Candado pequeño en la esquina: se abrirá más adelante.
        const lock = this.add.circle(bw / 2 - 18, -bh / 2 + 18, 22, COLORS.white);
        const icon = this.add.image(bw / 2 - 18, -bh / 2 + 17, 'icon-lock').setDisplaySize(28, 28);
        btn.add([lock, icon]);
        if (w.id) this.selectorLocks.set(w.id, [lock, icon]);
      }
      if (w.id) this.selectorButtons.set(w.id, btn);
      parts.push(btn);
    });
    return parts;
  }
}
