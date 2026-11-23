# Design

## Context

Ver `proposal.md` (Why). Estado actual que condiciona el diseño:

- `src/game/level-course.ts` fija un único recorrido: `WORLD_W = 5 120 px`, salida en x = 480,
  bandera en x = 4 800 y 10 bloques «?» con dos alturas (`high`). `LevelScene` lo usa para todos los
  niveles; solo `layoutEnemies(level, course)` depende del número de nivel.
- Física (Arcade): gravedad 2 880 px/s², salto 1 056 px/s → el zorro levanta los pies unos **193 px**;
  carrera a **352 px/s** constante, también en el aire. Caja del zorro 56×87 px.
- Alto lógico fijo de 720 px, suelo en y = 620 y HUD fijo arriba hasta y ≈ 124. La cámara solo se
  desplaza en horizontal.
- Los bloques actuales tienen su base a 141 px (bajos) o 198 px (altos) sobre el suelo, y miden 84 px
  (`BLOCK_SIZE`).
- `enemy-layout.ts` calcula «tramos libres» restando las columnas de bloques; es TypeScript puro con tests.
- El escenario (`addSky`, `drawHills`, `addClouds`, `drawGround` en `widgets.ts`) usa los colores fijos
  de `COLORS` y la textura de degradado `sky` creada en `BootScene`.
- El cambio en curso `musica-y-efectos` también modifica `LevelScene`.

## Goals / Non-Goals

**Goals:**
- Un formato de nivel pequeño y legible a mano, validado por pruebas, que `LevelScene` convierte en
  mundo de juego sin lógica específica de cada nivel.
- Comprobar con Vitest, sin abrir el navegador, la duración estimada, la alcanzabilidad y que nada atrapa.
- Ambientes como datos (colores + tipo de decoración) dibujados por código, sin archivos de imagen nuevos.

**Non-Goals:**
- Desplazamiento vertical de cámara o niveles más altos que una pantalla.
- Física nueva (pendientes, plataformas móviles) o cambios en la velocidad y el salto del zorro.
- Generar recorridos al azar: los recorridos son fijos; solo los enemigos siguen siendo aleatorios.

## Decisions

### 1. JSON propio en `content/levels/`, en unidades de baldosa
Un archivo por nivel (`nivel-1.json` … `nivel-6.json`), importado de forma estática por Vite (entra en
el bundle y en la caché de la PWA). Las posiciones van en **baldosas** de 84 px (el tamaño de un bloque)
para que se puedan editar a mano sin calcular píxeles:

```json
{
  "ambient": "bosque",
  "length": 150,
  "steps":     [{ "x": 30, "width": 6, "height": 1 }],
  "platforms": [{ "x": 52, "width": 4, "height": 1.5 }],
  "blocks":    [{ "x": 12, "row": "low" }, { "x": 54, "row": "low", "on": "platform" }]
}
```

- `x` es el borde izquierdo (o el centro, en bloques) en baldosas desde el inicio del mundo; `length`
  incluye la salida y la zona de bandera.
- `steps[].height` en peldaños (1 o 2; un peldaño = 0,75 baldosas = 63 px).
- `platforms[].height`: altura de la cara superior sobre la superficie de debajo, en baldosas.
- `blocks[].row`: `low` / `high` como hoy (base a 141 o 198 px **sobre la superficie que tiene debajo**:
  suelo, escalón o plataforma). La superficie se deduce de la geometría; `on` es solo documentación
  opcional y la validación comprueba que coincide.

Un módulo TypeScript puro (`src/game/levels/`) contiene los tipos, `parseLevel` (valida la forma del
JSON y lanza un error con el nivel y el elemento), la conversión a píxeles del mundo y el catálogo
`LEVELS[1..6]`. `level-course.ts` conserva solo las constantes geométricas (`GROUND_TOP`,
`BLOCK_SIZE`, `SCALE`) y deja de exportar el recorrido.

