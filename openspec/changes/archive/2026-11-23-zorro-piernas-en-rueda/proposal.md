# Proposal

## Why

Ahora mismo el zorro «corre» deslizándose con los pies quietos y solo se balancea de lado a lado:
no se ve que corra. Queremos que corra con piernas «en rueda», la técnica clásica de los dibujos
animados de corredores muy rápidos: al arrancar se ven las zancadas, que se aceleran hasta
convertirse en una rueda borrosa bajo el cuerpo. Correr es lo que más hace el niño en cada nivel,
así que es lo que más se nota.

Solo tomamos la técnica de animación, que es genérica. No copiamos ningún personaje, dibujo, sonido
ni nombre de terceros: el corredor sigue siendo el zorro propio del juego.

## What Changes

- El zorro tiene piernas visibles al correr: dos patas naranjas con pies marrones que dan zancadas
  y se dibujan por código cada fotograma.
- **Arranque**: al empezar a correr, las zancadas aceleran durante unos 0,4 s.
- **Rueda**: a ritmo de carrera, las piernas se convierten en una rueda borrosa (huellas
  semitransparentes de los pies que giran en círculo). El cuerpo se inclina hacia delante y rebota
  un poco, y salen líneas de velocidad detrás y nubecillas de polvo de los pies.
- **Parada**: al soltar, la rueda desaparece en el acto y el zorro vuelve a la pose quieta de
  respirar.
- **Salto**: en el aire se sigue usando la pose de salto actual. Al aterrizar corriendo, la rueda
  vuelve enseguida, sin repetir el arranque.
- **Meta**: durante la celebración no aparecen las piernas en rueda.
- Se añade la pose `run` del zorro (cuerpo sin pies) y su encaje del gorro.
- Es un cambio solo visual: **no cambian** la velocidad, la aceleración, el salto ni los controles.

**Habilidad educativa**: ninguna. Es un cambio de animación y de lo que se siente al jugar.

### Fuera de alcance

- Cambiar las físicas, como añadir aceleración progresiva o una velocidad punta mayor.
- Que el zorro gire las piernas en el sitio antes de salir disparado: añadiría retraso a la
  respuesta del control.
- Frenazo con derrape y polvo al soltar.
- Sonidos de carrera (todavía no hay audio).
- Animar las piernas en el mapa, el título, el armario o la pantalla de nivel completado.

## Capabilities

### New Capabilities
<!-- Ninguna -->

### Modified Capabilities
- `platformer-level`: el requisito «Animaciones del zorro» pasa de «balancearse al andar» a correr
  con zancadas que se aceleran hasta formar una rueda borrosa, con inclinación, líneas de velocidad
  y polvo.

## Impact

- `src/game/scenes/LevelScene.ts`: `animateFox` (nuevo estado de carrera, inclinación, gráfico de
  piernas y efectos) y `buildFox`.
- `src/game/ui/characters.ts`: nueva pose `run` en `FoxPose` y en `HAT_OFFSETS`.
- Nuevo módulo puro `src/game/ui/run-cycle.ts` (cinemática de las piernas, sin Phaser) con tests en
  Vitest.
- `src/game/scenes/BootScene.ts`: carga de la nueva textura `fox-run`.
- Nuevo `public/assets/svg/fox-run.svg` (derivado de `fox-idle.svg`, sin pies), anotado en
  `public/assets/LICENSES.md`.
- No añade dependencias. El coste por fotograma es redibujar un único `Graphics` con unas pocas
  formas.
