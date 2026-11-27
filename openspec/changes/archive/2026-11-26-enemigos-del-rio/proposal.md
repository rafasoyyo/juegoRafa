# Proposal

## Why

Paso 6 del plan del mundo 2 (`docs/MUNDO-2.md`, «La rana y el cangrejo»): el río tiene sus propios enemigos, que se suman al erizo y a la abeja con las mismas reglas amables.

## What Changes

- **Rana** (desde el nivel 3 del río): salta en el sitio con un ritmo fijo. Antes de cada salto se agacha y tiembla un poco, para avisar. Se pasa por debajo mientras está en el aire o se salta por encima mientras está quieta.
- **Cangrejo** (desde el nivel 7 del río): anda de lado por un tramo corto, más despacio que el erizo, moviendo las pinzas.
- **Tipos por mundo**: las reglas de enemigos de cada mundo dicen qué tipos salen y desde qué nivel; cada enemigo elige al azar entre los que ya han llegado. El mundo 1 sigue igual (erizo desde el 1 y abeja desde el 2, mitad y mitad, con los mismos repartos).
- Como el resto, nunca junto a un reto ni a un bloque, y tocarlos es el pinchazo de siempre.
- **Arte propio**: `frog.svg` y `crab.svg`, anotados en `LICENSES.md`.

**Fuera de alcance:** los recorridos definitivos del río (paso 9), cambiar los enemigos del mundo 1.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `level-enemies`: rana y cangrejo, y tipos de enemigo por mundo.

## Impact

- `src/game/enemies/enemy-motion.ts`, `enemy-layout.ts`, `enemy-views.ts` y sus pruebas.
- `src/game/worlds/arcoiris/index.ts` y `rio/index.ts` (reglas `kinds`).
- `src/game/scenes/BootScene.ts`, `LevelScene.ts` (recuento por tipo).
- `public/assets/svg/frog.svg`, `crab.svg`, `public/assets/LICENSES.md`.
