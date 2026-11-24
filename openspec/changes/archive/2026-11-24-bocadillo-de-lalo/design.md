# Design

## Context

La prueba de la bandera vive en `QuizScene` (`src/game/scenes/QuizScene.ts`), que ya es grande; la lógica pedagógica está en `src/learning/quiz/` (TypeScript puro, sin Phaser). Hoy tocar a Lalo llama a `demo()` si la escena no está ocupada (`busy`) y la prueba no ha terminado. Esa misma `busy` bloquea los toques durante animaciones, demostraciones y pistas. Ver `proposal.md` para el porqué y la maqueta aprobada (marco de 844×390, bocadillo entre Lalo y el pictograma, fondo atenuado, X arriba a la derecha del bocadillo).

## Goals / Non-Goals

**Goals:**
- Que el texto de cada prueba sea dato puro y comprobable por test, igual que las preguntas.
- Que el bocadillo no pueda gastar intentos ni dejar la escena a medias (demostración o pista cortadas).
- No agrandar `QuizScene`: el dibujo y el comportamiento del bocadillo van en un módulo propio.

**Non-Goals:**
- Voz, inglés o texto para el niño.
- Un sistema de bocadillos genérico para otras pantallas.

## Decisions

**1. Textos en `src/learning/quiz/guide-text.ts`, un registro `Record<QuizKind, GuideText>`.** `GuideText` = `{ title, goal, how }`. Al ser un `Record` exhaustivo, TypeScript obliga a añadir texto a cada `QuizKind` nuevo, que es justo lo que necesita `pruebas-nuevas-de-la-bandera`. Alternativa descartada: ponerlos en `content/` como JSON; es contenido fijo y pequeño, y el compilador ayuda más que un esquema. El test recorre `QUIZ_KINDS`, comprueba que no hay textos vacíos ni repetidos y que `goal + how` tiene 35 palabras o menos.

Textos de partida (el último aprobado en la maqueta fue el de «Reparte las galletas»; los demás siguen su mismo tono: «Objetivo: …» y «Pregunte: …»):

| Tipo | Objetivo | Pregunte |
|---|---|---|
| ¿Cuántos hay? | Contar objetos y relacionar la cantidad con su número. | «¿Cuántos ves? Vamos a contarlos con el dedo.» |
| ¿Dónde hay más? | Comparar cantidades: más y menos. | «¿En cuál cesta hay más? ¿Cómo lo sabes?» |
| Sigue la serie | Descubrir la regla de una serie y continuarla. | «¿Qué viene después? ¿Qué se repite?» |
| Caza de formas | Reconocer formas aunque cambien de color, tamaño o giro. | «¿Cuál es igual que el modelo? ¿Cómo se llama?» |
| Las letras de tu nombre | Reconocer las letras del propio nombre y su orden. | «¿Qué letra falta? Dígalas en voz alta.» |
| ¿Te acuerdas? | Recordar lo que pasó en el nivel. | «¿Qué había en este nivel? ¿Qué hicimos?» |
| Reparte las galletas | Repartir a partes iguales entre los platos, primera idea de la división y del resto. | «¿Cuántas galletas le tocan a cada plato? ¿Sobra alguna?» |
| De pequeño a grande | Ordenar por tamaño y ordenar números. | «¿Cuál es el más pequeño? ¿Y el siguiente?» |
| El teleférico | Sumar y restar como algo que pasa: suben y bajan pasajeros. | «¿Cuántos había? ¿Cuántos bajaron? ¿Cuántos quedan?» |
| Huellas en la nieve | Orientarse y seguir flechas, primeros pasos de programación. | «¿Hacia dónde va esta flecha? ¿Dónde acabará?» |
| La balanza | Comparar pesos y entender la igualdad. | «¿Qué pesa más? ¿Qué hace falta para equilibrarla?» |
| La otra mitad | Reconocer la simetría. | «Si doblamos el dibujo por la mitad, ¿cómo quedaría el otro lado?» |

El redactado exacto se pule al implementar; lo que fija la spec es la forma y el límite de 35 palabras.

**2. Estado «bocadillo abierto» como una bandera propia, `guideOpen`, además de `busy`.** `busy` significa «hay una animación; ignora toques» y se limpia sola al acabar; reutilizarla dejaría el juego bloqueado o desbloqueado por error. `onTap` (respuestas), el toque en Lalo y las llamadas a `demo()`/`hint()` comprueban `guideOpen`. Al abrir: `stopDemo()` y no se lanza nada nuevo. Si una pista o una respuesta mostrada (`showAnswer`, 2 s) está en curso, el bocadillo se abre tras ella: tocar a Lalo con la escena `busy` por una animación que no es la demostración se ignora, como hoy. Alternativa descartada: pausar el motor de tweens; también pararía las marcas y la celebración y complica la reanudación.

**3. Un componente `LaloBubble` en `src/game/ui/lalo-bubble.ts`.** Es un contenedor de Phaser con: fondo atenuado de pantalla completa (interactivo, cierra al tocar), bocadillo dibujado con gráficos (rectángulo redondeado, cola hacia Lalo, borde de tinta), etiqueta «Para el adulto», título, dos párrafos, X y botón «ver otra vez». Proporciones de la maqueta: bocadillo de unos 57 % del ancho, desde el 15,5 % de izquierda. Expone `open(text)`, `close()` y `isOpen`, y emite `onClose` y `onReplay`. La X y «ver otra vez» usan `RoundButton` o su zona táctil con mínimo 44 px. El texto usa la fuente del juego (Baloo 2) en el título y la del sistema en los párrafos, con ajuste de línea a su ancho. Entrada con un pequeño escalado desde la cola (respetando que no haya animación imprescindible).

**4. El toque en Lalo vive en la escena** (donde hoy está, en `build()`): si `guideOpen` cierra; si no, abre salvo que la prueba haya terminado. El tamaño del bocadillo se recalcula en `onResize`, igual que el resto de la escena. La tecla Esc se registra en `this.input.keyboard` y se quita al apagar la escena.

**5. «ver otra vez»:** cierra el bocadillo y llama a `demo()` ya con `guideOpen = false`. No pasa por `react()`, así que no toca `run` ni los intentos.

**6. La «?» de Lalo** se dibuja en `characters.ts` solo cuando se pide (`drawLalo(scene, x, y, { question: true })`), para no cambiar el nivel ni el mapa. Va debajo de Lalo, centrada, y no toca el altavoz (a su derecha).

## Risks / Trade-offs

- [El niño toca a Lalo sin querer y se abre el bocadillo] → Se cierra con un toque en cualquier sitio y no gasta nada; la demostración tiene su botón. Es el mismo coste que el gesto anterior.
- [Textos largos no caben en 844×390] → Tope de 35 palabras comprobado por test, y se prueba el bocadillo más largo en el móvil de referencia.
- [Quitar «tocar a Lalo = demostración» desorienta a quien ya jugaba] → La demostración sigue saliendo sola en la primera pregunta y tras el 1.er fallo; solo cambia el gesto manual.
- [`pruebas-nuevas-de-la-bandera` añade tipos que no tienen texto] → El `Record<QuizKind, GuideText>` hace que no compile hasta que se añada.

## Open Questions

- Redacción final de los textos de los 12 tipos: se revisa con quien guíe a los niños durante la implementación, sin cambiar la spec.
