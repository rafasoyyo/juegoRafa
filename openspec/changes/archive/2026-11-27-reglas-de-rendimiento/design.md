# Design

## Context

Ver proposal.md. La PR #22 dejó la herramienta para hornear dibujos (`src/game/ui/bake.ts`) y midió el antes y el después con Chromium sin pantalla, la CPU frenada 4 veces y GPU por software. Esa GPU infla el dibujo, así que el presupuesto se fija sobre esa misma medida, no sobre milisegundos de un móvil real.

## Goals / Non-Goals

**Goals:**
- Reglas comprobables, con su forma de medirlas, que cualquier cambio pueda revisar.
- Que las reglas lleguen también a los cambios pequeños que no pasan por OpenSpec.

**Non-Goals:**
- Automatizar la medición en CI.
- Fijar presupuestos para otras escenas que no sean niveles (mapa, prueba de la bandera, vestidor): hoy no tienen problemas.

## Decisions

### Tres sitios, cada uno con su papel

- La spec `performance` es la fuente de verdad: requisitos y escenarios.
- `AGENTS.md` resume las reglas técnicas en una restricción y apunta a la spec, porque es lo que se lee siempre al empezar.
- `openspec/config.yaml` añade una regla a `proposal` para que cada propuesta diga si el cambio afecta al rendimiento.

Alternativa descartada: solo `AGENTS.md`. Sin escenarios no hay forma de comprobar ni de cambiar las reglas con un delta.

### Presupuesto: 20 ms de media y 33 ms en el percentil 95

Medido tras la PR #22: el peor nivel (río, nivel 10) queda en unos 17 ms de media y 25 ms en el percentil 95. 20 ms deja margen para el mundo 3 sin aceptar una vuelta atrás como la de antes (141 ms).

### Reglas técnicas para `AGENTS.md`

- Los `Graphics` fijos se hornean con `bakeGraphics` o `bakeShape` (`src/game/ui/bake.ts`); solo se quedan como `Graphics` los que cambian de forma.
- Nada de `Math.random()` ni listas nuevas en `update` si se puede evitar; efectos repetidos con reserva de objetos.
- Texturas de 2048 px de lado como mucho y liberadas al cerrar la escena.
- La física con paso variable (`fixedStep: false`) y sin `roundPixels`.

### Cómo medir

Con `npm run dev`, una página de Playwright a 844×390, `Emulation.setCPUThrottlingRate` a 4, y escuchas en los eventos `preupdate`/`postupdate` de la escena y `prerender`/`postrender` del juego. Se describe en la spec por el resultado, no por la herramienta.

## Risks / Trade-offs

- [La medida depende de la máquina] → Se compara siempre en la misma máquina el antes y el después; el umbral tiene margen.
- [Reglas que nadie mide] → La regla de `config.yaml` obliga a cada propuesta a pronunciarse.
