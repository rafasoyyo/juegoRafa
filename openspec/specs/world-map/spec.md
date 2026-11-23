# world-map Specification

## Purpose
Dar al niño un punto de partida visual desde el que ve su avance en el mundo, elige qué nivel jugar y
entra a personalizar su zorro, sin tener que leer nada.

## Requirements

### Requirement: Pantalla de inicio
Al abrir la aplicación el juego SHALL mostrar una pantalla con el zorro y un botón grande de jugar, y
SHALL ir al mapa al primer toque en cualquier punto de la pantalla.

#### Scenario: Primer toque
- **WHEN** el niño toca la pantalla de inicio
- **THEN** se abre el mapa del mundo y, desde ese momento, el juego puede reproducir sonido también en iOS

### Requirement: Niveles del mundo en un camino
El mapa SHALL mostrar 6 niveles unidos por un camino, numerados del 1 al 6 con dígitos grandes, el
último con una bandera, y cada uno en un estado: hecho (verde, con sus estrellas debajo), actual
(coral, más grande y con halo) o bloqueado (gris, con candado).

#### Scenario: Primera partida
- **WHEN** se abre el mapa sin ningún nivel completado
- **THEN** el nivel 1 está en estado actual y los niveles 2 a 6 están bloqueados

#### Scenario: Tras completar niveles
- **WHEN** el niño ha completado los niveles 1 y 2 con 3 y 2 estrellas
- **THEN** los niveles 1 y 2 aparecen hechos con 3 y 2 estrellas, el 3 es el actual y del 4 al 6 están bloqueados

### Requirement: El zorro marca el nivel actual
El mapa SHALL dibujar el zorro, con el gorro elegido, encima del nivel actual.

#### Scenario: Zorro sobre el nivel actual
- **WHEN** el nivel actual es el 3
- **THEN** el zorro aparece sobre el nodo del nivel 3

### Requirement: Elegir nivel
Tocar un nivel hecho o el actual SHALL abrir ese nivel. Tocar un nivel bloqueado SHALL NOT abrir nada
y SHALL hacer que el candado tiemble.

#### Scenario: Jugar el nivel actual
- **WHEN** el niño toca el nivel actual
- **THEN** se abre el nivel con una transición suave

#### Scenario: Nivel bloqueado
- **WHEN** el niño toca un nivel bloqueado
- **THEN** el candado tiembla y el mapa sigue abierto

### Requirement: Selector de mundos
El mapa SHALL mostrar abajo un selector con los 4 mundos (números `123`, letras `Aa`, formas y uno
bloqueado). Solo el mundo de los números SHALL estar disponible; los demás SHALL mostrarse bloqueados.

#### Scenario: Mundo no disponible
- **WHEN** el niño toca un mundo que no es el de los números
- **THEN** el botón tiembla y el mapa no cambia

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

### Requirement: Botón de silencio en el mapa
La barra superior del mapa SHALL mostrar, a la izquierda del botón de mi personaje, un botón redondo
del mismo tamaño con el icono del altavoz. Tocarlo SHALL alternar el silencio total: en silencio el
icono SHALL verse como altavoz tachado, sin depender solo del color.

#### Scenario: Activar el silencio
- **WHEN** el niño toca el botón del altavoz con el sonido activo
- **THEN** el juego se calla y el icono pasa a altavoz tachado

#### Scenario: Volver a activar el sonido
- **WHEN** el niño toca el botón del altavoz tachado
- **THEN** vuelve a sonar la música del mapa y el icono pasa a altavoz normal

#### Scenario: Pantalla estrecha
- **WHEN** el mapa se abre en un móvil horizontal de proporción 4:3
- **THEN** el botón del altavoz se ve completo, con zona táctil de al menos 96 px, sin tapar el contador de galletas ni el camino de niveles
