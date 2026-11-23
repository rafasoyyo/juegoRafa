# Spec Delta

## MODIFIED Requirements

### Requirement: Escaparate del zorro
La pantalla de mi personaje SHALL mostrar a la izquierda el zorro grande sobre el paisaje del juego,
con el gorro puesto, y arriba a la derecha el contador de galletas.

#### Scenario: Abrir mi personaje
- **WHEN** el niño abre mi personaje desde el mapa
- **THEN** ve su zorro grande con el gorro actual y sus galletas

## ADDED Requirements

### Requirement: Comprar gorros con galletas
Los gorros no conseguidos SHALL mostrarse atenuados con su precio (icono de la galleta y número). Tocar
uno con galletas suficientes SHALL restar el precio, desbloquearlo y ponérselo al zorro; sin galletas
suficientes SHALL NOT cambiar nada y la casilla SHALL temblar.

#### Scenario: Compra con galletas suficientes
- **WHEN** el niño tiene 12 galletas y toca un gorro que cuesta 10
- **THEN** le quedan 2 galletas, el gorro queda desbloqueado y el zorro lo lleva puesto

#### Scenario: Galletas insuficientes
- **WHEN** el niño tiene 3 galletas y toca un gorro que cuesta 10
- **THEN** la casilla tiembla y las galletas siguen siendo 3

## REMOVED Requirements

### Requirement: Comprar gorros con monedas
**Reason**: El premio deja de ser una moneda y pasa a ser una galleta con pepitas de chocolate.
**Migration**: Sustituido por «Comprar gorros con galletas», con el mismo comportamiento.