*Alternativas:* **Tiled** (lo cita `PROPUESTA.md`) obliga a mantener tilesets y un editor externo para
seis niveles con pocos elementos; se reconsidera en la fase 4. **Recorridos en TypeScript**
funcionarían, pero `PROPUESTA.md` pide contenido en `content/` editable sin tocar el motor.
**Generación procedural**: no garantiza niveles «distintos y diseñados» ni una curva de dificultad.

### 2. Reglas de alcanzabilidad como validación pura
`validateLevel(level)` devuelve la lista de errores; un test la ejecuta sobre los 6 niveles. Reglas
(constantes ajustables en un solo sitio):

| Regla | Valor |
|---|---|
| Subida máxima entre superficies (escalón o plataforma) | 2 peldaños / 1,5 baldosas ≈ 126 px (salto: 193 px) |
| Cabeza alcanza el bloque | base del bloque − superficie ≤ 198 px (las dos filas actuales) |
| Hueco bajo un bloque para estar de pie | base − superficie ≥ 120 px |
| Nada bajo el HUD | ningún bloque ni superficie con su parte superior por encima de y = 150 |
| Hueco entre escalones | 0 (pegados, forman escalera) o ≥ 2 baldosas |
| Salida y bandera | 6 baldosas llanas y vacías tras la salida y 5 antes de la bandera |
| Densidad | entre dos elementos consecutivos ≤ 8 s × 352 px/s ≈ 33 baldosas |
| Límites | todo entre la salida y la bandera; sin solapes entre elementos |
| Bloques por nivel | 12–20 y no decreciente de un nivel al siguiente |
| Curva | nivel 1 sin escalones ni plataformas; escalones desde el 2, plataformas desde el 3; el 6 con más que ninguno |

«Nada atrapa» se cumple por construcción: el suelo es continuo, las plataformas son de un solo
sentido, toda subida cabe en un salto y no hay techos sólidos salvo los bloques, que dejan hueco para
estar de pie. Por eso no hace falta un buscador de caminos.

### 3. Duración estimada calculada desde los datos
`estimateDuration(level)` devuelve `{ fastS, calmS }`:

- `fastS = (bandera − salida) / 352` (en carrera la velocidad horizontal no cambia al saltar).
- `calmS = fastS + 2,5 s × bloques + 1,5 s × plataformas + 1 s × escalones` (pararse, colocarse,
  saltar; subir y bajar).

El test exige `fastS ≥ 30` y `60 ≤ calmS ≤ 120`. Los coeficientes son una estimación: la tarea de
prueba en móvil cronometra el nivel 1 y el 6 y, si la realidad se desvía, se ajustan los coeficientes
y, con ellos, las longitudes. *Alternativa:* simular la física en el test; es mucho más frágil y no
mide lo que importa (el ritmo de un niño), que solo da la prueba real.

Recorridos orientativos (se afinan al implementar dentro de los límites de la tabla):

| Nivel | Ambiente | Longitud | Bloques | Escalones | Plataformas | fastS | calmS |
|---|---|---|---|---|---|---|---|
| 1 | prado | 140 baldosas (11 760 px) | 12 | 0 | 0 | ~31 s | ~61 s |
| 2 | flores | 145 | 13 | 3 | 0 | ~32 s | ~68 s |
| 3 | bosque | 150 | 14 | 4 | 2 | ~33 s | ~75 s |
| 4 | otoño | 155 | 16 | 5 | 4 | ~35 s | ~86 s |
| 5 | atardecer | 165 | 18 | 6 | 5 | ~37 s | ~96 s |
| 6 | noche | 175 | 20 | 7 | 7 | ~39 s | ~107 s |

(`fastS` ≈ (longitud − 10 baldosas de salida y bandera) × 84 / 352.)

### 4. Plataformas de un solo sentido y escalones sólidos (Arcade)
- **Escalones:** cuerpos estáticos que se apoyan en el suelo, sólidos por todos los lados; se
  dibujan como bloques de hierba y tierra del ambiente con esquinas redondeadas.
- **Plataformas:** cuerpos estáticos con `checkCollision` solo por arriba (`down/left/right = false`),
  así el zorro las atraviesa saltando y aterriza encima. Grosor de la caja ≥ 36 px para que una caída a
  velocidad máxima (1 920 px/s ≈ 32 px por fotograma a 60 fps) no las atraviese. Se dibujan como un
  tronco o una nube redondeada según el ambiente.
