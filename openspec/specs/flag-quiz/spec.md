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
Cada nivel del mundo de los números SHALL tener siempre el mismo tipo de prueba: nivel 1, «¿Cuántos hay?»; nivel 2, «¿Dónde hay más?»; nivel 3, «Sigue la serie»; nivel 4, «Caza de formas»; nivel 5, «Las letras de tu nombre»; nivel 6, «¿Te acuerdas?»; nivel 7, «Reparte las galletas»; nivel 8, «De pequeño a grande»; nivel 9, «El teleférico»; nivel 10, «Huellas en la nieve»; nivel 11, «La balanza»; nivel 12, «La otra mitad».

#### Scenario: Nivel 3
- **WHEN** el niño llega a la bandera del nivel 3
- **THEN** la prueba es «Sigue la serie»

#### Scenario: Repetir un nivel
- **WHEN** el niño repite el nivel 5 y llega a la bandera
- **THEN** la prueba vuelve a ser «Las letras de tu nombre»

#### Scenario: Niveles nuevos
- **WHEN** el niño llega a la bandera del nivel 7 y, más tarde, a la del nivel 12
- **THEN** la prueba del 7 es «Reparte las galletas» y la del 12 es «La otra mitad»

#### Scenario: Cada prueba nueva con su pictograma
- **WHEN** se abren una tras otra las pruebas de los niveles 7 a 12 en un móvil horizontal de 844×390
- **THEN** cada una muestra su propio pictograma, distinto del de las demás pruebas, y Lalo hace su demostración antes de que el niño pueda tocar

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

### Requirement: Prueba «Reparte las galletas»
Se ve una cesta de galletas y varios platos, cada uno con un amigo dibujado. Cada toque en un plato lleva una galleta de la cesta a ese plato. Se acierta cuando la cesta queda vacía y todos los platos tienen lo mismo. Dar a un plato más de lo que le toca SHALL contar como fallo y la galleta SHALL volver a la cesta. La pista de Lalo SHALL repartir una vuelta de galletas transparentes, una a cada plato, que luego vuelven a la cesta.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «Reparte las galletas»
- **THEN** ve 2 platos y una cesta con 2, 4 o 6 galletas, y acierta cuando cada plato tiene la mitad

#### Scenario: Medianos
- **WHEN** a un perfil de 5 años le sale «Reparte las galletas»
- **THEN** ve 2 o 3 platos y como mucho 12 galletas, siempre un número que se reparte sin que sobre ninguna

#### Scenario: Mayores con sobras
- **WHEN** a un perfil de 8 años le salen 3 platos y 11 galletas
- **THEN** ve también el tarro de Lalo, y acierta cuando cada plato tiene 3 galletas y las 2 que sobran están en el tarro

#### Scenario: Tarro antes de tiempo
- **WHEN** un perfil de 8 años toca el tarro de Lalo cuando aún se puede dar otra vuelta completa a los platos
- **THEN** cuenta como fallo y la galleta vuelve a la cesta

#### Scenario: Plato lleno
- **WHEN** el niño toca un plato que ya tiene lo que le toca
- **THEN** la galleta rebota y vuelve a la cesta, cuenta como fallo y las galletas ya repartidas siguen en sus platos

#### Scenario: Pista de reparto
- **WHEN** el niño falla dos veces en la misma pregunta
- **THEN** Lalo reparte una vuelta de galletas transparentes, una a cada plato, que vuelven a la cesta sin cambiar lo que ya había repartido

### Requirement: Prueba «De pequeño a grande»
Se ven varios elementos sueltos y hay que tocarlos en orden; cada uno salta a su sitio en una fila. El pictograma de la consigna, una escalera que sube o que baja, indica si se ordena de pequeño a grande o de grande a pequeño. Tocar uno fuera de orden SHALL contar como fallo y los ya colocados SHALL seguir en su sitio. La pista de Lalo SHALL poner juntos el que toca y otro de los que quedan, para compararlos.

