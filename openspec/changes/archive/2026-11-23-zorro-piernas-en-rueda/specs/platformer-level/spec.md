# Spec Delta

## MODIFIED Requirements

### Requirement: Animaciones del zorro
El zorro SHALL mirar hacia donde se mueve, correr moviendo las piernas, estirarse al saltar,
aplastarse un instante al aterrizar y quedarse quieto respirando cuando no se mueve.

#### Scenario: Aterrizar
- **WHEN** el zorro cae al suelo tras un salto
- **THEN** se aplasta brevemente y recupera su forma

#### Scenario: Quedarse quieto
- **WHEN** el niño deja de pulsar las flechas con el zorro en el suelo
- **THEN** el zorro deja de mover las piernas en ese mismo fotograma y respira quieto con los pies en el suelo

## ADDED Requirements

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
