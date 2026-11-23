# Design

## Context

- `LevelScene.onGoal` llama a `goTo(this, 'LevelComplete', { level, blocksHit, blocksTotal, cookies })` tras `CELEBRATE_MS`. `LevelCompleteScene.create` calcula las estrellas con `starsFor`, llama a `completeLevel` y a `saveActive`, y la flecha grande abre `level + 1` sin comprobar si está desbloqueado.
- `state.ts`: un nivel está completado si tiene una entrada en `stars`. `currentLevel` devuelve el primer nivel sin estrellas y `levelStatus` da `done`, `current` o `locked`. Solo `MapScene` usa estas funciones.
- `progress-codec.ts` guarda `{ stars, cookies, ownedHats, hat }` dentro del registro del perfil (`v: 1`). Si un campo no se entiende, se ignora.
- `active.ts` carga el progreso en `session`, pero no conserva el alias ni la edad del perfil activo. Al jugar sin almacenamiento se pierden.
- Enemigos: `layoutEnemies(level, courseFor(world))` devuelve los erizos y abejas del nivel (de 2 a 7), todos entre la salida y la bandera.
- Ya existen: `drawLalo`, `bouncingArrow` y los pictogramas de `guide-art.ts`; `RoundButton`, `digits` y `fitImage`; los sonidos `tap`, `nope`, `star`, `prize` y `goal`; y los colores de cada ambiente en `levels/ambients.ts`.
- Pantalla lógica: 720 de alto y de 960 a 1680 de ancho. En un móvil de 844×390, 1 px lógico ≈ 0,54 px en pantalla, así que 44 px en pantalla son unos 82 px lógicos.

## Goals / Non-Goals

**Goals:**
- Toda la lógica de las pruebas en TypeScript puro y determinista con semilla, probada con Vitest: generar preguntas, comprobar respuestas, intentos, pistas y resultado.
- Una sola escena genérica que dibuja cualquier tipo de pregunta a partir de datos, sin una escena por prueba.
- Que los perfiles ya guardados se lean sin migración destructiva.

**Non-Goals:**
- Voz (solo se deja el gancho `speak`), dificultad adaptativa por aciertos y estadísticas de aciertos guardadas.
- Hacer configurable desde `content/` qué prueba va en cada nivel: el mapa nivel → prueba es una constante.

## Decisions

### 1. Módulo puro `src/learning/quiz/`
- `types.ts`: `QuizKind` (`count`, `compare`, `series`, `shapes`, `name-letters`, `recall`), `AgeBand` (`small`, `medium`, `big`), `Question` y `LevelRecap`.
- `age.ts`: `ageBand(age?: number)`. 3-4 → `small`, 5-6 → `medium`, 7-8 → `big`. Sin edad, `medium`.
- `catalog.ts`: `QUIZ_BY_LEVEL` (1 → `count` … 6 → `recall`).
- `rng.ts`: generador con semilla (mulberry32) inyectable. La escena usa `Date.now()` y las pruebas, semillas fijas.
- Un generador por tipo (`count.ts`, `compare.ts`, `series.ts`, `shapes.ts`, `name-letters.ts`, `recall.ts`) con la firma `(band, rng, ctx) => Question[3]`. `ctx` lleva el alias y el `LevelRecap`. Cada generador evita repetir pregunta dentro de la prueba.
- `run.ts`: la máquina de estados de una prueba (`createRun`, `tap(run, optionId)`, `result(run)`), descrita en la decisión 3.

Alternativa descartada: generar las preguntas dentro de la escena. No se podría probar sin Phaser y rompería la regla del proyecto.

### 2. Dos formas de pregunta
- **Elegir** (`choice`): una lista de opciones y un conjunto de correctas. Normalmente hay una correcta; en «¿a quién te has encontrado?» pueden ser varias. La usan todas las pruebas salvo dos casos.
- **Tocar varias** (`multi`): una lista de piezas y unas piezas objetivo, con orden o sin él. Sin orden es «Caza de formas»; con orden, «ordenar tu nombre».

El contenido visual de cada opción es un descriptor de datos (`{ type: 'object', id: 'bee', count: 3 }`, `{ type: 'digit', value: 7 }`, `{ type: 'dots', value: 2 }`, `{ type: 'letter', char: 'L' }`, `{ type: 'shape', shape: 'triangle', color, size, angle }`, `{ type: 'ambient', id: 'noche' }`), que la escena traduce a dibujo. Así la lógica no sabe nada de Phaser y la escena no sabe nada de pedagogía.

### 3. Intentos, pistas y resultado en la lógica pura
`tap` devuelve uno de estos eventos:
- `correct`: pregunta acertada.
- `progress`: pieza correcta en una pregunta de tocar varias que aún no ha terminado.
- `wrong`, con el nivel de pista: 1 = repetir la demostración; 2 = la pista propia de la prueba.
- `failed`: tercer fallo; incluye la respuesta correcta para señalarla.

La pista propia la fija cada tipo con `hintFor(kind)`: `count-up`, `pair-up`, `rhythm`, `misfit` o `dim-wrong`. Con `dim-wrong` la lógica elige qué opción incorrecta se apaga, y tocarla después no hace nada ni cuenta como fallo. `result(run)` da `passed` cuando hay 2 o más aciertos. Así la regla «2 de 3» y la de «3 intentos» quedan probadas sin navegador.

### 4. Escena `QuizScene` separada del nivel
`LevelScene.onGoal` construye un `LevelRecap` y abre `Quiz`. El recap lleva `level`, `ambient`, cuántos erizos y abejas tenía el nivel (de las apariciones de `layoutEnemies`), `cookies`, `blocksHit` y `blocksTotal`. Al terminar, `QuizScene` abre `LevelComplete` con esos datos más `passed`.

