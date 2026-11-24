# power-fruit Specification

## Purpose

Esconder en cada nivel una fresa dentro de un bloque «?». Al comerla, Rufo entra en un modo
invencible de unos segundos en el que los enemigos no le pinchan ni le quitan galletas.

## Requirements

### Requirement: Un bloque con fruta por nivel
Al entrar en un nivel, también al repetirlo, el juego SHALL elegir al azar exactamente uno de sus
bloques «?» para esconder la fresa. Ese bloque SHALL verse igual que los demás hasta que se golpea.

#### Scenario: Una sola fruta
- **WHEN** el niño golpea todos los bloques «?» de un nivel
- **THEN** exactamente uno de ellos suelta una fresa

#### Scenario: Sorpresa
- **WHEN** se abre un nivel en un móvil horizontal de 844×390
- **THEN** ningún bloque «?» se distingue de los demás a simple vista

#### Scenario: Repetir un nivel
- **WHEN** el niño juega el mismo nivel varias veces
- **THEN** la fresa no sale siempre del mismo bloque

### Requirement: La fruta sale del bloque
Golpear desde abajo el bloque con fruta SHALL activarlo como cualquier bloque «?», con su galleta y su
suma al contador. Además, SHALL soltar una fresa que salta hacia arriba, cae al suelo, al escalón o a
la plataforma que hay junto al bloque y se queda quieta allí, dando botecitos, hasta que Rufo la coja.
La fresa SHALL NOT posarse nunca sobre una zona de pinchos.

#### Scenario: Golpear el bloque con fruta
- **WHEN** el niño golpea desde abajo el bloque que esconde la fresa
- **THEN** sale la galleta, el contador sube en uno, y la fresa salta y se posa junto al bloque

#### Scenario: Fruta al alcance
- **WHEN** la fresa se ha posado
- **THEN** está en un sitio al que Rufo llega andando o con un salto normal

#### Scenario: Dejarla para luego
- **WHEN** el niño golpea el bloque con fruta y sigue sin coger la fresa
- **THEN** la fresa sigue en su sitio hasta que vuelva a por ella o termine el nivel

#### Scenario: Nunca sobre pinchos
- **WHEN** el niño golpea el bloque con fruta en un nivel con pinchos, mirando hacia cualquier lado
- **THEN** la fresa se posa fuera de las zonas de pinchos y Rufo puede cogerla sin pincharse

### Requirement: Comer la fruta
Cuando Rufo toca la fresa, la SHALL comer: la fresa desaparece con un destello y empieza el modo
invencible. Comer la fresa SHALL NOT cambiar el contador de galletas ni las estrellas.

#### Scenario: Tocar la fresa
- **WHEN** Rufo toca la fresa andando o saltando
- **THEN** la fresa desaparece con un destello y Rufo empieza a brillar

#### Scenario: Sin efecto en la puntuación
- **WHEN** el niño come la fresa
- **THEN** el contador de galletas y las estrellas finales son los mismos que sin comerla

### Requirement: Duración del modo invencible
El modo invencible SHALL durar 8 segundos desde que Rufo come la fresa. En los 2 últimos segundos el
brillo SHALL parpadear más deprisa para avisar de que se acaba. Al llegar a la bandera, el modo SHALL
terminar.

#### Scenario: Se acaba solo
- **WHEN** pasan 8 segundos desde que Rufo comió la fresa
- **THEN** Rufo deja de brillar y vuelve a ser como siempre

#### Scenario: Aviso de final
- **WHEN** quedan 2 segundos de modo invencible
- **THEN** el brillo de Rufo parpadea más deprisa que antes

#### Scenario: Llegar a la bandera
- **WHEN** Rufo llega a la bandera mientras brilla
- **THEN** deja de brillar y celebra como siempre

### Requirement: Aspecto del modo invencible
Mientras dura el modo invencible, Rufo, con su gorro, SHALL verse brillante, con destellos de
colores que lo rodean y le siguen al moverse, y SHALL distinguirse del parpadeo protector que sigue a
un pinchazo. Ninguna parte SHALL usar texto.

#### Scenario: Ver a Rufo invencible
- **WHEN** Rufo corre y salta en modo invencible en un móvil horizontal de 844×390
- **THEN** se le ve brillar con destellos de colores alrededor, también al saltar

#### Scenario: Distinto del parpadeo
- **WHEN** se compara a Rufo invencible con Rufo parpadeando tras un pinchazo
- **THEN** se distinguen a simple vista: uno brilla con destellos y el otro se vuelve medio transparente

### Requirement: Los enemigos no pinchan a Rufo invencible
Mientras dura el modo invencible, tocar un erizo o una abeja, de lado o cayéndole encima, SHALL NOT
hacer brincar a Rufo ni restarle galletas. Rufo SHALL atravesarlo sin frenar. El enemigo SHALL hacer
su gesto breve y seguir moviéndose; ningún enemigo SHALL desaparecer ni ser derrotado.

#### Scenario: Atravesar un erizo
- **WHEN** Rufo invencible corre contra un erizo
- **THEN** lo atraviesa sin brincar ni frenar, el contador no baja y el erizo eriza los pinchos y sigue andando

#### Scenario: Caer sobre una abeja
- **WHEN** Rufo invencible cae desde un salto sobre una abeja
- **THEN** sigue cayendo sin rebotar, el contador no baja y la abeja sigue volando

#### Scenario: Termina tocando un enemigo
- **WHEN** el modo invencible termina mientras Rufo está tocando un enemigo
- **THEN** Rufo no se pincha hasta pasado 1 segundo, con el mismo parpadeo protector de un pinchazo

### Requirement: Gráfico propio de la fresa
La fresa SHALL ser un gráfico propio en el estilo vectorial plano y redondeado del juego: roja, con
semillas claras y hojas verdes, sin contornos negros y con una sombra inferior sólida. SHALL figurar
en el registro de licencias como propia del proyecto.

#### Scenario: Reconocer la fresa
- **WHEN** la fresa está en el suelo en un móvil horizontal de 844×390
- **THEN** se reconoce como una fresa y no se confunde con una galleta ni con un enemigo

#### Scenario: Licencia del gráfico
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** el gráfico de la fresa aparece como propio del proyecto

### Requirement: Los pinchos no pinchan a Rufo invencible
Mientras dura el modo invencible, caer en el foso de una zona de pinchos SHALL NOT restar galletas ni hacer salir ninguna galleta despedida. Como el foso no es suelo, Rufo SHALL rebotar fuera de él igual que en un pinchazo, por el lado por el que entró, y el modo invencible SHALL seguir sin interrumpirse. Si el modo termina con Rufo en el aire sobre un foso, SHALL caer y pincharse con normalidad.

#### Scenario: Correr sobre pinchos
- **WHEN** Rufo invencible corre hacia una zona de pinchos sin saltar y el contador marca 5
- **THEN** cae al foso, rebota fuera por donde entró, el contador sigue en 5 y Rufo sigue brillando

#### Scenario: Saltar el foso con la fresa
- **WHEN** Rufo invencible salta una zona de pinchos
- **THEN** la cruza por el aire como siempre, sin rebotar ni frenar

#### Scenario: Termina sobre los pinchos
- **WHEN** el modo invencible termina mientras Rufo está en el aire sobre un foso
- **THEN** si cae dentro, se pincha y rebota fuera como en cualquier pinchazo
