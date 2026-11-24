# juegoRafa — Propuesta técnica y educativa

Plataformas 2D de estilo vectorial plano y redondeado (la referencia inicial fue la imagen de Super Mario Bros.; el estilo final está en el lienzo de diseño «Juego educativo - diseños») para niños de 4 a 6 años que aún no leen ni suman. Móvil y táctil primero, instalable como PWA, con Firebase como backend.

## 0. Qué tomamos de la referencia (y qué no)

**Sí:** la gramática del género, que un niño ya entiende sin explicación.
- Paleta plana y cielo azul (en estilo vectorial redondeado, no en pixel art: ver 3.6).
- Bloques «?» que se golpean desde abajo y sueltan algo.
- Ladrillos, tubos, nubes, colinas y arbustos de fondo.
- Un enemigo simple que patrulla el suelo.
- Un recorrido de izquierda a derecha con una meta.

**No:** personajes, nombres, música ni sprites de Nintendo. Todo se crea original (assets propios o con licencia libre tipo CC0 de Kenney.nl). La mecánica «bloque ? = misterio» es genérica; el fontanero, el goomba y el logo, no.

**Adaptación a 4-6 años:** sin vidas ni muerte, sin texto, sin precisión de milisegundos.

## 1. Propuesta educativa

### 1.1 Qué puede hacer un niño de 4 a 6 años (y qué no)
- No lee: toda instrucción es **voz + dibujo**. Nunca hay una palabra que haya que leer.
- No suma: no hay operaciones. Trabajamos lo que viene *antes* de sumar.
- Atención de 5 a 10 minutos: niveles de 1 a 2 minutos.
- Motricidad fina limitada: controles grandes y tolerantes.

### 1.2 Competencias (currículo base)
| Bloque | Habilidad | Ejemplo de prueba en el juego |
|---|---|---|
| **Cantidad** | Contar 1-5, luego 1-10; subitizar (ver «3» sin contar) | «Golpea el bloque con 3 puntos» |
| **Número** | Reconocer el símbolo 1-10 y asociarlo a la cantidad | Une el cartel «4» con la puerta de 4 puntos |
| **Comparar** | Más / menos / igual, grande / pequeño | «Coge el montón con más galletas» |
| **Patrones** | Continuar secuencias de color o forma (ABAB) | Completa 🔴🔵🔴❓ saltando al color correcto |
| **Formas y colores** | Círculo, cuadrado, triángulo; colores básicos | «Pisa solo los círculos» |
| **Letras (fase 2)** | Reconocer vocales y la letra inicial por *sonido* | «¿Con qué letra empieza SOL?» (se oye la voz) |

Primera versión: **Cantidad, Número y Patrones**. Esto permite validar el juego con una sola idea fuerte.

### 1.3 Cómo se enseña dentro de la acción
La respuesta se da **jugando**, no parando para un examen:
- **Bloques «?»**: contienen cantidades. Golpear el correcto suelta galletas y abre el camino.
- **Puertas/tubos**: piden una cantidad (puntos en el cartel). Se atraviesan al llevar esa cantidad.
- **Enemigo** (erizo, abeja): no mata. Tocarlo, también cayéndole encima, es un **pinchazo**: Rufo brinca hacia arriba y hacia atrás, parpadea 1 s protegido y **pierde una galleta del contador del nivel** (nunca baja de 0). No hay vidas, ni derrota, ni se pierde nada del total guardado, y las estrellas no cambian. Idea futura: «derrotar» saltando sobre el que lleva el patrón o la cantidad correcta.
- **Zonas de pinchos** (niveles 7 a 12): tramos de suelo de 1 baldosa (niveles 7–8) o de 1–2 (desde el 9), con conos morados redondeados de aspecto amable, que se saltan con un salto normal. Son fijas, están en el JSON del nivel y las pruebas comprueban que quedan lejos de la salida, la bandera, los bloques, los escalones, las plataformas y las otras zonas. Pisarlas es un **pinchazo** como el de un enemigo (−1 galleta del nivel, nunca bajo 0, sin tocar las estrellas), con su propio «¡uy!» suave: Rufo rebota hacia el lado por el que entró, aterriza fuera de la zona y parpadea 1 s protegido. El suelo sigue siendo continuo debajo: no hay hoyos ni caídas.
- **Fresa del modo invencible**: en cada nivel, un bloque «?» elegido al azar al entrar esconde una **fresa**. Al golpearlo da su galleta y suelta la fresa, que se posa junto al bloque (nunca sobre pinchos). Al comerla, Rufo brilla con destellos de colores durante **8 s** (el brillo acelera en los 2 últimos): atraviesa erizos y abejas y corre sobre los pinchos sin pincharse ni perder galletas.
- **Meta**: bandera al final, con celebración.

