# pwa-hosting Specification

## Purpose
Que el juego se instale desde el navegador del móvil o la tablet como una app a pantalla completa y horizontal, y que se sirva desde Firebase Hosting con actualización automática.

## Requirements

### Requirement: La aplicación es una PWA instalable
La aplicación SHALL declarar un manifest con orientación horizontal, pantalla completa e iconos de
192 y 512 px, y SHALL registrar un service worker que se actualice automáticamente.

#### Scenario: Instalación en móvil
- **WHEN** se abre la aplicación en un móvil o tablet y se añade a la pantalla de inicio
- **THEN** se abre en pantalla completa y en horizontal, con el icono de la aplicación

#### Scenario: Nueva versión
- **WHEN** se despliega una versión nueva y el usuario vuelve a abrir la aplicación
- **THEN** el service worker se actualiza sin que el usuario haga nada

### Requirement: La aplicación se sirve desde Firebase Hosting
El contenido de `dist/` SHALL servirse desde Firebase Hosting del proyecto `juegorafa-edu`, con
reescritura de todas las rutas a `/index.html`, sin caché para `sw.js` y con caché inmutable para
los activos estáticos.

#### Scenario: Despliegue
- **WHEN** se ejecuta `npm run deploy`
- **THEN** se compila el proyecto y se publica en https://juegorafa-edu.web.app

### Requirement: La app tiene icono y favicon con la cara del zorro
La aplicación SHALL usar la cara del zorro, sobre el fondo azul cielo del juego, como icono de la PWA (192 px, 512 px y `apple-touch-icon` de 180 px) y como favicon de la pestaña del navegador (SVG con PNG de reserva). La cara SHALL quedar dentro de la zona segura central del icono para que no se recorte con máscaras circulares o redondeadas.

#### Scenario: Instalación en móvil
- **WHEN** se añade la app a la pantalla de inicio de un móvil o tablet
- **THEN** el icono mostrado es la cara del zorro, completa y sin recortes con máscara circular

#### Scenario: Pestaña del navegador
- **WHEN** se abre la app en un navegador de escritorio o móvil
- **THEN** la pestaña muestra la cara del zorro como favicon

### Requirement: Cada rama de integración publica su propia preview
Cada push o merge en las ramas `dev`, `mundo1`, `mundo2`, `mundo3`, `mundo4` y `mundo5` SHALL lanzar automáticamente el workflow de preview, que SHALL ejecutar las pruebas, compilar y publicar en un canal de Firebase Hosting del proyecto `juegorafa-edu` cuyo `channelId` MUST ser igual al nombre de la rama. Los despliegues de una rama MUST NOT cancelar los de otra, y el despliegue a producción (canal `live`) MUST seguir siendo solo manual desde `main`.

#### Scenario: Merge en una rama de mundo
- **WHEN** se mergea una PR en la rama `mundo3`
- **THEN** se publica una preview en el canal `mundo3` de Firebase Hosting y su URL aparece en el resumen del job

#### Scenario: Merge en dev
- **WHEN** se mergea una PR en la rama `dev`
- **THEN** se publica la preview en el canal `dev`, como hasta ahora

#### Scenario: Ramas a la vez
- **WHEN** llegan pushes casi simultáneos a `dev` y a `mundo2`
- **THEN** se publican las dos previews, cada una en su canal, sin que una cancele a la otra

#### Scenario: Rama de trabajo o main
- **WHEN** se hace push a una rama de trabajo como `mundo3-reto-geiser` o a `main`
- **THEN** no se publica ninguna preview ni se despliega a producción
