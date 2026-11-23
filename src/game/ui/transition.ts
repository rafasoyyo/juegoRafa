import Phaser from 'phaser';

const FADE_MS = 250;
const leaving = new WeakSet<Phaser.Scene>();

/** Llamar al principio de `create()` de cada escena: fundido de entrada. */
export function enter(scene: Phaser.Scene): void {
  leaving.delete(scene);
  scene.cameras.main.fadeIn(FADE_MS, 255, 255, 255);
}

/** Cambia de escena con un fundido de 250 ms. Ignora toques repetidos durante el fundido. */
export function goTo(scene: Phaser.Scene, key: string, data?: object): void {
  if (leaving.has(scene)) return;
  leaving.add(scene);
  const cam = scene.cameras.main;
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => scene.scene.start(key, data));
  cam.fadeOut(FADE_MS, 255, 255, 255);
}

/** Llama a `build` cada vez que cambia el ancho lógico, y deja de hacerlo al salir de la escena. */
export function onResize(scene: Phaser.Scene, layout: (width: number, height: number) => void): void {
  const handler = (size: Phaser.Structs.Size): void => layout(size.width, size.height);
  scene.scale.on(Phaser.Scale.Events.RESIZE, handler);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.scale.off(Phaser.Scale.Events.RESIZE, handler));
}
