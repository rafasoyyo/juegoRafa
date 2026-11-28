## ADDED Requirements

### Requirement: Paseos en braquiosaurio en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo paseo en braquiosaurio (`brachio`) con el borde izquierdo del río. Ocupan lo mismo que una barca (orilla, río y margen), y la validación SHALL comprobar que ese tramo es suelo llano y libre entre la salida y la bandera.

#### Scenario: Braquiosaurio con un escalón en la orilla
- **WHEN** un archivo de nivel pone un escalón en la orilla de un paseo en braquiosaurio
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
