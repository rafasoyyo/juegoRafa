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
El mapa SHALL mostrar abajo un selector con 4 mundos en este orden: números (`123`), el río (con un marco de diez como icono), formas y letras (`Aa`), con el mundo mostrado resaltado. Tocar un mundo abierto SHALL abrir su mapa. Tocar un mundo con candado o que aún no existe SHALL hacer que su botón tiemble sin cambiar el mapa. Formas y letras SHALL mostrarse como mundos que aún no existen.

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
