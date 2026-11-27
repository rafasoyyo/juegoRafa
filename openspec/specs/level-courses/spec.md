# level-courses Specification

## Purpose
Definir los 6 recorridos del mundo de los números como contenido propio de cada nivel: su forma,
sus elementos, su ambiente y su duración, para que cada nivel sea distinto, dure lo bastante y sea
siempre superable por un niño de 4 a 6 años.

## Requirements

### Requirement: Cada nivel tiene su propio recorrido
Cada uno de los 12 niveles SHALL tener un recorrido propio: su longitud, la posición y altura de sus
bloques «?», sus plataformas, sus escalones y, en los niveles 7 a 12, sus zonas de pinchos. Ningún par
de niveles SHALL compartir la misma disposición de elementos.

#### Scenario: Jugar dos niveles seguidos
- **WHEN** el niño completa el nivel 1 y entra en el nivel 2
- **THEN** el recorrido del nivel 2 tiene otra longitud y otros bloques, plataformas o escalones en otros sitios

#### Scenario: Revisar los seis niveles
- **WHEN** se comparan los datos de los niveles 1 a 6
- **THEN** no hay dos niveles con la misma lista de bloques, plataformas y escalones

#### Scenario: Revisar los doce niveles
- **WHEN** se comparan los datos de los 12 niveles
- **THEN** no hay dos niveles con la misma lista de bloques, plataformas, escalones y zonas de pinchos

### Requirement: Recorridos definidos como datos
Los recorridos SHALL definirse como datos editables, un archivo por nivel, sin tener que cambiar el
código del juego para mover, añadir o quitar un elemento. Un nivel con datos inválidos SHALL detectarse
en las pruebas antes de publicarse.

#### Scenario: Mover un bloque
- **WHEN** se cambia la posición de un bloque «?» en el archivo del nivel 3
- **THEN** tras recompilar, el bloque aparece en la nueva posición sin haber tocado otro archivo

#### Scenario: Elemento fuera del recorrido
- **WHEN** un archivo de nivel tiene un bloque más allá de la bandera
- **THEN** las pruebas automáticas fallan e indican el nivel y el elemento

### Requirement: Duración mínima de un minuto para un niño típico
La duración se calcula a partir de los datos del nivel y se comprueba en las pruebas. Jugando con calma y golpeando todos los bloques «?», los niveles 1 a 6 SHALL durar entre 60 s y 2 min, y los niveles 7 a 12, entre 90 s y 150 s. Yendo a toda velocidad sin pararse, ningún nivel del 1 al 6 SHALL cruzarse en menos de 30 s, ni ninguno del 7 al 12 en menos de 35 s.

#### Scenario: Estimación de cada nivel
- **WHEN** se calcula la duración estimada de los 12 niveles a partir de sus datos
- **THEN** los niveles 1 a 6 quedan entre 60 s y 120 s jugando con calma y por encima de 30 s yendo a tope, y los niveles 7 a 12 entre 90 s y 150 s y por encima de 35 s

#### Scenario: Partida de prueba
- **WHEN** un adulto juega el nivel 1 en un móvil horizontal, parándose a golpear todos los bloques, y lo cronometra
- **THEN** tarda al menos 1 minuto en llegar a la bandera

#### Scenario: Ir a tope
- **WHEN** se juega un nivel con la flecha derecha siempre pulsada, saltando solo para subir escalones y cruzar pinchos
- **THEN** se tardan al menos 30 s en llegar a la bandera en los niveles 1 a 6, y al menos 35 s en los niveles 7 a 12

### Requirement: Más bloques en cada nivel
Cada nivel SHALL tener sus bloques «?» repartidos a lo largo de todo el recorrido: entre 12 y 20 en los niveles 1 a 6, y entre 20 y 25 en los niveles 7 a 12. El número de bloques SHALL no bajar de un nivel al siguiente.

#### Scenario: Recuento de bloques
- **WHEN** se cuentan los bloques «?» de los niveles 1 a 12
- **THEN** cada nivel del 1 al 6 tiene entre 12 y 20, cada nivel del 7 al 12 entre 20 y 25, y ninguno tiene menos que el anterior

#### Scenario: Galletas de un nivel difícil
- **WHEN** el niño golpea todos los bloques del nivel 7 sin pincharse
- **THEN** termina el nivel con al menos 20 galletas