#### Scenario: Pequeños
- **WHEN** a un perfil de 3 años le sale «De pequeño a grande»
- **THEN** ve 3 dibujos iguales de tamaños muy distintos y la escalera que sube, y acierta tocándolos del más pequeño al más grande

#### Scenario: Medianos al revés
- **WHEN** a un perfil de 6 años le sale una pregunta con la escalera que baja
- **THEN** ve 4 dibujos de distinto tamaño y acierta tocándolos del más grande al más pequeño

#### Scenario: Mayores con números
- **WHEN** a un perfil de 7 años le sale «De pequeño a grande»
- **THEN** ve 5 tarjetas del mismo tamaño con cifras distintas del 1 al 20, y acierta tocándolas de menor a mayor o de mayor a menor según la escalera

#### Scenario: Tamaño claro
- **WHEN** se generan preguntas de dibujos para cualquier franja
- **THEN** dos dibujos seguidos en el orden correcto se diferencian claramente de tamaño a simple vista en un móvil de 844×390, y el tamaño no depende del color

#### Scenario: Fuera de orden
- **WHEN** el niño ha colocado dos elementos y toca uno que no es el siguiente
- **THEN** el elemento rebota, cuenta como fallo y los dos colocados siguen en la fila

### Requirement: Prueba «El teleférico»
Llega una cabina con pasajeros (erizos, abejas o caracoles). Se ve cómo suben o bajan otros, de uno en uno; luego se cierra la puerta, la cabina deja de verse por dentro y se toca cuántos hay ahora. Mientras dura la escena no se puede responder, y tocar a Lalo la repite. La pista de Lalo SHALL volver transparente la cabina, enseñar cuántos había al principio y seguir contando desde ahí los que suben, o descontando los que bajan.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «El teleférico»
- **THEN** solo suben pasajeros, hay como mucho 4 al final y las 3 respuestas son puntos de dado

#### Scenario: Medianos
- **WHEN** a un perfil de 5 años le sale «El teleférico»
- **THEN** solo suben pasajeros, hay como mucho 10 al final y las 3 respuestas son cifras

#### Scenario: Mayores en dos pasos
- **WHEN** a un perfil de 8 años le sale una pregunta en la que primero suben y luego bajan pasajeros
- **THEN** ve los dos pasos de uno en uno, nunca hay más de 20 ni menos de 0 pasajeros, y elige entre 4 respuestas en cifras

#### Scenario: No se cuenta mirando
- **WHEN** termina la escena y se puede responder
- **THEN** la puerta está cerrada y los pasajeros no se ven, hasta que Lalo da la pista o enseña la respuesta

#### Scenario: Pista de seguir contando
- **WHEN** el niño falla dos veces una pregunta en la que había 5 pasajeros y suben 3
- **THEN** la cabina se vuelve transparente, sobre ella aparece el 5 y los 3 que subieron se iluminan uno a uno mientras el número pasa a 6, 7 y 8

### Requirement: Prueba «Huellas en la nieve»
Se ve una cuadrícula nevada con Rufo en una casilla y una tira de flechas grandes. Hay que averiguar adónde llega Rufo si da un paso por cada flecha, en orden. Ninguna tira SHALL sacar a Rufo de la cuadrícula. Al acertar, Rufo SHALL recorrer el camino dejando huellas. La pista de Lalo SHALL hacer que un Rufo transparente siga la primera mitad de las flechas, dejando huellas; en la franja de mayores, SHALL apagar una tira incorrecta.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «Huellas en la nieve»
- **THEN** ve una cuadrícula de 3×3, una tira de 1 o 2 flechas y 3 casillas con un dibujo (pino, muñeco de nieve, iglú), y acierta tocando el dibujo de la casilla a la que llega Rufo

#### Scenario: Medianos
- **WHEN** a un perfil de 6 años le sale «Huellas en la nieve»
- **THEN** ve una cuadrícula de 4×4 y una tira de 3 o 4 flechas en las cuatro direcciones, y acierta tocando la casilla a la que llega Rufo

