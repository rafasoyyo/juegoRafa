# Spec Delta

## MODIFIED Requirements

### Requirement: Estilo vectorial plano y redondeado
Todas las pantallas SHALL usar formas planas de bordes redondeados, sin contornos negros ni texturas
pixeladas, con la paleta del diseño: cielo `#8FD3FF`→`#E6F6FF`, hierba `#5CC46B`, tierra `#C98A58`,
amarillo `#FFD23F`, coral `#FF6B5E`, morado `#7B5EA7`, naranja zorro `#F28C28` y tinta `#2B2340`.
Los ambientes de los niveles MAY cambiar el cielo, las colinas, la hierba, la tierra y la decoración
del fondo con tonos propios del ambiente; el zorro, los bloques «?», la bandera, los menús y el HUD
SHALL mantener siempre la paleta del diseño.

#### Scenario: Revisión visual de una pantalla
- **WHEN** se abre cualquier pantalla del juego en un móvil horizontal
- **THEN** los gráficos se ven nítidos, con bordes suaves y los colores de la paleta

#### Scenario: HUD en un ambiente distinto
- **WHEN** se abre el nivel 5, con el ambiente de atardecer
- **THEN** el cielo y las colinas tienen tonos de atardecer, pero el botón de casa, la barra de progreso, el contador de galletas, el zorro y los bloques tienen los mismos colores que en el nivel 1
