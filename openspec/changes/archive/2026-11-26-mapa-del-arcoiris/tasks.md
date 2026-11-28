# Tasks

## 1. Lógica pura

- [x] 1.1 `src/game/map/rainbow-arc.ts`: `paintedBands`, `RainbowMemory` y `bandAngles`; pruebas en `rainbow-arc.test.ts` (perfil nuevo, 0 gajos; todo hecho, 12; un pendiente cuenta; 0 estrellas no pinta; primera vez sin nuevos; después, solo los nuevos y una sola vez; gajos ordenados de izquierda a derecha). Verificación: `npx vitest run src/game/map`.
- [x] 1.2 `src/game/map/map-sky.ts`: color del cielo en un punto mezclando las paradas vecinas; pruebas en `map-sky.test.ts` (en una parada da el cielo de su ambiente; a medio camino, la mezcla; fuera de los extremos, el extremo). Verificación: `npx vitest run src/game/map`.
- [x] 1.3 Sonido `band` en `src/game/audio/sfx.ts` (6 notas que suben con `index`), con su prueba junto a las de `sfx`. Verificación: `npx vitest run src/game/audio`.

## 2. Datos del mundo

- [x] 2.1 `WorldMap.skyline` y `WorldMap.rainbow` opcionales en `src/game/worlds/types.ts`; nodos, adornos (madriguera, sol, luna, estrellas, palmera, nubes), cielo y arco del mundo 1 en `arcoiris/index.ts`; prueba en `worlds.test.ts` de que el mapa del mundo 1 tiene arco y cielo con paradas ordenadas y ambientes que existen, y el río no. Verificación: `npm test`.
- [x] 2.2 Textura `decor-burrow` (madriguera en la colina, vectorial plana, sin contornos) en `BootScene`. Verificación: se ve en el mapa a 844×390.

## 3. Escena del mapa

- [x] 3.1 `MapScene`: cielo a lo ancho desde `skyline` (con `sky` de reserva) y arco con gajos pintados o en silueta, detrás del camino. Verificación: `npm run dev` a 844×390, perfil con los niveles 1 a 4 hechos: 4 gajos pintados, cielo de noche sobre el 6 y lila sobre el 12.
- [x] 3.2 `MapScene`: animación del gajo nuevo (cámara al arco, bandas de fuera adentro con nota y destellos, vuelta, salto del zorro) y toque que la termina sin abrir niveles. Verificación: a 844×390, perfil nuevo que termina el nivel 1: se ve la animación y el zorro salta al 2; al repetir el 1 no se anima; un toque la acaba.
- [x] 3.3 Revisión de la disposición a 844×390, 960×720 (4:3) y 1680×720 (21:9): el selector no tapa nodos, estrellas ni gajos y ningún nodo tapa el arco. Verificación: capturas de las tres proporciones.

## 4. Cierre

- [x] 4.1 `npm test` y `npm run build` pasan. Verificación: salida de los dos comandos.
- [x] 4.2 Marcar el paso 2 como hecho en `docs/MUNDO-1.md`. Verificación: revisión del texto.

## Workflow follow-up

- `openspec-sync-specs` y `openspec-archive-change` tras la verificación.
- PR contra `dev`, sin desplegar.