#### Scenario: Mayores eligen el camino
- **WHEN** a un perfil de 7 años le sale «Huellas en la nieve»
- **THEN** ve en la cuadrícula a Rufo y una fresa, y 3 tiras de 4 a 6 flechas, de las que solo una lleva a Rufo hasta la fresa

#### Scenario: Casilla equivocada
- **WHEN** un perfil de 6 años toca una casilla a la que no llega Rufo
- **THEN** la casilla rebota, cuenta como fallo y la pregunta sigue

#### Scenario: Casillas que se tocan bien
- **WHEN** aparece la cuadrícula de 4×4 en un móvil de 844×390
- **THEN** cada casilla mide al menos 44 px de lado en pantalla y la tira de flechas se ve entera, sin taparse con la cuadrícula ni con Lalo

### Requirement: Prueba «La balanza»
Se ve una balanza de mercado con dos platillos, sujeta en equilibrio. Según la franja, hay que tocar el platillo que bajará o cuántas galletas faltan para equilibrarla. Al acertar, la balanza SHALL soltarse y moverse para mostrar el resultado. La pista de Lalo SHALL depender de la franja: sopesar los dos objetos, emparejar las galletas de los dos platillos, o cambiar cada fresa por sus galletas.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «La balanza»
- **THEN** ve en un platillo un objeto pesado (sandía, piedra o calabaza) y en el otro uno ligero (pluma, hoja o fresa), y acierta tocando el platillo del pesado

#### Scenario: Pista de sopesar
- **WHEN** un perfil de 4 años falla dos veces la pregunta de la balanza
- **THEN** Lalo coge un objeto con cada ala y baja del lado del objeto pesado

#### Scenario: Medianos
- **WHEN** a un perfil de 6 años le sale «La balanza»
- **THEN** ve galletas en los dos platillos, de 1 a 9 en cada uno y nunca iguales, con un hueco en el platillo con menos, y elige entre 3 cifras cuántas galletas faltan para equilibrarla

#### Scenario: Pista de emparejar
- **WHEN** un perfil de 6 años falla dos veces la pregunta de las galletas
- **THEN** Lalo une con líneas, de una en una, las galletas de un platillo con las del otro, y brillan los huecos que quedan sin pareja

#### Scenario: Mayores con equivalencias
- **WHEN** a un perfil de 8 años le sale «La balanza»
- **THEN** ve arriba una balanza modelo equilibrada con 1 fresa en un lado y de 2 a 4 galletas en el otro, y debajo una balanza con 2 o 3 fresas, y elige entre 4 cifras cuántas galletas la equilibran, nunca más de 12

#### Scenario: Pista de cambiar fresas
- **WHEN** un perfil de 8 años falla dos veces la pregunta de las fresas
- **THEN** Lalo cambia cada fresa de la balanza por las galletas que vale según la balanza modelo, y luego vuelven a ser fresas

### Requirement: Prueba «La otra mitad»
Se ve la mitad de un dibujo junto a una línea de espejo, y hay que completar la otra mitad. Los dibujos SHALL ser simétricos y propios del juego (mariposa, cometa, la cara de Lalo, casita, flor, pez), y las opciones SHALL distinguirse por la forma, no solo por el color. La pista de Lalo SHALL doblar el dibujo por la línea y mostrar en transparente la mitad reflejada.

#### Scenario: Pequeños
- **WHEN** a un perfil de 3 años le sale «La otra mitad»
- **THEN** ve la mitad de un dibujo y 3 mitades para elegir; la correcta es la reflejada y las otras dos son mitades de dibujos distintos

#### Scenario: Medianos con trampa
- **WHEN** a un perfil de 5 años le sale «La otra mitad»
- **THEN** entre las 3 mitades está la reflejada, la misma mitad sin reflejar y otra con un detalle distinto, y solo la reflejada es correcta

#### Scenario: Mayores en cuadrícula
- **WHEN** a un perfil de 7 años le sale «La otra mitad»
- **THEN** ve una cuadrícula de 4 filas y 6 columnas con la línea de espejo en medio y algunas casillas pintadas a la izquierda, y tiene que tocar todas las casillas de la derecha que las reflejan

