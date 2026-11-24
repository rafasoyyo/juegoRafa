# Spec Delta

## MODIFIED Requirements

### Requirement: La fruta sale del bloque
Golpear desde abajo el bloque con fruta SHALL activarlo como cualquier bloque «?», con su galleta y su
suma al contador. Además, SHALL soltar una fresa que salta hacia arriba, cae al suelo, al escalón o a
la plataforma que hay junto al bloque y se queda quieta allí, dando botecitos, hasta que Rufo la coja.
La fresa SHALL NOT posarse nunca sobre una zona de pinchos.

#### Scenario: Golpear el bloque con fruta
- **WHEN** el niño golpea desde abajo el bloque que esconde la fresa
- **THEN** sale la galleta, el contador sube en uno, y la fresa salta y se posa junto al bloque

#### Scenario: Fruta al alcance
- **WHEN** la fresa se ha posado
- **THEN** está en un sitio al que Rufo llega andando o con un salto normal

#### Scenario: Dejarla para luego
- **WHEN** el niño golpea el bloque con fruta y sigue sin coger la fresa
- **THEN** la fresa sigue en su sitio hasta que vuelva a por ella o termine el nivel

#### Scenario: Nunca sobre pinchos
- **WHEN** el niño golpea el bloque con fruta en un nivel con pinchos, mirando hacia cualquier lado
- **THEN** la fresa se posa fuera de las zonas de pinchos y Rufo puede cogerla sin pincharse

## ADDED Requirements

### Requirement: Los pinchos no pinchan a Rufo invencible
Mientras dura el modo invencible, pisar o caer en una zona de pinchos SHALL NOT hacer rebotar a Rufo ni restarle galletas: Rufo SHALL correr por encima como si fuera suelo. Si el modo termina con Rufo sobre los pinchos, Rufo SHALL NOT pincharse hasta pasado 1 segundo, con el parpadeo protector de un pinchazo.

#### Scenario: Correr sobre pinchos
- **WHEN** Rufo invencible corre por una zona de pinchos sin saltar
- **THEN** la cruza sin rebotar ni frenar y el contador no baja

#### Scenario: Termina sobre los pinchos
- **WHEN** el modo invencible termina mientras Rufo está sobre una zona de pinchos
- **THEN** Rufo parpadea 1 segundo sin pincharse y, si sigue sobre los pinchos al acabar ese segundo, se pincha y rebota fuera de la zona
