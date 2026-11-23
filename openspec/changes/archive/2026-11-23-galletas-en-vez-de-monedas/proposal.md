# Proposal

## Why

El premio del juego es hoy una moneda dorada. Una moneda es un objeto abstracto para un niño de 4 a 6
años (todavía no maneja dinero), mientras que una **galleta con pepitas de chocolate** es algo que
reconoce al instante, le apetece y encaja con el tono cálido y redondeado del juego. Conviene cambiarlo
ahora, antes de la fase 2, para que los retos de cantidad («¿cuántas galletas?», «coge el montón con
más galletas») nazcan ya con el premio definitivo y no haya que rehacer arte, specs ni voces después.

## What Changes

- **BREAKING (visual)**: el premio deja de ser una moneda y pasa a ser una **galleta con pepitas de
  chocolate**, dibujada en el estilo vectorial plano y redondeado del juego. Sustituye a la moneda en
  todos los sitios donde aparece:
  - lo que sale de un bloque «?» al golpearlo desde abajo;
  - el contador del HUD del nivel;
  - el contador del mapa del mundo;
  - el premio de la tarjeta de nivel completado;
  - el contador y los precios de los gorros en «mi personaje».
- Los gorros se **compran con galletas**. Los precios y las reglas de compra no cambian (mismo número,
  ahora en galletas).
- Se retira el gráfico de la moneda (`coin.svg`) y se añade el de la galleta (`cookie.svg`), propio del
  proyecto y anotado en `public/assets/LICENSES.md`.
- En el código, el concepto pasa a llamarse galletas (`cookies`) en el estado, el contador y los datos
  entre escenas, para que el vocabulario del código coincida con el de las specs.
- Se actualiza `docs/PROPUESTA.md` (monedas → galletas en mecánicas, HUD, retos de ejemplo y modelo
  de datos) para que el documento que manda no contradiga a las specs.

**Habilidad educativa**: ninguna nueva en este cambio. Prepara la de **cantidad**: la galleta será la
unidad que el niño cuente y compare en los retos de la fase 2, y es más fácil de contar a simple vista
que una moneda.

**Fuera de alcance**:
- Sonidos o voces de la galleta (el juego aún no tiene audio; llegará con la fase 2).
- Animaciones nuevas más allá de la que ya tiene el premio al salir del bloque (p. ej. mordiscos o
  migas).
- Cambiar precios, número de bloques, reglas de estrellas o la persistencia del progreso.
- Otros premios o tipos de galleta.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `platformer-level`: los bloques «?» sueltan una galleta en lugar de una moneda y el HUD del nivel
  muestra un contador de galletas.
- `level-complete`: la tarjeta muestra las galletas ganadas y se suman al total de galletas del niño.
- `world-map`: el mapa muestra el contador de galletas; el progreso en sesión incluye las galletas.
- `character-wardrobe`: el escaparate muestra las galletas y los gorros se compran con galletas.

## Impact

- **Gráficos**: nuevo `public/assets/svg/cookie.svg`; se elimina `public/assets/svg/coin.svg`;
  `public/assets/LICENSES.md` actualizado.
- **Código**: `src/game/scenes/BootScene.ts` (carga del gráfico), `src/game/state.ts` y
  `src/game/state.test.ts` (campo y función de completar nivel), `src/game/ui/widgets.ts` (contador),
  `src/game/scenes/LevelScene.ts`, `LevelCompleteScene.ts`, `MapScene.ts` y `WardrobeScene.ts`.
- **Documentación**: `docs/PROPUESTA.md` y las specs de las cuatro capacidades modificadas.
- **PWA**: el precache de Workbox incluirá `cookie.svg` en lugar de `coin.svg` (automático en el build).
- Sin dependencias nuevas ni cambios en Firebase (aún no hay persistencia del progreso).
