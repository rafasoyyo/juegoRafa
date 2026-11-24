# Spec Delta

## MODIFIED Requirements

### Requirement: Niveles del mundo en un camino
El mapa SHALL mostrar 12 niveles unidos por un camino, numerados del 1 al 12 con dígitos grandes, el
último con una bandera, y cada uno en un estado: hecho (verde, con sus estrellas debajo), pendiente
(amarillo, con un globo de Lalo con un signo de interrogación y sin estrellas: se jugó pero no se
superó su prueba), actual (coral, más grande y con halo) o bloqueado (gris, con candado). Un nivel
SHALL estar desbloqueado si es el 1 o si el anterior está hecho o pendiente.

#### Scenario: Primera partida
- **WHEN** se abre el mapa sin ningún nivel completado
- **THEN** el nivel 1 está en estado actual y los niveles 2 a 12 están bloqueados

#### Scenario: Tras completar niveles
- **WHEN** el niño ha completado los niveles 1 y 2 con 3 y 2 estrellas
- **THEN** los niveles 1 y 2 aparecen hechos con 3 y 2 estrellas, el 3 es el actual y del 4 al 12 están bloqueados

#### Scenario: Prueba no superada
- **WHEN** el niño completó el nivel 1 y no superó la prueba del nivel 2
- **THEN** el nivel 1 aparece hecho, el 2 pendiente, el 3 es el actual y del 4 al 12 están bloqueados

#### Scenario: Pendiente superado más tarde
- **WHEN** el niño vuelve a jugar un nivel pendiente y supera su prueba con 2 estrellas
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

## ADDED Requirements

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