### 1.4 Pruebas y puntuación (sin presión)
- **Estrellas 1 a 3 por nivel**, según aciertos al primer intento. Nunca 0: terminar siempre da al menos 1.
- **Galletas** (con pepitas de chocolate): son el premio del juego; se ganan por acertar y se gastan en cosméticos del personaje (sombreros, colores).
- **Sin vidas ni «game over»**. Un fallo en una prueba = rebote suave + pista, y se reintenta. El único coste en el nivel es el pinchazo de un enemigo o de unos pinchos, que resta una galleta del nivel (nunca baja de 0, no toca el total guardado ni las estrellas).
- **Pistas progresivas**: 1.er fallo, la voz repite la consigna; 2.º, la respuesta correcta brilla; 3.º, la mascota la señala.
- **Prueba de la bandera** (hecha): al llegar a la bandera de cada nivel, una prueba corta de **3 preguntas**, con un tipo por nivel en el mundo 1: ¿Cuántos hay?, ¿Dónde hay más?, Sigue la serie, Caza de formas, Las letras de tu nombre y ¿Te acuerdas? (sobre lo que ha pasado en el nivel); los niveles 7 a 12 repiten esos tipos en el mismo orden hasta que tengan pruebas propias. Se adapta a la edad del perfil en tres franjas (3-4, 5-6 y 7-8) y se explica sin texto ni voz: con dibujos y con Lalo señalando. Cada pregunta tiene 3 intentos: tras el 1.er fallo, Lalo repite la demostración; tras el 2.º, da una pista propia de cada prueba; tras el 3.º, enseña la respuesta. Tocar a Lalo (que lleva una «?» amarilla) abre un bocadillo de cómic **para el adulto** con el objetivo de la prueba y una frase para guiar al niño; deja la pregunta en pausa sin gastar intentos y desde él se puede repetir la demostración. Se supera con 2 aciertos de 3. **No da estrellas** (siguen saliendo de los bloques «?»). Si no se supera, el nivel queda **pendiente** (amarillo en el mapa, sin estrellas) pero el siguiente se desbloquea; las galletas recogidas sí se suman. Detalle en `openspec/specs/flag-quiz/`.
- **Mini-prueba al final de cada mundo** (el «castillo»): 5 retos cortos mezclados. Da una **medalla**, no una nota.
- **Dificultad adaptativa** invisible: sube de rango tras 4-5 aciertos seguidos; baja tras 3 fallos.
- **Repaso espaciado**: lo fallado reaparece en niveles posteriores con otro disfraz.

### 1.5 Estructura
- **4 mundos** (v1: 1 mundo completo de **12 niveles**).
- Cada nivel = un recorrido corto con 3 a 5 retos y una meta, donde espera la prueba de la bandera.
- Mundo 1: los niveles 1 a 6 duran de 1 a 2 min con calma; los niveles 7 a 12 son más largos (de 1,5 a 2,5 min), con más bloques, escalones, plataformas y enemigos, y añaden las zonas de pinchos. Cada nivel tiene su ambiente: prado, flores, bosque, otoño, atardecer, noche, playa, selva, montaña, nieve, desierto y nubes con arcoíris.
- **Mapa del mundo**: un camino de 12 niveles más ancho que la pantalla, que se desplaza en horizontal arrastrando o con flechas grandes a los lados y se abre centrado en el nivel actual. El contador de galletas, Lalo, mi personaje y el selector de mundos quedan fijos. La bandera de final de mundo está en el nivel 12.
- Mundo 1: *Colina de los números* (1-5). Mundo 2: 1-10. Mundo 3: patrones y formas. Mundo 4: letras.

