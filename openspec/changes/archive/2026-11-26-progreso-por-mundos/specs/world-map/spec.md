## MODIFIED Requirements

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

## ADDED Requirements

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
Un mundo en construcción SHALL estar detrás de un interruptor que solo se activa en desarrollo. Con el interruptor apagado, como en el juego publicado, el mundo SHALL mostrarse en el selector como un mundo que aún no existe, sin candado, y SHALL NOT abrirse para ningún perfil. El río SHALL estar detrás del interruptor `mundo-2-rio` hasta que su contenido esté terminado.

#### Scenario: Juego publicado
- **WHEN** un perfil de 8 años toca el río en el juego publicado
- **THEN** el botón tiembla como formas y `Aa`, y el mapa no cambia

#### Scenario: En desarrollo
- **WHEN** un perfil de 6 años toca el río con `npm run dev`
- **THEN** se abre el mapa del río

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
