# Proposal

## Why

Paso 4 del plan del mundo 2 (`docs/MUNDO-2.md`, «B. El puente de los números»): la recta numérica entra en el recorrido. Cada número tiene su sitio, entre el anterior y el siguiente, y el niño lo descubre colocando la tabla que falta en un puente.

## What Changes

- **Mecánica B, «El puente de los números»**, sobre el motor de retos del paso 3: un puente de 5 tramos numerados sobre el agua al que le falta uno. Desde los tramos firmes, el niño golpea el bloque con el número del hueco; la tabla vuela a su sitio, suena una escala y el puente se puede cruzar.
- **El hueco corta el paso**: es más ancho que un salto, también desde encima de un bloque. Quien cae al agua rebota fuera por donde entró, como en los fosos, sin perder galletas.
- **Según la edad**: 3-4 años, el siguiente de 1 a 5 con puntos; 5-6 años, el anterior o el siguiente de 1 a 10; 7-8 años, cualquier hueco de una serie de 2 en 2 entre 0 y 20.
- **Escalera de fallos de B**: el bloque se tambalea y el hueco parpadea; luego los tramos se encienden de uno en uno desde el primero, con un saltito, hasta el hueco; al tercer fallo Lalo señala el bloque y la tabla se coloca sola.
- **Datos y validación**: `"kind": "bridge"` en `challenges`, con su zona libre. El motor de retos pasa a tener una parte común (bloques, escalera, Lalo) y una vista por mecánica.
- **Sonido** `scale`: escala de notas que sube al colocar la tabla.
- **Borrador**: el nivel 2 del río con retos B, para probarlo en desarrollo.

Habilidad educativa: **número** (recta numérica, anterior y siguiente, contar de 2 en 2).

**Fuera de alcance:** la barca (paso 5), los enemigos del río (paso 6), los recorridos definitivos (paso 9), la demostración de B (llegará con el contenido del nivel 4), cambiar el puente en el mundo 1.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `course-challenges`: nueva mecánica B con su escalera de fallos.
- `level-courses`: retos de tipo puente en los datos y su zona.
- `platformer-level`: el hueco del puente es un hueco del suelo del que se sale rebotando, sin coste.
- `game-audio`: escala al colocar la tabla.

## Impact

- `src/learning/challenges/bridge.ts` (nuevo) y pruebas.
- `src/game/levels/types.ts`, `parse.ts`, `validate.ts`, `duration.ts`.
- `src/game/challenges/` : base común `ChallengeView`, `CountChallengeView` y `BridgeChallengeView` (nueva).
- `src/game/scenes/LevelScene.ts`: huecos de agua en el suelo, rebote sin coste y tabla que lo cierra.
- `src/game/audio/sfx.ts`: efecto `scale`.
- `content/levels/rio/nivel-2.json` y la definición del río.
