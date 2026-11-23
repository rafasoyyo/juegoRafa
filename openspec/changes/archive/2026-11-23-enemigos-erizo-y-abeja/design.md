# Design

## Context

- `LevelScene.ts` monta un único recorrido para los 6 niveles: mundo de 5120 px de ancho, suelo en
  `y = 620`, salida en `x = 480`, bandera en `x = 4800` y 10 bloques «?» en la constante `BLOCKS`
  (en 4 columnas o grupos). Los niveles en JSON llegarán en la fase 4.
- Físicas Arcade con gravedad 2880 px/s². El zorro corre a 352 px/s y salta a 1056 px/s: sube unos
  **194 px**, pasa **~0,73 s** en el aire y avanza **~257 px** por salto. Su cuerpo físico mide
  56×87 px; de pie, la parte de arriba del cuerpo queda en `y ≈ 528`.
- Bloques bajos: entre `y ≈ 395` y `479`; bloques altos: entre `y ≈ 338` y `422`. Un zorro que salta
  bajo un bloque se da con la cabeza, así que bajo los bloques no cabe un salto largo.
- El patrón del proyecto es separar la lógica pura (sin Phaser, probada en Vitest) del dibujo:
  `src/learning/scoring.ts` y `src/game/ui/run-cycle.ts`.
- Los cambios en curso `galletas-en-vez-de-monedas` y `zorro-piernas-en-rueda` ya están en el código
  de trabajo de `LevelScene.ts` (galletas, piernas, polvo). Este diseño parte de ese estado.

## Goals / Non-Goals

**Goals:**
- Que el reparto aleatorio y el movimiento sean funciones puras y deterministas dado el azar y el
  tiempo, para probar en Vitest las reglas de la spec (zonas seguras, cantidad, ventana de paso).
- Que el choque sea tolerante: cajas de choque más pequeñas que el dibujo.
- Que el reparto se calcule a partir de la lista de bloques y no de posiciones fijas, para que siga
  sirviendo cuando los niveles vengan en JSON.

**Non-Goals:**
- Un sistema genérico de entidades o de IA de enemigos.
- Física real para los enemigos (gravedad, colisiones con bloques).

## Decisions

### 1. Reparto aleatorio por «tramos libres», un enemigo por tramo

`enemy-layout.ts` exporta `layoutEnemies(level, course, rng = Math.random)`:

1. Parte del intervalo `[startX + 600, flagX − 400]`.
2. Le quita cada bloque ampliado 150 px por cada lado. Lo que queda son **tramos libres**.
3. Descarta los tramos de menos de 200 px.
4. Elige al azar, sin repetir, tantos tramos como enemigos toquen al nivel (tabla 1, 2, 2, 3, 3, 4).
5. En cada tramo decide el tipo (nivel 1: erizo; desde el nivel 2: erizo o abeja al 50 %), la posición
   y el sentido inicial o la fase del vuelo.

Con los bloques actuales salen 4 tramos (≈ 690, 410, 384 y 240 px), justo los necesarios para el
nivel 6. Como entre dos tramos hay siempre al menos una columna de bloques ampliada (≥ 384 px), el hueco
entre enemigos supera lo que avanza un salto, y nunca hay un enemigo bajo un bloque.

- *Alternativa*: posiciones al azar por todo el recorrido con una distancia mínima. Descartada: obliga
  a reintentos y a comprobar bloques uno a uno, y es más difícil de garantizar en un test.
- *Alternativa*: posiciones fijas por nivel. Descartada: el usuario pide colocación aleatoria.
- Si algún día hay menos tramos que enemigos, se colocan los que quepan (el test con los bloques
  actuales fija que el nivel 6 tiene 4).
- `rng` es inyectable; los tests usan un generador con semilla.

### 2. Movimiento como función del tiempo, sin estado

`enemy-motion.ts`:

- **Erizo**: `hedgehogX(t, patrol)` es una onda triangular entre `patrol.minX` y `patrol.maxX` a
  **60 px/s** (≈ 17 % del zorro), con desfase inicial al azar. Devuelve también hacia dónde mira. El
  tramo de patrulla mide `min(320, tramo − 100)` px y se coloca al azar dentro del tramo libre.
- **Abeja**: `beeY(t, phase)` es una senoide de periodo **3,2 s** con el centro de la abeja entre
  `y = 430` (arriba) y `y = 585` (abajo). Con una caja de choque de 50×44, la abeja deja pasar al
  zorro (borde inferior por encima de `y ≈ 528`) durante ~1,5 s de cada ciclo, más de 1 s aun
  descontando lo que tarda el zorro en cruzar (~0,33 s). Además oscila ±30 px en horizontal, con el
  doble de periodo, para que parezca viva.

Al ser funciones del tiempo de la escena, se pueden probar sin Phaser y no hay estado que reiniciar al
repetir el nivel.

