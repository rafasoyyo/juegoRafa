## ADDED Requirements

### Requirement: Los pterosaurios de la isla
Los pterosaurios SHALL volar en fila de dos o tres, a la misma altura y en ondas regulares, con un vaivén lento sobre su tramo; una fila cuenta como un enemigo. Abajo SHALL tocar a un zorro de pie y arriba SHALL dejarle pasar por debajo. Su sombra en el suelo SHALL crecer y oscurecerse al bajar, como aviso. Son gráficos propios en el estilo A documental de la isla, anotados en el registro de licencias.

#### Scenario: Pasar por debajo
- **WHEN** el zorro pasa andando bajo la fila mientras sube
- **THEN** no la toca y no pierde galletas

#### Scenario: La sombra avisa
- **WHEN** un pterosaurio baja hacia el suelo
- **THEN** su sombra se hace más grande y más oscura antes de que llegue a la altura del zorro

### Requirement: El volcancito de la isla
El volcancito SHALL temblar y echar humo durante al menos 600 ms, con un retumbo, antes de lanzar una piedra grande que sube y vuelve a caer en su cráter, siempre en vertical. La piedra SHALL NOT salir de la columna del volcán. Mientras la piedra está arriba, el volcancito SHALL poder saltarse.

#### Scenario: Saltar el volcancito
- **WHEN** el zorro salta el volcancito con la piedra en lo alto
- **THEN** no toca ni el cono ni la piedra

### Requirement: El tiranosaurio de la isla
El tiranosaurio SHALL caminar despacio de un lado a otro de su tramo y pararse cada pocos pasos a rugir, con un rugido grave que crece y un temblor suave del suelo, sin sangre, sin boca abierta hacia el jugador ni gestos de ataque. Mientras ruge SHALL estar quieto y SHALL poder saltarse por encima con un salto normal.

#### Scenario: Saltar mientras ruge
- **WHEN** el tiranosaurio se para a rugir y el zorro salta hacia él
- **THEN** pasa por encima sin tocarlo

### Requirement: Enemigos con varias partes
Un enemigo SHALL poder tener varias zonas de choque (cada pterosaurio de una fila, el volcán y su piedra), y tocar cualquiera de ellas SHALL contar como un solo pinchazo, con las mismas reglas que el resto de enemigos.

#### Scenario: Tocar la piedra
- **WHEN** la piedra del volcancito cae sobre el zorro
- **THEN** pierde una galleta (nunca por debajo de 0) y rebota como con cualquier enemigo
