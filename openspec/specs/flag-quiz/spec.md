# flag-quiz Specification

## Purpose

Al llegar a la bandera de cada nivel, plantear al niño una prueba educativa corta y divertida de tres preguntas. Cada nivel tiene su propio tipo de prueba, adaptado a la edad del perfil, con consignas sin texto y pistas de Lalo. La prueba decide si el nivel queda completado.

## Requirements

### Requirement: La prueba aparece al llegar a la bandera
Al tocar la bandera, el juego SHALL abrir la prueba de la bandera en menos de 2 segundos, tras la celebración breve del zorro y antes de la pantalla de nivel completado. La prueba SHALL NOT poder saltarse con ningún botón. Siempre termina, porque cada pregunta acaba como acertada o fallada.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera del nivel 1
- **THEN** en menos de 2 segundos se abre la prueba del nivel 1, y la pantalla de nivel completado no aparece hasta acabar la prueba

#### Scenario: Sin salida a mitad
- **WHEN** el niño está en la segunda pregunta de la prueba
- **THEN** no hay ningún botón para volver al mapa ni para pasar al nivel siguiente sin acabarla

### Requirement: Un tipo de prueba por nivel
Cada nivel del mundo de los números SHALL tener siempre el mismo tipo de prueba: nivel 1, «¿Cuántos hay?»; nivel 2, «¿Dónde hay más?»; nivel 3, «Sigue la serie»; nivel 4, «Caza de formas»; nivel 5, «Las letras de tu nombre»; nivel 6, «¿Te acuerdas?». Los niveles 7 a 12 SHALL repetir esos tipos en el mismo orden: el 7 como el 1, el 8 como el 2 y así hasta el 12 como el 6.

#### Scenario: Nivel 3
- **WHEN** el niño llega a la bandera del nivel 3
- **THEN** la prueba es «Sigue la serie»

#### Scenario: Repetir un nivel
- **WHEN** el niño repite el nivel 5 y llega a la bandera
- **THEN** la prueba vuelve a ser «Las letras de tu nombre»

#### Scenario: Niveles nuevos
- **WHEN** el niño llega a la bandera del nivel 7 y, más tarde, a la del nivel 12
- **THEN** la prueba del 7 es «¿Cuántos hay?» y la del 12 es «¿Te acuerdas?», con lo que pasó en el nivel 12

### Requirement: Tres preguntas por prueba
Cada prueba SHALL tener exactamente tres preguntas, una detrás de otra. Arriba SHALL verse tres marcas que indiquen en qué pregunta va el niño y cuáles ha acertado o fallado, sin depender solo del color: una pregunta acertada lleva una estrella pequeña, una fallada un círculo vacío y la actual es más grande. Las preguntas SHALL generarse al azar y dos preguntas seguidas de la misma prueba SHALL NOT ser idénticas.

#### Scenario: Avance
- **WHEN** el niño acierta la primera pregunta
- **THEN** la primera marca se convierte en estrella pequeña, la segunda se agranda y aparece la segunda pregunta

#### Scenario: Preguntas distintas
- **WHEN** se genera una prueba de «¿Cuántos hay?»
- **THEN** sus tres preguntas no tienen todas la misma cantidad ni los mismos objetos

### Requirement: Dificultad según la edad del perfil
La dificultad de cada prueba SHALL depender de la franja de edad del perfil activo: pequeños (3 y 4 años), medianos (5 y 6) y mayores (7 y 8). Si no se conoce la edad, SHALL usarse la franja de medianos.

#### Scenario: Mismo nivel, distinta edad
- **WHEN** un perfil de 4 años y otro de 7 llegan a la bandera del nivel 1
- **THEN** al de 4 años se le piden cantidades de 1 a 3 con respuestas en puntos, y al de 7, cantidades hasta 20 con respuestas en cifras

### Requirement: Consignas sin texto ni voz
Cada pregunta SHALL entenderse sin leer palabras ni oír voz: un pictograma del tipo de prueba, un modelo dibujado de lo que se busca cuando lo haya, y Lalo con una flecha animada que señala dónde hay que tocar. Las respuestas SHALL ser dibujos, puntos de dado, cifras o letras sueltas.

