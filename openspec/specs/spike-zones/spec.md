# spike-zones Specification

## Purpose

Añadir a los niveles 7 a 12 zonas de pinchos en el suelo que hay que saltar. Tocarlas cuesta una galleta del nivel, igual que un pinchazo de enemigo, sin vidas ni derrota.

## Requirements

### Requirement: Pinchos solo en los niveles 7 a 12
Las zonas de pinchos SHALL aparecer solo en los niveles 7 a 12, con 2, 3, 3, 4, 5 y 6 zonas respectivamente. Los niveles 1 a 6 SHALL NOT tener pinchos.

#### Scenario: Nivel antiguo
- **WHEN** se abre cualquiera de los niveles 1 a 6
- **THEN** no hay ninguna zona de pinchos

#### Scenario: Primer nivel con pinchos
- **WHEN** se abre el nivel 7
- **THEN** hay exactamente 2 zonas de pinchos

#### Scenario: Último nivel
- **WHEN** se abre el nivel 12
- **THEN** hay exactamente 6 zonas de pinchos

### Requirement: Zonas fijas definidas como datos
Cada zona de pinchos SHALL definirse en el archivo de datos de su nivel, con su posición y su anchura, y SHALL estar siempre en el mismo sitio al repetir el nivel. Una zona que incumpla las reglas de colocación SHALL detectarse en las pruebas automáticas, que SHALL indicar el nivel y la zona.

#### Scenario: Repetir un nivel
- **WHEN** el niño juega dos veces el nivel 9
- **THEN** las zonas de pinchos están en los mismos sitios las dos veces

#### Scenario: Zona mal colocada
- **WHEN** un archivo de nivel tiene una zona de pinchos junto a la salida
- **THEN** las pruebas automáticas fallan e indican el nivel y la zona

### Requirement: Se saltan con un salto normal
Una zona de pinchos SHALL medir 1 baldosa de ancho en los niveles 7 y 8, y 1 o 2 baldosas a partir del nivel 9. Nunca SHALL medir más de 2. Cualquier zona SHALL poder cruzarse con un salto normal tomado desde el borde, andando o corriendo.

#### Scenario: Zona ancha
- **WHEN** el zorro llega andando al borde de una zona de 2 baldosas y salta
- **THEN** aterriza en el suelo del otro lado sin tocar los pinchos

#### Scenario: Anchura por nivel
- **WHEN** se comprueban los datos de los niveles 7 y 8
- **THEN** todas sus zonas miden 1 baldosa

### Requirement: Colocación segura
Las zonas SHALL estar solo sobre el suelo, nunca sobre escalones ni plataformas. Distancias mínimas en baldosas: 10 de la salida y de la bandera, 2 de un bloque «?», un escalón o una plataforma, y 6 entre zonas. Ninguna zona SHALL estar bajo una plataforma.

#### Scenario: Golpear un bloque
- **WHEN** el niño se para bajo cualquier bloque «?» para golpearlo
- **THEN** no hay pinchos bajo sus pies ni a menos de 2 baldosas

#### Scenario: Salida y bandera
- **WHEN** se abre un nivel con pinchos
- **THEN** no hay ninguna zona en las 10 primeras baldosas tras la salida ni en las 10 anteriores a la bandera

#### Scenario: Aterrizar entre zonas
- **WHEN** el zorro salta una zona de pinchos
- **THEN** hay al menos 6 baldosas de suelo libre de pinchos antes de la siguiente zona

### Requirement: Aspecto amable y reconocible
Los pinchos SHALL ser un gráfico propio en el estilo plano y redondeado del juego: una hilera de conos de punta redondeada, sin contornos negros ni nada que dé miedo. SHALL verse igual en todos los ambientes, distinguirse a simple vista del suelo y de la decoración, y no confundirse con un enemigo.

#### Scenario: Ver los pinchos
- **WHEN** aparece una zona de pinchos en un móvil horizontal de 844×390, en cualquiera de los ambientes de los niveles 7 a 12
- **THEN** se ve claramente dónde empieza y dónde acaba, y se distingue del suelo, de la decoración y de los erizos

### Requirement: Tocar los pinchos es un pinchazo
Cuando los pies de Rufo tocan una zona de pinchos, SHALL producirse un pinchazo como el de un enemigo: el contador del nivel baja en una galleta (nunca por debajo de 0), sale una galleta despedida y Rufo parpadea 1 s, sin pincharse otra vez. Las estrellas, el total guardado y la posición de los bloques SHALL NOT cambiar.

#### Scenario: Caer en los pinchos
- **WHEN** el contador del nivel marca 4 y Rufo cae sobre una zona de pinchos
- **THEN** sale una galleta despedida, el contador pasa a 3 y Rufo parpadea

#### Scenario: Sin galletas
- **WHEN** el contador marca 0 y Rufo toca los pinchos
- **THEN** Rufo rebota, no sale ninguna galleta y el contador sigue en 0

#### Scenario: Margen de perdón
- **WHEN** Rufo aterriza con la punta de un pie justo en el borde de la zona
- **THEN** no hay pinchazo: solo cuenta si los pies están claramente sobre los pinchos

### Requirement: El rebote saca a Rufo de la zona
El pinchazo de los pinchos SHALL lanzar a Rufo hacia arriba y hacia el lado por el que entró en la zona, y SHALL hacerle aterrizar en el suelo libre junto a ese borde, fuera de los pinchos. Durante el rebote el niño SHALL NOT poder dirigir a Rufo, y SHALL recuperar el control en menos de medio segundo desde el pinchazo.

#### Scenario: Entrar andando
- **WHEN** Rufo entra andando hacia la derecha en una zona de 2 baldosas
- **THEN** rebota hacia la izquierda y aterriza en el suelo a la izquierda de la zona, sin tocar los pinchos

#### Scenario: Caer en medio
- **WHEN** Rufo cae de un salto hacia la izquierda en el centro de una zona
- **THEN** rebota hacia la derecha, por donde venía, y aterriza fuera de la zona

#### Scenario: Niño que no se mueve
- **WHEN** tras un pinchazo de los pinchos el niño no toca ningún control durante 5 s
- **THEN** Rufo sigue en el suelo fuera de la zona y no pierde más galletas

### Requirement: Los pinchos no penalizan más
Los pinchos SHALL NOT reiniciar el nivel, devolver a Rufo a la salida, mostrar ninguna pantalla o mensaje ni impedir llegar a la bandera. Siempre SHALL haber manera de seguir hacia la bandera saltando.

#### Scenario: Muchos pinchazos
- **WHEN** el niño cae diez veces en los pinchos y luego golpea todos los bloques y llega a la bandera
- **THEN** las estrellas son las mismas que sin haber caído y la prueba de la bandera aparece como siempre
