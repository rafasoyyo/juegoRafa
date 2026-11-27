# Design

## Context

La pieza del castillo (`src/game/castle/castle.ts`) recibe un `CastleDef` con un paisaje y una lista de pasos: retos del recorrido o preguntas de la bandera. `MapScene` dibuja el castillo en `map.nodes[levelCount]` si el mundo tiene `castle`, y el selector pone la medalla del mundo en su botón. Todo eso ya funciona con el río.

## Goals / Non-Goals

**Goals:** castillo del mundo 1 solo con datos, sobre una nube al pie del arcoíris, sin que el selector lo tape.

**Non-Goals:** tocar el motor del castillo, del mapa o de las preguntas.

## Decisions

- **Solo preguntas**: el mundo 1 no tiene retos de recorrido, así que el castillo es un recorrido corto por las nubes hasta la bandera y allí 5 preguntas. La pieza ya admite castillos sin retos (prueba «solo preguntas» de `castle.test.ts`).
- **Una prueba por paso** (`count`, `compare`, `series`, `share`, `balance`), las que propone el plan. Son de las que no hay que memorizar cartas ni leer letras (se dejan fuera `recall` y `name-letters`), y con un solo tipo por paso las 5 preguntas son siempre distintas.
- **Paisaje `nubes`**, el del nivel 12: el castillo está en el cielo.
- **Sitio en el mapa**: a la derecha del nivel 12, en el pie derecho del arcoíris, algo más alto que el 12 y dentro de la segunda pantalla (2360 px de artboard). Una nube grande (`cloud`) debajo, como adorno.

## Risks / Trade-offs

- 5 preguntas seguidas son más que las 2 del río. → Es lo que pide el plan y la escalera de fallos de Lalo no cambia; si se hace largo, se acorta la lista sin tocar código.