#### Scenario: Sin tramos vacíos
- **WHEN** el zorro recorre cualquier nivel
- **THEN** nunca pasa más de 8 s corriendo a tope sin ver un bloque «?», una plataforma, un escalón o una zona de pinchos

### Requirement: Plataformas flotantes
Un nivel MAY tener plataformas flotantes redondeadas. El zorro SHALL poder atravesarlas saltando desde
abajo y SHALL aterrizar y correr sobre ellas; al salirse por un borde SHALL caer a la superficie de
debajo. Una plataforma MAY llevar bloques «?» encima.

#### Scenario: Subir a una plataforma
- **WHEN** el zorro salta desde el suelo bajo una plataforma
- **THEN** la atraviesa desde abajo y aterriza encima

#### Scenario: Salir por el borde
- **WHEN** el zorro corre sobre una plataforma y llega a su borde
- **THEN** cae al suelo de debajo sin rebote ni penalización

#### Scenario: Bloque sobre una plataforma
- **WHEN** el zorro está sobre una plataforma que lleva un bloque «?» encima y salta
- **THEN** golpea el bloque desde abajo y gana la galleta como en el suelo

### Requirement: Escalones
Un nivel MAY tener escalones: tramos de suelo elevado de uno o dos peldaños. Los escalones SHALL ser
sólidos por arriba y por los lados, y el zorro SHALL poder subirlos y bajarlos saltando. Un escalón MAY
tener bloques «?» encima.

#### Scenario: Subir un escalón
- **WHEN** el zorro llega corriendo a un escalón y el niño toca saltar
- **THEN** el zorro sube al escalón y puede seguir corriendo por encima

#### Scenario: Chocar con un escalón sin saltar
- **WHEN** el zorro corre contra el lado de un escalón sin saltar
- **THEN** se detiene contra él sin rebote ni penalización, y puede subirlo saltando

#### Scenario: Bajar un escalón
- **WHEN** el zorro corre por encima de un escalón y llega a su final
- **THEN** cae al suelo de abajo y sigue corriendo

### Requirement: Todo alcanzable con un salto normal
Cada bloque «?», plataforma y peldaño SHALL poder alcanzarse con un salto normal desde la superficie
de la que se salta, y cada zona de pinchos SHALL poder cruzarse con un salto normal, sin saltos de
precisión ni encadenar saltos en el aire. Ningún elemento SHALL poder dejar al zorro atrapado sin
poder seguir hacia la bandera o volver atrás.

#### Scenario: Alcanzar todos los bloques
- **WHEN** se comprueban los datos de los 12 niveles
- **THEN** cada bloque queda a una altura que la cabeza del zorro alcanza con un salto normal desde la superficie de debajo

#### Scenario: Nada atrapa
- **WHEN** el zorro está en cualquier punto del recorrido de cualquier nivel
- **THEN** puede llegar a la bandera solo corriendo a la derecha y saltando

#### Scenario: Cruzar pinchos
- **WHEN** se comprueban los datos de los niveles 7 a 12
- **THEN** cada zona de pinchos es más estrecha que lo que el zorro recorre en el aire con un salto normal, con margen para despegar y aterrizar

### Requirement: Dificultad creciente
Los recorridos SHALL ser más exigentes según avanza el nivel. El nivel 1 SHALL ser llano, sin plataformas y con todos sus bloques al alcance desde el suelo; desde el 2 hay escalones y desde el 3, plataformas. El 6 SHALL tener más plataformas y escalones que los niveles 1 a 5. Del 7 al 12, cada nivel SHALL tener al menos la longitud, los bloques, los escalones, las plataformas, los enemigos y las zonas de pinchos del anterior.

#### Scenario: Primer nivel
- **WHEN** se abre el nivel 1
- **THEN** el suelo es llano, no hay plataformas y todos los bloques se alcanzan saltando desde el suelo

#### Scenario: Sexto nivel
- **WHEN** se abre el nivel 6
- **THEN** hay más plataformas y escalones que en cualquiera de los niveles 1 a 5

#### Scenario: Último nivel
- **WHEN** se abre el nivel 12
- **THEN** hay más plataformas, escalones y zonas de pinchos que en cualquier otro nivel

#### Scenario: Niveles difíciles
- **WHEN** se comparan los datos de los niveles 7 a 12
- **THEN** cada uno tiene al menos la longitud, los bloques, los escalones, las plataformas, los enemigos y las zonas de pinchos del anterior, y el 12 es el más largo y el que más tiene de todo

