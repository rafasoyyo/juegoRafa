# Proposal

## Why

Paso 4 del plan del mundo 1 (`docs/MUNDO-1.md`, «El final»). Al pintar el último gajo, el viaje del arcoíris tiene que cerrarse y enlazar con el mundo 2: donde hay arcoíris ha llovido, y esa lluvia hace nacer el río. Para los menores de 6 años es además el momento en que se abre el río, y así ven por qué se abre.

## What Changes

- **Final sin texto en el mapa**, una vez por perfil, al volver al mapa con los 12 niveles del mundo de los números hechos o pendientes, tras pintarse el gajo 12: Rufo salta de alegría en la nube; en una viñeta grande, la nube de la cima llueve sobre la montaña nevada; una gota baja al manantial y nace el río. Unos 6 segundos; un toque lo salta.
- **Para menores de 6 años**, al final el candado del botón del río salta y el botón se enciende: es cuando se abre el mundo 2. Con 6 años o más el río ya estaba abierto y no hay animación del botón.
- Queda marcado en el perfil (`final:arcoiris`) y no se repite.
- Datos del mundo: `WorldDef.finale`. Los mundos que se abren con él son los que tienen `gate.after` en este mundo.

Habilidad educativa: ninguna directa; cierra la historia del mundo 1 y abre la del río.

**Fuera de alcance:** el castillo del arcoíris (paso 5), voz grabada, sonidos nuevos (se reutilizan los que hay).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `world-map`: el final del arcoíris en el mapa y la apertura animada del río.

## Impact

- `src/game/story/story.ts` (`shouldPlayFinale`) y `src/game/worlds/access.ts` (`opensAfter`), con pruebas.
- `src/game/story/finale.ts` (nuevo, Phaser).
- `src/game/scenes/MapScene.ts`, `src/game/worlds/types.ts`, `arcoiris/index.ts`.
