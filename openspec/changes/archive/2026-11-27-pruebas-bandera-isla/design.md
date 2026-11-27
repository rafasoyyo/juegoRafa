# Design

## Contexto

Las pruebas de la bandera son datos (`Question`) que genera `src/learning/quiz/` con semilla y que dibuja `QuizScene`. Las del río añadieron vistas propias; las de la isla caben en las disposiciones que ya existen.

## Decisiones

- **Sin vistas nuevas.** Todas son de elegir una respuesta (`choice`) con las disposiciones `model` (marco con el modelo), `row` (serie con hueco) y una nueva, `picture` (un dibujo grande sin marco: el nido, la rampa, los triángulos). El marco del modelo crece hasta 240 px cuando no es una forma.
- **Arte con Graphics, sin archivos.** Los dinosaurios se trazan con elipses y polígonos en una caja unidad, así la sombra es el mismo dibujo de un solo color y no hace falta registrar recursos nuevos. Todo se dibuja una vez al crear la pregunta (nada por fotograma).
- **No depender del color.** Las escamas llevan una marca blanca por color; las formas de «Formas en las cosas» y «Las placas» tienen colores al azar; las piezas de «Igual aunque gire» llevan un punto blanco que gira con ellas.
- **Pistas.** La de encajar (`misfit`) donde hay un modelo que comparar (sombras, cosas, placas, piezas); apagar una falsa (`dim-wrong`) en el resto.
- **El fósil no gira las piezas.** El hueco se compara por casillas normalizadas; con 4 casillas el cuadrado no sale de hueco, porque girado sigue igual y la pieza girada falsa no existiría.
- **Formas escondidas.** El número de triángulos de cada dibujo es una tabla comprobada a mano (1, 2, 2, 3, 5, 6, 8) y la respuesta falsa preferida es la de contar solo los trozos.

## Riesgos

- Las escenas de posición (detrás frente a dentro) se distinguen por si lo de dentro se ve sobre el hueco oscuro o asoma por un lado; conviene mirarlo en la prueba con niños.
