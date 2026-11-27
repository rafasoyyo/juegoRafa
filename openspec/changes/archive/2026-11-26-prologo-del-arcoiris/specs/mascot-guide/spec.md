## ADDED Requirements

### Requirement: Prólogo del arcoíris
La primera vez que un perfil sin progreso en el mundo de los números entra en su nivel 1, antes de que el niño pueda mover a Rufo, el juego SHALL mostrar un prólogo sin texto de unos 4 segundos: Rufo asoma de la madriguera y se despereza, Lalo vuela a su lado y señala hacia la derecha, el arcoíris del horizonte destella con un tintineo de 6 notas y Rufo da un salto de alegría. Al acabar, el niño SHALL poder jugar.

#### Scenario: Perfil nuevo
- **WHEN** un perfil nuevo entra en el nivel 1 del mundo de los números
- **THEN** ve el prólogo y, al acabar, puede mover a Rufo

#### Scenario: Sin mover durante el prólogo
- **WHEN** el niño pulsa las flechas durante el prólogo
- **THEN** Rufo no se mueve hasta que el prólogo acaba

### Requirement: Saltar el prólogo
Un toque en la pantalla durante el prólogo SHALL acabarlo al instante: Lalo vuelve a su sitio y el niño puede jugar.

#### Scenario: Toque
- **WHEN** el niño toca la pantalla a mitad del prólogo
- **THEN** el prólogo acaba y Rufo se puede mover
