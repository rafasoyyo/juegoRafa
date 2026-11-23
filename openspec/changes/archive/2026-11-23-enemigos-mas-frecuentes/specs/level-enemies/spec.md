## MODIFIED Requirements

### Requirement: Cantidad de enemigos por nivel
El número de enemigos SHALL crecer con el número del nivel: 2 en el nivel 1, 3 en el nivel 2, 4 en el nivel 3, 5 en el nivel 4, 6 en el nivel 5 y 7 en el nivel 6. En el nivel 1 SHALL salir solo el erizo; la abeja SHALL poder salir a partir del nivel 2.

#### Scenario: Primer nivel
- **WHEN** se abre el nivel 1
- **THEN** hay exactamente dos enemigos y ambos son erizos

#### Scenario: Último nivel
- **WHEN** se abre el nivel 6
- **THEN** hay exactamente siete enemigos, que pueden ser erizos, abejas o una mezcla

#### Scenario: Caben todos
- **WHEN** se abre cualquiera de los niveles 1 a 6
- **THEN** salen todos los enemigos de su nivel, cada uno en un tramo distinto de suelo llano y respetando las zonas seguras
