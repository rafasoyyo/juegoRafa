## ADDED Requirements

### Requirement: Hueco de agua del puente
El hueco de un puente sin resolver SHALL comportarse como un foso sin pinchos: el zorro que cae en él SHALL rebotar fuera por el lado por el que entró, sin perder galletas ni parpadear. Una vez colocada la tabla, el hueco SHALL ser suelo firme.

#### Scenario: Caer al agua
- **WHEN** el zorro cae al hueco del puente
- **THEN** rebota fuera hacia el tramo del que venía y el contador de galletas no cambia