#### Scenario: Pantalla de pregunta
- **WHEN** aparece una pregunta de «Caza de formas»
- **THEN** se ve arriba, en un marco, la forma que hay que buscar, y Lalo señala con la flecha las piezas, sin ninguna palabra escrita

#### Scenario: Primera pregunta de la prueba
- **WHEN** aparece la primera pregunta
- **THEN** Lalo hace una pequeña demostración (la flecha recorre el modelo y luego las respuestas) antes de que el niño pueda tocar

### Requirement: Cabe y se toca bien en el móvil
La prueba SHALL usarse en un móvil horizontal de 844×390: el modelo, las respuestas, las marcas de progreso y Lalo SHALL verse a la vez, sin taparse, y cada respuesta SHALL medir al menos 44 px de lado en pantalla. Mientras dura la prueba, el zorro y los enemigos SHALL estar parados y los controles de movimiento y salto SHALL estar ocultos.

#### Scenario: Móvil pequeño
- **WHEN** aparece una pregunta de «¿Cuántos hay?» para mayores en un móvil de 844×390
- **THEN** se ven todos los objetos que hay que contar y las 4 respuestas, cada una de al menos 44 px de lado

### Requirement: Lalo guía la prueba
Lalo SHALL estar visible durante toda la prueba con su altavoz al lado, que sigue siendo el único control de sonido. Al acertar, Lalo SHALL celebrarlo con un salto y un sonido alegre. Tocar a Lalo SHALL abrir el bocadillo del adulto y SHALL NOT repetir la demostración de la consigna: esa repetición se pide desde el bocadillo.

#### Scenario: Tocar a Lalo
- **WHEN** el niño, o el adulto que lo acompaña, toca a Lalo durante una pregunta
- **THEN** se abre el bocadillo del adulto y la pregunta sigue igual, sin gastar ningún intento

#### Scenario: Acertar
- **WHEN** el niño acierta una pregunta
- **THEN** Lalo salta y suena un sonido alegre

### Requirement: Pistas al fallar y tres intentos
Cada pregunta SHALL permitir 3 intentos. Un fallo SHALL dar un rebote suave y un sonido amable, nunca un castigo. Tras el 1.er fallo, Lalo SHALL repetir la demostración de la consigna. Tras el 2.º, Lalo SHALL dar la pista propia de esa prueba. Tras el 3.er fallo, la pregunta SHALL contar como fallada, Lalo SHALL señalar la respuesta correcta durante 2 s y la prueba SHALL pasar a la siguiente pregunta.

#### Scenario: Primer fallo
- **WHEN** el niño toca una respuesta incorrecta por primera vez en una pregunta
- **THEN** la respuesta rebota, suena un sonido suave, Lalo repite la demostración y el niño puede volver a intentarlo

#### Scenario: Tercer fallo
- **WHEN** el niño falla por tercera vez la misma pregunta
- **THEN** su marca queda como círculo vacío, Lalo señala la respuesta correcta y aparece la siguiente pregunta

#### Scenario: Acierto tras una pista
- **WHEN** el niño acierta en el segundo o el tercer intento
- **THEN** la pregunta cuenta como acertada

### Requirement: Prueba superada con dos de tres
La prueba SHALL superarse con al menos 2 preguntas acertadas de 3, con cualquier número de intentos. Superarla completa el nivel. Si no se supera, el nivel no queda completado, aunque el siguiente nivel sí se desbloquea.

#### Scenario: Dos aciertos
- **WHEN** el niño acierta la primera y la tercera pregunta y falla la segunda
- **THEN** la prueba está superada y se abre la celebración de nivel completado

#### Scenario: Un acierto
- **WHEN** el niño acierta solo una pregunta
- **THEN** la prueba no está superada y se abre la pantalla de prueba no superada

#### Scenario: Repetir un nivel ya hecho y fallar
- **WHEN** el niño repite el nivel 1, que ya estaba hecho con 2 estrellas, y no supera la prueba
- **THEN** el nivel 1 sigue hecho con 2 estrellas

### Requirement: La prueba no da estrellas
La prueba SHALL NOT sumar ni quitar estrellas ni galletas. Las estrellas del nivel SHALL seguir dependiendo solo de los bloques «?» golpeados.

