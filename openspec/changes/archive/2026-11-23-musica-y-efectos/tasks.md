# Tasks

## 1. Notas y partituras (lógica pura)

- [x] 1.1 Crear `src/game/audio/notes.ts` sin importar Phaser: `midiToHz(midi)`, `noteToMidi("C5")`
  (con sostenidos y octavas) y `parseVoice("C5/1 E5/.5 -/.5 G5/2")`, que devuelve eventos
  `{ beat, midi, dur }` acumulando el tiempo y tratando `-` como silencio. Una notación mal escrita
  lanza un error que nombra el fragmento. Verificar con `npm run build`, sin errores de tipos.
- [x] 1.2 Añadir `src/game/audio/notes.test.ts`: `A4` = 440 Hz, `C4` = 60, `C#5`/`Db5` iguales,
  silencios que avanzan el tiempo sin evento, suma de duraciones correcta y error claro con
  `"H5/1"`. Verificar con `npm test`, todo en verde.
- [x] 1.3 Crear `src/game/audio/score.ts` con las tres piezas originales (diseño, decisión 11):
  `map` (≈ 92 ppm, 8 compases, melodía + bajo), `level` (≈ 132 ppm, 8 compases, melodía + bajo +
  charles) y `victory` (≈ 2 s, sin bucle), y `eventsBetween(track, fromBeat, toBeat)` que da la
  vuelta al bucle. Verificar con `npm run build`, sin errores de tipos.
- [x] 1.4 Añadir `src/game/audio/score.test.ts`: cada voz de una pieza en bucle suma exactamente la
  longitud del bucle; todas las notas de melodía y bajo están en Do mayor pentatónico (C D E G A) y
  en un registro sin agudos extremos (≤ C7); `eventsBetween` devuelve los eventos correctos en una
  ventana que cruza el final del bucle, sin duplicados ni huecos; `victory` acaba en Do. Verificar
  con `npm test`, todo en verde.

## 2. Efectos y preferencia de silencio (lógica pura)

- [x] 2.1 Crear `src/game/audio/sfx.ts` con las recetas como datos (onda, barrido de frecuencia,
  envolvente, ruido filtrado, notas encadenadas) para `tap`, `nope`, `jump`, `block`, `cookie`,
  `bump`, `prize`, `star` (con índice 0–2 que sube el tono) y `goal`. Verificar con
  `npm run build`, sin errores de tipos.
- [x] 2.2 Añadir `src/game/audio/sfx.test.ts`: toda receta tiene ataque ≥ 5 ms (sin chasquidos),
  pico de ganancia ≤ 1, duración total ≤ 2,5 s, frecuencias entre 60 Hz y 4 kHz; `bump` y `nope` no
  usan onda cuadrada ni dientes de sierra; `star(1)` es más agudo que `star(0)` y `star(2)` que
  `star(1)`. Verificar con `npm test`, todo en verde.
- [x] 2.3 Crear `src/game/audio/mute-pref.ts` con `loadMuted(storage?)` y `saveMuted(storage?, v)`
  (clave `juegoRafa.muted`, valores `"1"`/`"0"`, por defecto con sonido, todo en `try/catch`) y su
  `mute-pref.test.ts` con un almacenamiento falso: ida y vuelta, valor por defecto, valor corrupto y
  almacenamiento que lanza al leer y al escribir. Verificar con `npm test`, todo en verde.

## 3. Motor de audio

- [x] 3.1 Crear `src/game/audio/audio-engine.ts` con la instancia `audio`: `init(game)` toma
  `game.sound.context` solo si es `WebAudioSoundManager` (si no, modo mudo con no-ops) y monta el
  grafo de buses (música 0,35 y efectos 0,8 → master 0,6 → compresor → destino) aplicando
  `loadMuted()`. Llamar a `audio.init(this.game)` desde `BootScene.create()`. Verificar con
  `npm run build` y, en `npm run dev`, que la consola no muestra errores al abrir el juego.
- [x] 3.2 Implementar `sfx(name, opts?)`: reproduce una receta en el bus de efectos, descarta la
  petición si el contexto no está `running` y aplica 40 ms mínimos entre dos `tap`. Verificar en el
  navegador con `__game` desde la consola: tras un toque, `audio.sfx('cookie')` suena; antes de
  tocar, no suena nada ni se acumula.
- [x] 3.3 Implementar el planificador de música (temporizador de 25 ms, ventana de 100 ms con
  `currentTime`, bucle exacto y resincronización si se queda atrás), `playMusic(track)` (no-op si ya
  suena esa pieza; si no, fundido cruzado 400 ms de salida y 300 ms de entrada) y `stopMusic(ms)`.
  Verificar en el navegador que la melodía del nivel suena 3 minutos seguidos sin saltos audibles y
  que repetir `playMusic('map')` no la reinicia.
