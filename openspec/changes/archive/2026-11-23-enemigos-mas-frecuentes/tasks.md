## 1. Cantidad de enemigos

- [x] 1.1 En `src/game/enemies/enemy-layout.ts`, cambiar `ENEMIES_PER_LEVEL` a `[2, 3, 4, 5, 6, 7]` y actualizar el comentario de la constante
- [x] 1.2 En `src/game/enemies/enemy-layout.test.ts`, actualizar las pruebas: nivel 1 con exactamente dos erizos; niveles 1 a 6 con `[2, 3, 4, 5, 6, 7]` enemigos y tramos libres suficientes en los recorridos reales; y que `nunca pone dos enemigos en el mismo tramo libre` use el nivel 6 con sus siete
- [x] 1.3 Ejecutar `npx vitest run` y `npx tsc --noEmit`; comprobar que las zonas seguras y el hueco entre enemigos siguen cumpliéndose

## 2. Comprobación en el juego

- [x] 2.1 Jugar los niveles 1 y 6 en el navegador y confirmar que se ve la cantidad esperada, que se pueden saltar y que la dificultad sigue siendo amable
