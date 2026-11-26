## ADDED Requirements

### Requirement: La barca de diez
Un reto de tipo barca SHALL mostrar una barca en la orilla de un lago con sus asientos en forma de marco y algunos patitos sentados, y tres bloques con puntos en el muelle. Golpear el bloque con los patitos que faltan SHALL hacer subir los patitos de uno en uno contándose y sonar la bocina. Con la barca llena, cuando el zorro se sube, la barca SHALL cruzar el lago y dejarlo en la otra orilla.

#### Scenario: Completar la barca de 10
- **WHEN** la barca de 10 lleva 7 patitos y el niño golpea el bloque de 3 puntos
- **THEN** suben 3 patitos de uno en uno, suena la bocina y, al subirse Rufo, la barca lo lleva a la otra orilla

#### Scenario: En el móvil
- **WHEN** el niño está en el muelle en un móvil horizontal de 844×390
- **THEN** ve los tres bloques y los asientos de la barca sin que los tapen los controles

### Requirement: Barca según la edad
La capacidad SHALL adaptarse a la franja de edad: barca de 5 de 3 a 4 años, de 10 de 5 a 6 años y doble (20) de 7 a 8 años. Siempre SHALL haber al menos un patito sentado y al menos un asiento libre.

#### Scenario: Perfil de 4 años
- **WHEN** un perfil de 4 años llega a una barca
- **THEN** la barca tiene 5 asientos y los bloques muestran de 1 a 4 puntos

### Requirement: Escalera de fallos de la barca
Un fallo en la barca SHALL NOT quitar galletas. El primero SHALL hacer que el bloque se tambalee y que sus patitos suban, no quepan o no basten, y vuelvan al muelle; el segundo, que los asientos vacíos parpadeen de uno en uno; el tercero, que Lalo señale el bloque correcto y la barca se llene.

#### Scenario: Primer fallo con demasiados
- **WHEN** a la barca le faltan 3 y el niño golpea el bloque de 5
- **THEN** suben patitos hasta llenar los asientos, los que sobran se quedan sin sitio y todos vuelven al muelle

### Requirement: El lago no se salta
El agua libre del lago SHALL ser más ancha que lo que alcanza un salto normal desde la orilla, desde un bloque del reto o desde la barca.

#### Scenario: Saltar desde la barca
- **WHEN** el niño salta desde la barca sin haberla llenado
- **THEN** cae al agua y rebota hacia la barca
