# level-courses Specification

## Purpose
Definir los 6 recorridos del mundo de los números como contenido propio de cada nivel: su forma,
sus elementos, su ambiente y su duración, para que cada nivel sea distinto, dure lo bastante y sea
siempre superable por un niño de 4 a 6 años.

## Requirements

### Requirement: Cada nivel tiene su propio recorrido
Cada uno de los 6 niveles SHALL tener un recorrido propio: su longitud, la posición y altura de sus
bloques «?», sus plataformas y sus escalones. Ningún par de niveles SHALL compartir la misma
disposición de elementos.

#### Scenario: Jugar dos niveles seguidos
- **WHEN** el niño completa el nivel 1 y entra en el nivel 2
- **THEN** el recorrido del nivel 2 tiene otra longitud y otros bloques, plataformas o escalones en otros sitios

#### Scenario: Revisar los seis niveles
- **WHEN** se comparan los datos de los 6 niveles
- **THEN** no hay dos niveles con la misma lista de bloques, plataformas y escalones

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
Jugando con calma y golpeando todos los bloques «?», cada nivel SHALL durar al menos 60 s y no más de
2 min. Yendo a toda velocidad sin pararse, ningún nivel SHALL poder cruzarse en menos de 30 s. La
duración estimada SHALL calcularse a partir de los datos del nivel y comprobarse en las pruebas.

#### Scenario: Estimación de cada nivel
- **WHEN** se calcula la duración estimada de los 6 niveles a partir de sus datos
- **THEN** cada uno queda entre 60 s y 120 s jugando con calma y por encima de 30 s yendo a tope

#### Scenario: Partida de prueba
- **WHEN** un adulto juega el nivel 1 en un móvil horizontal, parándose a golpear todos los bloques, y lo cronometra
- **THEN** tarda al menos 1 minuto en llegar a la bandera

#### Scenario: Ir a tope
- **WHEN** se juega un nivel con la flecha derecha siempre pulsada, saltando solo para subir escalones
- **THEN** se tardan al menos 30 s en llegar a la bandera

### Requirement: Más bloques en cada nivel
Cada nivel SHALL tener entre 12 y 20 bloques «?», repartidos a lo largo de todo el recorrido, y el
número de bloques SHALL no bajar de un nivel al siguiente.

#### Scenario: Recuento de bloques
- **WHEN** se cuentan los bloques «?» de los niveles 1 a 6
- **THEN** cada nivel tiene entre 12 y 20 y ninguno tiene menos que el anterior

#### Scenario: Sin tramos vacíos
- **WHEN** el zorro recorre cualquier nivel
- **THEN** nunca pasa más de 8 s corriendo a tope sin ver un bloque «?», una plataforma o un escalón

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
de la que se salta, sin saltos de precisión ni encadenar saltos en el aire. Ningún elemento SHALL poder
dejar al zorro atrapado sin poder seguir hacia la bandera o volver atrás.

#### Scenario: Alcanzar todos los bloques
- **WHEN** se comprueban los datos de los 6 niveles
- **THEN** cada bloque queda a una altura que la cabeza del zorro alcanza con un salto normal desde la superficie de debajo

#### Scenario: Nada atrapa
- **WHEN** el zorro está en cualquier punto del recorrido de cualquier nivel
- **THEN** puede llegar a la bandera solo corriendo a la derecha y saltando

### Requirement: Dificultad creciente
Los recorridos SHALL ser más exigentes según avanza el número del nivel: el nivel 1 SHALL ser llano,
con todos sus bloques al alcance desde el suelo y sin plataformas; a partir del nivel 2 SHALL aparecer
escalones, a partir del nivel 3 plataformas, y el nivel 6 SHALL ser el que más plataformas y escalones tenga.

#### Scenario: Primer nivel
- **WHEN** se abre el nivel 1
- **THEN** el suelo es llano, no hay plataformas y todos los bloques se alcanzan saltando desde el suelo

#### Scenario: Último nivel
- **WHEN** se abre el nivel 6
- **THEN** hay más plataformas y escalones que en cualquier otro nivel

### Requirement: Un ambiente distinto por nivel
Cada nivel SHALL tener su propio ambiente visual: 1 prado soleado, 2 campo de flores, 3 bosque, 4 otoño,
5 atardecer y 6 noche estrellada suave. El ambiente SHALL cambiar el cielo, las colinas, el color del
suelo y la decoración del fondo, y SHALL ser propio, dibujado en el estilo del juego.

#### Scenario: Ver los seis ambientes
- **WHEN** se abren los niveles 1 a 6 uno tras otro en un móvil horizontal
- **THEN** cada uno tiene un cielo, unas colinas, un suelo y una decoración de fondo diferentes y reconocibles

#### Scenario: Noche suave
- **WHEN** se abre el nivel 6
- **THEN** el cielo es azul de noche con estrellas y luna, sin nada oscuro o que dé miedo, y el zorro, los bloques y los enemigos se distinguen tan bien como de día

### Requirement: El ambiente no estorba el juego
En todos los ambientes, el zorro, los bloques «?», las plataformas, los escalones, los enemigos y la
bandera SHALL distinguirse a simple vista del fondo, y la decoración SHALL estar detrás del recorrido
sin parecer algo con lo que se pueda chocar o en lo que se pueda subir.

#### Scenario: Bloque en el atardecer
- **WHEN** se ve un bloque «?» sobre el cielo del atardecer en un móvil de 844×390
- **THEN** el bloque se distingue claramente del cielo

#### Scenario: Árbol del bosque
- **WHEN** el zorro pasa por delante de un árbol de la decoración del bosque
- **THEN** el árbol queda detrás del zorro, más apagado que el recorrido, y no lo frena
