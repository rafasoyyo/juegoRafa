# Proposal

## Why

Paso 9 del plan del mundo 3 (`docs/MUNDO-3.md`): con los cuatro retos, los enemigos, las pruebas, el huevo y el castillo hechos, falta el contenido de la isla y abrirla en el juego publicado.

## What Changes

- **12 paisajes de la isla**: playa negra, helechos, charcas y géiseres, huellas gigantes, cascada templada, pantano de noche, valle de los cuellos largos, columnas de roca, yacimiento de fósiles, cueva de cristales, ríos de lava y borde del cráter. Paleta oscura de expedición, con el gran volcán humeando al fondo y decoración propia (helechos, géiseres, ruinas, luciérnagas, basalto, cristales y brasas).
- **La lava como dibujo de los fosos**: en la isla, el fondo del foso es un charco de lava redondeado en lugar de pinchos. Se juega igual (rebote y una galleta menos) y sisea.
- **12 recorridos** en `content/levels/isla/`, según la tabla de `docs/MUNDO-3.md`, con la demostración de Lalo la primera vez de cada reto (A en el 1, B en el 4, C en el 7 y D en el 9).
- **Mapa del volcán**: dos pantallas de la playa al cráter, con el huevo encima de los niveles del medio y el nido (el castillo) en el cráter del gran volcán.
- **Apertura**: se quita el interruptor `mundo-3-isla`. La isla se abre con 7 años o más o al llegar al nivel 12 del río.

**Fuera de alcance:** la llegada de la barca al nivel 1 (prólogo de la isla), la mamá que asoma al fondo del nivel 12, las hojas gigantes como plataformas y las columnas de hexágonos como escalones; pueden llegar después. La prueba con niños es el paso 10.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `level-courses`: los recorridos y paisajes de la isla, y los charcos de lava.
- `world-map`: mapa del volcán, castillo con su propio dibujo y fin del interruptor de la isla.
- `visual-style`: paleta y decoración del mundo 3.

## Impact

- `content/levels/isla/nivel-1.json` a `nivel-12.json`; `src/game/levels/types.ts`, `ambients.ts` y `spikes.ts`.
- `src/game/ui/widgets.ts` (volcán, mar oscuro, luces), `BootScene.ts` (texturas de la isla), `LevelScene.ts` (charcos de lava), `quiz-art.ts` (miniaturas).
- `src/game/castle/castle.ts` (`CastleDef.icon`), `MapScene.ts`, `QuizScene.ts`, `public/assets/svg/nest.svg`.
- `src/game/worlds/isla/index.ts`, `flags.ts`.
- Pruebas: `worlds.test.ts`, `access.test.ts`.
