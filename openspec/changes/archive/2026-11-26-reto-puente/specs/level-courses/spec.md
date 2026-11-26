## ADDED Requirements

### Requirement: Puentes en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo puente con su posición. La validación SHALL comprobar que todo el puente, con un margen a cada lado, queda sobre suelo llano y libre, entre la salida y la bandera, como el resto de retos, de modo que los bloques del reto siempre estén sobre tramos firmes.

#### Scenario: Puente sobre una plataforma
- **WHEN** un archivo de nivel pone un puente donde hay una plataforma
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
