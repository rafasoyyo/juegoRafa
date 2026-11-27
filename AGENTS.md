# AGENTS.md

Guía para asistentes de IA que trabajan en juegoRafa. Visión general en [README.md](README.md); propuesta completa en [docs/PROPUESTA.md](docs/PROPUESTA.md) (si algo discrepa, manda la propuesta).

## Qué es

Plataformas 2D web para niños de 4 a 6 años que no leen ni suman. Rufo el zorro, guiado por Lalo el búho. Móvil táctil en horizontal, instalable como PWA. Idioma del proyecto: **español** (código, comentarios, specs y mensajes de commit).

## Restricciones no negociables

1. **Móvil y táctil primero**, horizontal. El teclado es solo para desarrollar.
2. **Nada que el niño deba leer**: consignas con dibujo (y voz cuando exista). Los textos para adultos van en el bocadillo de Lalo.
3. **Sin vidas ni «game over»**. Fallar = rebote suave + pista. Estrellas de 0 a 3 por objetivos (galletas y prueba de la bandera); con 0 se vuelve a empezar la fase, sin pantalla de derrota. El pinchazo solo resta una galleta del nivel (nunca baja de 0).
4. **Sin material de terceros con copyright** (ni Nintendo, ni Mario). Arte propio o CC0, anotado en `public/assets/LICENSES.md` en el mismo commit que lo añade.
5. **Se publica y es para menores**: sin publicidad, sin analítica con identificadores personales, datos mínimos (alias, edad, avatar, progreso), sin enlaces externos ni chat. RGPD (menores de 14) y COPPA (menores de 13).
6. **`src/learning/` es TypeScript puro**: no importa `phaser` ni `firebase`.

## Comandos

```bash
npm run dev       # Vite con --host (probar en el móvil por la wifi)
npm run build     # tsc --noEmit + vite build
npm test          # Vitest (una pasada)
npm run deploy    # build + Firebase Hosting (juegorafa-edu)
```

Antes de dar un cambio por terminado: `npm test` y `npm run build` deben pasar. Node >= 24.

## Estructura

- `src/main.ts`: configuración de Phaser y lista de escenas.
- `src/game/`: motor. `scenes/` (Boot, Title, Profiles, NewProfile, Map, Level, Quiz, LevelComplete, Wardrobe), `ui/`, `audio/` (sintetizado, sin archivos), `enemies/`, `levels/` (parseo, validación, ambientes, pinchos), `power/` (fresa), `profile/` (perfiles y progreso en `localStorage`), `worlds/` (definición de cada mundo y registro), `state.ts`, `config.ts`.
- `src/learning/`: lógica pedagógica pura. `quiz/` tiene un archivo por tipo de prueba (`count`, `compare`, `series`, `shapes`, `share`, `order`, `cable-car`, `tracks`, `balance`, `mirror`…), el catálogo, la adaptación por edad y los generadores con semilla (`rng.ts`). `scoring.ts` calcula estrellas.
- `content/levels/<mundo>/nivel-N.json`: los recorridos de cada mundo (ambiente, longitud, bloques, escalones, plataformas, pinchos); el mundo 1 está en `arcoiris/`. Se validan con `src/game/levels/validate.ts` y las tablas de su mundo (`src/game/worlds/worlds.test.ts`).
- `src/game/worlds/`: cada mundo en su carpeta (`arcoiris/index.ts`) con sus niveles, prueba de la bandera por nivel, enemigos, reglas de diseño, mapa y botón del selector; `registry.ts` los ordena. Un nivel se identifica por mundo y número, y el progreso se guarda por mundo.
- `public/`: SVG, fuentes e iconos. `scripts/make-icons.mjs` genera los iconos.
- `openspec/`: specs vigentes (`specs/`), cambios en curso y archivados (`changes/`).

## Convenciones

- TypeScript `strict`, con `noUncheckedIndexedAccess`: no asumas que un índice existe.
- Pruebas junto al código (`foo.ts` → `foo.test.ts`). La lógica de `learning/` y de reglas de niveles se prueba sin Phaser; las escenas solo se verifican a mano.
- Alto lógico fijo de 720 px; el ancho se adapta entre 4:3 y 21:9 (`fitWidth`). Controles táctiles de al menos 96 px.
- Estilo vectorial plano y redondeado, sin contornos negros. Paleta en `openspec/specs/visual-style/spec.md`. Tipografía Baloo 2 local.
- Contenido como datos: un nivel o reto nuevo se añade en JSON o en un generador de `learning/`, sin tocar el motor.
- Mundos independientes: un mundo nuevo es una carpeta `content/levels/<id>/`, una definición `src/game/worlds/<id>/index.ts` y una línea en `worlds/registry.ts` (quitando su hueco de `UPCOMING`). Nada del motor debe preguntar en qué mundo está: lo que cambie de un mundo a otro va en su `WorldDef`.
- Los generadores de pruebas reciben una semilla para que las pruebas sean deterministas.
- No metas dependencias nuevas sin necesidad: el juego debe seguir cargando ligero en tablets antiguas.

## Flujo con OpenSpec

Cambios no triviales (comportamiento nuevo o modificado) siguen OpenSpec:

1. `openspec-explore`: pensar y aclarar requisitos.
2. `openspec-propose`: crea `proposal`, `design`, `specs` (delta) y `tasks` en `openspec/changes/<nombre>/`.
3. `openspec-apply-change`: implementar las tareas.
4. `openspec-sync-specs` y `openspec-archive-change`: pasar los deltas a `openspec/specs/` y archivar.

Reglas de `openspec/config.yaml`: artefactos en español, encabezados estructurales y SHALL/MUST en inglés, cada tarea acaba con una verificación concreta, ningún requisito exige leer al niño. Los arreglos pequeños (typos, ajustes de valores) no necesitan cambio formal.

## Qué no hacer

- No añadir vidas, pantallas de derrota ni textos obligatorios para el niño. Las 0 estrellas solo llevan a la pantalla de ánimo para volver a empezar.
- No importar Phaser o Firebase en `src/learning/`.
- No subir recursos sin licencia registrada ni claves o `.env` (están ignorados).
- No tocar `dist/` ni `.firebase/` (generados).
- No sincronizar datos del niño fuera del dispositivo sin consentimiento del tutor (pendiente de la fase 3).

## Estado

Hecho: esqueleto y despliegue, mundo 1 de 12 niveles con mapa, enemigos, pinchos, fresa, 12 tipos de prueba de la bandera, galletas y vestidor, perfiles locales, audio sintetizado. Pendiente: Auth y Firestore, panel de padres, voz grabada, mundos 2 a 12.

En marcha, con boceto aprobado y plan por pasos: el tema del mundo 1, «El camino del arcoíris» ([docs/MUNDO-1.md](docs/MUNDO-1.md)), el mundo 2, «El río de los números» ([docs/MUNDO-2.md](docs/MUNDO-2.md)), y el mundo 3, «La isla de los dinosaurios» ([docs/MUNDO-3.md](docs/MUNDO-3.md)). En borrador, pendiente de aprobar: el mundo 11, «El universo» ([docs/MUNDO-11.md](docs/MUNDO-11.md)). Orden de los 12 mundos en `docs/PROPUESTA.md`. Esos documentos mandan sobre las specs en lo suyo; cada `openspec-propose` de esos planes parte de ellos.
