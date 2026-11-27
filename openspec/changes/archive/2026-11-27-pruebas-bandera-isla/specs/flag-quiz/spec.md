## ADDED Requirements

### Requirement: Prueba «Sombras de dinosaurios»
La prueba SHALL mostrar un dinosaurio de la isla a color en el marco del modelo y tres siluetas, de las que solo una es la suya. De 3 a 4 años las otras siluetas SHALL ser muy distintas; de 5 a 6, parecidas; de 7 a 8, parecidas y alguna mirando al otro lado (la buena también puede mirar al otro lado). La pista SHALL llevar la silueta tocada sobre el modelo para ver que no encaja.

#### Scenario: La sombra que mira al otro lado
- **WHEN** un niño de 7 años ve el triceratops y la sombra del triceratops mira a la izquierda
- **THEN** esa sombra es la respuesta buena

### Requirement: Prueba «Formas en las cosas»
La prueba SHALL mostrar una cosa de todos los días con una forma clara (rueda, reloj, ventana, regalo, pizza, vela, puerta, libro, huevo, estrella de mar, cometa, panal, casa) y tres formas de colores al azar, y pedir la forma de la cosa. Las formas SHALL ser círculo, cuadrado y triángulo de 3 a 4 años; además rectángulo, óvalo, estrella y rombo de 5 a 6; y además pentágono y hexágono de 7 a 8. El color SHALL NOT indicar la respuesta.

#### Scenario: La rueda es un círculo
- **WHEN** la cosa es una rueda
- **THEN** la respuesta buena es el círculo, sea del color que sea

### Requirement: Prueba «Las placas del estegosaurio»
La prueba SHALL mostrar una placa con una forma y tres placas para elegir la misma forma aunque cambie de tamaño, color o (desde 5 años) un poco de giro; la primera pregunta SHALL ser el triángulo. De 7 a 8 años la consigna SHALL ser un dado con tantos puntos como esquinas, y las otras formas SHALL tener otro número de esquinas.

#### Scenario: Contar esquinas
- **WHEN** un niño de 8 años ve un dado de 5 puntos
- **THEN** la respuesta buena es el pentágono

### Requirement: Prueba «Igual aunque gire»
La prueba SHALL mostrar una pieza sin simetría y tres para elegir la misma. De 3 a 4 años la pieza SHALL NOT girar; de 5 a 6 SHALL girar un cuarto de vuelta; de 7 a 8 SHALL girar un cuarto, media o tres cuartos de vuelta y una de las otras SHALL ser la misma pieza volteada, que no vale.

#### Scenario: Volteada no vale
- **WHEN** a un niño de 7 años le salen la pieza girada media vuelta y la misma pieza volteada
- **THEN** solo la girada es la respuesta buena

### Requirement: Prueba «El nido»
La prueba SHALL mostrar al bebé dinosaurio en un sitio respecto al nido y tres dibujos (dos de 3 a 4 años) con el huevo respecto a una caja, un cesto o una cueva, y pedir el que tiene la misma posición aunque cambie el dibujo. Las posiciones SHALL ser dentro y fuera de 3 a 4 años; dentro, fuera, encima, debajo, delante y detrás de 5 a 6; y encima, debajo, delante, detrás, izquierda y derecha de 7 a 8. Entre las opciones SHALL estar la posición contraria.

#### Scenario: Debajo
- **WHEN** el bebé está debajo del nido
- **THEN** la respuesta buena es el huevo debajo del cesto, no el huevo encima

### Requirement: Prueba «Los huevos de la familia»
La prueba SHALL mostrar un nido con tres huevos de una familia y cuatro huevos para elegir el que no es de ella. La familia SHALL ser de un color de 3 a 4 años, de un dibujo (manchas, rayas o liso) de 5 a 6 aunque cambie el color, y de un color y un dibujo de 7 a 8, con el raro compartiendo uno de los dos.

#### Scenario: Comparte el color
- **WHEN** la familia es de huevos azules con manchas y un huevo es azul con rayas
- **THEN** ese huevo es la respuesta buena

### Requirement: Prueba «El fósil»
La prueba SHALL mostrar una losa de huesos a la que le falta un trozo y tres piezas, y pedir la que llena el hueco tal cual, sin girarla. El hueco SHALL ser de 2 casillas de 3 a 4 años, de 3 de 5 a 6 y de 4 de 7 a 8; de 7 a 8 una de las piezas falsas SHALL ser la misma pieza en otra posición.

#### Scenario: La misma pieza girada no encaja
- **WHEN** el hueco es una L tumbada y entre las piezas está la L de pie
- **THEN** solo la L tumbada es la respuesta buena

### Requirement: Prueba «La piel del dinosaurio»
La prueba SHALL mostrar un mosaico de escamas que sigue un dibujo, con una escama que falta, y las escamas para elegir; cada color SHALL llevar su marca blanca para no depender del color. Los dibujos SHALL ser rayas de 3 a 4 años (falta una de la última fila), rayas o damero de 5 a 6, y damero, damero de bloques o diagonales de tres colores de 7 a 8.

#### Scenario: Damero
- **WHEN** la piel es un damero naranja y verde y falta una escama entre dos naranjas de su fila
- **THEN** la respuesta buena es la verde

### Requirement: Prueba «El cuello que crece»
La prueba SHALL mostrar en fila dinosaurios con el cuello cada vez más largo y pedir el que falta. De 3 a 6 años el cuello SHALL crecer de uno en uno y faltar el último; de 7 a 8 SHALL crecer de uno en uno o de dos en dos y el hueco PUEDE estar en medio. Ningún cuello SHALL pasar de 8 trozos.

#### Scenario: De dos en dos
- **WHEN** los cuellos son de 1, 3, hueco y 7 trozos
- **THEN** la respuesta buena es el de 5 trozos

### Requirement: Prueba «Pelota, caja y cono»
La prueba SHALL mostrar una rampa que pide el cuerpo que baja rodando (bolas que giran) o el que se queda quieto (un cubo quieto), y tres cuerpos de los que solo uno cumple. De 3 a 4 años SHALL pedir siempre rodar, con la bola entre cuerpos de caras planas; de 5 a 6 SHALL entrar el cilindro; de 7 a 8, también el cono.

#### Scenario: El cono rueda
- **WHEN** un niño de 8 años ve la rampa de rodar con la pirámide, el cono y el cubo
- **THEN** la respuesta buena es el cono

### Requirement: Prueba «Formas escondidas»
La prueba SHALL pedir cuántos triángulos hay. De 3 a 4 años SHALL mostrar formas sueltas (triángulos, círculos y cuadrados) y respuestas con puntos; de 5 a 6, dibujos con 1 a 3 triángulos; de 7 a 8, dibujos donde los triángulos se solapan, contando también los grandes. Entre las respuestas SHALL estar, si es distinta, la de contar solo los trozos.

#### Scenario: Los grandes también cuentan
- **WHEN** el dibujo es un triángulo partido en cuatro por sus puntos medios
- **THEN** la respuesta buena es 5 y entre las falsas está el 4

### Requirement: Repaso de la isla
La prueba del nivel 12 de la isla SHALL hacer una pregunta de cada una de tres pruebas anteriores de la isla, distintas entre sí, y cada pregunta SHALL verse y tener la pista de su prueba.

#### Scenario: Tres pruebas distintas
- **WHEN** el niño llega a la bandera del nivel 12 de la isla
- **THEN** las tres preguntas son de tres pruebas distintas de la isla
