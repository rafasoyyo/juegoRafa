## ADDED Requirements

### Requirement: Castillo en el mapa del arcoíris
El mapa del mundo 1 SHALL mostrar el castillo como parada tras el nivel 12, sobre una nube al pie del arcoíris, dentro de la segunda pantalla y sin que el selector lo tape.

#### Scenario: Castillo al pie del arcoíris
- **WHEN** se abre el mapa del mundo 1 a 844×390 y se desplaza hasta el final
- **THEN** el castillo queda a la derecha del nivel 12, sobre una nube, unido a él por el camino

### Requirement: Medalla en el botón 123
Con la medalla del arcoíris ganada, el botón 123 del selector SHALL mostrarla en su esquina.

#### Scenario: Medalla del arcoíris en el selector
- **WHEN** el niño ha ganado la medalla del arcoíris y abre cualquier mapa
- **THEN** el botón 123 muestra la medalla en su esquina
