# Spec Delta

## ADDED Requirements

### Requirement: Aspecto de los botones de control
El nivel SHALL mostrar abajo a la izquierda dos botones circulares blancos de al menos 120 px lógicos con
una flecha (izquierda y derecha) y abajo a la derecha un botón circular coral de al menos 160 px lógicos
con una flecha hacia arriba para saltar, todos con sombra inferior.

#### Scenario: Botones en un móvil alargado
- **WHEN** se abre un nivel en un móvil de 844×390
- **THEN** los botones de mover quedan pegados abajo a la izquierda y el de saltar abajo a la derecha, sin tapar al zorro al empezar

### Requirement: Respuesta visual al pulsar
Mientras un control está activo, por toque o por teclado, su botón SHALL verse hundido (desplazado hacia
abajo con la sombra reducida) y SHALL volver a su posición al soltarlo.

#### Scenario: Mantener saltar
- **WHEN** el niño mantiene el dedo en la zona de saltar
- **THEN** el botón de saltar se ve hundido hasta que levanta el dedo
