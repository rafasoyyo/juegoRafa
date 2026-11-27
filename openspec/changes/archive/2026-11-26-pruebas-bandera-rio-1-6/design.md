# Design

## Context

Cada prueba es un generador puro en `src/learning/quiz/` que devuelve `Question` (consigna, opciones, respuesta, pista). `QuizScene` dibuja las seis primeras y delega las demás en una vista de `src/game/ui/quiz/`.

## Decisions

- **Reutilizar lo que hay**: «El vecino» usa la fila con hueco de «Sigue la serie» (pista de arcos) y «El número más grande» usa la cesta de «¿Dónde hay más?» (pista: apagar una incorrecta). Las otras cuatro tienen vista propia.
- **Todas son de elegir** (`choice`), con una sola respuesta, para que la escalera de intentos sea la de siempre.
- **Edades** según `docs/MUNDO-2.md`: los pequeños ven puntos de dado y cantidades hasta 5; los medianos, cifras hasta 10; los mayores, hasta 20 (o lo que falta para 10).
- **Parejas** sin turnos de memoria: las cartas se ven 3 s y se tapan; tocar una la destapa. La pista (`peek`) las destapa todas un momento. Es memoria y pareja cantidad-número en un solo toque, con la escalera de fallos de siempre.
- **¿Dónde va?**: los sitios que se pueden tocar están a dos marcas como mínimo (96 px de zona táctil) y el bueno no queda siempre en medio. Pista `hop`: una bola salta marca a marca desde el principio, contando.
- **Catálogo por mundo** en `rio/index.ts` (`QUIZ_BY_LEVEL`), igual que el del mundo 1.

## Risks / Trade-offs

- [Las cartas tapadas se pueden tocar antes de taparse] → Es más fácil, no más difícil; se revisará en la prueba con niños.
