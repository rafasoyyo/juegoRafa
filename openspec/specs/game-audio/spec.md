# game-audio Specification

## Purpose
Dar al juego un hilo musical y efectos de sonido propios que acompañen y confirmen cada acción del
niño sin necesidad de leer, con un silencio total fácil de usar y sin recursos de terceros.

## Requirements

### Requirement: El audio empieza con el primer toque
El juego SHALL NOT emitir ningún sonido antes del primer toque en la pantalla de inicio. Con ese
toque SHALL quedar habilitado el audio, también en iOS, y empezar la música.

#### Scenario: Abrir la aplicación
- **WHEN** se abre la aplicación y aparece la pantalla de inicio
- **THEN** no suena nada

#### Scenario: Primer toque en iOS
- **WHEN** el niño toca la pantalla de inicio en un iPhone o iPad
- **THEN** empieza a sonar la música y, a partir de ahí, se oyen los efectos de sonido

### Requirement: Hilo musical por pantalla
El juego SHALL reproducir en bucle una melodía tranquila en el mapa y en mi personaje, y otra más
rápida y saltarina dentro del nivel. Al cambiar de una pantalla a otra con distinta melodía, la
anterior SHALL apagarse en un fundido y la nueva SHALL empezar sin cortes bruscos; entre pantallas
con la misma melodía, la música SHALL seguir sin reiniciarse.

#### Scenario: Del mapa al nivel
- **WHEN** el niño toca un nivel en el mapa
- **THEN** la melodía del mapa se apaga en un fundido y empieza la melodía del nivel

#### Scenario: Del mapa a mi personaje
- **WHEN** el niño va del mapa a mi personaje y vuelve
- **THEN** la misma melodía sigue sonando sin volver a empezar

#### Scenario: Nivel largo
- **WHEN** el niño pasa varios minutos dentro de un nivel
- **THEN** la melodía del nivel se repite en bucle sin silencios ni saltos audibles

### Requirement: Jingle de nivel completado
Al llegar a la bandera la música del nivel SHALL apagarse y SHALL sonar un jingle corto de victoria.
En la pantalla de nivel completado SHALL sonar un tintineo por cada estrella ganada, sincronizado con
su aparición y más agudo cada uno, y después SHALL volver la melodía del mapa.

#### Scenario: Llegar a la bandera
- **WHEN** el zorro toca la bandera
- **THEN** la música del nivel se apaga y suena el jingle de victoria

#### Scenario: Dos estrellas
- **WHEN** aparece la pantalla de nivel completado con 2 estrellas
- **THEN** suenan dos tintineos, uno al aparecer cada estrella, el segundo más agudo que el primero

### Requirement: Efectos de las acciones del zorro
El nivel SHALL tener un efecto de sonido propio para: saltar, golpear un bloque «?» y ganar su
galleta, y chocar con un enemigo. El sonido del choque SHALL ser un rebote suave y gracioso, nunca un
sonido de error, castigo o susto.

#### Scenario: Saltar
- **WHEN** el zorro salta
- **THEN** suena el efecto de salto una vez por salto

#### Scenario: Bloque con galleta
- **WHEN** el zorro golpea desde abajo un bloque «?» sin usar
- **THEN** suena el golpe del bloque seguido del tintineo de la galleta

#### Scenario: Bloque ya usado
- **WHEN** el zorro golpea un bloque ya usado
- **THEN** no suena el tintineo de la galleta

#### Scenario: Chocar con un enemigo
- **WHEN** el zorro toca un erizo o una abeja
- **THEN** suena un «boing» suave junto con el rebote

### Requirement: Efectos de los botones
Todo botón que responde a un toque SHALL sonar con un «pop» suave al pulsarlo. Tocar algo bloqueado
o no disponible (nivel con candado, mundo o categoría bloqueados, gorro sin galletas suficientes)
SHALL sonar con un «todavía no» amable mientras tiembla. Los botones de mover y saltar del nivel
SHALL NOT sonar al tocarlos.

#### Scenario: Botón normal
- **WHEN** el niño toca el botón de la casa en el nivel
- **THEN** suena el «pop» y se vuelve al mapa

#### Scenario: Nivel bloqueado
- **WHEN** el niño toca un nivel con candado
- **THEN** suena el «todavía no» mientras el candado tiembla

#### Scenario: Gorro sin galletas suficientes
- **WHEN** el niño toca un gorro que cuesta más galletas de las que tiene
- **THEN** suena el «todavía no» mientras la casilla tiembla

### Requirement: Efecto al conseguir un gorro
Comprar un gorro con galletas SHALL sonar con un efecto de premio, distinto del «pop» de ponerse un
gorro que ya se tiene.

#### Scenario: Comprar un gorro
- **WHEN** el niño compra un gorro con galletas suficientes
- **THEN** suena el efecto de premio y el zorro se lo pone

### Requirement: Silencio total recordado
El juego SHALL ofrecer un silencio total que calla a la vez la música y todos los efectos. La
elección SHALL recordarse en el dispositivo al recargar o reabrir la aplicación y SHALL NOT guardarse
fuera de él.

#### Scenario: Silenciar
- **WHEN** el niño o un adulto activa el silencio
- **THEN** dejan de oírse la música y los efectos de inmediato

#### Scenario: Reabrir en silencio
- **WHEN** se reabre la aplicación después de haberla dejado en silencio
- **THEN** el juego sigue en silencio también tras el primer toque

#### Scenario: Quitar el silencio
- **WHEN** se desactiva el silencio en el mapa
- **THEN** vuelve a sonar la melodía del mapa y los efectos

### Requirement: Silencio en segundo plano
Cuando la aplicación pasa a segundo plano o se bloquea la pantalla, el juego SHALL dejar de sonar, y
al volver SHALL retomar la música de la pantalla actual sin acumular notas atrasadas.

#### Scenario: Cambiar de app
- **WHEN** se cambia a otra aplicación con la música sonando y luego se vuelve al juego
- **THEN** mientras estaba fuera no sonaba nada y al volver la música sigue con normalidad

### Requirement: Volumen moderado y sonidos suaves
El volumen máximo del juego SHALL ser moderado, la música SHALL sonar por debajo de los efectos y
ningún sonido SHALL ser estridente, agudo en exceso ni con golpes bruscos de volumen.

#### Scenario: Efecto sobre la música
- **WHEN** suena un efecto mientras suena la música
- **THEN** el efecto se distingue claramente por encima de la música sin que el conjunto sature

### Requirement: Audio propio y sin archivos de terceros
Toda la música y los efectos SHALL generarse en el propio juego a partir de melodías y sonidos
compuestos para este proyecto, sin archivos de audio ni música de terceros. Si el navegador no puede
reproducir audio, el juego SHALL funcionar igual, en silencio y sin errores.

#### Scenario: Navegador sin audio
- **WHEN** se abre el juego en un navegador sin Web Audio
- **THEN** se puede jugar con normalidad, sin sonido y sin mensajes de error

#### Scenario: Sin conexión
- **WHEN** se abre la PWA instalada sin conexión
- **THEN** la música y los efectos suenan igual que con conexión
