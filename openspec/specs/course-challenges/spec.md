# course-challenges Specification

## Purpose

Llevar el aprendizaje del número al recorrido: retos que cortan el paso y se resuelven golpeando un bloque desde abajo, con pistas que nunca atascan al niño.

## Requirements

### Requirement: Bloques que cuentan
Un reto de tipo «bloques que cuentan» SHALL mostrar un cartel junto al camino y, encima del camino, tres bloques con caras distintas, solo uno de ellos correcto, y detrás una compuerta. En el modo normal el cartel SHALL mostrar una cantidad (puntos o marco de diez) y los bloques cifras; al revés, el cartel SHALL mostrar la cifra y los bloques cantidades. Nada del reto SHALL exigir leer palabras.

#### Scenario: Acertar
- **WHEN** el cartel muestra 4 puntos y el niño golpea desde abajo el bloque del 4
- **THEN** el bloque suena, la compuerta se levanta, caen galletas que se suman al contador y el camino queda libre

#### Scenario: Al revés
- **WHEN** el reto va al revés con un perfil de 5 años
- **THEN** el cartel muestra una cifra y los tres bloques muestran cantidades

#### Scenario: En el móvil
- **WHEN** el niño se acerca a un reto en un móvil horizontal de 844×390
- **THEN** el cartel, los tres bloques y la compuerta se ven a la vez sin tapar los controles

### Requirement: Cantidades según la edad
Los valores del reto SHALL adaptarse a la franja de edad del perfil: de 3 a 4 años, puntos con puntos de 1 a 5 (también al revés); de 5 a 6 años, de 1 a 10, con el marco de diez o los puntos y las cifras; de 7 a 8 años, de 1 a 20, con dos marcos de diez. Los retos de un mismo nivel SHALL tener respuestas distintas y los bloques SHALL tener valores distintos entre sí.

#### Scenario: Perfil de 4 años
- **WHEN** un perfil de 4 años llega a un reto de bloques que cuentan
- **THEN** el cartel y los bloques muestran puntos y la respuesta está entre 1 y 5

#### Scenario: Perfil de 8 años
- **WHEN** un perfil de 8 años llega a un reto con marco de diez
- **THEN** el cartel muestra dos marcos de diez y la respuesta está entre 1 y 20

### Requirement: La compuerta corta el paso
Mientras el reto no esté resuelto, la compuerta SHALL impedir pasar, también saltando desde un bloque. Una vez resuelto, SHALL dejar el paso libre hasta el final del nivel.

#### Scenario: Intentar saltar la compuerta
- **WHEN** el niño sube a un bloque del reto y salta hacia la compuerta cerrada
- **THEN** choca con ella y no pasa al otro lado

### Requirement: Escalera de fallos
Golpear un bloque incorrecto SHALL NOT quitar galletas ni estrellas ya ganadas. El primer fallo SHALL hacer que el bloque se tambalee sin dar galleta y que el cartel dé un saltito; el segundo, que los puntos del cartel (o, al revés, unos puntos bajo la cifra) se enciendan de uno en uno con un «tic»; el tercero, que Lalo vuele hasta el bloque correcto, lo señale y la compuerta se abra igualmente.

#### Scenario: Primer fallo
- **WHEN** el niño golpea un bloque incorrecto por primera vez en ese reto
- **THEN** el bloque se tambalea, el cartel da un saltito, no sale galleta y el contador no baja

#### Scenario: Tercer fallo
- **WHEN** el niño golpea un bloque incorrecto por tercera vez en ese reto
- **THEN** Lalo vuela al bloque correcto y lo señala, y la compuerta se abre

### Requirement: Demostración de Lalo
Un reto marcado como demostración SHALL empezar, cuando el zorro se acerca, con Lalo volando al cartel, encendiendo sus puntos uno a uno y señalando el bloque correcto hasta que el niño lo golpee. Ese reto SHALL NOT contar para las estrellas.

#### Scenario: Primer reto del río
- **WHEN** el niño se acerca al primer reto del nivel 1 del río
- **THEN** Lalo cuenta el cartel y señala el bloque correcto, y al golpearlo se abre la compuerta

