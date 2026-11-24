# Spec Delta

## MODIFIED Requirements

### Requirement: Sin fallo que penalice
El nivel SHALL NOT tener vidas, estado de derrota, hoyos ni caídas fuera del recorrido: el suelo SHALL
ser continuo de la salida a la bandera, también bajo las zonas de pinchos.

#### Scenario: Recorrido completo
- **WHEN** el niño recorre el nivel sin llegar a la meta durante varios minutos
- **THEN** el juego no muestra pantalla de fin y solo los pinchazos con enemigos o con pinchos restan galletas

#### Scenario: Caer de una plataforma
- **WHEN** el zorro cae desde la plataforma más alta del nivel
- **THEN** aterriza en el suelo o en un escalón y puede seguir jugando sin ninguna penalización

#### Scenario: Caer en los pinchos
- **WHEN** el zorro cae en una zona de pinchos
- **THEN** pierde como mucho una galleta del contador del nivel, rebota fuera de la zona y sigue jugando sin volver a la salida

### Requirement: Escenario del nivel
El nivel SHALL dibujar, con los colores y la decoración del ambiente de ese nivel, un cielo en
degradado, una decoración de fondo y colinas redondeadas que se desplazan más despacio que el suelo
(paralaje), y un suelo propio del ambiente (hierba, arena, nieve o nube) sobre su base. Sobre él SHALL
dibujar los bloques «?» amarillos redondeados con sombra inferior, las plataformas y escalones del
nivel, las zonas de pinchos y una bandera coral al final.

#### Scenario: Avanzar por el nivel
- **WHEN** el zorro avanza hacia la derecha
- **THEN** el suelo, los escalones, las plataformas, los pinchos y los bloques se desplazan a la velocidad de la cámara y la decoración del fondo y las colinas más despacio

#### Scenario: Escenario según el nivel
- **WHEN** se abre el nivel 3
- **THEN** el escenario usa el ambiente de bosque y no el del prado del nivel 1

#### Scenario: Suelo de nieve
- **WHEN** se abre el nivel 10
- **THEN** el suelo es de nieve blanca sobre su base, y no de hierba
