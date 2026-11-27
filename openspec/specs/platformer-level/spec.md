# platformer-level Specification

## Purpose
Definir la base jugable del plataformas: presentación pixel art, arte propio o libre, bloques «?» con galletas, meta y ausencia de derrota. Sobre ella se construyen los retos educativos.

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

### Requirement: Bloques «?» que dan galletas
Un bloque «?» SHALL activarse al golpearlo desde abajo, esté sobre el suelo, un escalón o una
plataforma, cambiar a su aspecto usado, soltar una galleta con pepitas de chocolate y sumar uno al
contador, y SHALL NOT activarse una segunda vez. El bloque que esconde la fruta del nivel SHALL
soltar además la fruta.

#### Scenario: Golpe desde abajo
- **WHEN** el niño salta y golpea un bloque «?» con la cabeza
- **THEN** el bloque rebota, aparece una galleta con pepitas de chocolate que sube y se desvanece, y el contador sube en uno

#### Scenario: Golpe desde una plataforma o un escalón
- **WHEN** el niño salta desde una plataforma o un escalón y golpea con la cabeza el bloque «?» que tiene encima
- **THEN** el bloque se activa igual que desde el suelo

#### Scenario: Golpe desde arriba o de lado
- **WHEN** el niño toca el bloque por arriba o por un lado
- **THEN** el bloque no se activa

#### Scenario: Bloque ya usado
- **WHEN** el niño golpea otra vez un bloque usado
- **THEN** el contador no cambia y no sale ninguna fruta

#### Scenario: Bloque con fruta
- **WHEN** el niño golpea desde abajo el bloque que esconde la fruta
- **THEN** sale la galleta, el contador sube en uno y además sale la fruta

### Requirement: Aspecto de la galleta
La galleta SHALL ser un gráfico propio en el estilo vectorial plano y redondeado del juego: un círculo
de masa dorada tostada con varias pepitas de chocolate oscuro y una sombra inferior sólida, sin
contornos negros, reconocible a simple vista incluso al tamaño más pequeño en que se dibuja.

#### Scenario: Galleta pequeña en el HUD
- **WHEN** se ve el contador de galletas en un móvil de 844×390
- **THEN** la galleta se reconoce como galleta con pepitas de chocolate y no se confunde con una moneda

#### Scenario: Licencia del gráfico
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** el gráfico de la galleta aparece como propio del proyecto y ya no figura ningún gráfico de moneda

### Requirement: Meta del nivel
Al alcanzar la bandera final el juego SHALL detener al zorro, hacerle celebrar en el sitio y abrir la
pantalla de nivel completado antes de 2 segundos.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera
- **THEN** el zorro se detiene y celebra, y antes de 2 s se abre la pantalla de nivel completado

### Requirement: Sin fallo que penalice
El nivel SHALL NOT tener vidas, estado de derrota ni caídas fuera del recorrido. El suelo SHALL ser continuo de la salida a la bandera salvo en los fosos de las zonas de pinchos, que son poco hondos y de los que Rufo SHALL salir siempre rebotando, sin quedarse atrapado.

#### Scenario: Recorrido completo
- **WHEN** el niño recorre el nivel sin llegar a la meta durante varios minutos
- **THEN** el juego no muestra pantalla de fin y solo los pinchazos con enemigos o con pinchos restan galletas

#### Scenario: Caer de una plataforma
- **WHEN** el zorro cae desde la plataforma más alta del nivel
- **THEN** aterriza en el suelo o en un escalón y puede seguir jugando sin ninguna penalización

#### Scenario: Caer en los pinchos
- **WHEN** el zorro cae en el foso de una zona de pinchos
- **THEN** pierde como mucho una galleta del contador del nivel, rebota fuera del foso y sigue jugando sin volver a la salida

#### Scenario: Sin otros huecos
- **WHEN** se recorre por el suelo un nivel de los niveles 1 a 6
- **THEN** el suelo no tiene ningún hueco

