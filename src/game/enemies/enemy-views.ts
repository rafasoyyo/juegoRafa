import Phaser from 'phaser';
import type { BeeSpawn, CrabSpawn, EnemySpawn, FrogSpawn, HedgehogSpawn } from './enemy-layout';
import { beeBox, beePosition, crabBox, crabX, frogBox, frogState, hedgehogBox, hedgehogX, type Rect } from './enemy-motion';

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
  /** Caja de choque actual en coordenadas del mundo. */
  box(): Rect;
  /** Gesto breve al chocar con el zorro; no cambia su movimiento. */
  gesture(): void;
}

export function createEnemyView(scene: Phaser.Scene, spawn: EnemySpawn, groundY: number): EnemyView {
  switch (spawn.kind) {
    case 'hedgehog':
      return hedgehogView(scene, spawn, groundY);
    case 'bee':
      return beeView(scene, spawn);
    case 'frog':
      return frogView(scene, spawn, groundY);
    case 'crab':
      return crabView(scene, spawn, groundY);
  }
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
    box: () => frogBox(spawn.x, height, groundY),
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
    box: () => crabBox(x, groundY),
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
    box: () => hedgehogBox(x, groundY),
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
    box: () => beeBox(pos.x, pos.y),
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
