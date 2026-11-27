# Design

## Context

Hoy `LevelCompleteScene` elige la regla según `WorldDef.stars`: `starsFor` (bloques «?») en el mundo 1 y `starsForChallenges` (retos a la primera) en el río. La prueba de la bandera (`src/learning/quiz/run.ts`) se supera con `PASS_MARK = 2`; si no, `markPending` deja el nivel pendiente y desbloquea el siguiente. Las galletas del nivel salen de los bloques «?» (1 cada uno) y de la compuerta del reto de contar (`GATE_COOKIES = 3`); el pinchazo resta una (nunca bajo 0). Puente y barca no dan galletas.

## Goals / Non-Goals

**Goals:** una sola regla de estrellas en `src/learning/scoring.ts`, pura y probada; que el motor no pregunte en qué mundo está; 0 estrellas = volver a empezar.

**Non-Goals:** tocar los retos del recorrido, el castillo o el aspecto de la tarjeta.

## Decisions

### Regla pura `starsForGoals`
`starsForGoals({ cookies, cookiesTotal, quizCorrect, quizTotal })` devuelve 0 a 3:
- `cookieShare = cookiesTotal <= 0 ? 1 : cookies / cookiesTotal` (acotado a 0..1).
- 3 si `cookieShare >= 0,8` y `quizCorrect >= quizTotal` (con `quizTotal > 0`).
- Si no, `(cookieShare >= 0,5 ? 1 : 0) + (quizCorrect >= 1 ? 1 : 0)`.
Comparaciones con enteros (`cookies * 10 >= cookiesTotal * 8`) para no depender de decimales. Se borran `starsFor` y `starsForChallenges` y sus pruebas.

### Galletas de la fase
`ChallengeView` gana `cookieReward()` (0 por defecto; la compuerta de contar devuelve `GATE_COOKIES`, también en el reto de demostración, porque también la abre). `LevelScene` calcula `cookiesTotal = bloques + Σ cookieReward()` y lo pasa a la prueba y a la pantalla final. Así un reto nuevo que dé galletas entra solo en el total.

### La prueba solo cuenta aciertos
`QuizScene.finish` pasa `quizCorrect` y `quizTotal` (de `result(run)`) en vez de `passed`. `PASS_MARK` y `passed` se quitan de `run.ts`.

### 0 estrellas
`LevelCompleteScene` con 0 estrellas muestra la pantalla de ánimo actual (Lalo y el zorro saludan, galletas), suma las galletas y no guarda estrellas ni pendiente: el nivel no queda hecho y el siguiente no se desbloquea por esta partida. Botones: mapa y repetir; el grande (coral) es repetir. Si el nivel ya estaba hecho, sigue hecho con su mejor resultado. `completeLevel` acepta 1..3 como hasta ahora; `markPending` se elimina, pero `pending` sigue en el estado y en el guardado para los perfiles antiguos.

### Sin regla por mundo
Se quita `WorldDef.stars`. El mundo 3 (aún sin código) hereda la regla común.

## Risks / Trade-offs

- **Un niño que no recoge galletas ni acierta se queda en el nivel.** Es lo que pide Rafael; la pantalla de ánimo y el botón grande de repetir lo hacen amable. Se revisará en la prueba con niños.
- **Perfiles con pendientes antiguos**: siguen pendientes y desbloqueando el siguiente; al jugarlos con 1 estrella o más pasan a hechos.
- Las compuertas suben el total de galletas del río: el 50 % exige golpear algunos bloques además de resolver los retos. Aceptable.
