## ADDED Requirements

### Requirement: Los 12 tramos del río
El río SHALL tener 12 niveles con los retos de la tabla de `docs/MUNDO-2.md`: A×3 en los niveles 1 a 3 (puntos, marco de diez y al revés), A×2 y B×2 en el 4 y el 6, B×4 en el 5, A×2 y C×2 en el 7, B×2 y C×2 en el 8, B×3 y C×2 en el 10, y A, B×2 y C×2 en el 9, el 11 y el 12. Lalo SHALL hacer la demostración solo en el primer reto de cada mecánica: A en el nivel 1, B en el 4 y C en el 7. Cada nivel SHALL durar de 90 a 150 s con calma.

#### Scenario: Retos del nivel 7
- **WHEN** se juega el nivel 7 del río
- **THEN** hay dos barcas y dos retos de contar, y Lalo hace la demostración en la primera barca

#### Scenario: Dificultad creciente
- **WHEN** se recorren los niveles del río en orden
- **THEN** los escalones aparecen en el 2, los fosos de pinchos en el 4 y las plataformas en el 5

### Requirement: Paisajes del río
Cada nivel del río SHALL tener su propio paisaje, en orden: manantial, arroyo, cascada, molino, cañaveral, lago de noche, embarcadero, puente, huertas, lluvia, puerto y desembocadura. Cada paisaje SHALL tener cielo, colinas y suelo propios y cumplir el mismo contraste que los del mundo 1.

#### Scenario: Del manantial a la desembocadura
- **WHEN** se abre el nivel 1 y después el 12 del río
- **THEN** el 1 tiene montañas y el 12 playa con arena, con cielos distintos
