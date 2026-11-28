# world-map Specification

## Purpose
Dar al niño un punto de partida visual desde el que ve su avance en el mundo, elige qué nivel jugar y
entra a personalizar su zorro, sin tener que leer nada.

## Requirements

### Requirement: Pantalla de inicio
Al abrir la aplicación el juego SHALL mostrar una pantalla con el zorro y un botón grande de jugar, y
SHALL pasar al primer toque en cualquier punto de la pantalla a la pantalla de perfil (elegir o crear
el perfil del niño); una vez elegido o creado el perfil, SHALL abrir el mapa con su progreso.

#### Scenario: Primer toque
- **WHEN** el niño toca la pantalla de inicio
- **THEN** se abre la pantalla de perfil y, desde ese momento, el juego puede reproducir sonido también en iOS

#### Scenario: Del perfil al mapa
- **WHEN** el niño elige un perfil guardado o acepta uno nuevo
- **THEN** se abre el mapa del mundo con el progreso de ese perfil

### Requirement: Niveles del mundo en un camino
El mapa SHALL mostrar 12 niveles unidos por un camino, numerados del 1 al 12 con dígitos grandes, el
último con una bandera, y cada uno en un estado: hecho (verde, con sus estrellas debajo), pendiente
(amarillo, con un globo de Lalo con un signo de interrogación y sin estrellas: solo en perfiles
guardados antes de las estrellas por objetivos, cuando se jugó pero no se superó su prueba), actual
(coral, más grande y con halo) o bloqueado (gris, con candado). Un nivel SHALL estar desbloqueado si es
el 1 o si el anterior está hecho o pendiente. Jugar un nivel y terminarlo con 0 estrellas SHALL NOT
cambiar su estado.

#### Scenario: Primera partida
- **WHEN** se abre el mapa sin ningún nivel completado
- **THEN** el nivel 1 está en estado actual y los niveles 2 a 12 están bloqueados

#### Scenario: Tras completar niveles
- **WHEN** el niño ha completado los niveles 1 y 2 con 3 y 2 estrellas
- **THEN** los niveles 1 y 2 aparecen hechos con 3 y 2 estrellas, el 3 es el actual y del 4 al 12 están bloqueados

#### Scenario: Nivel sin estrellas
- **WHEN** el niño completó el nivel 1 y terminó el nivel 2 con 0 estrellas
- **THEN** el nivel 1 aparece hecho, el 2 es el actual y del 3 al 12 están bloqueados

#### Scenario: Pendiente antiguo superado más tarde
- **WHEN** el niño vuelve a jugar un nivel pendiente de un perfil antiguo y lo termina con 2 estrellas
- **THEN** ese nivel pasa a hecho con 2 estrellas

#### Scenario: Del seis al siete
- **WHEN** el niño ha completado los niveles 1 a 6
- **THEN** el 7 es el actual y del 8 al 12 están bloqueados

#### Scenario: Perfil guardado antes de los nuevos niveles
- **WHEN** se abre un perfil guardado cuando el mundo tenía 6 niveles, con los 6 hechos
- **THEN** los niveles 1 a 6 siguen hechos con sus estrellas, el 7 es el actual y del 8 al 12 están bloqueados

### Requirement: El zorro marca el nivel actual
El mapa SHALL dibujar el zorro, con el gorro elegido, encima del nivel actual. El nivel actual SHALL ser el primero que no esté ni hecho ni pendiente; si todos están hechos o pendientes, el primer pendiente; y si todos están hechos, el zorro SHALL quedarse sobre el último.

#### Scenario: Zorro sobre el nivel actual
- **WHEN** el nivel actual es el 3
- **THEN** el zorro aparece sobre el nodo del nivel 3

#### Scenario: Solo quedan pendientes
- **WHEN** los 12 niveles se han jugado y el 4 es el único pendiente
- **THEN** el zorro aparece sobre el nivel 4

#### Scenario: Mundo terminado
- **WHEN** los 12 niveles están hechos
- **THEN** el zorro aparece sobre el nivel 12

### Requirement: Elegir nivel
Tocar un nivel hecho, pendiente o el actual SHALL abrir ese nivel. Tocar un nivel bloqueado SHALL NOT abrir nada
y SHALL hacer que el candado tiemble.

