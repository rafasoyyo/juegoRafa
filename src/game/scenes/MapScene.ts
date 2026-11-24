import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H, MAX_W } from '../config';
import { currentLevel, LEVEL_COUNT, levelStatus, session } from '../state';
import { drawFox, drawLalo } from '../ui/characters';
import { digits, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { cookieCounter, fixToCamera } from '../ui/widgets';

/**
 * Posición de los nodos en el artboard de diseño (dos pantallas de 1180×820); se escala con el ancho
 * real de una pantalla. Los 6 primeros llenan la primera pantalla y los otros 6 siguen el camino.
 */
const NODES: readonly [number, number][] = [
  [150, 530],
  [330, 440],
  [520, 530],
  [710, 390],
  [880, 490],
  [1040, 310],
  [1220, 470],
  // Como mucho a la altura de los más bajos de la primera pantalla: más abajo, el selector de mundos
  // taparía sus estrellas.
  [1400, 530],
  [1580, 420],
  [1760, 520],
  [1940, 370],
  [2150, 480],
];
/** Adornos del fondo: árboles en la primera mitad y algunos de los ambientes nuevos en la segunda. */
const DECOR: readonly { at: [number, number]; key: string; size: number }[] = [
  { at: [115, 450], key: 'tree', size: 0 },
  { at: [605, 370], key: 'tree', size: 0 },
  { at: [975, 680], key: 'tree', size: 0 },
  { at: [1310, 360], key: 'decor-palm', size: 150 },
  { at: [1480, 720], key: 'tree', size: 0 },
  { at: [1690, 330], key: 'decor-pine-snow', size: 120 },
  { at: [1860, 690], key: 'decor-cactus', size: 105 },
  { at: [2290, 700], key: 'tree', size: 0 },
];
const DESIGN_W = 1180;
const DESIGN_H = 820;
/** El mapa mide dos pantallas de ancho. */
const SCREENS = 2;
/** Lo que hay que mover el dedo para que un toque pase a ser un arrastre del mapa, en px. */
const DRAG_THRESHOLD = 12;
/** Las flechas desplazan el mapa esta fracción del ancho visible. */
const ARROW_STEP = 0.7;
const ARROW_MS = 450;
const HUD_DEPTH = 100;

/**
 * Mapa del mundo de los números: 12 niveles en un camino más ancho que la pantalla, el zorro sobre el
 * actual. Se desplaza arrastrando o con las flechas; el contador, Lalo, mi personaje y el selector de
 * mundos quedan fijos.
 */
export class MapScene extends Phaser.Scene {
  /** Botones que se mueven con el mapa: un arrastre cancela su toque. */
  private nodeButtons: RoundButton[] = [];
  private arrows?: { left: RoundButton; right: RoundButton };
  private maxScroll = 0;
  private drag?: { startX: number; startScroll: number; dragging: boolean };

  constructor() {
    super('Map');
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

  private scrollTo(x: number): void {
    this.cameras.main.scrollX = Phaser.Math.Clamp(x, 0, this.maxScroll);
  }

  private build(width: number): void {
    const sx = width / DESIGN_W;
    const sy = GAME_H / DESIGN_H;
    const at = ([x, y]: readonly [number, number]): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x * sx, y * sy);
    const worldW = width * SCREENS;
    this.maxScroll = worldW - width;
    this.nodeButtons = [];
    this.cameras.main.setBounds(0, 0, worldW, GAME_H);

    this.add.image(0, 0, 'sky-map').setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H).setScrollFactor(0);
    for (const d of DECOR) {
      const p = at(d.at);
      const img = this.add.image(p.x, p.y, d.key).setOrigin(0.5, 1);
      if (d.size > 0) img.setScale(d.size / Math.max(img.width, img.height));
    }
    this.add.image(width * 0.39, 170, 'cloud');
    this.add.image(width * 1.45, 150, 'cloud').setScale(0.9);

    this.drawPath(NODES.map(at));

    const current = currentLevel(session) ?? LEVEL_COUNT;
    NODES.forEach((node, i) => this.buildNode(i + 1, at(node)));

    const foxAt = at(NODES[current - 1]!);
    const nodeR = levelStatus(session, current) === 'current' ? 56 : 48;
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
    const status = levelStatus(session, level);
    const last = level === LEVEL_COUNT;
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

    const play = (): void => goTo(this, 'Level', { level });
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
    const stars = session.stars.get(level) ?? 0;
    for (let i = 0; i < 3; i++) {
      this.add.image(p.x + (i - 1) * 34, p.y + 48 + 26, i < stars ? 'star' : 'star-empty').setDisplaySize(34, 34);
    }
  }

  private buildWorldSelector(width: number): Phaser.GameObjects.GameObject[] {
    const bw = 150;
    const bh = 96;
    const gap = 12;
    const pad = 12;
    const panelW = bw * 4 + gap * 3 + pad * 2;
    const panelH = bh + pad * 2 + 8;
    const cy = GAME_H - 24 - panelH / 2;
    const g = this.add.graphics();
    g.fillStyle(COLORS.shadow).fillRoundedRect(width / 2 - panelW / 2, cy - panelH / 2 + 6, panelW, panelH, 44);
    g.fillStyle(COLORS.white).fillRoundedRect(width / 2 - panelW / 2, cy - panelH / 2, panelW, panelH, 44);
    const parts: Phaser.GameObjects.GameObject[] = [g];

    const worlds: {
      color: number;
      shadow: number;
      label?: string;
      icon?: string;
      iconSize?: number;
      active?: boolean;
    }[] = [
      { color: 0xffe9e6, shadow: 0xf2c4bd, label: '123', active: true },
      { color: 0xf1ecfb, shadow: 0xd9cfe0, label: 'Aa' },
      { color: 0xe4f4e8, shadow: 0xbfe0c6, icon: 'icon-shapes', iconSize: 88 },
      { color: 0xe8edf3, shadow: 0xc9d3de, icon: 'icon-lock', iconSize: 42 },
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
          if (!w.active) btn.shake();
        },
      });
      if (!w.active && w.label) btn.face.setAlpha(0.7);
      parts.push(btn);
    });
    return parts;
  }
}
