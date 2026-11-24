# Spec Delta

## ADDED Requirements

### Requirement: Un solo arcoíris en todo el juego
Todo arcoíris del juego SHALL ser el mismo dibujo: un semicírculo de 6 bandas pastel (`#FF9B93`, `#FFC27A`, `#FFE58A`, `#9FDC8F`, `#8FC7F2`, `#B9A6EE`, de fuera adentro), plano y sin contorno. SHALL verse nítido, sin bordes borrosos ni dentados, a cualquier tamaño al que el juego lo muestre, para que el niño reconozca siempre el mismo arcoíris.

#### Scenario: El mismo arcoíris en el nivel y en la prueba
- **WHEN** se ve el arcoíris del nivel 12 y después la miniatura del ambiente de nubes en la prueba de la bandera
- **THEN** los dos tienen las mismas 6 bandas, en el mismo orden y con los mismos colores

#### Scenario: Arcoíris grande nítido
- **WHEN** se abre el nivel 12 en un iPad horizontal de 1180×820
- **THEN** las bandas del arcoíris tienen los bordes limpios, sin verse borrosas ni pixeladas