- **Bloques «?»:** misma lógica de golpe que hoy; su `y` se calcula desde la superficie que tienen
  debajo.
- El zorro aparece siempre en la salida, a ras de suelo; no hay puntos de control (el nivel no se
  pierde).

### 5. Ambientes como datos + decoración generada por código
`AMBIENTS` (TypeScript puro) define por ambiente: paradas del degradado del cielo, dos colores de
colinas, hierba / hierba oscura / tierra, color de nubes y un tipo de decoración de fondo:

| Ambiente | Cielo | Decoración |
|---|---|---|
| prado | el actual | nubes (las de hoy) |
| flores | celeste cálido | nubes y matas de flores en las colinas |
| bosque | celeste verdoso | árboles redondeados verdes |
| otoño | crema anaranjado | árboles ocres y naranjas |
| atardecer | melocotón → rosa | sol grande bajo y nubes rosadas |
| noche | azul noche suave (`#2E3A7A`→`#5B5FA8`) | luna, estrellas que titilan despacio |

- `BootScene` crea una textura `sky-<ambiente>` por ambiente con el `makeGradient` existente y genera
  las texturas de decoración (árbol, mata de flores, luna, estrella, sol) con `Graphics.generateTexture`,
  como ya hace con el polvo.
- `widgets.ts` gana un parámetro de ambiente en `drawGround`, `drawHills` y `addClouds` (o una función
  `addScenery(scene, ambient, worldW)`), manteniendo los valores actuales como los del prado para que
  el mapa y otras pantallas no cambien.
- La decoración usa `scrollFactor` < 1 y una opacidad o desaturación menor que el recorrido para que
  no parezca sólida.
- El zorro, los bloques, la bandera y el HUD no se tiñen nunca (spec `visual-style`).

### 6. Enemigos: zonas a evitar genéricas
`Course` pasa de `blocks` a `keepClear: { x, width }[]`, que incluye bloques, escalones y plataformas.
`freeStretches` resta cada zona ampliada con `BLOCK_CLEAR` como hoy. Los enemigos siguen colocándose
solo sobre el suelo base, con las mismas alturas de abeja. `ENEMIES_PER_LEVEL` no cambia; los tramos
libres pasan a ser muchos más, así que siempre caben todos.

## Risks / Trade-offs

- [La estimación de duración no coincide con un niño real] → cronometrar el nivel 1 y el 6 en móvil y
  ajustar coeficientes y longitudes; el test protege el rango una vez calibrado.
- [Niveles 2–3 veces más largos aburren] → regla de densidad (≤ 8 s sin elementos) y ambientes con
  decoración que cambia a lo largo del recorrido; la fase 2 añadirá los retos en estos huecos.
- [Plataformas difíciles para manos de 4 años] → subidas ≤ 126 px con un salto que llega a 193 px,
  plataformas de al menos 3 baldosas de ancho, y se mantienen el salto con tolerancia y el buffer.
- [Atravesar una plataforma al caer muy rápido] → grosor de cuerpo ≥ 36 px y comprobación manual
  cayendo desde la plataforma más alta.
- [Noche poco legible] → cielo azul medio (no negro), colinas azul lavanda y comprobación visual del
  zorro, los bloques y los enemigos en 844×390.
- [Mundos de ~14 000 px en móviles modestos] → el suelo es un rectángulo, las colinas y la decoración
  se dibujan una sola vez y los cuerpos físicos siguen siendo pocas decenas; comprobar 60 fps en
  móvil emulado con CPU ralentizada.
- [Conflicto con `musica-y-efectos` en `LevelScene`] → el que se aplique segundo integra; los puntos
  de contacto son la construcción del escenario y `onBlockCollision`.

## Migration Plan

Sin migración de datos: el progreso vive solo en memoria. Despliegue con `npm run deploy`; vuelta atrás
revirtiendo el commit y redesplegando.
