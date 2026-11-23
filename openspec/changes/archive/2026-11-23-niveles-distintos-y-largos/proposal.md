# Proposal

## Why

Los seis niveles del mapa son el mismo recorrido: mismo suelo, mismos 10 bloques «?» en el mismo sitio y
mismo cielo; solo cambia cuántos enemigos salen. Además se cruza en unos 12 s yendo a tope, y en torno a
20–25 s parándose en todos los bloques. Para un niño de 4 a 6 años eso es repetir lo mismo seis veces y
acabar cada nivel antes de haberse metido en él. `docs/PROPUESTA.md` fija niveles de 1 a 2 minutos: hoy
estamos muy por debajo.

## What Changes

- **Seis recorridos distintos, definidos como datos** en `content/levels/` (JSON), en lugar del recorrido
  único escrito en `src/game/level-course.ts`. Cada nivel declara su longitud, sus bloques «?», sus
  plataformas, sus escalones y su ambiente.
- **Duración pensada para un niño típico de ≈ 1 minuto como mínimo**: jugando con calma y golpeando
  todos los bloques, cada nivel dura entre 60 s y 2 min. Además, incluso yendo a tope sin parar, ningún
  nivel se cruza en menos de 30 s. Los niveles se alargan (de ~5 100 px a ~11 000–15 000 px) y llevan
  más bloques (de 10 a entre 12 y 20).
- **Elementos nuevos del recorrido**:
  - *Plataformas flotantes* redondeadas a las que se sube de un salto, atravesables desde abajo
    (nunca encierran al zorro) y que pueden llevar bloques «?» encima.
  - *Escalones* (tramos de suelo elevado de uno o dos peldaños) que se suben y bajan saltando.
- **Un ambiente visual por nivel**, propio y dibujado por código: 1 prado soleado (el de hoy), 2 campo
  de flores, 3 bosque, 4 otoño, 5 atardecer y 6 noche estrellada suave. Cambian el degradado del cielo,
  las colinas, el color del suelo y la decoración del fondo; nunca dan miedo ni restan legibilidad a
  bloques, zorro y enemigos.
- **Dificultad creciente**: los primeros niveles son casi llanos y con bloques a ras de suelo; los
  últimos encadenan escalones y plataformas, siempre con un salto normal y sin poder quedarse atascado.
- La colocación aleatoria de enemigos respeta los nuevos elementos: no aparecen sobre escalones ni bajo
  plataformas. El número de enemigos por nivel no cambia.
- **Sin hoyos ni caídas**: el suelo es continuo y no hay forma de perder, como hasta ahora.

**Habilidad educativa:** ninguna directamente. Da a cada nivel la longitud y la variedad que harán falta
para colocar los 3 a 5 retos por nivel de la fase 2 sin que el recorrido se acabe antes de empezar.

**Fuera de alcance:**
- Retos educativos dentro del nivel (fase 2).
- Hoyos, plataformas que se mueven, cuestas, agua o cualquier elemento que pueda hacer caer o atrapar al zorro.
- Editor visual de niveles (Tiled): el formato JSON es propio y sencillo; migrar a Tiled se decidirá en la fase 4.
- Cambiar el mapa del mundo para mostrar el ambiente de cada nivel, o la pantalla de nivel completado.
- Música distinta por nivel (la del cambio `musica-y-efectos` sigue siendo una para todos).
- Cambiar cuántos enemigos salen por nivel o añadir enemigos nuevos.

## Capabilities

### New Capabilities
- `level-courses`: catálogo de los 6 recorridos del mundo como datos (longitud, bloques, plataformas,
  escalones, ambiente), sus reglas de diseño (todo alcanzable con un salto normal, nada atrapa, dificultad
  creciente), su duración mínima y los ambientes visuales de cada nivel.

### Modified Capabilities
- `platformer-level`: el escenario deja de ser único y se dibuja según el ambiente del nivel; los bloques
  «?» pueden estar sobre plataformas y escalones; se añaden las plataformas flotantes y los escalones al
  comportamiento del nivel.
- `level-enemies`: las zonas seguras excluyen también escalones y el espacio bajo plataformas.
- `visual-style`: la paleta admite variantes de ambiente por nivel (cielo, colinas, suelo, fondo) sin
  tocar la de menús y HUD.

## Impact

- **Datos nuevos:** `content/levels/nivel-1.json` … `nivel-6.json` (importados por Vite en el build;
  funcionan sin conexión dentro de la PWA).
- **Código nuevo (TypeScript puro, con Vitest):** tipos y validación de un nivel, cálculo de la duración
  estimada, comprobación de alcanzabilidad de plataformas y escalones, y catálogo de ambientes.
- **Código modificado:** `src/game/level-course.ts` (deja de tener el recorrido fijo),
  `src/game/scenes/LevelScene.ts` (construye el nivel a partir de sus datos, plataformas de un solo
  sentido, escalones, ambiente), `src/game/ui/widgets.ts` (cielo, colinas, suelo y decoración según el
  ambiente), `src/game/scenes/BootScene.ts` (degradados de cielo por ambiente),
  `src/game/enemies/enemy-layout.ts` (zonas seguras con escalones y plataformas).
- **Recursos:** gráficos nuevos de plataforma y decoración de fondo generados por código, anotados como
  propios en `public/assets/LICENSES.md`.
- **Convivencia:** el cambio en curso `musica-y-efectos` también toca `LevelScene`; quien se aplique
  segundo tendrá que integrar los dos.
- **Dependencias:** ninguna nueva.
