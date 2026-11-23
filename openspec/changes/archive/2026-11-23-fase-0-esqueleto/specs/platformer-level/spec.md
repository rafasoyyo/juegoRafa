# Spec Delta

## ADDED Requirements

### Requirement: Presentación pixel art a baja resolución
El juego SHALL renderizar a una resolución lógica de 400×225 con `pixelArt` activo y escalado que
conserve la proporción, en cualquier tamaño de pantalla.

#### Scenario: Pantalla móvil horizontal
- **WHEN** se abre el juego en un móvil de 844×390
- **THEN** el juego ocupa la altura disponible con los píxeles nítidos y bandas laterales

### Requirement: Arte propio o libre
El juego SHALL NOT usar personajes, sprites, logos, nombres ni música de terceros con copyright. El
personaje jugable SHALL ser un niño original.

#### Scenario: Revisión de assets
- **WHEN** se revisan los activos del repositorio
- **THEN** cada uno es propio, generado por código o de licencia libre con la licencia anotada

### Requirement: Bloques «?» que dan monedas
Un bloque «?» SHALL activarse al golpearlo desde abajo, cambiar a su aspecto usado, soltar una
moneda y sumar uno al contador, y SHALL NOT activarse una segunda vez.

#### Scenario: Golpe desde abajo
- **WHEN** el niño salta y golpea un bloque «?» con la cabeza
- **THEN** el bloque rebota, aparece una moneda y el contador sube en uno

#### Scenario: Golpe desde arriba o de lado
- **WHEN** el niño toca el bloque por arriba o por un lado
- **THEN** el bloque no se activa

#### Scenario: Bloque ya usado
- **WHEN** el niño golpea otra vez un bloque usado
- **THEN** el contador no cambia

### Requirement: Meta del nivel
Al alcanzar la bandera final el juego SHALL detener al personaje, mostrar una celebración y reiniciar
el nivel a los 2,5 segundos.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera
- **THEN** aparece la celebración y, tras 2,5 s, el nivel empieza de nuevo con el contador a cero

### Requirement: Sin fallo que penalice
El nivel SHALL NOT tener vidas ni estado de derrota.

#### Scenario: Recorrido completo
- **WHEN** el niño recorre el nivel sin llegar a la meta durante varios minutos
- **THEN** el juego no muestra pantalla de fin ni resta nada
