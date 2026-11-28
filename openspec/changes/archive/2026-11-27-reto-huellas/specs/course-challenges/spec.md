## ADDED Requirements

### Requirement: El camino de huellas
Un reto de tipo camino de huellas SHALL mostrar un puente en ruinas de 5 losas sobre un río de lava, con una tablilla grabada sobre cada losa que sigue una serie de formas, al que le falta una losa, y tres bloques de piedra con formas sobre las losas firmes antes del hueco. Golpear el bloque con la forma que sigue SHALL hacer subir la losa de la lava hasta encajar con un golpe de piedra, encender los grabados uno tras otro con su nota y dejar el puente cruzable.

#### Scenario: Acertar la forma que sigue
- **WHEN** las tablillas muestran triángulo, cuadrado, triángulo, cuadrado y el hueco va después, y el niño golpea el bloque del triángulo
- **THEN** la losa sube y encaja con un golpe de piedra, los grabados se encienden de uno en uno con su nota y el zorro puede cruzar

#### Scenario: En el móvil
- **WHEN** el niño está en la última losa firme antes del hueco en un móvil horizontal de 844×390
- **THEN** ve los tres bloques, el hueco y las tablillas de la serie sin que los tapen los controles

### Requirement: Series según la edad
La serie del camino de huellas SHALL adaptarse a la franja de edad: de 3 a 4 años, AB con la misma forma en dos colores; de 5 a 6 años, AB, ABB o AAB con formas de un solo color; de 7 a 8 años, ABC con tres formas o una serie que crece (una forma más en cada losa). Delante del hueco SHALL verse siempre al menos una vuelta entera de la serie.

#### Scenario: Perfil de 4 años
- **WHEN** un perfil de 4 años llega a un camino de huellas
- **THEN** las losas alternan dos colores de círculo y los bloques ofrecen círculos de tres colores

#### Scenario: Perfil de 8 años con una serie que crece
- **WHEN** a un perfil de 8 años le toca una serie que crece
- **THEN** las tablillas llevan 1, 2, 3… formas iguales y los bloques ofrecen la cantidad que sigue y otras cercanas

### Requirement: Escalera de fallos del camino de huellas
Un fallo en el camino de huellas SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que el hueco parpadee; el segundo, que las tablillas se enciendan de una en una desde la primera, cada una con la nota de su forma, y que en el hueco suene el silencio; el tercero, que Lalo señale el bloque correcto y la losa suba sola.

#### Scenario: Segundo fallo
- **WHEN** el niño falla por segunda vez en un camino de huellas
- **THEN** la serie suena tablilla a tablilla y la misma forma suena siempre con la misma nota

### Requirement: El hueco de lava no se salta ni cuesta galletas
El hueco del camino de huellas SHALL ser más ancho que lo que alcanza un salto normal, también desde encima de un bloque del reto. Caer en él SHALL hacer rebotar al zorro fuera por el lado por el que entró sin quitar galletas, y SHALL cerrarse para siempre al encajar la losa.

#### Scenario: Saltar el hueco
- **WHEN** el niño salta hacia el hueco sin haber resuelto el reto
- **THEN** cae a la lava, rebota fuera por donde entró y conserva sus galletas
