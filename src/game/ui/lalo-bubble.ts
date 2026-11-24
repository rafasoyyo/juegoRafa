import Phaser from 'phaser';
import { COLORS, FONT, INK_CSS } from '../config';
import type { GuideText } from '../../learning/quiz';
import { RoundButton } from './round-button';

/** Alto lógico de la pantalla (720) sobre el alto mínimo de un móvil horizontal (390): 44 px reales ≈ 81 lógicos. */
const TOUCH = 84;
const DEPTH = 100;

export interface LaloBubbleOptions {
  /** Se llama al cerrar el bocadillo, sea cual sea la forma. */
  onClose: () => void;
  /** Se llama al tocar «ver otra vez», después de cerrarlo. */
  onReplay: () => void;
}

/**
 * Bocadillo de cómic de Lalo para el adulto: fondo atenuado que cierra al tocarlo, etiqueta, nombre de la
 * prueba, objetivo, frase, X y «ver otra vez». No se cierra solo.
 */
export class LaloBubble {
  private readonly root: Phaser.GameObjects.Container;
  private opened = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly width: number,
    private readonly height: number,
    /** Punto al que apunta la cola: la boca de Lalo. */
    private readonly tail: { x: number; y: number },
    private readonly opts: LaloBubbleOptions,
  ) {
    this.root = scene.add.container(0, 0).setDepth(DEPTH).setVisible(false);
  }

  get isOpen(): boolean {
    return this.opened;
  }

  open(text: GuideText): void {
    if (this.opened) return;
    this.opened = true;
    this.root.removeAll(true);
    this.build(text);
    this.root.setVisible(true).setAlpha(0);
    this.scene.tweens.add({ targets: this.root, alpha: 1, duration: 120 });
  }

  /** Cierra sin avisar a la escena (para limpiar al reconstruirla). */
  hide(): void {
    this.opened = false;
    this.root.setVisible(false);
    this.root.removeAll(true);
  }

  close(): void {
    if (!this.opened) return;
    this.hide();
    this.opts.onClose();
  }

  private replay(): void {
    if (!this.opened) return;
    this.hide();
    this.opts.onClose();
    this.opts.onReplay();
  }

  private build(text: GuideText): void {
    const { width: W, height: H } = this;
    const bw = Math.round(Math.min(W * 0.57, 820));
    const bh = 470;
    const bx = Math.round(Math.max(W * 0.155, this.tail.x + 90));
    const by = 150;

    // Fondo atenuado: tocar fuera cierra, y ese toque no llega a nada que haya debajo.
    const dim = this.scene.add.rectangle(0, 0, W, H, COLORS.ink, 0.55).setOrigin(0, 0);
    dim.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.close());

    const g = this.scene.add.graphics();
    // Cola hacia Lalo.
    const tx = this.tail.x;
    const ty = this.tail.y;
    g.fillStyle(COLORS.ink).fillTriangle(bx - 6, by + 30, bx + 90, by - 4, tx, ty);
    g.fillStyle(COLORS.white).fillTriangle(bx + 2, by + 38, bx + 82, by + 6, tx + 2, ty + 4);
    g.fillStyle(COLORS.ink).fillRoundedRect(bx - 6, by - 6, bw + 12, bh + 12, 40);
    g.fillStyle(COLORS.white).fillRoundedRect(bx, by, bw, bh, 36);
    // Tapa la unión de la cola con el borde.
    g.fillStyle(COLORS.white).fillRect(bx - 2, by + 36, 8, 60);

    // Absorbe los toques dentro del bocadillo (no cierran).
    const body = this.scene.add.rectangle(bx, by, bw, bh, 0xffffff, 0).setOrigin(0, 0).setInteractive();

    const pad = 40;
    const tagW = 250;
    const tag = this.scene.add.graphics();
    tag.fillStyle(COLORS.purpleSoft).fillRoundedRect(bx + pad, by + 34, tagW, 46, 23);
    const tagText = this.label(bx + pad + tagW / 2, by + 57, 'Para el adulto', 26, '#7B5EA7', '700').setOrigin(0.5);

    const textW = bw - pad * 2 - TOUCH / 2;
    const title = this.scene.add
      .text(bx + pad, by + 104, text.title, { fontFamily: FONT, fontStyle: '800', fontSize: '48px', color: INK_CSS, wordWrap: { width: textW } })
      .setOrigin(0, 0);
    const bodyY = title.y + title.height + 14;
    const goal = this.scene.add
      .text(bx + pad, bodyY, `Objetivo: ${text.goal}`, { fontFamily: 'system-ui, sans-serif', fontSize: '30px', color: INK_CSS, wordWrap: { width: bw - pad * 2 }, lineSpacing: 6 })
      .setOrigin(0, 0);
    const how = this.scene.add
      .text(bx + pad, goal.y + goal.height + 18, `Pregunte: «${text.how}»`, { fontFamily: 'system-ui, sans-serif', fontStyle: 'italic', fontSize: '30px', color: '#5B4B8A', wordWrap: { width: bw - pad * 2 }, lineSpacing: 6 })
      .setOrigin(0, 0);

    // X arriba a la derecha.
    const closeBtn = new RoundButton(this.scene, bx + bw - TOUCH / 2 - 18, by + TOUCH / 2 + 14, {
      width: TOUCH,
      color: COLORS.purpleSoft,
      shadowColor: 0xcabcf0,
      shadowDepth: 6,
      sound: false,
      onTap: () => this.close(),
    });
    const x = this.scene.add.graphics();
    x.lineStyle(9, COLORS.purple).beginPath().moveTo(-17, -17).lineTo(17, 17).moveTo(17, -17).lineTo(-17, 17).strokePath();
    closeBtn.addContent(x);

    // «ver otra vez» abajo a la derecha.
    const rw = 300;
    const replayBtn = new RoundButton(this.scene, bx + bw - rw / 2 - pad, by + bh - TOUCH / 2 - 30, {
      width: rw,
      height: TOUCH,
      radius: TOUCH / 2,
      color: COLORS.yellow,
      shadowColor: COLORS.yellowDark,
      shadowDepth: 6,
      sound: false,
      onTap: () => this.replay(),
    });
    replayBtn.addContent(this.label(0, 0, '↻  ver otra vez', 32, INK_CSS, '800').setOrigin(0.5));

    this.root.add([dim, g, body, tag, tagText, title, goal, how, closeBtn, replayBtn]);
  }

  private label(x: number, y: number, s: string, size: number, color: string, weight: string): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, s, { fontFamily: FONT, fontStyle: weight, fontSize: `${size}px`, color, padding: { top: 4, bottom: 4 } });
  }
}
