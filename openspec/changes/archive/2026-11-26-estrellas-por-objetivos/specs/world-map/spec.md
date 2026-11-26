## MODIFIED Requirements

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
