# Spec Delta

## MODIFIED Requirements

### Requirement: No se tocan
Cualquier contacto del zorro con un enemigo, también cayéndole encima, SHALL ser un pinchazo: el
zorro da un brinco hacia arriba y hacia el lado contrario al enemigo, más alto que un rebote corto,
como si se hubiera pinchado, y luego parpadea 1 segundo, durante el cual no SHALL volver a chocar. El
enemigo SHALL hacer un gesto breve y seguir moviéndose; ningún enemigo SHALL desaparecer ni ser
derrotado. Mientras el zorro está en modo invencible no hay pinchazo.

#### Scenario: Chocar de lado
- **WHEN** el zorro corre contra un erizo que viene de frente
- **THEN** el zorro brinca hacia arriba y hacia atrás como si se hubiera pinchado, parpadea y el erizo eriza los pinchos y sigue andando

#### Scenario: Caer encima
- **WHEN** el zorro cae desde un salto sobre un erizo o una abeja
- **THEN** el zorro brinca hacia el lado contrario al enemigo y el enemigo sigue en el nivel

#### Scenario: Parpadeo protector
- **WHEN** el zorro, aún parpadeando, vuelve a tocar un enemigo
- **THEN** no hay un segundo pinchazo ni pierde otra galleta

#### Scenario: Recuperar el control
- **WHEN** termina el brinco del pinchazo
- **THEN** el niño puede volver a moverse y saltar antes de medio segundo desde el choque

#### Scenario: Brinco dentro del nivel
- **WHEN** el zorro se pincha junto a la salida, junto a un escalón o bajo una plataforma
- **THEN** cae sobre el suelo, el escalón o la plataforma, sin salir del recorrido ni quedarse atascado

## ADDED Requirements

### Requirement: El pinchazo resta una galleta
Cada pinchazo SHALL restar una galleta del contador del nivel: una galleta sale despedida de Rufo y
se desvanece, y el contador baja en uno con un pequeño bote. El contador SHALL NOT bajar de 0: con 0
galletas el pinchazo ocurre igual pero no se resta nada. Las galletas perdidas SHALL NOT recuperarse.

#### Scenario: Pincharse con galletas
- **WHEN** el contador del nivel marca 3 y Rufo se pincha con un erizo
- **THEN** sale una galleta despedida de Rufo y el contador pasa a 2

#### Scenario: Pincharse sin galletas
- **WHEN** el contador del nivel marca 0 y Rufo se pincha con una abeja
- **THEN** Rufo brinca, no sale ninguna galleta y el contador sigue en 0

#### Scenario: Suma al terminar
- **WHEN** el niño golpea 5 bloques, se pincha 2 veces y llega a la bandera
- **THEN** la tarjeta de nivel completado muestra 3 galletas y al total del niño se le suman 3

### Requirement: El pinchazo no penaliza más
Un pinchazo SHALL NOT cambiar las estrellas, reiniciar el nivel, mover al zorro a otro punto, quitar
galletas del total ya guardado ni mostrar ninguna pantalla o mensaje.

#### Scenario: Muchos pinchazos
- **WHEN** el niño se pincha diez veces y luego golpea todos los bloques y llega a la bandera
- **THEN** las estrellas son las mismas que sin haberse pinchado

#### Scenario: Total guardado intacto
- **WHEN** el niño tenía 20 galletas en total, entra en un nivel y se pincha sin haber ganado ninguna
- **THEN** al terminar el nivel su total sigue siendo 20

## REMOVED Requirements

### Requirement: Chocar no penaliza
**Reason**: Chocar con un enemigo pasa a restar una galleta del contador del nivel.
**Migration**: Lo sustituyen «El pinchazo resta una galleta» y «El pinchazo no penaliza más», que
mantienen sin cambios las estrellas, el nivel y el total ya guardado.
