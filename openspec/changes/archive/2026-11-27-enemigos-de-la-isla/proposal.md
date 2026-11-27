# Proposal

## Why

Paso 5 del plan del mundo 3 (`docs/MUNDO-3.md`, «Tiranosaurio, pterosaurios y volcancitos»): la isla necesita sus propios enemigos, con un ritmo que se ve venir y un aviso antes de moverse, en el estilo A documental aprobado.

## What Changes

- **Pterosaurios**: vuelan en fila de dos o tres, a la misma altura y en ondas regulares, con un vaivén lento sobre su tramo. Su sombra en el suelo crece y se oscurece al bajar. Se pasa por debajo cuando suben. Una fila cuenta como un enemigo.
- **Volcancito**: un volcán pequeño que tiembla y echa humo (con un retumbo) antes de lanzar una piedra grande que sube y vuelve a caer en su cráter, siempre en vertical. Se salta mientras la piedra está arriba.
- **Tiranosaurio**: camina de un lado a otro de su tramo y cada pocos pasos se para a rugir (un rugido grave que crece y un temblor suave). Quieto mientras ruge; se le salta por encima. Su caja de choque es la del tronco y las patas.
- **Motor**: los enemigos pueden tener varias cajas de choque (la fila de pterosaurios, el volcán y su piedra). Cada enemigo sigue las reglas de siempre: tocarlo es un pinchazo que resta una galleta, nunca baja de 0, y nunca se coloca junto a un reto.
- **Arte**: `trex.svg` y `ptero.svg` del estilo A de la hoja de diseño, `volcano-small.svg` y `lava-rock.svg` propios, anotados en `LICENSES.md`.
- **Sonidos** `roar` y `rumble`, que solo suenan si el enemigo está a la vista.

**Fuera de alcance:** dar de alta estos enemigos en la definición de la isla (en cuanto el borrador del paso 1 esté en `mundo3`; las tablas por nivel se cierran en el paso 9).

## Capabilities

### Modified Capabilities

- `level-enemies`: tres enemigos nuevos y su reparto.
- `game-audio`: rugido y retumbo.

## Impact

- `src/game/enemies/enemy-motion.ts`, `enemy-layout.ts`, `enemy-views.ts` y sus pruebas.
- `src/game/scenes/LevelScene.ts` (cajas de choque múltiples), `BootScene.ts`, `src/game/audio/sfx.ts`.
- `public/assets/svg/` y `public/assets/LICENSES.md`.
