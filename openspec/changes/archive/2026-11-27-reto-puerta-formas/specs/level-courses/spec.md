## ADDED Requirements

### Requirement: Puertas de la cueva en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo puerta de la cueva (`door`) con su posición. Ocupan lo mismo que unos bloques que cuentan y 2,5 baldosas más tras la losa, donde espera el triceratops, y la validación SHALL comprobar que ese tramo es suelo llano y libre entre la salida y la bandera.

#### Scenario: Puerta junto a un foso
- **WHEN** un archivo de nivel pone una puerta cuyo tramo pisa un foso
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
