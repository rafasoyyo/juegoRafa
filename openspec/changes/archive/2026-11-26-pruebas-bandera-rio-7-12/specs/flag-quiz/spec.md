## MODIFIED Requirements

### Requirement: Pruebas del río por nivel
Cada mundo SHALL tener su propio catálogo de pruebas de la bandera. En el río, cada nivel SHALL tener siempre la misma: nivel 1, «¿Cuántos dedos?»; nivel 2, «El marco de diez»; nivel 3, «Parejas»; nivel 4, «El vecino»; nivel 5, «¿Dónde va?»; nivel 6, «El número más grande»; nivel 7, «Los amigos del 10»; nivel 8, «El tren»; nivel 9, «Calcetines»; nivel 10, «Saltos de rana»; nivel 11, «Los barcos del puerto»; nivel 12, «Repaso del río».

#### Scenario: Nivel 4 del río
- **WHEN** el niño llega a la bandera del nivel 4 del río
- **THEN** la prueba es «El vecino»

#### Scenario: Nivel 12 del río
- **WHEN** el niño llega a la bandera del nivel 12 del río
- **THEN** la prueba es «Repaso del río»

## ADDED Requirements

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
