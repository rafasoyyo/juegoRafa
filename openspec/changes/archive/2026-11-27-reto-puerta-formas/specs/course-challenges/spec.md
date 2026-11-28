## ADDED Requirements

### Requirement: La puerta de la cueva
El reto B de la isla SHALL mostrar una losa de piedra, más alta de lo que llega un salto, que tapa la entrada de un templo y tiene un hueco con una forma, y tres bloques de piedra con una forma cada uno, siempre derechos. Golpear el bloque cuya forma encaja SHALL hacer volar la pieza al hueco, girando lo que haga falta, encajarla con un golpe de piedra, iluminar el borde del hueco y hacer que el triceratops aparte la losa, que deja de cortar el paso y da 3 galletas.

#### Scenario: Encaja girando
- **WHEN** el hueco es un triángulo girado un cuarto de vuelta y el niño golpea el bloque del triángulo
- **THEN** el triángulo vuela, gira hasta encajar y la losa se aparta

### Requirement: Formas de la puerta según la edad
De 3 a 4 años las formas SHALL ser círculo, cuadrado y triángulo, sin girar. De 5 a 6 SHALL sumarse estrella, rombo y óvalo, y el hueco PUEDE estar girado un cuarto de vuelta (solo en las formas a las que el giro les cambia la cara). De 7 a 8 SHALL ser piezas compuestas sin simetría con el hueco girado, y uno de los bloques SHALL ser la misma pieza volteada, que no encaja.

#### Scenario: Volteada no encaja
- **WHEN** a un niño de 8 años le sale una L girada en el hueco
- **THEN** el bloque de la L volteada es un fallo

### Requirement: Escalera de fallos de la puerta
Al primer fallo la pieza del bloque SHALL volar al hueco, no caber, rebotar con un golpe sordo y volver; al segundo, un brillo SHALL recorrer el borde del hueco; al tercero, Lalo SHALL señalar el bloque y la pieza SHALL encajar sola. Fallar SHALL NOT quitar galletas.

#### Scenario: Segundo fallo
- **WHEN** el niño golpea un bloque que no encaja por segunda vez
- **THEN** un brillo recorre el borde del hueco de esquina a esquina
