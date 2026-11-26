import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H, MAX_W } from '../config';
import { FLAGS } from '../flags';
import { activeAge } from '../profile/active';
import { castleStatus, currentLevel, levelStatus, session, type CastleStatus } from '../state';
import { drawFox, drawLalo } from '../ui/characters';
import { digits, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { cookieCounter, fixToCamera } from '../ui/widgets';
import { worldAccess, type WorldAccess } from '../worlds/access';
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
    this.build(this.scale.width);
    onResize(this, (w) => {
      this.tweens.killAll();
      this.children.removeAll(true);
      this.build(w);
    });

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => {
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
    this.cameras.main.setBounds(0, 0, worldW, GAME_H);

    this.add.image(0, 0, map.sky).setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
    for (const d of map.decor) {
      const p = at(d.at);
      const img = this.add.image(p.x, p.y, d.key).setOrigin(0.5, 1);
      if (d.size > 0) img.setScale(d.size / Math.max(img.width, img.height));
    }
    for (const c of map.clouds) this.add.image(width * c.x, c.y, 'cloud').setScale(c.scale);

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
    const fox = drawFox(this, foxAt.x, foxAt.y - nodeR + 6, 'idle', session.hat, 104);
    this.tweens.add({
      targets: fox,
      y: fox.y - 8,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    // Se abre con el nivel actual centrado (o lo más centrado posible).
    this.scrollTo(foxAt.x - width / 2);

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
      icon: 'castle',
      iconSize: 100,
      onTap: () => (locked ? btn.shake() : goTo(this, 'Level', { world: this.def.id, castle: true })),
    });
    this.nodeButtons.push(btn);
    if (locked) {
      btn.face.setAlpha(0.75);
      btn.add([this.add.circle(40, -40, 24, COLORS.white), this.add.image(40, -41, 'icon-lock').setDisplaySize(30, 30)]);
    }
    if (status === 'done') {
      const medal = this.add.image(p.x + 64, p.y + 40, 'medal').setDisplaySize(64, 64);
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
      ...WORLDS.map((w) => ({ ...w.selector, id: w.id, active: w.id === this.def.id, access: this.access(w) })),
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
        btn.add(this.add.image(-bw / 2 + 14, -bh / 2 + 12, 'medal').setDisplaySize(42, 42));
      }
      if (w.access === 'locked') {
        // Candado pequeño en la esquina: se abrirá más adelante.
        const lock = this.add.circle(bw / 2 - 18, -bh / 2 + 18, 22, COLORS.white);
        const icon = this.add.image(bw / 2 - 18, -bh / 2 + 17, 'icon-lock').setDisplaySize(28, 28);
        btn.add([lock, icon]);
      }
      parts.push(btn);
    });
    return parts;
  }
}
