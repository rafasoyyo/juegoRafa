# Design

## Context

Los pasos 3 y 4 dejaron el motor de retos: datos en `challenges`, lógica pura en `src/learning/challenges/`, la base `ChallengeView` y los huecos de agua del puente con rebote sin coste en `LevelScene`.

## Decisions

### Geometría

`x` es el borde izquierdo del lago, que mide `BOAT_LAKE` = 10 baldosas. La barca mide `BOAT_LENGTH` = 3,5 baldosas, con la cubierta a la altura del suelo, y espera pegada a la orilla izquierda. El agua libre (6,5 baldosas) es más que un salto desde la barca (unas 3,07) y la barca queda al alcance desde un bloque. Los bloques van en el muelle, con centros a 4,5, 3 y 1,5 baldosas antes del lago. La zona del reto va de `x - 6` a `x + 11`.

### Lógica pura

`boatChallenge(band, rng)` da la capacidad (5, 10 o 20), los patitos sentados, los que faltan y tres opciones distintas entre 1 y capacidad − 1. Las caras son puntos (dado) para 5 y 10 y marco de diez para 20. Reutiliza `ladder.ts`.

### Barca y lago

El escenario corta el suelo en todo el lago (fondo y agua como en el puente). Los huecos que hacen rebotar dejan de ser una lista fija: `LevelScene` los pide cada fotograma a los retos (`holes()`). La barca devuelve el agua libre a su lado: antes de zarpar, a su derecha; navegando, ninguno; al llegar, a su izquierda.

La barca es una zona estática con su colisionador. Resuelto el reto y con Rufo encima (apoyado y con el centro sobre la cubierta), zarpa: un tween mueve la barca hasta la otra orilla y, en cada paso, la escena desplaza a Rufo lo mismo y le quita el control (sin flechas ni salto). Así no se puede caer. Al llegar, se le devuelve el control y la barca se queda como suelo firme en esa orilla.

### Pistas

`hintOne` recibe el bloque fallado: sus patitos vuelan a los asientos vacíos; si sobran, se quedan flotando encima; si faltan, los asientos vacíos que quedan parpadean. Luego vuelven al bloque. `hintTwo` hace parpadear los asientos vacíos de uno en uno con un «tic». La demostración hace la segunda pista y Lalo señala.

## Risks / Trade-offs

- [El niño no se sube a la barca tras acertar] → La barca espera con la bocina sonada y no hay otra forma de cruzar; si cae al agua, rebota sin coste.
- [Tween y física a la vez] → La barca es estática y se recoloca con `updateFromGameObject`; el zorro se mueve con ella a mano.
