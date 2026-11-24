# Spec Delta

## MODIFIED Requirements

### Requirement: Colocación aleatoria en zonas seguras
Al entrar en un nivel, también al repetirlo, el juego SHALL elegir al azar el tipo, la posición y el
sentido inicial de cada enemigo, solo en zonas seguras: lejos de la salida y de la bandera, fuera de
las columnas de bloques «?», fuera de los escalones y del espacio bajo las plataformas, lejos de las
zonas de pinchos, siempre sobre suelo llano y con hueco entre enemigos para que el zorro aterrice
entre ellos.

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

#### Scenario: Pinchos despejados
- **WHEN** el zorro salta una zona de pinchos o rebota fuera de ella tras pincharse
- **THEN** no hay ningún enemigo sobre los pinchos ni en el suelo junto a sus bordes, y ningún erizo cruza la zona en su patrulla

### Requirement: Cantidad de enemigos por nivel
El número de enemigos SHALL crecer con el nivel: 2 en el nivel 1, 3 en el 2, 4 en el 3, 5 en el 4, 6 en el 5, 7 en el 6, 7 en el 7, 8 en el 8, 8 en el 9, 9 en el 10, 9 en el 11 y 10 en el 12. En el nivel 1 SHALL salir solo el erizo; la abeja SHALL poder salir a partir del nivel 2.

#### Scenario: Primer nivel
- **WHEN** se abre el nivel 1
- **THEN** hay exactamente dos enemigos y ambos son erizos

#### Scenario: Sexto nivel
- **WHEN** se abre el nivel 6
- **THEN** hay exactamente siete enemigos, que pueden ser erizos, abejas o una mezcla

#### Scenario: Último nivel
- **WHEN** se abre el nivel 12
- **THEN** hay exactamente diez enemigos, que pueden ser erizos, abejas o una mezcla

#### Scenario: Caben todos
- **WHEN** se abre cualquiera de los niveles 1 a 12, muchas veces seguidas
- **THEN** salen siempre todos los enemigos de su nivel, cada uno en un tramo distinto de suelo llano y respetando las zonas seguras
