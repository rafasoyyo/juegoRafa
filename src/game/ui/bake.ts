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
 * Como `bakeGraphics`, pero en una sola imagen cuyo punto (0, 0) es el del `Graphics`: se mueve, gira,
 * escala, cambia de transparencia o entra en un contenedor igual que el dibujo original. Para piezas
 * sueltas de como mucho `CHUNK_W` px de lado (bloques, grabados, cuerpos de los dinosaurios). `rect` va en
 * las coordenadas del dibujo y puede ser holgado: lo que quede fuera se recorta. Copia la posición,
 * la profundidad, la transparencia, la escala, el giro y la visibilidad del `Graphics`. La textura se
 * libera al cerrar la escena.
 */
export function bakePiece(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, rect: BakeRect): Phaser.GameObjects.Image {
  const x0 = Math.floor(rect.x);
  const y0 = Math.floor(rect.y);
  const w = Math.max(1, Math.min(CHUNK_W, Math.ceil(rect.x + rect.width) - x0));
  const h = Math.max(1, Math.min(CHUNK_W, Math.ceil(rect.y + rect.height) - y0));
  const key = `baked-${++seq}`;
  const commands = g.commandBuffer;
  const { x: gx, y: gy } = g;
  g.setPosition(0, 0);
  g.commandBuffer = [];
  g.translateCanvas(-x0, -y0);
  g.commandBuffer = g.commandBuffer.concat(commands);
  g.generateTexture(key, w, h);
  g.commandBuffer = commands;
  const parent = g.parentContainer;
  const img = (parent ? new Phaser.GameObjects.Image(scene, 0, 0, key) : scene.add.image(0, 0, key))
    .setDisplayOrigin(-x0, -y0)
    .setPosition(gx, gy)
    .setScrollFactor(g.scrollFactorX, g.scrollFactorY)
    .setDepth(g.depth)
    .setAlpha(g.alpha)
    .setScale(g.scaleX, g.scaleY)
    .setRotation(g.rotation)
    .setVisible(g.visible);
  if (parent) parent.addAt(img, parent.getIndex(g));
  else scene.children.moveBelow(img, g);
  g.destroy();
  releaseOnShutdown(scene, [key]);
  return img;
}

/**
 * Imagen de un dibujo que se repite (el mismo bloque, el mismo grabado): la primera vez que se pide `id`
 * en la escena se hornea con `draw` en una textura y las siguientes la reutilizan. El punto (0, 0) del
 * dibujo es el de la imagen, como en `bakePiece`; `rect` puede ser holgado. Se libera al cerrar la escena.
 */
export function bakeShared(scene: Phaser.Scene, id: string, rect: BakeRect, draw: (g: Phaser.GameObjects.Graphics) => void): Phaser.GameObjects.Image {
  const x0 = Math.floor(rect.x);
  const y0 = Math.floor(rect.y);
  const key = `baked-shared-${id}`;
  if (!scene.textures.exists(key)) {
    const g = scene.make.graphics({}, false);
    g.translateCanvas(-x0, -y0);
    draw(g);
    g.generateTexture(key, Math.max(1, Math.min(CHUNK_W, Math.ceil(rect.x + rect.width) - x0)), Math.max(1, Math.min(CHUNK_W, Math.ceil(rect.y + rect.height) - y0)));
    g.destroy();
    releaseOnShutdown(scene, [key]);
  }
  return scene.add.image(0, 0, key).setDisplayOrigin(-x0, -y0);
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
