## ADDED Requirements

### Requirement: Foso bajo el suelo
Cada zona de pinchos SHALL ser un foso: el suelo SHALL cortarse en todo el ancho de la zona y los pinchos SHALL estar en el fondo, con las puntas por debajo de la línea del suelo. El foso SHALL ser poco hondo, de modo que se vean a la vez las dos orillas, las puntas y a Rufo dentro, y SHALL NOT haber ningún otro hueco en el suelo del nivel.

#### Scenario: Ver el foso
- **WHEN** aparece una zona de pinchos en un móvil horizontal de 844×390
- **THEN** el suelo se interrumpe en el ancho de la zona, las puntas quedan por debajo de la línea del suelo y se ve el fondo del foso entero

#### Scenario: Rufo dentro del foso
- **WHEN** Rufo cae al foso
- **THEN** sigue viéndose entero en la pantalla, con los pies sobre las puntas y la cabeza por encima de la línea del suelo

#### Scenario: Suelo fuera de los fosos
- **WHEN** el zorro recorre un nivel de la salida a la bandera por el suelo
- **THEN** solo encuentra huecos en las zonas de pinchos

### Requirement: El borde del foso sostiene a Rufo
Rufo SHALL NOT caer al foso mientras pise el borde con parte del pie. Si se queda parado en el borde con casi todo el cuerpo sobre el hueco, SHALL deslizarse suavemente hacia el suelo firme, nunca hacia los pinchos. Si sigue andando o se deja caer hacia el foso, SHALL caer dentro.

#### Scenario: Pararse en el borde
- **WHEN** el niño suelta las flechas con Rufo en el borde y la mayor parte del cuerpo sobre el hueco
- **THEN** Rufo se desliza un poco hacia el suelo firme, sin caer ni pincharse

#### Scenario: Seguir andando
- **WHEN** Rufo sigue andando hacia el foso sin saltar
- **THEN** cae dentro y toca los pinchos

### Requirement: Rebote sin galleta con protección o fresa
Si Rufo cae al foso mientras está protegido tras un pinchazo o en modo invencible, SHALL rebotar fuera del foso igual que en un pinchazo, por el lado por el que entró, pero el contador SHALL NOT bajar, SHALL NOT salir ninguna galleta despedida y la protección SHALL NOT alargarse. Rufo SHALL NOT poder quedarse dentro del foso.

#### Scenario: Caer parpadeando
- **WHEN** Rufo cae al foso mientras parpadea tras chocar con un enemigo y el contador marca 3
- **THEN** rebota fuera del foso y el contador sigue en 3

#### Scenario: Caer con la fresa
- **WHEN** Rufo invencible cae al foso
- **THEN** rebota fuera, sigue invencible y el contador no baja

## MODIFIED Requirements

### Requirement: Aspecto amable y reconocible
Los pinchos SHALL ser un gráfico propio en el estilo plano del juego: una hilera de conos de acero de punta afilada, en grises claros con caras de luz y de sombra, sobre una placa con remaches en el fondo del foso, con un destello blanco en una punta por zona. SHALL NOT tener contornos negros, rojo, sangre, caras ni nada que dé miedo. Los pinchos SHALL verse igual en todos los ambientes, y solo SHALL cambiar la pared del foso, hecha con la tierra del ambiente oscurecida. SHALL distinguirse a simple vista del suelo y de la decoración, y no confundirse con un enemigo.

#### Scenario: Ver los pinchos
- **WHEN** aparece una zona de pinchos en un móvil horizontal de 844×390, en cualquiera de los ambientes de los niveles 7 a 12
- **THEN** se ve claramente dónde empieza y dónde acaba el foso, y los pinchos se distinguen de la pared del foso, del suelo, de la decoración y de los erizos

#### Scenario: Se leen como metal
- **WHEN** se mira una zona de pinchos en cualquier ambiente
- **THEN** los conos son grises, terminan en punta y llevan un destello blanco, y ninguno es rojo ni tiene contorno negro

#### Scenario: Borde redondeado
- **WHEN** se mira el corte del suelo en los dos lados del foso
- **THEN** las esquinas del suelo son redondeadas, como el resto del juego, y hay una sombra bajo el borde

### Requirement: Tocar los pinchos es un pinchazo
Cuando Rufo cae al foso y sus pies tocan las puntas, SHALL producirse un pinchazo como el de un enemigo: el contador del nivel baja en una galleta (nunca por debajo de 0), sale una galleta despedida y Rufo parpadea 1 s, sin pincharse otra vez. Las estrellas, el total guardado y la posición de los bloques SHALL NOT cambiar. Pasar por encima del foso de un salto SHALL NOT pinchar.

#### Scenario: Caer en los pinchos
- **WHEN** el contador del nivel marca 4 y Rufo cae al foso
- **THEN** sale una galleta despedida, el contador pasa a 3 y Rufo parpadea

#### Scenario: Sin galletas
- **WHEN** el contador marca 0 y Rufo cae al foso
- **THEN** Rufo rebota, no sale ninguna galleta y el contador sigue en 0

#### Scenario: Margen de perdón
- **WHEN** Rufo aterriza de un salto con la punta de un pie en el borde del foso
- **THEN** no cae al foso y no hay pinchazo

#### Scenario: Saltar rozando
- **WHEN** Rufo salta el foso y pasa justo por encima de las puntas sin caer dentro
- **THEN** no hay pinchazo

### Requirement: El rebote saca a Rufo de la zona
El pinchazo de los pinchos SHALL lanzar a Rufo desde el fondo del foso hacia arriba y hacia el lado por el que entró en la zona, y SHALL hacerle aterrizar en el suelo firme junto a ese borde, fuera del foso. Durante el rebote el niño SHALL NOT poder dirigir a Rufo, y SHALL recuperar el control en menos de medio segundo desde el pinchazo.

#### Scenario: Entrar andando
- **WHEN** Rufo entra andando hacia la derecha en un foso de 2 baldosas
- **THEN** rebota hacia la izquierda y aterriza en el suelo a la izquierda del foso, sin tocar los pinchos

#### Scenario: Caer en medio
- **WHEN** Rufo cae de un salto hacia la izquierda en el centro de un foso
- **THEN** rebota hacia la derecha, por donde venía, y aterriza fuera del foso

#### Scenario: Salir del foso
- **WHEN** Rufo rebota desde el fondo de cualquier foso
- **THEN** pasa por encima del borde sin chocar con la pared del foso

#### Scenario: Niño que no se mueve
- **WHEN** tras un pinchazo de los pinchos el niño no toca ningún control durante 5 s
- **THEN** Rufo sigue en el suelo fuera del foso y no pierde más galletas