## 2. Propuesta de interfaz y control (móvil táctil)

- **Horizontal fijo**, 720 px lógicos de alto y ancho adaptado a la pantalla (de 4:3 a 21:9), sin bandas.
- **Dos controles** (zonas grandes ≥ 96 px):
  - Izquierda: **mover** con botón de flecha derecha «mantener para andar» (solo se avanza; no hace falta retroceder).
  - Derecha: **saltar** (botón enorme).
- **Opción «autoavance»** (recomendada por defecto a los 4 años): el personaje avanza solo; el niño solo salta. Se cambia en el panel de padres.
- **Salto tolerante**: *coyote time* y *input buffer* para que un toque un poco tarde o pronto funcione.
- **HUD sin texto**: icono de la misión (dibujo + altavoz para repetir la voz), estrellas y galletas con iconos.
- **Mascota** que habla y señala (voz grabada), en lugar de texto.
- **Accesibilidad**: contraste alto, no depender solo del color, volumen separado de música/voz, sin parpadeos fuertes.
- **Candado de adulto** para ajustes: «mantén pulsado 3 s» (sin pedir leer números).

## 3. Propuesta técnica

### 3.1 Stack
| Capa | Elección | Por qué |
|---|---|---|
| Motor | **Phaser 3** + **TypeScript** | Plataformas 2D, físicas arcade, tilemaps, audio, táctil. El más probado en web. |
| Build | **Vite** | Arranque rápido, `base` simple para Hosting. |
| Niveles | **Tiled** (JSON) | Editor visual gratuito; Phaser lo carga directo. |
| Arte | SVG propios en estilo vectorial plano y redondeado; tipografía Baloo 2 (OFL) local | Sale del lienzo de diseño, se ve nítido a cualquier tamaño y atrae más a 4-6 años. |
| Estado de UI | Capa propia ligera (Phaser scenes) | No hace falta framework web para un juego. |
| Hosting | **Firebase Hosting** | Ya decidido; CDN, HTTPS, PWA. |
| Auth | **Firebase Auth** | Ver 3.3. |
| Datos | **Firestore** | Perfiles, progreso, ajustes. |
| Medición | **Firebase Analytics** (opcional) | Dónde se atasca, qué se repite. |
| PWA | `vite-plugin-pwa` (Workbox) | Instalable en iPad/Android, juega sin conexión. |
| Pruebas | **Vitest** (lógica) + **Playwright** (humo) | La lógica educativa se testea sin Phaser. |

Versiones: Node 24 y npm 12 ya están instalados; `firebase-tools` 15.30 también.

### 3.2 Arquitectura (la lógica pedagógica separada del motor)
```
juegoRafa/
├── src/
│   ├── game/                  Phaser: escenas, sprites, físicas
│   │   ├── scenes/            Boot, Menu, WorldMap, Level, Reward, Parents
│   │   ├── entities/          Player, Enemy, QuestionBlock, Door
│   │   └── ui/                HUD, botones táctiles, mascota
│   ├── learning/              TypeScript puro, sin Phaser ni Firebase
│   │   ├── challenges/        generadores: contar, número, patrón, forma
│   │   ├── adaptive.ts        sube/baja dificultad por habilidad
│   │   ├── scoring.ts         estrellas, galletas, medallas
│   │   └── spaced-review.ts   qué repetir y cuándo
│   ├── data/                  Repositorios (Firebase): progreso, perfiles
│   ├── i18n/                  claves de audio por idioma (es, va)
│   └── main.ts
├── public/
│   ├── assets/{sprites,tilemaps,audio/{es,va},music}
│   └── manifest.webmanifest
├── content/                   niveles y retos en JSON (editable sin código)
├── firebase.json  firestore.rules  .firebaserc
└── docs/
```
Regla: `learning/` no importa `phaser` ni `firebase`. Se prueba con Vitest, sin navegador.

