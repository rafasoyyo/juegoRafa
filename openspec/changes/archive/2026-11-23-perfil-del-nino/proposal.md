## Why

Hoy el progreso (estrellas, galletas y gorros) vive solo en memoria y se pierde al cerrar la pestaña. Para que cada niño conserve su avance en el navegador, y para que varios niños puedan compartir un mismo dispositivo, la pantalla de bienvenida debe pedir un nombre (alias) y una edad, y con ellos crear un id de perfil bajo el que se guarda el progreso.

## What Changes

- Tras tocar la pantalla de inicio aparece una pantalla de perfil:
  - Si no hay perfiles guardados: formulario de nuevo perfil con **teclado de letras grandes dibujado en el juego** para el alias y **botones con dígitos** para la edad.
  - Si ya hay perfiles: lista de los guardados (cara del zorro con su gorro, alias y edad) para elegir uno, más un botón «+» para crear otro.
- El **id del perfil** se deriva del alias y la edad (alias normalizado sin tildes ni símbolos + edad, p. ej. `lucia-5`). El mismo alias y edad recuperan el mismo progreso.
- El progreso (estrellas por nivel, galletas, gorros comprados y gorro puesto) se **guarda en el navegador** (`localStorage`) bajo ese id, y se guarda solo, tras completar un nivel y tras comprar o ponerse un gorro. Al elegir un perfil se carga su progreso.
- Si el navegador no permite guardar (modo privado, almacenamiento bloqueado), el juego sigue funcionando sin guardar y sin mostrar errores.
- La pantalla de nuevo perfil lleva consignas visuales (pictogramas y Lalo con una flecha animada), no texto.
- Cambia el requisito «Pantalla de inicio» de `world-map`: el toque abre la pantalla de perfil y, una vez elegido o creado el perfil, el mapa.

**Habilidad educativa:** ninguna directamente; el teclado y los números de edad son un apoyo para que el adulto o el niño mayor se identifiquen.

**Fuera de alcance:**
- Sincronización con Firebase, cuentas de adulto y consentimiento del tutor (fase 3 de `docs/PROPUESTA.md`): ningún dato sale del dispositivo.
- Borrar o editar perfiles (irá en el panel de padres); en este cambio solo se crean y se eligen.
- Mover el progreso entre dispositivos o navegadores.
- Las voces de Lalo (fase 2): aquí solo queda el gancho para añadirlas.
- Pedir que el niño lea: el alias se escribe una vez, normalmente con ayuda de un adulto; todas las consignas siguen siendo de dibujo y voz.

## Capabilities

### New Capabilities
- `child-profile`: perfiles de niño en el dispositivo (alias, edad, id derivado) y guardado/carga automática de su progreso en el navegador.

### Modified Capabilities
- `world-map`: la pantalla de inicio ya no va directa al mapa; pasa antes por la pantalla de perfil.

## Impact

- `src/game/state.ts` (serializar/cargar el estado), nuevo módulo de perfiles y de almacenamiento (TypeScript puro, con pruebas Vitest) y dos escenas nuevas (perfiles y nuevo perfil), registradas en `src/main.ts`.
- `TitleScene`, `LevelCompleteScene` y `WardrobeScene` (guardar tras cambiar el estado).
- `openspec/config.yaml` y `docs/PROPUESTA.md` hablan de «alias, sin nombre real»: el campo se llama alias y se avisa de que puede ser un apodo; sin cambios de política.
- Privacidad: el alias y la edad solo se guardan en el `localStorage` del dispositivo; nunca se envían a ningún servidor.