#### Scenario: Jugar el nivel actual
- **WHEN** el niño toca el nivel actual
- **THEN** se abre el nivel con una transición suave

#### Scenario: Jugar un nivel pendiente
- **WHEN** el niño toca un nivel pendiente
- **THEN** se abre ese nivel con una transición suave

#### Scenario: Nivel bloqueado
- **WHEN** el niño toca un nivel bloqueado
- **THEN** el candado tiembla y el mapa sigue abierto

### Requirement: Selector de mundos
El mapa SHALL mostrar abajo un selector con 4 mundos en este orden: números (`123`), el río (con un marco de diez como icono), formas y letras (`Aa`), con el mundo mostrado resaltado. Tocar un mundo abierto SHALL abrir su mapa. Tocar un mundo con candado o que aún no existe SHALL hacer que su botón tiemble sin cambiar el mapa. Letras SHALL mostrarse como un mundo que aún no existe; formas, también, mientras su interruptor de desarrollo esté apagado (ver «La isla en construcción»).

#### Scenario: Orden del selector
- **WHEN** se abre el mapa en un móvil horizontal de 844×390
- **THEN** abajo se ven, de izquierda a derecha, `123`, el marco de diez, las formas y `Aa`, sin tapar las estrellas de los niveles

#### Scenario: Mundo no disponible
- **WHEN** el niño toca formas o `Aa`
- **THEN** el botón tiembla y el mapa no cambia

#### Scenario: Cambiar de mundo
- **WHEN** el río está abierto y el niño lo toca desde el mapa de los números
- **THEN** se abre el mapa del río con una transición suave y el botón del río queda resaltado

### Requirement: Galletas y acceso a mi personaje
El mapa SHALL mostrar el contador de galletas con el icono de la galleta con pepitas de chocolate y un
botón con la cara del zorro que abre la pantalla de mi personaje.

#### Scenario: Ir a mi personaje
- **WHEN** el niño toca el botón con la cara del zorro
- **THEN** se abre la pantalla de mi personaje

#### Scenario: Ver las galletas
- **WHEN** el niño abre el mapa con 9 galletas
- **THEN** arriba se ve una galleta con pepitas de chocolate junto al número 9

### Requirement: Progreso solo durante la sesión
El progreso, las galletas y los gorros SHALL mantenerse mientras la aplicación siga abierta y MAY
perderse al recargarla.

#### Scenario: Recarga
- **WHEN** se recarga la aplicación tras completar niveles
- **THEN** el mapa vuelve al estado de primera partida, con 0 galletas

### Requirement: Mapa que se desplaza
El camino de 12 niveles SHALL ser más ancho que la pantalla y desplazarse en horizontal, arrastrando con el dedo o tocando las flechas grandes de los lados, que solo se ven si queda camino por ese lado. Arrastrar SHALL NOT abrir un nivel. El contador de galletas, Lalo, el botón de mi personaje y el selector de mundos SHALL quedarse fijos.

#### Scenario: Arrastrar
- **WHEN** el niño arrastra el mapa hacia la izquierda en un móvil horizontal de 844×390
- **THEN** el camino se desplaza y aparecen los niveles siguientes, y el contador, Lalo, el botón del zorro y el selector no se mueven

#### Scenario: Arrastrar empezando sobre un nivel
- **WHEN** el niño apoya el dedo sobre un nivel desbloqueado y arrastra el mapa
- **THEN** el mapa se desplaza y no se abre ese nivel

#### Scenario: Flechas
- **WHEN** el mapa muestra el principio del camino y el niño toca la flecha de la derecha
- **THEN** el mapa se desplaza con suavidad hacia los niveles siguientes, y la flecha de la izquierda aparece

#### Scenario: Final del camino
- **WHEN** el mapa muestra el nivel 12 al final del camino
- **THEN** no se ve la flecha de la derecha y el camino no se desplaza más allá

### Requirement: El mapa se abre en el nivel actual
Al abrirse, el mapa SHALL mostrar centrado, o lo más centrado posible, el nivel actual con el zorro encima, sin que el niño tenga que buscarlo.

