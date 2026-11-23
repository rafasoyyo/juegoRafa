import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { COLORS, GAME_H, MAX_W } from '../config';
import { currentLevel, LEVEL_COUNT, levelStatus, session } from '../state';
import { drawFox, drawLalo } from '../ui/characters';
import { fitImage, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { cookieCounter } from '../ui/widgets';

/** Posición de los nodos en el artboard de diseño (1180×820); se escala al ancho real. */
const NODES: readonly [number, number][] = [
  [150, 530],
  [330, 440],
  [520, 530],
  [710, 390],
  [880, 490],
  [1040, 310],
];
const TREES: readonly [number, number][] = [
  [115, 450],
  [605, 370],
  [975, 680],
];
const DESIGN_W = 1180;
const DESIGN_H = 820;

/** Mapa del mundo de los números: 6 niveles en un camino, el zorro sobre el actual. */
export class MapScene extends Phaser.Scene {
  constructor() {
    super('Map');
  }

  create(): void {
    enter(this);
    audio.playMusic('map');
    this.build(this.scale.width);
    onResize(this, (w) => {
      this.tweens.killAll();
      this.children.removeAll(true);
      this.build(w);
    });
  }

  private build(width: number): void {
    const sx = width / DESIGN_W;
    const sy = GAME_H / DESIGN_H;
    const at = ([x, y]: readonly [number, number]): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x * sx, y * sy);

    this.add.image(0, 0, 'sky-map').setOrigin(0, 0).setDisplaySize(MAX_W, GAME_H);
    for (const t of TREES) {
      const p = at(t);
      this.add.image(p.x, p.y, 'tree').setOrigin(0.5, 1);
    }
    this.add.image(width * 0.39, 170, 'cloud');

    this.drawPath(NODES.map(at));

    const current = currentLevel(session) ?? LEVEL_COUNT;
    NODES.forEach((node, i) => this.buildNode(i + 1, at(node)));

    const foxAt = at(NODES[current - 1]!);
    const nodeR = levelStatus(session, current) === 'current' ? 56 : 48;
    const fox = drawFox(this, foxAt.x, foxAt.y - nodeR + 6, 'idle', session.hat, 104);
    this.tweens.add({ targets: fox, y: fox.y - 8, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Barra superior: galletas, Lalo y acceso a mi personaje.
    const counter = cookieCounter(this, 0, 76, session.cookies);
    counter.container.x = 32 + counter.width / 2;
    drawLalo(this, 32, 140);
    new RoundButton(this, width - 32 - 48, 76, {
      width: 96,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      icon: 'icon-fox-face',
      iconSize: 64,
      onTap: () => goTo(this, 'Wardrobe'),
    });
    this.buildMuteButton(width - 32 - 48 - 96 - 16, 76);

    this.buildWorldSelector(width);
  }

  /** Silencio total: altavoz normal o tachado (la forma cambia, no solo el color). */
  private buildMuteButton(x: number, y: number): void {
    const iconKey = (): string => (audio.muted ? 'icon-speaker-off' : 'icon-speaker');
    const icon = fitImage(this.add.image(0, 0, iconKey()), 52);
    new RoundButton(this, x, y, {
      width: 96,
      color: COLORS.white,
      shadowColor: COLORS.shadow,
      onTap: () => {
        audio.setMuted(!audio.muted);
        fitImage(icon.setTexture(iconKey()), 52);
      },
    }).addContent(icon);
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
      const btn = new RoundButton(this, p.x, p.y, {
        width: 96,
        color: COLORS.locked,
        shadowColor: COLORS.lockedDark,
        icon: 'icon-lock',
        iconSize: 44,
        onTap: () => btn.shake(),
      });
      return;
    }

    const play = (): void => goTo(this, 'Level', { level });
    if (status === 'current') {
      const halo = this.add.circle(p.x, p.y + 4, 66, COLORS.white, 0.55);
      this.tweens.add({ targets: halo, scale: 1.08, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      new RoundButton(this, p.x, p.y, {
        width: 112,
        color: COLORS.coral,
        shadowColor: COLORS.coralDark,
        shadowDepth: 9,
        label: String(level),
        labelSize: 64,
        labelColor: '#FFFFFF',
        onTap: play,
      });
      return;
    }

    new RoundButton(this, p.x, p.y, {
      width: 96,
      color: COLORS.grass,
      shadowColor: COLORS.grassDark,
      label: String(level),
      labelSize: 54,
      labelColor: '#FFFFFF',
      onTap: play,
    });
    const stars = session.stars.get(level) ?? 0;
    for (let i = 0; i < 3; i++) {
      this.add.image(p.x + (i - 1) * 34, p.y + 48 + 26, i < stars ? 'star' : 'star-empty').setDisplaySize(34, 34);
    }
  }

  private buildWorldSelector(width: number): void {
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

    const worlds: { color: number; shadow: number; label?: string; icon?: string; iconSize?: number; active?: boolean }[] = [
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
    });
  }
}
