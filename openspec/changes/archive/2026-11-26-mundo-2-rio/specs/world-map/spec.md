## MODIFIED Requirements

### Requirement: Mundos en desarrollo
Un mundo en construcción SHALL estar detrás de un interruptor que solo se activa en desarrollo. Con el interruptor apagado, como en el juego publicado, el mundo SHALL mostrarse en el selector como un mundo que aún no existe, sin candado, y SHALL NOT abrirse para ningún perfil. El río SHALL NOT depender de ningún interruptor: está terminado y se abre en el juego publicado según la edad y el progreso.

#### Scenario: Juego publicado
- **WHEN** un perfil de 6 años toca el río en el juego publicado
- **THEN** se abre el mapa del río

#### Scenario: En desarrollo
- **WHEN** un mundo tiene el interruptor apagado (como en el juego publicado) y un perfil de 8 años lo toca
- **THEN** el botón tiembla como formas y `Aa`, y el mapa no cambia

## ADDED Requirements

### Requirement: Mapa del río
El mapa del río SHALL tener dos pantallas con los 12 niveles y el castillo, y un río que baja junto al camino desde el manantial, al principio, hasta la desembocadura, junto al castillo.

#### Scenario: El río acompaña al camino
- **WHEN** se abre el mapa del río a 844×390 y se desplaza hasta el final
- **THEN** el río pasa bajo todas las paradas y el castillo queda tras el nivel 12, sin que el selector tape las estrellas