#### Scenario: Prueba perfecta sin bloques
- **WHEN** el niño llega a la meta sin golpear ningún bloque y acierta las tres preguntas a la primera
- **THEN** la celebración muestra 1 estrella

### Requirement: Prueba «¿Cuántos hay?»
Se ven unos objetos del juego (galletas, erizos, abejas o estrellas) y se toca cuántos hay. Pequeños: de 1 a 3 objetos, con 3 respuestas en puntos de dado. Medianos: de 1 a 10, con 3 respuestas en cifras. Mayores: de 8 a 20, ordenados en marcos de 10, con 4 respuestas en cifras. La pista de Lalo SHALL iluminar los objetos uno a uno, de izquierda a derecha.

#### Scenario: Pequeños
- **WHEN** a un perfil de 3 años le sale «¿Cuántos hay?» con 2 abejas
- **THEN** ve 3 respuestas en puntos de dado y una de ellas tiene 2 puntos

#### Scenario: Pista de contar
- **WHEN** el niño falla dos veces una pregunta de «¿Cuántos hay?»
- **THEN** los objetos se iluminan de uno en uno, de izquierda a derecha

### Requirement: Prueba «¿Dónde hay más?»
Se ven grupos de objetos y se toca el que tiene más o, según el pictograma de la consigna (una cesta llena o casi vacía), el que tiene menos. Nunca hay empate. Pequeños: 2 grupos de 1 a 6 que se diferencian en al menos 3, y siempre se pide «más». Medianos: 2 grupos de 1 a 10, «más» o «menos». Mayores: 3 grupos de hasta 15, «más» o «menos», con objetos de distinto tamaño. La pista de Lalo SHALL unir con líneas los objetos de los grupos de uno en uno y hacer brillar los que sobran.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «¿Dónde hay más?»
- **THEN** ve dos grupos que se diferencian en al menos 3 objetos y la cesta llena en la consigna

#### Scenario: Tamaño engañoso
- **WHEN** a un perfil de 8 años le sale una pregunta de «¿Dónde hay más?»
- **THEN** los objetos de los grupos tienen tamaños distintos, de forma que el grupo que ocupa más sitio no siempre es el que tiene más

### Requirement: Prueba «Sigue la serie»
Se ve una fila de elementos que sigue un patrón con un hueco, y se toca el elemento que va en el hueco entre 3 respuestas. Los elementos de una serie SHALL distinguirse por la forma o por el dibujo, nunca solo por el color. Pequeños: patrones AB y el hueco al final. Medianos: AAB, ABB y ABC, con el hueco al final. Mayores: AABB, ABBC o cantidades que crecen (1, 2, 3 puntos…), con el hueco en cualquier posición. La pista de Lalo SHALL marcar con un arco cada repetición del patrón.

#### Scenario: Serie AB
- **WHEN** a un perfil de 3 años le sale «Sigue la serie»
- **THEN** ve una fila como galleta, estrella, galleta, estrella, hueco, y la galleta es una de las 3 respuestas

#### Scenario: Pista de ritmo
- **WHEN** el niño falla dos veces una serie
- **THEN** Lalo marca con un arco cada repetición del patrón en la fila

### Requirement: Prueba «Caza de formas»
Arriba, en un marco, se ve una forma modelo; debajo, varias piezas. Hay que tocar todas las piezas con la forma del modelo. El color de las piezas SHALL ser aleatorio y no indicar la forma. Pequeños: círculo y cuadrado, 6 piezas, 2 o 3 que buscar. Medianos: círculo, cuadrado y triángulo, 8 piezas de distintos tamaños, 3 o 4 que buscar. Mayores: además rombo, estrella, hexágono y rectángulo, 10 piezas con tamaños y giros distintos, de 3 a 5 que buscar.

#### Scenario: Pieza correcta
- **WHEN** el niño toca una pieza con la forma del modelo
- **THEN** la pieza salta al marco del modelo y queda marcada, y la pregunta sigue hasta tocar todas

