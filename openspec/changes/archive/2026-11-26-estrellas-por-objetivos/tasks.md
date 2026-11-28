# Tasks

## 1. Lógica pura

- [x] 1.1 `starsForGoals` en `src/learning/scoring.ts` con pruebas (50 %, 80 %, 1 y 3 aciertos, independencia, 0 estrellas, fase sin galletas, valores fuera de rango); quitar `starsFor` y `starsForChallenges`. Verificar con `npx vitest run src/learning`.
- [x] 1.2 Quitar `PASS_MARK` y `passed` de `src/learning/quiz/run.ts` y ajustar sus pruebas. Verificar con `npx vitest run src/learning/quiz`.

## 2. Estado

- [x] 2.1 Quitar `markPending` de `state.ts` (los pendientes guardados se conservan) y ajustar pruebas. Verificar con `npx vitest run src/game`.

## 3. Escenas y mundos

- [x] 3.1 `cookieReward()` en los retos y `cookiesTotal` en `LevelScene`; `QuizScene` pasa los aciertos; `LevelCompleteScene` usa `starsForGoals` y, con 0 estrellas, la pantalla de ánimo con repetir como botón grande. Quitar `WorldDef.stars`. Verificar con `npm run build` y `npm run dev` a 844×390: nivel 1 del mundo 1 con todas las galletas y 3 aciertos (3 estrellas) y sin galletas ni aciertos (ánimo, el nivel 2 sigue bloqueado).

## 4. Documentos y specs

- [x] 4.1 Actualizar `AGENTS.md`, `README.md`, `openspec/config.yaml`, `docs/PROPUESTA.md`, `docs/MUNDO-1.md`, `docs/MUNDO-2.md` y `docs/MUNDO-3.md`. Verificar con `grep -rn "nunca 0" AGENTS.md README.md docs openspec/config.yaml`: solo quedan los «nunca baja de 0» del contador de galletas.
- [x] 4.2 Sincronizar los deltas en `openspec/specs/` y archivar el cambio. Verificar con `npm test` y `npm run build`.
