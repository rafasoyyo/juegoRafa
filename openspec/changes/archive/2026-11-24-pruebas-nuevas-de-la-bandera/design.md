# Design

## Context

- **Lógica** (`src/learning/quiz/`, puro). `generateQuiz(kind, band, rng, ctx)` despacha a un generador por tipo, y cada uno devuelve 3 `Question` distintas (`distinctQuestions`, `questionKey`). Una `Question` lleva:
  - `prompt`: `layout`, `items: Visual[]`, `holeIndex` y `highlightIndex`.
  - `options`: con `key` y `visual`.
  - `answer`: `choice` (vale cualquiera de `correct`) o `multi` (todas las `targets`, en orden o sin él).
  - `hint: HintKind`.
- **`run.ts`** lleva intentos, marcas, opciones usadas y apagadas, y emite `ignored`, `correct`, `progress`, `wrong` (nivel 1 o 2 y pista) y `failed`. `dim-wrong` ya apaga opciones.
- **`QuizScene`** (770 líneas) dibuja con `AREAS[kind]`: zona de la pregunta y zona de respuestas en fila(s) de `RoundButton`. Por cada `PromptLayout` tiene un `drawPrompt`, por cada `Visual` un `drawVisual`, y además la demostración (`demo`) y las pistas (`hint`: `count-up`, `pair-up`, `rhythm`, `misfit`, `dim-wrong`). `quiz-art.ts` dibuja con `Graphics` formas, puntos de dado, miniaturas, pictogramas y marcas.
- **Tamaños.** Pantalla lógica de 720 de alto. En 844×390, 1 px lógico ≈ 0,54 px, así que 44 px en pantalla son ≈ 82 px lógicos.
- **Dependencia.** Tras `niveles-7-a-12-con-pinchos` existen los niveles 7–12 (con `LEVEL_COUNT = 12`) y `QUIZ_BY_LEVEL` tiene entradas 7–12 con el ciclo antiguo. Este cambio solo sustituye esas 6 entradas.

## Goals / Non-Goals

**Goals:**
- Que toda la pedagogía de las 6 pruebas (generación, rangos, respuesta correcta y forma de responder) sea pura y se pruebe con semillas fijas.
- Reutilizar `run.ts` (intentos, pistas y resultado) con un solo añadido: la forma de respuesta `fill`.
- No agrandar más `QuizScene`: cada disposición nueva va en su propio módulo.

**Non-Goals:**
- Refactorizar las 6 pruebas existentes al nuevo sistema de módulos. Se quedan como están.
- Arrastrar piezas, voz y sonidos de consigna.

## Decisions

### 1. Seis `QuizKind` nuevos y el catálogo
`share`, `order`, `cable-car`, `tracks`, `balance` y `mirror`. `QUIZ_BY_LEVEL` asigna 7 → `share`, 8 → `order`, 9 → `cable-car`, 10 → `tracks`, 11 → `balance` y 12 → `mirror`. Cada generador va en su archivo y `generateQuiz` los añade a su `switch`.

### 2. Nueva forma de respuesta `fill` (repartir)
```ts
{ form: 'fill'; slots: { option: number; capacity: number; after?: number[] }[] }
```
- Cada toque en un slot con capacidad libre, y cuyos `after` estén llenos, suma 1. Es `progress`, o `correct` si todos quedan llenos.
- Tocar un slot lleno, o uno cuyo `after` no esté lleno, es un `wrong` normal: cuenta para los 3 intentos y las pistas.
- El tarro de los mayores es un slot con `capacity = resto` y `after = todos los platos`. Con resto 0 tiene capacidad 0, así que tocarlo siempre es fallo.
- `QuestionState` gana `filled: Map<number, number>`. Se añade `fillLevels(run)` para que la escena dibuje, y `remainingAnswer` devuelve, para `fill`, los toques que faltan, para que Lalo enseñe la respuesta tras el 3.er fallo.

Alternativa descartada: modelar el reparto como `multi` con una opción por galleta. Llenaría la pantalla de botones diminutos y no se parecería a repartir.

