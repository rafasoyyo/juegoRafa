## MODIFIED Requirements

### Requirement: El pinchazo no penaliza más
Un pinchazo SHALL NOT reiniciar el nivel, mover al zorro a otro punto, quitar galletas del total ya
guardado ni mostrar ninguna pantalla o mensaje. Las estrellas solo SHALL notar el pinchazo a través de
la galleta que resta del contador del nivel, que cuenta para el porcentaje de galletas de la fase.

#### Scenario: Muchos pinchazos con el contador a cero
- **WHEN** el niño se pincha diez veces con el contador a 0 y luego golpea todos los bloques y llega a la bandera
- **THEN** las estrellas son las mismas que sin haberse pinchado

#### Scenario: Total guardado intacto
- **WHEN** el niño tenía 20 galletas en total, entra en un nivel y se pincha sin haber ganado ninguna
- **THEN** al terminar el nivel su total sigue siendo 20