#### Scenario: Casilla de más
- **WHEN** un perfil de 7 años toca una casilla de la derecha que no refleja ninguna pintada
- **THEN** cuenta como fallo, las casillas ya bien tocadas siguen pintadas, y la pregunta cuenta como acertada al pintar todas si ha tenido menos de 3 fallos

#### Scenario: Pintado sin color
- **WHEN** se ven las casillas pintadas en una pantalla en escala de grises
- **THEN** se distinguen de las vacías porque llevan relleno y un dibujo, no solo un color

#### Scenario: Pista de doblar
- **WHEN** el niño falla dos veces una pregunta de «La otra mitad»
- **THEN** la mitad dibujada se dobla por la línea como una hoja de papel y se queda en transparente sobre el lado donde va la respuesta

### Requirement: Pruebas del río por nivel
Cada mundo SHALL tener su propio catálogo de pruebas de la bandera. En el río, cada nivel SHALL tener siempre la misma: nivel 1, «¿Cuántos dedos?»; nivel 2, «El marco de diez»; nivel 3, «Parejas»; nivel 4, «El vecino»; nivel 5, «¿Dónde va?»; nivel 6, «El número más grande»; nivel 7, «Los amigos del 10»; nivel 8, «El tren»; nivel 9, «Calcetines»; nivel 10, «Saltos de rana»; nivel 11, «Los barcos del puerto»; nivel 12, «Repaso del río».

#### Scenario: Nivel 4 del río
- **WHEN** el niño llega a la bandera del nivel 4 del río
- **THEN** la prueba es «El vecino»

#### Scenario: Nivel 12 del río
- **WHEN** el niño llega a la bandera del nivel 12 del río
- **THEN** la prueba es «Repaso del río»

### Requirement: Prueba «¿Cuántos dedos?»
La prueba SHALL mostrar una o dos manos con dedos levantados y pedir cuántos hay: de 3 a 4 años, una mano (1 a 5) y respuestas con puntos de dado; de 5 a 6 años, hasta 10 llenando primero una mano; de 7 a 8 años, hasta 10 repartidos entre las dos manos. La pista SHALL iluminar los dedos levantados de uno en uno.

#### Scenario: Dos manos
- **WHEN** un perfil de 6 años ve una mano entera y otra con tres dedos
- **THEN** la respuesta buena es 8

### Requirement: Prueba «El marco de diez»
La prueba SHALL mostrar un marco con fichas: de 5 casillas de 3 a 4 años y de 10 desde los 5. Hasta los 6 años se pregunta cuántas fichas hay; de 7 a 8 años, cuántas faltan para llenarlo, con las casillas vacías marcadas. La pista SHALL iluminar de una en una lo que hay que contar.

#### Scenario: Cuántas faltan
- **WHEN** un perfil de 8 años ve un marco de diez con 6 fichas
- **THEN** la respuesta buena es 4

### Requirement: Prueba «Parejas»
La prueba SHALL mostrar una cantidad de objetos y varias cartas con números (con puntos de dado de 3 a 4 años) que se ven al menos 2,5 s y se dan la vuelta. Tocar una carta la destapa; la buena es la que tiene el número de la cantidad. La pista SHALL destapar todas las cartas un momento.

#### Scenario: Carta equivocada
- **WHEN** el niño toca una carta que no es la pareja
- **THEN** la carta se destapa, se ve su número y se vuelve a tapar

### Requirement: Prueba «El vecino»
La prueba SHALL mostrar una fila de números con un hueco: de 3 a 4 años, el siguiente del 1 al 5 con puntos; de 5 a 6 años, el anterior o el siguiente del 1 al 10; de 7 a 8 años, además el de en medio, del 1 al 20.

#### Scenario: El anterior
- **WHEN** la fila muestra un hueco y después el 7
- **THEN** la respuesta buena es 6