**Retos como datos:** un nivel declara `{ habilidad: "cantidad", rango: [1,5], tipo: "bloques", n: 4 }` y `learning/challenges` genera el reto concreto. Añadir contenido no requiere tocar el motor.

### 3.3 Autenticación (niños pequeños, sin fricción)
- **Primer arranque: Auth anónima.** Cero formularios; el niño juega ya y el progreso se guarda.
- **Cuenta de padre/madre opcional** (email por enlace, sin contraseña) para **vincular** el progreso (`linkWithCredential`) y no perderlo al cambiar de tablet o limpiar el navegador.
- **Varios niños por familia**: un perfil por niño (nombre o avatar), no un usuario por niño.
- **Privacidad:** no se recoge nada del menor más allá de progreso y avatar. Esto importa por RGPD y el artículo 8 (menores de 14 años en España) → ver 5.
- **Perfil local (implementado):** la pantalla de bienvenida pide un alias (puede ser un apodo, no hace falta el nombre real) y una edad; con ellos se crea el id del perfil (`alias-edad`, p. ej. `lucia-5`) y el progreso se guarda en el `localStorage` del navegador. Mientras no exista Firebase, alias y edad no salen del dispositivo; al sincronizar (fase 3) habrá que revisarlo con el consentimiento del tutor.

### 3.4 Modelo de datos (Firestore)
```
families/{uid}                       uid del padre/madre (o anónimo)
  settings:   { idioma, limiteDiarioMin, autoavance, mundos[] }
  children/{childId}
    profile:  { alias, avatar, cosmeticos: { sombrero, color } , galletas }
    skills/{skillId}                 { nivelActual, racha, aciertos, fallos, ultimaVez }
    levels/{levelId}                 { estrellas, mejorTiempo, intentos }
    sessions/{date}                  { minutos, nivelesJugados }
    reviewQueue/{itemId}             { habilidad, valor, proximaRevision }
```
Reglas de seguridad: solo el `uid` dueño lee/escribe `families/{uid}/**`. Sin lecturas públicas.

**Modo sin conexión:** Firestore con persistencia local + cola de escritura. Se juega en el coche y se sincroniza después.

### 3.5 Audio y voz
- Las instrucciones son **audios pregrabados** (es y va), no `speechSynthesis`: el niño reconoce la misma voz siempre y no depende de las voces del dispositivo.
- Origen: grabarlos tú mismo (más motivador) o generarlos una vez con TTS y revisarlos.
- Claves por frase: `reto.cantidad.3`, `ayuda.1`, `celebra.2`… se cargan por idioma.
- iOS no reproduce audio sin un primer toque → pantalla inicial «toca para jugar».
- Música y efectos con **Web Audio** (Phaser), con tres controles de volumen: música, efectos, voz.

### 3.6 Rendimiento en móvil
- SVG rasterizados una vez al tamaño de uso y 720 px lógicos de alto: nítido y ligero también en tablets antiguas.
- Texture atlas por mundo, carga diferida por escena.
- Objetivo: 60 fps, primera carga < 3 MB, shell offline con service worker.
- Bloqueo de zoom, selección de texto y *pull-to-refresh*; `screen.orientation.lock('landscape')` donde exista, con aviso visual de «gira el móvil» donde no.

### 3.7 Calidad y entrega
- CI con GitHub Actions: `lint`, `vitest`, build, despliegue a un **canal de vista previa de Hosting** en cada PR.
- Entornos: `dev` y `prod` como proyectos Firebase separados.
- Emuladores de Firebase (Auth, Firestore) para desarrollo y pruebas.

## 4. Hoja de ruta

