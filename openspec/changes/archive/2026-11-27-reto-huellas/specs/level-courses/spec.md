## ADDED Requirements

### Requirement: Caminos de huellas en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo camino de huellas (`footprints`) con su posición. Ocupan lo mismo que un puente y la validación SHALL comprobar lo mismo: todo el puente, con un margen a cada lado, sobre suelo llano y libre, entre la salida y la bandera.

#### Scenario: Camino de huellas sobre un escalón
- **WHEN** un archivo de nivel pone un camino de huellas donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
