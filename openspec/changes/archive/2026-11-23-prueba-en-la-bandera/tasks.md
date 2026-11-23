# Tasks

## 1. Progreso con niveles pendientes (sin Phaser)

- [x] 1.1 En `src/game/state.ts`: añadir `pending: Set<number>` a `GameState`; crear `markPending(state, level, cookies)`, que suma galletas y marca pendiente solo si el nivel no está hecho; hacer que `completeLevel` quite el nivel de `pending`; añadir el estado `pending` a `levelStatus`; crear `isUnlocked`, y cambiar `currentLevel` (primer nivel sin jugar, luego el primer pendiente, `null` si todos están hechos) y `canPlay`. Probar en `state.test.ts` los escenarios de world-map («Prueba no superada», «Solo quedan pendientes», «Pendiente superado más tarde») y que repetir un nivel hecho y fallar no lo deshace (`npx vitest run src/game/state.test.ts`)
- [x] 1.2 En `progress-codec.ts`: guardar y leer `pending: number[]`, que se lee como vacío si falta, ignora niveles fuera de rango e ignora los que ya tienen estrellas. Probar el ida y vuelta, un registro antiguo sin `pending` (sigue con sus niveles hechos) y un `pending` dañado (`npx vitest run src/game/profile`)
- [x] 1.3 En `active.ts`: guardar en memoria el alias y la edad del perfil activo, también sin almacenamiento, y exponer `activeAlias()` y `activeAge()` (sin perfil: `'ZORRO'` y `undefined`); copiar `pending` en `fill`. Probar con el almacén falso que `startProfile` y `activateProfile` dejan el alias y la edad correctos, también con el almacén a `null` (`npx vitest run src/game/profile`)

## 2. Lógica de las pruebas (`src/learning/quiz/`, TypeScript puro)

- [x] 2.1 Crear `types.ts`, `age.ts` (`ageBand`: 3-4 → small, 5-6 → medium, 7-8 → big, desconocida → medium), `catalog.ts` (nivel → tipo de prueba) y `rng.ts` (mulberry32 con semilla). Probar las franjas, el catálogo de los 6 niveles y que con la misma semilla sale la misma secuencia (`npx vitest run src/learning/quiz`)
- [x] 2.2 Crear `run.ts` con `createRun`, `tap` y `result`: 3 intentos por pregunta; pistas 1 = demostración y 2 = la propia del tipo; `failed` con la respuesta correcta; preguntas de tocar varias con orden y sin él; la opción apagada no cuenta como fallo; prueba superada con 2 o más aciertos de 3. Probar los escenarios de «Pistas al fallar y tres intentos» y «Prueba superada con dos de tres» con preguntas hechas a mano (`npx vitest run src/learning/quiz`)
- [x] 2.3 Crear el generador `count.ts` para las tres franjas. Probar con 200 semillas por franja los rangos (1-3, 1-10, 8-20), el número y el formato de las respuestas (puntos o cifras), que la correcta está entre ellas, que no hay opciones repetidas y que las tres preguntas no son idénticas (`npx vitest run src/learning/quiz`)
- [x] 2.4 Crear el generador `compare.ts`. Probar con 200 semillas por franja que nunca hay empate, la diferencia de al menos 3 en pequeños, que «menos» no sale a los pequeños, que los mayores tienen 3 grupos y tamaños variables, y que la respuesta correcta es coherente con «más» o «menos» (`npx vitest run src/learning/quiz`)
- [x] 2.5 Crear el generador `series.ts`. Probar los patrones de cada franja (AB; AAB/ABB/ABC; AABB/ABBC/creciente), que los elementos distintos se distinguen por forma o dibujo y no solo por color, que el hueco va al final salvo en mayores, y que la respuesta correcta es única entre las 3 (`npx vitest run src/learning/quiz`)
- [x] 2.6 Crear el generador `shapes.ts`. Probar con 200 semillas por franja las formas permitidas, el número de piezas (6, 8 o 10) y de objetivos (2-3, 3-4, 3-5), que el color no se correlaciona con la forma (cada forma objetivo aparece en al menos 2 colores a lo largo de las semillas) y que hay al menos una pieza distractora (`npx vitest run src/learning/quiz`)
- [x] 2.7 Crear el generador `name-letters.ts`. Probar con «LUCIA», «ANA», «Ñ» y «MARIAJOSEFAA» en las tres franjas: letra destacada, hueco o ordenar según la franja; distractores que no están en el alias; alias de 1 letra sin pregunta de ordenar; y que al ordenar «ANA» vale cualquier A en su turno (`npx vitest run src/learning/quiz`)
- [x] 2.8 Crear el generador `recall.ts` a partir de un `LevelRecap`. Probar el escenario «Paisaje de noche», que erizo y abeja valen si los dos aparecieron y el caracol nunca, «Contar de memoria» (3 erizos y 2 abejas), 3 o 4 respuestas en cifras según la franja, y que la respuesta 0 es posible si no hubo abejas (`npx vitest run src/learning/quiz`)

