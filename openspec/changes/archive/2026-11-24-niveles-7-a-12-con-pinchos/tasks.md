# Tasks

## 1. Zonas de pinchos como datos (sin Phaser)

- [x] 1.1 En `src/game/levels/types.ts` y `parse.ts`: añadir `SpikeData { x, width }` y `WorldSpike` en px, el campo opcional `spikes` (si falta, `[]`) y su conversión al mundo en `toWorld`. Probar en `parse.test.ts` que un nivel sin `spikes` queda con `[]` y que uno con zonas las convierte a px (`npx vitest run src/game/levels/parse.test.ts`)
- [x] 1.2 Crear `src/game/levels/spikes.ts` (puro) con:
  - `onSpikes(footFrom, footTo, spikes)`, con el margen de perdón de 16 px.
  - `exitSide(zone, lastSafeX, foxX)`.
  - `reboundVelocity(zone, side, foxX)`, a partir de `KNOCK_VY`, la gravedad y `MAX_VELOCITY.x`, para aterrizar a 0,75 baldosas fuera del borde.
  - `nudgeOffSpikes(x, spikes)`, para la fresa.

  Probar los escenarios «Margen de perdón», «Entrar andando» y «Caer en medio», y que en la peor zona (2 baldosas, entrando por el lado opuesto) el aterrizaje calculado queda fuera de la zona y la velocidad no supera el límite (`npx vitest run src/game/levels`)
- [x] 1.3 En `validate.ts`: reglas de colocación de los pinchos. Son el ancho de 1–2 baldosas, solo sobre el suelo y no bajo una plataforma, 10 baldosas desde la salida y la bandera, 2 desde bloques, escalones y plataformas, 6 entre zonas, y que quepan en un salto normal con margen. Además, las zonas cuentan para `maxEmpty`. Probar en `validate.test.ts` con un nivel bueno y con un caso malo por regla, comprobando que cada error nombra el nivel y la zona (`npx vitest run src/game/levels/validate.test.ts`)
- [x] 1.4 En `duration.ts`: sumar 1 s con calma por zona de pinchos y añadir `durationLimits(level)` (60–120 s y 30 s para los niveles 1–6; 90–150 s y 35 s para los 7–12). Probar en `duration.test.ts` que los niveles 1–6 dan los mismos valores que antes (`npx vitest run src/game/levels/duration.test.ts`)

## 2. Ambientes nuevos

- [x] 2.1 En `types.ts` y `ambients.ts`: los 6 `AmbientId` nuevos (`playa`, `selva`, `montana`, `nieve`, `desierto`, `nubes`), los nuevos `DecorKind`, el campo `ground` (`grass`, `sand`, `snow`, `cloud`; los 6 antiguos con `grass`) y los colores de cada ambiente, con el desierto en arena pálida y no naranja. Probar en `ambients.test.ts` que el contraste del zorro, del bloque «?» y del morado de los pinchos contra el suelo y el cielo de los 12 ambientes supera el umbral de la prueba (`npx vitest run src/game/levels/ambients.test.ts`)
- [x] 2.2 En `BootScene` y `widgets.ts`: dibujar por código la decoración de los 6 ambientes (palmera y mar, hoja y liana, pico nevado, pino nevado y copos, cactus y duna, arcoíris y nubes grandes) y el borde de suelo según `ground`. Verificar en el navegador a 844×390, abriendo una escena de nivel con cada ambiente, que se reconocen, que la decoración queda detrás y más apagada, y que los 6 ambientes antiguos se ven igual que antes (capturas antes y después)
- [x] 2.3 Dibujar en `BootScene` la textura de los pinchos (3 conos redondeados morados con brillo y base de piedra con sombra) y anotar en `public/assets/LICENSES.md` el arte nuevo como propio si se añade algún SVG. Verificar en el navegador que una zona de pinchos se distingue del suelo en los 12 ambientes y no se confunde con un erizo

## 3. Recorridos de los niveles 7 a 12

- [x] 3.1 En `catalog.ts`: importar `nivel-7.json` … `nivel-12.json`. En `catalog.test.ts`:
  - Límites de bloques por tramo (12–20 en los niveles 1–6, 20–25 en los 7–12, sin bajar nunca).
  - Ninguna zona de pinchos en los niveles 1–6; 2, 3, 3, 4, 5 y 6 zonas en los 7–12, con ancho 1 en el 7 y el 8.
  - Ambientes en orden.
  - Dificultad creciente: el 6 con más que los niveles 1–5; del 7 al 12 sin bajar en ningún eje, y el 12 con más plataformas, escalones y zonas que ningún otro.
  - Duración según `durationLimits`.
  - Sin dos niveles iguales.

  Verificar que las pruebas fallan mientras falten los JSON (`npx vitest run src/game/levels/catalog.test.ts`)
- [x] 3.2 Escribir `content/levels/nivel-7.json` y `nivel-8.json` (playa y selva: 180 y 185 baldosas, 20 y 21 bloques, 7/7 y 8/7 escalones/plataformas, 2 y 3 zonas de 1 baldosa). Verificar que pasan `validate` y su parte de `catalog.test.ts` (`npx vitest run src/game/levels`)
- [x] 3.3 Escribir `nivel-9.json` y `nivel-10.json` (montaña y nieve: 190 y 195 baldosas, 22 y 23 bloques, 8/8 y 9/9, 3 y 4 zonas de 1–2 baldosas). Verificar como en 3.2
- [x] 3.4 Escribir `nivel-11.json` y `nivel-12.json` (desierto y nubes: 200 y 210 baldosas, 24 y 25 bloques, 9/9 y 10/10, 5 y 6 zonas de 1–2 baldosas, con algún pincho antes de una plataforma). Verificar que pasa toda la batería (`npx vitest run src/game/levels`)
- [x] 3.5 En `enemy-layout.ts`: `ENEMIES_PER_LEVEL = [2,3,4,5,6,7,7,8,8,9,9,10]` y añadir las zonas de pinchos a `keepClear` en `courseFor`. Ampliar `enemy-layout.test.ts` a los 12 niveles con 200 semillas: salen todos, ningún enemigo ni ninguna patrulla de erizo a menos de `BLOCK_CLEAR` de una zona, y los niveles 1–6 siguen igual (`npx vitest run src/game/enemies`)