### 3. La pregunta lleva su escena tipada
`Prompt` gana un campo opcional `scene`, una unión discriminada por tipo de prueba, con los datos que no caben en `items`:
- `share`: platos (amigo de cada uno), galletas y si hay tarro.
- `order`: sentido de la escalera.
- `cable-car`: pasajeros iniciales y pasos `{ op: 'in' | 'out', count, object }`.
- `tracks`: tamaño, salida, flechas, destinos con dibujo y fresa.
- `balance`: contenido de cada platillo, hueco y balanza modelo.
- `mirror`: dibujo, o cuadrícula y casillas pintadas.

Así los `PromptLayout` actuales no cambian, y la escena sabe todo lo que tiene que animar sin calcular nada pedagógico.

Los `Visual` nuevos son `sized` (objeto y escala), `arrows` (tira de direcciones), `half` (dibujo, reflejado o no, y variante), `cell` (pintada o no), `plate`, `jar`, `pan`, `landmark` (pino, muñeco o iglú) y `weight` (sandía, piedra, calabaza, pluma, hoja o fresa). Cada uno tiene su clave en `visualKey`.

### 4. Respuestas dentro del dibujo
`Option` gana `place?: 'row' | 'scene'`, que por defecto es `row`.
- Las opciones `scene` (platos y tarro, platillos, casillas, destinos de la nieve) las coloca el módulo de su disposición, que devuelve un rectángulo por id. `QuizScene` crea el `RoundButton` en ese rectángulo, con el mismo comportamiento de toque, rebote y apagado que las de la fila.
- Cada rectángulo mide al menos 90 px lógicos (≈ 49 px en pantalla en 844×390).

### 5. Un módulo por disposición nueva
Van en `src/game/ui/quiz/` (`share-view.ts`, `order-view.ts`, `cable-car-view.ts`, `tracks-view.ts`, `balance-view.ts` y `mirror-view.ts`), con una interfaz común:
```ts
interface QuizView {
  draw(scene, q, area): { optionRects: Map<number, Rect> };
  intro?(): Promise<void>;          // escena previa (teleférico)
  onProgress?(id): void;           // galleta al plato, elemento a la fila, casilla pintada
  onCorrect?(): Promise<void>;     // la balanza se suelta, Rufo recorre las huellas
  hint(kind, ctx): void;           // pista propia
  showAnswer(ids): void;
}
```
`QuizScene` elige la vista según `q.kind` y le delega dibujo, demostración y pistas. Para los tipos antiguos sigue con su código actual. El arte nuevo va en `src/game/ui/quiz/art.ts`, con `Graphics` en el estilo plano, sin contornos negros y con sombra inferior sólida.

Alternativa descartada: seguir añadiendo `case` a `QuizScene`. Pasaría de 1500 líneas y mezclaría seis animaciones distintas.

### 6. Pistas nuevas
`HintKind` gana `deal`, `compare-two`, `count-on`, `ghost-walk`, `heft`, `swap-fruit` y `fold`. Se reutilizan `pair-up` (balanza de medianos) y `dim-wrong` (huellas de mayores). Cada generador fija la pista por pregunta, así que una misma prueba puede usar pistas distintas según la franja.

Ninguna pista cambia el estado de `run`, salvo `dim-wrong`, que ya existe. Las galletas transparentes de `deal`, la cabina transparente de `count-on` y el Rufo fantasma de `ghost-walk` desaparecen al terminar.

### 7. Teleférico: escena antes de responder
La vista ejecuta `intro()` como una cadena de tweens: llega la cabina, sube o baja cada pasajero de uno en uno (sonido `tap`), la puerta se cierra y la cabina se vuelve opaca. Mientras dura, `busy = true` y los toques se ignoran.

La demostración de la primera pregunta es `intro()` seguida de la flecha sobre las respuestas. Tocar a Lalo vuelve a llamar a `intro()`.

### 8. Reglas de generación (probadas con 200 semillas por franja)
- **share.**
  - Pequeños: 2 platos y total ∈ {2, 4, 6}.
  - Medianos: 2–3 platos, total = platos·k con k ≥ 2 y total ≤ 12.
  - Mayores: 3–4 platos, total ≤ 15 y resto de 1 a platos − 1 en al menos 2 de las 3 preguntas.