#### Scenario: Más difícil que el seis
- **WHEN** se compara el nivel 7 con el 6
- **THEN** el 7 es más largo, tiene al menos tantos bloques, escalones, plataformas y enemigos, y además tiene zonas de pinchos

### Requirement: Un ambiente distinto por nivel
Cada nivel SHALL tener su propio ambiente visual, propio y dibujado en el estilo del juego: 1 prado soleado, 2 campo de flores, 3 bosque, 4 otoño, 5 atardecer, 6 noche estrellada suave, 7 playa, 8 selva, 9 montaña, 10 nieve, 11 desierto y 12 nubes con arcoíris. El ambiente SHALL cambiar el cielo, las colinas, el suelo y la decoración del fondo.

#### Scenario: Ver los seis ambientes
- **WHEN** se abren los niveles 1 a 6 uno tras otro en un móvil horizontal
- **THEN** cada uno tiene un cielo, unas colinas, un suelo y una decoración de fondo diferentes y reconocibles

#### Scenario: Ver los ambientes nuevos
- **WHEN** se abren los niveles 7 a 12 uno tras otro en un móvil horizontal
- **THEN** se reconocen la playa (arena, mar y palmeras), la selva (hojas grandes y lianas), la montaña (picos al fondo), la nieve (suelo blanco, pinos nevados y copos), el desierto (dunas y cactus) y las nubes (suelo de nube y arcoíris), y ninguno se parece a los de los niveles 1 a 6

#### Scenario: Noche suave
- **WHEN** se abre el nivel 6
- **THEN** el cielo es azul de noche con estrellas y luna, sin nada oscuro o que dé miedo, y el zorro, los bloques y los enemigos se distinguen tan bien como de día

### Requirement: El ambiente no estorba el juego
En todos los ambientes, el zorro, los bloques «?», las plataformas, los escalones, los enemigos, las
zonas de pinchos y la bandera SHALL distinguirse a simple vista del fondo y del suelo, y la decoración
SHALL estar detrás del recorrido sin parecer algo con lo que se pueda chocar, en lo que se pueda subir
o que pinche.

#### Scenario: Bloque en el atardecer
- **WHEN** se ve un bloque «?» sobre el cielo del atardecer en un móvil de 844×390
- **THEN** el bloque se distingue claramente del cielo

#### Scenario: Árbol del bosque
- **WHEN** el zorro pasa por delante de un árbol de la decoración del bosque
- **THEN** el árbol queda detrás del zorro, más apagado que el recorrido, y no lo frena

#### Scenario: Zorro en el desierto
- **WHEN** el zorro naranja corre por el suelo del desierto en un móvil de 844×390
- **THEN** se distingue claramente del suelo y de las dunas

#### Scenario: Cactus de fondo
- **WHEN** el zorro pasa por delante de un cactus de la decoración del desierto
- **THEN** el cactus queda detrás, más apagado que el recorrido, no pincha y no se confunde con una zona de pinchos

### Requirement: Arcoíris en el horizonte
Cada nivel del 1 al 12 SHALL mostrar un arcoíris lejano a la derecha del fondo, hacia donde corre Rufo, como meta que se ve sin leer. Su tamaño SHALL crecer con el número del nivel. En el nivel 12 SHALL ser el arcoíris del escenario de nubes y el mayor de todos. El arcoíris SHALL verse sin texto, sin voz y sin que el niño haga nada.

#### Scenario: Arcoíris pequeño al empezar
- **WHEN** se abre el nivel 1 en un móvil de 844×390
- **THEN** se ve un arcoíris pequeño a la derecha, casi en el horizonte, sin que ningún elemento del recorrido lo tape del todo

#### Scenario: Crece de un nivel al siguiente
- **WHEN** se comparan los niveles 1 a 11 en orden
- **THEN** el arcoíris de cada nivel es más grande que el del anterior, y en el 11 ocupa más o menos medio cielo

#### Scenario: Montaña
- **WHEN** se abre el nivel 9
- **THEN** el arcoíris asoma por detrás de los picos nevados del fondo

#### Scenario: Bajo el arco en las nubes
- **WHEN** se abre el nivel 12
- **THEN** se ve un solo arcoíris, el más grande del mundo, y Rufo corre por las nubes bajo el arco

