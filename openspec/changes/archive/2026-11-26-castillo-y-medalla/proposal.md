# Proposal

## Why

Paso 8 del plan del mundo 2 (`docs/MUNDO-2.md`, «El castillo»): el mundo acaba en un castillo, una parada propia del mapa tras el último nivel, que siempre da la medalla del mundo. La pieza tiene que servir después para el castillo del mundo 1 (`docs/MUNDO-1.md`, paso 5).

## What Changes

- **Pieza del castillo**: recibe una lista de retos (del recorrido o preguntas de la bandera). Los del recorrido van seguidos en un recorrido corto que se monta solo, sin bloques, pinchos ni enemigos, y las preguntas se hacen al llegar a la bandera, una por paso. Terminarlo siempre da la medalla, también con todo resuelto por Lalo. No da estrellas.
- **Castillo del río**: un reto de cada mecánica (contar, puente y barca) y dos preguntas de pruebas del río distintas entre sí.
- **Mapa**: nodo del castillo tras el último nivel, cerrado hasta jugar ese nivel, que se puede repetir; con la medalla al lado una vez ganada. El zorro espera en él cuando ya no queda ningún nivel por jugar.
- **Selector**: la medalla aparece en la esquina del botón del mundo.
- **Fin del castillo**: pantalla de celebración con la medalla en lugar de estrellas. Tras el último nivel, la flecha grande lleva al castillo si el mundo lo tiene.
- **Progreso**: la medalla se guarda por mundo y no se pierde.

**Fuera de alcance:** el castillo del mundo 1 (otro cambio) y los 12 niveles del río (paso 9).

## Capabilities

### New Capabilities

- `world-castle`: el castillo de un mundo y su medalla.

### Modified Capabilities

- `world-map`: nodo del castillo y medalla en el selector.
- `level-complete`: pantalla de la medalla y paso del último nivel al castillo.

## Impact

- `src/game/castle/castle.ts` (nuevo): definición, recorrido y preguntas del castillo. `src/learning/quiz/castle-quiz.ts` (nuevo): elegir las preguntas.
- `src/game/state.ts` y `src/game/profile/progress-codec.ts`: medalla por mundo.
- `src/game/worlds/types.ts` y `rio/index.ts`: `castle` en la definición del mundo.
- Escenas `LevelScene`, `QuizScene`, `LevelCompleteScene` y `MapScene`. `BootScene` y `public/assets/svg/` (castillo y medalla propios, anotados en `LICENSES.md`).
