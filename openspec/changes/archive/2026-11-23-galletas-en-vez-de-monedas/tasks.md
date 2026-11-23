# Tasks

## 1. Gráfico de la galleta

- [x] 1.1 Dibujar `public/assets/svg/cookie.svg` (viewBox 48×48) según design.md §1: sombra inferior sólida `#B9783F`, masa `#E7A85C` con borde irregular, 5–6 pepitas `#5A3A2A` de tamaños distintos y sin simetría, sin contornos negros. Verificación: abrir el SVG en el navegador a 30, 46 y 56 px junto a `star.svg` y comprobar que se lee como galleta con pepitas, no como moneda.
- [x] 1.2 Borrar `public/assets/svg/coin.svg` y en `public/assets/LICENSES.md` sustituir su fila por `svg/cookie.svg` («derivado: galleta con pepitas de chocolate en la paleta del lienzo»). Verificación: `grep -rn coin public/` no devuelve nada y `cookie.svg` figura en `LICENSES.md`.
- [x] 1.3 En `src/game/scenes/BootScene.ts` cargar `svg('cookie', 'cookie', 56)` en lugar de `coin`. Verificación: `npm run dev`, abrir en Chrome emulando 844×390 y la consola no muestra avisos de texturas que faltan.

## 2. Estado del juego en galletas

- [x] 2.1 En `src/game/state.ts` renombrar `GameState.coins` → `cookies` y el parámetro de `completeLevel` → `cookies`, y actualizar comentarios («galletas»), incluido el de `HAT_PRICES` y `buyHat`. Verificación: `npx tsc --noEmit` solo falla en los usos aún por renombrar de las escenas y las pruebas.
- [x] 2.2 Actualizar `src/game/state.test.ts` al nuevo nombre y a los escenarios de las specs («5 + 4 = 9 galletas», «12 galletas, gorro de 10 → quedan 2», «3 galletas → no cambia», estado inicial con 0 galletas). Verificación: `npm test` pasa.

## 3. Contador y escenas

- [x] 3.1 En `src/game/ui/widgets.ts` renombrar `coinCounter`/`CoinCounter` → `cookieCounter`/`CookieCounter` y dibujar la textura `cookie`. Verificación: `npx tsc --noEmit` señala solo los usos de las escenas por renombrar.
- [x] 3.2 `LevelScene.ts`: el bloque «?» suelta la galleta (misma animación de subir y desvanecerse), el campo pasa a `cookies`, el HUD usa `cookieCounter` y se envía `{ cookies }` a `LevelComplete`. Verificación: en el móvil emulado, golpear un bloque desde abajo hace salir una galleta y el contador de arriba a la derecha pasa de 0 a 1; golpearlo otra vez no lo cambia.
- [x] 3.3 `LevelCompleteScene.ts`: leer `cookies` de los datos, sumarlas con `completeLevel` y mostrar la galleta con el número en la tarjeta. Verificación: en el móvil emulado, terminar un nivel con 4 bloques golpeados muestra la galleta y el 4; terminar otro sin golpear ninguno muestra la galleta y el 0.
- [x] 3.4 `MapScene.ts` y `WardrobeScene.ts`: usar `cookieCounter` con `session.cookies`, y en las casillas de gorros bloqueados mostrar la galleta pequeña junto al precio. Verificación: en el móvil emulado, tras ganar 9 galletas el mapa y «mi personaje» muestran la galleta y el 9; los precios de los gorros llevan la galleta y, a 30 px, se distingue como galleta; con galletas suficientes la compra resta el precio.
- [x] 3.5 Comprobar que no queda el concepto moneda en el código. Verificación: `grep -rniE "coin|moneda" src/` no devuelve nada y `npm run build` termina sin errores.

## 4. Documentación

- [x] 4.1 En `docs/PROPUESTA.md` cambiar monedas → galletas (con pepitas de chocolate) en la tabla de retos («Coge el montón con más galletas»), bloques «?», mecánica de premios, HUD, comentario de `scoring.ts`, modelo de datos `profile`, hoja de ruta (fase 4) y nota del personaje. Verificación: `grep -n -i moneda docs/PROPUESTA.md` no devuelve nada y el texto sigue siendo coherente al leerlo.

## 5. Comprobación integrada

- [x] 5.1 Recorrido completo en Chrome emulando 844×390 y 1180×820: nivel 1 golpeando todos los bloques → nivel completado → mapa → mi personaje → comprar un gorro → jugar con él. Verificación: en ninguna pantalla aparece una moneda ni una palabra, las galletas cuadran en cada paso y `npm run build` incluye `cookie.svg` (y no `coin.svg`) en el precache de `dist/sw.js`.

## Workflow follow-up

- Al archivar, actualizar el `## Purpose` de `openspec/specs/platformer-level/spec.md`, `level-complete/spec.md` y `character-wardrobe/spec.md`, que todavía dicen «monedas» (los Purpose no se cambian por delta).
- Archivar el cambio con `openspec archive galletas-en-vez-de-monedas` tras revisarlo y desplegarlo con `npm run deploy`.
