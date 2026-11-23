# visual-style Specification

## Purpose
Fijar el aspecto común de todas las pantallas del juego (estilo, paleta, tipografía, escalado y
origen de los gráficos) para que el niño reconozca el mundo del juego y todo se pueda publicar.

## Requirements

### Requirement: Estilo vectorial plano y redondeado
Todas las pantallas SHALL usar formas planas de bordes redondeados, sin contornos negros ni texturas
pixeladas, con la paleta del diseño: cielo `#8FD3FF`→`#E6F6FF`, hierba `#5CC46B`, tierra `#C98A58`,
amarillo `#FFD23F`, coral `#FF6B5E`, morado `#7B5EA7`, naranja zorro `#F28C28` y tinta `#2B2340`.

#### Scenario: Revisión visual de una pantalla
- **WHEN** se abre cualquier pantalla del juego en un móvil horizontal
- **THEN** los gráficos se ven nítidos, con bordes suaves y los colores de la paleta

### Requirement: Escalado sin bandas a alta resolución
El juego SHALL renderizar a 720 px lógicos de alto y SHALL adaptar el ancho lógico a la proporción de
la pantalla entre 4:3 y 21:9, sin bandas negras y con los elementos del HUD anclados a los bordes.

#### Scenario: Móvil alargado
- **WHEN** se abre el juego en un móvil de 844×390
- **THEN** el juego ocupa toda la pantalla y los botones quedan junto a los bordes izquierdo y derecho

#### Scenario: Tableta
- **WHEN** se abre el juego en un iPad horizontal de 1180×820
- **THEN** el juego ocupa toda la pantalla sin bandas y sin recortar el HUD

### Requirement: Botones con relieve
Todo botón SHALL ser una forma redondeada de al menos 96 px lógicos de lado con una sombra inferior
sólida, y SHALL hundirse visiblemente mientras se pulsa.

#### Scenario: Pulsar un botón
- **WHEN** el niño pulsa cualquier botón
- **THEN** el botón baja y su sombra se reduce mientras el dedo está encima

### Requirement: Sin texto que leer
Ninguna pantalla SHALL mostrar palabras. Solo se permiten iconos, dibujos, dígitos y los símbolos de
los mundos (`123`, `Aa`).

#### Scenario: Celebración
- **WHEN** el niño completa un nivel
- **THEN** la celebración usa estrellas, confeti y el zorro, sin ninguna palabra escrita

### Requirement: Gráficos y fuentes propios o libres, servidos localmente
Todos los gráficos SHALL ser propios o de licencia libre con la licencia anotada en el repositorio, y
gráficos y fuentes SHALL servirse desde la propia aplicación, sin CDN, para que funcionen sin conexión.

#### Scenario: Juego sin conexión
- **WHEN** la PWA instalada se abre sin conexión después de una primera visita
- **THEN** los gráficos y los números se ven con la tipografía del juego

#### Scenario: Revisión de licencias
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** cada gráfico y fuente aparece con su origen y licencia
