import Phaser from 'phaser';
import { audio } from '../audio/audio-engine';
import type { SfxName } from '../audio/sfx';
import type { BeeSpawn, CrabSpawn, EnemyKind, EnemySpawn, FrogSpawn, HedgehogSpawn, PteroSpawn, SpawnOf, TrexSpawn, VolcanoSpawn } from './enemy-layout';
import {
  beeBox,
  beePosition,
  crabBox,
  crabX,
  frogBox,
  frogState,
  hedgehogBox,
  hedgehogX,
  pteroBox,
  pteroPosition,
  rockBox,
  trexBox,
  trexState,
  VOLCANO_H,
  volcanoBox,
  volcanoState,
  type Rect,
} from './enemy-motion';

/** Por debajo del zorro (10) y sus piernas (9), por encima de la bandera (5). */
const ENEMY_DEPTH = 8;
/** Aleteo de la abeja. */
const WING_HZ = 14;
/** Ritmo del paso del erizo (balanceo). */
const HEDGEHOG_STEP_HZ = 3;

export interface EnemyView {
  readonly spawn: EnemySpawn;
  /** Coloca el enemigo para el tiempo de escena `timeMs`. */
  update(timeMs: number): void;
  /** Cajas de choque actuales en coordenadas del mundo (varias en una fila de pterosaurios o en el volcán y su piedra). */
  boxes(): readonly Rect[];
  /** Gesto breve al chocar con el zorro; no cambia su movimiento. */
  gesture(): void;
}

export function createEnemyView(scene: Phaser.Scene, spawn: EnemySpawn, groundY: number): EnemyView {
  return (ENEMY_VIEWS[spawn.kind] as ViewFactory<EnemyKind>)(scene, spawn, groundY);
}

type ViewFactory<K extends EnemyKind> = (scene: Phaser.Scene, spawn: SpawnOf<K>, groundY: number) => EnemyView;

/** Dibujo y movimiento de cada tipo de enemigo (spec `world-isolation`: una entrada por tipo). */
const ENEMY_VIEWS: { readonly [K in EnemyKind]: ViewFactory<K> } = {
  hedgehog: (scene, spawn, groundY) => hedgehogView(scene, spawn, groundY),
  bee: (scene, spawn) => beeView(scene, spawn),
  frog: (scene, spawn, groundY) => frogView(scene, spawn, groundY),
  crab: (scene, spawn, groundY) => crabView(scene, spawn, groundY),
  ptero: (scene, spawn, groundY) => pteroView(scene, spawn, groundY),
  volcano: (scene, spawn, groundY) => volcanoView(scene, spawn, groundY),
  trex: (scene, spawn, groundY) => trexView(scene, spawn, groundY),
};

/** Suena `name` y tiembla un poco la pantalla solo si `x` está a la vista (o casi). */
function warn(scene: Phaser.Scene, x: number, name: SfxName, shake: number): void {
  const view = scene.cameras.main.worldView;
  if (x < view.x - 200 || x > view.right + 200) return;
  audio.sfx(name);
  if (shake > 0) scene.cameras.main.shake(shake, 0.003);
}

/**
 * Fila de pterosaurios: cada uno aletea y sube y baja con la ola. Su sombra en el suelo crece y se
 * oscurece al bajar: avisa antes de que esté a la altura del zorro.
 */
function pteroView(scene: Phaser.Scene, spawn: PteroSpawn, groundY: number): EnemyView {
  const birds = Array.from({ length: spawn.of }, () => ({
    shadow: scene.add.ellipse(0, groundY + 4, 70, 14, 0x000000, 0.2).setDepth(ENEMY_DEPTH - 1),
    img: scene.add.image(0, 0, 'ptero').setDepth(ENEMY_DEPTH),
    box: { x: 0, y: 0, w: 0, h: 0 } as Rect,
  }));
  const boxes = birds.map((b) => b.box);
  let tilt = 0;
  return {
    spawn,
    update(timeMs) {
      birds.forEach((b, i) => {
        const p = pteroPosition(timeMs, spawn, i);
        b.img.setPosition(p.x, p.y);
        const flap = 0.7 + 0.3 * Math.abs(Math.sin((timeMs / 1000) * 3 * Math.PI + i));
        b.img.setScale(p.facing, flap);
        b.img.setAngle(tilt);
        // Cuanto más bajo, sombra más grande y más oscura.
        const low = (p.y - 440) / 130;
        b.shadow.setPosition(p.x, groundY + 4);
        b.shadow.setScale(0.6 + 0.6 * low, 1);
        b.shadow.setFillStyle(0x000000, 0.1 + 0.25 * low);
        Object.assign(b.box, pteroBox(p.x, p.y));
      });
    },
    boxes: () => boxes,
    gesture() {
      scene.tweens.addCounter({ from: 0, to: 1, duration: 300, onUpdate: (tw) => (tilt = 12 * Math.sin((tw.getValue() ?? 0) * Math.PI * 2)), onComplete: () => (tilt = 0) });
    },
  };
}