### Requirement: Registro de «a la primera»
Cada reto resuelto SHALL quedar registrado como acertado a la primera solo si el primer bloque que golpeó el niño en ese reto era el correcto. Los retos de demostración SHALL NOT registrarse.

#### Scenario: Acierto tras un fallo
- **WHEN** el niño falla una vez y luego acierta
- **THEN** el reto cuenta como resuelto pero no como acertado a la primera

### Requirement: El puente de los números
Un reto de tipo puente SHALL mostrar un puente de 5 tramos sobre el agua, cada tramo con su número (o sus puntos), al que le falta uno, y tres bloques con números sobre los tramos firmes antes del hueco. Golpear el bloque con el número del hueco SHALL hacer volar la tabla a su sitio, sonar una escala y dejar el puente cruzable.

#### Scenario: Acertar el siguiente
- **WHEN** el puente muestra 3, 4 y 5 y el hueco va después del 5, y el niño golpea el bloque del 6
- **THEN** la tabla del 6 vuela al hueco, suena una escala que sube y el zorro puede cruzar

#### Scenario: En el móvil
- **WHEN** el niño está en el último tramo firme antes del hueco en un móvil horizontal de 844×390
- **THEN** ve los tres bloques, el hueco y los tramos de los dos lados sin que los tapen los controles

### Requirement: Puente según la edad
Los números del puente SHALL adaptarse a la franja de edad: de 3 a 4 años, del 1 al 5 con puntos y solo los tramos anteriores al hueco (el siguiente); de 5 a 6 años, del 1 al 10, mostrando solo los anteriores (el siguiente) o solo los posteriores (el anterior); de 7 a 8 años, una serie de 2 en 2 entre 0 y 20 con todos los tramos a la vista y el hueco en cualquier sitio con al menos dos tramos firmes antes.

#### Scenario: Perfil de 8 años
- **WHEN** un perfil de 8 años llega a un puente
- **THEN** los tramos van de 2 en 2 y la respuesta está entre 0 y 20

### Requirement: Escalera de fallos del puente
Un fallo en el puente SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que el hueco parpadee; el segundo, que los tramos se enciendan de uno en uno desde el primero, con un saltito y un «tic», hasta llegar al hueco; el tercero, que Lalo señale el bloque correcto y la tabla se coloque sola.

#### Scenario: Segundo fallo
- **WHEN** el niño falla por segunda vez en un puente
- **THEN** los tramos se encienden uno a uno desde el primero hasta el hueco, cada uno con un saltito

### Requirement: El hueco del puente no se salta
El hueco SHALL ser más ancho que lo que alcanza un salto normal, también saltando desde encima de un bloque del reto, y SHALL cerrarse para siempre al colocar la tabla.

#### Scenario: Saltar el hueco
- **WHEN** el niño corre y salta hacia el hueco sin haber resuelto el reto
- **THEN** cae al agua y rebota fuera por el lado por el que entró

### Requirement: La barca de diez
Un reto de tipo barca SHALL mostrar una barca en la orilla de un lago con sus asientos en forma de marco y algunos patitos sentados, y tres bloques con puntos en el muelle. Golpear el bloque con los patitos que faltan SHALL hacer subir los patitos de uno en uno contándose y sonar la bocina. Con la barca llena, cuando el zorro se sube, la barca SHALL cruzar el lago y dejarlo en la otra orilla.

#### Scenario: Completar la barca de 10
- **WHEN** la barca de 10 lleva 7 patitos y el niño golpea el bloque de 3 puntos
- **THEN** suben 3 patitos de uno en uno, suena la bocina y, al subirse Rufo, la barca lo lleva a la otra orilla

#### Scenario: En el móvil
- **WHEN** el niño está en el muelle en un móvil horizontal de 844×390
- **THEN** ve los tres bloques y los asientos de la barca sin que los tapen los controles

### Requirement: Barca según la edad
La capacidad SHALL adaptarse a la franja de edad: barca de 5 de 3 a 4 años, de 10 de 5 a 6 años y doble (20) de 7 a 8 años. Siempre SHALL haber al menos un patito sentado y al menos un asiento libre.

