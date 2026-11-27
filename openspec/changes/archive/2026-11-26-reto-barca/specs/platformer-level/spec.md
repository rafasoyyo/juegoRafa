## ADDED Requirements

### Requirement: Plataforma que se mueve
Una plataforma que se mueve (la barca) SHALL llevar al zorro encima. Mientras se mueve, el zorro SHALL ir con ella sin control y SHALL NOT poder caerse; al pararse, recupera el control.

#### Scenario: Cruzar en la barca
- **WHEN** la barca cruza el lago con Rufo encima y el niño pulsa saltar o una flecha
- **THEN** Rufo sigue sobre la barca hasta la otra orilla y entonces vuelve a responder

### Requirement: Agua del lago
El agua libre del lago SHALL comportarse como el hueco del puente: el zorro que cae en ella SHALL rebotar fuera por el lado por el que entró, sin perder galletas ni parpadear.

#### Scenario: Caer al lago
- **WHEN** el zorro cae al agua del lago desde la barca
- **THEN** rebota hacia la barca y el contador de galletas no cambia
