# level-enemies Specification

## Purpose
Definir los enemigos del nivel de plataformas: quiénes son, cómo se ven y se mueven, qué ocurre al
tocarlos (un rebote suave sin penalización) y cómo se reparten al azar por los niveles.

## Requirements

### Requirement: Enemigos originales y amables
Los enemigos SHALL ser un erizo de pinchos y una abeja zumbona y, en el río, también una rana y un cangrejo: gráficos propios en el estilo vectorial plano y redondeado del juego, sin contornos negros, con cara simpática y sin parecido con personajes de terceros. Cada gráfico SHALL figurar en el registro de licencias como propio del proyecto.

#### Scenario: Ver un erizo
- **WHEN** aparece un erizo en un móvil horizontal de 844×390
- **THEN** se reconoce como un erizo marrón con pinchos redondeados en el lomo, cara clara, nariz y ojos amables, sin ninguna palabra

#### Scenario: Ver una abeja
- **WHEN** aparece una abeja en un móvil horizontal de 844×390
- **THEN** se reconoce como una abeja con rayas amarillas y oscuras y alas claras que aletean

#### Scenario: Licencia de los gráficos
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** los gráficos del erizo, la abeja, la rana y el cangrejo aparecen como propios del proyecto

### Requirement: Patrulla del erizo
El erizo SHALL andar por el suelo de un lado a otro dentro de su tramo, dándose la vuelta en cada
extremo y mirando hacia donde anda, más despacio que el zorro, y SHALL ser lo bastante bajo para que el
zorro lo salte con un salto normal.

#### Scenario: Llegar al final del tramo
- **WHEN** el erizo llega a un extremo de su tramo
- **THEN** se da la vuelta y anda hacia el otro extremo sin salirse del tramo ni del suelo

#### Scenario: Saltarlo
- **WHEN** el zorro corre hacia un erizo y salta con un toque normal del botón de saltar
- **THEN** pasa por encima sin tocarlo

### Requirement: Vuelo de la abeja
La abeja SHALL subir y bajar despacio sobre su punto, aleteando. En cada ciclo SHALL pasar al menos 1
segundo lo bastante alta para que el zorro pase andando por debajo, y en su punto más bajo SHALL
cortar el paso a un zorro que va andando.

#### Scenario: Pasar por debajo
- **WHEN** el zorro pasa andando bajo la abeja mientras está arriba
- **THEN** no la toca

#### Scenario: Abeja abajo
- **WHEN** el zorro pasa andando bajo la abeja mientras está en su punto más bajo
- **THEN** la toca

### Requirement: No se tocan
Cualquier contacto del zorro con un enemigo, también cayéndole encima, SHALL ser un pinchazo: el
zorro da un brinco hacia arriba y hacia el lado contrario al enemigo, más alto que un rebote corto,
como si se hubiera pinchado, y luego parpadea 1 segundo, durante el cual no SHALL volver a chocar. El
enemigo SHALL hacer un gesto breve y seguir moviéndose; ningún enemigo SHALL desaparecer ni ser
derrotado. Mientras el zorro está en modo invencible no hay pinchazo.

#### Scenario: Chocar de lado
- **WHEN** el zorro corre contra un erizo que viene de frente
- **THEN** el zorro brinca hacia arriba y hacia atrás como si se hubiera pinchado, parpadea y el erizo eriza los pinchos y sigue andando

#### Scenario: Caer encima
- **WHEN** el zorro cae desde un salto sobre un erizo o una abeja
- **THEN** el zorro brinca hacia el lado contrario al enemigo y el enemigo sigue en el nivel

#### Scenario: Parpadeo protector
- **WHEN** el zorro, aún parpadeando, vuelve a tocar un enemigo
- **THEN** no hay un segundo pinchazo ni pierde otra galleta

#### Scenario: Recuperar el control
- **WHEN** termina el brinco del pinchazo
- **THEN** el niño puede volver a moverse y saltar antes de medio segundo desde el choque

#### Scenario: Brinco dentro del nivel
- **WHEN** el zorro se pincha junto a la salida, junto a un escalón o bajo una plataforma
- **THEN** cae sobre el suelo, el escalón o la plataforma, sin salir del recorrido ni quedarse atascado