### Requirement: Escenario del nivel
El nivel SHALL dibujar, con los colores y la decoración del ambiente de ese nivel, un cielo en
degradado, una decoración de fondo y colinas redondeadas que se desplazan más despacio que el suelo
(paralaje), y un suelo propio del ambiente (hierba, arena, nieve o nube) sobre su base. Sobre él SHALL
dibujar los bloques «?» amarillos redondeados con sombra inferior, las plataformas y escalones del
nivel, las zonas de pinchos y una bandera coral al final.

#### Scenario: Avanzar por el nivel
- **WHEN** el zorro avanza hacia la derecha
- **THEN** el suelo, los escalones, las plataformas, los pinchos y los bloques se desplazan a la velocidad de la cámara y la decoración del fondo y las colinas más despacio

#### Scenario: Escenario según el nivel
- **WHEN** se abre el nivel 3
- **THEN** el escenario usa el ambiente de bosque y no el del prado del nivel 1

#### Scenario: Suelo de nieve
- **WHEN** se abre el nivel 10
- **THEN** el suelo es de nieve blanca sobre su base, y no de hierba

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
en el centro con la cara del zorro avanzando hacia una bandera, y a la derecha el contador de galletas
del nivel con el icono de la galleta y un número.

#### Scenario: Progreso
- **WHEN** el zorro está a mitad del recorrido
- **THEN** la cara del zorro está en la mitad de la barra de progreso

#### Scenario: Salir al mapa
- **WHEN** el niño toca el botón de casa
- **THEN** se abre el mapa sin contar el nivel como completado

#### Scenario: Contador de galletas
- **WHEN** se abre un nivel en un móvil horizontal
- **THEN** arriba a la derecha se ve una galleta con pepitas de chocolate junto al número 0, sin ninguna palabra

### Requirement: Hueco de agua del puente
El hueco de un puente sin resolver SHALL comportarse como un foso sin pinchos: el zorro que cae en él SHALL rebotar fuera por el lado por el que entró, sin perder galletas ni parpadear. Una vez colocada la tabla, el hueco SHALL ser suelo firme.

#### Scenario: Caer al agua
- **WHEN** el zorro cae al hueco del puente
- **THEN** rebota fuera hacia el tramo del que venía y el contador de galletas no cambia

### Requirement: Plataforma que se mueve
Una plataforma que se mueve (la barca) SHALL llevar al zorro encima. Mientras se mueve, el zorro SHALL ir con ella sin control y SHALL NOT poder caerse; al pararse, recupera el control.

#### Scenario: Cruzar en la barca
- **WHEN** la barca cruza el lago con Rufo encima y el niño pulsa saltar o una flecha
- **THEN** Rufo sigue sobre la barca hasta la otra orilla y entonces vuelve a responder

### Requirement: Agua del lago
El agua libre del lago SHALL comportarse como el hueco del puente: el zorro que cae en ella SHALL rebotar fuera por el lado por el que entró, sin perder galletas ni parpadear.

#### Scenario: Caer al lago
- **WHEN** el zorro cae al agua del lago desde la barca
- **THEN** rebota hacia la barca y el contador de galletas no cambia

### Requirement: Lomo del braquiosaurio
El lomo del braquiosaurio SHALL ser una plataforma que se mueve como la barca: firme a ras del suelo, lleva al zorro sin control mientras cruza y SHALL NOT dejarlo caer. El agua libre del río SHALL comportarse como el agua del lago: rebote fuera sin perder galletas.

#### Scenario: Cruzar en el braquiosaurio
- **WHEN** el braquiosaurio cruza con Rufo en el lomo y el niño pulsa saltar o una flecha
- **THEN** Rufo sigue en el lomo hasta la otra orilla y entonces vuelve a responder

### Requirement: Piedras que se hunden
Una piedra del géiser que se hunde SHALL devolver al zorro en un arco suave a la última piedra buena que pisó (o a la orilla), sin control durante el arco y sin perder galletas ni parpadear. La lava entre las piedras SHALL comportarse como el hueco del puente: rebote fuera sin perder galletas.

#### Scenario: Volver a la anterior
- **WHEN** el zorro cae sobre una piedra que se hunde
- **THEN** vuelve en un saltito a la piedra buena anterior y recupera el control al llegar
