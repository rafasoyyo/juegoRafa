# Proposal

## Why

El mundo 2, «El río de los números» (`docs/MUNDO-2.md`), necesita que el juego tenga varios mundos. La base técnica ya está hecha sin cambiar el juego: niveles por mundo y número, progreso por mundo con migración de los perfiles guardados, contenido en `content/levels/<mundo>/` y la definición de cada mundo en `src/game/worlds/`. Faltan las piezas visibles del paso 2 del plan: el selector reordenado, el desbloqueo del río según la edad y el interruptor que lo deja solo en desarrollo hasta el paso 9.

## What Changes

- El **selector de mundos** pasa al orden de la propuesta: `123`, el río (con un marco de diez como icono), formas y `Aa`. El hueco del candado desaparece.
- El **río se abre según la edad** del perfil: con 6 años o más, desde el principio; con 3 a 5 años, con candado hasta llegar al nivel 12 del mundo 1 (hecho o pendiente). Tocarlo con candado hace que tiemble, como ahora los mundos que no existen.
- El río queda tras el **interruptor `mundo-2-rio`**, activo solo en desarrollo (`npm run dev`). En el juego publicado el botón del río se ve, pero tiembla como formas y `Aa`.
- Un **borrador del mundo 2** con su nivel 1 (provisional: ambiente, prueba y recorrido del mundo 1 hasta los pasos 3, 7 y 9) para poder entrar al río en desarrollo.
- Las specs recogen lo que ya hace el código: el **mapa de cada mundo**, el **zorro que recuerda el nivel de cada mundo** y el **progreso guardado por mundo** con la migración de los perfiles antiguos.
- **Sin cambios** en el mundo 1: sus niveles, su mapa, sus pruebas y su progreso se ven y se juegan igual.

Habilidad educativa: ninguna directamente. Prepara el mundo del número (cifra, recta y amigos del 10).

**Fuera de alcance:**
- Los retos del recorrido, las pruebas de la bandera y los enemigos del río (pasos 3 a 7).
- El castillo y la medalla (paso 8).
- Los 12 recorridos, los ambientes y el mapa definitivo del río, y quitar el interruptor (paso 9).
- Los mundos de formas y de letras, que siguen temblando.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `world-map`: el selector cambia de orden y de contenido, el río se desbloquea por edad y tras un interruptor de desarrollo; cada mundo tiene su mapa y el zorro recuerda el nivel actual de cada uno.
- `child-profile`: el progreso se guarda por mundo y los perfiles guardados antes pasan enteros al mundo 1.

## Impact

- `src/game/flags.ts` (nuevo): interruptores de desarrollo.
- `src/game/worlds/types.ts`, `registry.ts` y `access.ts` (nuevo): la puerta de cada mundo (edad, mundo previo e interruptor) y su cálculo, en TypeScript puro con pruebas.
- `src/game/worlds/rio/` y `content/levels/rio/nivel-1.json` (nuevos): borrador del mundo 2.
- `src/game/scenes/MapScene.ts`: selector con los estados abierto, con candado y próximamente; si el mundo mostrado no está abierto para el perfil, se abre el mundo 1.
- `src/game/scenes/BootScene.ts` y `public/assets/svg/`: icono del marco de diez, anotado en `public/assets/LICENSES.md`.
- Sin dependencias nuevas.
