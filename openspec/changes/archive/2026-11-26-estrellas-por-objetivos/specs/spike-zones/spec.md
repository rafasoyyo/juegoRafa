## MODIFIED Requirements

### Requirement: Tocar los pinchos es un pinchazo
Cuando Rufo cae al foso y sus pies tocan las puntas, SHALL producirse un pinchazo como el de un enemigo: el contador del nivel baja en una galleta (nunca por debajo de 0), sale una galleta despedida y Rufo parpadea 1 s, sin pincharse otra vez. El total guardado y la posición de los bloques SHALL NOT cambiar. Las estrellas solo SHALL notar el pinchazo a través de esa galleta menos en el contador, que cuenta para el porcentaje de galletas de la fase. Pasar por encima del foso de un salto SHALL NOT pinchar.

#### Scenario: Caer en los pinchos
- **WHEN** el contador del nivel marca 4 y Rufo cae al foso
- **THEN** sale una galleta despedida, el contador pasa a 3 y Rufo parpadea

#### Scenario: Sin galletas
- **WHEN** el contador marca 0 y Rufo cae al foso
- **THEN** Rufo rebota, no sale ninguna galleta y el contador sigue en 0

#### Scenario: Margen de perdón
- **WHEN** Rufo aterriza de un salto con la punta de un pie en el borde del foso
- **THEN** no cae al foso y no hay pinchazo

#### Scenario: Saltar rozando
- **WHEN** Rufo salta el foso y pasa justo por encima de las puntas sin caer dentro
- **THEN** no hay pinchazo

### Requirement: Los pinchos no penalizan más
Los pinchos SHALL NOT reiniciar el nivel, devolver a Rufo a la salida, mostrar ninguna pantalla o mensaje ni impedir llegar a la bandera. Siempre SHALL haber manera de seguir hacia la bandera saltando.

#### Scenario: Muchos pinchazos con el contador a cero
- **WHEN** el niño cae diez veces en los pinchos con el contador a 0 y luego golpea todos los bloques y llega a la bandera
- **THEN** las estrellas son las mismas que sin haber caído y la prueba de la bandera aparece como siempre
