## ADDED Requirements

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
