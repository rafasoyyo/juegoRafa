# Tasks

## 1. Lógica pura

- [x] 1.1 `CastleDef`, `castleCourse`, `castleQuizPools` y `generateCastleQuiz`; castillo del río. Verificar con `npx vitest run src/game/castle` (recorrido válido, sin enemigos, preguntas distintas).
- [x] 1.2 Medalla por mundo en el estado y en el guardado (`castleStatus`, `winMedal`). Verificar con `npx vitest run src/game/state.test.ts src/game/profile`.

## 2. Pantalla

- [x] 2.1 Castillo y medalla en SVG propios, anotados en `public/assets/LICENSES.md`. Verificar que `BootScene` los carga sin errores en `npm run dev`.
- [x] 2.2 Recorrido del castillo en `LevelScene`, prueba de varias preguntas en `QuizScene` y pantalla de la medalla en `LevelCompleteScene`. Verificar con `npm run dev` a 844×390: recorrido completo con los tres retos y medalla también fallando todas las preguntas.
- [x] 2.3 Nodo del castillo (cerrado, abierto y hecho) y medalla en el selector. Verificar con `npm run dev` a 844×390.

## 3. Cierre

- [x] 3.1 `npm test` y `npm run build` pasan.
