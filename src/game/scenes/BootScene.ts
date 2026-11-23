import Phaser from 'phaser';

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

    for (const pose of ['idle', 'jump', 'celebrate']) {
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
    svg('coin', 'coin', 56);
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
    svg('icon-flag', 'icon-flag', 56);
    svg('icon-fox-face', 'icon-fox-face', 64);
    svg('icon-no-hat', 'icon-no-hat', 72);
    svg('icon-glasses', 'icon-glasses', 60);
    svg('icon-cape', 'icon-cape', 60);
    svg('icon-colors', 'icon-colors', 60);
    svg('icon-shapes', 'icon-shapes', 96, 48);
  }

  create(): void {
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
    this.makeShowcase();

    // Espera a Baloo 2 para que los dígitos no se dibujen con la fuente de reserva.
    const fontReady = document.fonts?.load('800 48px "Baloo 2"') ?? Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS));
    void Promise.race([fontReady, timeout])
      .catch(() => undefined)
      .then(() => this.scene.start('Title'));
  }

  /** Degradado vertical de 720 px de alto; se estira a lo ancho al usarlo. */
  private makeGradient(key: string, stops: [number, string][]): void {
    const tex = this.textures.createCanvas(key, 8, 720);
    if (!tex) return;
    const ctx = tex.context;
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    for (const [at, color] of stops) grad.addColorStop(at, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 8, 720);
    tex.refresh();
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