#### Scenario: Visible durante todo el nivel
- **WHEN** Rufo corre desde la salida hasta la bandera de cualquier nivel en un móvil de 844×390
- **THEN** el arcoíris se desplaza muy despacio y sigue a la vista en la pantalla hasta llegar a la bandera

### Requirement: Arcoíris tenue de noche
En el nivel 6, con el ambiente de noche, el arcoíris del horizonte SHALL verse a media opacidad, como un arcoíris de luna, sin tapar la luna ni las estrellas de forma que dejen de reconocerse.

#### Scenario: Arcoíris de luna
- **WHEN** se abre el nivel 6 en un móvil de 844×390
- **THEN** el arcoíris se ve más tenue que en los niveles 5 y 7, y la luna y las estrellas se siguen reconociendo

### Requirement: El arcoíris no estorba el recorrido
El arcoíris del horizonte SHALL ser la capa más lejana del fondo, por detrás de las nubes, las colinas, la decoración y el suelo, más apagado que el recorrido. Nunca SHALL tapar al zorro, los bloques «?», las plataformas, los escalones, los enemigos, los pinchos ni la bandera, ni parecer algo en lo que se pueda subir.

#### Scenario: Bloque delante del arcoíris
- **WHEN** un bloque «?» o un enemigo pasa por delante del arcoíris en cualquier nivel
- **THEN** el bloque o el enemigo se ve entero por delante y se distingue claramente del arcoíris

#### Scenario: Zorro que salta hacia el arcoíris
- **WHEN** el zorro salta a la altura del arcoíris
- **THEN** lo atraviesa por delante sin chocar ni apoyarse en él

### Requirement: Retos en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos del recorrido con su tipo, su posición y sus opciones. La validación SHALL comprobar que cada reto está entre la salida y la bandera, sobre suelo llano y sin escalones, plataformas, bloques «?» ni pinchos en su zona, y que dos retos no se solapan. Los enemigos SHALL NOT colocarse en la zona de un reto.

#### Scenario: Reto sobre un escalón
- **WHEN** un archivo de nivel pone un reto donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

#### Scenario: Nivel sin retos
- **WHEN** un archivo de nivel no declara retos
- **THEN** el nivel se juega como hasta ahora

### Requirement: Puentes en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo puente con su posición. La validación SHALL comprobar que todo el puente, con un margen a cada lado, queda sobre suelo llano y libre, entre la salida y la bandera, como el resto de retos, de modo que los bloques del reto siempre estén sobre tramos firmes.

#### Scenario: Puente sobre una plataforma
- **WHEN** un archivo de nivel pone un puente donde hay una plataforma
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

### Requirement: Barcas en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo barca con la posición del lago. La validación SHALL comprobar que el muelle y el lago, con un margen, quedan sobre suelo llano y libre, entre la salida y la bandera, como el resto de retos.

#### Scenario: Barca sobre un escalón
- **WHEN** un archivo de nivel pone una barca donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

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

### Requirement: Caminos de huellas en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo camino de huellas (`footprints`) con su posición. Ocupan lo mismo que un puente y la validación SHALL comprobar lo mismo: todo el puente, con un margen a cada lado, sobre suelo llano y libre, entre la salida y la bandera.

#### Scenario: Camino de huellas sobre un escalón
- **WHEN** un archivo de nivel pone un camino de huellas donde hay un escalón
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

### Requirement: Puertas de la cueva en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo puerta de la cueva (`door`) con su posición. Ocupan lo mismo que unos bloques que cuentan y 2,5 baldosas más tras la losa, donde espera el triceratops, y la validación SHALL comprobar que ese tramo es suelo llano y libre entre la salida y la bandera.

#### Scenario: Puerta junto a un foso
- **WHEN** un archivo de nivel pone una puerta cuyo tramo pisa un foso
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto

### Requirement: Paseos en braquiosaurio en los datos del recorrido
El archivo de un nivel SHALL poder declarar retos de tipo paseo en braquiosaurio (`brachio`) con el borde izquierdo del río. Ocupan lo mismo que una barca (orilla, río y margen), y la validación SHALL comprobar que ese tramo es suelo llano y libre entre la salida y la bandera.

#### Scenario: Braquiosaurio con un escalón en la orilla
- **WHEN** un archivo de nivel pone un escalón en la orilla de un paseo en braquiosaurio
- **THEN** las pruebas automáticas fallan e indican el nivel y el reto
