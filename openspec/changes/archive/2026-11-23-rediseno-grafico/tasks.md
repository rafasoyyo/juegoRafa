# Tasks

## 1. Base visual: escalado, tipografía y carga de SVG

- [x] 1.1 Desactivar `pixelArt`, quitar `image-rendering: pixelated` de `index.html` y pasar a alto lógico 720 con ancho recalculado en `resize` (960–1680) en `src/main.ts` y `src/game/config.ts`. Verificación: en Chrome emulando 844×390 y 1180×820 el lienzo ocupa toda la pantalla sin bandas.
- [x] 1.2 Descargar Baloo 2 ExtraBold (OFL) a `public/fonts/baloo2-800.woff2`, declararla con `@font-face` en `index.html`, esperar a `document.fonts.load` en `BootScene` y añadir `woff2` a los `globPatterns` de Workbox. Verificación: tras `npm run build` el `woff2` aparece en la lista de precache de `dist/sw.js`, y en el navegador un dígito de prueba se dibuja con Baloo 2.
- [x] 1.3 Comprobar `this.load.svg(key, url, { width, height })` en Phaser 4 con un SVG del zorro. Verificación: la textura se ve nítida al tamaño pedido en el móvil emulado y la consola no muestra errores.
- [x] 1.4 Crear `public/assets/LICENSES.md` con la fuente (OFL y su aviso) y la regla de anotar cada SVG nuevo. Verificación: el archivo existe y nombra la fuente y su licencia.

## 2. Gráficos SVG del diseño

- [x] 2.1 Extraer a `public/assets/svg/` los trazados del lienzo: zorro (quieto, saltando, celebrando), Lalo, nube, árbol, bloque «?», bloque usado, moneda, estrella llena y vacía, bandera y los iconos de botón (casa, flechas, mapa, repetir, verificación, candado, altavoz, cara del zorro). Anotarlos en `LICENSES.md`. Verificación: cada archivo se abre bien en el navegador y figura en `LICENSES.md`.
- [x] 2.2 Extraer los 5 gorros (gorra azul, lana, fiesta, casco, corona) en dos tamaños de uso (sobre el zorro y en casilla) y definir `HAT_OFFSETS` por pose. Verificación: una escena de prueba temporal muestra el zorro con cada gorro bien colocado en las 3 poses.
- [x] 2.3 Cargar todos los SVG en `BootScene` al tamaño de uso y borrar las texturas generadas por código que dejen de usarse. Verificación: `npm run build` sin errores y la consola sin avisos de texturas que faltan.

## 3. Estado del juego y puntuación provisional

- [x] 3.1 Implementar `src/learning/scoring.ts` con `starsFor(blocksHit, blocksTotal)` (1 por llegar, +1 con al menos la mitad, +1 con todos) y sus tests. Verificación: `npm test` pasa, con casos 0 bloques → 1, la mitad → 2, todos → 3 y un nivel sin bloques → 3.
- [x] 3.2 Implementar `src/game/state.ts` sin importar Phaser: `completeLevel` (mejor puntuación en estrellas, suma de monedas, desbloquea el siguiente), `levelStatus`, `buyHat`, `wearHat`, con gorra azul y «sin gorro» conseguidos al inicio y los precios provisionales. Verificación: `npm test` pasa con los escenarios de `world-map`, `level-complete` y `character-wardrobe` (incluidos «12 monedas, gorro de 10 → quedan 2» y «3 monedas → no cambia»).

## 4. Componentes comunes

- [x] 4.1 Crear `src/game/ui/round-button.ts` (círculo y píldora, sombra inferior, estado hundido, `shake()`) y el helper de transición `goTo(scene, key, data)` con fundido de 250 ms. Verificación: en una escena de prueba el botón se hunde al pulsarlo y tiembla con `shake()`.
- [x] 4.2 Crear `drawFox(scene, x, y, pose, hat)` y `drawLalo(scene, x, y)` con el altavoz (salto y parpadeo al tocar, sin sonido). Verificación: en el móvil emulado, al tocar a Lalo o su altavoz este salta y parpadea, y no aparece texto.

## 5. Nivel rediseñado

