## ADDED Requirements

### Requirement: Las piedras del géiser
El reto D de la isla SHALL mostrar un tótem de piedra en la orilla con una forma tallada y, sobre un lago de lava, una fila de seis piedras con una forma grabada cada una. Las piedras que cumplen lo del tótem SHALL aguantar y sonar al pisarlas; las otras SHALL hundirse despacio con un siseo, y Rufo SHALL volver con un saltito a la piedra buena anterior (o a la orilla) sin pinchazo ni galleta menos. Nunca SHALL haber dos piedras malas seguidas. Al llegar a la otra orilla el géiser SHALL lanzar una columna de vapor, y el reto SHALL contar como acertado a la primera si Rufo no pisó ninguna piedra mala.

#### Scenario: Pisar una piedra mala
- **WHEN** el tótem muestra un círculo y Rufo salta a una piedra con un triángulo
- **THEN** la piedra se hunde despacio, Rufo vuelve a la piedra buena anterior y el contador de galletas no cambia

### Requirement: Lo que pide el tótem según la edad
De 3 a 4 años SHALL pedir la forma, con el tótem y todas las piedras del mismo color y tamaño. De 5 a 6 SHALL pedir la forma aunque las piedras cambien de color o tamaño, con el tótem sin color. De 7 a 8 SHALL pedir forma y color a la vez, y entre las malas SHALL haber una con la forma y otro color y otra con el color y otra forma.

#### Scenario: Dos rasgos
- **WHEN** a un niño de 8 años el tótem le muestra un círculo turquesa
- **THEN** un círculo ámbar y un cuadrado turquesa se hunden

### Requirement: Escalera de fallos del géiser
Al primer fallo la forma del tótem SHALL iluminarse; al segundo, las piedras buenas SHALL brillar de una en una; al tercero, las malas SHALL hundirse del todo y Lalo SHALL volar sobre las buenas, de modo que solo quede el camino bueno. En la demostración Lalo SHALL ir al tótem, iluminarlo y hacer brillar las piedras buenas.

#### Scenario: Tercer fallo
- **WHEN** Rufo pisa una piedra mala por tercera vez
- **THEN** las malas se hunden en la lava y solo quedan las buenas
