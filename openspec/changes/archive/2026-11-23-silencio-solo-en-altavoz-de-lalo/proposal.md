# Proposal

## Why

Hoy hay dos altavoces en el mapa: el de la barra superior, que pone y quita el sonido, y el de Lalo,
que no hace nada. Es confuso para un niño que aún no lee. Lalo es la guía del juego, así que su
altavoz debe ser el único control de sonido, y debe estar también en el nivel.

## What Changes

- El botón de altavoz junto a Lalo pasa a alternar el silencio total (música y efectos), en el mapa y en el nivel.
- Su icono muestra altavoz normal o tachado según el estado, sin depender solo del color.
- **BREAKING**: se elimina el botón de silencio de la barra superior del mapa.
- Tocar a Lalo (el búho) sigue siendo solo una reacción (salto y parpadeo): no cambia el sonido.
- El silencio sigue recordándose en el dispositivo.

## Capabilities

### New Capabilities

### Modified Capabilities
- `mascot-guide`: el altavoz de Lalo alterna el silencio y refleja su estado.
- `world-map`: se retira el requisito del botón de silencio de la barra superior.
- `game-audio`: el silencio total se controla únicamente desde el altavoz de Lalo.

## Impact

- `src/game/ui/characters.ts` (`drawLalo`): el altavoz alterna `audio.setMuted` y cambia de icono.
- `src/game/scenes/MapScene.ts`: se elimina `buildMuteButton` y su llamada.
- `LevelScene` ya usa `drawLalo`, por lo que gana el control sin código adicional.
- Sin dependencias nuevas ni cambios en el audio ni en el almacenamiento.
