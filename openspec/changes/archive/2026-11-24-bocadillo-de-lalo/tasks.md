# Tasks

## 1. Textos del bocadillo (lógica pura)

- [x] 1.1 Crear `src/learning/quiz/guide-text.ts` con `GuideText` y el registro `Record<QuizKind, GuideText>` de los seis tipos actuales, con los textos de `design.md`, y exportarlo desde `index.ts`. Verificación: `npx tsc --noEmit` pasa.
- [x] 1.2 Añadir a `quiz.test.ts` una prueba que recorre `QUIZ_KINDS`: ningún título, objetivo ni frase vacíos, títulos distintos entre sí y `goal + how` de 35 palabras o menos. Verificación: `npm test` pasa y falla si se borra el texto de un tipo.
- [x] 1.3 Si `pruebas-nuevas-de-la-bandera` ya está aplicado, añadir los seis textos de sus tipos. Si no, anotarlo en sus tareas (una tarea «texto del bocadillo» por tipo). Verificación: el `Record` compila con todos los `QuizKind` existentes.

## 2. Componente del bocadillo

- [x] 2.1 Crear `src/game/ui/lalo-bubble.ts`: fondo atenuado que cierra al tocarlo, bocadillo con cola hacia Lalo, etiqueta «Para el adulto», título, objetivo, frase, X y «ver otra vez», con `open`, `close`, `isOpen`, `onClose` y `onReplay`. Verificación: abrirlo en un móvil de 844×390 (escritorio con la ventana a ese tamaño) y comprobar que se parece a la maqueta y que el texto más largo cabe sin salirse.
- [x] 2.2 Dar a la X y a «ver otra vez» una zona táctil de al menos 44 px en pantalla. Verificación: medirlas en el navegador a 844×390.
- [x] 2.3 Recolocar el bocadillo al cambiar el tamaño (misma ruta que el resto de `QuizScene`). Verificación: girar o redimensionar con el bocadillo abierto y comprobar que sigue entero.

## 3. Integración en `QuizScene`

- [x] 3.1 Cambiar el toque en Lalo (`QuizScene.ts`, hoy llama a `demo()`) para abrir o cerrar el bocadillo, sin hacer nada si la prueba ha terminado. Verificación: tocar a Lalo en cada tipo de prueba y ver su texto.
- [x] 3.2 Añadir `guideOpen` y comprobarla en el toque de respuestas, en `demo()` y en las pistas; al abrir, parar la demostración en curso. Verificación: con el bocadillo abierto, tocar respuestas no cambia las marcas ni gasta intentos; abrirlo durante la demostración la detiene.
- [x] 3.3 Cerrar con X, tocando fuera, tocando a Lalo y con Esc (registrar y quitar el listener al apagar la escena). Verificación: probar los cuatro cierres; el toque de fuera no cuenta como respuesta.
- [x] 3.4 Conectar «ver otra vez»: cierra el bocadillo y repite `demo()` sin tocar intentos. Verificación: tras un fallo, abrirlo y repetir; la pregunta sigue con los intentos que quedaban.
- [x] 3.5 Comprobar que el bocadillo sigue abierto pasado un minuto sin tocar nada. Verificación: dejarlo abierto y comprobar que no se cierra solo.

## 4. La «?» de Lalo

- [x] 4.1 Añadir a `drawLalo` la opción de mostrar una «?» amarilla pequeña bajo Lalo y activarla solo en `QuizScene`. Verificación: aparece en la prueba y no en el nivel ni en el mapa; el altavoz sigue tocable.

## 5. Documentación y cierre

- [x] 5.1 Añadir en `docs/PROPUESTA.md`, en la prueba de la bandera, una frase sobre el bocadillo de Lalo para el adulto. Verificación: leer el párrafo.
- [x] 5.2 Pasada final: `npx tsc --noEmit`, `npm test` y una partida completa hasta la bandera abriendo el bocadillo en las tres preguntas. Verificación: todo en verde y sin errores en la consola.
