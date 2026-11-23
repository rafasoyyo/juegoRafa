# Design

## Context

- El juego no tiene ningún sonido. Phaser (4.2.1 en `package.json`) crea un `WebAudioSoundManager`
  con su propio `AudioContext`; lo suspende al perder el foco (`pauseOnBlur`, activo por defecto) y lo
  reanuda al volver. `TitleScene.unlockAudio()` ya reanuda ese contexto dentro del primer toque (iOS).
- Las escenas cambian con `goTo()` (`src/game/ui/transition.ts`): fundido de 250 ms de salida y 250 ms
  de entrada. Cada escena se destruye y se vuelve a crear, así que lo que deba sobrevivir al cambio
  (la música) no puede vivir dentro de una escena.
- Todos los botones del juego son `RoundButton` (`src/game/ui/round-button.ts`), con `shake()` para el
  «todavía no». Los controles de mover y saltar también son `RoundButton`, pero con
  `interactive: false`.
- Restricciones del proyecto: nada de recursos de terceros con copyright, todo debe funcionar sin
  conexión (PWA) y la lógica que se pueda probar se escribe en TypeScript puro con Vitest.

## Goals / Non-Goals

**Goals:**
- Un único motor de audio para toda la aplicación, independiente de las escenas, al que la voz de la
  fase 2 se pueda enchufar como un bus más.
- Música y efectos definidos como **datos** (partituras y recetas) en TypeScript puro y probados con
  Vitest; la parte que toca Web Audio, lo más fina posible.
- Cero bytes de audio que descargar y cero dependencias nuevas.

**Non-Goals:**
- Un secuenciador general ni un formato de partitura reutilizable fuera del juego.
- Mezcla por buses ajustable por el usuario (se fija en código; los deslizadores son de la fase 5).
- Sonido espacial, reverberación o efectos que dependan de la posición en el nivel.

## Decisions

### 1. Síntesis con Web Audio en lugar de archivos
Música y efectos se generan con osciladores, ruido, filtros y envolventes sobre el `AudioContext` de
Phaser. **Por qué:** licencia limpia por construcción (todo se compone aquí), 0 KB de descarga,
funciona sin conexión sin tocar Workbox y el tono «vectorial plano y redondeado» encaja con un timbre
sintético suave. **Alternativas:** archivos CC0 de Kenney (más realistas, pero cientos de KB y
dependencia de lo que haya publicado); renderizar los sintetizados a .ogg con un script (añade un
paso de build sin ventaja real, porque el coste de CPU de sintetizar en vivo es mínimo).

### 2. Reutilizar el `AudioContext` de Phaser
El motor toma `game.sound.context` cuando el gestor es `WebAudioSoundManager`. **Por qué:** así
hereda gratis el desbloqueo de iOS del primer toque y la suspensión al perder el foco, y la futura
voz (archivos que reproducirá Phaser) comparte reloj y salida. **Alternativa:** un `AudioContext`
propio — habría que duplicar desbloqueo y pausa, y en iOS dos contextos dan problemas. Si el gestor no
es Web Audio (`NoAudioSoundManager` o HTML5), el motor queda en modo mudo: todas sus llamadas son
no-ops.

### 3. Estructura de módulos en `src/game/audio/`
- `notes.ts` (puro): nombre de nota → frecuencia y parser de una notación compacta de texto
  (`"C5/1 E5/.5 -/.5 G5/2"`: nota/duración en pulsos, `-` = silencio) a eventos `{ beat, midi, dur }`.
- `score.ts` (puro): las tres piezas (`map`, `level`, `victory`) con tempo, longitud del bucle en
  pulsos y voces (melodía, bajo, percusión), y `eventsBetween(track, fromBeat, toBeat)`, que devuelve
  los eventos de una ventana teniendo en cuenta el bucle.
- `sfx.ts` (puro): recetas de cada efecto como datos (forma de onda, barrido de frecuencia,
  envolvente ADSR, ruido filtrado, notas encadenadas). Nombres: `tap`, `nope`, `jump`, `block`,
  `cookie`, `bump`, `prize`, `star` (con índice para subir el tono), `goal`.
- `mute-pref.ts` (puro): leer y guardar el silencio con un `Storage` inyectado, envuelto en
  `try/catch` (navegación privada, almacenamiento bloqueado) y con valor por defecto «con sonido».
- `audio-engine.ts` (Web Audio): grafo, planificador de música, reproducción de recetas y silencio.
  Exporta una instancia única `audio` con `init(game)`, `start()`, `playMusic(track)`,
  `stopMusic(fadeMs)`, `sfx(name, opts?)`, `setMuted(bool)` y `muted`.

**Por qué así:** todo lo que decide *qué* suena es puro y testeable; solo `audio-engine.ts` necesita
navegador. Es el mismo reparto que `run-cycle.ts` / `LevelScene`.

### 4. Grafo de mezcla con buses
`fuente → bus (música | efectos) → master → compresor (limitador) → destino`.
Ganancias fijas de partida: master 0,6; música 0,35; efectos 0,8. Hueco reservado para un bus de voz
en la fase 2, con *ducking* de la música cuando hable Lalo. El compresor con umbral alto actúa de
limitador para que varios efectos a la vez no saturen. **Alternativa:** conectar todo directo al
destino — más simple, pero sin forma de equilibrar música y efectos ni de silenciar todo de golpe.

### 5. Planificador de música con ventana de anticipación
Un temporizador cada 25 ms programa en Web Audio los eventos de los próximos 100 ms usando
`context.currentTime` (patrón «dos relojes»). El tiempo de la pieza se lleva en pulsos y da la vuelta
al llegar al final del bucle, de modo que el bucle es exacto. Si al despertar la siguiente nota ya ha
quedado atrás más de una ventana (contexto suspendido, pestaña en segundo plano), el planificador
**se resincroniza** a `currentTime` en lugar de recuperar las notas atrasadas. **Alternativa:**
`setInterval` con `setTimeout` por nota — deriva y se oye irregular en móviles.

