import Phaser from 'phaser';

/**
 * Ancho máximo de cada trozo horneado. Muy por debajo del tamaño de textura que admiten las tablets
 * antiguas (4096) y lo bastante grande para que un nivel largo no pase de unas pocas imágenes.
 */
const CHUNK_W = 2048;

/** Contador para dar a cada textura horneada una clave única (los niveles se reinician a menudo). */
let seq = 0;

export interface BakeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convierte un `Graphics` estático en imágenes: dibuja sus órdenes una sola vez en texturas de lienzo,
 * en trozos de como mucho `CHUNK_W` px de ancho, y lo sustituye por esas imágenes en el mismo sitio de la
 * lista de dibujo (profundidad, paralaje y orden). Un `Graphics` de Phaser vuelve a trazar cada círculo y
 * cada rectángulo redondeado en cada fotograma; una imagen es un solo cuadro para la GPU.
 *
 * `rect` es la parte que se ve, en las coordenadas en que se dibujó: lo que quede fuera se recorta. Si el
 * `Graphics` está en un contenedor, las imágenes ocupan su sitio dentro de él. Solo para dibujos que no
 * vuelven a cambiar ni se animan por su posición. Las texturas se liberan al cerrar la escena.
 */
export function bakeGraphics(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, rect: BakeRect): Phaser.GameObjects.Image[] {
  const x0 = Math.floor(rect.x);
  const y0 = Math.floor(rect.y);
  const x1 = Math.ceil(rect.x + rect.width);
  const h = Math.ceil(rect.y + rect.height) - y0;
  const images: Phaser.GameObjects.Image[] = [];
  if (h <= 0 || x1 <= x0) {
    g.destroy();
    return images;
  }
  const commands = g.commandBuffer;
  const keys: string[] = [];
  // `generateTexture` no lleva bien la posición propia del `Graphics`: se dibuja en el origen y las
  // imágenes se colocan después donde estaba.
  const { x: gx, y: gy } = g;
  g.setPosition(0, 0);
  for (let cx = x0; cx < x1; cx += CHUNK_W) {
    const w = Math.min(CHUNK_W, x1 - cx);
    const key = `baked-${++seq}`;
    // Las órdenes, desplazadas para que la esquina del trozo quede en el origen del lienzo.
    g.commandBuffer = [];
    g.translateCanvas(-cx, -y0);
    g.commandBuffer = g.commandBuffer.concat(commands);
    g.generateTexture(key, w, h);
    keys.push(key);
    const parent = g.parentContainer;
    const img = (parent ? new Phaser.GameObjects.Image(scene, 0, 0, key) : scene.add.image(0, 0, key))
      .setPosition(gx + cx, gy + y0)
      .setOrigin(0, 0)
      .setScrollFactor(g.scrollFactorX, g.scrollFactorY)
      .setDepth(g.depth)
      .setVisible(g.visible);
    if (parent) parent.addAt(img, parent.getIndex(g));
    else scene.children.moveBelow(img, g);
    images.push(img);
  }
  g.commandBuffer = commands;
  g.destroy();
  releaseOnShutdown(scene, keys);
  return images;
}

/**
 * Textura de un solo dibujo (de `width` × `height`, con el origen arriba a la izquierda) para repetirlo
 * en varias imágenes. Se libera al cerrar la escena.
 */
export function bakeShape(scene: Phaser.Scene, width: number, height: number, draw: (g: Phaser.GameObjects.Graphics) => void): string {
  const key = `baked-${++seq}`;
  const g = scene.make.graphics({}, false);
  draw(g);
  g.generateTexture(key, Math.ceil(width), Math.ceil(height));
  g.destroy();
  releaseOnShutdown(scene, [key]);
  return key;
}

function releaseOnShutdown(scene: Phaser.Scene, keys: readonly string[]): void {
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    for (const key of keys) if (scene.textures.exists(key)) scene.textures.remove(key);
  });
}
