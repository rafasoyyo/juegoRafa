## ADDED Requirements

### Requirement: El puente de los números
Un reto de tipo puente SHALL mostrar un puente de 5 tramos sobre el agua, cada tramo con su número (o sus puntos), al que le falta uno, y tres bloques con números sobre los tramos firmes antes del hueco. Golpear el bloque con el número del hueco SHALL hacer volar la tabla a su sitio, sonar una escala y dejar el puente cruzable.

#### Scenario: Acertar el siguiente
- **WHEN** el puente muestra 3, 4 y 5 y el hueco va después del 5, y el niño golpea el bloque del 6
- **THEN** la tabla del 6 vuela al hueco, suena una escala que sube y el zorro puede cruzar

#### Scenario: En el móvil
- **WHEN** el niño está en el último tramo firme antes del hueco en un móvil horizontal de 844×390
- **THEN** ve los tres bloques, el hueco y los tramos de los dos lados sin que los tapen los controles

### Requirement: Puente según la edad
Los números del puente SHALL adaptarse a la franja de edad: de 3 a 4 años, del 1 al 5 con puntos y solo los tramos anteriores al hueco (el siguiente); de 5 a 6 años, del 1 al 10, mostrando solo los anteriores (el siguiente) o solo los posteriores (el anterior); de 7 a 8 años, una serie de 2 en 2 entre 0 y 20 con todos los tramos a la vista y el hueco en cualquier sitio con al menos dos tramos firmes antes.

#### Scenario: Perfil de 8 años
- **WHEN** un perfil de 8 años llega a un puente
- **THEN** los tramos van de 2 en 2 y la respuesta está entre 0 y 20

### Requirement: Escalera de fallos del puente
Un fallo en el puente SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que el hueco parpadee; el segundo, que los tramos se enciendan de uno en uno desde el primero, con un saltito y un «tic», hasta llegar al hueco; el tercero, que Lalo señale el bloque correcto y la tabla se coloque sola.

#### Scenario: Segundo fallo
- **WHEN** el niño falla por segunda vez en un puente
- **THEN** los tramos se encienden uno a uno desde el primero hasta el hueco, cada uno con un saltito

### Requirement: El hueco del puente no se salta
El hueco SHALL ser más ancho que lo que alcanza un salto normal, también saltando desde encima de un bloque del reto, y SHALL cerrarse para siempre al colocar la tabla.

#### Scenario: Saltar el hueco
- **WHEN** el niño corre y salta hacia el hueco sin haber resuelto el reto
- **THEN** cae al agua y rebota fuera por el lado por el que entró
