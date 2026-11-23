# Proposal

## Why

Hoy el nivel es un paseo sin ningún obstáculo: basta con mantener la flecha derecha para llegar a la
bandera. Los plataformas que el niño ya conoce tienen enemigos que «no se tocan», y esquivarlos es lo
que hace que saltar tenga sentido y que el recorrido sea divertido. `docs/PROPUESTA.md` ya prevé
«un enemigo simple que patrulla el suelo» que **no mata: si lo tocas, rebotas**. Conviene meterlo
antes de la fase 2: los retos educativos usarán enemigos («salta sobre el que lleva 3 puntos»), y
así el zorro ya sabrá chocar y esquivar.

## What Changes

- Dos enemigos **originales**, dibujados en el estilo vectorial plano y redondeado del juego, con
  cara simpática (no dan miedo) y sin parecido con personajes de terceros:
  - **Erizo de pinchos**: anda despacio por el suelo de un lado a otro dentro de un tramo. Los
    pinchos explican solos por qué no se toca. Se esquiva saltando por encima.
  - **Abeja zumbona**: vuela sobre un punto subiendo y bajando despacio, aleteando. Se esquiva
    pasando por debajo cuando está arriba (o saltando cuando está abajo).
- **No se tocan**: cualquier contacto del zorro con un enemigo, **también cayéndole encima**, provoca
  un **rebote suave**: el zorro sale despedido hacia atrás con un saltito, parpadea un momento y
  durante ese momento no puede volver a chocar. El enemigo hace un gesto (el erizo eriza los pinchos,
  la abeja se tambalea) y sigue a lo suyo. Los enemigos no desaparecen nunca.
- **Sin penalización**: chocar no quita galletas, no cambia las estrellas, no reinicia el nivel ni
  muestra ninguna pantalla. Se respeta «sin vidas ni game over».
- **Colocación aleatoria**: cada vez que se entra en un nivel (también al repetirlo) se eligen al
  azar qué enemigos salen, dónde y hacia dónde empiezan a moverse, siempre en zonas seguras: lejos de
  la salida y de la bandera, fuera de las columnas de bloques «?» y con hueco entre enemigos para
  poder aterrizar.
- **Dificultad suave por nivel**: el número de enemigos crece con el número del nivel (de 1 en el
  nivel 1 a 4 en el nivel 6). En el nivel 1 solo salen erizos; la abeja aparece a partir del nivel 2.
- Nuevos gráficos propios `hedgehog.svg`, `bee.svg` y `bee-wing.svg`, anotados en
  `public/assets/LICENSES.md`.

**Habilidad educativa**: ninguna directamente. Es mecánica de plataformas (coordinación, anticipar el
movimiento y elegir el momento de saltar). Prepara la fase 2, en la que algunos retos se presentarán
como enemigos que llevan una cantidad o un patrón.

### Fuera de alcance

- **Derrotar enemigos** saltándoles encima o de cualquier otra forma. Pisar al enemigo correcto de un
  reto llegará con los retos de la fase 2 y tendrá su propio cambio.
- Pistas de voz o de Lalo al chocar (todavía no hay audio; chocar no es un fallo de un reto).
- Sonidos de los enemigos.
- Más tipos de enemigo (cangrejo, mofeta…) o enemigos que persiguen al zorro, disparan o saltan.
- Colocar enemigos a mano en los niveles en JSON de la fase 4: por ahora la colocación es solo
  aleatoria, con las reglas de zonas seguras.
- Enemigos en el mapa, el título, el armario o la pantalla de nivel completado.

## Capabilities

### New Capabilities

- `level-enemies`: enemigos del nivel de plataformas: quiénes son y cómo se ven, cómo se mueven, qué
  pasa al tocarlos (rebote suave sin penalización) y cómo se colocan al azar en cada nivel.

### Modified Capabilities

Ninguna. Los requisitos de `platformer-level` («Sin fallo que penalice», «Arte propio o libre») se
cumplen tal cual; los nuevos comportamientos van en `level-enemies`.

## Impact

- **Código**:
  - Nuevo módulo puro `src/game/enemies/enemy-layout.ts` (sin Phaser): reparto aleatorio de enemigos
    por nivel con generador de azar inyectable, más su test en Vitest.
  - Nuevo módulo puro `src/game/enemies/enemy-motion.ts`: posición del erizo (ida y vuelta) y de la
    abeja (subir y bajar) en función del tiempo, más su test.
  - Nuevo `src/game/enemies/enemy-views.ts`: dibujo y animación de los enemigos con Phaser.
  - `src/game/scenes/LevelScene.ts`: crear los enemigos, moverlos, detectar el contacto, rebote del
    zorro, parpadeo e invulnerabilidad breve.
  - `src/game/scenes/BootScene.ts`: cargar los nuevos gráficos.
- **Gráficos**: `public/assets/svg/hedgehog.svg`, `bee.svg`, `bee-wing.svg`; registro en
  `public/assets/LICENSES.md`.
- **Sin cambios** en estrellas (`src/learning/scoring.ts`), estado, Firebase ni controles.
- Sin dependencias nuevas. El coste por fotograma es mover como mucho 4 objetos.
- Convive con los cambios en curso `galletas-en-vez-de-monedas` y `zorro-piernas-en-rueda`, que
  también tocan `LevelScene.ts`; este cambio parte del código que ya los incluye.
