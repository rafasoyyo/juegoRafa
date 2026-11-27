## ADDED Requirements

### Requirement: La madriguera repite el prólogo
En el mapa del mundo de los números, tocar la madriguera SHALL abrir el nivel 1 empezando por el prólogo, aunque ya se haya visto. Arrastrar el mapa empezando sobre la madriguera SHALL NOT abrir nada.

#### Scenario: Volver a verlo
- **WHEN** el niño toca la madriguera del mapa
- **THEN** se abre el nivel 1 con el prólogo

#### Scenario: Arrastrar
- **WHEN** el niño apoya el dedo en la madriguera y arrastra el mapa
- **THEN** el mapa se desplaza y no se abre el nivel
