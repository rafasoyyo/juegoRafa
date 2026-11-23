# Tasks

## 1. Proyecto base

- [x] 1.1 Crear `package.json`, `tsconfig.json` (strict), `index.html` (viewport sin zoom, fondo sin scroll) y `vite.config.ts`. Verificación: `npx tsc --noEmit` sin errores.
- [x] 1.2 Instalar `phaser`, `firebase`, `typescript`, `vite`, `vite-plugin-pwa`, `vitest`. Verificación: `npm run build` termina bien.

## 2. PWA

- [x] 2.1 Configurar el manifest (horizontal, pantalla completa) y el service worker con `vite-plugin-pwa`. Verificación: tras `vite build` existen `dist/sw.js` y el manifest.
- [x] 2.2 Generar iconos 192 y 512 con `scripts/make-icons.mjs`. Verificación: existen `public/icons/icon-192.png` y `icon-512.png`.

## 3. Juego

- [x] 3.1 `BootScene` con texturas provisionales (suelo, bloque, bloque usado, niño, moneda, nube, colina, bandera). Verificación: se ven en el nivel.
- [x] 3.2 `TouchControls` con zonas izquierda, derecha y salto, multitoque y teclado. Verificación: en móvil emulado táctil los botones responden.
- [x] 3.3 `LevelScene` con movimiento, salto tolerante y variable, bloques «?» que dan moneda una vez, contador y meta. Verificación: la consola del navegador no muestra errores al cargar.
- [x] 3.4 Colocar el inicio del niño fuera del botón izquierdo. Verificación: captura en 844×390 móvil.

## 4. Firebase

- [x] 4.1 Crear el proyecto `juegorafa-edu` y configurar `.firebaserc` y `firebase.json`. Verificación: `firebase projects:list` lo muestra.
- [x] 4.2 Desplegar en Hosting. Verificación: https://juegorafa-edu.web.app responde.

## 5. Documentación y marco de trabajo

- [x] 5.1 Escribir `docs/PROPUESTA.md` (educativa y técnica, decisiones y requisitos por publicar).
- [x] 5.2 Inicializar OpenSpec y escribir `openspec/config.yaml` con el contexto del proyecto.
