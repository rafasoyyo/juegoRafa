# Design

## Context

La refactorización «mundos independientes» dejó cada mundo en su carpeta (`src/game/worlds/<id>/`, `content/levels/<id>/`) y el progreso por mundo con migración (`progress-codec.ts`). El selector, sin embargo, sigue con el orden antiguo (`123`, `Aa`, formas, candado) y no hay forma de entrar a un segundo mundo. `docs/MUNDO-2.md` fija el orden nuevo, la regla de edad y el interruptor de desarrollo.

## Goals / Non-Goals

**Goals:**
- Selector `123`, río, formas, `Aa`, con tres estados por botón: abierto, con candado y próximamente.
- Regla de apertura como dato de la definición del mundo y cálculo puro y probado.
- Poder entrar al río con `npm run dev` sin que llegue al juego publicado.

**Non-Goals:**
- Contenido real del río (paso 9), retos (pasos 3 a 5), pruebas (paso 7) o castillo (paso 8).

## Decisions

### La puerta del mundo es un dato de `WorldDef`

`WorldDef.gate?: { flag?: FlagId; openAge?: number; after?: { world: WorldId; level: number } }`. Sin puerta, el mundo está siempre abierto (el mundo 1). `worldAccess(def, state, age, flags)` en `src/game/worlds/access.ts` devuelve `'open' | 'locked' | 'soon'`:

1. Si hay `flag` y está apagado → `soon` (se ve como formas y `Aa`).
2. Si `age >= openAge` → `open`.
3. Si el nivel `after.level` del mundo `after.world` está hecho o pendiente → `open`.
4. Si no → `locked`.

Sin perfil (`age` indefinida) solo vale la regla 3. Así el río queda `{ flag: 'mundo-2-rio', openAge: 6, after: { world: 'arcoiris', level: 12 } }` y el castillo o el mundo 3 podrán usar la misma forma.

Alternativa descartada: reglas escritas en `MapScene`. No se podrían probar sin Phaser.

### Interruptores en `src/game/flags.ts`

`FLAGS: Record<FlagId, boolean>` con `'mundo-2-rio': import.meta.env.DEV`. La función pura recibe los interruptores como argumento, así que las pruebas no dependen del modo de Vite. En el paso 9 basta con quitar `flag` de la puerta del río.

### Borrador del río

`src/game/worlds/rio/index.ts` y `content/levels/rio/nivel-1.json`. Para no adelantar decisiones de otros pasos, el borrador reutiliza lo que ya existe y lo marca como provisional: un ambiente del mundo 1 (`montana`, el manantial), la prueba `count` y un recorrido de 90 a 150 s sin pinchos. El mapa reserva los 13 nodos (12 tramos y el castillo) pero solo dibuja los niveles que existen. Cumple las mismas pruebas de contenido que cualquier mundo registrado.

`MapScene.drawPath` necesita al menos dos puntos: con un solo nivel no se dibuja camino.

### Mundo mostrado

`MapScene.init` comprueba `worldAccess` del mundo pedido o recordado; si no es `open`, muestra el primero. Así, al cambiar a un perfil sin el río, no se queda en su mapa.

### Icono del marco de diez

`public/assets/svg/icon-ten-frame.svg`, arte propio: un marco de 2×5 casillas redondeadas con 7 fichas azules, sin contorno negro, con la paleta de `visual-style`. Se anota en `LICENSES.md`.

## Risks / Trade-offs

- [El borrador del río entra en el bundle publicado] → Son unos pocos KB y el botón no lo abre con el interruptor apagado.
- [Un progreso del río guardado en desarrollo con niveles que el borrador aún no tiene se descarta al leerlo] → Solo afecta a perfiles de desarrollo; con los 12 niveles del paso 9 desaparece.
