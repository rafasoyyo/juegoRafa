# Design

## Context

Motivación y alcance en `proposal.md`. Lo aprobado está en `docs/MUNDO-1.md`, sección «2. El arcoíris en el horizonte».

Estado actual del código:

- `addScenery` (`src/game/ui/widgets.ts`) dibuja el fondo de atrás adelante: cielo, sol (atardecer) o luna y estrellas (noche) con `scrollFactor` 0,03, nubes (0,3), picos de la montaña (0,25), colinas lejanas (0,45), mar, decoración (0,52), colinas cercanas (0,6), fosos y suelo. No sabe en qué nivel está: solo recibe el `Ambient`.
- El arcoíris solo existe en el ambiente `nubes` (`decor: 'rainbow'`): imagen `decor-rainbow` en `MAX_W * 0.58`, base en `groundTop - 60`, `scrollFactor` 0,03 y alfa 0,7, con nubes grandes delante.
- `decor-rainbow` (`BootScene`) mide 600×312: 6 arcos con trazo de 22 px y radio de 280 a 170 px. El comentario dice «cinco bandas» por error. `quiz-art.ts` lo usa con `fitImage` en las miniaturas de la prueba (siempre reducido).
- El ancho lógico varía entre 960 y 1680 (`fitWidth`). A 844×390 es 1558. Los recorridos miden de 140 a 210 baldosas (de 11 760 a 17 640 px), así que con 0,03 el sol y la luna se desplazan hasta unos 480 px a lo largo del nivel.
- `LevelScene.init` conoce `this.level` (1 a 12).

## Goals / Non-Goals

**Goals:**
- Una sola función pura que decide todo el arcoíris del nivel (tamaño, posición, opacidad y paralaje), probada en Vitest sin Phaser.
- Un único punto de dibujo en `addScenery`, que sustituye al caso especial del ambiente de nubes.
- El arcoíris a la vista de la salida a la bandera con cualquier ancho lógico (960 a 1680).

**Non-Goals:**
- Animar el arcoíris (destellos, crecer dentro del nivel). El destello es del prólogo (paso 3).
- Reorganizar las demás capas del fondo o el sol y la luna.
- Tocar `MapScene`: el arco de 12 gajos del mapa es del paso 2 y tendrá su propia función.

## Decisions

### 1. Función pura `horizonRainbow` en `src/game/levels/horizon-rainbow.ts`

Firma orientativa: `horizonRainbow(level, ambient, viewW, worldW)` → `{ width, x, bottom, alpha, scrollFactor }`. Todas las medidas van en píxeles lógicos y `width` es el ancho exterior del arco.

- **Tamaño:** interpolación lineal del nivel 1 (≈ 180 px de ancho) al 11 (≈ 640 px, «medio cielo» a 720 de alto), estrictamente creciente. El 12 es un caso aparte, mayor que todos (≈ 1100 px): Rufo corre bajo el arco. Los valores exactos se ajustan en la revisión a 844×390. La prueba fija solo el orden y los límites.
- **Posición:** el centro del arco empieza a la derecha de la vista (≈ 0,78 de `viewW`; en el 12, más centrado, ≈ 0,6, porque es tan ancho que ya cubre la pantalla) y la base va justo detrás de la cresta de las colinas lejanas, para que las patas del arco queden escondidas.
- **Paralaje:** en vez del 0,03 fijo del sol, `scrollFactor = desplazamiento / (worldW − viewW)`, con un desplazamiento total de unas 0,3 vistas. Así, en todos los niveles y anchos, el arco se acerca poco a poco al centro de la pantalla mientras Rufo llega a la bandera, y nunca se sale.
- **Opacidad:** `ambient.rainbowAlpha ?? RAINBOW_ALPHA` (≈ 0,75, en la línea del 0,72 de la decoración: más apagado que el recorrido).