#### Scenario: Perfil de 4 años
- **WHEN** un perfil de 4 años llega a una barca
- **THEN** la barca tiene 5 asientos y los bloques muestran de 1 a 4 puntos

### Requirement: Escalera de fallos de la barca
Un fallo en la barca SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que sus patitos suban, no quepan o no basten, y vuelvan al muelle; el segundo, que los asientos vacíos parpadeen de uno en uno; el tercero, que Lalo señale el bloque correcto y la barca se llene.

#### Scenario: Primer fallo con demasiados
- **WHEN** a la barca le faltan 3 y el niño golpea el bloque de 5
- **THEN** suben patitos hasta llenar los asientos, los que sobran se quedan sin sitio y todos vuelven al muelle

### Requirement: El lago no se salta
El agua libre del lago SHALL ser más ancha que lo que alcanza un salto normal desde la orilla, desde un bloque del reto o desde la barca.

#### Scenario: Saltar desde la barca
- **WHEN** el niño salta desde la barca sin haberla llenado
- **THEN** cae al agua y rebota hacia la barca

### Requirement: El camino de huellas
Un reto de tipo camino de huellas SHALL mostrar un puente en ruinas de 5 losas sobre un río de lava, con una tablilla grabada sobre cada losa que sigue una serie de formas, al que le falta una losa, y tres bloques de piedra con formas sobre las losas firmes antes del hueco. Golpear el bloque con la forma que sigue SHALL hacer subir la losa de la lava hasta encajar con un golpe de piedra, encender los grabados uno tras otro con su nota y dejar el puente cruzable.

#### Scenario: Acertar la forma que sigue
- **WHEN** las tablillas muestran triángulo, cuadrado, triángulo, cuadrado y el hueco va después, y el niño golpea el bloque del triángulo
- **THEN** la losa sube y encaja con un golpe de piedra, los grabados se encienden de uno en uno con su nota y el zorro puede cruzar

#### Scenario: En el móvil
- **WHEN** el niño está en la última losa firme antes del hueco en un móvil horizontal de 844×390
- **THEN** ve los tres bloques, el hueco y las tablillas de la serie sin que los tapen los controles

### Requirement: Series según la edad
La serie del camino de huellas SHALL adaptarse a la franja de edad: de 3 a 4 años, AB con la misma forma en dos colores; de 5 a 6 años, AB, ABB o AAB con formas de un solo color; de 7 a 8 años, ABC con tres formas o una serie que crece (una forma más en cada losa). Delante del hueco SHALL verse siempre al menos una vuelta entera de la serie.

#### Scenario: Perfil de 4 años
- **WHEN** un perfil de 4 años llega a un camino de huellas
- **THEN** las losas alternan dos colores de círculo y los bloques ofrecen círculos de tres colores

#### Scenario: Perfil de 8 años con una serie que crece
- **WHEN** a un perfil de 8 años le toca una serie que crece
- **THEN** las tablillas llevan 1, 2, 3… formas iguales y los bloques ofrecen la cantidad que sigue y otras cercanas

### Requirement: Escalera de fallos del camino de huellas
Un fallo en el camino de huellas SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que el hueco parpadee; el segundo, que las tablillas se enciendan de una en una desde la primera, cada una con la nota de su forma, y que en el hueco suene el silencio; el tercero, que Lalo señale el bloque correcto y la losa suba sola.

#### Scenario: Segundo fallo
- **WHEN** el niño falla por segunda vez en un camino de huellas
- **THEN** la serie suena tablilla a tablilla y la misma forma suena siempre con la misma nota

### Requirement: El hueco de lava no se salta ni cuesta galletas
El hueco del camino de huellas SHALL ser más ancho que lo que alcanza un salto normal, también desde encima de un bloque del reto. Caer en él SHALL hacer rebotar al zorro fuera por el lado por el que entró sin quitar galletas, y SHALL cerrarse para siempre al encajar la losa.

#### Scenario: Saltar el hueco
- **WHEN** el niño salta hacia el hueco sin haber resuelto el reto
- **THEN** cae a la lava, rebota fuera por donde entró y conserva sus galletas

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
