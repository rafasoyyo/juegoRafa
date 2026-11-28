## ADDED Requirements

### Requirement: Nodo del castillo
Si el mundo tiene castillo, el mapa SHALL mostrarlo como parada propia tras el último nivel, unida a él por el camino. El castillo SHALL estar cerrado (con candado, y tiembla al tocarlo) hasta que el último nivel esté hecho o pendiente; abierto, SHALL abrirse al tocarlo y se SHALL poder repetir. Con la medalla ganada, SHALL verse verde y con la medalla al lado. Cuando no quede ningún nivel por jugar, el zorro SHALL esperar en el castillo.

#### Scenario: Castillo cerrado
- **WHEN** el último nivel del río no se ha jugado y el niño toca el castillo
- **THEN** el castillo tiembla y no se abre

#### Scenario: Castillo abierto
- **WHEN** el último nivel del río está hecho y el niño toca el castillo
- **THEN** empieza el recorrido del castillo

#### Scenario: Castillo terminado
- **WHEN** el niño ha ganado la medalla del río y vuelve al mapa
- **THEN** el castillo se ve verde con la medalla al lado y se puede volver a jugar

### Requirement: Medalla en el selector
El botón de un mundo en el selector SHALL mostrar su medalla en una esquina cuando se ha ganado, sin tapar el icono del mundo.

#### Scenario: Medalla del río
- **WHEN** el niño ha ganado la medalla del río y abre cualquier mapa
- **THEN** el botón del río muestra la medalla en su esquina
