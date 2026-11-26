import Phaser from 'phaser';
import type { ChallengeTally } from '../../learning/challenges/ladder';
import { audio } from '../audio/audio-engine';
import { COLORS } from '../config';
import type { AmbientId } from '../levels/types';
import { skyKey } from '../levels/ambients';
import { activeAge, activeAlias } from '../profile/active';
import { drawLalo } from '../ui/characters';
import { LaloBubble } from '../ui/lalo-bubble';
import {
  drawAmbientThumb,
  drawBasket,
  drawCross,
  drawDots,
  drawObject,
  drawProgressMark,
  drawQuizPictogram,
  drawShape,
  drawTopic,
} from '../ui/quiz-art';
import { drawExtraVisual } from '../ui/quiz/art';
import { createView } from '../ui/quiz/views';
import { VIEW_KINDS, type DrawResult, type QuizView, type ViewState } from '../ui/quiz/view';
import { digits, RoundButton } from '../ui/round-button';
import { enter, goTo, onResize } from '../ui/transition';
import { addSky } from '../ui/widgets';
import { clampLevel, worldDef } from '../worlds/registry';
import type { WorldDef, WorldId } from '../worlds/types';
import {
  ageBand,
  createRng,
  createRun,
  currentQuestion,
  dimmedOptions,
  fillLevels,
  generateQuiz,
  GUIDE_TEXT,
  type HintKind,
  isFinished,
  marks,
  result,
  tap,
  usedOptions,
  visualKey,
  type LevelRecap,
  type Question,
  type QuizKind,
  type QuizRun,
  type TapEvent,
  type Visual,
} from '../../learning/quiz';
import type { LevelCompleteData } from './LevelCompleteScene';

/** Datos con los que se abre la prueba: el mundo del nivel y lo que pasó en él. */
export type QuizData = Partial<LevelRecap> & { world?: WorldId; challenges?: ChallengeTally };

/** Ancho útil como mucho: en pantallas muy alargadas la prueba se centra. */
const MAX_USEFUL_W = 1200;
const DEMO_STEP_MS = 520;
const NEXT_QUESTION_MS = 750;
const SHOW_ANSWER_MS = 2000;
const END_MS = 700;

type Point = { x: number; y: number };

interface Area {
  top: number;
  bottom: number;
}

/** Zonas de la pantalla (en y lógica) para el modelo y para las respuestas de cada tipo de prueba. */
const AREAS: Record<QuizKind, { prompt: Area; options: Area; cell: [number, number] }> = {
  count: { prompt: { top: 140, bottom: 450 }, options: { top: 480, bottom: 690 }, cell: [160, 160] },
  compare: { prompt: { top: 130, bottom: 250 }, options: { top: 270, bottom: 690 }, cell: [330, 380] },
  series: { prompt: { top: 170, bottom: 420 }, options: { top: 470, bottom: 690 }, cell: [160, 160] },
  shapes: { prompt: { top: 130, bottom: 290 }, options: { top: 310, bottom: 700 }, cell: [150, 150] },
  'name-letters': { prompt: { top: 150, bottom: 380 }, options: { top: 420, bottom: 700 }, cell: [140, 140] },
  recall: { prompt: { top: 130, bottom: 400 }, options: { top: 430, bottom: 690 }, cell: [190, 190] },
  // Las pruebas nuevas las coloca su vista (`ui/quiz/`); estas zonas solo valen si la vista no da la suya.
  share: { prompt: { top: 150, bottom: 400 }, options: { top: 450, bottom: 690 }, cell: [160, 200] },
  order: { prompt: { top: 150, bottom: 400 }, options: { top: 450, bottom: 690 }, cell: [140, 150] },
  'cable-car': { prompt: { top: 150, bottom: 520 }, options: { top: 545, bottom: 700 }, cell: [150, 150] },
  tracks: { prompt: { top: 150, bottom: 690 }, options: { top: 190, bottom: 690 }, cell: [400, 120] },
  balance: { prompt: { top: 150, bottom: 580 }, options: { top: 590, bottom: 705 }, cell: [150, 108] },
  mirror: { prompt: { top: 150, bottom: 480 }, options: { top: 500, bottom: 705 }, cell: [200, 190] },
  // Río de los números.
  fingers: { prompt: { top: 150, bottom: 480 }, options: { top: 500, bottom: 700 }, cell: [150, 150] },
  'ten-frame': { prompt: { top: 150, bottom: 480 }, options: { top: 500, bottom: 700 }, cell: [150, 150] },
  memory: { prompt: { top: 150, bottom: 440 }, options: { top: 470, bottom: 700 }, cell: [130, 156] },
  neighbor: { prompt: { top: 170, bottom: 420 }, options: { top: 470, bottom: 690 }, cell: [160, 160] },
  'number-line': { prompt: { top: 150, bottom: 560 }, options: { top: 560, bottom: 700 }, cell: [96, 150] },
  biggest: { prompt: { top: 130, bottom: 260 }, options: { top: 300, bottom: 690 }, cell: [200, 200] },
  'ten-friends': { prompt: { top: 150, bottom: 480 }, options: { top: 500, bottom: 700 }, cell: [150, 150] },
  train: { prompt: { top: 150, bottom: 600 }, options: { top: 600, bottom: 700 }, cell: [120, 120] },
  socks: { prompt: { top: 150, bottom: 450 }, options: { top: 470, bottom: 700 }, cell: [200, 200] },
  'frog-jumps': { prompt: { top: 150, bottom: 560 }, options: { top: 560, bottom: 700 }, cell: [96, 150] },
  boats: { prompt: { top: 150, bottom: 400 }, options: { top: 450, bottom: 690 }, cell: [140, 150] },
  // El repaso dibuja cada pregunta con las zonas de su propio tipo.
  'river-review': { prompt: { top: 150, bottom: 480 }, options: { top: 500, bottom: 700 }, cell: [150, 150] },
};

