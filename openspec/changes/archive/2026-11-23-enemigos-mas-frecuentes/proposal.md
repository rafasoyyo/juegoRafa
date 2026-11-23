## Why

Los niveles son largos (11 000–14 000 px) y entre enemigo y enemigo el niño corre mucho rato sin que pase nada: hay 1–4 enemigos por nivel y hasta 10 tramos libres de suelo llano sin usar. Con más erizos y abejas el recorrido se siente más vivo.

## What Changes

- Sube el número de enemigos por nivel de `1, 2, 2, 3, 3, 4` a `2, 3, 4, 5, 6, 7` (niveles 1 a 6).
- El nivel 1 sigue siendo solo de erizos (ahora dos); la abeja puede salir desde el nivel 2, con la misma probabilidad que hasta ahora.
- Sin cambios en el movimiento, el choque, las zonas seguras ni los gráficos: los enemigos siguen en tramos libres de suelo llano, como mucho uno por tramo (hay 8–10 tramos por nivel, así que caben todos).

## Capabilities

### New Capabilities
<!-- Ninguna -->

### Modified Capabilities
- `level-enemies`: cambia el requisito «Cantidad de enemigos por nivel» (más enemigos por nivel).

## Impact

- `src/game/enemies/enemy-layout.ts` (`ENEMIES_PER_LEVEL`) y `src/game/enemies/enemy-layout.test.ts`.
- Dificultad algo mayor; aceptable porque chocar solo rebota, sin penalización.