Alternativa descartada: superponer la prueba al nivel. Habría que congelar físicas y controles, y además «¿Te acuerdas?» necesita que el nivel no se vea. Con una escena aparte, el zorro y los enemigos parados y los controles ocultos salen solos. El fondo de la prueba es el cielo del ambiente del nivel, para que se sienta parte de él.

Disposición: Lalo y su altavoz arriba a la izquierda, como en el nivel; las tres marcas de progreso arriba en el centro; el marco del modelo o la escena en el centro; y las respuestas en una fila abajo, de al menos 120 px lógicos. Se recoloca con `onResize`.

### 5. Estado: `pending` aparte de `stars`
`GameState` gana `pending: Set<number>`. Se mantiene el significado de `stars` (nivel hecho = tiene estrellas), así que los perfiles antiguos siguen igual sin migrar.
- `completeLevel`: además de lo que ya hace, quita el nivel de `pending`.
- `markPending(state, level, cookies)`: suma las galletas y, solo si el nivel no está hecho, lo añade a `pending`. Repetir un nivel hecho y fallar no lo deshace.
- `levelStatus` añade `pending`. `isUnlocked(level)` es cierto si el nivel es el 1 o si el anterior está hecho o pendiente.
- `currentLevel` devuelve el primer nivel que no esté hecho ni pendiente; si no hay ninguno, el primer pendiente; si todos están hechos, `null`.

Codec: se añade `pending: number[]`. Si falta, se lee como vacío. Se ignoran los niveles fuera de rango y los que ya tienen estrellas. La versión del registro sigue en `v: 1` porque el campo se añade sin romper nada.

### 6. `LevelCompleteScene` con dos variantes
Con `passed: true` funciona como ahora. Con `passed: false` llama a `markPending`, dibuja la tarjeta de ánimo (zorro y Lalo saludando, galletas, sin estrellas ni confeti) y suena `prize` en lugar de las estrellas. Los botones son los mismos. La flecha grande abre `level + 1`, que ya está desbloqueado por `pending`. Se mantiene una sola escena para reutilizar botones, recolocación y música.

### 7. El alias y la edad en `active.ts`
`activeAlias()` y `activeAge()` se rellenan en `startProfile` (también sin almacenamiento) y en `activateProfile` (leyendo `alias` y `age` del registro). Si no hay perfil (por ejemplo, al abrir una escena directamente en desarrollo), la edad es `undefined` (franja `medium`) y el alias, `'ZORRO'`.

### 8. Dibujo
- Formas y pictogramas con `Phaser.Graphics` en el estilo plano, como `guide-art.ts`. Las formas son círculo, cuadrado, triángulo, rombo, estrella, hexágono y rectángulo. Con colores aleatorios no hace falta un SVG por color.
- Las miniaturas de ambiente se dibujan con los colores de `ambients.ts`: cielo, colina y suelo.
- Un SVG nuevo y propio, `snail.svg`, como distractor, anotado en `LICENSES.md`.
- Los objetos del juego (galleta, erizo, abeja, estrella) se reutilizan como imágenes.
- Las cifras y letras usan `digits()` (Baloo 2). Los puntos de dado se dibujan con Graphics.

### 9. Demostración y pistas en la escena
La escena traduce cada pista a una animación:
- `demo`: `bouncingArrow` recorre el modelo y luego las respuestas.
- `count-up`: halo uno a uno.
- `pair-up`: líneas entre los dos grupos.
- `rhythm`: arcos sobre cada repetición.
- `misfit`: la pieza tocada vuela sobre el modelo y vuelve.
- `dim-wrong`: la opción baja a un 30 % de opacidad y lleva una cruz, para no depender del color.

Los toques se bloquean mientras dura cada animación, para que un niño impaciente no pierda intentos.

### 10. Sonido
Acierto: `star`. Fallo: `nope`. Prueba superada: `goal`. Prueba no superada: `prize`. La música del mapa se para durante la prueba. Hay un gancho `speak(questionKind)` sin efecto, para la fase 2.

## Risks / Trade-offs

- [Sin voz, «menos» o «¿qué salía de los bloques?» pueden no entenderse] → La demostración de Lalo y la pista lo hacen visible. «Menos» no sale a los pequeños. Hay que revisarlo jugando con niños y, si no se entiende, retirar esa pregunta hasta la fase 2.
- [Contar de memoria erizos y abejas es difícil] → Solo desde la franja `medium`, y hay 3 intentos con una opción apagada en la pista.
- [El 3.er intento con una opción apagada es al 50 %, así que se puede aprobar por suerte] → Se acepta: la prueba es para practicar, no un examen, y el progreso real se medirá cuando exista la adaptación.
- [Rejugar un nivel de 1-2 min para repetir la prueba puede cansar] → Se acepta para esta versión, porque así lo pidió el usuario. «Repetir solo la prueba» queda fuera de alcance.
- [Un alias con letras repetidas, como «ANA», da preguntas iguales o un orden ambiguo] → Al ordenar, cualquier copia de la letra correcta vale. En las preguntas de hueco se usan posiciones distintas.
- [Pantallas de 21:9 dejan mucho espacio libre] → Se centra en un ancho útil de como mucho 1200 px lógicos.

## Migration Plan

No hay pasos de despliegue especiales. Los perfiles guardados sin `pending` se leen igual. Para volver atrás basta con revertir el cambio: el campo `pending` de los registros ya guardados lo ignora la versión anterior del codec, que descarta los campos que no conoce.
