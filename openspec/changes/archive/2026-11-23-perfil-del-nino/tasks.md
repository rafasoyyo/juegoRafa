## 1. Lógica pura de perfiles (sin Phaser)

- [x] 1.1 Crear `src/game/profile/profile-id.ts` con `profileId(alias, age)` (minúsculas, sin tildes, Ñ→n, solo `a-z`, `-edad`), `MAX_ALIAS = 12`, `AGE_OPTIONS = [3..8]` y la validación del alias y la edad; probar con Vitest «LUCIA»+5 → `lucia-5`, «NIÑA»+4 → `nina-4`, alias vacío y edad fuera de rango (`npx vitest run src/game/profile`)
- [x] 1.2 Crear `src/game/profile/progress-codec.ts` que convierte `GameState` a objeto JSON y de vuelta (Map y Set incluidos), validando tipos, recortando estrellas a 1..3, galletas a enteros ≥ 0 e ignorando gorros desconocidos; probar el ida y vuelta y datos dañados (`npx vitest run src/game/profile`)
- [x] 1.3 Crear `src/game/profile/profile-store.ts` sobre una interfaz `KeyValueStore`: `listProfiles` (último usado primero), `loadProfile`, `saveProgress`, `createProfile` (si el id ya existe devuelve el existente) y `lastProfileId`, todo con `try/catch`; probar con un almacén falso: varios perfiles, registro corrupto ignorado, versión desconocida ignorada, almacenamiento que lanza al escribir (`npx vitest run src/game/profile`)
- [x] 1.4 Crear `src/game/profile/active.ts` con el perfil activo: `activateProfile(id)` que carga el progreso dentro del objeto `session` existente sin reemplazarlo, y `saveActive()` que no hace nada si no hay perfil; probar que cambiar de perfil no mezcla el progreso (`npx vitest run src/game/profile`)

## 2. Pantallas

- [x] 2.1 Crear `NewProfileScene` con el alias en letras grandes, teclado en pantalla (A–Z, Ñ, borrar), botones de edad 3–8 y botón de aceptar apagado hasta tener alias y edad; aceptar crea o recupera el perfil, lo activa y abre el mapa; aceptar también letras del teclado físico. Verificar en el navegador a 844×390 que todo cabe a la vez y que cada botón mide ≥ 44 px en pantalla
- [x] 2.2 Crear `ProfilesScene` con la lista de perfiles (zorro con su gorro, alias y edad; el último usado primero) y el botón «+» hacia `NewProfileScene`; tocar un perfil lo activa y abre el mapa. Verificar en el navegador con 1, 2 y 6 perfiles guardados que la lista cabe o se puede desplazar sin solaparse
- [x] 2.3 Registrar las dos escenas en `src/main.ts` y cambiar `TitleScene` para ir a `Profiles` si `listProfiles()` no está vacío o a `NewProfile` si lo está, manteniendo el desbloqueo de audio y que antes del primer toque no suena nada. Verificar en el navegador con almacenamiento vacío y con perfiles

## 3. Guardado

- [x] 3.1 Llamar a `saveActive()` tras `completeLevel` en `LevelCompleteScene` y tras `buyHat`/`wearHat` exitosos en `WardrobeScene`. Verificar en el navegador: completar el nivel 1, comprar un gorro, recargar, elegir el mismo perfil y ver estrellas, galletas y gorro conservados
- [x] 3.2 Verificar en el navegador con dos perfiles («LUCIA» 5 y «LUCIA» 6) que el progreso no se mezcla y que el segundo «LUCIA» 5 recupera el primero; con el almacenamiento bloqueado (`localStorage` que lanza) se puede crear perfil y jugar sin errores en consola, y la pestaña Network no muestra peticiones con el alias ni la edad

## 4. Cierre

- [x] 4.1 Ejecutar `npm test` y `npm run build` sin errores
- [x] 4.2 Actualizar `docs/PROPUESTA.md` (§3.3 y §7) con una nota: el alias puede ser un apodo y, mientras no haya Firebase, alias y edad solo viven en `localStorage`

## 5. Consigna visual (añadida tras la revisión)

- [x] 5.1 Dibujar el pictograma del lápiz con «Aa» (sobre el alias) y el de la tarta con velas (sobre las edades) con gráficos de Phaser; verificar en el navegador a 844×390 que se reconocen y no tapan el teclado
- [x] 5.2 Añadir a Lalo y una flecha animada que señala el paso pendiente (alias → edad → aceptar); verificar en el navegador que la flecha cambia al escribir la primera letra y al elegir la edad
- [x] 5.3 Tocar a Lalo repite su animación y deja un gancho `speak(step)` sin efecto hasta la fase 2; verificar que no suena nada y que no hay otro botón de silencio
- [x] 5.4 Ejecutar `npm test` y `npm run build`, y repasar la pantalla en 844×390 y en 960×720
