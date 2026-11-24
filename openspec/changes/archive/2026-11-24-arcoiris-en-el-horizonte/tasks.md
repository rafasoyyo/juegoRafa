# Tasks

## 1. Función pura del arcoíris

- [x] 1.1 Añadir a `Ambient` el campo opcional `rainbowAlpha` (documentado como `pitMix`) y dárselo solo a `noche`, con la mitad de la opacidad normal. En `ambients.test.ts`, una prueba de que la noche es el único ambiente con el arcoíris más tenue y de que toda opacidad está entre 0 y 1. Verificación: `npm test -- ambients` pasa.
- [x] 1.2 Crear `src/game/levels/horizon-rainbow.ts` con `RAINBOW_ALPHA` y `horizonRainbow(level, ambient, viewW, worldW)` → `{ width, x, bottom, alpha, scrollFactor }`, según la decisión 1 de `design.md`. TypeScript puro, sin importar `phaser`. Verificación: `npx tsc --noEmit` pasa y `grep -n "phaser" src/game/levels/horizon-rainbow.ts` no encuentra nada.
- [x] 1.3 Escribir `horizon-rainbow.test.ts` con los 12 niveles reales (`LEVELS` y `AMBIENTS`) y los anchos 960, 1558 y 1680. Debe comprobar: el ancho crece estrictamente del 1 al 11; el 12 es el mayor; el 11 mide al menos un tercio del ancho de 960; la noche es más tenue que el atardecer y la playa; toda opacidad es ≤ 0,8; el centro del arco está dentro de la vista a la salida (scroll 0) y a la bandera (scroll `worldW − viewW`), y a la salida está en la mitad derecha (salvo el 12); fuera de rango (0, 13) el nivel se acota a 1..12. Verificación: `npm test -- horizon-rainbow` pasa.

## 2. Textura y dibujo en el nivel

- [x] 2.1 En `BootScene`, generar `decor-rainbow` a 1200×624 (trazo y radios al doble, los mismos 6 colores en el mismo orden) y corregir el comentario a «seis bandas». Verificación: `npm run build` pasa y en `npm run dev` la miniatura del ambiente de nubes de la prueba de la bandera se ve igual que antes, dentro de su marco.
- [x] 2.2 En `widgets.ts`, añadir a `addScenery` los parámetros del nivel y del ancho de la vista. Dibujar el arcoíris justo después del cielo con `horizonRainbow` (`setOrigin(0.5, 1)`, `setDisplaySize` a partir de `width`, `setScrollFactor(scrollFactor, 1)` y `setAlpha(alpha)`) y borrar el bloque que dibujaba el arcoíris solo en `decor === 'rainbow'`. Las nubes grandes del ambiente de nubes siguen delante. Verificación: `npm run build` pasa y `grep -n "'decor-rainbow'" src/game/ui/widgets.ts` da una sola línea.
- [x] 2.3 En `LevelScene.create`, pasar `this.level` y `this.scale.width` a `addScenery`. Verificación: `npm run build` y `npm test` pasan, y en `npm run dev` el nivel 1 muestra un arcoíris pequeño a la derecha.

## 3. Revisión en móvil

- [x] 3.1 Con `npm run dev` y el navegador a 844×390, abrir los niveles 1, 6, 9, 11 y 12 y ajustar en `horizon-rainbow.ts` los tamaños, la base y la posición hasta que: en el 1 sea pequeño y asome sobre las colinas; en el 6 se vea tenue y no tape la luna; en el 9 asome por detrás de los picos; en el 11 ocupe más o menos medio cielo; en el 12 Rufo corra bajo el arco. Volver a pasar `npm test -- horizon-rainbow` tras cada ajuste. Verificación: capturas de los cinco niveles a 844×390.
- [x] 3.2 En los niveles 1, 5, 6 y 11 a 844×390, correr de la salida a la bandera. Verificación: el arcoíris se mueve despacio hacia el centro y sigue a la vista hasta la bandera; los bloques «?», los enemigos, los pinchos y la bandera se ven enteros por delante; el sol del 5 y la luna del 6 se reconocen.
- [x] 3.3 Repetir el nivel 1 y el 12 a 1024×768 (4:3) y a 1180×820. Verificación: el arcoíris se ve en la mitad derecha al empezar, no se sale al llegar a la bandera y las bandas del 12 no se ven borrosas.
- [x] 3.4 Integración final. Verificación: `npm test` y `npm run build` pasan sin errores.

## Workflow follow-up

- Cuando la revisión esté hecha: `openspec-sync-specs` y `openspec-archive-change`.
- Marcar el paso 1 como hecho en el plan de `docs/MUNDO-1.md` si se lleva el estado allí, y seguir con el paso 2 (`mapa-del-arcoiris`).