## 3. Arte de la prueba

- [x] 3.1 Crear `src/game/ui/quiz-art.ts` con Graphics: las 7 formas (color, tamaño y giro como parámetros), puntos de dado, miniatura de ambiente (con los colores de `ambients.ts`), los 6 pictogramas de tipo de prueba, las cestas llena y casi vacía, y la marca de progreso (estrella pequeña, círculo vacío y actual más grande). Verificar en el navegador, con una escena de muestra temporal o la propia `QuizScene`, que se distinguen sin color (captura en escala de grises)
- [x] 3.2 Dibujar el SVG propio `public/assets/svg/snail.svg` en el estilo del juego, cargarlo en `BootScene` y anotarlo en `public/assets/LICENSES.md` como arte propio. Verificar que `npm run build` lo incluye y que se ve en la pregunta «¿a quién te has encontrado?»

## 4. Escena de la prueba

- [x] 4.1 Crear `QuizScene` y registrarla en `src/main.ts`: cielo del ambiente del nivel; Lalo con su altavoz arriba a la izquierda; tres marcas de progreso; modelo y respuestas recolocables con `onResize`; ancho útil de como mucho 1200 px lógicos; respuestas de al menos 120 px lógicos. Verificar en el navegador a 844×390 y a 1280×720 que todo se ve a la vez, sin solaparse, y que cada respuesta mide al menos 44 px en pantalla
- [x] 4.2 Dibujar los descriptores de opción (objeto, cifra, puntos, letra, forma, ambiente) y las preguntas de elegir y de tocar varias, conectadas a `run.ts`: acierto con salto de Lalo y sonido `star`; fallo con rebote y sonido `nope`; avance de las marcas. Verificar en el navegador con las 6 pruebas (abriendo `Quiz` con `level` 1 a 6) que se puede responder a cada una
- [x] 4.3 Hacer la demostración inicial (la flecha recorre el modelo y las respuestas, con los toques bloqueados), repetirla al tocar a Lalo y al primer fallo, añadir las pistas propias (`count-up`, `pair-up`, `rhythm`, `misfit`, `dim-wrong` con cruz) y señalar la respuesta durante 2 s tras el 3.er fallo. Verificar en el navegador fallando a propósito una pregunta de cada tipo
- [x] 4.4 Usar `activeAge()` y `activeAlias()` para la franja y el alias, y añadir el gancho `speak()` sin efecto. Verificar en el navegador con perfiles de 3, 5 y 8 años que la prueba del nivel 1 cambia de dificultad, y que la del nivel 5 usa el alias del perfil

## 5. Integración con el nivel, la celebración y el mapa

- [x] 5.1 En `LevelScene.onGoal`: construir el `LevelRecap` (ambiente, erizos y abejas a partir de las apariciones, galletas y bloques) y abrir `Quiz` en lugar de `LevelComplete`, en menos de 2 s. Verificar en el navegador que al tocar la bandera aparece la prueba, que no hay botón para saltarla y que en el nivel 6 la pregunta de erizos coincide con los que había
- [x] 5.2 En `LevelCompleteScene`: aceptar `passed`; si es `true`, mantener el comportamiento actual; si es `false`, llamar a `markPending` y `saveActive`, mostrar la tarjeta de ánimo (zorro y Lalo saludando, galletas, sin estrellas ni confeti, sonido `prize`) y que la flecha grande abra `level + 1` (o el mapa en el nivel 6). Verificar en el navegador los escenarios «Ánimo sin castigo», «Seguir al siguiente nivel», «Volver a intentarlo» y «Último nivel»
- [x] 5.3 En `MapScene`: dibujar el nodo pendiente (amarillo, con globo de Lalo y «?», sin estrellas), que se pueda tocar, y colocar el zorro según el nuevo `currentLevel`. Verificar en el navegador los escenarios de world-map y, tras recargar, que el estado pendiente se conserva

## 6. Comprobación final

- [x] 6.1 Ejecutar `npm test` y `npm run build` sin errores
- [x] 6.2 Recorrido completo en el navegador emulando un móvil de 844×390, con un perfil nuevo de 4 años: superar la prueba del nivel 1, fallar la del 2, pasar al 3, volver al 2 desde el mapa y superarla. Comprobar que el mapa, las estrellas y las galletas son correctos en cada paso y que no hay errores en la consola
- [x] 6.3 Con un perfil guardado antes del cambio (registro sin `pending` creado a mano en `localStorage`), comprobar en el navegador que sus niveles hechos siguen hechos
- [x] 6.4 Actualizar `docs/PROPUESTA.md` (sección 1.4 y estructura) para describir la prueba de la bandera, las franjas de edad y el estado pendiente, y comprobar que no contradice las specs del cambio

## Workflow follow-up

- Archivar el cambio con `openspec-archive-change` cuando esté implementado y revisado.
