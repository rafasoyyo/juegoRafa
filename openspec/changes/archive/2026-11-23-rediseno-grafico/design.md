# Design

## Context

Hoy el juego tiene dos escenas (`BootScene`, `LevelScene`) a 400×225 con `pixelArt: true` y
`Scale.FIT`, y todas las texturas se dibujan por código con `Graphics.generateTexture`. Las constantes
físicas (velocidad 110, salto 330, gravedad 900) y las posiciones están pensadas para esa resolución.
El diseño de referencia (lienzo «Juego educativo - diseños», 1180×820 por pantalla) está hecho con SVG
inline y CSS; sus formas se pueden reutilizar tal cual porque son propias del proyecto. Phaser es la
versión 4.2.1. Motivación y alcance: ver `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Reproducir el aspecto del diseño con fidelidad reutilizando sus trazados SVG.
- Una sola forma de dibujar botones y de navegar entre escenas, reutilizable en las fases siguientes.
- Dejar la lógica de progreso, estrellas, monedas y gorros en TypeScript puro y probada con Vitest.

**Non-Goals:**
- Un sistema de UI genérico (layouts, temas). Cada escena coloca sus elementos a mano.
- Atlas de texturas o empaquetado de sprites: con una docena de SVG no compensa todavía.

## Decisions

### D1. Alto lógico fijo de 720 px y ancho variable
`Scale.FIT` con tamaño de juego recalculado en cada `resize`: alto 720 y ancho `720 × aspecto`,
limitado entre 960 (4:3) y 1680 (21:9). Cada escena expone un `layout()` que recoloca el HUD anclado a
los bordes cuando cambia el ancho; el escenario no se recoloca. Fuera de ese rango aparecen bandas.
`pixelArt` se desactiva y se quita `image-rendering: pixelated` de `index.html`.
- Alternativa: `Scale.EXPAND`. Descartada porque en tablets 4:3 también crece el alto, y las físicas
  y el suelo dependen de un alto fijo.
- Alternativa: 1280×720 fijo con `FIT`. Descartada: deja bandas laterales grandes en móviles.

### D2. Gráficos como archivos SVG propios cargados con `load.svg`
Los trazados del diseño se guardan como archivos en `public/assets/svg/` (zorro en 3 poses: quieto,
saltando y celebrando; 5 gorros; Lalo; nube; árbol; bloque «?»; bloque usado; moneda; estrella llena y
vacía; bandera; iconos de botón). `BootScene` los carga con `this.load.svg(key, url, { width, height })`
al tamaño en que se van a dibujar, para que se rastericen una sola vez y nítidos. Cielo, colinas, suelo,
camino del mapa, confeti y fondos de botón se dibujan con `Graphics` (formas simples y de tamaño variable).
- Alternativa: dibujarlo todo con `Graphics`. Descartada: el zorro y los gorros tienen curvas Bézier
  que ya existen en SVG; reescribirlas es lento y menos fiel.
- Alternativa: PNG exportados. Descartada: hay que regenerarlos a mano en cada cambio y pesan más.

### D3. El zorro es un sprite con físicas y el gorro le sigue
El zorro es un `Sprite` arcade cuya textura cambia entre poses. El gorro es una `Image` aparte que en
cada `update` copia posición, giro, escala y volteo del zorro con un desplazamiento por pose
(`HAT_OFFSETS`). Las animaciones (balanceo al andar, estirarse al saltar, aplastarse al aterrizar,
respirar quieto) son tweens o ajustes de escala y giro, sin hojas de sprites. Una función
`drawFox(scene, x, y, pose, hat)` reutiliza la misma composición en el mapa, la celebración y el armario.
- Alternativa: `Container` con cuerpo físico. Descartada: los cuerpos arcade en contenedores dan
  problemas de origen y escala.

### D4. Estado del juego en TypeScript puro
`src/game/state.ts` (sin importar Phaser) define `GameState`: niveles completados con su mejor puntuación
en estrellas, monedas, gorros conseguidos y gorro puesto, con operaciones `completeLevel`, `buyHat`,
`wearHat`, `levelStatus`. Las escenas comparten una única instancia en memoria (se pierde al recargar). La regla provisional de
estrellas va en `src/learning/scoring.ts` (`starsFor(blocksHit, blocksTotal)`), porque la fase 2 la
sustituirá por la puntuación por aciertos. Ambos se prueban con Vitest. Precios provisionales de los
gorros: lana 10, fiesta 15, casco 20, corona 30.
- Alternativa: `registry` de Phaser. Descartada: no se puede probar sin Phaser y la fase 3 necesitará
  serializarlo a Firestore.

### D5. Componente `RoundButton` y temblor común
`src/game/ui/round-button.ts`: un `Container` con sombra (círculo o píldora oscura desplazada hacia abajo),
cara de color e icono SVG, con estado pulsado (cara baja `shadowDepth` px) y `shake()` para lo
bloqueado. Lo usan el mapa, la celebración, el armario, el HUD y `TouchControls`. En los controles del
nivel el estado pulsado lo decide `TouchControls.read()` por zonas, como hasta ahora; en el resto de
botones lo decide su propia área interactiva.

### D6. Escenas y navegación
`Boot → Title → Map ⇄ Level → LevelComplete → (Level | Map)` y `Map ⇄ Wardrobe`. El nivel recibe
`{ level: 1..6 }` y la celebración recibe `{ level, blocksHit, blocksTotal, coins }`. Todas las
transiciones usan un fundido de cámara de 250 ms con un helper `goTo(scene, key, data)`. La pantalla de
inicio desbloquea el audio con el primer toque (`this.sound.unlock()` o el contexto de Web Audio).

### D7. Físicas reescaladas ×3,2
Al pasar de 225 a 720 de alto, se multiplican velocidad, salto, gravedad y umbral del salto variable
por 3,2 (velocidad 350, salto 1056, gravedad 2880). Los tiempos de *coyote time* y *buffer* no cambian.
El recorrido del nivel también se escala ×3,2 (mundo de 5120 px) y queda como un array de datos en
`LevelScene`, a la espera de los niveles en JSON de la fase 4.

### D8. Tipografía Baloo 2 local
Se descarga Baloo 2 ExtraBold (SIL OFL 1.1) en `public/fonts/baloo2-800.woff2`, declarada con
`@font-face` en `index.html`. `BootScene` espera `document.fonts.load('800 48px "Baloo 2"')` antes de
crear texto, para evitar que los dígitos se dibujen con la fuente de reserva. Se añade `woff2` a los
`globPatterns` de Workbox para que funcione sin conexión. Solo se usa para dígitos y símbolos de mundo.

### D9. Registro de licencias y documentación
`public/assets/LICENSES.md` lista cada SVG (propio, derivado del lienzo de diseño del proyecto) y la
fuente (OFL, con su aviso). Se actualizan `docs/PROPUESTA.md` (estilo, personaje, resolución) y el
contexto de `openspec/config.yaml` (deja de decir «pixel art» y «un niño»).

## Risks / Trade-offs

- [El salto «se siente» distinto tras reescalar] → Se mantienen las proporciones exactas y se prueba en
  el móvil antes de dar la tarea por hecha; las constantes quedan agrupadas para ajustarlas.
- [Rasterizar SVG grandes en tablets antiguas consume memoria] → Cada SVG se carga al tamaño de uso, no
  mayor; el zorro grande del armario se carga aparte y solo en esa escena.
- [Ligero desenfoque en pantallas de 3x, porque el lienzo es de 720 px de alto] → Aceptado: el estilo
  plano sin detalles finos lo disimula. Si molesta, se sube el alto lógico a 1080 cambiando una constante.
- [`load.svg` puede comportarse distinto en Phaser 4] → La primera tarea comprueba la carga de un SVG con
  tamaño explícito antes de convertir el resto.
- [Recolocar el HUD en cada `resize` añade complejidad] → Solo el HUD se ancla a los bordes; el escenario
  vive en coordenadas de mundo y no se toca.
- [Perder el progreso al recargar puede frustrar] → Es temporal; la fase 3 lo persiste con Firestore
  usando el mismo `GameState`.

## Migration Plan

1. Implementar en `main` con `npm run dev` y probar en el móvil por la wifi.
2. `npm run build` y `npm test` sin errores.
3. `npm run deploy`. El service worker se actualiza solo.
4. Vuelta atrás: `firebase hosting:rollback` o desplegar el commit anterior.

## Open Questions

- Precios definitivos de los gorros y cuántas monedas da cada nivel: se ajustarán tras jugarlo con el
  niño, sin cambiar las specs.
- Iconos de la PWA con el zorro: queda para un cambio posterior.
