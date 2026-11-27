# Tasks

## 1. Lógica pura

- [x] 1.1 `boat.ts` con pruebas por franja (capacidad, sentados, que faltan, opciones distintas en rango, caras, semilla). Verificar con `npx vitest run src/learning/challenges`.

## 2. Datos

- [x] 2.1 `kind: "boat"` en parseo, zona en validación y duración, enemigos fuera. Verificar con `npx vitest run src/game/levels src/game/enemies`.
- [x] 2.2 Nivel 3 del río en borrador con retos C. Verificar con `npx vitest run src/game/worlds`.

## 3. Escena

- [x] 3.1 Efecto `horn`. Verificar con `npx vitest run src/game/audio`.
- [x] 3.2 `BoatChallengeView`, huecos dinámicos y zorro llevado por la barca en `LevelScene`. Verificar con `npm run dev` a 844×390: el lago no se salta, el rebote no quita galletas, la escalera de fallos, Rufo cruza en la barca sin poder caerse; el puente y los bloques que cuentan siguen igual.

## 4. Cierre

- [x] 4.1 `npm test` y `npm run build` pasan.
