# Design

## Context

`docs/MUNDO-2.md` (sección «A. Bloques que cuentan») fija la mecánica, la escalera de fallos y las estrellas. El motor actual tiene bloques «?» que se golpean desde abajo (`LevelScene.onBlockCollision`), la prueba de la bandera con su lógica pura en `src/learning/quiz/` y estrellas provisionales por bloques (`scoring.ts`).

## Goals / Non-Goals

**Goals:** motor común de retos reutilizable por B y C (datos, estado, escalera, demostración, registro), mecánica A completa y estrellas por retos.

**Non-Goals:** mecánicas B y C, dedos, persistir demostraciones vistas.

## Decisions

### Datos del reto en el JSON del nivel

```json
"challenges": [{ "kind": "count", "x": 30, "show": "dots", "reverse": false, "demo": true }]
```

`x` es la posición (en baldosas) del bloque central. El reto ocupa de `x - 5` (cartel) a `x + 3` (compuerta), con los bloques en `x - 1,5`, `x` y `x + 1,5`, en la fila baja sobre el suelo. `show` es `dots` o `tenframe`. La validación exige suelo llano sin otros elementos de `x - 6` a `x + 4`, y que todo quede entre la salida y la bandera.

### Lógica pura en `src/learning/challenges/`

- `count-blocks.ts`: `countChallenges(band, rng, specs)` genera los retos del nivel con respuestas distintas. Cada reto da `sign` y `options` como caras (`digit`, `dots`, `tenframe`) y el índice correcto. Franjas: pequeños, puntos 1-5 en ambos lados; medianos, 1-10 con `show` en el lado de la cantidad; mayores, 1-20 con dos marcos.
- `ladder.ts`: `ChallengeRun` con `hit(index)` → `correct | wobble | count-up | solved-by-lalo`, y si fue a la primera.
- `scoring.ts`: `starsForChallenges(firstTry, total)`; con `total` 0 da 3.

### Vista Phaser en `src/game/challenges/`

`CountChallengeView` dibuja cartel, bloques con cara y compuerta (cuerpo estático de 6 baldosas de alto: más que lo que alcanza un salto desde encima de un bloque, unos 420 px). `LevelScene` enruta los golpes de bloque con dato `challenge` a la vista, que consulta el `ChallengeRun` y anima la respuesta. Un `LaloFlyer` (imagen `lalo` en el mundo) vuela desde la posición del HUD a un punto, muestra una flecha que bota y vuelve.

La demostración se dispara cuando el zorro entra a 7 baldosas del bloque central.

### Estrellas por mundo

`WorldDef.stars: 'blocks' | 'challenges'`. `LevelScene` pasa `challengesFirstTry` y `challengesTotal` por la prueba hasta `LevelCompleteScene`, que calcula con la regla del mundo. El mundo 1 queda en `blocks`.

### Galletas

Abrir la compuerta da 3 galletas. Los fallos no tocan el contador.

### Enemigos

`courseFor` incluye la zona de cada reto en `keepClear`.

## Risks / Trade-offs

- [Un niño de 4 años no entiende el cartel sin explicación] → Es lo que mide la prueba con niños tras este paso; la demostración y la escalera reducen el riesgo.
- [La compuerta muy alta tapa el cielo] → Se dibuja como dos postes de piedra y una tabla de madera con agua detrás; se ajusta tras verla en el móvil.
