# Proposal

## Why

El juego está en silencio. Para un niño de 4 a 6 años que no lee, el sonido es la mitad de la
respuesta: un «pop» confirma que el toque ha funcionado, un tintineo celebra la galleta y una melodía
alegre da ritmo al nivel. Además, la fase 2 traerá la voz de Lalo, y conviene tener ya montado el
sistema de audio (desbloqueo en iOS, mezcla y silencio) para que la voz solo tenga que enchufarse.

## What Changes

- **Hilo musical original** sintetizado en el propio juego con Web Audio: una melodía tranquila para
  el inicio, el mapa y mi personaje, otra más saltarina para el nivel y un jingle corto de victoria.
  Las melodías se componen para este proyecto; no hay archivos de audio ni música de terceros.
- **Efectos de sonido sintetizados** para lo que hace el niño y lo que le pasa al zorro: tocar un
  botón, saltar, golpear un bloque «?» y ganar la galleta, rebotar con un enemigo (suave, nunca de
  castigo), llegar a la bandera, cada estrella que aparece, comprar o ponerse un gorro y el «todavía
  no» de lo que está bloqueado o no se puede pagar.
- **Botón de silencio total** con el icono del altavoz (tachado cuando está en silencio) en la barra
  superior del mapa: silencia música y efectos a la vez. La elección se recuerda en el dispositivo.
- El audio arranca con el primer toque de la pantalla de inicio (requisito de iOS, ya preparado en la
  fase 0) y se calla cuando la aplicación pasa a segundo plano.
- El juego sigue funcionando sin sonido si el navegador no tiene Web Audio.

**Habilidad educativa:** ninguna directamente. Es soporte de la experiencia sin texto: el sonido
refuerza la respuesta a cada acción y preparará el canal para la voz de las consignas (fase 2).

**Fuera de alcance:**
- Voz de Lalo y consignas habladas (fase 2).
- Volúmenes separados de música, efectos y voz, y candado de adulto (panel de padres, fase 5).
- Música distinta por nivel o por mundo; ahora todos los niveles comparten la misma melodía.
- Archivos de audio (.ogg/.mp3), bibliotecas de audio nuevas o sonidos CC0 descargados.
- Guardar la preferencia de silencio en Firestore (fase 3): solo se guarda en el dispositivo.

## Capabilities

### New Capabilities
- `game-audio`: hilo musical por pantalla, efectos de sonido de las acciones del juego, silencio
  total recordado en el dispositivo, desbloqueo y pausa del audio, y origen legal (todo sintetizado).

### Modified Capabilities
- `world-map`: la barra superior del mapa incorpora el botón de silencio junto al de mi personaje.

## Impact

- **Código nuevo:** `src/game/audio/` — partituras y efectos como datos en TypeScript puro (probables
  con Vitest) y un motor que los reproduce con el `AudioContext` de Phaser.
- **Escenas:** `TitleScene` (arrancar el audio en el primer toque), `MapScene` (botón de silencio,
  música), `LevelScene` (música y efectos de salto, bloque, enemigo y bandera), `LevelCompleteScene`
  (jingle y estrellas), `WardrobeScene` (comprar/poner gorro).
- **UI:** `RoundButton` (sonido de toque y de «tiembla»), nuevo icono `icon-speaker-off.svg` derivado
  de `icon-speaker.svg`, anotado en `public/assets/LICENSES.md`.
- **Dependencias:** ninguna nueva. Peso de descarga prácticamente nulo; funciona sin conexión.
- **Privacidad:** la preferencia de silencio se guarda en `localStorage` sin identificadores.
