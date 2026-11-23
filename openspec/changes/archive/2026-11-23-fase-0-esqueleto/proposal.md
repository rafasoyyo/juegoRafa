# Proposal

## Why

Antes de construir contenido educativo hace falta una base que corra en el móvil de un niño y que
se pueda desplegar. La fase 0 de `docs/PROPUESTA.md` fija el esqueleto técnico y valida lo más
arriesgado: que el control táctil de un plataformas se sienta bien. Sin eso, cualquier reto
educativo posterior se apoya en nada.

## What Changes

- Proyecto Vite + TypeScript + Phaser 3 con resolución lógica 400×225 y escalado nítido (pixel art).
- PWA instalable (manifest horizontal, iconos 192/512, service worker con actualización automática).
- Firebase: proyecto nuevo `juegorafa-edu` y Hosting configurado y desplegado.
- Un nivel de prueba: mover, saltar, golpear bloques «?» desde abajo (dan monedas) y llegar a una meta.
- Controles táctiles por zonas (izquierda, derecha, saltar) con teclado para escritorio, salto
  tolerante (coyote time, input buffer) y de altura variable.
- Arte provisional generado por código; el personaje es un niño original.
- Marco OpenSpec del proyecto (`openspec/`, skills de Claude Code) y la propuesta en `docs/PROPUESTA.md`.

## Capabilities

### New Capabilities
- `pwa-hosting`: aplicación instalable y desplegada en Firebase Hosting.
- `touch-controls`: controles táctiles y de teclado con salto tolerante.
- `platformer-level`: nivel jugable de plataformas con bloques «?», monedas y meta.

### Modified Capabilities
Ninguna.

## Impact

- Código nuevo: `src/main.ts`, `src/game/{config.ts,scenes/,ui/}`, `vite.config.ts`, `index.html`,
  `scripts/make-icons.mjs`, `firebase.json`, `.firebaserc`.
- Sin retos educativos, sin voz, sin autenticación ni Firestore todavía (fases 2 y 3).
- Fuera de alcance: personaje definitivo, música, niveles de contenido, panel de padres.
- Restricción legal vigente desde ya: nada de assets ni personajes de terceros.
