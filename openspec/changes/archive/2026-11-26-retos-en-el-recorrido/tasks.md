# Tasks

## 1. Lógica pura

- [x] 1.1 `src/learning/challenges/count-blocks.ts` con pruebas por franja (rangos, caras, opciones distintas, respuestas distintas en un nivel, al revés). Verificar con `npx vitest run src/learning/challenges`.
- [x] 1.2 `src/learning/challenges/ladder.ts` con pruebas de la escalera y de «a la primera». Verificar con `npx vitest run src/learning/challenges`.
- [x] 1.3 `starsForChallenges` en `scoring.ts` con pruebas del 75 % y el 40 %. Verificar con `npx vitest run src/learning/scoring.test.ts`.

## 2. Datos y validación

- [x] 2.1 Retos en `types.ts`, `parse.ts` y `validate.ts` (zona llana y libre, dentro del recorrido, sin solaparse) con pruebas; `courseFor` mantiene libre la zona. Verificar con `npx vitest run src/game/levels src/game/enemies`.
- [x] 2.2 `WorldDef.stars`; el río cuenta por retos y su nivel 1 lleva 3 retos A (el primero con demostración). Verificar con `npx vitest run src/game/worlds`.

## 3. Escena

- [x] 3.1 Efectos `gate` y `tick` en `sfx.ts`. Verificar con `npx vitest run src/game/audio`.
- [x] 3.2 Vista del reto, compuerta, escalera y Lalo volando en `src/game/challenges/`, integrada en `LevelScene`; estrellas por la regla del mundo en `LevelCompleteScene`. Verificar con `npm run dev` a 844×390 en el nivel 1 del río: demostración, fallo, segundo fallo contando, tercer fallo con Lalo, compuerta que no se salta y estrellas.

## 4. Cierre

- [x] 4.1 El mundo 1 se juega igual. `npm test` y `npm run build` pasan.