- [x] 3.4 Implementar `setMuted(v)` (rampa de 50 ms del master, parar el planificador,
  `game.sound.mute = v`, `saveMuted`) y, al quitar el silencio, retomar la pieza actual. Escuchar
  `visibilitychange` para suspender y reanudar el contexto. Verificar en el navegador: silenciar
  calla todo al instante; con la pestaña oculta 10 s y vuelta, la música sigue sin ráfaga de notas.

## 4. Música en las escenas

- [x] 4.1 `TitleScene.start()`: tras `unlockAudio`, `audio.start()` y `audio.playMusic('map')`;
  `MapScene` y `WardrobeScene` llaman a `playMusic('map')` en `create()` y `LevelScene` a
  `playMusic('level')`. Verificar en Chrome con emulación de móvil horizontal: nada suena antes del
  primer toque; mapa → mi personaje → mapa no reinicia la música; mapa → nivel hace el fundido.
- [x] 4.2 `LevelScene.onGoal`: `stopMusic(300)` y `sfx('goal')`. `LevelCompleteScene`: un
  `sfx('star', { index: i })` por estrella ganada con el retardo de su animación (`200 + i·180` ms),
  solo cuando `animate` es verdadero, y `playMusic('map')` al terminar. Verificar en el navegador:
  al tocar la bandera suena el jingle; con 2 estrellas suenan dos tintineos ascendentes y luego la
  melodía del mapa; girar el dispositivo en esa pantalla no repite los tintineos.

## 5. Efectos en el juego

- [x] 5.1 `RoundButton`: `sfx('tap')` al pulsar (*pointer down*) si es interactivo y no tiene
  `sound: false`, y `sfx('nope')` en `shake()`. Verificar en el navegador: el botón de la casa suena
  con «pop»; un nivel con candado, un mundo bloqueado y una categoría atenuada suenan con «todavía
  no»; los botones de mover y saltar del nivel no suenan.
- [x] 5.2 `LevelScene`: `sfx('jump')` en la rama que aplica la velocidad de salto; `sfx('block')` y
  `sfx('cookie')` (~80 ms después) en `onBlockCollision` solo con bloque sin usar; `sfx('bump')` en
  `onEnemyHit`. Verificar en el navegador: un salto = un sonido (también con toques repetidos en el
  aire); golpear un bloque usado no suena a galleta; chocar con el erizo suena a «boing» suave.
- [x] 5.3 `WardrobeScene.choose`: `sfx('prize')` cuando `buyHat` desbloquea un gorro nuevo (comprobar
  la propiedad antes de la llamada); ponerse uno ya conseguido solo suena con el «pop». Verificar en
  el navegador comprando la gorra de lana con 10 galletas (sumarlas con `__game` en desarrollo).

## 6. Botón de silencio en el mapa

- [x] 6.1 Crear `public/assets/svg/icon-speaker-off.svg` derivado de `icon-speaker.svg` (mismo
  altavoz, con un aspa en lugar de las ondas), cargarlo en `BootScene` a 50 px y anotarlo en
  `public/assets/LICENSES.md`. Añadir en ese archivo una sección «Sonido» que diga que la música y
  los efectos son composiciones y síntesis propias del proyecto, sin archivos de audio ni música de
  terceros. Verificar con `npm run build` y viendo el icono en el navegador.
- [x] 6.2 `MapScene`: botón redondo blanco de 96 px a la izquierda del de mi personaje
  (`x = width − 32 − 48 − 96 − 16`, `y = 76`), con `icon-speaker` o `icon-speaker-off` según
  `audio.muted`; al tocarlo, `audio.setMuted(!audio.muted)` y cambia el icono. Verificar en Chrome
  con emulación horizontal a 960×720 (4:3) y a 1680×720 (21:9): el botón se ve entero y no tapa el
  contador ni los niveles; silenciar calla todo, recargar y tocar «jugar» sigue en silencio, y
  quitarlo devuelve la música del mapa.

## 7. Comprobación final

- [x] 7.1 Pasar `npm test` y `npm run build` sin errores ni avisos nuevos de tipos.
- [ ] 7.2 Probar en un móvil real por la wifi (`npm run dev`), a ser posible en un iPhone o iPad:
  la música empieza con el primer toque, los efectos se oyen por encima de la música sin saturar,
  al bloquear la pantalla y volver la música sigue bien y el juego no muestra errores. Ajustar por
  oído volúmenes y timbres que molesten y volver a pasar `npm test`.
- [ ] 7.3 Escuchar las tres piezas completas y confirmar que no recuerdan a ninguna melodía conocida
  (en especial, temas de juegos de Nintendo); si alguna lo hace, recomponerla en `score.ts` y pasar
  `npm test`.

## Workflow follow-up

- Desplegar con `npm run deploy` y probar la PWA instalada sin conexión.
- Archivar el cambio cuando esté revisado.
