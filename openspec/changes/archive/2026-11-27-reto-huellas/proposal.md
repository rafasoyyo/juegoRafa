# Proposal

## Why

Paso 1 del plan del mundo 3 (`docs/MUNDO-3.md`, «A. El camino de huellas»): las series entran en el recorrido de la isla. Lo que se repite deja adivinar lo que viene, y el niño lo descubre colocando la losa que falta en un puente en ruinas sobre la lava.

## What Changes

- **Reto A de la isla, «El camino de huellas»**, sobre el motor de retos del río y con la geometría del puente de los números: 5 losas sobre un río de lava, una tablilla grabada sobre cada losa que sigue una serie de formas y una losa que falta. Desde las losas firmes, el niño golpea el bloque de piedra con la forma que sigue; la losa sube de la lava y encaja con un golpe de piedra, los grabados se encienden uno tras otro con su nota y el puente se puede cruzar.
- **Según la edad**: 3-4 años, AB con círculos de colores; 5-6 años, AB, ABB y AAB con formas de un solo color; 7-8 años, ABC y series que crecen (una forma más en cada losa).
- **Escalera de fallos de A**: el bloque se tambalea y el hueco parpadea; luego las tablillas se encienden de una en una con su nota y en el hueco suena el silencio; al tercer fallo Lalo señala el bloque y la losa sube sola.
- **Demostración de Lalo** en el primer reto del nivel 1: la melodía de la serie y Lalo señalando.
- **Sonidos** `stone` (golpe seco de piedra) y `glyph` (campana de piedra, una nota por forma).
- **Grabados y bloques de piedra**: formas que se iluminan en turquesa, ámbar u óxido, sin contornos negros, y bloques de piedra con borde dorado.
- **Borrador de la isla** tras el interruptor de desarrollo `mundo-3-isla`: el botón de formas del selector abre el mundo 3 con su nivel 1 (tres caminos de huellas) en un ambiente provisional de playa negra. Puerta: 7 años o más, o el nivel 12 del río.

Habilidad educativa: **patrones** (series de repetición y series que crecen).

**Fuera de alcance:** los retos B, C y D (pasos 2 a 4), los enemigos de la isla (paso 5), sus pruebas de la bandera (paso 6, mientras tanto «Sigue la serie»), el huevo del mapa (paso 7), el castillo (paso 8), los 12 recorridos, los ambientes y el mapa definitivos (paso 9).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `course-challenges`: reto A de la isla con su escalera de fallos.
- `level-courses`: caminos de huellas en los datos y su zona.
- `game-audio`: golpe de piedra y nota de cada grabado.
- `world-map`: la isla en construcción tras un interruptor de desarrollo.

## Impact

- `src/learning/challenges/footprints.ts` (nuevo) y pruebas.
- `src/game/levels/types.ts`, `duration.ts`, `ambients.ts` (ambiente provisional `playa-negra`).
- `src/game/challenges/`: `glyphs.ts` y `footprints-challenge-view.ts` (nuevos); `ChallengeView.addBlockViews` para bloques con otro dibujo.
- `src/game/scenes/LevelScene.ts`, `src/game/audio/sfx.ts`, `src/game/flags.ts`.
- `src/game/worlds/isla/index.ts`, `registry.ts` y `content/levels/isla/nivel-1.json`.
