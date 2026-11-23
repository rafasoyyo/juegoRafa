# Tasks

## 1. Formato de nivel y validación (TypeScript puro)

- [x] 1.1 Crear `src/game/levels/types.ts` con los tipos del nivel en baldosas (`ambient`, `length`, `steps`, `platforms`, `blocks`) y las constantes geométricas (baldosa 84 px, peldaño 63 px, filas `low`/`high` a 141/198 px); verificar con `npm run build` sin errores de tipos
- [x] 1.2 Implementar `parseLevel` (forma del JSON, con error que nombra nivel y elemento) y la conversión a píxeles del mundo (salida, bandera, superficies, `y` de cada bloque según la superficie de debajo); verificar con tests en `src/game/levels/parse.test.ts` que cubren un JSON válido, un campo que falta y un bloque sobre plataforma
- [x] 1.3 Implementar `validateLevel` con las reglas de la tabla de `design.md` §2 (subidas, alcance de la cabeza, hueco para estar de pie, banda del HUD, huecos entre escalones, salida y bandera libres, densidad ≤ 8 s, límites y solapes); verificar con tests en `validate.test.ts` que hay un caso que falla por cada regla y uno válido que pasa
- [x] 1.4 Implementar `estimateDuration` (`fastS`, `calmS` con los coeficientes de `design.md` §3); verificar con un test sobre un nivel de ejemplo con valores calculados a mano

## 2. Los seis recorridos

- [x] 2.1 Escribir `content/levels/nivel-1.json` … `nivel-6.json` siguiendo la tabla orientativa de `design.md` §3 (ambientes, longitudes, bloques, escalones y plataformas con dificultad creciente) y el catálogo `LEVELS` que los importa; verificar con `npm run build` que se importan
- [x] 2.2 Añadir `src/game/levels/catalog.test.ts` que, para los 6 niveles, compruebe `validateLevel` sin errores, `fastS ≥ 30`, `60 ≤ calmS ≤ 120`, 12–20 bloques no decrecientes, que no hay dos niveles con la misma disposición y la curva (nivel 1 llano sin plataformas, escalones desde el 2, plataformas desde el 3, el 6 con más que ninguno); verificar con `npm test` en verde

## 3. Ambientes

- [x] 3.1 Crear `src/game/levels/ambients.ts` con los 6 ambientes (cielo, colinas, hierba, tierra, nubes y tipo de decoración) de `design.md` §5, con el prado igual a los colores actuales; verificar con un test que los 6 existen, que todo nivel apunta a uno válido y que el prado coincide con `COLORS`
- [x] 3.2 En `BootScene`, crear una textura de cielo por ambiente y generar por código las texturas de decoración (árbol verde, árbol de otoño, mata de flores, sol bajo, luna, estrella); verificar en el navegador (DevTools, móvil horizontal emulado 844×390) con `this.textures.exists` para cada clave y sin errores en consola
- [x] 3.3 Dar a `widgets.ts` el escenario por ambiente (cielo, colinas, suelo, nubes y decoración de fondo con paralaje y opacidad menor que el recorrido) sin cambiar el aspecto del mapa ni de mi personaje; verificar en el navegador emulado que el mapa y mi personaje se ven igual que antes
- [x] 3.4 Anotar los gráficos nuevos (plataformas, escalones y decoración) como propios generados por código en `public/assets/LICENSES.md`; verificar leyendo el archivo que aparecen todos

## 4. El nivel construido desde los datos

- [x] 4.1 Reducir `src/game/level-course.ts` a las constantes geométricas y hacer que `LevelScene` tome salida, bandera, ancho del mundo, bloques y ambiente del nivel que recibe; verificar con `npm run build` y abriendo los niveles 1 y 6 en el navegador emulado: longitudes distintas y bandera al final
- [x] 4.2 Añadir los escalones como cuerpos estáticos sólidos dibujados con hierba y tierra del ambiente; verificar en el navegador emulado (nivel 2) que el zorro se para contra el lado sin saltar, sube saltando y baja corriendo
- [x] 4.3 Añadir las plataformas de un solo sentido (colisión solo por arriba, grosor ≥ 36 px) con su dibujo por ambiente; verificar en el navegador emulado (nivel 3) que se atraviesan saltando desde abajo, se aterriza encima, se cae por el borde y que caer desde la más alta del nivel 6 no la atraviesa
- [x] 4.4 Colocar cada bloque «?» sobre la superficie que tiene debajo y pasar a `LevelComplete` el número de bloques del nivel; verificar en el navegador emulado que un bloque sobre plataforma da galleta y que golpear todos los bloques del nivel 4 da 3 estrellas
- [x] 4.5 Dibujar el escenario con el ambiente del nivel; verificar en el navegador emulado 844×390 que los 6 niveles muestran cielo, colinas, suelo y decoración diferentes, que el HUD, el zorro y los bloques mantienen sus colores y que en la noche y el atardecer zorro, bloques y enemigos se distinguen bien

## 5. Enemigos

- [x] 5.1 Cambiar `Course.blocks` por `keepClear` (bloques, escalones y plataformas) en `enemy-layout.ts` y pasarlo desde `LevelScene`; verificar con tests nuevos en `enemy-layout.test.ts` que ningún enemigo cae sobre un escalón ni bajo una plataforma, que los 6 niveles reales tienen sitio para todos sus enemigos, y con `npm test` en verde

## 6. Comprobación integrada

- [ ] 6.1 Cronometrar en el navegador emulado (o en un móvil por la wifi con `npm run dev`) los niveles 1 y 6 jugando con calma y golpeando todos los bloques, y yendo a tope; verificar que el nivel 1 dura ≥ 60 s con calma y ≥ 30 s a tope y el 6 ≤ 2 min con calma; si no, ajustar coeficientes de `estimateDuration` o longitudes y volver a pasar `npm test`
- [ ] 6.2 Recorrer los 6 niveles de principio a fin en el navegador emulado con CPU ralentizada ×4; verificar que no hay sitio donde el zorro quede atrapado, que no aparece ninguna palabra y que la animación se mantiene fluida (panel de rendimiento sin caídas sostenidas por debajo de 50 fps)
- [x] 6.3 Ejecutar `npm run build` y `npm test`; verificar que ambos terminan sin errores

## Workflow follow-up

- Si `musica-y-efectos` se ha aplicado antes, integrar sus cambios en `LevelScene` al implementar el grupo 4.
- Archivar el cambio tras revisarlo y sincronizar las specs `level-courses`, `platformer-level`, `level-enemies` y `visual-style`.
