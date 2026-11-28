# Proposal

## Why

Paso 7 del plan del mundo 2 (`docs/MUNDO-2.md`, «Los 12 tramos del río»), primera mitad: las pruebas de la bandera de los niveles 1 a 6 del río. Siguen el contrato de siempre (3 preguntas, se supera con 2, sin estrellas) y la tabla «Qué se aprende». Como el plan permite, el paso se divide en dos cambios: niveles 1 a 6 y niveles 7 a 12.

## What Changes

- **«¿Cuántos dedos?»** (nivel 1): manos con dedos levantados; ver sin contar.
- **«El marco de diez»** (nivel 2): fichas en un marco de 5 o de 10; los mayores dicen cuántas faltan.
- **«Parejas»** (nivel 3): cartas con números que se ven un momento y se tapan; se toca la pareja de la cantidad.
- **«El vecino»** (nivel 4): el anterior, el siguiente y, los mayores, el de en medio.
- **«¿Dónde va?»** (nivel 5): colocar un número en la recta.
- **«El número más grande»** (nivel 6): comparar cifras sin montones (el mayor o el menor).
- **Catálogo por mundo**: el río dice su prueba en cada nivel (los niveles 7 a 12 usan «¿Cuántos hay?» hasta el segundo cambio).
- Cada prueba con su texto para el adulto, su pictograma y su pista propia (dedos o fichas que se iluminan, cartas que se destapan, saltos por la recta).

**Fuera de alcance:** las pruebas de los niveles 7 a 12 y el repaso del 12 (segundo cambio), el castillo (paso 8).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `flag-quiz`: seis pruebas nuevas y el catálogo por mundo.

## Impact

- `src/learning/quiz/`: `fingers.ts`, `ten-frame.ts`, `memory.ts`, `neighbor.ts`, `number-line.ts`, `biggest.ts`, tipos, textos y pruebas.
- `src/game/ui/quiz/`: vistas de dedos, marco, parejas y recta; pictogramas.
- `src/game/scenes/QuizScene.ts` (zonas) y `src/game/worlds/rio/index.ts` (catálogo).
