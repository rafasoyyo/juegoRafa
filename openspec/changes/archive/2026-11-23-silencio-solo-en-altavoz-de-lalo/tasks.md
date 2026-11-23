## 1. Altavoz de Lalo como control de sonido

- [x] 1.1 En `src/game/ui/characters.ts` (`drawLalo`), hacer que el altavoz llame a `audio.setMuted(!audio.muted)` además de `react`, y que cambie entre `icon-speaker` e `icon-speaker-off` según `audio.muted`; el icono inicial debe leer `audio.muted`. Tocar al búho solo llama a `react`. Verificar con `npx tsc --noEmit`
- [x] 1.2 Actualizar el comentario de `drawLalo`, que dice que "hasta la fase 2 no suena nada"

## 2. Quitar el botón del mapa

- [x] 2.1 En `src/game/scenes/MapScene.ts`, eliminar `buildMuteButton` y su llamada, y los imports que queden sin uso. Verificar con `npx tsc --noEmit` y `npx vitest run`

## 3. Comprobación en el juego

- [x] 3.1 En el navegador: en el mapa hay un solo altavoz (el de Lalo) y silencia y reactiva la música; tocar al búho no cambia el sonido
- [x] 3.2 Dentro de un nivel, el altavoz de Lalo silencia música y efectos sin pausar; con silencio activo, al volver al mapa y a otro nivel el altavoz sigue tachado
- [x] 3.3 Recargar en silencio: el altavoz aparece tachado y tras el primer toque no suena nada
