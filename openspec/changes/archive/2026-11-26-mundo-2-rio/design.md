# Design

## Context

Las reglas de diseño (`validate.ts`), la duración (`duration.ts`) y el sitio para enemigos ya se comprueban para cada nivel de cada mundo en `worlds.test.ts`. Solo faltaba el contenido.

## Goals / Non-Goals

**Goals:** 12 recorridos que siguen la tabla del plan y pasan las reglas; paisajes propios del río; el río abierto en el juego publicado.

**Non-Goals:** arte nuevo de decoración, ajustes tras la prueba con niños.

## Decisions

- **Recorridos montados por piezas.** Cada recorrido alterna grupos de bloques, escalones, plataformas y fosos con los retos de su nivel, con 6 a 10 baldosas de suelo llano entre piezas para que quepan los enemigos lejos de los retos. Los JSON se generaron con un guion de apoyo y quedan como datos editables a mano; no se añade el guion al repositorio.
- **Paisajes como variantes de color.** Los 12 paisajes nuevos reutilizan las 12 decoraciones del mundo 1 con su propio cielo, colinas y suelo. Así no hay texturas nuevas que cargar. La prueba de «decoración distinta» pasa a ser por mundo.
- **Río en el mapa.** `WorldMap.river` dibuja una banda azul que pasa por debajo de cada parada, del manantial a la desembocadura. El mundo 1 no la tiene.
- **Interruptor.** El río deja de usar `mundo-2-rio`; el mecanismo de interruptores sigue para el siguiente mundo en construcción.

## Risks / Trade-offs

- Publicar el río depende de desplegar, que sigue siendo una decisión aparte (`npm run deploy` solo cuando se pida).
- Los niveles 10 a 12 rozan los 150 s con calma; la prueba con niños (paso 10) dirá si hay que acortarlos.
