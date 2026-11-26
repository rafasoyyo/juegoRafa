## ADDED Requirements

### Requirement: Retos en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos del recorrido con su tipo, su posición y sus opciones. La validación SHALL comprobar que cada reto está entre la salida y la bandera, sobre suelo llano y sin escalones, plataformas, bloques «?» ni pinchos en su zona, y que dos retos no se solapan. Los enemigos SHALL NOT colocarse en la zona de un reto.

#### Scenario: Reto sobre un escalón
- **WHEN** un archivo de nivel pone un reto donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

#### Scenario: Nivel sin retos
- **WHEN** un archivo de nivel no declara retos
- **THEN** el nivel se juega como hasta ahora