#### Scenario: Pieza equivocada
- **WHEN** el niño toca una pieza que no tiene la forma del modelo
- **THEN** cuenta como fallo, las piezas ya acertadas siguen marcadas y la pista de Lalo pone esa pieza sobre el modelo para que se vea que no encaja

#### Scenario: Pregunta acabada
- **WHEN** el niño ha tocado todas las piezas con la forma del modelo
- **THEN** la pregunta cuenta como acertada si en ella ha tenido menos de 3 fallos

### Requirement: Prueba «Las letras de tu nombre»
Usa el alias del perfil, en letras grandes. Pequeños: el alias se ve con una letra destacada y hay que tocar la misma letra entre 3 opciones. Medianos: el alias tiene un hueco y hay que tocar la letra que falta entre 3. Mayores: dos preguntas de hueco con 4 opciones y una de tocar en orden las letras del alias desordenadas. Las letras que hacen de distractor SHALL NOT estar en el alias. La pista de Lalo SHALL apagar una opción incorrecta.

#### Scenario: Pequeños
- **WHEN** el perfil «LUCIA», de 4 años, llega a la bandera del nivel 5
- **THEN** la primera pregunta muestra «LUCIA» con la L destacada y tres letras sueltas, una de ellas L

#### Scenario: Ordenar el nombre
- **WHEN** a un perfil de 8 años le sale la pregunta de ordenar
- **THEN** las letras del alias aparecen mezcladas, cada toque correcto las va colocando en orden y tocar una fuera de orden cuenta como fallo

#### Scenario: Alias corto
- **WHEN** el alias tiene 1 letra
- **THEN** las tres preguntas usan esa letra y no aparece la pregunta de ordenar

#### Scenario: Sin perfil guardado
- **WHEN** se juega sin almacenamiento disponible
- **THEN** la prueba usa el alias escrito al crear el perfil en esa sesión

### Requirement: Prueba «¿Te acuerdas?»
Las preguntas tratan del nivel recién jugado, que ya no se ve. Pequeños: el paisaje (3 miniaturas), qué salía de los bloques (galleta, estrella o caracol) y a quién se ha encontrado (erizo, abeja o caracol). Medianos: el paisaje, cuántos erizos o abejas había y cuántas galletas ha cogido. Mayores: cuántos erizos, cuántas abejas y cuántas galletas. La pista de Lalo SHALL apagar una opción incorrecta.

#### Scenario: A quién te has encontrado
- **WHEN** un perfil de 3 años ha visto erizos y abejas en el nivel
- **THEN** tanto el erizo como la abeja son respuestas correctas y el caracol no

#### Scenario: Respuestas en cifras
- **WHEN** a un perfil de 5 años le sale una pregunta de cuántos, o a uno de 8 años
- **THEN** el de 5 años ve 3 respuestas en cifras y el de 8, 4

#### Scenario: Paisaje de noche
- **WHEN** un perfil de 5 años llega a la bandera del nivel 6, que es de noche
- **THEN** una pregunta muestra tres miniaturas de paisaje, una de ellas de noche, y esa es la correcta

#### Scenario: Contar de memoria
- **WHEN** un perfil de 7 años ha pasado junto a 3 erizos y 2 abejas en el nivel
- **THEN** la respuesta correcta a la pregunta de los erizos es 3 y la de las abejas, 2

#### Scenario: Contador de galletas oculto
- **WHEN** aparece la pregunta de cuántas galletas ha cogido
- **THEN** el contador de galletas del nivel no se ve en la pantalla

### Requirement: Bocadillo de Lalo para el adulto
Al tocar a Lalo, la prueba SHALL mostrar un bocadillo de cómic, con la cola hacia Lalo, que SHALL llevar la etiqueta «Para el adulto», el nombre de la prueba, su objetivo educativo y una frase para guiar al niño. El texto SHALL estar en español, SHALL ser distinto para cada tipo de prueba y SHALL tener 35 palabras o menos entre objetivo y frase.

El bocadillo SHALL aparecer solo cuando se toca a Lalo y SHALL poder abrirse en cualquier pregunta, también después de fallar. La prueba sigue sin texto ni voz para el niño.

