# Proposal

## Why

Paso 7 del plan del mundo 2 (`docs/MUNDO-2.md`), segunda mitad: las pruebas de la bandera de los niveles 7 a 11 del río y el repaso del nivel 12.

## What Changes

- **«Los amigos del 10»** (nivel 7): cuánto falta para completar el 5, el 10 o el 20, con la meta a la vista.
- **«El tren»** (nivel 8): ordinales; se toca el vagón del puesto que dice la tarjeta.
- **«Calcetines»** (nivel 9): los pequeños buscan la pareja de un calcetín; los demás dicen si todos tienen pareja o sobra uno (pares y nones hasta 10 o 20).
- **«Saltos de rana»** (nivel 10): contar a saltos sobre la recta.
- **«Los barcos del puerto»** (nivel 11): ordenar números de menor a mayor.
- **«Repaso del río»** (nivel 12): una pregunta de tres pruebas anteriores del río, cada una con su dibujo.
- La pantalla de la prueba elige la vista por pregunta (no por prueba) para que el repaso mezcle tipos.

**Fuera de alcance:** el castillo (paso 8).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `flag-quiz`: cinco pruebas nuevas, el repaso y el catálogo completo del río.

## Impact

- `src/learning/quiz/`: `ten-friends.ts`, `train.ts`, `socks.ts`, `frog-jumps.ts`, `boats.ts`, `river-review.ts`, tipos, textos y pruebas.
- `src/game/ui/quiz/`: vistas del tren y de los calcetines; marco de 20 y meta en la vista del marco; saltos en la vista de la recta; los barcos usan la vista de ordenar; dibujos y pictogramas.
- `src/game/scenes/QuizScene.ts`: zonas y vista por pregunta. `src/game/worlds/rio/index.ts`: catálogo.
