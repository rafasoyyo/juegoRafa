# Design

## Context

Juego para niños de 4 a 6 años, móvil táctil en horizontal, que se publicará. La lógica pedagógica
debe poder probarse sin navegador y el contenido debe poder crecer sin tocar el motor.

## Decisions

### D1. Phaser 3 + TypeScript + Vite
Phaser resuelve físicas arcade, cámara, audio y entrada táctil. Vite da arranque rápido y un build
simple para Hosting. Alternativa descartada: Canvas a mano (más trabajo sin beneficio).

### D2. Resolución lógica 400×225 con `pixelArt: true` y `Scale.FIT`
Mantiene el aspecto pixel art en cualquier pantalla y es barato de renderizar en tablets viejas.
Las constantes viven en `src/game/config.ts` para evitar una importación circular con `main.ts`.

### D3. Arte provisional generado por código
`BootScene` crea las texturas con `Graphics.generateTexture`. Evita depender de archivos de terceros
y deja el personaje intercambiable. El personaje es un niño original; no se usan assets de terceros
porque el juego se publicará.

### D4. Controles por zonas de pantalla, no por sprite
`TouchControls` decide por posición del dedo dentro de una zona, con hasta 4 punteros activos. Los
botones dibujados son solo ayuda visual: un toque desviado sigue contando. El teclado (flechas, A/D/W,
espacio) sirve para desarrollar.

### D5. Salto tolerante
Coyote time de 100 ms, input buffer de 120 ms y salto de altura variable (soltar pronto lo acorta).
Reduce la frustración con la motricidad fina de 4 a 6 años.

### D6. Firebase Hosting con rewrite a `/index.html`
`dist/` como raíz pública, `sw.js` sin caché y activos estáticos con caché inmutable de un año.
Proyecto separado `juegorafa-edu`.

### D7. Iconos PNG provisionales sin dependencias
`scripts/make-icons.mjs` genera 192 y 512 px con Node y `zlib`. Se sustituirán por arte propio.

## Risks / Trade-offs

- La bundle de Phaser pesa unos 1,3 MB: aceptable para una PWA con caché; se revisará al añadir audio.
- El texto del HUD de prueba («¡Muy bien!», contador) es provisional; el producto final no puede
  exigir leer.
- La URL de Hosting es pública y no hay Auth ni datos personales aún.
