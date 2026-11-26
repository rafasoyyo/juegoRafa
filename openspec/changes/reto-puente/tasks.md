# Tasks

## 1. Lógica pura

- [ ] 1.1 `bridge.ts` con pruebas por franja (rango, paso, hueco con dos tramos firmes delante, tramos visibles, opciones distintas, semilla). Verificar con `npx vitest run src/learning/challenges`.

## 2. Datos

- [ ] 2.1 `kind: "bridge"` en parseo, zona en validación y duración, enemigos fuera. Verificar con `npx vitest run src/game/levels src/game/enemies`.
- [ ] 2.2 Nivel 2 del río en borrador con retos B. Verificar con `npx vitest run src/game/worlds`.

## 3. Escena

- [ ] 3.1 Efecto `scale`. Verificar con `npx vitest run src/game/audio`.
- [ ] 3.2 Base `ChallengeView`, `BridgeChallengeView` y huecos de agua en `LevelScene`. Verificar con `npm run dev` a 844×390: el hueco no se salta ni desde un bloque, el rebote no quita galletas, la escalera de fallos y la tabla que cierra el hueco; el reto A del nivel 1 sigue igual.

## 4. Cierre

- [ ] 4.1 `npm test` y `npm run build` pasan.
