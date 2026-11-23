# Spec Delta

## ADDED Requirements

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