| Fase | Entregable | Validación |
|---|---|---|
| **0. Esqueleto** | Vite + Phaser + TS, Hosting desplegado, PWA, controles táctiles | Corre en tu móvil |
| **1. Prototipo jugable** | Personaje, un nivel con bloques «?» y bandera, salto con tolerancia | Tu hijo juega 2 min sin ayuda |
| **2. Primer reto** | Bloques con cantidades, voz, pistas, estrellas | ¿Entiende la consigna sin leer? |
| **3. Núcleo** | Auth anónima, progreso en Firestore, adaptación | Retomar donde lo dejó |
| **4. Mundo 1 completo** | 12 niveles (los 7–12 con pinchos), mapa que se desplaza, galletas, cosméticos, prueba final | Sesiones de 10 min |
| **5. Padres** | Candado, panel, límite de tiempo, idioma | Lo configuras tú |
| **6. Ampliar** | Mundos 2 a 4, letras, formas | — |

La fase 1 y 2 deciden si el juego funciona. Se prueba con él lo antes posible.

## 5. Riesgos y decisiones abiertas

1. **RGPD / menores:** un servicio dirigido a niños de 4 a 6 años exige cuidado si se publica fuera del entorno familiar (consentimiento del tutor, política de privacidad, sin publicidad ni analítica con identificadores personales). Para uso familiar privado el riesgo es bajo; si se abre al público, hay que revisarlo antes.
2. **Control en el iPad:** la mayor causa de abandono. Se mitiga con autoavance y salto tolerante, y se valida en la fase 1.
3. **Que parezca examen:** si la pregunta interrumpe la acción, el niño lo nota. Cada reto debe ser un obstáculo del nivel, no una pantalla aparte.
4. **Voz:** grabar tú los audios es lo más cálido, pero cuesta horas. Alternativa: TTS y revisión.
5. **Escala de contenido:** el cuello de botella no es el código, es crear niveles y audios. Por eso el contenido va en JSON.

## 6. Decisiones tomadas

1. **Personaje:** al niño le gusta Mario Bros. Como se va a **publicar**, no se pueden usar Mario ni sus assets (propiedad de Nintendo). Se crea un **personaje original**: el **zorro Rufo** del lienzo de diseño, con gorros que se compran con galletas. Le acompaña **Lalo el búho**, mascota guía que dará las consignas con voz en la fase 2. Para uso privado en casa, un *skin* de Mario es un asunto distinto, pero no entra en el repositorio publicado.
2. **Control manual** de movimiento (izquierda, derecha, saltar). El autoavance se queda como opción en el panel de padres.
3. **Idiomas de voz:** español e inglés. Las claves de audio van por idioma (`audio/es`, `audio/en`).
4. **Se publicará.** Hay que cumplir normativa de menores desde el principio (ver 7).
5. **Voz generada (TTS):** se genera una vez por frase e idioma, se revisa y se guarda como archivo estático.

## 7. Requisitos por publicar (menores de edad)

- **Sin publicidad** ni analítica con identificadores personales. Analytics solo con datos agregados, o desactivada.
- **Consentimiento verificable del tutor** antes de guardar datos del niño (RGPD, art. 8 en España: menores de 14; COPPA en EE. UU. al ofrecerlo en inglés: menores de 13). La cuenta es del adulto; el niño solo tiene un perfil con alias y avatar.
- **Política de privacidad** clara, con derecho a borrar todos los datos desde el panel de padres.
- **Datos mínimos:** alias (puede ser un apodo), edad, avatar y progreso. Nada de nombre real obligatorio, foto, ubicación ni audio. Hoy alias y edad solo viven en el `localStorage` del dispositivo.
- **Sin enlaces externos ni chat** dentro del juego infantil.
- **Licencias de todos los assets** documentadas (arte, música, efectos, voces TTS: revisar términos del proveedor para uso comercial).
- **Tiendas:** si se publica en App Store o Google Play (no solo web), exigen cumplir sus políticas para apps infantiles.
