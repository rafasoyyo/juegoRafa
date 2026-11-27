# Proposal

## Why

El juego tendrá hasta 12 mundos y cada uno se desarrolla en su propia rama (`mundoN`) en paralelo. La primera separación (definición de cada mundo en `src/game/worlds/`) funciona: fuera de esa carpeta ningún código pregunta en qué mundo está. Pero las mecánicas que traen los mundos (retos del recorrido, enemigos y pruebas de la bandera) se reparten por cadenas de `if (kind === …)` y `switch` en archivos comunes (`LevelScene`, `enemy-layout`, `enemy-views`, `quiz/index`, `ui/quiz/views`, `levels/types`, `duration`), y la apertura en desarrollo de un mundo exige tocar `flags.ts`. Cada mundo nuevo edita las mismas líneas que los demás, y fusionar `mundo3` costó varios commits de resolución de conflictos. Además, no hay ninguna regla escrita: el siguiente reto puede volver a meter un `if` sin que nadie lo note.

## What Changes

- **Spec nueva `world-isolation`** con las reglas que mantienen los mundos desacoplados: cada mundo en su carpeta, motor que no nombra mundos, mecánicas por registro, mundos en construcción marcados en su propia definición, progreso por mundo y comprobación automática.
- **Registros de mecánicas**: cada tipo de reto, de enemigo y de prueba de la bandera se declara en una sola entrada de su registro (tabla por tipo), y las escenas despachan por esos registros en vez de cadenas por tipo. Si falta una entrada, la compilación falla.
- **Mundos solo en desarrollo**: la definición del mundo dice si solo se abre con `npm run dev`; desaparece el archivo compartido de interruptores.
- **Pruebas que vigilan la regla**: `npm test` falla si fuera de la carpeta de un mundo aparece su id o se importa su carpeta (salvo el registro), o si una escena vuelve a comparar tipos de reto, enemigo o prueba uno a uno.
- **`AGENTS.md`** y **`openspec/config.yaml`**: una restricción y una regla que apuntan a la spec.

No cambia cómo se juega ni cómo se ve ningún mundo.

Habilidad educativa: ninguna.

Rendimiento (spec `performance`): no afecta. El despacho por registro se hace al montar un nivel, una vez por reto o enemigo, no en cada fotograma; el escenario, los efectos y el audio no cambian.

**Fuera de alcance:** cargar el código de cada mundo por separado (`import()` dinámico), repartir el catálogo de ambientes y de decoración en archivos por mundo (sigue siendo un catálogo común al que cada mundo añade entradas), los adornos del mapa (`rainbow`, `river`) y los finales, que ya son opciones de la definición del mundo.

## Capabilities

### New Capabilities

- `world-isolation`: reglas para que cada mundo y cada mecánica se añadan o cambien sin tocar el código de los demás, y cómo se comprueban.

### Modified Capabilities

Ninguna.

## Impact

- `openspec/specs/world-isolation/spec.md` (nueva, al archivar).
- Código: `src/game/challenges/` (registro nuevo), `src/game/scenes/LevelScene.ts`, `src/game/scenes/QuizScene.ts`, `src/game/levels/types.ts`, `src/game/levels/duration.ts`, `src/game/enemies/enemy-layout.ts`, `src/game/enemies/enemy-views.ts`, `src/learning/quiz/index.ts`, `src/game/ui/quiz/views.ts`, `src/game/worlds/` (puerta solo en desarrollo, pruebas de aislamiento), `src/game/flags.ts` (se elimina), `src/game/scenes/MapScene.ts`.
- `AGENTS.md` y `openspec/config.yaml`.
- Sin dependencias nuevas.