### Requirement: Prueba «¿Dónde va?»
La prueba SHALL mostrar una tarjeta con un número y una recta con algunos números a la vista: del 1 al 5 con puntos de 3 a 4 años, del 0 al 10 de 5 a 6 años y del 0 al 20 de 2 en 2 de 7 a 8 años. El niño SHALL tocar el sitio del número entre varios marcados, separados lo bastante para el dedo. La pista SHALL saltar marca a marca desde el principio, contando, hasta el sitio.

#### Scenario: Colocar el 3
- **WHEN** la tarjeta lleva el 3 en la recta del 0 al 10
- **THEN** el sitio bueno es la tercera marca después del 0

### Requirement: Prueba «El número más grande»
La prueba SHALL mostrar la cesta llena (el más grande) o casi vacía (el más pequeño) y varios números sin objetos que contar: dos dados de 3 a 4 años (siempre el más grande), tres cifras del 1 al 10 de 5 a 6 años y del 1 al 20 de 7 a 8 años.

#### Scenario: El más pequeño
- **WHEN** la cesta está casi vacía y los números son 12, 5 y 9
- **THEN** la respuesta buena es 5

### Requirement: Prueba «Los amigos del 10»
La prueba SHALL mostrar la meta (5 de 3 a 4 años, 10 de 5 a 6 y 20 de 7 a 8) y un marco con fichas y casillas vacías marcadas, y pedir cuántas faltan para completarlo. La pista SHALL iluminar las casillas vacías de una en una.

#### Scenario: Completar el 10
- **WHEN** el marco de diez tiene 7 fichas
- **THEN** la respuesta buena es 3

### Requirement: Prueba «El tren»
La prueba SHALL mostrar una tarjeta con un puesto (con puntos de 3 a 4 años) y un tren con su locomotora y 3, 5 o 7 vagones según la edad, cada uno con un pasajero. El niño SHALL tocar el vagón de ese puesto contando desde la locomotora. La pista SHALL recorrer los vagones desde el primero, contando, hasta el puesto.

#### Scenario: El tercero
- **WHEN** la tarjeta dice 3
- **THEN** el vagón bueno es el tercero empezando por el pegado a la locomotora

### Requirement: Prueba «Calcetines»
De 3 a 4 años, la prueba SHALL mostrar un calcetín y pedir su pareja (mismo color y mismo dibujo) entre tres. Desde los 5 años SHALL mostrar una fila de calcetines (hasta 10, o hasta 20 de 7 a 8 años) y dos respuestas, «todos con pareja» y «sobra uno». La pista SHALL unir los calcetines de dos en dos y hacer brillar el que sobra.

#### Scenario: Nones
- **WHEN** hay 7 calcetines en la cuerda
- **THEN** la respuesta buena es «sobra uno»

### Requirement: Prueba «Saltos de rana»
La prueba SHALL mostrar una recta con la rana en la salida y, arriba, un arco por cada salto con su tamaño (sin número cuando es 1). El niño SHALL tocar dónde acaba la rana: de 1 en 1 hasta 5 de 3 a 4 años, de 1 o de 2 hasta 10 de 5 a 6 años y de 2, 3 o 5 hasta 20 de 7 a 8 años. La pista SHALL hacer saltar a la rana contando.

#### Scenario: Dos saltos de 5
- **WHEN** la rana sale del 7 y da dos saltos de 5
- **THEN** el sitio bueno es el 17

### Requirement: Prueba «Los barcos del puerto»
La prueba SHALL mostrar números (con puntos de 3 a 4 años) que se tocan de menor a mayor: 3 de 3 a 4 años, 4 hasta 10 de 5 a 6 años y 5 hasta 20 de 7 a 8 años.

#### Scenario: Ordenar
- **WHEN** salen 9, 2 y 5
- **THEN** hay que tocar 2, 5 y 9 en ese orden

### Requirement: Repaso del río
La prueba del nivel 12 del río SHALL hacer una pregunta de cada una de tres pruebas anteriores del río, distintas entre sí, y cada pregunta SHALL verse y tener la pista de su prueba.

#### Scenario: Tres pruebas distintas
- **WHEN** el niño llega a la bandera del nivel 12 del río
- **THEN** las tres preguntas son de tres pruebas distintas del río
