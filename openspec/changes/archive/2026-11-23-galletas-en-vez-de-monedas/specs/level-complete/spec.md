# Spec Delta

## MODIFIED Requirements

### Requirement: Tres caminos tras la celebración
La pantalla SHALL ofrecer tres botones sin texto: mapa (icono de mapa), siguiente nivel (flecha, el más
grande y en coral) y repetir (flecha circular). En el último nivel del mundo el botón de siguiente SHALL
llevar al mapa.

#### Scenario: Siguiente nivel
- **WHEN** el niño completa el nivel 2 y toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Repetir
- **WHEN** el niño toca la flecha circular
- **THEN** el mismo nivel empieza de nuevo con el contador de galletas del nivel a cero

#### Scenario: Volver al mapa
- **WHEN** el niño toca el icono de mapa
- **THEN** se abre el mapa con el nivel recién completado en estado hecho

## ADDED Requirements

### Requirement: Galletas ganadas
La tarjeta SHALL mostrar las galletas recogidas en el nivel con el icono de la galleta con pepitas de
chocolate y un número, y esas galletas SHALL sumarse al total del niño.

#### Scenario: Suma de galletas
- **WHEN** el niño tenía 5 galletas y termina un nivel recogiendo 4
- **THEN** la tarjeta muestra 4 galletas y el mapa muestra 9

#### Scenario: Nivel sin galletas
- **WHEN** el niño termina un nivel sin golpear ningún bloque «?»
- **THEN** la tarjeta muestra la galleta con el número 0 y su total no cambia

## REMOVED Requirements

### Requirement: Monedas ganadas
**Reason**: El premio deja de ser una moneda y pasa a ser una galleta con pepitas de chocolate.
**Migration**: Sustituido por «Galletas ganadas», con el mismo comportamiento.
