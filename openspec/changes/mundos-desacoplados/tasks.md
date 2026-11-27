# Tasks

## 1. Retos por registro

- [ ] 1.1 Pasar `challengeZone` y los segundos de calma de cada reto a `CHALLENGE_SHAPES` en `levels/types.ts` y usarla en `levels/duration.ts`. Verificar con `npm test` (validación y duración de los tres mundos sin cambios).
- [ ] 1.2 Crear `src/game/challenges/registry.ts` con `CHALLENGE_MECHANICS` (plan, huecos y vista de cada tipo) y hacer que `LevelScene` planifique y monte los retos solo a través de él. Verificar con `npm run build` y abriendo a 844×390 un nivel con reto de cada mundo (río 1, isla 1).

## 2. Enemigos por tabla

- [ ] 2.1 Cambiar los `switch` de `spawnReach`, `layoutEnemies` y `createEnemyView` por tablas por tipo, con el mismo orden de azar, y construir el contador de enemigos de `LevelScene` a partir de `ENEMY_KINDS`. Verificar con `npm test` (pruebas con semilla de `enemy-layout` sin cambios).

## 3. Pruebas por tabla

- [ ] 3.1 Cambiar el `switch` de `generateQuiz` por `QUIZ_GENERATORS`, el de `createView` por `QUIZ_VIEWS` y el tamaño de opción especial de `QuizScene` por un campo de `AREAS`. Verificar con `npm test` y abriendo a 844×390 la prueba de «cuello que crece» y la de letras del nombre.

## 4. Mundos solo de desarrollo

- [ ] 4.1 Cambiar `WorldGate.flag` por `devOnly`, pasar `dev` a `worldAccess` y `opensAfter` y borrar `flags.ts`. Verificar con `npm test` (pruebas de `access`, con un mundo de prueba marcado como solo de desarrollo).

## 5. Vigilancia y reglas

- [ ] 5.1 Añadir `src/game/worlds/isolation.test.ts` con las comprobaciones de design.md. Verificar con `npm test` y, a mano, que falla al escribir `'rio'` en `MapScene.ts` o `kind === 'boat'` en `LevelScene.ts`.
- [ ] 5.2 Añadir la restricción en `AGENTS.md` y la regla en `openspec/config.yaml`. Verificar con `openspec instructions proposal --change mundos-desacoplados --json`: la regla sale en `rules`.
- [ ] 5.3 `npm test` y `npm run build` pasan, y `openspec validate mundos-desacoplados` pasa.
