# Design

## Context

Hoy cada mundo tiene su definición (`src/game/worlds/<id>/index.ts`, tipo `WorldDef`) y su carpeta de recorridos (`content/levels/<id>/`), y `registry.ts` los ordena. Los puntos que todavía obligan a varios mundos a editar las mismas líneas son:

- **Retos**: `LevelScene.planChallenges` y `buildChallenges` (tres cadenas de `if (kind === …)`), la unión escrita a mano de `plannedChallenges`, `challengeZone` en `levels/types.ts` y `CALM_SECONDS` en `levels/duration.ts`.
- **Enemigos**: el literal `enemyCounts` con todos los tipos (dos veces en `LevelScene`), los `switch` de `spawnReach`, `layoutEnemies` y `createEnemyView`.
- **Pruebas**: el `switch` de `generateQuiz` (`learning/quiz/index.ts`), el de `createView` (`ui/quiz/views.ts`) y el tamaño de opción especial por tipo en `QuizScene`.
- **Interruptores**: `flags.ts` tiene una unión `FlagId` con una entrada por mundo en construcción.

## Goals / Non-Goals

**Goals:**
- Que cada mecánica se declare en una entrada de su registro y que las escenas no comparen tipos uno a uno.
- Que la compilación falle si falta una entrada (`Record<Tipo, …>`).
- Que un mundo en construcción se marque en su definición.
- Pruebas que impidan volver atrás.
- El juego se ve y se juega igual: mismos repartos de enemigos con la misma semilla y mismas pruebas.

**Non-Goals:**
- Un archivo por tipo de enemigo o de prueba (los dibujos siguen en sus archivos actuales; lo que cambia es el despacho).
- Carga por mundo con `import()` dinámico.
- Repartir los ambientes por mundo.

## Decisions

### Registro de retos en dos partes
- **Geometría pura** en `levels/types.ts`: `CHALLENGE_SHAPES: Record<ChallengeKind, { zone(x), calmSeconds }>`. `challengeZone` y la duración leen de ahí. Se queda en `levels/` porque la validación y la duración son TypeScript puro y se prueban sin Phaser.
- **Mecánica de juego** en `src/game/challenges/registry.ts`: `CHALLENGE_MECHANICS: Record<ChallengeKind, ChallengeMechanic>`, con `planner(band, rng)` (devuelve una función que genera el plan de cada reto del nivel; así el reto A guarda sus respuestas sin repetir dentro del nivel sin que la escena lo sepa), `holes(x, plan)` y `view(scene, fox, data, plan, hooks)`. Cada entrada se escribe con un ayudante `mechanic<P>()` que mantiene el tipo de su plan dentro de la entrada y lo borra hacia fuera.
- Alternativa descartada: un solo registro con todo. Obligaría a `validate.ts` y `duration.ts` (puros) a importar las vistas de Phaser.

### Enemigos por tabla
- `ENEMY_KINDS` sigue siendo la lista de tipos. `emptyEnemyCounts()` construye el contador a partir de ella.
- `spawnReach` y `layoutEnemies` usan tablas `Record<EnemyKind, …>` (`REACH` y `SPAWNERS`). Cada generador consume el azar en el mismo orden que antes, para que el mismo `rng` dé el mismo reparto (las pruebas con semilla lo comprueban).
- `createEnemyView` usa `ENEMY_VIEWS: Record<EnemyKind, …>`.

### Pruebas por tabla
- `learning/quiz/index.ts`: `QUIZ_GENERATORS: Record<QuizKind, (band, rng, ctx) => Question[]>`; `generateQuiz` busca ahí.
- `ui/quiz/views.ts`: `QUIZ_VIEWS: Partial<Record<QuizKind, (host) => QuizView>>` (las pruebas antiguas no tienen vista propia).
- `QuizScene`: la tabla `AREAS` gana un campo opcional `optionSize`, en lugar de comparar con `name-letters` y `growing-neck`.

### Mundos solo de desarrollo
- `WorldGate.flag?: FlagId` pasa a `WorldGate.devOnly?: boolean`. `worldAccess` y `opensAfter` reciben `dev: boolean` (en el juego, `import.meta.env.DEV`; en las pruebas, el valor que toque). Se borra `flags.ts`: ya no lo usaba ningún mundo.

### Pruebas de aislamiento
`src/game/worlds/isolation.test.ts` lee con `node:fs` los `.ts` de `src/` (sin pruebas):
- Fuera de `src/game/worlds/<id>/` y de `registry.ts`, ningún archivo contiene `'<id>'` o `"<id>"` de un mundo registrado ni importa `worlds/<id>`.
- En `src/game/scenes/`, ninguna línea compara con un tipo de reto, enemigo o prueba (`kind === '…'`, `case '…'`).

Los identificadores y los tipos salen de los registros, así que la prueba crece sola con cada mundo o mecánica nuevos.

## Risks / Trade-offs

- **Repartos de enemigos distintos** si el orden del azar cambia al pasar a tablas → se conservan las mismas llamadas a `rng` en el mismo orden y lo comprueban las pruebas de `enemy-layout` con semilla.
- **Falsos positivos de la prueba de texto** (un comentario que nombra un mundo) → solo busca literales entre comillas y comparaciones de tipo, no palabras sueltas.
- **El ayudante `mechanic<P>()` borra el tipo del plan hacia fuera** → cada entrada sigue tipada por dentro, y la escena solo pasa el plan de vuelta a la misma entrada.
