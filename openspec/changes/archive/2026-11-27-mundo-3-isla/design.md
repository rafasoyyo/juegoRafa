# Design

## Context

Las reglas de diseño (`validate.ts`), la duración (`duration.ts`) y el sitio para enemigos ya se comprueban para cada nivel de cada mundo en `worlds.test.ts`. Como en el río, faltaba el contenido.

## Goals / Non-Goals

**Goals:** 12 recorridos que siguen la tabla del plan y pasan las reglas; paisajes con el registro de expedición de «Dirección de arte»; fosos de lava; la isla abierta en el juego publicado.

**Non-Goals:** prólogo de la barca, mamá al fondo del nivel 12, plataformas de hoja y escalones de basalto; ajustes tras la prueba con niños.

## Decisions

- **Recorridos montados por piezas.** Igual que en el río: grupos de bloques, escalones, plataformas y charcos de lava alternados con los retos, con 7 baldosas de suelo llano entre piezas para que quepan los enemigos lejos de los retos. Generados con un guion de apoyo que no se añade al repositorio; quedan como datos editables a mano.
- **Lava como estilo del foso.** `Ambient.pit` elige qué se dibuja en el fondo (`spikes` o `lava`). La geometría y las reglas del foso no cambian, así que la lava se juega exactamente como los pinchos.
- **Volcán como capa del ambiente.** `Ambient.volcano` dibuja el gran volcán muy lejos (paralaje 0,08), humeando y con el cráter que late. No hace daño ni tapa el recorrido. No sale de noche, en la cueva ni en el borde del cráter.
- **Decoración nueva generada por código** en `BootScene`, sin archivos: helecho, columna en ruinas, basalto, cristales, géiser, volcán, brasa y luciérnaga.
- **Castillo con su dibujo.** `CastleDef.icon` cambia el castillo de siempre por el nido del cráter en el mapa, al final del recorrido del castillo y en su prueba.
- **Interruptor.** La isla deja de usar `mundo-3-isla`; el mecanismo sigue para el mundo 4.

## Risks / Trade-offs

- Los niveles 9 a 12 rozan los 150 s con calma; la prueba con niños dirá si hay que acortarlos.
- Las luces animadas (brasas y luciérnagas) suman tweens; son pocas y en imágenes, no en Graphics.
- Publicar depende de desplegar, que sigue siendo una decisión aparte.
