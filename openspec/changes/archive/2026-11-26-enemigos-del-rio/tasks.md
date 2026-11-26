# Tasks

## 1. Movimiento y reparto

- [x] 1.1 `frogState`, `frogBox`, `crabX`, `crabBox` con pruebas (aviso antes de saltar, pasar por debajo, ida y vuelta lenta). Verificar con `npx vitest run src/game/enemies`.
- [x] 1.2 `EnemyRules.kinds` y reparto por tipos; el mundo 1 igual, el río con rana desde el 3 y cangrejo desde el 7, nunca junto a un reto. Verificar con `npx vitest run src/game/enemies src/game/worlds`.

## 2. Dibujo

- [x] 2.1 `frog.svg` y `crab.svg` anotados en `LICENSES.md`, cargados en `BootScene` y sus vistas. Verificar con `npm run dev` a 844×390: la rana se agacha antes de saltar y se pasa por debajo en el aire; el cangrejo anda de lado despacio.

## 3. Cierre

- [x] 3.1 `npm test` y `npm run build` pasan.
