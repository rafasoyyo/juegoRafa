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
