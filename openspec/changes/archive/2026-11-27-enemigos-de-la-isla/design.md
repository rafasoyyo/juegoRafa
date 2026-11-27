# Design

## Context

Los enemigos se mueven con funciones puras del tiempo (`enemy-motion.ts`), se reparten un enemigo por tramo libre (`enemy-layout.ts`) y cada vista expone su caja de choque. El zorro mide 56×87 y en lo alto de un salto normal tiene los pies a unos 193 px del suelo.

## Decisions

- **Varias cajas**: `EnemyView.boxes()` sustituye a `box()`. Las cajas se reutilizan (se actualizan en su sitio) para no crear objetos en cada fotograma. El rebote sale hacia el lado contrario de la caja tocada.
- **Pterosaurios**: una fila es un solo reparto (`PteroSpawn` con `of`, `spacing` y `drift`), así se mantiene «un enemigo por tramo» y el recuento de enemigos por nivel. Altura entre 440 y 570 (centro): abajo toca a un zorro de pie y arriba pasa por encima de su cabeza. Ola con un retraso del 8 % del ciclo entre uno y otro. Si el tramo es corto, la fila es de dos y más junta.
- **Volcancito**: ciclo de 3,8 s: reposo 1,5 s, temblor 0,8 s (aviso) y vuelo 1,5 s. La piedra sube 430 px sobre el cráter en parábola y su caja va siempre en la columna del volcán. La mitad del vuelo, por lo menos, va por encima de un zorro que salta. El cono es una caja baja (44 px).
- **Tiranosaurio**: 55 px/s (más lento que el erizo), 2,6 s andando y 1,8 s rugiendo. La posición se calcula con el tiempo andado acumulado, así sigue siendo una función pura. Caja de 120×96 (tronco y patas, sin cabeza ni cola) para que se pueda saltar; se reparte con 140 px de margen por lado para que el dibujo no salga del tramo.
- **Aviso sin sustos**: el rugido tiene un ataque de 0,35 s y el retumbo de 0,25 s; la pantalla tiembla muy poco (0,3 %). Solo si el enemigo está a la vista.

## Risks / Trade-offs

- [El tiranosaurio puede asustar a los de 3 y 4 años] → Sin boca abierta ni gestos de ataque, rugido que crece despacio; se revisa en la prueba con niños (paso 10).
- [La cabeza del tiranosaurio queda fuera de su caja] → Es a propósito: tocarle la cabeza no penaliza, es más tolerante.
