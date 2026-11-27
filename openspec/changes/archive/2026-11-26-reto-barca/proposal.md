# Proposal

## Why

Paso 5 del plan del mundo 2 (`docs/MUNDO-2.md`, «C. La barca de diez»): los amigos del 10. El niño descompone un número viendo cuántos asientos le faltan a una barca que solo zarpa llena.

## What Changes

- **Mecánica C, «La barca de diez»**, sobre el motor de retos: una barca en la orilla de un lago con los asientos en forma de marco y algunos patitos ya sentados. En el muelle hay tres bloques con puntos; el niño golpea el que completa la barca. Los patitos suben de uno en uno contándose, la barca toca la bocina y, cuando Rufo se sube, cruza el lago y lo deja en la otra orilla.
- **Pieza nueva del motor: una plataforma que se mueve.** Mientras la barca navega, Rufo va encima sin control y no se puede caer.
- **El lago corta el paso**: el agua libre es más ancha que un salto, también desde la barca o desde un bloque. Quien cae al agua rebota fuera por donde entró, sin perder galletas.
- **Según la edad**: 3-4 años, barca de 5; 5-6 años, barca de 10; 7-8 años, barca doble (20).
- **Escalera de fallos de C**: los patitos del bloque fallado suben, no caben o no bastan, y vuelven al muelle; luego los asientos vacíos parpadean de uno en uno; al tercer fallo Lalo señala el bloque y la barca se llena.
- **Datos y validación**: `"kind": "boat"` en `challenges`, con su zona libre (muelle y lago).
- **Sonido** `horn`: la bocina de la barca al zarpar.
- **Borrador**: un nivel 3 del río con retos C, para probarlo en desarrollo.

Habilidad educativa: **número** (los amigos del 5, del 10 y del 20; descomponer).

**Fuera de alcance:** los enemigos del río (paso 6), los recorridos definitivos (paso 9), cambiar nada del mundo 1.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `course-challenges`: nueva mecánica C con su escalera de fallos.
- `level-courses`: retos de tipo barca en los datos y su zona.
- `platformer-level`: plataforma que se mueve y lleva al zorro; el lago es un hueco de agua sin coste.
- `game-audio`: bocina de la barca.

## Impact

- `src/learning/challenges/boat.ts` (nuevo) y pruebas.
- `src/game/levels/types.ts`, `parse.ts`, `duration.ts` (la validación usa `challengeZone`).
- `src/game/challenges/boat-challenge-view.ts` (nueva); `challenge-view.ts` pasa el bloque fallado a la primera pista.
- `src/game/scenes/LevelScene.ts`: huecos de agua que cambian con el reto, zorro llevado por la barca.
- `src/game/audio/sfx.ts`: efecto `horn`.
- `content/levels/rio/nivel-3.json` y la definición del río.
