import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import { AMBIENTS, skyKey } from '../levels/ambients';
import { CONES_PER_TILE, SPIKE_CONE_H, STEEL } from '../levels/spikes';
import { TILE } from '../levels/types';
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
    svg('frog', 'frog', 84, 66);
    svg('crab', 'crab', 96, 62);
    svg('snail', 'snail', 100, 76);
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
    svg('icon-ten-frame', 'icon-ten-frame', 112, 48);
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
    this.makeTravelDecor();
    this.makeSpikes();

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

  /**
   * Decoración de los ambientes de los niveles 7 a 12, propia y dibujada por código (ver LICENSES.md):
   * palmera, hoja grande, liana, pico nevado, pino nevado, copo, cactus redondeado y arcoíris. Estilo
   * plano y sin contornos; `addScenery` la pone detrás del recorrido y más apagada.
   */
  private makeTravelDecor(): void {
    const g = this.make.graphics({}, false);
    const v = (x: number, y: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x, y);

    // Palmera: tronco curvo de anillos, copa de hojas alargadas y dos cocos.
    g.clear();
    for (let k = 0; k < 9; k++) {
      const t = k / 8;
      const x = 62 + 26 * t * t;
      const y = 236 - t * 150;
      g.fillStyle(k % 2 === 0 ? 0xb8875a : 0xa57549).fillEllipse(x, y, 30 - t * 6, 24);
    }
    const crown = { x: 88, y: 84 };
    const fronds: [number, number, number][] = [
      [-2.7, 82, 0x3f9f5a],
      [-2.1, 78, 0x4fb468],
      [-1.4, 70, 0x5cc46b],
      [-0.7, 80, 0x4fb468],
      [-0.1, 84, 0x3f9f5a],
      [0.6, 62, 0x4fb468],
      [2.5, 62, 0x5cc46b],
    ];
    for (const [a, len, color] of fronds) {
      const tip = v(crown.x + Math.cos(a) * len, crown.y + Math.sin(a) * len + len * 0.25);
      const mid = v(crown.x + Math.cos(a) * len * 0.55, crown.y + Math.sin(a) * len * 0.55 - 10);
      const nx = -Math.sin(a) * 13;
      const ny = Math.cos(a) * 13;
      g.fillStyle(color).fillPoints([v(crown.x, crown.y), v(mid.x + nx, mid.y + ny), tip, v(mid.x - nx, mid.y - ny)], true);
    }
    g.fillStyle(0x8a5a32).fillCircle(80, 92, 9).fillCircle(96, 94, 9);
    g.generateTexture('decor-palm', 180, 250);

    // Hoja grande de la selva: óvalo con nervio central y nervios laterales claros.
    g.clear();
    g.fillStyle(0x2f8f4e).fillRoundedRect(76, 150, 10, 70, 5);
    g.fillStyle(0x3a9f58).fillEllipse(80, 96, 120, 176);
    g.fillStyle(0x56b86c).fillEllipse(70, 90, 70, 130);
    g.lineStyle(5, 0x8fd49a, 0.9).lineBetween(80, 22, 80, 176);
    for (let k = 0; k < 5; k++) {
      const y = 50 + k * 26;
      g.lineStyle(3, 0x8fd49a, 0.7).lineBetween(80, y + 10, 40 + k * 2, y - 8).lineBetween(80, y + 10, 120 - k * 2, y - 8);
    }
    g.generateTexture('decor-leaf', 160, 220);

    // Liana: cuerda ondulada que cuelga con hojitas.
    g.clear();
    g.lineStyle(7, 0x5d8a3a);
    g.beginPath();
    for (let y = 0; y <= 300; y += 10) {
      const x = 30 + Math.sin(y / 38) * 10;
      if (y === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.strokePath();
    for (let k = 0; k < 6; k++) {
      const y = 40 + k * 46;
      const x = 30 + Math.sin(y / 38) * 10;
      const side = k % 2 === 0 ? 1 : -1;
      g.fillStyle(k % 2 === 0 ? 0x4fb468 : 0x3f9f5a).fillEllipse(x + side * 14, y + 4, 26, 14);
    }
    g.fillStyle(0x5cc46b).fillCircle(30 + Math.sin(300 / 38) * 10, 300, 10);
    g.generateTexture('decor-vine', 60, 312);

    // Pico nevado: montaña redondeada azul grisácea con la cima blanca festoneada.
    g.clear();
    g.fillStyle(0x9fb4cf).fillPoints([v(0, 300), v(170, 40), v(200, 30), v(230, 40), v(400, 300)], true);
    g.fillStyle(0x8aa2c0).fillPoints([v(200, 30), v(230, 40), v(400, 300), v(250, 300)], true);
    g.fillStyle(0xf7fbff).fillPoints([v(140, 86), v(170, 40), v(200, 30), v(230, 40), v(262, 88)], true);
    for (const [x, r] of [
      [150, 16],
      [178, 18],
      [208, 17],
      [238, 18],
      [256, 12],
    ] as const) {
      g.fillCircle(x, 86, r);
    }
    g.generateTexture('decor-peak', 400, 300);

    // Pino nevado: tres pisos redondeados con nieve encima.
    g.clear();
    g.fillStyle(0x8a6040).fillRoundedRect(52, 170, 18, 36, 6);
    const tiers: [number, number, number][] = [
      [120, 170, 56],
      [82, 132, 46],
      [44, 92, 34],
    ];
    for (const [top, bottom, half] of tiers) {
      g.fillStyle(0x3c8f66).fillPoints([v(61 - half, bottom), v(61, top - 18), v(61 + half, bottom)], true);
      g.fillStyle(0x3c8f66).fillEllipse(61, bottom - 2, half * 2, 16);
      g.fillStyle(0xf7fbff).fillEllipse(61, top - 4, half * 0.9, 18);
      g.fillStyle(0xf7fbff).fillEllipse(61 - half * 0.5, bottom - 8, half * 0.7, 12);
      g.fillStyle(0xf7fbff).fillEllipse(61 + half * 0.5, bottom - 8, half * 0.7, 12);
    }
    g.fillStyle(0xf7fbff).fillCircle(61, 22, 10);
    g.generateTexture('decor-pine-snow', 122, 206);

    // Copo de nieve: un punto blanco suave (se escala al usarlo).
    g.clear();
    g.fillStyle(0xffffff, 0.5).fillCircle(10, 10, 10);
    g.fillStyle(0xffffff).fillCircle(10, 10, 6);
    g.generateTexture('decor-flake', 20, 20);

    // Cactus redondeado sin pinchos: tronco y dos brazos con las puntas redondas, verde apagado.
    g.clear();
    const cactus = 0x7fae76;
    const cactusLight = 0x95c08a;
    g.fillStyle(cactus).fillRoundedRect(46, 20, 40, 190, 20);
    g.fillStyle(cactus).fillRoundedRect(10, 76, 28, 74, 14).fillRoundedRect(10, 128, 50, 24, 12);
    g.fillStyle(cactus).fillRoundedRect(96, 50, 28, 70, 14).fillRoundedRect(72, 98, 52, 24, 12);
    g.fillStyle(cactusLight).fillRoundedRect(56, 32, 10, 160, 5);
    g.generateTexture('decor-cactus', 134, 212);

    // Arcoíris: seis bandas pastel en semicírculo, de fuera adentro. Al doble de resolución para que el
    // arco grande del nivel 12 (`horizon-rainbow.ts`) se vea nítido; las miniaturas lo reducen.
    g.clear();
    const bands = [0xff9b93, 0xffc27a, 0xffe58a, 0x9fdc8f, 0x8fc7f2, 0xb9a6ee];
    bands.forEach((color, k) => {
      g.lineStyle(44, color).beginPath();
      g.arc(600, 600, 560 - k * 44, Math.PI, 0, false);
      g.strokePath();
    });
    g.generateTexture('decor-rainbow', 1200, 624);
    g.destroy();
  }

  /**
   * Pinchos: una baldosa (84 px) con 3 conos de acero de punta afilada, cada uno con tres caras (luz,
   * media y sombra) y un reflejo blanco, sin contorno. Se repite a lo ancho de cada foso, con la base
   * sobre la placa del fondo. Y su destello: una estrella blanca de cuatro puntas finas.
   */
  private makeSpikes(): void {
    const g = this.make.graphics({}, false);
    const v = (x: number, y: number): Phaser.Math.Vector2 => new Phaser.Math.Vector2(x, y);
    const w = TILE / CONES_PER_TILE;
    const h = SPIKE_CONE_H;
    const half = w / 2 - 1;
    for (let k = 0; k < CONES_PER_TILE; k++) {
      const cx = w * k + w / 2;
      const tip = v(cx, 0);
      // Caras de izquierda a derecha: luz, media y sombra, todas hasta la punta.
      g.fillStyle(STEEL.light).fillPoints([tip, v(cx - half, h), v(cx - half * 0.3, h)], true);
      g.fillStyle(STEEL.mid).fillPoints([tip, v(cx - half * 0.3, h), v(cx + half * 0.35, h)], true);
      g.fillStyle(STEEL.dark).fillPoints([tip, v(cx + half * 0.35, h), v(cx + half, h)], true);
      // Reflejo: una línea fina en la cara de luz, que no llega a la punta ni a la base.
      g.fillStyle(0xffffff, 0.7).fillPoints([v(cx - 1.5, 7), v(cx - 0.5, 8), v(cx - half * 0.55, h - 5), v(cx - half * 0.7, h - 5)], true);
    }
    g.generateTexture('spikes', TILE, h);
    g.clear();

    const c = 14;
    const pts: Phaser.Math.Vector2[] = [];
    for (let k = 0; k < 8; k++) {
      const r = k % 2 === 0 ? 13 : 2.5;
      const a = -Math.PI / 2 + (k * Math.PI) / 4;
      pts.push(v(c + Math.cos(a) * r, c + Math.sin(a) * r));
    }
    g.fillStyle(0xffffff).fillPoints(pts, true);
    g.fillCircle(c, c, 3);
    g.generateTexture('spike-glint', 2 * c, 2 * c);
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
