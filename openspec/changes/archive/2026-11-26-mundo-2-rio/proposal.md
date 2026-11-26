# Proposal

## Why

Paso 9 del plan del mundo 2 (`docs/MUNDO-2.md`): con las mecánicas, los enemigos, las pruebas y el castillo hechos, falta el contenido del río y abrirlo en el juego publicado.

## What Changes

- **12 paisajes del río**: manantial, arroyo, cascada, molino, cañaveral, lago de noche, embarcadero, puente, huertas, lluvia, puerto y desembocadura. Cada uno con su cielo, colinas y suelo, y con la decoración del mundo 1.
- **12 recorridos** en `content/levels/rio/`, según la tabla de `docs/MUNDO-2.md`: de 3 a 5 retos, la demostración de Lalo la primera vez de cada mecánica (niveles 1, 4 y 7), escalones desde el 2, fosos desde el 4, plataformas desde el 5, y de 90 a 150 s con calma.
- **Mapa del río**: dos pantallas con un río que acompaña al camino del manantial a la desembocadura y el castillo al final.
- **Apertura**: se quita el interruptor `mundo-2-rio` del río. Sigue abierto con 6 años o más o al llegar al nivel 12 del mundo 1.

**Fuera de alcance:** decoración propia del río (molino, cascada, lluvia), que podría llegar después, y la prueba con niños (paso 10).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `level-courses`: los recorridos y paisajes del río.
- `world-map`: mapa del río y fin del interruptor del río.

## Impact

- `content/levels/rio/nivel-1.json` a `nivel-12.json`; `src/game/levels/types.ts` y `ambients.ts` (paisajes).
- `src/game/worlds/rio/index.ts` (tablas completas, mapa, castillo en la desembocadura, sin interruptor), `types.ts` y `MapScene.ts` (río del mapa), `flags.ts`.
- Pruebas: `worlds.test.ts`, `access.test.ts`, `ambients.test.ts`.
