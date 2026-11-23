# Spec Delta

## MODIFIED Requirements

### Requirement: Bloques «?» que dan galletas
Un bloque «?» SHALL activarse al golpearlo desde abajo, esté sobre el suelo, un escalón o una
plataforma, cambiar a su aspecto usado, soltar una galleta con pepitas de chocolate y sumar uno al
contador, y SHALL NOT activarse una segunda vez. El bloque que esconde la fruta del nivel SHALL
soltar además la fruta.

#### Scenario: Golpe desde abajo
- **WHEN** el niño salta y golpea un bloque «?» con la cabeza
- **THEN** el bloque rebota, aparece una galleta con pepitas de chocolate que sube y se desvanece, y el contador sube en uno

#### Scenario: Golpe desde una plataforma o un escalón
- **WHEN** el niño salta desde una plataforma o un escalón y golpea con la cabeza el bloque «?» que tiene encima
- **THEN** el bloque se activa igual que desde el suelo

#### Scenario: Golpe desde arriba o de lado
- **WHEN** el niño toca el bloque por arriba o por un lado
- **THEN** el bloque no se activa

#### Scenario: Bloque ya usado
- **WHEN** el niño golpea otra vez un bloque usado
- **THEN** el contador no cambia y no sale ninguna fruta

#### Scenario: Bloque con fruta
- **WHEN** el niño golpea desde abajo el bloque que esconde la fruta
- **THEN** sale la galleta, el contador sube en uno y además sale la fruta

### Requirement: Sin fallo que penalice
El nivel SHALL NOT tener vidas, estado de derrota, hoyos ni caídas fuera del recorrido: el suelo SHALL
ser continuo de la salida a la bandera.

#### Scenario: Recorrido completo
- **WHEN** el niño recorre el nivel sin llegar a la meta durante varios minutos
- **THEN** el juego no muestra pantalla de fin y solo los pinchazos con enemigos restan galletas

#### Scenario: Caer de una plataforma
- **WHEN** el zorro cae desde la plataforma más alta del nivel
- **THEN** aterriza en el suelo o en un escalón y puede seguir jugando sin ninguna penalización
