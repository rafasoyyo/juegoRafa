# Spec Delta

## ADDED Requirements

### Requirement: Botón de silencio en el mapa
La barra superior del mapa SHALL mostrar, a la izquierda del botón de mi personaje, un botón redondo
del mismo tamaño con el icono del altavoz. Tocarlo SHALL alternar el silencio total: en silencio el
icono SHALL verse como altavoz tachado, sin depender solo del color.

#### Scenario: Activar el silencio
- **WHEN** el niño toca el botón del altavoz con el sonido activo
- **THEN** el juego se calla y el icono pasa a altavoz tachado

#### Scenario: Volver a activar el sonido
- **WHEN** el niño toca el botón del altavoz tachado
- **THEN** vuelve a sonar la música del mapa y el icono pasa a altavoz normal

#### Scenario: Pantalla estrecha
- **WHEN** el mapa se abre en un móvil horizontal de proporción 4:3
- **THEN** el botón del altavoz se ve completo, con zona táctil de al menos 96 px, sin tapar el contador de galletas ni el camino de niveles
