# Spec Delta

## MODIFIED Requirements

### Requirement: HUD del nivel
El nivel SHALL mostrar arriba un botón de casa a la izquierda que vuelve al mapa, una barra de progreso
en el centro con la cara del zorro avanzando hacia una bandera, y a la derecha el contador de galletas
del nivel con el icono de la galleta y un número.

#### Scenario: Progreso
- **WHEN** el zorro está a mitad del recorrido
- **THEN** la cara del zorro está en la mitad de la barra de progreso

#### Scenario: Salir al mapa
- **WHEN** el niño toca el botón de casa
- **THEN** se abre el mapa sin contar el nivel como completado

#### Scenario: Contador de galletas
- **WHEN** se abre un nivel en un móvil horizontal
- **THEN** arriba a la derecha se ve una galleta con pepitas de chocolate junto al número 0, sin ninguna palabra

## ADDED Requirements

### Requirement: Bloques «?» que dan galletas
Un bloque «?» SHALL activarse al golpearlo desde abajo, cambiar a su aspecto usado, soltar una
galleta con pepitas de chocolate y sumar uno al contador, y SHALL NOT activarse una segunda vez.

#### Scenario: Golpe desde abajo
- **WHEN** el niño salta y golpea un bloque «?» con la cabeza
- **THEN** el bloque rebota, aparece una galleta con pepitas de chocolate que sube y se desvanece, y el contador sube en uno

#### Scenario: Golpe desde arriba o de lado
- **WHEN** el niño toca el bloque por arriba o por un lado
- **THEN** el bloque no se activa

#### Scenario: Bloque ya usado
- **WHEN** el niño golpea otra vez un bloque usado
- **THEN** el contador no cambia

### Requirement: Aspecto de la galleta
La galleta SHALL ser un gráfico propio en el estilo vectorial plano y redondeado del juego: un círculo
de masa dorada tostada con varias pepitas de chocolate oscuro y una sombra inferior sólida, sin
contornos negros, reconocible a simple vista incluso al tamaño más pequeño en que se dibuja.

#### Scenario: Galleta pequeña en el HUD
- **WHEN** se ve el contador de galletas en un móvil de 844×390
- **THEN** la galleta se reconoce como galleta con pepitas de chocolate y no se confunde con una moneda

#### Scenario: Licencia del gráfico
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** el gráfico de la galleta aparece como propio del proyecto y ya no figura ningún gráfico de moneda

## REMOVED Requirements

### Requirement: Bloques «?» que dan monedas
**Reason**: El premio deja de ser una moneda y pasa a ser una galleta con pepitas de chocolate.
**Migration**: Sustituido por «Bloques «?» que dan galletas», con el mismo comportamiento.
