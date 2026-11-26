# Design

## Context

El mapa ya pinta el gajo nuevo y hace saltar al zorro (`MapScene.paintFresh` y `hopFox`), con un toque que reconstruye el mapa en su estado final. El paso 3 añadió `GameState.seen` y `story/story.ts`. El río se abre con `gate: { openAge: 6, after: { world: 'arcoiris', level: 12 } }`, así que, cuando el mapa se abre tras el nivel 12, el río ya está abierto para todos.

## Decisions

1. **Cuándo**: `shouldPlayFinale(state, world)`: el mundo tiene `finale`, todos sus niveles están hechos o pendientes y la marca `final:<mundo>` no está. Se marca y se guarda al empezar, para que un toque, salir o recargar no lo repitan. Un perfil antiguo que ya tenía el mundo terminado lo verá una vez al abrir el mapa: es la primera vez que existe.
2. **Encadenado**: si hay gajos nuevos, el final empieza cuando acaba `hopFox`; si no, al construir el mapa. Mientras dura, `animating` sigue activo, así que un toque reconstruye el mapa en su estado final, como ya pasa con el gajo.
3. **Viñeta**: `story/finale.ts` dibuja con gráficos vectoriales, fija a la cámara y centrada, una tarjeta redondeada con cielo, montaña nevada, nube gris que llueve (gotas en bucle), manantial al pie y un río que crece hasta el borde. Sin texturas nuevas ni texto.
4. **Botón del río**: `opensAfter(def, world, age, flags)` (puro) dice qué mundos abre este final para este perfil: los que tienen `gate.after.world` igual al mundo, no están tras un interruptor apagado y no estarían ya abiertos por edad. El selector dibuja esos botones con candado mientras dura el final, y al acabar el candado crece, se desvanece con destellos y el botón vuelve a su opacidad normal (`prize`).
5. **Sonidos**: se reutilizan `goal` (Rufo celebra), `tick` en las gotas y `scale` al nacer el río.

## Risks / Trade-offs

- [El final dura unos 6 s] → se salta con un toque y solo se ve una vez.
- [Si se cierra la app entre terminar el nivel 12 y abrir el mapa] → el final se verá en la próxima apertura del mapa, porque depende del progreso guardado y no de la sesión.