- **order.**
  - Pequeños: 3 dibujos iguales, con una razón de escala ≥ 1,4 entre consecutivos, siempre subiendo.
  - Medianos: 4 dibujos con razón ≥ 1,2, en los dos sentidos.
  - Mayores: 5 cifras distintas del 1 al 20, en los dos sentidos.
  - La `key` incluye el tamaño o la cifra, así que nunca hay dos opciones iguales.
- **cable-car.**
  - Pequeños: empiezan 0–2, suben 1–2 y el final es ≤ 4.
  - Medianos: empiezan 1–6, suben 1–4 y el final es ≤ 10.
  - Mayores: empiezan 3–12, con 1 o 2 pasos de 1–5 (en dos pasos, uno sube y otro baja), y todos los valores intermedios entre 0 y 20.
  - Opciones con `numberChoices`.
- **tracks.**
  - Paseo aleatorio que nunca sale de la cuadrícula y no acaba en la salida.
  - Pequeños: 3×3, 1–2 flechas y 3 destinos en casillas distintas de la salida.
  - Medianos: 4×4 y 3–4 flechas.
  - Mayores: 4×4 y 4–6 flechas. Las 2 tiras incorrectas son mutaciones de la correcta (cambiar una flecha o intercambiar dos) que siguen dentro de la cuadrícula y acaban fuera de la fresa.
- **balance.**
  - Pequeños: un pesado y un ligero de las listas fijas, con el lado al azar.
  - Medianos: a ≠ b en 1–9 y faltan |a − b|.
  - Mayores: k ∈ 2–4 y n ∈ 2–3 con n·k ≤ 12, y 4 opciones.
- **mirror.**
  - Los dibujos son datos puros en `src/learning/quiz/pictures.ts`: primitivas de la mitad izquierda en una caja normalizada, más una variante con un detalle cambiado.
  - Una prueba garantiza que ninguna mitad es simétrica respecto a su eje vertical, para que la mitad sin reflejar sea distinta de la reflejada.
  - Mayores: cuadrícula de 4×6, con 3–6 casillas pintadas a la izquierda, objetivos `col → 5 − col` y forma `multi` sin orden sobre las 12 casillas de la derecha.

### 9. Disposición en 844×390
- Lalo y su altavoz arriba a la izquierda y las marcas arriba en el centro, como ahora.
- **Huellas:** la cuadrícula (máximo 4×90 px lógicos) a la izquierda del centro y la tira de flechas en vertical a su derecha. En mayores, las 3 tiras van en una columna a la derecha como opciones de fila.
- **Balanza:** los platillos como opciones `scene` y la balanza modelo de mayores más pequeña, arriba a la derecha.
- **Reparto:** la cesta en el centro arriba y los platos en semicírculo abajo.
- **La otra mitad:** el dibujo con la línea en el centro y las 3 mitades en fila abajo. En mayores, la cuadrícula de 4×6 a 90 px lógicos (540×360).
- Se recoloca con `onResize`, como las demás pruebas.

## Risks / Trade-offs

- **[Riesgo] Seis pruebas a la vez es mucho trabajo** → Cada prueba es independiente (generador, vista y pista). Las tareas van prueba a prueba y cada una se puede probar abriendo `Quiz` con su nivel, sin jugar el nivel.
- **[Riesgo] Las flechas de las huellas confunden derecha e izquierda a los 3–4 años** → En pequeños, como mucho 2 flechas, destinos con dibujos y la pista del Rufo fantasma. Es justamente lo que se aprende, y siempre se puede superar la prueba con 2 de 3.
- **[Riesgo] Los dibujos simétricos pueden no reconocerse a tamaño de móvil** → Primitivas grandes y pocas (5–8 por mitad), con revisión a 844×390 en escala de grises.
- **[Riesgo] La escena del teleférico se hace larga** → Cada paso dura ≤ 400 ms por pasajero y la escena entera ≤ 6 s en mayores. Se mide en el navegador.
- **[Compromiso] `QuizScene` tendrá dos maneras de dibujar (código antiguo y vistas nuevas)** → Así no se arriesgan las pruebas actuales. Migrar las antiguas a vistas puede ser un cambio aparte.

## Migration Plan

- No hay datos guardados nuevos. Despliegue normal.
- Para volver atrás basta con desplegar la versión anterior: los niveles 7–12 vuelven a usar el ciclo de pruebas antiguo.
