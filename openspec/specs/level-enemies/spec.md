# level-enemies Specification

## Purpose
Definir los enemigos del nivel de plataformas: quiénes son, cómo se ven y se mueven, qué ocurre al
tocarlos (un rebote suave sin penalización) y cómo se reparten al azar por los niveles.

## Requirements

### Requirement: Enemigos originales y amables
Los enemigos SHALL ser un erizo de pinchos y una abeja zumbona, gráficos propios en el estilo vectorial
plano y redondeado del juego, sin contornos negros, con cara simpática y sin parecido con personajes de
terceros. Cada gráfico SHALL figurar en el registro de licencias como propio del proyecto.

#### Scenario: Ver un erizo
- **WHEN** aparece un erizo en un móvil horizontal de 844×390
- **THEN** se reconoce como un erizo marrón con pinchos redondeados en el lomo, cara clara, nariz y ojos amables, sin ninguna palabra

#### Scenario: Ver una abeja
- **WHEN** aparece una abeja en un móvil horizontal de 844×390
- **THEN** se reconoce como una abeja con rayas amarillas y oscuras y alas claras que aletean

#### Scenario: Licencia de los gráficos
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** los gráficos del erizo y de la abeja aparecen como propios del proyecto

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
Cualquier contacto del zorro con un enemigo, también cayéndole encima, SHALL hacer rebotar al zorro
con un saltito hacia el lado contrario al enemigo y mostrarlo parpadeando 1 segundo, durante el cual
no SHALL volver a chocar. El enemigo SHALL hacer un gesto breve y seguir moviéndose; ningún enemigo
SHALL desaparecer ni ser derrotado.

#### Scenario: Chocar de lado
- **WHEN** el zorro corre contra un erizo que viene de frente
- **THEN** el zorro sale despedido hacia atrás con un saltito, parpadea y el erizo eriza los pinchos y sigue andando

#### Scenario: Caer encima
- **WHEN** el zorro cae desde un salto sobre un erizo o una abeja
- **THEN** el zorro rebota hacia el lado contrario al enemigo y el enemigo sigue en el nivel

#### Scenario: Parpadeo protector
- **WHEN** el zorro, aún parpadeando, vuelve a tocar un enemigo
- **THEN** no hay un segundo rebote

#### Scenario: Recuperar el control
- **WHEN** termina el rebote
- **THEN** el niño puede volver a moverse y saltar antes de medio segundo desde el choque

### Requirement: Chocar no penaliza
Chocar con un enemigo SHALL NOT quitar galletas, cambiar las estrellas, reiniciar el nivel, mover al
zorro a otro punto ni mostrar ninguna pantalla o mensaje.

#### Scenario: Muchos choques
- **WHEN** el niño choca diez veces con enemigos y luego golpea todos los bloques y llega a la bandera
- **THEN** el contador de galletas y las estrellas son los mismos que sin haber chocado

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

### Requirement: Cantidad de enemigos por nivel
El número de enemigos SHALL crecer con el número del nivel: 2 en el nivel 1, 3 en el nivel 2, 4 en el nivel 3, 5 en el nivel 4, 6 en el nivel 5 y 7 en el nivel 6. En el nivel 1 SHALL salir solo el erizo; la abeja SHALL poder salir a partir del nivel 2.

#### Scenario: Primer nivel
- **WHEN** se abre el nivel 1
- **THEN** hay exactamente dos enemigos y ambos son erizos

#### Scenario: Último nivel
- **WHEN** se abre el nivel 6
- **THEN** hay exactamente siete enemigos, que pueden ser erizos, abejas o una mezcla

#### Scenario: Caben todos
- **WHEN** se abre cualquiera de los niveles 1 a 6
- **THEN** salen todos los enemigos de su nivel, cada uno en un tramo distinto de suelo llano y respetando las zonas seguras

### Requirement: Enemigos al llegar a la meta
Al alcanzar la bandera, ningún enemigo SHALL interrumpir la celebración del zorro.

#### Scenario: Enemigo cerca durante la celebración
- **WHEN** el zorro celebra en la bandera
- **THEN** ningún enemigo lo hace rebotar y la pantalla de nivel completado se abre como siempre