### 6. Cambio de música entre escenas
Cada escena llama a `audio.playMusic(track)` en su `create()`: si ya suena esa pieza no hace nada
(mapa ↔ mi personaje); si es otra, la actual baja a 0 en 400 ms y se para, y la nueva sube desde 0 en
300 ms. Cada pieza en reproducción tiene su propio nodo de ganancia, así ambas se cruzan sin cortes.
`TitleScene` no llama a `playMusic` hasta el primer toque. `LevelScene.onGoal` llama a
`stopMusic(300)` y al efecto `goal` (el jingle); `LevelCompleteScene` programa un `star` por estrella
con los mismos retardos que su animación (`200 + i·180` ms) y, al acabar, `playMusic('map')`. En las
reconstrucciones por cambio de tamaño (`animate = false`) no se repiten los tintineos.

### 7. Sonidos de los botones dentro de `RoundButton`
`tap` suena al pulsar (*pointer down*), que es cuando la cara del botón se hunde, y `nope` dentro de
`shake()`. Así cubren a la vez mapa, mundos, categorías y gorros sin tocar cada escena. Los botones
con `interactive: false` (controles del nivel) no suenan. Una opción `sound: false` permite apagar el
`tap` donde otro efecto lo sustituya. En lo bloqueado se oyen `tap` y, al soltar, `nope`: es la
misma secuencia que la animación (hundirse y temblar). **Alternativa:** sonido por escena en cada
`onTap` — más control, pero fácil olvidarse de algún botón.

### 8. Efectos del nivel
- `jump`: en `LevelScene.update`, en la rama que aplica la velocidad de salto (una vez por salto real,
  no por toque en el aire).
- `block` + `cookie`: en `onBlockCollision`, solo cuando el bloque no estaba usado; `cookie` con
  ~80 ms de retraso, a la vez que sube la galleta.
- `bump`: en `onEnemyHit`. Receta de «boing» (seno con barrido descendente-ascendente y vibrato),
  sin ruido ni graves fuertes, para que suene a juego y no a castigo.
- `prize`: en `WardrobeScene.choose` cuando se compra un gorro nuevo (no al ponerse uno ya conseguido).

### 9. Silencio total
`setMuted(true)` lleva la ganancia del master a 0 con una rampa de 50 ms (sin chasquido), para el
planificador de música para no gastar batería y pone `game.sound.mute = true` para que la futura voz
también calle. Al quitarlo, sube el master y vuelve a sonar la pieza de la escena actual desde el
principio. La preferencia se guarda en `localStorage` (clave `juegoRafa.muted`, valor `"1"`/`"0"`):
es una preferencia del dispositivo sin identificadores, compatible con las restricciones de datos de
menores. El botón vive en el mapa (`MapScene`), a la izquierda del de mi personaje, con
`icon-speaker` / `icon-speaker-off` (nuevo, derivado del altavoz con un aspa en lugar de las ondas,
para que el estado no dependa solo del color).

### 10. Segundo plano
Se confía en la suspensión del contexto que ya hace Phaser al perder el foco y, por robustez en iOS,
el motor escucha también `visibilitychange` para suspender y reanudar. El planificador se
resincroniza al volver (decisión 5). Los efectos que se pidan con el contexto no `running` se
descartan, para que no salgan todos juntos al reanudar.

### 11. Composición original
Las melodías se escriben aquí, en Do mayor pentatónico (sin semitonos «agrios» para un oído
infantil), con frases cortas y repetitivas: mapa ≈ 92 ppm, 8 compases, melodía en triangular con
bajo en seno; nivel ≈ 132 ppm, 8 compases, con charles de ruido corto; victoria ≈ 2 s, arpegio
ascendente que acaba en la tónica. No se transcribe ni se imita ninguna música existente (en especial,
ningún tema de juegos de Nintendo); se anota así en `LICENSES.md`.

## Risks / Trade-offs

- [Los sonidos sintéticos suenan «baratos» o cansan a los padres] → timbres suaves (triangular y seno,
  ataques de 5–15 ms, filtro paso bajo), música por debajo de los efectos y botón de silencio a mano.
  Ajuste por oído en el móvil como parte de las tareas.
- [El planificador se oye irregular en móviles lentos] → ventana de 100 ms con temporizador de 25 ms;
  si hiciera falta, ampliar la ventana a 200 ms sin cambiar nada más.
- [El niño activa el silencio sin querer y no sabe quitarlo] → icono tachado claro y el mismo botón
  lo devuelve; como último recurso, el adulto lo quita desde el mapa.
- [Un sonido suena dos veces por toques muy seguidos o rebotes de física] → `jump`, `block` y `bump`
  ya están protegidos por la lógica del nivel (salto con *buffer*, bloque marcado como usado,
  protección de 1 s tras el choque); se añade un mínimo de 40 ms entre dos `tap`.
- [iOS con el interruptor de silencio físico activado no reproduce Web Audio] → comportamiento del
  sistema que se acepta; no se fuerza la sesión de audio.
- [Parecido involuntario con una melodía conocida] → revisión por oído antes de publicar; las
  piezas son datos y se cambian sin tocar el motor.

## Migration Plan

Sin migración de datos. Se despliega con `npm run deploy` como siempre. Si algo falla en un
dispositivo, basta con no llamar a `audio.init()` en `BootScene` para volver a un juego mudo sin
tocar escenas (todas las llamadas del motor son no-ops sin inicializar).
