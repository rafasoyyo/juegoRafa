## MODIFIED Requirements

### Requirement: Tres caminos tras la celebración
La pantalla SHALL ofrecer tres botones sin texto: mapa (icono de mapa), siguiente nivel (flecha, el más
grande y en coral) y repetir (flecha circular). En el último nivel del mundo, el 12, el botón de
siguiente SHALL llevar al castillo si el mundo tiene y, si no, al mapa.

#### Scenario: Siguiente nivel
- **WHEN** el niño completa el nivel 2 y toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Del seis al siete
- **WHEN** el niño completa el nivel 6 y toca la flecha grande
- **THEN** se abre el nivel 7

#### Scenario: Último nivel del mundo
- **WHEN** el niño completa el nivel 12 de un mundo sin castillo y toca la flecha grande
- **THEN** se abre el mapa

#### Scenario: Del último nivel al castillo
- **WHEN** el niño completa el último nivel de un mundo con castillo y toca la flecha grande
- **THEN** empieza el castillo

#### Scenario: Repetir
- **WHEN** el niño toca la flecha circular
- **THEN** el mismo nivel empieza de nuevo con el contador de galletas del nivel a cero

#### Scenario: Volver al mapa
- **WHEN** el niño toca el icono de mapa
- **THEN** se abre el mapa con el nivel recién completado en estado hecho

## ADDED Requirements

### Requirement: Pantalla de la medalla
Al terminar el castillo de un mundo, la pantalla SHALL mostrar confeti, el zorro celebrando y una tarjeta sin texto con la medalla del mundo y las galletas, sin estrellas. La flecha grande SHALL llevar al mapa y la flecha circular, a repetir el castillo.

#### Scenario: Fin del castillo
- **WHEN** el niño termina el castillo del río
- **THEN** aparece la medalla con confeti y, al tocar la flecha grande, el mapa del río
