# Tasks

## 1. Lógica pura

- [x] 1.1 `brachio.ts` con los emblemas por franja y pruebas (caben, no se pisan, 2/2-3/4 piezas, bloques distintos, pieza girada de los mayores, semilla). Verificar con `npx vitest run src/learning/challenges`.

## 2. Datos y sonido

- [x] 2.1 `kind: "brachio"` en tipos, zona (la de la barca) y duración; nivel 3 de la isla en borrador. Verificar con `npx vitest run src/game`.
- [x] 2.2 Sonido `brachio`. Verificar con `npx vitest run src/game/audio`.

## 3. Escena

- [x] 3.1 `BrachioChallengeView` y su alta en `LevelScene`. Verificar con `npm run dev` a 844×390: los tres fallos, la pieza encaja, el braquiosaurio se agacha y cruza con Rufo sin que se caiga, en las tres franjas.
