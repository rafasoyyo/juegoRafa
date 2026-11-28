## ADDED Requirements

### Requirement: Sonidos de piedra de la isla
Al encajar una losa o una pieza de piedra SHALL sonar un golpe seco y grave, sin rebote. Cada grabado que se enciende SHALL sonar con una nota de campana propia de su forma dentro de la serie, de modo que una serie suene como una melodía que se repite. Los dos SHALL respetar el silencio.

#### Scenario: Serie que suena
- **WHEN** se encienden las tablillas triángulo, cuadrado, triángulo, cuadrado
- **THEN** suenan dos notas que se alternan, la misma para cada triángulo y la misma para cada cuadrado
