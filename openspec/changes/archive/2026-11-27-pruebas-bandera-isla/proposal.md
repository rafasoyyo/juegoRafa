# Proposal

## Why

Paso 6 del plan del mundo 3 (`docs/MUNDO-3.md`): una prueba de la bandera propia para cada nivel de la isla, de formas, espacio y clasificación, y el repaso del nivel 12.

## What Changes

- **Once pruebas nuevas**, una por nivel: sombras de dinosaurios (1), formas en las cosas (2), las placas del estegosaurio (3), igual aunque gire (4), el nido (5), los huevos de la familia (6), el fósil (7), la piel del dinosaurio (8), el cuello que crece (9), pelota, caja y cono (10) y formas escondidas (11).
- **Repaso de la isla** (12): una pregunta de tres de esas pruebas.
- Cada una con sus tres franjas de edad, semilla y textos para el adulto en el bocadillo de Lalo.
- **Formas nuevas** `oval` y `pentagon` en el catálogo de formas.
- **Arte propio** con Graphics (`ui/quiz/island-art.ts`): cinco dinosaurios a color y como sombra, trece cosas, piezas, escenas de posición, huevos y nido, losa de fósil, piel de escamas, cuellos, cuerpos, rampa y dibujos de triángulos.
- La pantalla de la bandera admite un modelo que no es una forma (dibujo en el marco) y una consigna de dibujo grande sin marco (`picture`).

Habilidad educativa: **formas y espacio** (nombrar, reconocer girado, posiciones, completar huecos), **clasificar** y **series**.

**Fuera de alcance:** dar de alta las pruebas en `quizFor` de la isla (cuando el mundo de la isla llegue a `mundo3`, paso 1), el castillo (paso 8).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `flag-quiz`: doce pruebas nuevas de la isla.
