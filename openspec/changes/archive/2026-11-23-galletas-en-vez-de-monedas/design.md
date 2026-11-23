# Design

## Context

La moneda aparece en cinco sitios que comparten un único gráfico y un único componente:

- Gráfico `public/assets/svg/coin.svg` (48×48), cargado en `BootScene` con la clave `coin` a 56 px y
  dibujado después con `fitImage` a 30, 46 y 54 px, además de su tamaño nativo en el bloque «?».
- Componente `coinCounter` / `CoinCounter` en `src/game/ui/widgets.ts`, usado por `LevelScene` (HUD),
  `MapScene` y `WardrobeScene`.
- Estado en memoria `GameState.coins` y `completeLevel(state, level, stars, coins)` en
  `src/game/state.ts`, con pruebas en `state.test.ts`; `buyHat` resta de `coins`.
- Datos entre escenas: `LevelScene` pasa `{ coins }` a `LevelComplete`, que lo suma con `completeLevel`.
- Precios de los gorros: `WardrobeScene` dibuja la moneda pequeña junto al número.

La lógica (contar, sumar, comprar) no cambia; solo cambian el dibujo y el nombre del concepto.
Ver proposal.md para el porqué.

## Goals / Non-Goals

**Goals:**
- Una sola galleta (un SVG, una clave de textura) reutilizada en todos los tamaños, como ahora la moneda.
- Que en el código no quede el concepto «moneda» (`coin`) para que las specs y el código hablen igual.

**Non-Goals:**
- Cambiar la forma del contador (píldora blanca con icono y número) o sus medidas.
- Variantes de galleta, animaciones nuevas, sonido o persistencia.

## Decisions

### 1. Galleta como SVG propio dibujado a mano en la paleta

`public/assets/svg/cookie.svg`, viewBox 48×48 como la moneda para que encaje en los mismos huecos sin
tocar tamaños:

- Sombra: círculo desplazado 3 px hacia abajo en masa oscura `#B9783F` (mismo truco que la moneda y
  los botones: sombra inferior sólida, sin contornos negros).
- Masa: círculo de r≈20 en dorado tostado `#E7A85C`, con un borde ligeramente irregular (un `path`
  con 2–3 «mordiscos» suaves de bordes redondeados, opcional) para que no se lea como moneda.
- Pepitas: 5–6 formas redondeadas en chocolate `#5A3A2A`, de tamaños distintos y repartidas sin
  simetría (la irregularidad es lo que distingue una galleta de una moneda a 30 px).
- Brillo opcional: una o dos manchas claras `#F3C98B` para darle volumen plano.

**Por qué**: así se ha hecho todo el arte del juego (vectorial plano, en el repo, licencia propia) y no
añade dependencias. **Alternativas**: un emoji 🍪 (descartado: depende de la fuente del sistema, se ve
distinto en Android e iOS y no encaja con el estilo); un asset CC0 de terceros (descartado: obliga a
anotar licencia ajena para algo trivial de dibujar y rara vez coincide con la paleta).

La paleta del juego no tiene marrones; estos tonos se añaden solo para la galleta, derivados de la
tierra `#C98A58` para que no desentone. No se toca la spec `visual-style`: la paleta allí es la base,
no una lista cerrada de colores permitidos.

### 2. Renombrar el concepto en el código: `coin` → `cookie`

| Antes | Después |
|---|---|
| textura `coin`, `coin.svg` | textura `cookie`, `cookie.svg` |
| `coinCounter`, `CoinCounter` | `cookieCounter`, `CookieCounter` |
| `GameState.coins` | `GameState.cookies` |
| `completeLevel(…, coins)` | `completeLevel(…, cookies)` |
| `{ coins }` en los datos de `LevelComplete` | `{ cookies }` |
| `LevelScene.coins` | `LevelScene.cookies` |

Comentarios y descripciones de pruebas pasan de «monedas» a «galletas».

**Por qué**: el cambio es pequeño, el compilador (TypeScript strict) encuentra todos los usos, y evita
que en la fase 3 se guarde en Firestore un campo `coins` que nadie reconoce en las specs.
**Alternativa**: solo cambiar el gráfico y dejar `coin` en el código (menos diff, pero deja una
discrepancia permanente entre specs y código).

### 3. Borrar `coin.svg`, no dejarlo junto a la galleta

Nada más lo usa y la PWA lo precachearía sin motivo. El registro de licencias pierde su fila y gana la
de `cookie.svg` como «derivado: galleta con pepitas de chocolate en la paleta del lienzo».

## Risks / Trade-offs

- [A 30 px (precio de los gorros) la galleta puede verse como un círculo con puntos] → pepitas grandes y
  pocas (5–6), contraste alto masa/chocolate y comprobarlo en un móvil emulado de 844×390 antes de dar
  la tarea por hecha.
- [Una galleta muy parecida a la moneda anula el cambio] → borde irregular o mordisco y tono tostado,
  claramente distinto del amarillo `#FFD23F` de la moneda y las estrellas.
- [El service worker de un móvil ya instalado sigue sirviendo la versión vieja con `coin.svg`] → la PWA
  ya se actualiza sola con cada despliegue (Workbox revisiona el precache); basta con recargar.

## Migration Plan

No hay datos guardados (el progreso solo vive en la sesión), así que no hay nada que migrar. Se
despliega con `npm run deploy` como cualquier otro cambio; volver atrás es revertir el commit y
desplegar de nuevo.
