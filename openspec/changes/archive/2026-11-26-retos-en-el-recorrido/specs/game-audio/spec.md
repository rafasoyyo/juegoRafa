## ADDED Requirements

### Requirement: Sonidos de los retos
Acertar un reto SHALL sonar con el bloque y una compuerta que se abre (notas que suben). Un fallo SHALL sonar con el efecto suave de error, sin nada que asuste. Al contar en la pista, cada punto que se enciende SHALL sonar con un «tic» un poco más agudo que el anterior. Todos respetan el silencio.

#### Scenario: Pista contando
- **WHEN** tras el segundo fallo se encienden 4 puntos del cartel
- **THEN** suenan 4 tics, cada uno más agudo que el anterior
