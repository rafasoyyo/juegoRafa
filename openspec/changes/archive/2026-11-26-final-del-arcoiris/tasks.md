# Tasks

## 1. Reglas

- [x] 1.1 `shouldPlayFinale` en `story/story.ts` y `opensAfter` en `worlds/access.ts`, con pruebas (sin terminar no; terminado y no visto sí; visto no; un pendiente cuenta; el río se abre con el final para 5 años y no para 6; un mundo tras un interruptor apagado no). Verificación: `npx vitest run src/game/story src/game/worlds`.

## 2. Escena

- [x] 2.1 `WorldDef.finale` y el dato del mundo 1. Verificación: `npm run build`.
- [x] 2.2 `story/finale.ts` y su uso en `MapScene` tras el gajo 12, con la marca guardada, el candado del río y el toque que lo salta. Verificación: a 844×390, perfil de 5 años que termina el nivel 12: gajo, lluvia, manantial y candado que salta; de 6 años: sin animación del botón; al volver al mapa no se repite.

## 3. Cierre

- [x] 3.1 `npm test` y `npm run build` pasan; `docs/MUNDO-1.md` marca el paso 4. Verificación: salida de los comandos.

## Workflow follow-up

- Archivar el cambio y abrir la PR contra `dev` desde `mundo1-final-del-arcoiris`.
