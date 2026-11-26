## ADDED Requirements

### Requirement: Barcas en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo barca con la posición del lago. La validación SHALL comprobar que el muelle y el lago, con un margen, quedan sobre suelo llano y libre, entre la salida y la bandera, como el resto de retos.

#### Scenario: Barca sobre un escalón
- **WHEN** un archivo de nivel pone una barca donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
