## ADDED Requirements

### Requirement: Nota de cada banda del arcoíris
Al pintarse cada una de las 6 bandas de un gajo del arcoíris del mapa SHALL sonar una nota corta de campana, cada banda más aguda que la anterior, de modo que el gajo completo suene como una escala de 6 notas que sube, respetando el silencio.

#### Scenario: Gajo nuevo con sonido
- **WHEN** se pinta un gajo nuevo en el mapa con el sonido activado
- **THEN** suenan 6 notas que suben, una con cada banda

#### Scenario: Gajo nuevo en silencio
- **WHEN** se pinta un gajo nuevo con el juego silenciado
- **THEN** el gajo se pinta igual y no suena nada
