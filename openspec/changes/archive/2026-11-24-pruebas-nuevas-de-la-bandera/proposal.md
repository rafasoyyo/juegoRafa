# Proposal

## Why

Tras el cambio `niveles-7-a-12-con-pinchos`, los niveles 7–12 repiten las pruebas de los niveles 1–6, así que un niño que llega allí no aprende nada nuevo en la bandera. Seis pruebas nuevas, cada una con el tema de su ambiente, amplían la parte educativa a destrezas que el juego aún no toca: repartir, ordenar, sumar y restar, orientarse, equilibrar y reconocer la simetría. Siguen las mismas reglas que las pruebas actuales: sin texto, adaptadas a la edad y con las pistas de Lalo.

## What Changes

- **Seis tipos nuevos de prueba de la bandera**, uno fijo por nivel:

  | Nivel | Ambiente | Prueba | Qué aprende |
  |---|---|---|---|
  | 7 | Playa | **Reparte las galletas** | Repartir a partes iguales, la idea de la división y el resto |
  | 8 | Selva | **De pequeño a grande** | Ordenar por tamaño y ordenar números |
  | 9 | Montaña | **El teleférico** | Sumar y restar como algo que pasa |
  | 10 | Nieve | **Huellas en la nieve** | Orientarse y seguir instrucciones de flechas (primeros pasos de programación) |
  | 11 | Desierto | **La balanza** | Comparar pesos, la igualdad y las equivalencias |
  | 12 | Nubes | **La otra mitad** | Simetría y atención al detalle |

- Cada prueba tiene **tres franjas de edad**: 3–4, 5–6 y 7–8.
- Cada prueba tiene **su propio pictograma**, una **demostración de Lalo** y **una pista propia** tras el 2.º fallo.
- Siguen igual las reglas comunes de la prueba de la bandera: tres preguntas, tres intentos, superarla con 2 de 3, sin texto ni voz, respuestas de al menos 44 px en un móvil de 844×390, y la prueba no da estrellas.
- **Dos formas nuevas de responder:**
  - **Repartir:** tocar varias veces cada plato hasta llenarlo.
  - **Respuestas dentro del dibujo:** casillas de una cuadrícula, platillos de la balanza o lugares del mapa de nieve, en lugar de la fila de abajo.
- **Arte nuevo propio:** cabina del teleférico, balanza, platos, cesta y tarro, cuadrícula nevada con iglú y muñeco de nieve, objetos de peso (sandía, piedra, calabaza, pluma, hoja), dibujos simétricos (mariposa, cometa, cara de Lalo, casita, flor, pez) y los seis pictogramas.

Habilidades educativas:
- **Número y cantidad:** repartir, sumar y restar, contar a partir de, el número que falta y las equivalencias.
- **Comparar y ordenar:** tamaño y orden de los números.
- **Formas y espacio:** orientación, direcciones y simetría.
- **Pensamiento lógico:** secuencias de instrucciones.

**Fuera de alcance:**
- Voz en las consignas (fase 2).
- Cambiar las pruebas de los niveles 1–6.
- Dificultad adaptativa por aciertos o repaso espaciado.
- Arrastrar piezas: todas las respuestas son toques, como en las pruebas actuales.
- Pruebas con sonido imprescindible, como repetir un ritmo, que se descartó para el nivel 12.
- Guardar estadísticas de aciertos.

**Depende de:** `niveles-7-a-12-con-pinchos`. Necesita los niveles 7–12, sus ambientes y la entrada de esos niveles en el catálogo de pruebas, y se implementa después.

## Capabilities

### New Capabilities
<!-- Ninguna: las pruebas nuevas son parte de la prueba de la bandera. -->

### Modified Capabilities
- `flag-quiz`: el tipo de prueba de los niveles 7–12 pasa a ser el nuevo de cada nivel, y se añaden los requisitos de las seis pruebas nuevas, cada una con sus franjas de edad y su pista.

## Impact

- **`src/learning/quiz/`** (TypeScript puro, con Vitest):
  - `types.ts`: nuevos `QuizKind`, `Visual`, `PromptLayout`, `HintKind` y la forma de respuesta `fill`, para repartir con capacidades.
  - `run.ts`: soporte de `fill`.
  - `catalog.ts`: niveles 7–12.
  - Seis generadores nuevos: `share.ts`, `order.ts`, `cable-car.ts`, `tracks.ts`, `balance.ts` y `mirror.ts`.
  - Un catálogo puro de dibujos simétricos y de objetos de peso.
- **`QuizScene`:** las nuevas disposiciones de la pregunta (platos y cesta, fila de orden, teleférico animado, cuadrícula con flechas, balanza, dibujo con espejo), las respuestas dentro del dibujo y las pistas nuevas. Para no seguir agrandando la escena, el dibujo de cada disposición nueva va en su propio módulo, en `src/game/ui/quiz/`.
- **`src/game/ui/quiz-art.ts`:** el arte nuevo, dibujado por código. Si se añade algún SVG, se anota en `public/assets/LICENSES.md`.
- **`docs/PROPUESTA.md`:** se actualiza la tabla de pruebas.
- Sin dependencias nuevas ni datos fuera del dispositivo.
