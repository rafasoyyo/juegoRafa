# Proposal

## Why

Hoy la preview de Firebase Hosting solo se publica al hacer push o merge en `dev`, en el canal fijo `dev`. El trabajo de cada mundo vive en su propia rama de integración (`mundo1` … `mundo5`), y para probarlo en el móvil hay que esperar a que llegue a `dev`. Queremos una preview por rama de mundo, sin que unas pisen a otras.

## What Changes

- El workflow de preview (`.github/workflows/firebase-deploy-preview.yml`) se lanza automáticamente con cada push o merge en `dev`, `mundo1`, `mundo2`, `mundo3`, `mundo4` y `mundo5` (y sigue pudiendo lanzarse a mano).
- Cada rama publica en un canal de Firebase Hosting cuyo `channelId` es el nombre de la rama (`dev` sigue en `dev`, `mundo3` en `mundo3`…).
- La concurrencia pasa a ser por rama: un despliegue nuevo cancela el anterior de la misma rama, pero no el de otra.
- Producción no cambia: solo manual desde `main`.

Habilidad educativa: ninguna (infraestructura de despliegue).

**Fuera de alcance:** fijar `expires` en los canales (se mantiene la caducidad predeterminada de Firebase), previews por PR, cambios en el despliegue a producción, crear las ramas `mundoN` que aún no existan.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `pwa-hosting`: previews automáticas por rama de integración, en un canal con el nombre de la rama.

## Impact

- `.github/workflows/firebase-deploy-preview.yml`.
- Sin cambios en el código del juego.