interface OptionView {
  id: number;
  button: RoundButton;
  /** Posiciones (en coordenadas de la escena) de los objetos de un grupo, para la pista de emparejar. */
  objects: Point[];
}

/**
 * Prueba de la bandera: tres preguntas del tipo del nivel, adaptadas a la edad del perfil.
 * La lógica (qué es correcto, intentos, pistas, resultado) está en `src/learning/quiz/`; aquí solo se
 * dibuja y se anima.
 */
export class QuizScene extends Phaser.Scene {
  private def!: WorldDef;
  private recap!: LevelRecap;
  /** Retos del recorrido acertados a la primera, para las estrellas (se pasa tal cual). */
  private challenges?: ChallengeTally;
  private kind: QuizKind = 'count';
  /** Tipo de la pregunta en pantalla: el de la prueba salvo en el repaso, que mezcla varios. */
  private qkind: QuizKind = 'count';
  private run!: QuizRun;
  private seed = 1;
  private width = 0;
  private left = 0;
  private usefulW = 0;

  /** Mientras hay una animación, los toques no cuentan (para no perder intentos). */
  private busy = false;
  private shownIndex = -1;
  private demoDone = new Set<number>();
  /** Bocadillo de Lalo abierto: la pregunta queda en pausa (sin respuestas, demostración ni pistas). */
  private guideOpen = false;
  private bubble: LaloBubble | null = null;

