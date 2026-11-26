## ADDED Requirements

### Requirement: Estrellas por objetivos
En todos los mundos, las estrellas de una fase SHALL salir de dos objetivos: las galletas que el niño lleva al tocar la bandera (ya descontados los pinchazos) frente a las galletas de la fase (las de los bloques «?» y las que dan los retos del recorrido), y las preguntas acertadas de la prueba de la bandera, en cualquier intento. SHALL ganarse 1 estrella por llegar con al menos el 50 % de las galletas y otra por acertar al menos 1 de las 3 preguntas, de forma independiente. Las 3 estrellas SHALL exigir al menos el 80 % de las galletas y las 3 preguntas acertadas. Una fase sin galletas SHALL contar como el 100 %. Ni los retos del recorrido acertados a la primera ni el número de bloques «?» golpeados SHALL cambiar las estrellas por sí mismos. La tarjeta SHALL mostrar 3 estrellas, llenas las ganadas y grises las que faltan, con la central más grande.

#### Scenario: Todo
- **WHEN** el niño llega a la bandera con el 80 % o más de las galletas de la fase y acierta las 3 preguntas
- **THEN** la tarjeta muestra 3 estrellas llenas

#### Scenario: Galletas sin preguntas
- **WHEN** el niño llega con el 60 % de las galletas y no acierta ninguna pregunta
- **THEN** la tarjeta muestra 1 estrella llena y 2 grises

#### Scenario: Preguntas sin galletas
- **WHEN** el niño llega con el 20 % de las galletas y acierta 1 pregunta
- **THEN** la tarjeta muestra 1 estrella llena y 2 grises

#### Scenario: Dos objetivos sin el pleno
- **WHEN** el niño llega con el 90 % de las galletas y acierta 2 preguntas
- **THEN** la tarjeta muestra 2 estrellas llenas

#### Scenario: Los pinchazos cuentan
- **WHEN** una fase tiene 10 galletas, el niño recoge 6 y pierde 2 con pinchazos antes de la bandera
- **THEN** llega con el 40 % y no gana la estrella de las galletas

#### Scenario: Mejor resultado
- **WHEN** el niño repite un nivel que ya tenía con 3 estrellas y esta vez consigue 1
- **THEN** el mapa sigue mostrando 3 estrellas en ese nivel

### Requirement: Pantalla de ánimo sin estrellas
Si el niño no cumple ningún objetivo (0 estrellas), el juego SHALL abrir una pantalla de ánimo sin texto, sin confeti y sin estrellas: el zorro y Lalo saludando, y las galletas recogidas, que SHALL sumarse al total. La fase SHALL NOT quedar superada ni guardar estrellas, y esa partida SHALL NOT desbloquear el siguiente nivel. La pantalla SHALL ofrecer dos botones sin texto: repetir (flecha circular, el más grande y en coral) y mapa.

#### Scenario: Volver a empezar
- **WHEN** el niño llega a la bandera del nivel 2 con menos de la mitad de las galletas, 3 recogidas, y no acierta ninguna pregunta
- **THEN** ve al zorro y a Lalo saludando, la galleta con el número 3 y ninguna estrella, y su total de galletas sube en 3

#### Scenario: Repetir
- **WHEN** en esa pantalla el niño toca la flecha circular grande
- **THEN** el nivel 2 empieza de nuevo con el contador de galletas a cero

#### Scenario: El siguiente sigue cerrado
- **WHEN** en esa pantalla el niño toca el mapa y el nivel 2 no estaba hecho
- **THEN** el nivel 2 es el actual y el 3 sigue bloqueado

#### Scenario: Repetir un nivel ya hecho
- **WHEN** el niño repite el nivel 1, hecho con 2 estrellas, y no cumple ningún objetivo
- **THEN** ve la pantalla de ánimo y el nivel 1 sigue hecho con 2 estrellas

## MODIFIED Requirements

### Requirement: Celebración al completar
Al terminar la prueba de la bandera con al menos 1 estrella, el juego SHALL abrir la pantalla de nivel completado, con confeti, el zorro celebrando con el gorro elegido y una tarjeta central sin texto. Solo entonces el nivel SHALL quedar completado.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera de un nivel
- **THEN** primero aparece la prueba de la bandera y la pantalla de nivel completado no se abre hasta terminarla

#### Scenario: Fase superada
- **WHEN** el niño termina la prueba de la bandera con al menos 1 estrella
- **THEN** en menos de 2 segundos aparece la pantalla de nivel completado con confeti y el zorro celebrando

### Requirement: Galletas ganadas
La tarjeta SHALL mostrar las galletas recogidas en el nivel con el icono de la galleta con pepitas de
chocolate y un número, y esas galletas SHALL sumarse al total del niño.

#### Scenario: Suma de galletas
- **WHEN** el niño tenía 5 galletas y termina un nivel recogiendo 4
- **THEN** la tarjeta muestra 4 galletas y el mapa muestra 9

#### Scenario: Nivel sin galletas
- **WHEN** el niño termina un nivel sin recoger ninguna galleta y acierta alguna pregunta
- **THEN** la tarjeta muestra la galleta con el número 0 y su total no cambia

## REMOVED Requirements

### Requirement: Estrellas de 1 a 3
**Reason**: Rafael cambia la regla: las estrellas salen de las galletas y de la prueba de la bandera en todos los mundos, y puede haber 0.
**Migration**: ver «Estrellas por objetivos» y «Pantalla de ánimo sin estrellas».

### Requirement: Estrellas por retos
**Reason**: Ya no hay regla de estrellas por mundo; los retos del recorrido dejan de contar.
**Migration**: ver «Estrellas por objetivos».

### Requirement: Pantalla de prueba no superada
**Reason**: La prueba ya no se aprueba ni se suspende; lo que lleva a la pantalla de ánimo es no ganar ninguna estrella.
**Migration**: ver «Pantalla de ánimo sin estrellas».
