## ADDED Requirements

### Requirement: Piedras del géiser en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo piedras del géiser (`geyser`) con el borde izquierdo del lago. Ocupan desde 4 baldosas antes del lago (el tótem) hasta 2,5 después (el géiser), y la validación SHALL comprobar que ese tramo es suelo llano y libre. La geometría SHALL garantizar que saltar de una piedra buena a la siguiente por encima de una hundida cabe en un salto.

#### Scenario: Géiser junto a un foso
- **WHEN** un archivo de nivel pone un foso en el sitio del tótem
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
