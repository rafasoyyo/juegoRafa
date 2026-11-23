import Phaser from 'phaser';
import type { BeeSpawn, EnemySpawn, HedgehogSpawn } from './enemy-layout';
import { beeBox, beePosition, hedgehogBox, hedgehogX, type Rect } from './enemy-motion';

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
  return spawn.kind === 'hedgehog' ? hedgehogView(scene, spawn, groundY) : beeView(scene, spawn);
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
