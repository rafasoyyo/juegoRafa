# Spec Delta

## MODIFIED Requirements

### Requirement: Colocación aleatoria en zonas seguras
Al entrar en un nivel, también al repetirlo, el juego SHALL elegir al azar el tipo, la posición y el
sentido inicial de cada enemigo, solo en zonas seguras: lejos de la salida y de la bandera, fuera de
las columnas de bloques «?», fuera de los escalones y del espacio bajo las plataformas, siempre sobre
suelo llano y con hueco entre enemigos para que el zorro aterrice entre ellos.

#### Scenario: Repetir un nivel
- **WHEN** el niño juega el mismo nivel varias veces
- **THEN** los enemigos no salen siempre en el mismo sitio ni del mismo tipo

#### Scenario: Salida despejada
- **WHEN** se abre un nivel
- **THEN** no hay ningún enemigo a la vista junto al zorro en la salida ni junto a la bandera

#### Scenario: Bloques despejados
- **WHEN** el niño salta para golpear un bloque «?»
- **THEN** no hay ningún enemigo bajo ese bloque ni en su camino de subida

#### Scenario: Escalones y plataformas despejados
- **WHEN** el zorro sube o baja de un escalón o de una plataforma
- **THEN** no hay ningún enemigo sobre el escalón, junto a sus lados ni bajo la plataforma

#### Scenario: Hueco entre enemigos
- **WHEN** el zorro salta por encima de un enemigo
- **THEN** puede aterrizar en el suelo antes del siguiente enemigo
