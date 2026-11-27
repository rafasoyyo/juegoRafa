## ADDED Requirements

### Requirement: El paseo en braquiosaurio
El reto C de la isla SHALL mostrar un braquiosaurio metido en un río humeante, en la orilla de salida, con una tablilla de piedra en el lomo que lleva un emblema tallado al que le falta una pieza, y tres bloques de piedra en la orilla con una pieza cada uno. Golpear el bloque cuya pieza tiene la forma del hueco SHALL hacerla volar a su sitio, encajarla con un golpe de piedra y encender los grabados del emblema; después el braquiosaurio SHALL agacharse y, cuando Rufo se sube al lomo, cruzar el río despacio hasta la otra orilla.

#### Scenario: Completar el emblema
- **WHEN** al emblema de la casa le falta el tejado y el niño golpea el bloque del triángulo del tejado
- **THEN** el triángulo vuela a su sitio, el emblema se enciende y el braquiosaurio se agacha para que Rufo suba

### Requirement: Piezas del emblema según la edad
De 3 a 4 años el emblema SHALL tener dos mitades. De 5 a 6 SHALL tener 2 o 3 piezas. De 7 a 8 SHALL ser un tangram de 4 piezas, y a menudo uno de los bloques SHALL ser la pieza buena girada, que no encaja. Las piezas SHALL NOT girar al volar: encaja la que tiene la forma del hueco tal cual, y los tres bloques SHALL tener formas distintas.

#### Scenario: Girada no encaja
- **WHEN** a un niño de 8 años le falta un triángulo y uno de los bloques es ese triángulo girado un cuarto de vuelta
- **THEN** ese bloque es un fallo

### Requirement: Escalera de fallos del braquiosaurio
Al primer fallo la pieza del bloque SHALL posarse en el hueco, sobrar o faltar por un lado y volver a su bloque; al segundo, el hueco SHALL llenarse de puntitos que dibujan la forma que falta; al tercero, Lalo SHALL señalar el bloque y el emblema SHALL completarse solo. Fallar SHALL NOT quitar galletas. En la demostración Lalo SHALL ir a la tablilla, enseñar los puntitos y señalar el bloque bueno.

#### Scenario: Segundo fallo
- **WHEN** el niño golpea por segunda vez un bloque que no encaja
- **THEN** el hueco se llena de puntitos con la forma de la pieza que falta
