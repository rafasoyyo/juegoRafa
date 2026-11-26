# Proposal

## Why

Paso 3 del plan del mundo 1 (`docs/MUNDO-1.md`, «1. El prólogo»). La prueba con niños se ha dado por validada: el hilo del arcoíris se entiende. Falta el momento que lo presenta: la primera vez que se juega, Lalo le señala a Rufo el arcoíris lejano antes de que empiece el camino.

## What Changes

- **Prólogo sin texto** al entrar por primera vez en el nivel 1 del mundo de los números con un perfil sin progreso en ese mundo: Rufo asoma de la madriguera y se despereza, Lalo vuela a su lado y señala a la derecha, el arcoíris del horizonte destella con un tintineo de 6 notas y Rufo da un salto de alegría. Dura unos 4 segundos; mientras, el niño no puede mover a Rufo. Un toque lo salta.
- **Una vez por perfil**: el perfil guarda que ya lo vio (una marca, sin más datos del niño). Un perfil con progreso en el mundo 1 no lo ve.
- **Se repite tocando la madriguera del mapa**: abre el nivel 1 con el prólogo.
- La madriguera aparece también al principio del nivel 1, detrás de la salida.
- Todo sale de la definición del mundo (`WorldDef.prologue`): el río no tiene prólogo.

Habilidad educativa: ninguna directa; da sentido a la meta del mundo.

**Fuera de alcance:** el final (paso 4), el castillo (paso 5), voz grabada y textos para el niño.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `mascot-guide`: Lalo presenta el arcoíris en el prólogo.
- `child-profile`: el perfil guarda las escenas de historia ya vistas.
- `world-map`: tocar la madriguera repite el prólogo.

## Impact

- `src/game/state.ts` (`GameState.seen`), `src/game/profile/progress-codec.ts` y sus pruebas.
- `src/game/story/prologue.ts` (nuevo, Phaser) y `src/game/story/story.ts` (nuevo, puro, con pruebas).
- `src/game/scenes/LevelScene.ts`, `src/game/scenes/MapScene.ts`, `src/game/ui/widgets.ts` (devuelve el arcoíris del horizonte).
- `src/game/worlds/types.ts`, `arcoiris/index.ts`.