#### Scenario: Leer el objetivo
- **WHEN** el adulto toca a Lalo en la prueba «¿Cuántos hay?»
- **THEN** el bocadillo muestra la etiqueta «Para el adulto», el nombre «¿Cuántos hay?», su objetivo y una frase para guiar al niño

#### Scenario: Texto distinto por prueba
- **WHEN** se abre el bocadillo en dos tipos de prueba distintos
- **THEN** el nombre, el objetivo y la frase son los de cada prueba

#### Scenario: No aparece solo
- **WHEN** empieza la prueba o aparece una pregunta nueva
- **THEN** el bocadillo está cerrado hasta que se toque a Lalo

### Requirement: La prueba se pausa mientras el bocadillo está abierto
Con el bocadillo abierto, la pregunta SHALL verse atenuada y SHALL quedar en pausa: las respuestas SHALL NOT poder tocarse, no SHALL gastarse ningún intento y no SHALL empezar ni avanzar ninguna demostración, pista ni cambio de pregunta. Si había una demostración en curso, SHALL detenerse al abrir el bocadillo. Al cerrarlo, la pregunta SHALL seguir como estaba, con los mismos intentos y las mismas respuestas ya usadas.

#### Scenario: Tocar una respuesta con el bocadillo abierto
- **WHEN** el bocadillo está abierto y se toca una respuesta
- **THEN** no pasa nada y no se gasta ningún intento

#### Scenario: Abrir durante la demostración
- **WHEN** Lalo está haciendo la demostración y se toca a Lalo
- **THEN** la demostración se detiene y se abre el bocadillo

#### Scenario: Volver a la pregunta
- **WHEN** el adulto cierra el bocadillo tras un fallo
- **THEN** la pregunta sigue con los intentos que quedaban y las respuestas ya usadas siguen atenuadas

### Requirement: Cerrar el bocadillo
El bocadillo SHALL tener un botón de cierre (X) de al menos 44 px de lado en pantalla y SHALL poder cerrarse también tocando fuera del bocadillo, tocando a Lalo otra vez o con la tecla Esc. El bocadillo SHALL NOT cerrarse solo por el paso del tiempo. La X, el botón «ver otra vez» y todo lo demás del bocadillo SHALL caber sin taparse con Lalo, el pictograma ni las marcas de progreso en un móvil de 844×390.

#### Scenario: Cerrar con la X
- **WHEN** el adulto toca la X
- **THEN** el bocadillo se cierra y la pregunta vuelve a ser tocable

#### Scenario: Cerrar tocando fuera
- **WHEN** el adulto toca la zona atenuada fuera del bocadillo
- **THEN** el bocadillo se cierra y ese toque no cuenta como respuesta

#### Scenario: Cerrar tocando a Lalo
- **WHEN** el bocadillo está abierto y se toca a Lalo
- **THEN** el bocadillo se cierra

#### Scenario: Esperar
- **WHEN** el bocadillo lleva abierto un minuto sin tocar nada
- **THEN** sigue abierto

#### Scenario: Móvil pequeño
- **WHEN** se abre el bocadillo en un móvil de 844×390
- **THEN** se ve entero, la X mide al menos 44 px de lado y no tapa a Lalo, el pictograma ni las marcas de progreso

### Requirement: Ver otra vez desde el bocadillo
El bocadillo SHALL incluir un botón «ver otra vez» de al menos 44 px de lado que SHALL cerrarlo y repetir la demostración de la consigna de la pregunta actual. Repetirla SHALL NOT gastar ningún intento ni cambiar la pregunta.

#### Scenario: Repetir la demostración
- **WHEN** el adulto toca «ver otra vez»
- **THEN** el bocadillo se cierra, Lalo repite la demostración y la pregunta sigue igual

### Requirement: Lalo muestra que se puede tocar
Durante la prueba, Lalo SHALL mostrar una «?» amarilla pequeña que indica que se le puede tocar. La marca SHALL ser un dibujo, no una palabra, SHALL verse también con el bocadillo cerrado y SHALL NOT tapar el altavoz de Lalo.

#### Scenario: Ver la marca
- **WHEN** aparece cualquier pregunta de la prueba
- **THEN** Lalo lleva la «?» amarilla y su altavoz sigue visible y tocable
