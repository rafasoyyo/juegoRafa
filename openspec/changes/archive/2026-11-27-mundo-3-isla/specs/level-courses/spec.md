## ADDED Requirements

### Requirement: Los 12 tramos de la isla
La isla SHALL tener 12 niveles con los retos de la tabla de `docs/MUNDO-3.md`: A×3 en los niveles 1 a 3, A×2 y B×2 en el 4 y el 6, B×4 en el 5, C×2 y A×2 en el 7, B×2 y C×2 en el 8, A, B, C×2 y D en el 9 y el 12, B×2, C×2 y D en el 10, y A, B, C y D×2 en el 11. Lalo SHALL hacer la demostración solo en el primer reto de cada mecánica: A en el nivel 1, B en el 4, C en el 7 y D en el 9. Los escalones SHALL aparecer en el 2, los charcos de lava en el 4, las plataformas en el 5 y los charcos anchos en el 7, con más en el 11. Cada nivel SHALL durar de 90 a 150 s con calma.

#### Scenario: Retos del nivel 9
- **WHEN** se juega el nivel 9 de la isla
- **THEN** hay un camino de huellas, una puerta, dos braquiosaurios y unas piedras del géiser, y Lalo hace la demostración en el géiser

### Requirement: Paisajes de la isla
Cada nivel de la isla SHALL tener su propio paisaje, en orden: playa negra, helechos, charcas y géiseres, huellas gigantes, cascada templada, pantano de noche, valle de los cuellos largos, columnas de roca, yacimiento de fósiles, cueva de cristales, ríos de lava y borde del cráter, con cielo, colinas y suelo propios y el mismo contraste que los demás. Salvo de noche, en la cueva, en el yacimiento y en el borde del cráter, el gran volcán SHALL humear al fondo, sin hacer daño.

#### Scenario: De la playa al cráter
- **WHEN** se abre el nivel 1 y después el 12 de la isla
- **THEN** el 1 tiene arena negra, mar oscuro y el volcán al fondo, y el 12 el cielo rojizo del cráter con brasas que suben

### Requirement: Charcos de lava
En los niveles y el castillo de la isla, el fondo de cada foso SHALL ser un charco de lava redondeado en lugar de pinchos, con la misma geometría y las mismas reglas: rebote fuera del foso y una galleta menos, que nunca baja de 0.

#### Scenario: Caer en la lava
- **WHEN** Rufo cae en un charco de lava del nivel 4 de la isla sin protección
- **THEN** rebota fuera por donde entró, sisea y pierde una galleta
