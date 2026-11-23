## Context

- `src/game/state.ts` guarda el progreso en un objeto `session` en memoria (`stars: Map`, `cookies`, `ownedHats: Set`, `hat`). Lo mutan `completeLevel` (desde `LevelCompleteScene`) y `buyHat`/`wearHat` (desde `WardrobeScene`). Es TypeScript puro y ya hay pruebas en `state.test.ts`.
- `TitleScene` desbloquea el audio con el primer toque y va a `Map`. Las escenas se registran en `src/main.ts` y cambian con `goTo`/`enter`/`onResize` de `ui/transition.ts`; los botones usan `RoundButton`.
- No hay ningún almacenamiento persistente todavía. Ver `proposal.md` para el motivo y el alcance.

## Goals / Non-Goals

**Goals:**
- Que el progreso sobreviva a cerrar el navegador, por perfil, sin servidor.
- Lógica de ids, serialización y almacenamiento en módulos puros y probados; las escenas solo la usan.
- Que un fallo del almacenamiento nunca bloquee el juego.

**Non-Goals:**
- Firebase, cuentas, consentimiento del tutor, borrado/edición de perfiles, sincronización entre dispositivos.

## Decisions

1. **Id = `slug(alias)-edad`** (p. ej. `lucia-5`). Es lo que pidió el usuario y hace que el mismo alias y edad recuperen el progreso. `slug` pasa a minúsculas y quita tildes con `normalize('NFD')`, con la Ñ → `n`, y descarta lo que no sea `a-z`. Como el teclado solo emite A–Z y Ñ, el slug nunca queda vacío si el alias no lo está. Alternativa descartada: id aleatorio (UUID); no permite «recuperar» un perfil escribiendo de nuevo los mismos datos. Riesgo aceptado: dos niños con el mismo alias y edad comparten perfil (ver Riesgos).
2. **Un registro por perfil en `localStorage`**: clave `juegoRafa.profile.<id>` con `{ v: 1, alias, age, lastPlayed, progress }` y una clave `juegoRafa.last` con el id usado por última vez. La lista de perfiles se obtiene recorriendo las claves con el prefijo. Así un registro dañado afecta solo a ese perfil y no hace falta mantener un índice sincronizado. Alternativa descartada: un único JSON con todos (un fallo lo rompe todo).
3. **Módulos puros** en `src/game/profile/`: `profile-id.ts` (`profileId(alias, age)`, validación), `progress-codec.ts` (`GameState` ↔ objeto JSON: `Map` → pares, `Set` → array; al leer, valida tipos, recorta estrellas a 1..3, galletas a entero ≥ 0, ignora gorros desconocidos) y `profile-store.ts` (`list`, `load`, `save`, `touch`) sobre una interfaz `KeyValueStore` mínima (`getItem/setItem/key/length`) que en el juego es `window.localStorage` y en las pruebas un fake. Todo con `try/catch`: si falla, `save` no hace nada y `list` devuelve `[]`.
4. **Cargar en `session` sin reemplazarla**: `session` es una constante importada en muchas escenas, así que `loadProfile` copia los campos del progreso leído dentro del mismo objeto (`Object.assign` tras `createGameState()`), y la activa registra el `activeProfile` (módulo `profile/active.ts`). Alternativa descartada: hacer `session` reasignable; obliga a tocar todas las importaciones.
5. **Guardar tras cada cambio relevante**: `saveActive()` se llama al final de `completeLevel` y tras `buyHat`/`wearHat` exitosos, desde las escenas (la lógica pura de `state.ts` no toca el almacenamiento, para seguir siendo probable). Sin perfil activo (p. ej. pruebas o modo desarrollo directo a una escena) no hace nada.
6. **Flujo de escenas**: `Title` (toque, audio) → `Profiles` si hay perfiles guardados, o `NewProfile` si no → `Map`. `Profiles` tiene el botón «+» hacia `NewProfile`, y `NewProfile` vuelve a `Profiles` con una flecha si había perfiles. El audio se desbloquea en `Title` como hasta ahora.
7. **Teclado en pantalla dibujado en Phaser** con `RoundButton` (letras A–Z y Ñ en 3 filas más borrar). Se sitúa en la mitad inferior; el alias arriba, y las edades 3–8 en una fila a la derecha; todo dentro de 844×390 en CSS (alto lógico 720 → cada botón ≥ 44 px en pantalla, es decir ≥ 80 px lógicos de alto). Para desarrollo en escritorio también se aceptan las letras del teclado físico. Alternativa descartada: `<input>` HTML, por tapar la pantalla en móvil horizontal y romper el estilo.
8. **Edad 3 a 8**: cubre al público de 4 a 6 con margen para hermanos; el valor es una constante.
9. **Alias máximo 12 letras**, en mayúsculas al mostrar y minúsculas en el id; el alias se guarda tal como se escribió (en mayúsculas) para mostrarlo.
10. **Consigna visual, sin texto**: los pictogramas (lápiz con «Aa» sobre el alias, tarta con velas sobre las edades) se dibujan con gráficos de Phaser en el estilo plano del juego, sin assets de terceros; si luego pasan a SVG, entran en el registro de licencias como propios. Lalo se dibuja con `drawLalo` y una flecha con pulso vertical señala el paso pendiente, que se deduce del estado: sin alias → alias; con alias y sin edad → edad; con ambos → aceptar. Se reserva un gancho `speak(step)` sin efecto hasta la fase 2 y tocar a Lalo repite su animación; para no chocar con «El altavoz de Lalo es el único control de sonido», el Lalo de esta pantalla no lleva altavoz. Se descarta el texto escrito por la regla «sin texto que el niño deba leer».

## Risks / Trade-offs

- **Colisión de ids** (mismo alias y edad): se comparte progreso; es lo pedido y el aviso queda documentado. Un futuro panel de padres podrá separar o borrar perfiles.
- **El alias es un dato personal posible** (puede ser el nombre real): se queda solo en `localStorage` y no sale del dispositivo; al sincronizar en la fase 3 habrá que revisarlo con el consentimiento del tutor.
- **Datos en el navegador**: limpiar datos del sitio o usar modo privado borra el progreso; no hay copia. Se asume hasta la fase 3.
- **Cuota o almacenamiento bloqueado**: se ignora el error y se juega sin guardar.
- **Sitio vertical**: la consigna visual debe caber en el alto lógico de 720 junto al teclado; el pictograma ocupa la franja superior, junto al alias.
- **Esquema futuro**: el campo `v: 1` permite migrar; un registro con otra versión se ignora en vez de romper.
