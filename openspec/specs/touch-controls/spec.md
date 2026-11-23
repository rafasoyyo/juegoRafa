# touch-controls Specification

## Purpose
Que un niño de 4 a 6 años pueda mover y saltar con controles táctiles grandes y tolerantes, y que el desarrollo pueda probarse con teclado en escritorio.

## Requirements

### Requirement: Controles táctiles por zonas
El juego SHALL ofrecer tres controles táctiles (izquierda, derecha, saltar) decididos por la posición
del dedo dentro de una zona de pantalla, no por el sprite del botón, y SHALL admitir al menos 4
punteros simultáneos.

#### Scenario: Mover y saltar a la vez
- **WHEN** el niño mantiene pulsado «derecha» con un dedo y pulsa «saltar» con otro
- **THEN** el personaje avanza y salta al mismo tiempo

#### Scenario: Toque desviado
- **WHEN** el dedo cae dentro de la zona del control pero fuera del dibujo del botón
- **THEN** el control se activa igualmente

### Requirement: Teclado para desarrollo
En escritorio el juego SHALL aceptar flechas o A/D para moverse y flecha arriba, W o espacio para saltar.

#### Scenario: Prueba en el ordenador
- **WHEN** se pulsa la flecha derecha y el espacio
- **THEN** el personaje avanza y salta

### Requirement: Salto tolerante
El salto SHALL aceptar una pulsación hasta 120 ms antes de aterrizar y hasta 100 ms después de dejar
el borde de una plataforma, y SHALL ser más corto si se suelta el control durante el ascenso.

#### Scenario: Pulsación anticipada
- **WHEN** se pulsa saltar 100 ms antes de tocar el suelo
- **THEN** el personaje salta al aterrizar

#### Scenario: Borde de plataforma
- **WHEN** se pulsa saltar 80 ms después de caer del borde
- **THEN** el personaje salta igualmente

#### Scenario: Salto corto
- **WHEN** se suelta saltar durante el ascenso
- **THEN** el salto alcanza menos altura que con el control mantenido

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