*Alternativas:* (a) solo una tabla de escalas por nivel con la posición fija en `addScenery`. Es más simple, pero lo difícil de probar (que siga a la vista con cualquier ancho y longitud) quedaría fuera de Vitest. (b) Un `scrollFactor` fijo de 0,03, como el sol. Con los niveles cortos y la vista ancha casi no se movería, y con los largos y la vista de 960 un arco mediano podría salirse por la izquierda.

### 2. Opacidad por ambiente en `Ambient`

Nuevo campo opcional `rainbowAlpha?: number` en `Ambient`, con valor solo en `noche` (la mitad del normal, ≈ 0,38). Sigue el patrón de `pitMix`: el ambiente decide su tinte y la regla común vive en una constante.

*Alternativa:* un `if (id === 'noche')` dentro de la función. Se descarta porque mezcla datos del ambiente con la lógica y `docs/MUNDO-1.md` lo sitúa en `ambients.ts`.

### 3. Primera capa tras el cielo, detrás del sol y la luna

`addScenery` recibe el número de nivel (nuevo parámetro antes de `ground`, que sigue siendo opcional) y dibuja el arcoíris justo después del cielo. Así quedan delante el sol, la luna, las estrellas, las nubes, los picos (el arco «asoma por detrás de los picos» en el 9), las colinas, el mar y todo lo demás. Se borra el bloque `if (ambient.decor === 'rainbow')` que dibujaba el arcoíris de las nubes. Se mantienen las nubes grandes delante del arco en el ambiente `nubes`.

`addScenery` solo lo usa `LevelScene`, que pasa `this.level` y `this.scale.width` (la vista al crear la escena, igual que se colocan hoy el sol y la luna).

*Alternativa:* dibujarlo después del sol y la luna. En el atardecer y la noche, el arco taparía el astro, que es parte de lo que hace reconocible cada ambiente.

### 4. `decor-rainbow` con más resolución

La textura pasa a generarse al doble (1200×624, con trazo y radios ×2) para que el arco del nivel 12 (≈ 1100 px) se muestre a escala ≤ 1 y no se vea borroso. En el juego se coloca con `setDisplaySize` a partir de `width`, no con una escala fija. Las miniaturas de la prueba no cambian, porque `fitImage` ajusta al tamaño del marco. Se corrige el comentario («seis bandas»).

*Alternativa:* dibujar el arco con `Graphics` a su tamaño en cada nivel. Siempre sería nítido, pero rompe la reutilización de la textura que piden el mapa y el prólogo y que pide `docs/MUNDO-1.md`.

## Risks / Trade-offs

- [El arco del atardecer o de la noche se monta con el sol o la luna] → El arco va detrás de ellos (decisión 3). Al revisar los niveles 5 y 6 a 844×390, si se tapan demasiado, se ajusta la posición del arco en la función.
- [El arco pequeño del nivel 1 queda casi oculto por las colinas lejanas] → La base va a la altura de la cresta, no del suelo. Se revisa a 844×390 y a 960 de ancho, y se sube la base si hace falta.
- [Si la vista cambia de ancho a mitad de nivel (girar la tableta), la posición calculada con el ancho inicial ya no encaja] → Lo mismo pasa hoy con el sol y la luna. El arco sigue a la vista porque el recorrido de paralaje es una fracción pequeña. Recolocarlo al redimensionar queda fuera de este cambio.
- [La textura al doble ocupa más memoria (≈ 3 MB en GPU)] → Es una sola textura. Si molesta en tabletas antiguas, se puede bajar a 1,5× sin cambiar nada más.
- [Un arco mayor en el nivel 12 cambia el aspecto del ambiente de nubes] → Es lo aprobado («corre bajo el arcoíris»). Las nubes grandes siguen delante y el recorrido no cambia.

## Migration Plan

No hay datos guardados ni formatos afectados. Se despliega con el siguiente `npm run deploy` y, si hace falta, se revierte con el commit.
