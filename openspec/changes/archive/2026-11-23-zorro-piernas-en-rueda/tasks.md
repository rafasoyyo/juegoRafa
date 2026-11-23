# Tasks

## 1. Cinemática pura de la carrera

- [x] 1.1 Crear `src/game/ui/run-cycle.ts` sin importar Phaser, con `RunState`, `stepRun()`,
  `legFeet()`, `wheelMix()` y las constantes del diseño (`RAMP_MS = 400`, ritmo de 3 a 8 Hz, elipse
  del pie, caderas, colores y grosores). Verificar con `npm run build`, sin errores de tipos.
- [x] 1.2 Añadir `src/game/ui/run-cycle.test.ts`. Debe cubrir:
  - la intensidad llega a 1 en ≤ 500 ms corriendo por el suelo;
  - vuelve a 0 al parar en el suelo y al llegar a la meta;
  - se congela en el aire;
  - la fase avanza más deprisa con intensidad 1 que con 0;
  - los dos pies van desfasados medio ciclo;
  - ningún pie baja de y = 0;
  - `wheelMix` vale 0 con intensidad ≤ 0,5 y 1 con intensidad ≥ 0,9.

  Verificar con `npm test`, todo en verde.

## 2. Cuerpo de carrera y gorro

- [x] 2.1 Crear `public/assets/svg/fox-run.svg`: copia de `fox-idle.svg` sin las dos elipses de los
  pies, con el resto subido 10 unidades y el mismo `viewBox` de 120×120. Anotarlo como *derivado* en
  `public/assets/LICENSES.md`. Verificar abriendo el SVG en el navegador: zorro sin pies y sin
  recortes arriba.
- [x] 2.2 Cargar `fox-run` (120) y `fox-run-l` (400) en `BootScene`, y generar allí la textura
  `dust` (círculo crema `#FFF4E0`). Verificar con `npm run dev`: sin avisos de carga en la consola.
- [x] 2.3 Añadir `'run'` a `FoxPose` y `run: { x: 0, y: -87, angle: 0 }` a `HAT_OFFSETS` en
  `src/game/ui/characters.ts`. Verificar con `npm run build` y, en el nivel con cada uno de los 5
  gorros, que el gorro queda apoyado en la cabeza al correr.

## 3. Piernas, rueda y efectos en el nivel

- [x] 3.1 En `LevelScene`, crear en `buildFox()` el `Graphics` de las piernas (profundidad 9) y el
  pool de 6 motas de polvo. Integrar `stepRun()` en `animateFox()` con `delta` y la nueva regla de
  pose (`celebrate` / `jump` / `run` / `idle`), y reiniciar el estado en `init()`. Verificar en
  `npm run dev`, con el emulador de móvil horizontal de DevTools (844×390): al pulsar la flecha
  derecha se ven las zancadas y en menos de 0,5 s pasan a rueda.
- [x] 3.2 Dibujar las piernas nítidas y la rueda (estela de 4 pies fantasma, aro semitransparente y
  piernas con α según `wheelMix`). El dibujo copia la posición y el giro del zorro y se voltea con
  `scaleX` según `faceLeft`. Verificar en el emulador que la rueda gira en el sentido de la marcha
  hacia la derecha y hacia la izquierda, y al cambiar de flecha sin soltar.
- [x] 3.3 Sustituir el vaivén por la inclinación `10°·mix` y el rebote, y añadir las líneas de
  velocidad y el polvo, que solo salen cuando mix > 0,5. Verificar en el emulador que solo aparecen
  en rueda, sin contornos negros, y que el polvo se desvanece. Con el contador de objetos de la
  escena (`this.children.length` en la consola), comprobar que el número se mantiene estable tras
  30 s corriendo.
- [x] 3.4 Al pasar de `run` a `idle`, lanzar el aplastamiento con `amount = 0.5` y ocultar y borrar
  el `Graphics`. Verificar en el emulador que al soltar la flecha el zorro se queda quieto
  respirando, con los pies en el suelo, sin salto visible del cuerpo.
- [x] 3.5 En el aire, ocultar la rueda y usar la pose `jump`. Al aterrizar corriendo, recuperar la
  rueda sin rampa, y en la meta quitar la rueda y los efectos. Verificar en el emulador saltando un
  bloque «?» mientras se corre y llegando a la bandera en rueda.

## 4. Integración

- [x] 4.1 Comprobar que el control no cambia. Con la flecha derecha pulsada desde el inicio, medir
  con un `console.time` temporal el tiempo hasta la bandera y compararlo con `main`: debe ser igual
  (±1 fotograma). Quitar después el código de medida.
- [ ] 4.2 Comprobar el rendimiento. En DevTools, con estrangulamiento de CPU ×4 y emulador de móvil
  horizontal, grabar 10 s de carrera en Performance: sin caídas sostenidas por debajo de 50 fps y la
  rueda sin parecer que gira hacia atrás.
- [ ] 4.3 Pasar `npm test` y `npm run build` en verde, y probar en un móvil real por la wifi
  (`npm run dev`) en horizontal: zancadas, rueda, salto, parada y meta como en los escenarios del
  delta de `platformer-level`.

## Workflow follow-up

- Archivar el cambio (`openspec-archive-change`) cuando se haya revisado en el móvil.
