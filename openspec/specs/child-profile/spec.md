# child-profile Specification

## Purpose
Identificar a cada niño en el dispositivo con un alias y una edad, derivar de ellos un id de perfil y guardar bajo ese id su progreso en el navegador, sin enviar ningún dato fuera.

## Requirements

### Requirement: Crear perfil con alias y edad
La aplicación SHALL permitir crear un perfil escribiendo un alias y eligiendo una edad. El alias SHALL escribirse con un teclado de letras grandes dibujado en el juego (de la A a la Z y la Ñ, con un botón de borrar), de 1 a 12 letras, y la edad SHALL elegirse entre botones con dígitos grandes, del 3 al 8. El botón de aceptar SHALL permanecer desactivado mientras falte el alias o la edad. Nada de la pantalla SHALL exigir leer palabras: los botones llevan letras sueltas, dígitos o dibujos.

#### Scenario: Escribir el alias
- **WHEN** el niño toca las letras L, U, C, I y A en el teclado de la pantalla
- **THEN** el alias muestra «LUCIA» en letras grandes y el botón de borrar quita la última letra

#### Scenario: Faltan datos
- **WHEN** el alias está vacío o no se ha elegido edad
- **THEN** el botón de aceptar aparece apagado y al tocarlo no ocurre nada

#### Scenario: Móvil horizontal
- **WHEN** se abre la pantalla de nuevo perfil en un móvil horizontal de 844×390
- **THEN** el alias, el teclado, las edades y el botón de aceptar caben a la vez y todos los botones tienen al menos 44 px de lado en pantalla

### Requirement: Consigna visual en la pantalla de nuevo perfil
La pantalla de nuevo perfil SHALL decir al niño qué hacer con dibujos y animación, sin palabras: un pictograma sobre el alias, otro sobre las edades y Lalo el búho con una flecha animada que señala el paso pendiente (alias, edad, aceptar). La consigna SHALL NOT depender de leer texto ni solo del color.

#### Scenario: Pantalla recién abierta
- **WHEN** se abre la pantalla de nuevo perfil
- **THEN** se ve el pictograma del lápiz sobre el alias y Lalo con una flecha animada apuntando al alias, sin ninguna palabra

#### Scenario: Pasar al siguiente paso
- **WHEN** el niño escribe la primera letra del alias
- **THEN** la flecha pasa a las edades, sobre las que se ve la tarta con velas

#### Scenario: Todo listo
- **WHEN** hay alias y edad
- **THEN** la flecha señala el botón de aceptar, que ya no aparece apagado

#### Scenario: Pictogramas
- **WHEN** se abre la pantalla de nuevo perfil
- **THEN** sobre el alias hay un lápiz con «Aa» y sobre las edades una tarta con velas

#### Scenario: Voz de Lalo
- **WHEN** existan las voces (fase 2) y el niño toque a Lalo
- **THEN** Lalo repite con su voz la consigna del paso actual; mientras no haya voces, solo repite su animación

#### Scenario: Cabe en el móvil
- **WHEN** se abre la pantalla en un móvil horizontal de 844×390
- **THEN** los pictogramas y Lalo se ven a la vez que el teclado, las edades y el botón de aceptar, sin tapar ninguno

### Requirement: Id del perfil
El id de un perfil SHALL derivarse del alias y la edad: el alias en minúsculas, sin tildes ni diéresis (la Ñ se conserva como `n`), seguido de un guion y la edad (por ejemplo, «LUCIA» con 5 años da `lucia-5`). Dos perfiles con el mismo alias y la misma edad SHALL ser el mismo perfil; si cambia el alias o la edad, el id es otro y empieza sin progreso.

#### Scenario: Mismo alias y edad
- **WHEN** se crea el perfil «LUCIA» de 5 años en un navegador donde ya existe ese perfil
- **THEN** no se crea uno nuevo: se abre el existente con su progreso

#### Scenario: Otra edad
- **WHEN** se crea «LUCIA» de 6 años habiendo un perfil «LUCIA» de 5
- **THEN** son dos perfiles distintos, cada uno con su propio progreso

### Requirement: Elegir perfil
Si el navegador ya tiene perfiles guardados, tras la pantalla de inicio el juego SHALL mostrar la lista de perfiles (el zorro con el gorro de ese niño, su alias y su edad), más un botón «+» para crear otro, y al tocar uno SHALL abrir el mapa con el progreso de ese perfil. Si no hay perfiles, SHALL abrir directamente la pantalla de nuevo perfil. El perfil usado por última vez SHALL aparecer el primero.

#### Scenario: Volver a jugar
- **WHEN** el niño abre la aplicación otro día en el mismo navegador y toca su perfil
- **THEN** el mapa muestra sus niveles hechos con sus estrellas, sus galletas y su gorro puesto

