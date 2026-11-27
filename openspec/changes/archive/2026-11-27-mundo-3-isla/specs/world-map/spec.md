## MODIFIED Requirements

### Requirement: La isla en construcción
El tercer botón del selector (formas) SHALL abrir el mundo 3, «La isla de los dinosaurios», también en el juego publicado, sin depender de ningún interruptor: con 7 años o más, o al llegar al nivel 12 del río, y con candado en otro caso.

#### Scenario: Juego publicado
- **WHEN** un niño de 8 años toca el botón de formas en el juego publicado
- **THEN** se abre el mapa de la isla

#### Scenario: Con 6 años
- **WHEN** un perfil de 6 años que no ha llegado al nivel 12 del río toca el botón de formas
- **THEN** el botón tiembla con candado

## ADDED Requirements

### Requirement: Mapa del volcán
El mapa de la isla SHALL tener dos pantallas en las que el camino sube de la playa negra al gran volcán, con el paisaje de cada tramo, el huevo de 12 manchas encima de los niveles del medio sin que ningún nodo lo tape, y el castillo dibujado como el nido del cráter en la cima del volcán. El nido SHALL verse también al final del recorrido del castillo y en su prueba.

#### Scenario: El nido en el cráter
- **WHEN** se abre el mapa de la isla a 844×390 y se desplaza hasta el final
- **THEN** el nido queda sobre el cráter, tras el nivel 12, sin que el selector tape las estrellas
