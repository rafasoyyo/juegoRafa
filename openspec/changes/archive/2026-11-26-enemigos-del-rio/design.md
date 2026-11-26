# Design

## Context

Los enemigos son funciones del tiempo sin estado (`enemy-motion.ts`), se reparten en tramos libres (`enemy-layout.ts`, que ya deja fuera las zonas de los retos) y se dibujan en `enemy-views.ts`.

## Decisions

### Rana

Ciclo de 2,6 s con fase al azar: 1,4 s quieta, 0,45 s agachada (se aplasta y ensancha, y tiembla al final) y 0,75 s en el aire con una parábola de 210 px. Su caja (46×34) sube con ella: el cuerpo del zorro (87 px) cabe por debajo durante más de medio segundo de cada salto, y andando la cruza en menos de 0,3 s. Quieta mide poco y se salta sin esfuerzo. No se desplaza: se coloca en un punto de su tramo.

### Cangrejo

La misma ida y vuelta del erizo (`patrolX`, compartida) a 40 px/s en lugar de 60, con un tramo de 200 px como mucho. No se voltea, porque anda de lado.

### Tipos por mundo

`EnemyRules.beeFromLevel` pasa a `kinds: { kind, fromLevel }[]`. Cada enemigo elige con `rng()` entre los tipos llegados, con la misma probabilidad; si solo hay uno, no gasta azar. El mundo 1 declara la abeja antes que el erizo para que, con la misma semilla, salga lo mismo que antes.

## Risks / Trade-offs

- [El niño no ve venir el salto] → El agachado dura casi medio segundo y tiembla; se revisará el ritmo en la prueba con niños (paso 10).
- [El recuento de la prueba de recuerdo del mundo 1 solo conoce erizos y abejas] → El recuento por tipo pasa a incluir rana y cangrejo, pero la prueba solo lee erizos y abejas, como hasta ahora.
