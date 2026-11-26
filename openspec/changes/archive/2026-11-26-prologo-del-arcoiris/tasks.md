# Tasks

## 1. Perfil y reglas

- [x] 1.1 `GameState.seen` y su guardado en `progress-codec.ts`; pruebas de ida y vuelta y de lo guardado sin el campo. Verificación: `npx vitest run src/game/profile src/game/state.test.ts`.
- [x] 1.2 `src/game/story/story.ts` con `shouldPlayPrologue` y las claves de escena; pruebas (perfil nuevo sí; visto no; con progreso no; forzado sí; otro nivel u otro mundo sin prólogo no). Verificación: `npx vitest run src/game/story`.

## 2. Escenas

- [x] 2.1 `WorldDef.prologue`, `MapDecor.prologue` y los datos del mundo 1; `addScenery` devuelve el arcoíris del horizonte. Verificación: `npm run build`.
- [x] 2.2 `src/game/story/prologue.ts` y su uso en `LevelScene` (madriguera en el nivel 1, `held`, toque que salta, marca y guardado). Verificación: a 844×390, perfil nuevo: se ve el prólogo y luego se juega; un toque lo salta; al volver a entrar no sale.
- [x] 2.3 Tocar la madriguera del mapa abre el nivel 1 con el prólogo; arrastrar desde ella no. Verificación: a 844×390.

## 3. Cierre

- [x] 3.1 `npm test` y `npm run build` pasan; `docs/MUNDO-1.md` marca el paso 3. Verificación: salida de los comandos.

## Workflow follow-up

- Archivar el cambio y abrir la PR contra `dev` desde `mundo1-prologo-del-arcoiris`.
