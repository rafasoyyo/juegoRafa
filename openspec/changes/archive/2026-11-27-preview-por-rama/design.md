# Design

## Context

El workflow de preview usa `FirebaseExtended/action-hosting-deploy@v0` con `channelId: dev` y se dispara con `push` a `dev`. Producción es otro workflow, manual y limitado a `main`.

## Goals / Non-Goals

**Goals:** una preview por rama de integración (`dev`, `mundo1` … `mundo5`), cada una en su canal, sin interferir entre ellas.

**Non-Goals:** previews por PR, caducidad personalizada, tocar producción.

## Decisions

- **Lista explícita de ramas** en `on.push.branches` en vez de un patrón `mundo*`: evita que ramas de trabajo como `mundo3-reto-geiser` publiquen su propia preview.
- **`channelId: ${{ github.ref_name }}`**: el nombre de la rama es ya un identificador de canal válido (minúsculas y dígitos). Con `workflow_dispatch` se usa la rama elegida al lanzarlo.
- **Concurrencia `firebase-preview-${{ github.ref_name }}`** con `cancel-in-progress: true`: dos merges seguidos en la misma rama solo publican el último; ramas distintas no se cancelan entre sí.

## Risks / Trade-offs

- Lanzar a mano desde otra rama (por ejemplo `main`) crearía un canal con ese nombre. Se acepta: es una acción manual y el canal caduca solo. → Mitigación: el job solo se ejecuta si la rama es una de las de la lista.
