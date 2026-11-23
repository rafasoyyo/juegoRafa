import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { AMBIENTS, skyKey } from '../levels/ambients';
import { RUN_COLORS } from '../ui/run-cycle';

const FONT_TIMEOUT_MS = 3000;

/**
 * Carga los gráficos SVG propios (public/assets/svg/, ver LICENSES.md) al tamaño en que se
 * dibujan, crea los degradados de fondo y espera a la tipografía antes de abrir el juego.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.setPath('assets/svg/');
    const svg = (key: string, file: string, width: number, height = width): void => {
      this.load.svg(key, `${file}.svg`, { width, height });
    };

    for (const pose of ['idle', 'run', 'jump', 'celebrate']) {
      svg(`fox-${pose}`, `fox-${pose}`, 120);
      svg(`fox-${pose}-l`, `fox-${pose}`, 400);
    }
    for (const hat of ['cap', 'wool', 'party', 'helmet', 'crown']) {
      svg(`hat-${hat}`, `hat-${hat}`, 96);
      svg(`hat-${hat}-l`, `hat-${hat}`, 320);
    }
    svg('lalo', 'lalo', 84, 95);
    svg('lalo-blink', 'lalo-blink', 84, 95);

    svg('cloud', 'cloud', 180, 80);
    svg('tree', 'tree', 90, 120);
    svg('block', 'block', 84);
    svg('block-used', 'block-used', 84);
    svg('flag', 'flag', 80, 190);
    svg('cookie', 'cookie', 56);
    svg('strawberry', 'strawberry', 64);
    svg('hedgehog', 'hedgehog', 100, 70);
    svg('bee', 'bee', 90, 80);
    svg('bee-wing', 'bee-wing', 40, 30);
    svg('star', 'star', 40);
    svg('star-empty', 'star-empty', 40);
    svg('star-l', 'star', 170);
    svg('star-empty-l', 'star-empty', 170);

    svg('icon-home', 'icon-home', 48);
    svg('icon-arrow-left', 'icon-arrow-left', 56);
    svg('icon-arrow-right', 'icon-arrow-right', 56);
    svg('icon-arrow-up-white', 'icon-arrow-up-white', 84);
    svg('icon-next-white', 'icon-next-white', 88);
    svg('icon-play-white', 'icon-play-white', 96);
    svg('icon-map', 'icon-map', 52);
    svg('icon-replay', 'icon-replay', 52);
    svg('icon-check-white', 'icon-check-white', 64);
    svg('icon-lock', 'icon-lock', 48);
    svg('icon-speaker', 'icon-speaker', 50);
    svg('icon-speaker-off', 'icon-speaker-off', 50);
    svg('icon-flag', 'icon-flag', 56);
    svg('icon-fox-face', 'icon-fox-face', 64);
    svg('icon-no-hat', 'icon-no-hat', 72);
    svg('icon-glasses', 'icon-glasses', 60);
    svg('icon-cape', 'icon-cape', 60);
    svg('icon-colors', 'icon-colors', 60);
    svg('icon-shapes', 'icon-shapes', 96, 48);
  }

  create(): void {
    audio.init(this.game);
    this.makeGradient('sky', [
      [0, '#8FD3FF'],
      [0.7, '#E6F6FF'],
      [1, '#E6F6FF'],
    ]);
    this.makeGradient('sky-map', [
      [0, '#BDE9FF'],
      [0.55, '#CFF0C2'],
      [1, '#A9E3A0'],
    ]);
    for (const ambient of Object.values(AMBIENTS)) this.makeGradient(skyKey(ambient.id), ambient.sky);
    this.makeShowcase();
    this.makeDust();
    this.makeSparkle();
    this.makeDecor();

    // Espera a Baloo 2 para que los dígitos no se dibujen con la fuente de reserva.
    const fontReady = document.fonts?.load('800 48px "Baloo 2"') ?? Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS));
    void Promise.race([fontReady, timeout])
      .catch(() => undefined)
      .then(() => this.scene.start('Title'));
  }

  /** Degradado vertical de 720 px de alto; se estira a lo ancho al usarlo. */
  private makeGradient(key: string, stops: readonly (readonly [number, string])[]): void {
    const tex = this.textures.createCanvas(key, 8, 720);
    if (!tex) return;
    const ctx = tex.context;
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    for (const [at, color] of stops) grad.addColorStop(at, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 8, 720);
    tex.refresh();
  }

  /** Mota de polvo de la carrera: círculo crema (se tiñe y escala al usarlo). */
  private makeDust(): void {
    const g = this.make.graphics({}, false);
    g.fillStyle(RUN_COLORS.dust).fillCircle(16, 16, 16);
    g.generateTexture('dust', 32, 32);
    g.destroy();
  }

  /** Destello del modo invencible: estrella blanca de cuatro puntas redondeadas (se tiñe al usarlo). */
  private makeSparkle(): void {
    const g = this.make.graphics({}, false);
    const c = 16;
    const pts: Phaser.Math.Vector2[] = [];
    for (let k = 0; k < 8; k++) {
      const r = k % 2 === 0 ? 15 : 4.5;
      const a = -Math.PI / 2 + (k * Math.PI) / 4;
      pts.push(new Phaser.Math.Vector2(c + Math.cos(a) * r, c + Math.sin(a) * r));
    }
    g.fillStyle(0xffffff).fillPoints(pts, true);
    g.fillCircle(c, c, 5);
    g.generateTexture('sparkle', 32, 32);
    g.destroy();
  }

  /**
   * Decoración del fondo de los ambientes, propia y dibujada por código (ver LICENSES.md):
   * árbol verde, árbol de otoño, mata de flores, sol bajo, luna y estrella.
   */
  private makeDecor(): void {
    const g = this.make.graphics({}, false);
    const tree = (key: string, dark: number, light: number, accent: number): void => {
      g.clear();
      g.fillStyle(0x9a6a3f).fillRoundedRect(60, 120, 22, 80, 8);
      g.fillStyle(dark).fillCircle(70, 76, 62);
      g.fillStyle(dark).fillCircle(36, 108, 34).fillCircle(106, 104, 34);
      g.fillStyle(light).fillCircle(50, 88, 36);
      g.fillStyle(accent).fillCircle(96, 60, 14).fillCircle(74, 30, 10);
      g.generateTexture(key, 142, 200);
    };
    tree('decor-tree', 0x3fa652, 0x5cc46b, 0x6fd07c);
    tree('decor-tree-autumn', 0xd9772f, 0xf2a94a, 0xffd07a);

    // Mata de flores: arbusto redondeado con flores rosas, blancas y amarillas.
    g.clear();
    g.fillStyle(0x4aac55).fillEllipse(60, 52, 116, 52);
    g.fillStyle(0x5fbf63).fillEllipse(44, 44, 60, 34);
    const flowers: [number, number, number][] = [
      [22, 36, 0xff9ec4],
      [46, 22, 0xffffff],
      [70, 30, 0xff9ec4],
      [92, 40, 0xffffff],
      [58, 48, 0xffd23f],
      [34, 52, 0xffffff],
      [84, 56, 0xff9ec4],
    ];
    for (const [x, y, color] of flowers) {
      g.fillStyle(color);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        g.fillCircle(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5);
      }
      g.fillStyle(0xffd23f).fillCircle(x, y, 4);
    }
    g.generateTexture('decor-flowers', 120, 80);

    // Sol bajo del atardecer: crema pálido con halo, para que el zorro naranja y los bloques
    // amarillos destaquen siempre delante de él.
    g.clear();
    g.fillStyle(0xfff4e8, 0.3).fillCircle(140, 140, 140);
    g.fillStyle(0xfff0e0, 0.45).fillCircle(140, 140, 116);
    g.fillStyle(0xffe6d2).fillCircle(140, 140, 92);
    g.generateTexture('decor-sun', 280, 280);

    // Luna llena suave con un par de manchas.
    g.clear();
    g.fillStyle(0xfff4d6, 0.25).fillCircle(80, 80, 80);
    g.fillStyle(0xfff4d6).fillCircle(80, 80, 60);
    g.fillStyle(0xf0e2b8).fillCircle(60, 66, 12).fillCircle(98, 96, 9).fillCircle(92, 58, 6);
    g.generateTexture('decor-moon', 160, 160);

    // Estrella redondeada de cinco puntas.
    g.clear();
    const pts: Phaser.Math.Vector2[] = [];
    for (let k = 0; k < 10; k++) {
      const r = k % 2 === 0 ? 13 : 6;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      pts.push(new Phaser.Math.Vector2(14 + Math.cos(a) * r, 14 + Math.sin(a) * r));
    }
    g.fillStyle(0xfff4d6).fillPoints(pts, true);
    g.fillCircle(14, 14, 5);
    g.generateTexture('decor-star', 28, 28);
    g.destroy();
  }

  /** Escaparate redondeado de «mi personaje»: cielo y suelo recortados con esquinas redondas. */
  private makeShowcase(): void {
    const w = 400;
    const h = 664;
    const tex = this.textures.createCanvas('showcase', w, h);
    if (!tex) return;
    const ctx = tex.context;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 44);
    ctx.clip();
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#8FD3FF');
    sky.addColorStop(0.8, '#E6F6FF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const groundTop = 530;
    ctx.fillStyle = '#C98A58';
    ctx.fillRect(0, groundTop, w, h - groundTop);
    ctx.fillStyle = '#3FA652';
    ctx.fillRect(0, groundTop, w, 36);
    ctx.fillStyle = '#5CC46B';
    ctx.fillRect(0, groundTop, w, 30);
    tex.refresh();
  }
}
