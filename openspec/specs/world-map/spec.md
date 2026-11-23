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
El mapa SHALL mostrar 6 niveles unidos por un camino, numerados del 1 al 6 con dígitos grandes, el
último con una bandera, y cada uno en un estado: hecho (verde, con sus estrellas debajo), pendiente
(amarillo, con un globo de Lalo con un signo de interrogación y sin estrellas: se jugó pero no se
superó su prueba), actual (coral, más grande y con halo) o bloqueado (gris, con candado). Un nivel
SHALL estar desbloqueado si es el 1 o si el anterior está hecho o pendiente.

#### Scenario: Primera partida
- **WHEN** se abre el mapa sin ningún nivel completado
- **THEN** el nivel 1 está en estado actual y los niveles 2 a 6 están bloqueados

#### Scenario: Tras completar niveles
- **WHEN** el niño ha completado los niveles 1 y 2 con 3 y 2 estrellas
- **THEN** los niveles 1 y 2 aparecen hechos con 3 y 2 estrellas, el 3 es el actual y del 4 al 6 están bloqueados

#### Scenario: Prueba no superada
- **WHEN** el niño completó el nivel 1 y no superó la prueba del nivel 2
- **THEN** el nivel 1 aparece hecho, el 2 pendiente, el 3 es el actual y del 4 al 6 están bloqueados

#### Scenario: Pendiente superado más tarde
- **WHEN** el niño vuelve a jugar un nivel pendiente y supera su prueba con 2 estrellas
- **THEN** ese nivel pasa a hecho con 2 estrellas

### Requirement: El zorro marca el nivel actual
El mapa SHALL dibujar el zorro, con el gorro elegido, encima del nivel actual. El nivel actual SHALL ser el primero que no esté ni hecho ni pendiente; si todos están hechos o pendientes, el primer pendiente; y si todos están hechos, el zorro SHALL quedarse sobre el último.

#### Scenario: Zorro sobre el nivel actual
- **WHEN** el nivel actual es el 3
- **THEN** el zorro aparece sobre el nodo del nivel 3

#### Scenario: Solo quedan pendientes
- **WHEN** los 6 niveles se han jugado y el 4 es el único pendiente
- **THEN** el zorro aparece sobre el nivel 4

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
