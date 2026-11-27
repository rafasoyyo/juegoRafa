# Design

## Context

`MapScene` dibuja el mapa de cualquier mundo a partir de su `WorldDef.map` (cielo fijo a la cámara, adornos, nubes, río opcional, camino, nodos, castillo opcional) en un artboard de 1180×820 por pantalla que se estira al ancho real (`sx = ancho / 1180`, `sy = 720 / 820`). El estado de los niveles sale de `state.ts` (`levelStatus`, `currentLevel`); «hecho o pendiente» es lo que `state.ts` llama alcanzado. Con las estrellas por objetivos (PR #16) un nivel terminado con 0 estrellas no queda hecho ni pendiente. Hoy no hay ninguna animación del zorro entre nodos: aparece sobre el nivel actual.

## Goals / Non-Goals

**Goals:**
- Que el arco, la madriguera y el cielo a lo ancho sean datos del mundo: el motor no pregunta en qué mundo está.
- Lógica de gajos (pintados, nuevos) en TypeScript puro y probada.
- Dejar la animación del gajo como una pieza que el final (paso 4) pueda reutilizar para el gajo 12.

**Non-Goals:**
- Guardar en el perfil qué gajos se han visto animarse: basta con la sesión.
- El prólogo, el final y el castillo del mundo 1.

## Decisions

1. **Datos en `WorldMap`**. Campos opcionales nuevos:
   - `skyline?: readonly { x: number; ambient: AmbientId }[]`: paradas del cielo a lo ancho, en x del artboard (de 0 a `1180 × screens`), cada una con el cielo vertical de un ambiente existente. Sin él, se usa `sky` como hasta ahora (el río no cambia).
   - `rainbow?: { center: [x, y]; radius: number; band: number }`: arco en el artboard; `radius` (borde exterior) y `band` (grosor de cada banda) se escalan con `sy` para que el arco sea un semicírculo, no una elipse que cambie con la proporción de la pantalla.
   La madriguera, la luna y las estrellas son adornos más (`decor`), con texturas nuevas o existentes (`decor-moon`, `decor-star`).
   *Alternativa*: un `if (world === 'arcoiris')` en `MapScene`; descartada por la convención de mundos independientes.

2. **Cielo a lo ancho como textura pequeña estirada**. `map-sky.ts` (puro) da el color de cada punto mezclando los degradados de las dos paradas vecinas (`skyColorAt(skyline, ambients, u, v)`). `MapScene` crea una vez por mundo una textura de lienzo de 256×64, la rellena píxel a píxel y la estira al ancho del camino (con desplazamiento, no fija a la cámara). El suavizado al estirar basta para que no se vean escalones, y no hace falta una textura de 3000 px.
   *Alternativa*: imágenes de cada cielo una al lado de otra; las juntas se ven.

3. **Gajos en `rainbow-arc.ts` (puro)**:
   - `paintedBands(state, world)`: niveles alcanzados (hechos o pendientes), de 1 a `levelCount`.
   - `RainbowMemory`: por clave «perfil/mundo», los gajos que ya se han visto pintados. `take(key, painted)` devuelve los nuevos y los apunta como vistos; la primera vez para una clave apunta todos y no devuelve ninguno (perfil abierto con progreso, sin animación).
   - `bandAngles(i, count)`: ángulos de inicio y fin del gajo `i` sobre el semicírculo, con una pequeña separación entre gajos.
   Los gajos nuevos se apuntan como vistos al empezar la animación, así que un cambio de tamaño de la ventana o un toque que la corta no la repiten.

4. **Animación en `MapScene`** (si hay gajos nuevos): la cámara va al centro del arco (600 ms), cada gajo nuevo se pinta en 6 pasos de 140 ms de fuera adentro con `sfx('band', { index })` y unos destellos (`sparkle`), pausa breve, la cámara vuelve al zorro y el zorro salta en arco desde el nodo del último gajo nuevo hasta el nivel actual (si son distintos). Mientras dura, un toque en cualquier parte la termina: se cancelan los tweens de la secuencia, se dibujan los gajos completos, la cámara se centra en el zorro y no se abre ningún nivel (el toque se consume). Los botones de los nodos no responden durante la animación.
   El final (paso 4) podrá llamar a la misma secuencia para el gajo 12 y encadenar la lluvia al acabar.

5. **Sonido `band`**: campana corta con `index` de 0 a 5, sobre una escala mayor que sube (Do, Re, Mi, Sol, La, Do), distinta de `star` y de `scale`.

6. **Disposición**: el camino nuevo baja del nivel 6 (en lo alto, de noche) a la playa del 7 y vuelve a subir hacia las nubes. El arco va en el cielo de la segunda pantalla, por encima de los nodos 9 a 12, con los pies en dos nubes; su borde inferior queda por encima de los nodos para que ningún nivel lo tape. Los valores se ajustan a mano mirando 844×390, 4:3 y 21:9.

## Risks / Trade-offs

- [El arco queda lejos del nivel actual en los primeros niveles] → la cámara viaja hasta él y vuelve; son unos 3 s y se saltan con un toque.
- [El zorro, sobre los niveles 9 a 12, puede tapar parte del interior del arco] → el interior está vacío; el zorro está delante y las bandas quedan por encima de él.
- [Memoria solo de la sesión] → tras recargar, los gajos ya hechos se ven pintados sin animación, que es lo esperado para un perfil con progreso. Si se recarga entre terminar un nivel y volver al mapa, ese gajo no se anima: es raro y no se pierde nada.
- [Proporciones muy anchas (21:9)] → el arco, escalado con `sy`, cubre menos nodos que en 16:9; sigue sobre los últimos niveles.
