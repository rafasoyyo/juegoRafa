# Proposal

## Why

Rafael quiere que las estrellas de una fase se ganen igual en todos los mundos y que dependan de dos cosas que el niño ve: las galletas que lleva al llegar a la bandera y las tres preguntas de la prueba de la bandera. Hoy cada mundo cuenta las estrellas a su manera (bloques «?» en el mundo 1, retos del recorrido acertados a la primera en el río) y la prueba de la bandera no da estrellas.

## What Changes

- **Regla única de estrellas para todos los mundos**, que sustituye a la de los bloques «?» y a la de los retos del recorrido:
  - Una estrella por llegar a la bandera con al menos el **50 %** de las galletas de la fase.
  - Otra estrella por acertar al menos **1 de las 3 preguntas** de la prueba de la bandera (en cualquier intento).
  - Las **3 estrellas** exigen llegar con al menos el **80 %** de las galletas y acertar las **3 preguntas**.
  - Las dos primeras son independientes: se puede tener una sin la otra.
- **Galletas de la fase**: las que se pueden ganar en el recorrido (bloques «?» y las 3 de cada compuerta del río). Cuentan las que lleva al tocar la bandera, ya descontados los pinchazos. Una fase sin galletas cumple el porcentaje.
- **BREAKING — se pueden obtener 0 estrellas.** Si no cumple ningún objetivo, la fase no queda superada y hay que empezar de nuevo: pantalla de ánimo, el siguiente nivel no se desbloquea por esa partida y las galletas recogidas sí se suman. Rafael cambia así la regla «estrellas de 1 a 3, nunca 0» de `AGENTS.md` y `docs/PROPUESTA.md`.
- **Desaparece el «2 de 3» de la prueba**: la prueba ya no se aprueba ni se suspende; su número de aciertos entra en las estrellas. Deja de haber niveles nuevos en estado pendiente; los pendientes de perfiles guardados se conservan como estaban.
- Se sigue guardando la mejor puntuación de cada nivel. El castillo sigue dando solo la medalla.
- Se quita `WorldDef.stars` (ya no hay regla por mundo) y se actualizan los documentos de rumbo (`PROPUESTA`, `MUNDO-1`, `MUNDO-2`, `MUNDO-3`, `README`, `AGENTS.md`, `openspec/config.yaml`).

Habilidad educativa: ninguna nueva; cambia cómo se premian las de la prueba de la bandera (todas) y la exploración del recorrido.

**Fuera de alcance:**
- Cambiar los retos del recorrido del río: siguen cortando el paso y dando galletas, pero ya no cuentan para las estrellas.
- Mostrar en la tarjeta qué objetivo dio cada estrella.
- Ajustar los umbrales (50 % y 80 %) tras jugarlo con niños: es un ajuste de valores.
- Cambiar el castillo o la medalla.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `level-complete`: estrellas por objetivos en todos los mundos, 0 estrellas posibles y pantalla de ánimo para volver a empezar.
- `flag-quiz`: la prueba deja de aprobarse con 2 de 3 y sus aciertos dan estrellas.
- `world-map`: ya no se crean niveles pendientes; un nivel sin estrellas no desbloquea el siguiente.
- `child-profile`: el guardado ya no crea pendientes y conserva los de perfiles antiguos.
- `spike-zones` y `level-enemies`: el pinchazo ya cuenta para las estrellas a través de la galleta que resta.

## Impact

`src/learning/scoring.ts` (y sus pruebas), `src/game/scenes/LevelScene.ts`, `QuizScene.ts`, `LevelCompleteScene.ts`, `src/game/challenges/` (galletas que da cada reto), `src/game/state.ts`, `src/game/worlds/` (`types.ts`, `arcoiris`, `rio`), documentos de rumbo.
