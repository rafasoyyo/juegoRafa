## ADDED Requirements

### Requirement: La isla en construcción
El tercer botón del selector (formas) SHALL abrir el mundo 3, «La isla de los dinosaurios», solo cuando el interruptor de desarrollo `mundo-3-isla` está activo; en el juego publicado SHALL seguir temblando como un mundo que aún no existe. Con el interruptor activo, la isla SHALL abrirse con 7 años o más o al llegar al nivel 12 del río, y con candado en otro caso.

#### Scenario: Juego publicado
- **WHEN** un niño de 8 años toca el botón de formas en el juego publicado
- **THEN** el botón tiembla y no se abre ningún mundo

#### Scenario: En desarrollo con 6 años
- **WHEN** en desarrollo un perfil de 6 años que no ha llegado al nivel 12 del río toca el botón de formas
- **THEN** el botón tiembla con candado
