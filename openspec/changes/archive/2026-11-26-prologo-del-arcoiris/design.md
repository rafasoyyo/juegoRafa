# Design

## Context

`LevelScene` ya tiene `held` (bloquea flechas y salto) y `LaloFlyer` (Lalo vuela desde el HUD a un punto del mundo y vuelve). El arcoíris del horizonte lo crea `addScenery` sin devolverlo. El perfil guarda progreso por mundo, galletas y gorros (`progress-codec.ts`).

## Decisions

1. **Marca de escenas vistas en `GameState.seen: Set<string>`**, guardada como `seen: string[]` solo si no está vacía. Ids `prologo:<mundo>` (y luego `final:<mundo>` para el paso 4). Es un dato de juego, no del niño. *Alternativa*: un booleano por mundo en `WorldProgress`; descartado porque el final y otras escenas tendrán la misma forma.
2. **Cuándo se ve**, función pura `shouldPlayPrologue(state, world, level, forced)` en `src/game/story/story.ts`: el mundo tiene prólogo, es el nivel 1 y, o se pide expresamente (madriguera), o no está visto y el mundo no tiene progreso. El perfil antiguo con progreso no lo ve sin necesidad de migrar nada. Se marca como visto al empezar, para que salir a medias no lo repita.
3. **`WorldDef.prologue?: true`** y la madriguera del mapa se marca con `MapDecor.prologue: true`. El motor no pregunta en qué mundo está.
4. **Animación en `src/game/story/prologue.ts`**: clase `Prologue` con `play()` y `skip()`, sobre `scene.time` y tweens, que recibe Rufo, el `LaloFlyer` y la imagen del arcoíris. Pasos: 0 s Rufo sube desde la boca de la madriguera (desplazamiento y escala); 1 s Lalo vuela a su derecha y aparece una flecha que bota hacia la derecha; 2 s el arcoíris pasa a opacidad plena con una pulsación de escala, destellos y las 6 notas `band` en sucesión; 3,5 s Rufo salta (`jump`), Lalo vuelve y `held` se libera. Un toque en cualquier parte llama a `skip()`.
5. **Nivel 1 con madriguera**: si el mundo tiene prólogo, el nivel 1 dibuja `decor-burrow` justo detrás de la salida, en la capa de decoración.
6. **Tocar la madriguera del mapa**: una zona interactiva de al menos 120 px sobre el adorno, que abre `Level` con `{ world, level: 1, prologue: true }` si al soltar no ha habido arrastre.

## Risks / Trade-offs

- [El niño toca la pantalla al entrar y se salta el prólogo sin querer] → se ignoran los toques de los primeros 400 ms.
- [El arcoíris del nivel 1 es pequeño] → el destello lo agranda un momento y los destellos lo rodean; si en la prueba no se ve, se ajusta el tamaño de la pulsación.
