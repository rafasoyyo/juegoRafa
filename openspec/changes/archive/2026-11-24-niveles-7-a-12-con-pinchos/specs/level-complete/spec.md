# Spec Delta

## MODIFIED Requirements

### Requirement: Tres caminos tras la celebración
La pantalla SHALL ofrecer tres botones sin texto: mapa (icono de mapa), siguiente nivel (flecha, el más
grande y en coral) y repetir (flecha circular). En el último nivel del mundo, el 12, el botón de
siguiente SHALL llevar al mapa.

#### Scenario: Siguiente nivel
- **WHEN** el niño completa el nivel 2 y toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Del seis al siete
- **WHEN** el niño completa el nivel 6 y toca la flecha grande
- **THEN** se abre el nivel 7

#### Scenario: Último nivel del mundo
- **WHEN** el niño completa el nivel 12 y toca la flecha grande
- **THEN** se abre el mapa

#### Scenario: Repetir
- **WHEN** el niño toca la flecha circular
- **THEN** el mismo nivel empieza de nuevo con el contador de galletas del nivel a cero

#### Scenario: Volver al mapa
- **WHEN** el niño toca el icono de mapa
- **THEN** se abre el mapa con el nivel recién completado en estado hecho

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
- **WHEN** el niño no supera la prueba del nivel 12 y toca la flecha grande
- **THEN** se abre el mapa