#### Scenario: Volver de un nivel avanzado
- **WHEN** el nivel actual es el 9 y se abre el mapa
- **THEN** el nivel 9 y el zorro se ven sin desplazar el mapa, con los niveles vecinos a los lados

#### Scenario: Primera partida
- **WHEN** se abre el mapa sin ningún nivel completado
- **THEN** se ve el principio del camino con el nivel 1 y el zorro encima

### Requirement: El río se abre según la edad
El mundo del río SHALL estar abierto desde el principio para perfiles de 6 años o más. Para perfiles de 3 a 5 años SHALL mostrarse con candado hasta que el nivel 12 del mundo de los números esté hecho o pendiente. Un mundo con candado SHALL NOT abrirse.

#### Scenario: Perfil de 6 años
- **WHEN** un perfil de 6 años sin progreso abre el mapa
- **THEN** el botón del río no tiene candado y al tocarlo se abre su mapa

#### Scenario: Perfil de 5 años
- **WHEN** un perfil de 5 años que aún no ha llegado al nivel 12 del mundo de los números toca el río
- **THEN** el botón del río, con un candado, tiembla y el mapa no cambia

#### Scenario: Perfil de 5 años al acabar el mundo 1
- **WHEN** un perfil de 5 años juega el nivel 12 del mundo de los números y no supera su prueba
- **THEN** el río queda abierto, aunque ese nivel siga pendiente

### Requirement: Mundos en desarrollo
Un mundo en construcción SHALL estar detrás de un interruptor que solo se activa en desarrollo. Con el interruptor apagado, como en el juego publicado, el mundo SHALL mostrarse en el selector como un mundo que aún no existe, sin candado, y SHALL NOT abrirse para ningún perfil. El río SHALL NOT depender de ningún interruptor: está terminado y se abre en el juego publicado según la edad y el progreso.

#### Scenario: Juego publicado
- **WHEN** un perfil de 6 años toca el río en el juego publicado
- **THEN** se abre el mapa del río

#### Scenario: En desarrollo
- **WHEN** un mundo tiene el interruptor apagado (como en el juego publicado) y un perfil de 8 años lo toca
- **THEN** el botón tiembla como formas y `Aa`, y el mapa no cambia

### Requirement: Mapa de cada mundo
Cada mundo SHALL tener su propio mapa, con su camino, sus adornos y sus niveles, y el mapa SHALL abrirse en el último mundo que se jugó en la sesión si sigue abierto para el perfil; si no, en el mundo de los números.

#### Scenario: Volver de un nivel del río
- **WHEN** el niño termina un nivel del río
- **THEN** vuelve al mapa del río, no al de los números

#### Scenario: Cambiar a un perfil sin el río
- **WHEN** se ha jugado el río con un perfil de 7 años y luego se elige un perfil de 4 años que no ha acabado el mundo 1
- **THEN** el mapa se abre en el mundo de los números

### Requirement: El zorro recuerda el nivel de cada mundo
El estado de los niveles (hecho, pendiente, actual o bloqueado) y la posición del zorro SHALL calcularse con el progreso de cada mundo por separado: avanzar en un mundo SHALL NOT cambiar los niveles ni el zorro de otro.

#### Scenario: Dos mundos empezados
- **WHEN** el niño tiene hechos los niveles 1 a 5 del mundo de los números y el 1 del río
- **THEN** en el mapa de los números el zorro está sobre el 6 y en el del río sobre el 2

### Requirement: Nodo del castillo
Si el mundo tiene castillo, el mapa SHALL mostrarlo como parada propia tras el último nivel, unida a él por el camino. El castillo SHALL estar cerrado (con candado, y tiembla al tocarlo) hasta que el último nivel esté hecho o pendiente; abierto, SHALL abrirse al tocarlo y se SHALL poder repetir. Con la medalla ganada, SHALL verse verde y con la medalla al lado. Cuando no quede ningún nivel por jugar, el zorro SHALL esperar en el castillo.

#### Scenario: Castillo cerrado
- **WHEN** el último nivel del río no se ha jugado y el niño toca el castillo
- **THEN** el castillo tiembla y no se abre

#### Scenario: Castillo abierto
- **WHEN** el último nivel del río está hecho y el niño toca el castillo
- **THEN** empieza el recorrido del castillo

