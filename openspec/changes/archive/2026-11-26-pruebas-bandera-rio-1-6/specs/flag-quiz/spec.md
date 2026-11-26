## ADDED Requirements

### Requirement: Pruebas del río por nivel
Cada mundo SHALL tener su propio catálogo de pruebas de la bandera. En el río, cada nivel SHALL tener siempre la misma: nivel 1, «¿Cuántos dedos?»; nivel 2, «El marco de diez»; nivel 3, «Parejas»; nivel 4, «El vecino»; nivel 5, «¿Dónde va?»; nivel 6, «El número más grande».

#### Scenario: Nivel 4 del río
- **WHEN** el niño llega a la bandera del nivel 4 del río
- **THEN** la prueba es «El vecino»

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