#### Scenario: Primera vez
- **WHEN** se abre la aplicación en un navegador sin perfiles y se toca la pantalla de inicio
- **THEN** aparece la pantalla de nuevo perfil

#### Scenario: Hermanos en el mismo dispositivo
- **WHEN** hay dos perfiles guardados
- **THEN** aparecen los dos en la lista y elegir uno no cambia ni mezcla el progreso del otro

### Requirement: Guardado automático del progreso
El juego SHALL guardar en el navegador, bajo el id del perfil activo, las estrellas de cada nivel, los niveles pendientes de perfiles antiguos, las galletas, los gorros comprados y el gorro puesto, sin que el niño pulse nada: al terminar la prueba de un nivel, al completar un nivel y al comprar o ponerse un gorro. Terminar un nivel con 0 estrellas SHALL guardar solo las galletas. Un perfil nuevo SHALL empezar sin niveles hechos ni pendientes, con 0 galletas y el gorro inicial. El progreso guardado antes de existir las pruebas SHALL conservarse: sus niveles hechos siguen hechos, y los pendientes guardados SHALL seguir pendientes.

#### Scenario: Cerrar y volver
- **WHEN** el niño completa el nivel 1 con 2 estrellas, cierra la pestaña y vuelve a abrir el juego con su perfil
- **THEN** el nivel 1 aparece hecho con 2 estrellas y el 2 es el actual

#### Scenario: Cero estrellas guardado
- **WHEN** el niño termina el nivel 1 con 0 estrellas tras recoger 2 galletas, cierra la pestaña y vuelve con su perfil
- **THEN** el nivel 1 sigue siendo el actual, el 2 está bloqueado y las 2 galletas siguen sumadas

#### Scenario: Pendiente antiguo
- **WHEN** se abre un perfil guardado con el nivel 1 pendiente
- **THEN** el nivel 1 aparece pendiente y el 2 está desbloqueado

#### Scenario: Progreso anterior a las pruebas
- **WHEN** un perfil guardado antes de este cambio tenía los niveles 1 y 2 hechos
- **THEN** al abrirlo, los niveles 1 y 2 siguen hechos con sus estrellas y el 3 es el actual

#### Scenario: Comprar un gorro
- **WHEN** el niño compra un gorro y recarga la página
- **THEN** al volver con su perfil sigue teniendo el gorro, puesto, y las galletas restantes

#### Scenario: Mejor puntuación
- **WHEN** el niño repite un nivel y saca menos estrellas que antes
- **THEN** se conserva la mejor puntuación guardada

### Requirement: Datos solo en el dispositivo y fallos tolerados
Los datos del perfil SHALL guardarse únicamente en el almacenamiento local del navegador y SHALL NOT enviarse a ningún servidor ni a terceros. Si el almacenamiento no está disponible, está lleno o contiene datos dañados, el juego SHALL seguir funcionando con normalidad sin mostrar errores ni mensajes, y un perfil dañado SHALL ignorarse sin impedir usar los demás.

#### Scenario: Navegación privada
- **WHEN** el almacenamiento del navegador está bloqueado
- **THEN** el niño puede crear un perfil y jugar con normalidad, aunque el progreso no se conserve al cerrar

#### Scenario: Datos dañados
- **WHEN** los datos guardados de un perfil no se pueden leer
- **THEN** ese perfil no aparece en la lista, los demás sí, y no se muestra ningún error

#### Scenario: Sin tráfico de red
- **WHEN** el niño crea un perfil y juega
- **THEN** el navegador no hace ninguna petición de red con el alias, la edad ni el progreso

### Requirement: Progreso guardado por mundo
El progreso de los niveles (estrellas y pendientes) SHALL guardarse por mundo, mientras que las galletas y los gorros SHALL ser del perfil y compartirse entre mundos. El progreso de un perfil guardado antes de haber varios mundos SHALL pasar entero al mundo de los números, con sus estrellas, sus pendientes y sus galletas. El progreso de un mundo que la aplicación no conoce SHALL conservarse al guardar.

#### Scenario: Perfil guardado con un solo mundo
- **WHEN** se abre un perfil guardado antes de este cambio con los niveles 1 y 2 hechos con 3 y 2 estrellas, el 3 pendiente y 14 galletas
- **THEN** en el mundo de los números los niveles 1 y 2 siguen hechos con 3 y 2 estrellas, el 3 pendiente, y el perfil tiene 14 galletas

#### Scenario: Galletas compartidas
- **WHEN** el niño gana 5 galletas en el río
- **THEN** el contador del mapa de los números también las suma

#### Scenario: Mundo desconocido
- **WHEN** se abre con una versión anterior de la aplicación un perfil que tiene progreso en un mundo que esa versión no conoce, y se guarda
- **THEN** el progreso de ese mundo sigue guardado
