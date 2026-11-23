# Spec Delta

## MODIFIED Requirements

### Requirement: Arte propio o libre
El juego SHALL NOT usar personajes, sprites, logos, nombres ni música de terceros con copyright. El
personaje jugable SHALL ser el zorro original del juego.

#### Scenario: Revisión de assets
- **WHEN** se revisan los activos del repositorio
- **THEN** cada uno es propio, generado por código o de licencia libre con la licencia anotada

#### Scenario: Personaje en el nivel
- **WHEN** se abre un nivel
- **THEN** el personaje que se mueve es el zorro naranja con el gorro elegido

### Requirement: Meta del nivel
Al alcanzar la bandera final el juego SHALL detener al zorro, hacerle celebrar en el sitio y abrir la
pantalla de nivel completado antes de 2 segundos.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera
- **THEN** el zorro se detiene y celebra, y antes de 2 s se abre la pantalla de nivel completado

## ADDED Requirements

### Requirement: Escenario del nivel
El nivel SHALL dibujar un cielo en degradado, nubes y colinas redondeadas que se desplazan más despacio
que el suelo (paralaje), un suelo de hierba sobre tierra, bloques «?» amarillos redondeados con sombra
inferior y una bandera coral al final.

#### Scenario: Avanzar por el nivel
- **WHEN** el zorro avanza hacia la derecha
- **THEN** el suelo y los bloques se desplazan a la velocidad de la cámara y las nubes y colinas más despacio

### Requirement: Animaciones del zorro
El zorro SHALL mirar hacia donde se mueve, balancearse al andar, estirarse al saltar, aplastarse un
instante al aterrizar y quedarse quieto respirando cuando no se mueve.

#### Scenario: Aterrizar
- **WHEN** el zorro cae al suelo tras un salto
- **THEN** se aplasta brevemente y recupera su forma

### Requirement: HUD del nivel
El nivel SHALL mostrar arriba un botón de casa a la izquierda que vuelve al mapa, una barra de progreso
en el centro con la cara del zorro avanzando hacia una bandera, y a la derecha el contador de monedas
del nivel con icono y número.

#### Scenario: Progreso
- **WHEN** el zorro está a mitad del recorrido
- **THEN** la cara del zorro está en la mitad de la barra de progreso

#### Scenario: Salir al mapa
- **WHEN** el niño toca el botón de casa
- **THEN** se abre el mapa sin contar el nivel como completado

## REMOVED Requirements

### Requirement: Presentación pixel art a baja resolución
**Reason**: El juego adopta el estilo vectorial plano y redondeado del diseño.
**Migration**: La presentación y el escalado pasan a la capacidad `visual-style` (720 px lógicos de
alto, ancho adaptable, sin bandas).
