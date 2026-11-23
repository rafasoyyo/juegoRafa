# Spec Delta

## MODIFIED Requirements

### Requirement: Celebración al completar
Al superar la prueba de la bandera, el juego SHALL abrir la pantalla de nivel completado, con confeti, el zorro celebrando con el gorro elegido y una tarjeta central sin texto. Solo entonces el nivel SHALL quedar completado.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera de un nivel
- **THEN** primero aparece la prueba de la bandera y la pantalla de nivel completado no se abre hasta terminarla

#### Scenario: Prueba superada
- **WHEN** el niño supera la prueba de la bandera
- **THEN** en menos de 2 segundos aparece la pantalla de nivel completado con confeti y el zorro celebrando

## ADDED Requirements

### Requirement: Pantalla de prueba no superada
Si la prueba de la bandera no se supera, el juego SHALL abrir una pantalla de ánimo sin texto, sin confeti y sin estrellas: el zorro y Lalo saludando, y las galletas recogidas, que SHALL sumarse al total. El nivel SHALL NOT quedar completado ni guardar estrellas. La pantalla SHALL ofrecer los mismos tres botones que la de nivel completado, y la flecha de siguiente SHALL abrir el siguiente nivel aunque este no estuviera desbloqueado.

#### Scenario: Ánimo sin castigo
- **WHEN** el niño no supera la prueba del nivel 2 tras recoger 3 galletas
- **THEN** ve al zorro y a Lalo saludando, la galleta con el número 3 y ninguna estrella, y su total de galletas sube en 3

#### Scenario: Seguir al siguiente nivel
- **WHEN** en esa pantalla el niño toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Volver a intentarlo
- **WHEN** en esa pantalla el niño toca la flecha circular
- **THEN** el nivel 2 empieza de nuevo y, al llegar a la bandera, vuelve a salir su prueba con preguntas nuevas

#### Scenario: Último nivel
- **WHEN** el niño no supera la prueba del nivel 6 y toca la flecha grande
- **THEN** se abre el mapa