- [x] 5.1 Redibujar el escenario: cielo en degradado, nubes y colinas con paralaje, suelo de hierba y tierra, bloques «?» del diseño y bandera coral, con el recorrido escalado ×3,2. Verificación: captura a 844×390 comparada con el artboard «1 · Nivel de números»; al avanzar, las nubes y las colinas van más despacio que el suelo.
- [x] 5.2 Sustituir el niño por el zorro con gorro y las animaciones de andar, saltar, aterrizar y estar quieto; reescalar las constantes físicas ×3,2. Verificación: en el móvil real por la wifi (`npm run dev`), el salto alcanza los bloques y el *coyote time* y el *buffer* siguen funcionando.
- [x] 5.3 Rehacer `TouchControls` con `RoundButton` (flechas blancas de 120 px o más, salto coral de 160 px o más, hundidos mientras están activos) manteniendo la detección por zonas y el teclado. Verificación: en el móvil emulado, mantener derecha y pulsar saltar con dos dedos hunde los dos botones y el zorro avanza saltando.
- [x] 5.4 HUD: casa (al mapa sin completar), barra de progreso con la cara del zorro hasta la bandera, contador de monedas con icono y Lalo arriba a la izquierda, todo recolocado en `layout()` al cambiar el ancho. Verificación: a mitad del recorrido la cara está a mitad de barra; girando entre 844×390 y 1180×820 el HUD sigue pegado a los bordes y no tapa los controles.
- [x] 5.5 Meta: detener al zorro, hacerle celebrar y abrir `LevelComplete` antes de 2 s con `{ level, blocksHit, blocksTotal, coins }`; quitar el texto «¡Muy bien!». Verificación: al tocar la bandera se abre la celebración en menos de 2 s y no hay texto en pantalla.

## 6. Pantallas nuevas

- [x] 6.1 `TitleScene`: zorro y botón grande de jugar; el primer toque desbloquea el audio y va al mapa. Verificación: en el móvil emulado, un toque en cualquier punto abre el mapa.
- [x] 6.2 `MapScene`: camino con 6 nodos según `levelStatus`, estrellas bajo los hechos, halo en el actual, zorro con gorro encima del actual, candados que tiemblan, selector de mundos con solo `123` activo, monedas y botón de mi personaje. Verificación: tras completar los niveles 1 (3★) y 2 (2★) el mapa coincide con el artboard «2 · Mapa del mundo» y tocar el nivel 4 solo hace temblar el candado.
- [x] 6.3 `LevelCompleteScene`: confeti, tarjeta con 3 estrellas (llenas según `starsFor`), monedas ganadas, zorro celebrando con gorro y los botones de mapa, siguiente (al mapa en el nivel 6) y repetir. Verificación: llegar a la meta sin golpear bloques muestra 1★ y con todos muestra 3★; las tres rutas funcionan.
- [x] 6.4 `WardrobeScene`: escaparate con el zorro grande, monedas, categorías (solo gorros activa), rejilla de 6 casillas con verificación en el puesto y precio en los no conseguidos, compra y botón de listo. Verificación: con monedas suficientes se compra y se pone un gorro, sin monedas la casilla tiembla, y el gorro elegido se ve después en el mapa y en el nivel.
- [x] 6.5 Registrar las escenas en `src/main.ts` con el orden `Boot → Title → Map`. Verificación: recorrido completo inicio → mapa → nivel → celebración → mapa → mi personaje → mapa sin errores en consola.

## 7. Documentación e integración

- [x] 7.1 Actualizar `docs/PROPUESTA.md` (estilo vectorial redondeado, zorro como protagonista, Lalo, 720 px de alto) y el contexto de `openspec/config.yaml` (quitar «pixel art» y «un niño»). Verificación: `grep -n "pixel art\|un niño" docs/PROPUESTA.md openspec/config.yaml` solo devuelve menciones históricas justificadas.
- [x] 7.2 Revisión final sin texto ni bandas en 844×390, 932×430 y 1180×820. Verificación: capturas de las cuatro pantallas en los tres tamaños sin palabras visibles ni bandas negras.
- [x] 7.3 `npm run build`, `npm test` y `npm run deploy`. Verificación: los tres terminan bien y https://juegorafa-edu.web.app muestra la pantalla de inicio con el zorro.

## Workflow follow-up

- Jugarlo con el niño en el móvil o la tableta y ajustar precios de gorros y físicas si hace falta.
- Archivar el cambio con `/openspec-archive-change` cuando esté revisado.
