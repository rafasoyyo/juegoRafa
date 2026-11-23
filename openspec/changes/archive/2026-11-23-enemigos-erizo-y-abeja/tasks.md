# Tasks

## 1. Reparto aleatorio (lógica pura)

- [x] 1.1 Crear `src/game/enemies/enemy-layout.ts` sin importar Phaser: tipos `EnemyKind`
  (`'hedgehog' | 'bee'`), `EnemySpawn` y `Course` (`startX`, `flagX`, bloques con `x` y ancho), la
  tabla de cantidad por nivel (1, 2, 2, 3, 3, 4), los márgenes del diseño (600 px tras la salida,
  400 px antes de la bandera, 150 px a cada lado de un bloque, tramo mínimo de 200 px) y
  `layoutEnemies(level, course, rng = Math.random)` que reparte un enemigo por tramo libre. Exportar
  desde `LevelScene.ts` (o mover a un módulo compartido) los datos del recorrido que necesita
  (`START_X`, `FLAG_X`, `BLOCKS`, `BLOCK_SIZE`) sin cambiar sus valores. Verificar con `npm run build`,
  sin errores de tipos.
- [x] 1.2 Añadir `src/game/enemies/enemy-layout.test.ts` con un generador con semilla. Debe cubrir:
  - nivel 1: exactamente 1 enemigo y es un erizo, con 50 semillas distintas;
  - niveles 2 a 6: 2, 2, 3, 3 y 4 enemigos con el recorrido actual;
  - ningún enemigo (ni su tramo de patrulla) cae a menos de 600 px de la salida, a menos de 400 px de
    la bandera ni a menos de 150 px del borde de un bloque;
  - nunca hay dos enemigos en el mismo tramo libre;
  - con semillas distintas cambian las posiciones o los tipos;
  - desde el nivel 2 aparecen abejas con alguna semilla;
  - si hay menos tramos que enemigos, se devuelven los que caben, sin error.

  Verificar con `npm test`, todo en verde.

## 2. Movimiento y choque (lógica pura)

- [x] 2.1 Crear `src/game/enemies/enemy-motion.ts` sin Phaser: `hedgehogX(t, patrol)` (onda
  triangular a 60 px/s que devuelve `x` y hacia dónde mira), `beePosition(t, spawn)` (senoide
  vertical de 3,2 s entre `y = 430` y `y = 585` y deriva horizontal de ±30 px), las cajas de choque
  (erizo 48×30, abeja 50×44) y `overlaps(a, b)`. Verificar con `npm run build`, sin errores de tipos.
- [x] 2.2 Añadir `src/game/enemies/enemy-motion.test.ts`. Debe cubrir:
  - el erizo nunca sale de `[minX, maxX]` y cambia de sentido en cada extremo;
  - la abeja pasa al menos 1 s de cada ciclo con el borde inferior de su caja por encima de `y = 528`;
  - en su punto más bajo la caja de la abeja solapa la de un zorro de pie;
  - la caja del erizo es más baja que la altura del salto del zorro (194 px) con margen;
  - `overlaps` con cajas que se tocan, se cruzan y están separadas.

  Verificar con `npm test`, todo en verde.

## 3. Gráficos

- [x] 3.1 Crear `public/assets/svg/hedgehog.svg`, `bee.svg` y `bee-wing.svg` según el diseño (paleta
  de `config.ts`, pinchos redondeados, cara amable, sombra inferior sólida, sin contornos negros) y
  anotarlos como *derivado* en `public/assets/LICENSES.md`. Verificar abriendo cada SVG en el navegador:
  sin recortes, y el erizo y la abeja se reconocen a 100 px.
- [x] 3.2 Cargar `hedgehog`, `bee` y `bee-wing` en `BootScene` al tamaño en que se dibujan. Verificar
  con `npm run dev`: sin avisos de carga en la consola.

## 4. Enemigos en el nivel

- [x] 4.1 Crear `src/game/enemies/enemy-views.ts`: crea la imagen de cada enemigo a partir de un
  `EnemySpawn` (profundidad 8; la abeja con dos alas que aletean a ~14 Hz), la coloca cada fotograma
  con `enemy-motion` (erizo mirando hacia donde anda, con un pequeño balanceo) y expone `gesture()` (el
  erizo crece un 15 % 150 ms; la abeja se ladea ±15° 300 ms) y su caja de choque. Verificar con
  `npm run build`.
- [x] 4.2 En `LevelScene.create`, llamar a `layoutEnemies(this.level, …)` y crear las vistas; en
  `update`, moverlas con el tiempo de la escena. Verificar en `npm run dev` con emulación de móvil
  horizontal 844×390: el nivel 1 muestra un erizo que anda de un lado a otro y se da la vuelta; el nivel
  6 muestra 4 enemigos; al repetir un nivel cambian de sitio; no hay enemigos junto a la salida, junto a
  la bandera ni bajo los bloques.

## 5. Choque y rebote

- [x] 5.1 En `LevelScene.update`, si el nivel no ha terminado y el zorro no está protegido, comprobar
  `overlaps` entre `fox.body` y cada enemigo. Al chocar: velocidad `±0,9 × RUN_SPEED` alejándose del
  enemigo y `−0,55 × JUMP_SPEED`, 300 ms sin atender flechas ni salto, 1000 ms de protección con el
  zorro, el gorro y las piernas parpadeando, y `gesture()` del enemigo. No tocar galletas, bloques ni
  los datos de `LevelComplete`. Reiniciar el estado del rebote en `init`. Verificar en móvil emulado:
  - chocar de frente con un erizo hace rebotar al zorro hacia atrás con un saltito y parpadeo;
  - caer encima de un erizo o una abeja también rebota y el enemigo sigue ahí;
  - durante el parpadeo no hay segundo rebote;
  - antes de medio segundo se puede volver a correr y saltar;
  - se puede saltar un erizo con un toque normal;
  - se puede pasar bajo la abeja cuando está arriba.
- [x] 5.2 Comprobar que chocar no penaliza y no estorba la meta. Verificar en móvil emulado:
  - chocar varias veces, golpear todos los bloques y llegar a la bandera da el mismo número de galletas
    y 3 estrellas, sin ninguna pantalla intermedia;
  - con un enemigo cerca de la bandera, la celebración no se interrumpe y se abre la pantalla de nivel
    completado.

## 6. Integración

- [x] 6.1 Ejecutar `npm test` y `npm run build`, ambos sin errores, y `openspec validate
  enemigos-erizo-y-abeja --strict` sin avisos.
- [ ] 6.2 Jugar los niveles 1, 2 y 6 en móvil emulado horizontal (844×390) solo con los controles
  táctiles. Verificar que se completan sin ayuda, que los fotogramas no bajan respecto a antes del
  cambio (panel de rendimiento de DevTools) y que no hay errores en la consola.

## Workflow follow-up

- Probar con el niño en el móvil real (`npm run dev` por la wifi) y ajustar velocidad del erizo y
  periodo de la abeja si cuesta, sin cambiar la spec.
- Archivar el cambio cuando esté revisado.
