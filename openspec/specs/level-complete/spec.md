# level-complete Specification

## Purpose
Celebrar el final de cada nivel sin presión: el niño ve cuántas estrellas y galletas ha ganado y elige
con un toque si sigue, repite o vuelve al mapa.

## Requirements

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

### Requirement: Tres caminos tras la celebración
La pantalla SHALL ofrecer tres botones sin texto: mapa (icono de mapa), siguiente nivel (flecha, el más
grande y en coral) y repetir (flecha circular). En el último nivel del mundo, el 12, el botón de
siguiente SHALL llevar al castillo si el mundo tiene y, si no, al mapa.

#### Scenario: Siguiente nivel
- **WHEN** el niño completa el nivel 2 y toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Del seis al siete
- **WHEN** el niño completa el nivel 6 y toca la flecha grande
- **THEN** se abre el nivel 7

#### Scenario: Último nivel del mundo
- **WHEN** el niño completa el nivel 12 de un mundo sin castillo y toca la flecha grande
- **THEN** se abre el mapa

#### Scenario: Del último nivel al castillo
- **WHEN** el niño completa el último nivel de un mundo con castillo y toca la flecha grande
- **THEN** empieza el castillo

#### Scenario: Repetir
- **WHEN** el niño toca la flecha circular
- **THEN** el mismo nivel empieza de nuevo con el contador de galletas del nivel a cero

#### Scenario: Volver al mapa
- **WHEN** el niño toca el icono de mapa
- **THEN** se abre el mapa con el nivel recién completado en estado hecho

### Requirement: Pantalla de la medalla
Al terminar el castillo de un mundo, la pantalla SHALL mostrar confeti, el zorro celebrando y una tarjeta sin texto con la medalla del mundo y las galletas, sin estrellas. La flecha grande SHALL llevar al mapa y la flecha circular, a repetir el castillo.

#### Scenario: Fin del castillo
- **WHEN** el niño termina el castillo del río
- **THEN** aparece la medalla con confeti y, al tocar la flecha grande, el mapa del río

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
