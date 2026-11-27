# Design

## Context

El río dejó el motor de retos: datos en `challenges`, lógica pura en `src/learning/challenges/` (con la escalera de fallos de `ladder.ts`) y una vista por mecánica sobre `ChallengeView`. El puente de los números ya resuelve un hueco que no se salta, con el rebote sin coste y la tabla que lo cierra. `docs/MUNDO-3.md` pide que el reto A use esa misma pieza.

## Goals / Non-Goals

**Goals:** reto A jugable en un borrador del nivel 1 de la isla, con el aspecto de expedición (piedra, lava, grabados que se iluminan) y la melodía de la serie como pista.

**Non-Goals:** el ambiente y el mapa definitivos de la isla, los enemigos y las pruebas propias.

## Decisions

### Misma geometría que el puente

`kind: "footprints"` ocupa lo mismo que `bridge` (`challengeZone`): 5 losas de 3,5 baldosas desde `x`, hueco de una losa y bloques a 1,5, 3 y 4,5 baldosas antes del hueco. Se reutilizan `bridgeHole`, la validación, la colocación de enemigos y la duración (10 s con calma por reto). Caer al hueco hace rebotar fuera sin galleta, como el agua del puente: fallar un reto nunca cuesta galletas (la lava que cuesta una es la de los charcos, que llega con los ambientes del paso 9).

### Lógica pura

`footprintsChallenge(band, rng)` da el patrón, el grabado de las 5 losas (`Glyph`: forma, color del grabado y cuántas formas), el índice del hueco, la nota de cada losa y las tres opciones. El hueco deja siempre una vuelta entera de la serie delante (con AB, dos vueltas a la vista para los pequeños): AB, del 3.º al 5.º hueco según la franja; ABB, AAB y ABC, 4.º o 5.º; las que crecen, del 3.º al 5.º. Las opciones son la respuesta, los otros elementos de la serie y, si la serie solo tiene dos, uno que no sale. En las que crecen, una forma menos y una más (o dos menos si la respuesta es la última).

- Pequeños: círculos de dos colores, porque la propuesta pide «AB con colores»; los tres colores de los grabados contrastan también en luminosidad.
- Medianos y mayores: formas de un solo color, para que se distingan por la forma.

### Tablillas en un dintel

Las formas no caben legibles en el canto de una losa vista de lado. Igual que la recta colgada del puente, van en tablillas de piedra de 100 px bajo un dintel sobre dos columnas, por encima de los bloques: el niño ve la serie entera desde las losas firmes en un móvil de 844×390.

### Rendimiento

La losa y la tablilla se dibujan una vez en texturas compartidas (`isla-losa`, `isla-tablilla`) y se muestran como imágenes. La lava y las ruinas de cada reto son un `Graphics` estático pequeño trazado al crear la escena; cuando llegue `ui/bake.ts` (PR del rendimiento) se podrán hornear con él.

### Borrador de la isla

Como el río en su paso 2: `src/game/worlds/isla/index.ts` con solo el nivel 1, ambiente provisional `playa-negra`, la prueba «Sigue la serie», el erizo y la abeja, y la puerta `{ flag: 'mundo-3-isla', openAge: 7, after: rio 12 }`. El botón de formas deja de ser un hueco de `UPCOMING`; en el juego publicado el interruptor está apagado y sigue temblando.

## Risks / Trade-offs

- [Un niño de 4 años no ve la serie] → La pista de la melodía y la prueba con niños (★ del plan) deciden antes de construir B, C y D.
- [Colores para pequeños y daltonismo] → Turquesa, ámbar y óxido con luminosidades distintas; la prueba con niños dirá si hace falta añadir forma.
