# Proposal

## Why

Ahora llegar a la bandera completa el nivel directamente, así que el juego todavía no enseña nada. Una prueba corta y divertida en la bandera, adaptada a la edad del perfil, introduce la parte educativa sin cambiar el recorrido de plataformas, que ya funciona. Además, aprovecha la edad que ya guarda cada perfil.

## What Changes

- Al tocar la bandera, tras la celebración breve del zorro, se abre una **prueba de la bandera** con **tres preguntas** antes de la pantalla de nivel completado.
- Cada uno de los 6 niveles tiene **su propio tipo de prueba**:
  1. **¿Cuántos hay?** (cantidad y número)
  2. **¿Dónde hay más?** (comparar)
  3. **Sigue la serie** (patrones)
  4. **Caza de formas** (formas)
  5. **Las letras de tu nombre** (letras, con el alias del perfil)
  6. **¿Te acuerdas?** (memoria y cantidad, con lo que pasó en el nivel)
- Cada prueba se adapta a tres franjas de edad del perfil: **3-4**, **5-6** y **7-8**.
- Consignas **sin texto ni voz**: modelo dibujado, pictograma de la prueba y Lalo señalando. Las voces quedan para la fase 2.
- **Pistas de Lalo** al fallar. Cada pregunta permite 3 intentos: tras el 1.er fallo, Lalo repite la consigna; tras el 2.º, da una pista propia de cada tipo de prueba; tras el 3.º, la pregunta cuenta como fallada, Lalo enseña la respuesta y se pasa a la siguiente.
- La prueba se **supera** acertando al menos 2 de las 3 preguntas.
- La prueba **no suma estrellas**: las estrellas siguen saliendo de los bloques «?».
- **Prueba no superada:** el nivel **no queda completado**: no se guardan estrellas y el mapa lo muestra como pendiente. Aun así, el siguiente nivel se desbloquea y se puede jugar. Las galletas recogidas sí se suman.
- Un nivel pendiente se completa al volver a jugarlo y superar la prueba.

Habilidades educativas: **cantidad, número, comparar, patrones, formas y letras** (reconocer las letras del propio nombre), más **memoria y atención**.

**Fuera de alcance:**
- Voces y sonidos de consigna (fase 2). Con voz se podrían añadir pruebas como la letra inicial o las vocales.
- Dificultad adaptativa por aciertos y repaso espaciado. La dificultad depende solo de la franja de edad.
- Elegir tipo de prueba o edad desde un panel de padres.
- Medallas y la mini-prueba del castillo.
- Repetir solo la prueba sin rejugar el nivel.
- Cambiar la regla de estrellas o de galletas.

## Capabilities

### New Capabilities
- `flag-quiz`: la prueba de la bandera. Cubre cuándo aparece, el tipo de prueba de cada nivel, las tres preguntas, la adaptación por edad, las consignas sin texto, las pistas de Lalo y cuándo se supera.

### Modified Capabilities
- `level-complete`: la celebración se abre tras la prueba. Si la prueba no se supera, la pantalla no da estrellas ni completa el nivel, pero sigue permitiendo pasar al siguiente.
- `world-map`: nuevo estado **pendiente** de nivel, con los niveles siguientes desbloqueados, y el zorro sobre el primer nivel sin jugar.
- `child-profile`: el guardado incluye los niveles pendientes y conserva el progreso guardado antes del cambio.

## Impact

- **Nuevo `src/learning/quiz/`** (TypeScript puro, probado con Vitest): franjas de edad, generadores de preguntas por tipo, evaluación de respuestas, pistas y resultado.
- **Nueva escena `QuizScene`**, que dibuja las preguntas, gestiona los toques y muestra a Lalo y las pistas. `LevelScene.onGoal` pasa a abrir la prueba con lo que ocurrió en el nivel (ambiente, erizos, abejas, galletas).
- **`LevelCompleteScene`**: variante de prueba no superada.
- **`state.ts` y `progress-codec.ts`**: niveles pendientes, nuevas reglas de desbloqueo y de nivel actual, y compatibilidad con los perfiles ya guardados.
- **`MapScene`**: dibuja el nodo pendiente.
- **`active.ts`**: expone el alias y la edad del perfil activo, también cuando se juega sin almacenamiento.
- **Arte nuevo propio** (SVG): pictogramas de cada prueba, formas (círculo, cuadrado, triángulo, rombo, estrella, hexágono), un caracol como distractor y miniaturas de los ambientes. Las licencias se anotan en `public/assets/LICENSES.md`.
- Sin dependencias nuevas ni datos fuera del dispositivo.