### Requirement: El pinchazo resta una galleta
Cada pinchazo SHALL restar una galleta del contador del nivel: una galleta sale despedida de Rufo y
se desvanece, y el contador baja en uno con un pequeño bote. El contador SHALL NOT bajar de 0: con 0
galletas el pinchazo ocurre igual pero no se resta nada. Las galletas perdidas SHALL NOT recuperarse.

#### Scenario: Pincharse con galletas
- **WHEN** el contador del nivel marca 3 y Rufo se pincha con un erizo
- **THEN** sale una galleta despedida de Rufo y el contador pasa a 2

#### Scenario: Pincharse sin galletas
- **WHEN** el contador del nivel marca 0 y Rufo se pincha con una abeja
- **THEN** Rufo brinca, no sale ninguna galleta y el contador sigue en 0

#### Scenario: Suma al terminar
- **WHEN** el niño golpea 5 bloques, se pincha 2 veces y llega a la bandera
- **THEN** la tarjeta de nivel completado muestra 3 galletas y al total del niño se le suman 3

### Requirement: El pinchazo no penaliza más
Un pinchazo SHALL NOT reiniciar el nivel, mover al zorro a otro punto, quitar galletas del total ya
guardado ni mostrar ninguna pantalla o mensaje. Las estrellas solo SHALL notar el pinchazo a través de
la galleta que resta del contador del nivel, que cuenta para el porcentaje de galletas de la fase.

#### Scenario: Muchos pinchazos con el contador a cero
- **WHEN** el niño se pincha diez veces con el contador a 0 y luego golpea todos los bloques y llega a la bandera
- **THEN** las estrellas son las mismas que sin haberse pinchado

#### Scenario: Total guardado intacto
- **WHEN** el niño tenía 20 galletas en total, entra en un nivel y se pincha sin haber ganado ninguna
- **THEN** al terminar el nivel su total sigue siendo 20

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

### Requirement: Enemigos al llegar a la meta
Al alcanzar la bandera, ningún enemigo SHALL interrumpir la celebración del zorro.

#### Scenario: Enemigo cerca durante la celebración
- **WHEN** el zorro celebra en la bandera
- **THEN** ningún enemigo lo hace rebotar y la pantalla de nivel completado se abre como siempre

### Requirement: La rana del río
La rana SHALL saltar en el sitio con un ritmo fijo y SHALL agacharse durante al menos 400 ms antes de cada salto, para que se vea venir. En lo alto del salto el zorro SHALL poder pasar andando por debajo sin tocarla; quieta, SHALL poder saltarse por encima. Es un gráfico propio en el estilo del juego, anotado en el registro de licencias.

#### Scenario: Pasar por debajo
- **WHEN** el zorro pasa andando bajo la rana mientras está en el aire
- **THEN** no la toca y no pierde galletas

#### Scenario: El aviso
- **WHEN** la rana va a saltar
- **THEN** antes se agacha, aplastándose, y tiembla un poco

### Requirement: El cangrejo del río
El cangrejo SHALL andar de lado, sin darse la vuelta, de ida y vuelta por un tramo de suelo de 200 px como mucho y más despacio que el erizo. Es un gráfico propio en el estilo del juego, anotado en el registro de licencias.

#### Scenario: Ver un cangrejo
- **WHEN** aparece un cangrejo en un móvil horizontal de 844×390
- **THEN** se reconoce como un cangrejo rojo con pinzas y ojos amables que anda de lado despacio

### Requirement: Tipos de enemigo por mundo
Cada mundo SHALL decir qué tipos de enemigo salen y desde qué nivel, y cada enemigo SHALL elegirse al azar entre los tipos que ya han llegado. En el mundo 1 salen el erizo desde el nivel 1 y la abeja desde el 2. En el río salen el erizo y la abeja como en el mundo 1, la rana desde el nivel 3 y el cangrejo desde el 7. Ningún enemigo SHALL colocarse en la zona de un reto del recorrido ni a menos del margen de seguridad.

#### Scenario: Nivel 3 del río
- **WHEN** se abre muchas veces el nivel 3 del río
- **THEN** salen erizos, abejas y ranas, nunca cangrejos, y ninguno junto a un reto

#### Scenario: El mundo 1 no cambia
- **WHEN** se abre el nivel 1 del mundo 1
- **THEN** salen solo erizos, como antes



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
