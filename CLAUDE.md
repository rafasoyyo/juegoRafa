@AGENTS.md

# Notas para Claude Code

- Responde y escribe en español, igual que el código y las specs del proyecto.
- Para cambios de comportamiento usa las skills `openspec-*` (están en `.claude/skills/`, enlazadas a `.agents/skills/`). Si el cambio es pequeño, impleméntalo directamente.
- Verifica antes de dar algo por hecho: `npm test` y `npm run build`. Para cambios visuales o táctiles, `npm run dev` y comprobación en un viewport de móvil horizontal (p. ej. 844×390).
- Cuando una spec de `openspec/specs/` discrepe del código, no la «arregles» a ciegas: pregunta cuál manda. Hay restos antiguos (p. ej. «pixel art» en `platformer-level`) frente al estilo vectorial actual de `visual-style`.
- No hagas commit ni `npm run deploy` sin que se te pida: el despliegue publica en Firebase Hosting.