#### Scenario: Castillo terminado
- **WHEN** el niño ha ganado la medalla del río y vuelve al mapa
- **THEN** el castillo se ve verde con la medalla al lado y se puede volver a jugar

### Requirement: Medalla en el selector
El botón de un mundo en el selector SHALL mostrar su medalla en una esquina cuando se ha ganado, sin tapar el icono del mundo.

#### Scenario: Medalla del río
- **WHEN** el niño ha ganado la medalla del río y abre cualquier mapa
- **THEN** el botón del río muestra la medalla en su esquina

### Requirement: Mapa del río
El mapa del río SHALL tener dos pantallas con los 12 niveles y el castillo, y un río que baja junto al camino desde el manantial, al principio, hasta la desembocadura, junto al castillo.

#### Scenario: El río acompaña al camino
- **WHEN** se abre el mapa del río a 844×390 y se desplaza hasta el final
- **THEN** el río pasa bajo todas las paradas y el castillo queda tras el nivel 12, sin que el selector tape las estrellas

### Requirement: Madriguera y camino que sube
El mapa del mundo de los números SHALL empezar a la izquierda en una madriguera en la colina, junto al nivel 1, desde la que sale el camino. El camino SHALL subir hacia la derecha en conjunto, con un tramo bajo junto al mar en el nivel 7, sin que el selector de mundos tape ningún nivel ni sus estrellas.

#### Scenario: Principio del camino
- **WHEN** se abre el mapa del mundo de los números con un perfil nuevo a 844×390
- **THEN** se ve la madriguera a la izquierda del nivel 1, con el zorro encima del nivel 1

#### Scenario: Selector y niveles
- **WHEN** se desplaza el mapa de principio a fin a 844×390
- **THEN** ningún nivel ni sus estrellas quedan tapados por el selector de mundos

### Requirement: Cielo del viaje
El cielo del mapa del mundo de los números SHALL cambiar a lo ancho, siguiendo el viaje: de día sobre los niveles 1 a 4, de atardecer sobre el 5, de noche con luna y estrellas sobre el 6, de amanecer sobre la playa del 7 y lila sobre las nubes del 12. El cielo SHALL desplazarse con el camino.

#### Scenario: Noche y amanecer
- **WHEN** el niño desplaza el mapa hasta los niveles 6 y 7
- **THEN** sobre el 6 el cielo es de noche, con luna y estrellas, y sobre el 7 amanece

#### Scenario: Final en las nubes
- **WHEN** el mapa muestra el nivel 12
- **THEN** el cielo sobre él es lila

### Requirement: Arco de 12 gajos
El mapa del mundo de los números SHALL mostrar sobre los últimos niveles un arcoíris de 12 gajos, uno por nivel, ordenados de izquierda a derecha (el primero es el nivel 1). El gajo de un nivel SHALL estar pintado con sus 6 bandas si el nivel está hecho o pendiente, y SHALL verse como una silueta clara si no. Terminar un nivel con 0 estrellas SHALL NOT pintar su gajo. Ni el selector de mundos ni ningún nivel SHALL tapar los gajos.

#### Scenario: Perfil nuevo
- **WHEN** se abre el mapa con un perfil sin ningún nivel completado
- **THEN** los 12 gajos se ven como siluetas sin pintar

#### Scenario: Mundo terminado
- **WHEN** los 12 niveles están hechos
- **THEN** los 12 gajos están pintados

#### Scenario: Un nivel pendiente cuenta
- **WHEN** los niveles 1 a 3 están hechos y el 4 está pendiente
- **THEN** los gajos 1 a 4 están pintados y del 5 al 12 no

#### Scenario: Nivel sin estrellas
- **WHEN** el nivel 1 está hecho y el niño termina el nivel 2 con 0 estrellas
- **THEN** solo el gajo 1 está pintado

#### Scenario: Gajos a la vista
- **WHEN** el mapa muestra el final del camino a 844×390
- **THEN** los 12 gajos se ven enteros, sin que el selector ni los niveles los tapen