## 4. Pinchos dentro del nivel

- [x] 4.1 En `LevelScene`: dibujar las zonas de pinchos del nivel sobre el suelo, guardar `lastSafeX` mientras Rufo pisa suelo fuera de ellas, y comprobar en cada fotograma, con `onSpikes`, si está apoyado sobre una (sin protección ni modo invencible). Verificar en el navegador, en el nivel 7, que andar hasta los pinchos produce el pinchazo y que saltarlos no
- [x] 4.2 Extraer de `onEnemyHit` un `knock(side, vx, sound)` común. El pinchazo de pinchos usa `exitSide` y `reboundVelocity`, resta la galleta con `loseCookie` y `dropCookie`, da 1 s de protección y suena `spikes`. Verificar en el navegador los escenarios «Caer en los pinchos», «Sin galletas», «Entrar andando», «Caer en medio» y «Niño que no se mueve» en una zona de 2 baldosas del nivel 9, y que el pinchazo de enemigo se comporta igual que antes
- [x] 4.3 Modo invencible y fresa:
  - Sin comprobación de pinchos mientras dura el modo.
  - En `tickPower`, 1 s de protección si acaba sobre una zona.
  - En `settleFruit`, `nudgeOffSpikes` como seguridad.

  Verificar en el navegador «Correr sobre pinchos» y «Termina sobre los pinchos», y que la fresa nunca queda sobre los pinchos golpeando su bloque mirando a cada lado
- [x] 4.4 En `sfx.ts`: efecto `spikes` («¡uy!» corto y suave, distinto de `bump`), que no suena en modo invencible. Probar en `sfx.test.ts` que existe y respeta el silencio (`npx vitest run src/game/audio`) y escucharlo en el navegador junto al de `bump`

## 5. Doce niveles en el estado, la prueba y la celebración

- [x] 5.1 En `state.ts`: `LEVEL_COUNT = 12`. Probar en `state.test.ts` «Del seis al siete», «Mundo terminado» y «Solo quedan pendientes» con 12 niveles, y en `profile.test.ts` que un registro guardado con 6 niveles hechos se lee con los 6 hechos y el 7 actual (`npx vitest run src/game`)
- [x] 5.2 En `src/learning/quiz/catalog.ts`: entradas 7–12 con el ciclo de los niveles 1–6. Probar en `quiz.test.ts` que el 7 es `count` y el 12 es `recall`, y que `recall` funciona con un `LevelRecap` de un ambiente nuevo y 10 enemigos (`npx vitest run src/learning/quiz`)
- [x] 5.3 En `LevelCompleteScene`: la flecha grande abre el siguiente nivel hasta el 11 y el mapa en el 12, también en la pantalla de prueba no superada. Verificar en el navegador «Del seis al siete», «Último nivel del mundo» y «Último nivel»

## 6. Mapa de 12 niveles

- [x] 6.1 En `MapScene`:
  - Lienzo de 2 pantallas, 12 `NODES` en zigzag y bandera en el nodo 12.
  - Adornos de los ambientes nuevos en la segunda mitad.
  - Cielo y HUD (contador, Lalo, botón del zorro, selector) fijos a la cámara.
  - Límites de la cámara y centrado en el nivel actual al abrir.

  Verificar en el navegador a 844×390 y a 1280×720 «Primera partida», «Volver de un nivel avanzado» (nivel actual 9) y que el HUD no se mueve
- [x] 6.2 Arrastre con umbral de 12 px que cancela el `pressed` de los botones de nodo, y flechas a los lados que solo se ven si queda camino y desplazan la cámara con un tween. Verificar en el navegador, con emulación táctil, «Arrastrar», «Arrastrar empezando sobre un nivel», «Flechas» y «Final del camino», y que un toque corto sobre un nodo sigue abriendo el nivel y el candado sigue temblando

## 7. Comprobación final

- [x] 7.1 Ejecutar `npm test` y `npm run build` sin errores
- [x] 7.2 Partida en el navegador emulando un móvil de 844×390 con un perfil al que se le marcan a mano los niveles 1–6 como hechos. Se comprueba:
  - Que el mapa se abre en el 7.
  - Jugar el 7 entero cayendo a propósito en los pinchos y comiendo la fresa.
  - Pasar la prueba y continuar al 8.
  - Que las galletas, las estrellas y el mapa son correctos y no hay errores en la consola.
- [x] 7.3 Cronometrar el nivel 12 jugando con calma y yendo a tope, y comprobar que queda entre 90 y 150 s y por encima de 35 s
- [x] 7.4 Actualizar `docs/PROPUESTA.md` (mundo de 12 niveles, pinchos, ambientes nuevos y mapa que se desplaza) y comprobar que no contradice las specs del cambio

## Workflow follow-up

- Probar los niveles 7–9 con un niño de 4–6 años antes de archivar, por si hay que ajustar la anchura o el número de zonas.
- Al archivar, actualizar a mano el `## Purpose` de `openspec/specs/level-courses/spec.md` («los 6 recorridos» → «los 12 recorridos»).
- Archivar con `openspec-archive-change` cuando esté implementado y revisado.
