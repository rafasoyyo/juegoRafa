# Design

## Context

El paso 3 dejó el motor de retos: datos en `challenges`, lógica pura en `src/learning/challenges/` y la vista de la mecánica A en `src/game/challenges/`. El rebote de los fosos (`spikes.ts`, `LevelScene.checkSpikes`) ya saca a Rufo de un hueco del suelo.

## Decisions

### Geometría

Un puente de `BRIDGE_SECTIONS` = 5 tramos de `BRIDGE_SECTION` = 3,5 baldosas desde `x` (borde izquierdo). El hueco mide un tramo: 294 px. Un salto normal recorre unas 3,07 baldosas desde el suelo; desde encima de un bloque (base a 141 px) el zorro llega unas 3,8 baldosas más allá. Por eso los bloques van a 1,5, 3 y 4,5 baldosas antes del hueco (centros) y el hueco siempre tiene al menos dos tramos firmes delante. La zona del reto va de `x - 1` a `x + 18,5`.

### Lógica pura

`bridgeChallenge(band, rng)` da los 5 valores, el índice del hueco (2 a 4), qué tramos se ven, las caras (puntos para los pequeños, cifras para el resto) y las tres opciones. Reutiliza `ladder.ts` tal cual.

### Vista común

`ChallengeView` (base) crea los bloques con cara, enruta los golpes a la escalera, aplica el enfriamiento, el tambaleo y la llamada a Lalo. Cada mecánica implementa `hintOne`, `hintTwo` y `solve`. `CountChallengeView` pasa a heredar de ella sin cambiar su comportamiento.

### Hueco de agua

`LevelScene` pide a los retos sus huecos antes de dibujar el escenario: se cortan los tramos de suelo y se añade un fondo como en los fosos. `checkSpikes` mira pinchos y huecos abiertos; en un hueco el rebote no cuesta galleta ni da protección. Al resolver, el puente añade una zona estática que tapa el hueco y lo saca de la lista.

## Risks / Trade-offs

- [Un niño intenta saltar el hueco una y otra vez] → Rebota siempre fuera sin coste; el hueco parpadea en el primer fallo para mirar al número.
- [Puentes largos (unas 20 baldosas) alargan el nivel] → Se cuenta en la duración estimada (10 s por puente).