### Requirement: El gajo nuevo se pinta delante del niño
Al abrirse el mapa con un gajo pintado que el niño aún no ha visto pintarse en esta sesión con ese perfil, el mapa SHALL desplazarse hasta el arco, colorear ese gajo banda a banda, de fuera adentro, con unos destellos, volver al zorro y hacer que el zorro salte desde el nivel terminado hasta el actual. Los gajos ya pintados la primera vez que se abre el mapa con un perfil en la sesión SHALL verse pintados sin animación.

#### Scenario: Primer nivel terminado
- **WHEN** un perfil nuevo termina el nivel 1 con estrellas y vuelve al mapa
- **THEN** el mapa va hasta el arco, el gajo 1 se colorea banda a banda, vuelve al principio y el zorro salta del nivel 1 al 2

#### Scenario: Repetir un nivel hecho
- **WHEN** el niño vuelve a jugar el nivel 1, ya hecho, y vuelve al mapa
- **THEN** no hay animación del gajo y el zorro está sobre el nivel actual

#### Scenario: Perfil abierto con progreso
- **WHEN** se abre en una sesión nueva un perfil con los niveles 1 a 5 hechos
- **THEN** los gajos 1 a 5 se ven pintados sin animación

#### Scenario: Varios niveles seguidos
- **WHEN** el niño termina los niveles 3 y 4 pasando de uno a otro sin volver al mapa, y luego vuelve
- **THEN** se pintan los gajos 3 y 4, uno detrás de otro, y el zorro salta del nivel 4 al 5

### Requirement: Saltar la animación del gajo
Un toque en la pantalla durante la animación del gajo nuevo SHALL acabarla al instante, con el gajo pintado y el zorro sobre el nivel actual, y SHALL NOT abrir ningún nivel.

#### Scenario: Saltar la animación
- **WHEN** el niño toca la pantalla mientras se pinta el gajo nuevo
- **THEN** el gajo queda pintado, el mapa muestra el zorro sobre el nivel actual y no se abre ningún nivel

### Requirement: La madriguera repite el prólogo
En el mapa del mundo de los números, tocar la madriguera SHALL abrir el nivel 1 empezando por el prólogo, aunque ya se haya visto. Arrastrar el mapa empezando sobre la madriguera SHALL NOT abrir nada.

#### Scenario: Volver a verlo
- **WHEN** el niño toca la madriguera del mapa
- **THEN** se abre el nivel 1 con el prólogo

#### Scenario: Arrastrar
- **WHEN** el niño apoya el dedo en la madriguera y arrastra el mapa
- **THEN** el mapa se desplaza y no se abre el nivel

### Requirement: Final del arcoíris
Al abrirse el mapa del mundo de los números con sus 12 niveles hechos o pendientes, si el perfil no ha visto el final, el mapa SHALL mostrarlo, sin texto y después de pintarse el gajo 12 si es nuevo: Rufo salta de alegría sobre el nivel 12, la nube de la cima llueve sobre la montaña nevada y una gota baja al manantial, del que nace el río. El final SHALL verse una sola vez por perfil y quedar guardado.

#### Scenario: Terminar el nivel 12
- **WHEN** un perfil termina el nivel 12 por primera vez y vuelve al mapa
- **THEN** se pinta el gajo 12 y después se ve la lluvia sobre la montaña y el nacimiento del río

#### Scenario: No se repite
- **WHEN** el perfil vuelve al mapa otra vez, o tras recargar la aplicación
- **THEN** no se ve el final

### Requirement: El río se abre en el final
Para un perfil de menos de 6 años, al acabar el final el botón del río SHALL perder su candado con una animación y quedar abierto. Para un perfil de 6 años o más, el final SHALL verse sin animación del botón, porque el río ya estaba abierto.

#### Scenario: Perfil de 5 años
- **WHEN** un perfil de 5 años ve el final
- **THEN** el botón del río empieza con candado y, al acabar el final, el candado salta y el botón queda abierto

#### Scenario: Perfil de 6 años
- **WHEN** un perfil de 6 años ve el final
- **THEN** ve la lluvia y el manantial y el botón del río no cambia

### Requirement: Saltar el final
Un toque en la pantalla durante el final SHALL acabarlo al instante, con el río abierto si le corresponde, sin abrir ningún nivel ni otro mundo.

