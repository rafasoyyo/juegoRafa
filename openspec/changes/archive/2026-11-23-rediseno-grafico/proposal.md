# Proposal

## Why

El arte de la fase 0 es un placeholder pixel art de 400×225 generado por código. Ya existe un diseño
validado de las pantallas del juego (lienzo «Juego educativo - diseños»: nivel, mapa, nivel completado
y mi personaje) con un estilo vectorial plano y redondeado, colores suaves y botones grandes, mucho
más cercano a lo que atrae y entiende un niño de 4 a 6 años. Conviene adoptarlo antes de la fase 2,
para que los retos educativos se construyan ya sobre el aspecto definitivo y sobre la navegación real
entre pantallas.

## What Changes

- **BREAKING (visual)**: se abandona el pixel art de baja resolución. El juego pasa a un estilo
  vectorial plano y redondeado a alta resolución (lógica de 720 px de alto, ancho adaptable al
  dispositivo), con la paleta, la tipografía (Baloo 2) y las formas del diseño.
- **BREAKING (personaje)**: el protagonista pasa a ser el **zorro** del diseño, en lugar del niño.
  Se actualizan `docs/PROPUESTA.md`, `openspec/config.yaml` y las specs.
- Nivel rediseñado: cielo en degradado, nubes y colinas redondeadas con paralaje, suelo de hierba y
  tierra, bloques «?» amarillos redondeados, bandera, zorro con animaciones simples (andar, saltar,
  celebrar).
- HUD del nivel sin texto: botón de casa (vuelve al mapa), barra de progreso con la cara del zorro
  hacia la bandera, contador de monedas y **Lalo el búho** como mascota guía con un botón de altavoz
  en lugar del bocadillo de texto.
- Botones táctiles con el aspecto del diseño: círculos grandes con sombra inferior que se hunden al
  pulsarlos. La lógica por zonas no cambia.
- Pantallas nuevas como escenas de Phaser, sin persistencia todavía (estado en memoria):
  - **Mapa del mundo**: camino con 6 niveles (hechos con estrellas, actual destacado, bloqueados con
    candado), el zorro sobre el nivel actual, selector de mundos con el mundo 1 activo y el resto
    bloqueados, y acceso a «mi personaje».
  - **Nivel completado**: confeti, estrellas (1 a 3), zorro celebrando, premio si lo hay y botones
    de mapa, siguiente nivel y repetir.
  - **Mi personaje**: escaparate con el zorro, categorías y rejilla de gorros; los gorros se compran
    con monedas y el elegido se ve en el nivel y en el mapa.
- Pantalla inicial «toca para jugar» con el zorro, que además desbloquea el audio en iOS.
- Fuentes y gráficos servidos desde el propio proyecto (sin CDN) y precacheados por la PWA.

**Habilidad educativa**: ninguna directamente. Es la base visual y de navegación sobre la que la fase 2
montará los retos de cantidad y número.

**Fuera de alcance**:
- Retos educativos: bloques con números, misión «4 + 3 = 7», pistas y voz (fase 2). La suma del
  diseño no se implementa: el currículo trabaja lo previo a sumar.
- Pantallas de **nivel de letras** y **panel de padres** del diseño (fases 5 y 6).
- Persistencia del progreso, monedas y gorros (fase 3, Firestore). Se pierden al recargar.
- Contenido distinto por nivel: los 6 nodos del mapa cargan el mismo recorrido hasta la fase 4.
- Gafas, capas y colores del personaje: las categorías se muestran pero solo los gorros funcionan.
- Iconos de la PWA con el zorro, música y efectos de sonido.

## Capabilities

### New Capabilities
- `visual-style`: estilo gráfico común (paleta, tipografía, formas redondeadas, resolución y
  escalado, assets locales con licencia) y la prohibición de texto que haya que leer.
- `world-map`: mapa del mundo con niveles, estados (hecho, actual, bloqueado), selector de mundos y
  navegación al nivel y a mi personaje.
- `level-complete`: pantalla de nivel completado con estrellas, premio y navegación.
- `character-wardrobe`: personalización del zorro con gorros comprados con monedas.
- `mascot-guide`: Lalo el búho, mascota guía visible en el nivel y el mapa, con botón de altavoz.

### Modified Capabilities
- `platformer-level`: la presentación deja de ser pixel art 400×225; el personaje es el zorro; la
  meta lleva a la pantalla de nivel completado en vez de reiniciar el nivel; el HUD tiene casa,
  progreso y monedas.
- `touch-controls`: se añade el aspecto y tamaño mínimo de los botones táctiles y su respuesta
  visual al pulsar.

## Impact

- Código: `src/main.ts` (escalado `EXPAND`, sin `pixelArt`), `src/game/config.ts`,
  `src/game/scenes/BootScene.ts` (carga de SVG y fuentes), `LevelScene.ts` (constantes físicas
  reescaladas, HUD, meta), `src/game/ui/touch-controls.ts`; escenas nuevas `TitleScene`,
  `MapScene`, `LevelCompleteScene`, `WardrobeScene`; estado en memoria `src/game/state.ts`.
- Assets: SVG propios en `public/assets/svg/` extraídos del diseño; fuente Baloo 2 (SIL OFL) en
  `public/fonts/`; registro de licencias en `public/assets/LICENSES.md`.
- `index.html` (sin `image-rendering: pixelated`, `@font-face`), `vite.config.ts` (precache de
  `woff2`).
- Documentación: `docs/PROPUESTA.md` y `openspec/config.yaml` (estilo, personaje, resolución).
- Sin dependencias nuevas.