- *Alternativa*: cuerpos Arcade con velocidad y rebote en topes invisibles. Descartada: más piezas
  (topes, gravedad desactivada) para un movimiento que es una fórmula.

### 3. Choque por solapamiento de rectángulos, sin cuerpos Arcade

Los enemigos son imágenes sin física. En cada `update`, si el nivel no ha terminado y el zorro no está
protegido, se compara la caja del cuerpo del zorro (`fox.body`) con la caja de choque de cada enemigo
(función pura `overlaps(a, b)`). Cajas: erizo 48×30 sobre un dibujo de ~100×70; abeja 50×44 sobre
~90×80.

- **Ajuste tras probar en el navegador**: con 100 px/s y caja 64×40, un erizo que se alejaba solo
  se podía saltar despegando entre 60 y 124 px de él, y con toques cortos (el salto variable recorta la
  altura) acertaba 1 de cada 4 intentos. Con 60 px/s y caja 48×30, despegar a 70-130 px pasa limpio en
  los dos sentidos con toques de 150 a 400 ms.
- *Alternativa*: `physics.add.overlap` con cuerpos dinámicos movidos con `body.reset`. Descartada:
  hay que sincronizar cuerpo e imagen cada fotograma y no aporta nada con 4 enemigos como mucho.

### 4. Rebote del zorro

Al chocar:
- Sentido: `sign(fox.x − enemigo.x)`; si es 0, el contrario a donde mira el zorro.
- Velocidad: horizontal `0,9 × RUN_SPEED` en ese sentido y vertical `−0,55 × JUMP_SPEED` (saltito de
  ~60 px). Vale igual si cae desde arriba: no hay pisotón.
- Durante **300 ms** se ignoran las flechas (si no, el niño que mantiene la flecha volvería a chocar).
  El salto también se ignora en ese tiempo.
- Durante **1000 ms** el zorro está protegido: no se comprueban choques y el zorro, el gorro y las
  piernas parpadean (alfa 0,35 ↔ 1 cada 80 ms).
- Gesto del enemigo con un tween que no toca su movimiento: el erizo crece un 15 % y vuelve (150 ms);
  la abeja se ladea ±15° (300 ms).
- No se toca `cookies`, `blocksHit` ni nada de lo que se envía a `LevelComplete`.

### 5. Dónde vive el código

- `src/game/enemies/enemy-layout.ts` y `enemy-motion.ts` (+ `.test.ts`): puros, sin Phaser. No van en
  `src/learning/` porque no son lógica pedagógica.
- `src/game/enemies/enemy-views.ts`: crea las imágenes (erizo; abeja con cuerpo y dos alas), las
  coloca cada fotograma a partir de `enemy-motion` y lanza el gesto. Las alas aletean escalando en
  vertical a ~14 Hz.
- `LevelScene.ts` solo orquesta: llama a `layoutEnemies(this.level, …)` en `create`, actualiza las
  vistas, comprueba el choque y aplica el rebote. Así no crece más una escena que ya tiene la carrera.
- Profundidad de dibujo: enemigos en 8, por debajo del zorro (10) y por encima de la bandera (5).

### 6. Gráficos

SVG propios con la paleta de `config.ts`: erizo con lomo marrón y pinchos redondeados (sin puntas
afiladas), cara crema, nariz rosa, ojos con brillo y patitas; abeja amarilla `#FFD23F` con rayas tinta
`#2B2340`, ojos grandes y sonrisa; ala aparte, blanca semitransparente. Sombra inferior sólida como el
resto, sin contornos negros. Se cargan en `BootScene` al tamaño en que se dibujan.

## Risks / Trade-offs

- [Un erizo que viene de frente acorta el tiempo para saltar] → velocidad baja (60 px/s), caja de
  choque pequeña y el salto con tolerancia que ya existe. Se verifica jugando en móvil emulado.
- [El niño mantiene la flecha y rebota una y otra vez contra el mismo erizo] → 300 ms sin control y
  1 s de protección: el erizo sigue andando y el zorro acaba pasando o saltando.
- [El rebote lanza al zorro contra otro enemigo] → imposible chocar durante la protección, y los
  tramos garantizan distancia entre enemigos.
- [Al cambiar los bloques puede haber menos de 4 tramos libres] → se colocan los que quepan, y el test
  del nivel 6 avisa si el recorrido actual deja de admitir 4.
- [Que la abeja asuste o frustre en el nivel 2] → periodo lento y ventana amplia; si en las pruebas con
  el niño cuesta, se alarga el periodo sin cambiar la spec.
- [Conflicto con los cambios en curso en `LevelScene.ts`] → se implementa después de ellos y se toca lo
  mínimo de la escena.

## Migration Plan

Sin migración: no hay datos guardados afectados. Para desactivarlo basta con no llamar a
`layoutEnemies` en `LevelScene`.