#### Scenario: Toque
- **WHEN** el niño toca la pantalla durante la lluvia
- **THEN** el final acaba, el mapa queda como siempre y el río abierto, y no se abre nada

### Requirement: Castillo en el mapa del arcoíris
El mapa del mundo 1 SHALL mostrar el castillo como parada tras el nivel 12, sobre una nube al pie del arcoíris, dentro de la segunda pantalla y sin que el selector lo tape.

#### Scenario: Castillo al pie del arcoíris
- **WHEN** se abre el mapa del mundo 1 a 844×390 y se desplaza hasta el final
- **THEN** el castillo queda a la derecha del nivel 12, sobre una nube, unido a él por el camino

### Requirement: Medalla en el botón 123
Con la medalla del arcoíris ganada, el botón 123 del selector SHALL mostrarla en su esquina.

#### Scenario: Medalla del arcoíris en el selector
- **WHEN** el niño ha ganado la medalla del arcoíris y abre cualquier mapa
- **THEN** el botón 123 muestra la medalla en su esquina

### Requirement: La isla en construcción
El tercer botón del selector (formas) SHALL abrir el mundo 3, «La isla de los dinosaurios», también en el juego publicado, sin depender de ningún interruptor: con 7 años o más, o al llegar al nivel 12 del río, y con candado en otro caso.

#### Scenario: Juego publicado
- **WHEN** un niño de 8 años toca el botón de formas en el juego publicado
- **THEN** se abre el mapa de la isla

#### Scenario: Con 6 años
- **WHEN** un perfil de 6 años que no ha llegado al nivel 12 del río toca el botón de formas
- **THEN** el botón tiembla con candado

### Requirement: Huevo de manchas de la isla
El mapa de la isla SHALL mostrar arriba un huevo con 12 manchas, una por nivel, que siguen un patrón (por filas de abajo arriba y con los colores en serie). La mancha de un nivel SHALL estar pintada cuando el nivel está hecho o pendiente. Al volver al mapa con una mancha nueva, la cámara SHALL ir al huevo, la mancha SHALL aparecer creciendo con una nota y destellos y después Rufo SHALL saltar al nivel siguiente; un toque SHALL acabar la animación. Abrir un perfil con progreso SHALL NOT animar manchas ya pintadas.

#### Scenario: Mancha nueva
- **WHEN** el niño termina el nivel 3 de la isla con estrellas y vuelve al mapa
- **THEN** la tercera mancha del huevo aparece creciendo y Rufo salta al nivel 4

### Requirement: Final de la isla
Al volver al mapa con todos los niveles de la isla hechos o pendientes, una vez por perfil, Rufo SHALL saltar de alegría y SHALL verse una viñeta sin texto: el huevo con sus 12 manchas en el nido del cráter, la mamá dinosaurio que se asoma, el huevo que se mueve, se raja y se abre, y un bebé que da un saltito. Un toque SHALL saltarla. Mientras no exista el mundo 4, el final SHALL acabar ahí.

#### Scenario: Se ve una vez
- **WHEN** un perfil que ya vio el final de la isla vuelve a abrir su mapa
- **THEN** el mapa se abre sin la viñeta

### Requirement: Medalla de la huella en el mapa
El mapa de la isla SHALL mostrar el castillo como la parada siguiente a su último nivel y, ganada su medalla, la medalla de la huella junto a él y en la esquina del botón de formas del selector.

#### Scenario: Medalla en el selector
- **WHEN** un perfil gana el castillo de la isla y vuelve al mapa
- **THEN** el botón de formas del selector lleva la medalla de la huella

### Requirement: Mapa del volcán
El mapa de la isla SHALL tener dos pantallas en las que el camino sube de la playa negra al gran volcán, con el paisaje de cada tramo, el huevo de 12 manchas encima de los niveles del medio sin que ningún nodo lo tape, y el castillo dibujado como el nido del cráter en la cima del volcán. El nido SHALL verse también al final del recorrido del castillo y en su prueba.

#### Scenario: El nido en el cráter
- **WHEN** se abre el mapa de la isla a 844×390 y se desplaza hasta el final
- **THEN** el nido queda sobre el cráter, tras el nivel 12, sin que el selector tape las estrellas
