# Proposal

## Why

Las pruebas de la bandera se explican sin texto ni voz, con dibujos y con Lalo señalando. Un niño de 3 a 8 años que no sabe qué hacer solo puede tocar a Lalo para ver otra vez la demostración, y el adulto que lo acompaña no tiene dónde leer cuál es el objetivo del juego ni cómo explicárselo. Un bocadillo de cómic de Lalo, pensado para el adulto, resuelve eso sin poner texto en el camino del niño.

## What Changes

- **Tocar a Lalo en la prueba de la bandera abre un bocadillo de cómic** con la cola apuntando a Lalo. Lleva la etiqueta «Para el adulto», el nombre de la prueba, el objetivo educativo y una frase para guiar al niño (unas 35 palabras como máximo).
- **Un texto por tipo de prueba**, solo en español: los seis tipos actuales y los seis de `pruebas-nuevas-de-la-bandera`. Un tipo sin texto no se puede dar por terminado.
- **Mientras el bocadillo está abierto**, la pregunta queda atenuada y en pausa: las respuestas no se pueden tocar, no se gasta ningún intento y no avanza ninguna demostración ni pista.
- **Se cierra** con una X de al menos 44 px, tocando fuera del bocadillo, tocando a Lalo otra vez o con la tecla Esc. No se cierra solo.
- **La demostración se mueve:** tocar a Lalo ya no la repite. Pasa a un botón «ver otra vez» dentro del bocadillo, que lo cierra y repite la demostración de la pregunta actual.
- **Lalo muestra una «?» amarilla** pequeña para que el adulto sepa que se puede tocar.
- El bocadillo se abre solo cuando lo pide el adulto: nunca aparece por sí mismo ni al empezar la prueba.
- El altavoz de Lalo no cambia: sigue siendo el único control de sonido.

**Fuera de alcance:**
- Texto en inglés (el juego solo muestra español en la interfaz de adulto) y lectura en voz alta del texto (fase 2: el altavoz podría leerlo).
- Bocadillos en el nivel, el mapa u otras pantallas: solo en la prueba de la bandera.
- Cambiar las preguntas, las pistas o las reglas de la prueba.
- Guardar si el adulto abrió el bocadillo.

**Depende de:** nada para los seis tipos actuales. Si `pruebas-nuevas-de-la-bandera` se aplica antes, se añaden también sus seis textos; si se aplica después, ese cambio debe añadir su texto a cada tipo nuevo (la comprobación de «un texto por tipo» lo obliga).

## Capabilities

### New Capabilities
<!-- Ninguna: el bocadillo es parte de cómo Lalo guía la prueba de la bandera. -->

### Modified Capabilities
- `flag-quiz`: el requisito «Lalo guía la prueba» cambia lo que hace tocar a Lalo y se añaden los requisitos del bocadillo (contenido, pausa, cierre y marca de que se puede tocar).

## Impact

- **`src/learning/quiz/`** (TypeScript puro, con Vitest): un módulo nuevo con el texto del bocadillo de cada `QuizKind` (nombre, objetivo y frase para guiar) y su prueba de que no falta ninguno y de que no pasan de 35 palabras.
- **`QuizScene`** (`src/game/scenes/QuizScene.ts`): el toque en Lalo (hoy `demo()`, línea ~167) abre el bocadillo; estado de pausa que bloquea toques, demostración y pistas; tecla Esc.
- **`src/game/ui/`**: un componente nuevo del bocadillo (dibujo, cola, X, botón «ver otra vez», fondo atenuado), en su propio módulo para no agrandar la escena, y la «?» de Lalo.
- **`openspec/specs/mascot-guide/`**: sin cambios. Aquel requisito cubre a Lalo en el nivel y el mapa, no en la prueba.
- **`docs/PROPUESTA.md`:** una frase en la descripción de la prueba de la bandera.
- Sin dependencias nuevas, sin datos fuera del dispositivo y sin cambios en lo que se guarda.
