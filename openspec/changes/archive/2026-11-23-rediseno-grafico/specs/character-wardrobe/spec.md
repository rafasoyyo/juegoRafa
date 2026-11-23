# Spec Delta

## Purpose

Dejar que el niño personalice su zorro con gorros que consigue con las monedas del juego, para que
sienta suyo el personaje y tenga un motivo para seguir jugando.

## ADDED Requirements

### Requirement: Escaparate del zorro
La pantalla de mi personaje SHALL mostrar a la izquierda el zorro grande sobre el paisaje del juego,
con el gorro puesto, y arriba a la derecha el contador de monedas.

#### Scenario: Abrir mi personaje
- **WHEN** el niño abre mi personaje desde el mapa
- **THEN** ve su zorro grande con el gorro actual y sus monedas

### Requirement: Categorías de complementos
La pantalla SHALL mostrar cuatro categorías con icono (gorros, gafas, capas y colores). Solo la de
gorros SHALL estar disponible; las demás SHALL verse atenuadas y temblar al tocarlas.

#### Scenario: Categoría no disponible
- **WHEN** el niño toca la categoría de gafas
- **THEN** el botón tiembla y sigue viéndose la rejilla de gorros

### Requirement: Rejilla de gorros
La rejilla SHALL mostrar 6 casillas: gorra azul, gorro de lana, gorro de fiesta, casco de explorador,
corona y «sin gorro». El gorro puesto SHALL llevar borde verde y una marca de verificación.

#### Scenario: Gorro puesto
- **WHEN** el zorro lleva la gorra azul
- **THEN** la casilla de la gorra azul tiene borde verde y la marca de verificación

### Requirement: Comprar gorros con monedas
Los gorros no conseguidos SHALL mostrarse atenuados con su precio (icono de moneda y número). Tocar uno
con monedas suficientes SHALL restar el precio, desbloquearlo y ponérselo al zorro; sin monedas
suficientes SHALL NOT cambiar nada y la casilla SHALL temblar.

#### Scenario: Compra con monedas suficientes
- **WHEN** el niño tiene 12 monedas y toca un gorro que cuesta 10
- **THEN** le quedan 2 monedas, el gorro queda desbloqueado y el zorro lo lleva puesto

#### Scenario: Monedas insuficientes
- **WHEN** el niño tiene 3 monedas y toca un gorro que cuesta 10
- **THEN** la casilla tiembla y las monedas siguen siendo 3

### Requirement: Cambiar de gorro
Tocar un gorro ya conseguido o «sin gorro» SHALL ponérselo al zorro al instante sin coste. Al empezar,
la gorra azul y «sin gorro» SHALL estar conseguidos y la gorra azul puesta.

#### Scenario: Quitarse el gorro
- **WHEN** el niño toca «sin gorro»
- **THEN** el zorro del escaparate aparece sin gorro

### Requirement: El gorro se ve en todo el juego
El gorro elegido SHALL verse en el zorro del nivel, del mapa y de la pantalla de nivel completado. El
botón de listo (coral, con marca de verificación) SHALL volver al mapa.

#### Scenario: Volver y jugar
- **WHEN** el niño elige el gorro de fiesta, toca listo y abre un nivel
- **THEN** el zorro del mapa y el del nivel llevan el gorro de fiesta
