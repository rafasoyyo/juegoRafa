import Phaser from 'phaser';
import { audio } from './game/audio/audio-engine';
import { fitWidth, GAME_H } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { LevelCompleteScene } from './game/scenes/LevelCompleteScene';
import { LevelScene } from './game/scenes/LevelScene';
import { MapScene } from './game/scenes/MapScene';
import { TitleScene } from './game/scenes/TitleScene';
import { WardrobeScene } from './game/scenes/WardrobeScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: fitWidth(window.innerWidth, window.innerHeight),
  height: GAME_H,
  backgroundColor: '#8FD3FF',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 900 * 3.2 }, fixedStep: false, debug: false } },
  input: { activePointers: 4 },
  scene: [BootScene, TitleScene, MapScene, LevelScene, LevelCompleteScene, WardrobeScene],
});

// Solo en desarrollo: acceso desde la consola para probar.
if (import.meta.env.DEV) Object.assign(window, { __game: game, __audio: audio });

// Alto lógico fijo de 720 y ancho según la proporción de la pantalla: sin bandas al girar.
function refit(): void {
  const w = fitWidth(window.innerWidth, window.innerHeight);
  if (w !== game.scale.gameSize.width) game.scale.setGameSize(w, GAME_H);
}
window.addEventListener('resize', refit);
// En iOS las medidas finales llegan un poco después del giro.
window.addEventListener('orientationchange', () => setTimeout(refit, 300));