/**
 * Volcancito: reposa humeando poco; antes de lanzar tiembla y echa más humo (el aviso) y la piedra sube
 * y vuelve a caer en el cráter, siempre en la misma columna.
 */
function volcanoView(scene: Phaser.Scene, spawn: VolcanoSpawn, groundY: number): EnemyView {
  const rock = scene.add.image(spawn.x, groundY - VOLCANO_H + 7, 'lava-rock').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH - 1).setVisible(false);
  const cone = scene.add.image(spawn.x, groundY + 4, 'volcano-small').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH);
  // Tres bocanadas de humo que se reciclan.
  const puffs = Array.from({ length: 3 }, () => scene.add.circle(spawn.x, groundY - VOLCANO_H, 14, 0x9a96a0, 0).setDepth(ENEMY_DEPTH - 1));
  const coneBox = volcanoBox(spawn.x, groundY);
  const boxes: Rect[] = [coneBox, rockBox(spawn.x, 0, groundY)];
  let last = '';
  return {
    spawn,
    update(timeMs) {
      const s = volcanoState(timeMs, spawn);
      if (s.pose === 'shake' && last !== 'shake') warn(scene, spawn.x, 'rumble', 200);
      last = s.pose;
      cone.setX(spawn.x + (s.pose === 'shake' ? Math.sin(timeMs / 18) * 3 * s.shake : 0));
      rock.setVisible(s.pose === 'air');
      rock.setPosition(spawn.x, groundY - VOLCANO_H + 7 - s.rock);
      rock.setAngle(s.rock * 0.6);
      // Humo: sube despacio; más denso al temblar.
      const dense = s.pose === 'shake' ? 0.75 : 0.3;
      puffs.forEach((p, i) => {
        const u = ((timeMs / 1400 + i / puffs.length) % 1 + 1) % 1;
        p.setPosition(spawn.x + Math.sin(u * 6 + i) * 8, groundY - VOLCANO_H - u * 90);
        p.setScale(0.6 + u);
        p.setFillStyle(0x9a96a0, dense * (1 - u));
      });
      Object.assign(boxes[1]!, s.pose === 'air' ? rockBox(spawn.x, s.rock, groundY) : { x: spawn.x, y: groundY, w: 0, h: 0 });
    },
    boxes: () => boxes,
    gesture() {
      scene.tweens.killTweensOf(cone);
      cone.setScale(1);
      scene.tweens.add({ targets: cone, scaleY: 1.12, duration: 90, yoyo: true });
    },
  };
}

/**
 * Tiranosaurio: el dibujo mira a la derecha; se voltea al ir a la izquierda y balancea el cuerpo al
 * andar. Al pararse levanta la cabeza y ruge: suena un rugido grave que crece y el suelo tiembla un poco.
 */
function trexView(scene: Phaser.Scene, spawn: TrexSpawn, groundY: number): EnemyView {
  const img = scene.add.image(spawn.minX, groundY + 4, 'trex').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH);
  const boxes: Rect[] = [trexBox(spawn.minX, groundY)];
  let last = '';
  return {
    spawn,
    update(timeMs) {
      const s = trexState(timeMs, spawn);
      if (s.pose === 'roar' && last === 'walk') warn(scene, s.x, 'roar', 450);
      last = s.pose;
      const step = s.pose === 'walk' ? Math.sin((timeMs / 1000) * 2 * Math.PI * 1.6) : 0;
      img.setPosition(s.x, groundY + 4 - Math.abs(step) * 3);
      img.setFlipX(s.facing < 0);
      // Al rugir, levanta un poco la parte de delante.
      const lift = s.pose === 'roar' ? Math.sin(Math.min(1, s.roar * 3) * Math.PI * 0.5) * (1 - Math.max(0, s.roar - 0.75) * 4) : 0;
      img.setAngle(step * 1.5 - lift * 6 * s.facing);
      Object.assign(boxes[0]!, trexBox(s.x, groundY));
    },
    boxes: () => boxes,
    gesture() {
      scene.tweens.killTweensOf(img);
      img.setScale(1);
      scene.tweens.add({ targets: img, scaleY: 1.06, duration: 100, yoyo: true });
    },
  };
}

/**
 * Rana: quieta respira un poco; antes de saltar se agacha (se aplasta y ensancha) para avisar, y en el
 * aire se estira. Salta siempre en el sitio.
 */
