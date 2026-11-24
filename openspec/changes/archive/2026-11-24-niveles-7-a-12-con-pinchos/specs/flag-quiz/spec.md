# Spec Delta

## MODIFIED Requirements

### Requirement: Un tipo de prueba por nivel
Cada nivel del mundo de los números SHALL tener siempre el mismo tipo de prueba: nivel 1, «¿Cuántos hay?»; nivel 2, «¿Dónde hay más?»; nivel 3, «Sigue la serie»; nivel 4, «Caza de formas»; nivel 5, «Las letras de tu nombre»; nivel 6, «¿Te acuerdas?». Los niveles 7 a 12 SHALL repetir esos tipos en el mismo orden: el 7 como el 1, el 8 como el 2 y así hasta el 12 como el 6.

#### Scenario: Nivel 3
- **WHEN** el niño llega a la bandera del nivel 3
- **THEN** la prueba es «Sigue la serie»

#### Scenario: Repetir un nivel
- **WHEN** el niño repite el nivel 5 y llega a la bandera
- **THEN** la prueba vuelve a ser «Las letras de tu nombre»

#### Scenario: Niveles nuevos
- **WHEN** el niño llega a la bandera del nivel 7 y, más tarde, a la del nivel 12
- **THEN** la prueba del 7 es «¿Cuántos hay?» y la del 12 es «¿Te acuerdas?», con lo que pasó en el nivel 12
