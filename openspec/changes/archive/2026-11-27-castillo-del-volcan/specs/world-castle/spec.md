## ADDED Requirements

### Requirement: El nido del cráter
El castillo de la isla SHALL ser una parada propia después de su último nivel, con la pieza del castillo: los retos A, B y C de la isla seguidos y dos preguntas de las pruebas de la bandera de la isla, distintas entre sí y sin el repaso. SHALL abrirse al terminar el último nivel, poder jugarse otra vez, no dar estrellas y dar siempre la medalla de la huella.

#### Scenario: Jugar el nido
- **WHEN** el niño entra en el castillo de la isla
- **THEN** juega un camino de huellas, una puerta de la cueva y un paseo en braquiosaurio, contesta dos preguntas en la bandera y gana la medalla de la huella

### Requirement: Medalla propia de cada mundo
Un castillo PUEDE tener su propia medalla; sin ella SHALL usar la medalla de siempre. La medalla del castillo SHALL ser la que se ve al acabarlo, junto al castillo en el mapa y en el botón del mundo en el selector.

#### Scenario: Medallas distintas
- **WHEN** un perfil tiene las medallas del río y de la isla
- **THEN** el botón del río muestra la medalla de siempre y el de formas, la de la huella
