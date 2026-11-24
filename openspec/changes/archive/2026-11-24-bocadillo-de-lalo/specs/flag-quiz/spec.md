## MODIFIED Requirements

### Requirement: Lalo guía la prueba
Lalo SHALL estar visible durante toda la prueba con su altavoz al lado, que sigue siendo el único control de sonido. Al acertar, Lalo SHALL celebrarlo con un salto y un sonido alegre. Tocar a Lalo SHALL abrir el bocadillo del adulto y SHALL NOT repetir la demostración de la consigna: esa repetición se pide desde el bocadillo.

#### Scenario: Tocar a Lalo
- **WHEN** el niño, o el adulto que lo acompaña, toca a Lalo durante una pregunta
- **THEN** se abre el bocadillo del adulto y la pregunta sigue igual, sin gastar ningún intento

#### Scenario: Acertar
- **WHEN** el niño acierta una pregunta
- **THEN** Lalo salta y suena un sonido alegre

## ADDED Requirements

### Requirement: Bocadillo de Lalo para el adulto
Al tocar a Lalo, la prueba SHALL mostrar un bocadillo de cómic, con la cola hacia Lalo, que SHALL llevar la etiqueta «Para el adulto», el nombre de la prueba, su objetivo educativo y una frase para guiar al niño. El texto SHALL estar en español, SHALL ser distinto para cada tipo de prueba y SHALL tener 35 palabras o menos entre objetivo y frase.

El bocadillo SHALL aparecer solo cuando se toca a Lalo y SHALL poder abrirse en cualquier pregunta, también después de fallar. La prueba sigue sin texto ni voz para el niño.

#### Scenario: Leer el objetivo
- **WHEN** el adulto toca a Lalo en la prueba «¿Cuántos hay?»
- **THEN** el bocadillo muestra la etiqueta «Para el adulto», el nombre «¿Cuántos hay?», su objetivo y una frase para guiar al niño

#### Scenario: Texto distinto por prueba
- **WHEN** se abre el bocadillo en dos tipos de prueba distintos
- **THEN** el nombre, el objetivo y la frase son los de cada prueba

#### Scenario: No aparece solo
- **WHEN** empieza la prueba o aparece una pregunta nueva
- **THEN** el bocadillo está cerrado hasta que se toque a Lalo

### Requirement: La prueba se pausa mientras el bocadillo está abierto
Con el bocadillo abierto, la pregunta SHALL verse atenuada y SHALL quedar en pausa: las respuestas SHALL NOT poder tocarse, no SHALL gastarse ningún intento y no SHALL empezar ni avanzar ninguna demostración, pista ni cambio de pregunta. Si había una demostración en curso, SHALL detenerse al abrir el bocadillo. Al cerrarlo, la pregunta SHALL seguir como estaba, con los mismos intentos y las mismas respuestas ya usadas.

#### Scenario: Tocar una respuesta con el bocadillo abierto
- **WHEN** el bocadillo está abierto y se toca una respuesta
- **THEN** no pasa nada y no se gasta ningún intento

#### Scenario: Abrir durante la demostración
- **WHEN** Lalo está haciendo la demostración y se toca a Lalo
- **THEN** la demostración se detiene y se abre el bocadillo

#### Scenario: Volver a la pregunta
- **WHEN** el adulto cierra el bocadillo tras un fallo
- **THEN** la pregunta sigue con los intentos que quedaban y las respuestas ya usadas siguen atenuadas

### Requirement: Cerrar el bocadillo
El bocadillo SHALL tener un botón de cierre (X) de al menos 44 px de lado en pantalla y SHALL poder cerrarse también tocando fuera del bocadillo, tocando a Lalo otra vez o con la tecla Esc. El bocadillo SHALL NOT cerrarse solo por el paso del tiempo. La X, el botón «ver otra vez» y todo lo demás del bocadillo SHALL caber sin taparse con Lalo, el pictograma ni las marcas de progreso en un móvil de 844×390.

#### Scenario: Cerrar con la X
- **WHEN** el adulto toca la X
- **THEN** el bocadillo se cierra y la pregunta vuelve a ser tocable

#### Scenario: Cerrar tocando fuera
- **WHEN** el adulto toca la zona atenuada fuera del bocadillo
- **THEN** el bocadillo se cierra y ese toque no cuenta como respuesta

#### Scenario: Cerrar tocando a Lalo
- **WHEN** el bocadillo está abierto y se toca a Lalo
- **THEN** el bocadillo se cierra

#### Scenario: Esperar
- **WHEN** el bocadillo lleva abierto un minuto sin tocar nada
- **THEN** sigue abierto

#### Scenario: Móvil pequeño
- **WHEN** se abre el bocadillo en un móvil de 844×390
- **THEN** se ve entero, la X mide al menos 44 px de lado y no tapa a Lalo, el pictograma ni las marcas de progreso

### Requirement: Ver otra vez desde el bocadillo
El bocadillo SHALL incluir un botón «ver otra vez» de al menos 44 px de lado que SHALL cerrarlo y repetir la demostración de la consigna de la pregunta actual. Repetirla SHALL NOT gastar ningún intento ni cambiar la pregunta.

#### Scenario: Repetir la demostración
- **WHEN** el adulto toca «ver otra vez»
- **THEN** el bocadillo se cierra, Lalo repite la demostración y la pregunta sigue igual

### Requirement: Lalo muestra que se puede tocar
Durante la prueba, Lalo SHALL mostrar una «?» amarilla pequeña que indica que se le puede tocar. La marca SHALL ser un dibujo, no una palabra, SHALL verse también con el bocadillo cerrado y SHALL NOT tapar el altavoz de Lalo.

#### Scenario: Ver la marca
- **WHEN** aparece cualquier pregunta de la prueba
- **THEN** Lalo lleva la «?» amarilla y su altavoz sigue visible y tocable
