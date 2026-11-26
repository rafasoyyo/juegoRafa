# Proposal

## Why

Paso 2 del plan del mundo 1 (`docs/MUNDO-1.md`, «3. El mapa del arcoíris»). El mapa del mundo de los números es hoy un camino con árboles sobre un cielo fijo: no cuenta adónde va Rufo. Con un arcoíris de 12 gajos que se va pintando, el niño ve sin leer cuánto le falta para llegar, y el mapa queda listo para el prólogo (paso 3) y el final (paso 4), que parten de él.

## What Changes

- **El camino sale de la madriguera**: a la izquierda del nivel 1 hay una madriguera en la colina y el camino sube hacia la derecha, con un tramo bajo junto al mar en el nivel 7.
- **El cielo cuenta el día**: el cielo del mapa cambia a lo ancho, del día (niveles 1 a 4) al atardecer (5) y la noche con luna y estrellas (6), amanece en la playa (7) y acaba en el cielo lila de las nubes (12).
- **Arco de 12 gajos**: sobre los últimos niveles hay un arcoíris partido en 12 gajos, uno por nivel, que se pintan de izquierda a derecha. Un gajo está pintado si su nivel está hecho o pendiente; sin pintar se ve como una silueta blanca y clara. Un nivel terminado con 0 estrellas no pinta su gajo, porque no queda superado.
- **Animación del gajo nuevo**: al volver al mapa tras terminar un nivel por primera vez, el mapa se desliza hasta el arco, el gajo se colorea banda a banda, de fuera adentro, con una nota por banda (6 en total) y unos destellos, vuelve al zorro y este salta del nivel terminado al siguiente. Un toque en la pantalla la acaba al instante.
- **Sonido** `band`: la nota de cada banda, más aguda de fuera adentro.
- Una función pura decide qué gajos están pintados y cuáles hay que animar, probada sin Phaser.
- El arco, la madriguera y el cielo a lo ancho son datos del mapa del mundo (`WorldDef.map`); el mapa del río no cambia.

Habilidad educativa: ninguna directa. Refuerza la idea de avance y de serie (12 gajos, de izquierda a derecha).

**Fuera de alcance:** el prólogo y tocar la madriguera para verlo (paso 3), el final de la lluvia y lo que pasa con 12 gajos (paso 4), el castillo del arcoíris (paso 5), cambiar niveles, ambientes, pruebas o estrellas, y el mapa de otros mundos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `world-map`: el mapa del mundo de los números tiene madriguera, cielo que cambia a lo ancho y arco de 12 gajos con su animación.
- `game-audio`: nota de cada banda al pintarse un gajo.

## Impact

- `src/game/worlds/types.ts`: campos nuevos opcionales de `WorldMap` (arco, cielo a lo ancho).
- `src/game/worlds/arcoiris/index.ts`: nodos, adornos, cielo y arco del mapa.
- `src/game/map/rainbow-arc.ts` (nuevo, TypeScript puro) y `map-sky.ts` (nuevo, TypeScript puro), con sus pruebas.
- `src/game/scenes/MapScene.ts`: cielo a lo ancho, arco, animación y salto del zorro.
- `src/game/scenes/BootScene.ts`: textura de la madriguera.
- `src/game/audio/sfx.ts`: efecto `band`.