  private layer!: Phaser.GameObjects.Container;
  private lalo!: Phaser.GameObjects.Container;
  private options: OptionView[] = [];
  /** Objetos del modelo (para la pista de contar) y huecos/elementos de la fila (para la serie y el nombre). */
  private promptObjects: Point[] = [];
  private rowCells: { x: number; y: number; size: number }[] = [];
  private promptAnchor: Point = { x: 0, y: 0 };
  private modelFrame: { x: number; y: number; size: number } | null = null;
  private collected = 0;
  /** Demostración en curso: se cancela si empieza otra o si cambia la pregunta. */
  private demoChain: Phaser.Tweens.TweenChain | null = null;
  private demoArrow: Phaser.GameObjects.Graphics | null = null;
  /** Vista de las pruebas nuevas (`null` en las seis antiguas, que se dibujan aquí). */
  private view: QuizView | null = null;
  private drawResult: DrawResult | null = null;
  private willDemo = false;
  private viewTopLayer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('Quiz');
  }

  init(data: QuizData): void {
    this.def = worldDef(data?.world);
    const level = clampLevel(this.def, data?.level);
    this.recap = {
      level,
      ambient: data?.ambient ?? 'prado',
      hedgehogs: data?.hedgehogs ?? 0,
      bees: data?.bees ?? 0,
      cookies: data?.cookies ?? 0,
      blocksHit: data?.blocksHit ?? 0,
      blocksTotal: data?.blocksTotal ?? 0,
    };
    this.challenges = data?.challenges;
    this.kind = this.def.quizFor(level);
    this.seed = (Date.now() ^ (level * 7919)) >>> 0;
    const questions = generateQuiz(this.kind, ageBand(activeAge()), createRng(this.seed), {
      alias: activeAlias(),
      recap: this.recap,
      // «¿Te acuerdas?» pregunta por los paisajes de este mundo.
      ambients: [...new Set(this.def.levels.map((l) => l.ambient))],
    });
    this.run = createRun(questions);
    this.busy = false;
    this.guideOpen = false;
    this.bubble = null;
    this.view = null;
    this.drawResult = null;
    this.shownIndex = -1;
    this.demoDone = new Set();
  }

  create(): void {
    enter(this);
    audio.stopMusic(200);
    this.build(this.scale.width);
    // Esc cierra el bocadillo; el listener se quita al apagar la escena.
    const onEsc = (): void => this.bubble?.close();
    this.input.keyboard?.on('keydown-ESC', onEsc);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.input.keyboard?.off('keydown-ESC', onEsc));
    onResize(this, (w) => {
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.children.removeAll(true);
      this.busy = false;
      this.build(w);
    });
  }

  /** Gancho para la voz de la consigna (fase 2). Sin voces no hace nada. */
  private speak(_kind: QuizKind): void {}

  // --- Construcción ------------------------------------------------------------------------------

  private build(width: number): void {
    this.width = width;
    this.usefulW = Math.min(width - 64, MAX_USEFUL_W);
    this.left = (width - this.usefulW) / 2;

    // El cielo del nivel, salvo en «¿Te acuerdas?»: ahí delataría el paisaje que se pregunta.
    const sky = skyKey(this.recap.ambient as AmbientId);
    addSky(this, this.kind !== 'recall' && this.textures.exists(sky) ? sky : 'sky');
    this.lalo = drawLalo(this, 32, 24, { question: true });
    // Tocar a Lalo abre el bocadillo del adulto (la demostración se repite desde ahí).
    const laloImg = this.lalo.list[0] as Phaser.GameObjects.Image;
    laloImg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (!this.busy && !this.guideOpen && !isFinished(this.run)) this.openGuide();
    });

    const picto = drawQuizPictogram(this, this.kind, 96);
    picto.setPosition(width - 32 - 48, 24 + 48);

    this.layer = this.add.container(0, 0);
    this.drawMarks();
    this.showQuestion();

    // El bocadillo va el último para quedar por encima de todo; si estaba abierto al girar, se vuelve a abrir.
    this.bubble = new LaloBubble(this, width, this.scale.height, { x: 76, y: 122 }, {
      onClose: () => {
        this.guideOpen = false;
      },
      onReplay: () => this.demo(),
    });
    if (this.guideOpen) this.bubble.open(GUIDE_TEXT[this.kind]);
  }

  private openGuide(): void {
    this.guideOpen = true;
    this.stopDemo();
    this.bubble?.open(GUIDE_TEXT[this.kind]);
  }

  private drawMarks(): void {
    const ms = marks(this.run);
    const y = 24 + 48;
    ms.forEach((m, i) => {
      const mark = drawProgressMark(this, m, i === this.run.index && m === 'pending');
      mark.setPosition(this.width / 2 + (i - 1) * 80, y);
      mark.setName('mark');
    });
  }

  private redrawMarks(): void {
    for (const c of this.children.list.filter((o) => o.name === 'mark')) c.destroy();
    this.drawMarks();
  }

  private stopDemo(): void {
    this.demoChain?.stop();
    this.demoChain = null;
    this.demoArrow?.destroy();
    this.demoArrow = null;
  }

  private viewState(): ViewState {
    return { used: usedOptions(this.run), fills: fillLevels(this.run), dimmed: dimmedOptions(this.run) };
  }

  private showQuestion(): void {
    this.stopDemo();
    this.view?.destroy();
    this.view = null;
    this.drawResult = null;
    this.layer.removeAll(true);
    this.options = [];
    this.promptObjects = [];
    this.rowCells = [];
    this.modelFrame = null;
    this.collected = 0;

    const q = currentQuestion(this.run);
    if (!q) {
      this.finish();
      return;
    }
    const firstTime = this.shownIndex !== this.run.index;
    this.shownIndex = this.run.index;
    this.willDemo = firstTime && !this.demoDone.has(this.run.index);
    const rng = createRng(this.seed + this.run.index * 101);
    this.qkind = q.kind;
    if (VIEW_KINDS.includes(q.kind)) {
      const top = this.add.container(0, 0);
      this.viewTopLayer = top;
      this.view = createView(q.kind, { scene: this, layer: this.layer, top, width: this.width, usefulW: this.usefulW, state: () => this.viewState() });
    }
    this.drawPrompt(q, rng);
    this.drawOptions(q);
    if (this.view) {
      const buttons = new Map(this.options.map((o) => [o.id, o.button] as const));
      this.view.attach(buttons);
    }
    this.restoreProgress(q);

    if (firstTime && !this.demoDone.has(this.run.index)) {
      this.demoDone.add(this.run.index);
      this.speak(this.kind);
      // Pequeña pausa para que el niño vea la pregunta antes de la demostración.
      this.busy = true;
      this.time.delayedCall(350, () => this.demo());
    }
  }

  /** Tras recolocar la pantalla, vuelve a mostrar lo ya conseguido en la pregunta actual. */
  private restoreProgress(q: Question): void {
    const used = usedOptions(this.run);
    // Las vistas nuevas ya dibujan lo conseguido al recolocar la pantalla.
    if (!this.view) for (const id of used) this.markUsed(q, id, false);
    for (const id of dimmedOptions(this.run)) this.dimOption(id, false);
  }

  // --- Modelo (parte de arriba) -------------------------------------------------------------------

  private drawPrompt(q: Question, rng: ReturnType<typeof createRng>): void {
    if (this.view) {
      this.drawResult = this.view.draw(q, this.willDemo);
      this.promptAnchor = this.drawResult.anchor;
      return;
    }
    const area = AREAS[this.qkind].prompt;
    const cx = this.width / 2;
    const cy = (area.top + area.bottom) / 2;
    const h = area.bottom - area.top;
    this.promptAnchor = { x: cx, y: cy };
    const p = q.prompt;

    switch (p.layout) {
      case 'scatter':
      case 'rows':
      case 'tenframes': {
        const item = p.items[0] as Extract<Visual, { type: 'objects' }>;
        this.drawCountables(item, p.layout, cx, cy, h, rng);
        break;
      }
      case 'basket': {
        const b = drawBasket(this, (p.items[0] as Extract<Visual, { type: 'basket' }>).full, h * 0.8);
        b.setPosition(cx, cy + h * 0.1);
        this.layer.add(b);
        break;
      }
      case 'model': {
        const size = Math.min(h, 160);
        const frame = this.add.graphics();
        frame.fillStyle(COLORS.shadow).fillRoundedRect(cx - size / 2, cy - size / 2 + 8, size, size, 30);
        frame.fillStyle(COLORS.white).fillRoundedRect(cx - size / 2, cy - size / 2, size, size, 30);
        frame.lineStyle(6, COLORS.coral).strokeRoundedRect(cx - size / 2, cy - size / 2, size, size, 30);
        const v = p.items[0] as Extract<Visual, { type: 'shape' }>;
        const shape = drawShape(this, v.shape, v.color, size * 0.62, v.angle).setPosition(cx, cy);
        this.layer.add([frame, shape]);
        this.modelFrame = { x: cx, y: cy, size };
        break;
      }
      case 'row':
        this.drawRow(q, cx, cy, h);
        break;
      case 'think': {
        const g = this.add.graphics();
        const bw = Math.min(360, this.usefulW * 0.5);
        const bh = h * 0.8;
        g.fillStyle(COLORS.white).fillEllipse(cx, cy, bw, bh);
        // Burbujas pequeñas hacia Lalo.
        g.fillCircle(cx - bw * 0.55, cy - bh * 0.35, 20).fillCircle(cx - bw * 0.72, cy - bh * 0.55, 12);
        const v = p.items[0]!;
        const content = this.drawVisual(v, bh * 0.62, bh * 0.62);
        content.setPosition(cx - bw * 0.12, cy);
        const qmark = digits(this, cx + bw * 0.25, cy, '?', bh * 0.45, '#FF6B5E');
        this.layer.add([g, content, qmark]);
        break;
      }
    }
  }

  /** Objetos que hay que contar: sueltos (≤5), en filas de 5 o en marcos de 10. */
  private drawCountables(item: Extract<Visual, { type: 'objects' }>, layout: string, cx: number, cy: number, h: number, rng: ReturnType<typeof createRng>): void {
    const n = item.count;
    const positions: Point[] = [];
    let size: number;
    if (layout === 'scatter') {
      // Rejilla de 4×2 celdas con un poco de desorden, sin que se toquen.
      size = Math.min(110, h * 0.36);
      const cols = 4;
      const rows = 2;
      const cellW = Math.min(this.usefulW * 0.8, 640) / cols;
      const cellH = h / rows;
      const cells = rng.shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, n);
      for (const c of cells) {
        const col = c % cols;
        const row = Math.floor(c / cols);
        positions.push({
          x: cx - (cols * cellW) / 2 + cellW * (col + 0.5) + rng.int(-12, 12),
          y: cy - h / 2 + cellH * (row + 0.5) + rng.int(-10, 10),
        });
      }
    } else if (layout === 'rows') {
      size = Math.min(96, h * 0.3);
      const step = size * 1.25;
      for (let i = 0; i < n; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        positions.push({ x: cx - 2 * step + col * step, y: cy - step / 2 + row * step });
      }
    } else {
      // Marcos de 10 (2 filas de 5); dos marcos lado a lado para más de 10.
      const frames = Math.ceil(n / 10);
      const cell = Math.min(64, (this.usefulW - 60) / (frames * 5 + 1), h / 2.4);
      size = cell * 0.82;
      const frameW = cell * 5;
      const gap = cell * 0.8;
      const totalW = frames * frameW + (frames - 1) * gap;
      const g = this.add.graphics();
      for (let f = 0; f < frames; f++) {
        const fx = cx - totalW / 2 + f * (frameW + gap);
        const fy = cy - cell;
        g.fillStyle(COLORS.white, 0.9).fillRoundedRect(fx - 6, fy - 6, frameW + 12, cell * 2 + 12, 12);
        g.lineStyle(3, COLORS.ink, 0.5);
        for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) g.strokeRect(fx + c * cell, fy + r * cell, cell, cell);
        for (let i = f * 10; i < Math.min(n, f * 10 + 10); i++) {
          const k = i - f * 10;
          positions.push({ x: fx + (k % 5) * cell + cell / 2, y: fy + Math.floor(k / 5) * cell + cell / 2 });
        }
      }
      this.layer.add(g);
    }
    for (const p of positions) this.layer.add(drawObject(this, item.object, size).setPosition(p.x, p.y));
    // De izquierda a derecha (y de arriba abajo) para la pista de contar.
    this.promptObjects = positions.sort((a, b) => a.x - b.x || a.y - b.y);
  }

  /** Fila de la serie o del alias, con hueco, letra destacada o casillas para ordenar. */
  private drawRow(q: Question, cx: number, cy: number, h: number): void {
    const items = q.prompt.items;
    const n = items.length;
    const size = Math.min(q.kind === 'name-letters' ? 110 : 120, h * 0.6, (this.usefulW - 20) / n - 12);
    const step = size + 12;
    const x0 = cx - ((n - 1) * step) / 2;
    const g = this.add.graphics();
    this.layer.add(g);
    items.forEach((v, i) => {
      const x = x0 + i * step;
      this.rowCells.push({ x, y: cy, size });
      if (i === q.prompt.holeIndex) {
        g.fillStyle(COLORS.white, 0.6).fillRoundedRect(x - size / 2, cy - size / 2, size, size, 18);
        g.lineStyle(5, COLORS.coral).strokeRoundedRect(x - size / 2, cy - size / 2, size, size, 18);
        this.layer.add(digits(this, x, cy, '?', size * 0.6, '#FF6B5E'));
        return;
      }
      const highlighted = i === q.prompt.highlightIndex;
      g.fillStyle(highlighted ? COLORS.yellow : COLORS.white, highlighted ? 1 : 0.85).fillRoundedRect(x - size / 2, cy - size / 2, size, size, 18);
      if (highlighted) {
        // Además del color: más grande y subrayada.
        g.fillStyle(COLORS.coral).fillRoundedRect(x - size * 0.3, cy + size / 2 + 8, size * 0.6, 10, 5);
      }
      if (v.type === 'letter' && v.char === '') {
        g.lineStyle(4, COLORS.ink, 0.35).strokeRoundedRect(x - size / 2, cy - size / 2, size, size, 18);
        return;
      }
      const content = this.drawVisual(v, size * (highlighted ? 1.05 : 0.9), size * (highlighted ? 1.05 : 0.9));
      content.setPosition(x, cy);
      this.layer.add(content);
    });
  }

  // --- Respuestas ---------------------------------------------------------------------------------

  private drawOptions(q: Question): void {
    const res = this.drawResult;
    // Las respuestas `scene` van dentro del dibujo, en el hueco que da la vista; el resto, en fila.
    const rowOptions = this.view ? q.options.filter((o) => !res?.slots.has(o.id)) : q.options;
    if (res) {
      for (const o of q.options) {
        const slot = res.slots.get(o.id);
        if (!slot) continue;
        const button = new RoundButton(this, slot.x, slot.y, {
          width: slot.w,
          height: slot.h,
          radius: slot.radius ?? 24,
          color: slot.color ?? COLORS.white,
          shadowColor: slot.shadow ?? COLORS.shadow,
          sound: false,
          onTap: () => this.onTap(o.id),
        });
        if (slot.ghost) {
          (button.list[0] as Phaser.GameObjects.Graphics).setVisible(false);
          button.face.setAlpha(0);
        } else {
          button.addContent(this.drawVisual(o.visual, slot.w - 20, slot.h - 20));
        }
        this.layer.add(button);
        this.options.push({ id: o.id, button, objects: [] });
      }
    }
    this.drawRowOptions(rowOptions, res?.rowArea);
    if (this.view) {
      this.options.sort((a, b) => a.id - b.id);
      // Lo que vuela o se anima sobre las respuestas va encima de los botones.
      this.layer.add(this.viewTop());
    }
  }

  private viewTop(): Phaser.GameObjects.Container {
    return this.viewTopLayer!;
  }

  /** Respuestas en fila(s): en la zona del tipo de prueba o en la que pide la vista. */
  private drawRowOptions(opts: Question['options'], rowArea?: DrawResult['rowArea']): void {
    const n = opts.length;
    if (n === 0) return;
    const base = AREAS[this.qkind];
    const area = rowArea ?? base.options;
    const availW = rowArea?.w ?? this.usefulW;
    const centerX = rowArea?.cx ?? this.width / 2;
    let [cw, ch] = rowArea?.cell ?? base.cell;
    if (opts.some((o) => o.visual.type === 'ambient')) cw = 250;
    const gap = 24;
    const maxCols = Math.max(1, Math.floor((availW + gap) / (cw + gap)));
    // Repartir en filas equilibradas (8 → 4+4, 10 → 5+5).
    const rows = Math.ceil(n / maxCols);
    const cols = Math.ceil(n / rows);
    const areaH = area.bottom - area.top;
    const rowH = Math.min(ch + gap, areaH / rows);
    ch = Math.min(ch, rowH - gap);
    cw = Math.min(cw, (availW - (cols - 1) * gap) / cols);
    const totalH = rows * rowH - gap;
    const y0 = area.top + (areaH - totalH) / 2 + ch / 2;

    opts.forEach((o, i) => {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, n - row * cols);
      const col = i - row * cols;
      const x = centerX + (col - (inRow - 1) / 2) * (cw + gap);
      const y = y0 + row * rowH;
      const button = new RoundButton(this, x, y, {
        width: cw,
        height: ch,
        radius: 28,
        color: COLORS.white,
        shadowColor: COLORS.shadow,
        sound: false,
        onTap: () => this.onTap(o.id),
      });
      const objects: Point[] = [];
      const content = this.drawVisual(o.visual, cw - 20, ch - 20, objects);
      button.addContent(content);
      this.layer.add(button);
      this.options.push({ id: o.id, button, objects: objects.map((p) => ({ x: p.x + x, y: p.y + y })) });
    });
  }

  /** Dibuja un `Visual` centrado en (0, 0) dentro de w×h. `objects` recibe las posiciones de un grupo. */
  private drawVisual(v: Visual, w: number, h: number, objects: Point[] = []): Phaser.GameObjects.Container {
    const s = Math.min(w, h);
    switch (v.type) {
      case 'objects': {
        // Tamaño base fijo por el `scale` del grupo: un grupo con objetos grandes ocupa más aunque tenga menos.
        let size = 80 * v.scale;
        let cols = Math.ceil(Math.sqrt(v.count * (w / h)));
        let rows = Math.ceil(v.count / cols);
        let cell = size * 1.18;
        const fit = Math.min(1, (w * 0.95) / (cols * cell), (h * 0.95) / (rows * cell));
        size *= fit;
        cell *= fit;
        cols = Math.min(cols, v.count);
        rows = Math.ceil(v.count / cols);
        const parts: Phaser.GameObjects.GameObject[] = [];
        for (let i = 0; i < v.count; i++) {
          const x = (i % cols) * cell - ((cols - 1) * cell) / 2;
          const y = Math.floor(i / cols) * cell - ((rows - 1) * cell) / 2;
          parts.push(drawObject(this, v.object, size).setPosition(x, y));
          objects.push({ x, y });
        }
        return this.add.container(0, 0, parts);
      }
      case 'object':
        return this.add.container(0, 0, [drawObject(this, v.object, s * 0.75)]);
      case 'digit':
        return this.add.container(0, 0, [digits(this, 0, 0, String(v.value), s * 0.6)]);
      case 'dots':
        return drawDots(this, v.value, s * 0.72);
      case 'letter':
        return this.add.container(0, 0, [digits(this, 0, 0, v.char, s * 0.62)]);
      case 'shape':
        return drawShape(this, v.shape, v.color, s * 0.7 * v.scale, v.angle);
      case 'ambient':
        return drawAmbientThumb(this, v.id, w * 0.92, h * 0.88);
      case 'topic':
        return drawTopic(this, v.icon, s * 0.7);
      case 'basket':
        return drawBasket(this, v.full, s * 0.8);
      default:
        return drawExtraVisual(this, v, w, h) ?? this.add.container();
    }
  }

  private optionView(id: number): OptionView | undefined {
    return this.options.find((o) => o.id === id);
  }

  // --- Toques -------------------------------------------------------------------------------------

  private onTap(id: number): void {
    if (this.busy || this.guideOpen || isFinished(this.run)) return;
    const q = currentQuestion(this.run)!;
    const ev = tap(this.run, id);
    this.react(q, ev);
  }

  private react(q: Question, ev: TapEvent): void {
    switch (ev.type) {
      case 'ignored':
        return;
      case 'progress':
        audio.sfx('cookie');
        if (this.view) this.view.onProgress?.(ev.option);
        else this.markUsed(q, ev.option, true);
        return;
      case 'correct':
        audio.sfx('star', { index: Math.min(2, this.run.index) });
        if (q.answer.form !== 'choice') {
          if (this.view) this.view.onProgress?.(ev.option);
          else this.markUsed(q, ev.option, true);
        }
        this.celebrate(ev.option);
        const onCorrect = this.view?.onCorrect?.bind(this.view);
        if (onCorrect) {
          // La vista cuenta el resultado (la balanza se suelta, Rufo recorre las huellas…) antes de seguir.
          const view = this.view;
          this.busy = true;
          this.redrawMarks();
          void onCorrect(ev.option).then(() => {
            if (this.view === view) this.afterQuestion(NEXT_QUESTION_MS);
          });
        } else {
          this.afterQuestion(NEXT_QUESTION_MS);
        }
        return;
      case 'wrong':
        audio.sfx('nope');
        if (!this.view?.onWrong?.(ev.option)) this.wobble(ev.option);
        this.busy = true;
        this.time.delayedCall(320, () => {
          if (ev.level === 1) this.demo();
          else this.hint(q, ev.hint, ev.option, ev.dimmed);
        });
        return;
      case 'failed':
        audio.sfx('nope');
        if (!this.view?.onWrong?.(ev.option)) this.wobble(ev.option);
        this.busy = true;
        this.redrawMarks();
        this.time.delayedCall(300, () => this.showAnswer(ev.answer));
        this.afterQuestion(SHOW_ANSWER_MS + 300);
        return;
    }
  }

  private afterQuestion(delay: number): void {
    this.busy = true;
    this.redrawMarks();
    this.time.delayedCall(delay, () => {
      this.busy = false;
      if (isFinished(this.run)) this.finish();
      else this.showQuestion();
    });
  }

  private finish(): void {
    if (!isFinished(this.run)) return;
    this.busy = true;
    const { passed } = result(this.run);
    this.time.delayedCall(END_MS, () => {
      const data: LevelCompleteData = {
        world: this.def.id,
        level: this.recap.level,
        blocksHit: this.recap.blocksHit,
        blocksTotal: this.recap.blocksTotal,
        cookies: this.recap.cookies,
        challenges: this.challenges,
        passed,
      };
      goTo(this, 'LevelComplete', data);
    });
  }

  // --- Animaciones --------------------------------------------------------------------------------

  /** Lalo celebra y la opción acertada da un salto. */
  private celebrate(id: number): void {
    const laloImg = this.lalo.list[0] as Phaser.GameObjects.Image;
    this.tweens.add({ targets: laloImg, y: -22, duration: 160, yoyo: true, repeat: 1, ease: 'Quad.easeOut', onComplete: () => (laloImg.y = 0) });
    const view = this.optionView(id);
    if (!view) return;
    const halo = this.add.circle(view.button.x, view.button.y, Math.max(view.button.btnWidth, view.button.btnHeight) * 0.6, COLORS.yellow, 0.45);
    this.layer.addAt(halo, 0);
    this.tweens.add({ targets: view.button, y: view.button.y - 24, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: halo, scale: 1.3, alpha: 0, duration: 600 });
  }

  /** Rebote suave de la opción tocada por error. */
  private wobble(id: number): void {
    const view = this.optionView(id);
    if (!view) return;
    const x = view.button.x;
    this.tweens.add({ targets: view.button, x: x + 12, duration: 60, yoyo: true, repeat: 2, ease: 'Sine.easeInOut', onComplete: () => (view.button.x = x) });
  }

  /** Pieza bien tocada en una pregunta de tocar varias: se marca y su copia vuela al modelo o a su casilla. */
  private markUsed(q: Question, id: number, animate: boolean): void {
    const view = this.optionView(id);
    if (!view) return;
    view.button.disableInteractive();
    view.button.face.setAlpha(0.35);
    const check = this.add.graphics();
    check.lineStyle(10, COLORS.grassDark).beginPath().moveTo(-18, 0).lineTo(-4, 14).lineTo(22, -14).strokePath();
    view.button.addContent(check);

    const opt = q.options.find((o) => o.id === id)!;
    let target: { x: number; y: number; size: number };
    if (q.answer.form === 'multi' && q.answer.ordered) {
      const cell = this.rowCells[this.collected];
      if (!cell) return;
      target = cell;
    } else if (this.modelFrame) {
      // Las piezas cazadas se juntan en fila bajo el marco del modelo.
      const f = this.modelFrame;
      const size = 72;
      target = { x: f.x + f.size / 2 + 30 + size / 2 + this.collected * (size + 6), y: f.y, size };
    } else {
      return;
    }
    this.collected += 1;
    const copy = this.drawVisual(opt.visual, target.size * 0.95, target.size * 0.95);
    this.layer.add(copy);
    if (!animate) {
      copy.setPosition(target.x, target.y);
      return;
    }
    copy.setPosition(view.button.x, view.button.y);
    this.tweens.add({ targets: copy, x: target.x, y: target.y, duration: 380, ease: 'Back.easeOut' });
  }

  private dimOption(id: number, animate: boolean): void {
    const view = this.optionView(id);
    if (!view) return;
    const s = Math.min(view.button.btnWidth, view.button.btnHeight) * 0.55;
    view.button.face.setAlpha(0.3);
    view.button.addContent(drawCross(this, s));
    if (animate) this.tweens.add({ targets: view.button, scale: 0.92, duration: 200, yoyo: true });
  }

  /** Flecha que señala un punto: se crea, se mueve con `moveArrow` y se borra al acabar. */
  private makeArrow(): Phaser.GameObjects.Graphics {
    const g = this.add.graphics();
    g.fillStyle(COLORS.coral).fillRoundedRect(-9, -64, 18, 34, 6).fillTriangle(-26, -30, 26, -30, 0, 0);
    g.lineStyle(4, COLORS.white).strokeTriangle(-26, -30, 26, -30, 0, 0);
    // Dentro de la capa de la pregunta: se borra con ella.
    this.layer.add(g);
    return g;
  }

  /** Demostración: la flecha recorre el modelo y luego las respuestas. Bloquea los toques mientras dura. */
  private demo(): void {
    if (isFinished(this.run) || this.guideOpen) return;
    this.stopDemo();
    this.busy = true;
    const view = this.view;
    if (view?.intro) {
      // Escena previa (el teleférico): al acabar, la flecha señala las respuestas.
      void view.intro().then(() => {
        if (this.view === view && !this.guideOpen && !isFinished(this.run)) this.arrowDemo();
        else if (this.view === view) this.busy = false;
      });
      return;
    }
    this.arrowDemo();
  }

  private arrowDemo(): void {
    this.busy = true;
    const stops: Point[] = [{ x: this.promptAnchor.x, y: this.promptAnchor.y - 40 }];
    const q = currentQuestion(this.run)!;
    const dimmed = dimmedOptions(this.run);
    const used = usedOptions(this.run);
    const opts = this.options.filter((o) => !dimmed.has(o.id) && !used.has(o.id));
    // Con muchas piezas basta con señalar unas cuantas.
    const shown = q.options.length > 5 ? opts.filter((_, i) => i % 2 === 0).slice(0, 4) : opts;
    for (const o of shown) stops.push({ x: o.button.x, y: o.button.y - o.button.btnHeight / 2 - 4 });
    const arrow = this.makeArrow().setPosition(stops[0]!.x, stops[0]!.y - 60).setAlpha(0);
    const chain: Phaser.Types.Tweens.TweenBuilderConfig[] = [{ targets: arrow, alpha: 1, y: stops[0]!.y, duration: 260 }];
    for (const s of stops.slice(1)) {
      chain.push({ targets: arrow, x: s.x, y: s.y, duration: DEMO_STEP_MS * 0.6, ease: 'Sine.easeInOut', hold: DEMO_STEP_MS * 0.4 });
    }
    chain.push({ targets: arrow, alpha: 0, duration: 200 });
    this.demoArrow = arrow;
    this.demoChain = this.tweens.chain({
      tweens: chain,
      onComplete: () => {
        this.stopDemo();
        this.busy = false;
      },
    });
  }

  /** La pista propia de la prueba (2.º fallo). */
  private hint(q: Question, kind: string, tapped: number, dimmed?: number): void {
    if (this.guideOpen) {
      this.busy = false;
      return;
    }
    if (this.view && kind !== 'dim-wrong') {
      // La pista propia de las pruebas nuevas la anima su vista.
      const view = this.view;
      void view.hint(kind as HintKind, { question: q, tapped, dimmed }).then(() => {
        if (this.view === view) this.busy = false;
      });
      return;
    }
    const done = (ms: number): void => {
      this.time.delayedCall(ms, () => (this.busy = false));
    };
    switch (kind) {
      case 'count-up': {
        // Los objetos se iluminan uno a uno, de izquierda a derecha.
        this.promptObjects.forEach((p, i) => {
          const halo = this.add.circle(p.x, p.y, 46, COLORS.yellow, 0.7).setScale(0);
          this.layer.addAt(halo, 0);
          this.tweens.add({ targets: halo, scale: 1, delay: i * 380, duration: 220, ease: 'Back.easeOut' });
          this.tweens.add({ targets: halo, alpha: 0, delay: this.promptObjects.length * 380 + 900, duration: 400, onComplete: () => halo.destroy() });
        });
        done(this.promptObjects.length * 380 + 300);
        return;
      }
      case 'pair-up': {
        // Se unen los objetos de los grupos de uno en uno; los que sobran brillan.
        const groups = this.options.map((o) => o.objects);
        const pairs = Math.min(...groups.map((g) => g.length));
        const g = this.add.graphics().setDepth(40);
        let step = 0;
        for (let i = 0; i < pairs; i++) {
          this.time.delayedCall(i * 220, () => {
            g.lineStyle(6, COLORS.purple, 0.8);
            g.beginPath();
            groups.forEach((grp, k) => (k === 0 ? g.moveTo(grp[i]!.x, grp[i]!.y) : g.lineTo(grp[i]!.x, grp[i]!.y)));
            g.strokePath();
          });
          step = i + 1;
        }
        const glowAt = step * 220 + 200;
        for (const grp of groups) {
          for (const p of grp.slice(pairs)) {
            const halo = this.add.circle(p.x, p.y, 30, COLORS.yellow, 0.75).setDepth(39).setScale(0);
            this.tweens.add({ targets: halo, scale: 1, delay: glowAt, duration: 240, ease: 'Back.easeOut' });
            this.tweens.add({ targets: halo, alpha: 0, delay: glowAt + 1600, duration: 400, onComplete: () => halo.destroy() });
          }
        }
        this.time.delayedCall(glowAt + 1600, () => this.tweens.add({ targets: g, alpha: 0, duration: 400, onComplete: () => g.destroy() }));
        done(glowAt + 400);
        return;
      }
      case 'rhythm': {
        // Un arco sobre cada repetición del patrón.
        const items = q.prompt.items;
        const period = seriesPeriod(items, q.prompt.holeIndex);
        const g = this.add.graphics().setDepth(40);
        const cells = this.rowCells;
        let n = 0;
        for (let start = 0; start < cells.length; start += period) {
          const a = cells[start]!;
          const b = cells[Math.min(cells.length - 1, start + period - 1)]!;
          const top = a.y - a.size / 2 - 14;
          this.time.delayedCall(n * 420, () => {
            g.lineStyle(7, COLORS.purple, 0.85);
            g.beginPath();
            g.arc((a.x + b.x) / 2, top + 40, Math.max(40, (b.x - a.x) / 2 + a.size * 0.4), Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340));
            g.strokePath();
          });
          n++;
        }
        this.time.delayedCall(n * 420 + 1400, () => this.tweens.add({ targets: g, alpha: 0, duration: 400, onComplete: () => g.destroy() }));
        done(n * 420 + 200);
        return;
      }
      case 'misfit': {
        // La pieza tocada vuela sobre el modelo para que se vea que no encaja, y vuelve.
        const view = this.optionView(tapped);
        const f = this.modelFrame;
        const opt = q.options.find((o) => o.id === tapped);
        if (!view || !f || !opt) return done(0);
        const ghost = this.drawVisual(opt.visual, f.size * 0.85, f.size * 0.85).setPosition(view.button.x, view.button.y).setDepth(45).setAlpha(0.85);
        this.tweens.chain({
          tweens: [
            { targets: ghost, x: f.x, y: f.y, duration: 420, ease: 'Sine.easeInOut' },
            { targets: ghost, angle: 12, duration: 90, yoyo: true, repeat: 3 },
            { targets: ghost, x: view.button.x, y: view.button.y, alpha: 0, duration: 420, ease: 'Sine.easeInOut', delay: 300 },
          ],
          onComplete: () => ghost.destroy(),
        });
        done(1400);
        return;
      }
      case 'dim-wrong':
      default:
        if (dimmed !== undefined) this.dimOption(dimmed, true);
        done(400);
        return;
    }
  }

  /** Tras el 3.er fallo: Lalo señala la respuesta durante 2 s. */
  private showAnswer(ids: number[]): void {
    this.stopDemo();
    if (this.view?.showAnswer?.(ids)) return;
    const views = ids.map((id) => this.optionView(id)).filter((v): v is OptionView => !!v);
    const first = views[0];
    for (const v of views) {
      const halo = this.add.circle(v.button.x, v.button.y, Math.max(v.button.btnWidth, v.button.btnHeight) * 0.6, COLORS.yellow, 0.6);
      this.layer.addAt(halo, 0);
      this.tweens.add({ targets: halo, scale: 1.12, duration: 400, yoyo: true, repeat: -1 });
    }
    if (!first) return;
    const arrow = this.makeArrow().setPosition(first.button.x, first.button.y - first.button.btnHeight / 2 - 4);
    this.tweens.add({ targets: arrow, y: arrow.y - 16, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
}

/** Longitud de la unidad que se repite en una serie (sin contar el hueco); 1 si no hay ninguna (serie creciente). */
export function seriesPeriod(items: Visual[], hole?: number): number {
  const keys = items.map(visualKey);
  for (let p = 2; p <= Math.floor(keys.length / 2); p++) {
    let ok = true;
    for (let i = p; i < keys.length && ok; i++) {
      if (i === hole || i % p === hole) continue;
      if (keys[i] !== keys[i % p]) ok = false;
    }
    if (ok) return p;
  }
  return 1;
}
