# platformer-level Specification

## Purpose
Definir la base jugable del plataformas: presentación pixel art, arte propio o libre, bloques «?» con monedas, meta y ausencia de derrota. Sobre ella se construyen los retos educativos.

## Requirements

### Requirement: Arte propio o libre
El juego SHALL NOT usar personajes, sprites, logos, nombres ni música de terceros con copyright. El
personaje jugable SHALL ser el zorro original del juego.

#### Scenario: Revisión de assets
- **WHEN** se revisan los activos del repositorio
- **THEN** cada uno es propio, generado por código o de licencia libre con la licencia anotada

#### Scenario: Personaje en el nivel
- **WHEN** se abre un nivel
- **THEN** el personaje que se mueve es el zorro naranja con el gorro elegido

### Requirement: Bloques «?» que dan monedas
Un bloque «?» SHALL activarse al golpearlo desde abajo, cambiar a su aspecto usado, soltar una
moneda y sumar uno al contador, y SHALL NOT activarse una segunda vez.

#### Scenario: Golpe desde abajo
- **WHEN** el niño salta y golpea un bloque «?» con la cabeza
- **THEN** el bloque rebota, aparece una moneda y el contador sube en uno

#### Scenario: Golpe desde arriba o de lado
- **WHEN** el niño toca el bloque por arriba o por un lado
- **THEN** el bloque no se activa

#### Scenario: Bloque ya usado
- **WHEN** el niño golpea otra vez un bloque usado
- **THEN** el contador no cambia

### Requirement: Meta del nivel
Al alcanzar la bandera final el juego SHALL detener al zorro, hacerle celebrar en el sitio y abrir la
pantalla de nivel completado antes de 2 segundos.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera
- **THEN** el zorro se detiene y celebra, y antes de 2 s se abre la pantalla de nivel completado

### Requirement: Sin fallo que penalice
El nivel SHALL NOT tener vidas ni estado de derrota.

#### Scenario: Recorrido completo
- **WHEN** el niño recorre el nivel sin llegar a la meta durante varios minutos
- **THEN** el juego no muestra pantalla de fin ni resta nada

### Requirement: Escenario del nivel
El nivel SHALL dibujar un cielo en degradado, nubes y colinas redondeadas que se desplazan más despacio
que el suelo (paralaje), un suelo de hierba sobre tierra, bloques «?» amarillos redondeados con sombra
inferior y una bandera coral al final.

#### Scenario: Avanzar por el nivel
- **WHEN** el zorro avanza hacia la derecha
- **THEN** el suelo y los bloques se desplazan a la velocidad de la cámara y las nubes y colinas más despacio

### Requirement: Animaciones del zorro
El zorro SHALL mirar hacia donde se mueve, correr moviendo las piernas, estirarse al saltar,
aplastarse un instante al aterrizar y quedarse quieto respirando cuando no se mueve.

#### Scenario: Aterrizar
- **WHEN** el zorro cae al suelo tras un salto
- **THEN** se aplasta brevemente y recupera su forma

#### Scenario: Quedarse quieto
- **WHEN** el niño deja de pulsar las flechas con el zorro en el suelo
- **THEN** el zorro deja de mover las piernas en ese mismo fotograma y respira quieto con los pies en el suelo

### Requirement: Zancadas que aceleran hasta la rueda
Al correr por el suelo, el zorro SHALL mover dos piernas visibles con zancadas alternas cuyo ritmo
aumenta desde que arranca. En 0,5 s como máximo, las piernas SHALL convertirse en una rueda borrosa
bajo el cuerpo que gira en el sentido de la marcha.

#### Scenario: Arrancar
- **WHEN** el niño pulsa una flecha con el zorro quieto en el suelo
- **THEN** se ven las dos piernas dando zancadas alternas cada vez más rápidas, y el zorro avanza a su velocidad normal desde el primer instante

#### Scenario: Correr seguido
- **WHEN** el niño lleva más de 0,5 s corriendo por el suelo
- **THEN** bajo el cuerpo del zorro se ve una rueda borrosa de pies en lugar de piernas sueltas

#### Scenario: Correr hacia la izquierda
- **WHEN** el zorro corre hacia la izquierda
- **THEN** la rueda gira al revés que cuando corre hacia la derecha y el dibujo sigue siendo coherente con la dirección

#### Scenario: Cambiar de sentido
- **WHEN** el niño cambia de flecha sin soltar la otra antes
- **THEN** el zorro se da la vuelta y la rueda gira en el nuevo sentido sin quedarse congelada

### Requirement: Efectos de velocidad al correr en rueda
Mientras las piernas están en rueda, el zorro SHALL inclinarse hacia delante en el sentido de la
marcha y rebotar ligeramente. Detrás de él SHALL verse líneas de velocidad y, a sus pies, nubecillas
de polvo que se desvanecen. Los efectos SHALL usar la paleta del juego, sin contornos negros.

#### Scenario: Ir a toda velocidad
- **WHEN** las piernas del zorro están en rueda
- **THEN** el cuerpo se inclina hacia delante, aparecen líneas de velocidad detrás y polvo que se desvanece en el suelo

#### Scenario: El gorro acompaña
- **WHEN** el zorro va inclinado y rebotando con el gorro puesto
- **THEN** el gorro sigue apoyado en la cabeza con la misma inclinación

### Requirement: Rueda solo en el suelo
En el aire el zorro SHALL usar su pose de salto, sin rueda ni efectos de velocidad. Si aterriza
mientras el niño sigue corriendo, la rueda SHALL volver sin repetir la fase de zancadas. Durante la
celebración de la meta SHALL NOT verse ni la rueda ni los efectos.

#### Scenario: Saltar corriendo
- **WHEN** el zorro salta mientras corre en rueda
- **THEN** en el aire muestra la pose de salto sin rueda ni líneas de velocidad

#### Scenario: Aterrizar corriendo
- **WHEN** el zorro aterriza con la flecha todavía pulsada tras haber corrido en rueda
- **THEN** la rueda reaparece al tocar el suelo, sin volver a empezar por las zancadas lentas

#### Scenario: Llegar a la meta corriendo
- **WHEN** el zorro toca la bandera corriendo en rueda
- **THEN** la rueda y los efectos desaparecen y el zorro celebra con su pose de celebración

### Requirement: La animación no cambia el control
La animación de carrera SHALL NOT cambiar la velocidad horizontal, el salto, la caja de colisión ni
la respuesta a los controles táctiles y de teclado.

#### Scenario: Misma velocidad
- **WHEN** se compara el tiempo que tarda el zorro en recorrer el nivel antes y después del cambio, con la flecha siempre pulsada
- **THEN** el tiempo es el mismo

### Requirement: HUD del nivel
El nivel SHALL mostrar arriba un botón de casa a la izquierda que vuelve al mapa, una barra de progreso
en el centro con la cara del zorro avanzando hacia una bandera, y a la derecha el contador de monedas
del nivel con icono y número.

#### Scenario: Progreso
- **WHEN** el zorro está a mitad del recorrido
- **THEN** la cara del zorro está en la mitad de la barra de progreso

#### Scenario: Salir al mapa
- **WHEN** el niño toca el botón de casa
- **THEN** se abre el mapa sin contar el nivel como completado
