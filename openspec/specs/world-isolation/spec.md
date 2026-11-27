# world-isolation Specification

## Purpose

Fijar las reglas que permiten desarrollar y modificar cada mundo, y cada mecánica que trae, en paralelo y sin tocar el código de los demás mundos, y cómo se comprueban.

## Requirements

### Requirement: Cada mundo en su carpeta
Todo lo propio de un mundo (sus recorridos, su definición, sus reglas de diseño, su mapa, su apertura, su castillo y su historia) SHALL vivir en su carpeta de contenido y en su carpeta de definición. Dar de alta un mundo SHALL requerir, fuera de esas carpetas, solo una entrada en el registro de mundos. Cambiar un mundo SHALL NOT requerir editar las carpetas de otros mundos.

#### Scenario: Mundo nuevo
- **WHEN** se añade un mundo con sus recorridos y su definición
- **THEN** fuera de sus carpetas solo cambia una línea del registro de mundos (más las entradas de las mecánicas nuevas que traiga)

#### Scenario: Cambio en un mundo
- **WHEN** se cambian los niveles, el mapa o las reglas de un mundo
- **THEN** ningún archivo de otro mundo cambia y los demás mundos se juegan igual

### Requirement: El motor no distingue mundos
Fuera de las carpetas de los mundos y del registro de mundos, ningún código SHALL nombrar el identificador de un mundo ni importar su carpeta. Una definición MAY nombrar otro mundo solo como dato (por ejemplo, el mundo tras el que se abre). Lo que cambie de un mundo a otro SHALL ser un dato o una opción de su definición, con un nombre que describa qué hace (por ejemplo, «arcoíris del horizonte» o «río en el mapa»), no a qué mundo pertenece.

#### Scenario: Pieza propia de un mundo
- **WHEN** un mundo necesita algo que los demás no tienen (un adorno del mapa, un final, un castillo)
- **THEN** su definición lo activa como opción y el motor lo dibuja sin preguntar de qué mundo se trata

### Requirement: Mecánicas por registro
Cada tipo de reto del recorrido, de enemigo y de prueba de la bandera SHALL declararse en una sola entrada de su registro, con todo lo que el motor necesita de él. Las escenas SHALL NOT comparar tipos de reto, de enemigo o de prueba uno a uno: SHALL buscarlos en su registro. Si a un tipo le falta su entrada en algún registro, la compilación SHALL fallar.

#### Scenario: Reto nuevo
- **WHEN** se añade un tipo de reto con su lógica y su vista
- **THEN** se dan de alta en el registro de retos y ninguna escena cambia

#### Scenario: Entrada olvidada
- **WHEN** se añade un tipo de enemigo a la lista de tipos sin su entrada de dibujo
- **THEN** `npm run build` falla y señala el registro incompleto

#### Scenario: Dos mundos a la vez
- **WHEN** dos ramas añaden cada una un tipo de reto distinto
- **THEN** solo coinciden en las líneas de alta de los registros, que se fusionan conservando las dos entradas

### Requirement: Mundos en construcción
Un mundo SHALL poder marcarse en su propia definición como solo de desarrollo: con `npm run dev` se abre según sus reglas y en el juego publicado su botón del selector sigue temblando, sin poder entrar. Marcarlo o desmarcarlo SHALL NOT requerir editar archivos compartidos.

#### Scenario: Mundo a medias
- **WHEN** un mundo está marcado como solo de desarrollo
- **THEN** con `npm run dev` se puede jugar y en la versión publicada su botón tiembla al tocarlo

#### Scenario: Abrir el mundo
- **WHEN** el mundo se termina y se quita la marca de su definición
- **THEN** se abre en el juego publicado sin cambiar ningún otro archivo

### Requirement: Progreso por mundo
El progreso de cada mundo SHALL guardarse aparte. Añadir, cambiar o quitar un mundo SHALL NOT cambiar las estrellas ni el nivel actual de los demás, y el progreso de un mundo que la versión instalada no conoce SHALL conservarse al guardar.

#### Scenario: Mundo de otra rama
- **WHEN** un perfil tiene progreso en un mundo que esta versión no tiene y se juega y se guarda
- **THEN** ese progreso sigue guardado y los demás mundos no cambian

### Requirement: Comprobación automática
`npm test` SHALL fallar si fuera de las carpetas de los mundos y del registro aparece el identificador de un mundo o se importa su carpeta, o si una escena compara tipos de reto, de enemigo o de prueba uno a uno. Todos los mundos registrados SHALL pasar las mismas comprobaciones de contenido con las reglas de su propia definición.

#### Scenario: Atajo en el motor
- **WHEN** alguien escribe en una escena una comparación con el identificador de un mundo o con un tipo de reto concreto
- **THEN** `npm test` falla y dice en qué archivo
