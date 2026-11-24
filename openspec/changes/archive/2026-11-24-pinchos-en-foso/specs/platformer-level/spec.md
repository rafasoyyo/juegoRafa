## MODIFIED Requirements

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
