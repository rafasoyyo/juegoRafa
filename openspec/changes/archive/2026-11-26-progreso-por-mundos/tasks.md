# Tasks

## 1. Puerta de los mundos (puro, sin Phaser)

- [x] 1.1 Crear `src/game/flags.ts` con `FlagId` y `FLAGS` (`'mundo-2-rio'` activo solo con `import.meta.env.DEV`). Verificar con `npm run build`.
- [x] 1.2 Añadir `gate` a `WorldDef` y crear `src/game/worlds/access.ts` con `worldAccess`. Probar en `access.test.ts`: sin puerta, abierto; interruptor apagado, `soon` para cualquier edad; 6 años, abierto; 5 años sin el nivel 12 del mundo 1, `locked`; 5 años con el 12 hecho o pendiente, abierto; sin edad, solo por el nivel 12. Verificar con `npx vitest run src/game/worlds`.

## 2. Borrador del río y selector

- [x] 2.1 Crear `content/levels/rio/nivel-1.json` y `src/game/worlds/rio/index.ts` (borrador, con la puerta del río) y registrarlo en `registry.ts` detrás del mundo 1; `UPCOMING` pasa a formas y `Aa`. Ajustar `worlds.test.ts` (orden del selector y puerta del río). Verificar con `npx vitest run src/game/worlds`.
- [x] 2.2 Dibujar `public/assets/svg/icon-ten-frame.svg`, cargarlo en `BootScene` y anotarlo en `public/assets/LICENSES.md`. Verificar con `npm run build`.
- [x] 2.3 En `MapScene`: el selector usa `worldAccess` (abierto: cambia de mapa; con candado: atenuado con candado y tiembla; próximamente: atenuado y tiembla), `init` vuelve al mundo 1 si el mostrado no está abierto y `drawPath` no dibuja con menos de dos nodos. Verificar con `npm run dev` a 844×390: perfil de 5 años, el río tiembla con candado; perfil de 6 años, entra al mapa del río y al nivel 1; con `npm run build && npm run preview`, el río tiembla sin candado.

## 3. Cierre

- [x] 3.1 Comprobar que el mundo 1 se ve igual (mapa, niveles y progreso de un perfil antiguo) y pasar `npm test` y `npm run build`.