function frogView(scene: Phaser.Scene, spawn: FrogSpawn, groundY: number): EnemyView {
  const img = scene.add.image(spawn.x, groundY + 2, 'frog').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH);
  let height = 0;
  let pop = 1;
  return {
    spawn,
    update(timeMs) {
      const s = frogState(timeMs, spawn);
      height = s.height;
      let sx = 1;
      let sy = 1;
      if (s.pose === 'sit') sy = 1 + Math.sin(timeMs / 260) * 0.03;
      else if (s.pose === 'crouch') {
        // Se agacha cada vez más y tiembla un poco justo antes de saltar.
        const c = Math.sin(s.crouch * Math.PI * 0.5);
        sx = 1 + 0.18 * c;
        sy = 1 - 0.28 * c + (s.crouch > 0.7 ? Math.sin(timeMs / 22) * 0.03 : 0);
      } else {
        sx = 0.9;
        sy = 1.14;
      }
      img.setPosition(spawn.x, groundY + 2 - height);
      img.setScale(sx * pop, sy * pop);
    },
    boxes: () => [frogBox(spawn.x, height, groundY)],
    gesture() {
      // Hincha la garganta: crece un 15 % y vuelve.
      scene.tweens.addCounter({ from: 0, to: 1, duration: 160, onUpdate: (tw) => (pop = 1 + 0.15 * Math.sin((tw.getValue() ?? 0) * Math.PI)), onComplete: () => (pop = 1) });
    },
  };
}

/** Cangrejo: anda de lado (no se voltea) moviendo las pinzas arriba y abajo. */
function crabView(scene: Phaser.Scene, spawn: CrabSpawn, groundY: number): EnemyView {
  const img = scene.add.image(spawn.minX, groundY + 2, 'crab').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH);
  let x = spawn.minX;
  return {
    spawn,
    update(timeMs) {
      x = crabX(timeMs, spawn).x;
      const step = Math.sin((timeMs / 1000) * HEDGEHOG_STEP_HZ * 1.5 * Math.PI * 2);
      img.setPosition(x, groundY + 2 - Math.abs(step) * 2);
      img.setAngle(step * 4);
    },
    boxes: () => [crabBox(x, groundY)],
    gesture() {
      // Levanta las pinzas: se estira hacia arriba y vuelve.
      scene.tweens.killTweensOf(img);
      img.setScale(1);
      scene.tweens.add({ targets: img, scaleY: 1.18, duration: 80, yoyo: true, ease: 'Quad.easeOut' });
    },
  };
}

/** Erizo: el dibujo mira a la derecha; se voltea para ir a la izquierda y se balancea al andar. */
function hedgehogView(scene: Phaser.Scene, spawn: HedgehogSpawn, groundY: number): EnemyView {
  const img = scene.add.image(0, groundY + 2, 'hedgehog').setOrigin(0.5, 1).setDepth(ENEMY_DEPTH);
  let x = spawn.minX;
  return {
    spawn,
    update(timeMs) {
      const pos = hedgehogX(timeMs, spawn);
      x = pos.x;
      const step = Math.sin((timeMs / 1000) * HEDGEHOG_STEP_HZ * Math.PI * 2);
      img.setPosition(x, groundY + 2 - Math.abs(step) * 3);
      img.setAngle(step * 3);
      img.setFlipX(pos.facing < 0);
    },
    boxes: () => [hedgehogBox(x, groundY)],
    gesture() {
      // Eriza los pinchos: crece un 15 % y vuelve (150 ms).
      scene.tweens.killTweensOf(img);
      img.setScale(1);
      scene.tweens.add({ targets: img, scaleX: 1.15, scaleY: 1.15, duration: 75, yoyo: true, ease: 'Quad.easeOut' });
    },
  };
}

/** Abeja: cuerpo y dos alas que aletean, dentro de un contenedor que sube, baja y deriva. */
function beeView(scene: Phaser.Scene, spawn: BeeSpawn): EnemyView {
  const back = scene.add.image(-6, -22, 'bee-wing').setOrigin(0.7, 1).setAngle(-20).setAlpha(0.8);
  const body = scene.add.image(0, 0, 'bee');
  const front = scene.add.image(4, -22, 'bee-wing').setOrigin(0.3, 1).setAngle(12);
  const bee = scene.add.container(spawn.x, 0, [back, body, front]).setDepth(ENEMY_DEPTH);
  const tilt = { deg: 0 };
  let wobble: Phaser.Tweens.Tween | undefined;
  let pos = beePosition(0, spawn);
  return {
    spawn,
    update(timeMs) {
      pos = beePosition(timeMs, spawn);
      bee.setPosition(pos.x, pos.y);
      bee.setScale(pos.facing, 1);
      bee.setAngle(tilt.deg);
      const flap = 0.35 + 0.65 * Math.abs(Math.sin((timeMs / 1000) * WING_HZ * Math.PI));
      back.setScale(1, flap);
      front.setScale(1, flap);
    },
    boxes: () => [beeBox(pos.x, pos.y)],
    gesture() {
      // Se tambalea: +15°, −15° y vuelve (300 ms).
      wobble?.stop();
      tilt.deg = 0;
      wobble = scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 300,
        onUpdate: (tw) => {
          tilt.deg = 15 * Math.sin((tw.getValue() ?? 0) * Math.PI * 2);
        },
        onComplete: () => {
          tilt.deg = 0;
        },
      });
    },
  };
}
