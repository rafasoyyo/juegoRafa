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
