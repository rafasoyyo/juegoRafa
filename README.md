# juegoRafa

Juego web de plataformas 2D, de estilo vectorial plano y redondeado, para niños de **4 a 6 años** que aún no leen ni suman. Rufo el zorro corre por el mundo, golpea bloques «?» que sueltan galletas y, al llegar a la bandera de cada nivel, resuelve una prueba corta con ayuda de Lalo el búho. Es educativo, sin vidas ni «game over», y se instala como PWA en móvil o tablet.

> Todo es original: personajes, arte y sonido son propios o libres, con la licencia anotada. No hay nada de terceros con copyright.

## Características

- **Móvil y táctil primero**, en horizontal (el teclado sirve para desarrollar en escritorio).
- **Sin texto que el niño deba leer**: las consignas son dibujo, y Lalo señala y guía.
- **Sin derrota**: un fallo es un rebote suave y una pista. Las estrellas van de 1 a 3, nunca 0.
- **Mundo 1 de 12 niveles**, cada uno con su ambiente (prado, bosque, playa, nieve, desierto…), enemigos (erizo y abeja), zonas de pinchos desde el nivel 7 y una fresa que da invencibilidad.
- **Prueba de la bandera** al final de cada nivel, de 3 preguntas y adaptada a la edad del perfil: contar, comparar, series, formas, letras del nombre, memoria, repartir, ordenar, sumar y restar como algo que pasa, orientarse, equilibrar pesos y simetría.
- **Galletas y vestidor**: las galletas se gastan en gorros para Rufo.
- **Perfiles de niño** con alias y edad, guardados solo en el navegador.
- **Música y efectos sintetizados**, con un único botón de silencio (el altavoz de Lalo).
- **PWA**: instalable, a pantalla completa y con juego sin conexión.

## Requisitos

- Node.js 24 o superior
- npm

## Empezar

```bash
npm install
npm run dev
```

`npm run dev` arranca Vite con `--host`: abre la dirección de red que muestra en el móvil, conectado a la misma wifi, para probar con el tacto.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo accesible desde la red local |
| `npm run build` | Comprobación de tipos (`tsc --noEmit`) y build de producción en `dist/` |
| `npm run preview` | Sirve el build de `dist/` |
| `npm test` | Pruebas con Vitest |
| `npm run deploy` | Build y despliegue en Firebase Hosting (proyecto `juegorafa-edu`) |

## Stack

Phaser 4 · TypeScript (strict) · Vite · vite-plugin-pwa (Workbox) · Vitest · Firebase Hosting.

Firebase Auth y Firestore están previstos para la fase 3; hoy el progreso vive en `localStorage`.

## Estructura

```
src/
  main.ts            arranque de Phaser y escenas
  game/              motor: escenas, UI, audio, enemigos, niveles, perfiles, estado
  learning/          lógica pedagógica en TypeScript puro (pruebas, puntuación)
content/levels/      los recorridos de cada mundo en JSON (arcoiris/ = mundo 1)
public/              arte SVG, fuentes, iconos (con LICENSES.md)
scripts/             utilidades (generación de iconos)
docs/PROPUESTA.md    propuesta educativa y técnica completa
openspec/            especificaciones y cambios (flujo spec-driven)
```

Regla de arquitectura: `src/learning/` no importa `phaser` ni `firebase`, así se prueba sin navegador.

## Cómo se trabaja

El proyecto sigue un flujo con [OpenSpec](https://github.com/Fission-AI/OpenSpec): cada cambio se propone, se especifica y se implementa por tareas.

- `openspec/specs/`: comportamiento vigente, una carpeta por capacidad.
- `openspec/changes/`: cambios en curso; los terminados van a `archive/`.
- `openspec/config.yaml`: contexto y reglas que usan los asistentes de IA.

Contenido nuevo (niveles, retos) va como datos en `content/`, sin tocar el motor. Consulta [AGENTS.md](AGENTS.md) para las convenciones.

## Hoja de ruta

Hechas: fase 0 (esqueleto y despliegue), prototipo jugable, retos, mundo 1 de 12 niveles con mapa, galletas, vestidor y perfiles locales. Pendientes: auth y progreso en Firestore, panel de padres (candado, límite de tiempo, idioma), voz grabada y los mundos 2 a 4. El detalle está en [docs/PROPUESTA.md](docs/PROPUESTA.md).

## Privacidad y licencias

El juego está pensado para menores: sin publicidad, sin analítica con identificadores personales, con datos mínimos (alias, edad, avatar, progreso) y con consentimiento del tutor antes de sincronizar nada (RGPD y COPPA). Todos los recursos gráficos y tipográficos están registrados en [public/assets/LICENSES.md](public/assets/LICENSES.md). El código se distribuye bajo la licencia de [LICENSE](LICENSE).
