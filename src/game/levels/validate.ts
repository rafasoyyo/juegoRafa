/**
 * Reglas de diseño de un recorrido: todo se alcanza con un salto normal, nada atrapa, nada queda bajo
 * el HUD y no hay tramos vacíos. TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 *
 * «Nada atrapa» se cumple por construcción si estas reglas pasan: el suelo es continuo, las
 * plataformas son de un solo sentido, toda subida cabe en un salto y los únicos techos sólidos son
 * los bloques, que dejan hueco para estar de pie debajo y a sus lados.
 */

import { flagTile, surfaces, surfacesUnder, toWorld } from './parse';
import { jumpReach } from './spikes';
import { challengeZone, GROUND_TOP, RUN_SPEED, START_TILE, STEP_RISE, TILE, type LevelData } from './types';

/** Constantes de las reglas (px salvo que se diga otra cosa). */
export const RULES = {
  /** Subida máxima entre superficies: 2 peldaños o 1,5 baldosas (el salto levanta los pies ~193 px). */
  maxRise: 126,
  /** Peldaños que puede tener un escalón. */
  stepHeights: [1, 2] as readonly number[],
  /** Altura mínima de una plataforma sobre lo que tiene debajo, en baldosas. */
  minPlatformHeight: 1,
  /** Anchos mínimos, en baldosas. */
  minPlatformWidth: 3,
  minStepWidth: 2,
  /** La cabeza del zorro alcanza un bloque cuya base esté a lo sumo a esta altura sobre la superficie. */
  maxHeadReach: 198,
  /** Hueco mínimo bajo un bloque para estar de pie (el zorro mide 87 px). */
  minStandGap: 120,
  /** Margen a cada lado del bloque donde también se exige ese hueco (medio zorro y algo más), en baldosas. */
  standMargin: 0.5,
  /** Nada puede asomar por encima de esta `y`: ahí está el HUD. */
  hudBottom: 150,
  /** Hueco entre escalones: 0 (forman escalera) o al menos esto, en baldosas. */
  minStepGap: 2,
  /** Baldosas llanas y vacías tras la salida y antes de la bandera. */
  startClear: 6,
  flagClear: 5,
  /** Máximo de baldosas seguidas sin ningún elemento: 8 s corriendo a tope. */
  maxEmpty: (8 * RUN_SPEED) / TILE,
  /** Separación mínima entre los centros de dos bloques, en baldosas. */
  minBlockSpacing: 1,
  /** Zonas de pinchos: ancho (baldosas) y distancias mínimas a la salida y la bandera, a bloques, escalones y plataformas y entre zonas. */
  spikeWidth: { min: 1, max: 2 },
  spikeStartClear: 10,
  spikeFlagClear: 10,
  spikeClear: 2,
  spikeGap: 6,
  /** Margen para despegar y para aterrizar a cada lado de una zona, en baldosas. */
  spikeTakeoff: 0.5,
  /** Lo que recorre un salto normal, en baldosas. */
  jumpReach: jumpReach() / TILE,
};

export type Rules = typeof RULES;

interface Span {
  name: string;
  from: number;
  to: number;
}

/** Número sin decimales sobrantes para los mensajes. */
function n(v: number): string {
  return String(Math.round(v * 100) / 100);
}

/** Devuelve la lista de reglas que el nivel no cumple; vacía si es válido. Cada error nombra el nivel y el elemento. */
export function validateLevel(level: LevelData, rules: Rules = RULES): string[] {
  const errors: string[] = [];
  const err = (where: string, problem: string): void => {
    errors.push(`${level.id}: ${where} ${problem}`);
  };
  const all = surfaces(level);
  const world = toWorld(level);
  const start = START_TILE;
  const flag = flagTile(level);

  // Subidas y tamaños.
  level.steps.forEach((s, i) => {
    if (!rules.stepHeights.includes(s.height)) err(`steps[${i}]`, `tiene ${n(s.height)} peldaños (debe tener ${rules.stepHeights.join(' o ')})`);
    if (s.height * STEP_RISE > rules.maxRise) err(`steps[${i}]`, `sube ${n(s.height * STEP_RISE)} px desde el suelo (máximo ${rules.maxRise})`);
    if (s.width < rules.minStepWidth) err(`steps[${i}]`, `mide ${n(s.width)} baldosas (mínimo ${rules.minStepWidth})`);
  });
  level.platforms.forEach((p, i) => {
    if (p.height * TILE > rules.maxRise) err(`platforms[${i}]`, `está ${n(p.height * TILE)} px sobre lo de debajo (máximo ${rules.maxRise})`);
    if (p.height < rules.minPlatformHeight) err(`platforms[${i}]`, `está a ${n(p.height)} baldosas (mínimo ${rules.minPlatformHeight})`);
    if (p.width < rules.minPlatformWidth) err(`platforms[${i}]`, `mide ${n(p.width)} baldosas (mínimo ${rules.minPlatformWidth})`);
  });

  // Escalones: separados al menos `minStepGap` o pegados formando escalera (con alturas distintas).
  const steps = level.steps.map((s, i) => ({ ...s, i })).sort((a, b) => a.x - b.x);
  for (let k = 1; k < steps.length; k++) {
    const a = steps[k - 1]!;
    const b = steps[k]!;
    const gap = b.x - (a.x + a.width);
    if (gap < 0) continue; // solape: lo informa la regla de solapes
    if (gap > 0 && gap < rules.minStepGap) err(`steps[${b.i}]`, `deja un hueco de ${n(gap)} baldosas con steps[${a.i}] (0 o al menos ${rules.minStepGap})`);
    if (gap === 0 && a.height === b.height) err(`steps[${b.i}]`, `está pegado a steps[${a.i}] con la misma altura (deben ser un solo escalón)`);
  }

  // Bloques: alcance de la cabeza, hueco para estar de pie y `on`.
  world.blocks.forEach((wb, i) => {
    const b = level.blocks[i]!;
    const base = GROUND_TOP - wb.bottom;
    if (base - wb.surfaceHeight > rules.maxHeadReach) {
      err(`blocks[${i}]`, `tiene la base ${n(base - wb.surfaceHeight)} px sobre la superficie (la cabeza llega a ${rules.maxHeadReach})`);
    }
    const near = surfacesUnder(all, b.x - 0.5 - rules.standMargin, b.x + 0.5 + rules.standMargin);
    for (const s of near) {
      if (base - s.height < rules.minStandGap) {
        const what = s.kind === 'ground' ? 'el suelo' : `${s.kind === 'step' ? 'steps' : 'platforms'}[${s.index}]`;
        err(`blocks[${i}]`, `deja ${n(base - s.height)} px sobre ${what} (mínimo ${rules.minStandGap} para estar de pie)`);
      }
    }
    if (b.on !== undefined && b.on !== wb.surface) err(`blocks[${i}]`, `dice estar sobre «${b.on}» pero está sobre «${wb.surface}»`);
  });

  // Nada bajo el HUD.
  const tooHigh = (where: string, topY: number): void => {
    if (topY < rules.hudBottom) err(where, `asoma hasta y = ${n(topY)}, bajo el HUD (mínimo ${rules.hudBottom})`);
  };
  world.blocks.forEach((b, i) => tooHigh(`blocks[${i}]`, b.bottom - TILE));
  world.platforms.forEach((p, i) => tooHigh(`platforms[${i}]`, p.top));
  world.steps.forEach((s, i) => tooHigh(`steps[${i}]`, s.top));

  // Límites, salida y bandera.
  const spans: Span[] = [
    ...level.steps.map((s, i) => ({ name: `steps[${i}]`, from: s.x, to: s.x + s.width })),
    ...level.platforms.map((p, i) => ({ name: `platforms[${i}]`, from: p.x, to: p.x + p.width })),
    ...level.blocks.map((b, i) => ({ name: `blocks[${i}]`, from: b.x - 0.5, to: b.x + 0.5 })),
  ];
  for (const s of spans) {
    if (s.from < start || s.to > flag) {
      err(s.name, `está fuera del recorrido (${s.to > flag ? 'más allá de la bandera' : 'antes de la salida'})`);
    } else if (s.from < start + rules.startClear) {
      err(s.name, `está a menos de ${rules.startClear} baldosas de la salida`);
    } else if (s.to > flag - rules.flagClear) {
      err(s.name, `está a menos de ${rules.flagClear} baldosas de la bandera`);
    }
  }

  // Solapes.
  const overlapping = (list: Span[]): void => {
    for (let a = 0; a < list.length; a++) {
      for (let b = a + 1; b < list.length; b++) {
        if (list[a]!.from < list[b]!.to && list[b]!.from < list[a]!.to) err(list[b]!.name, `se solapa con ${list[a]!.name}`);
      }
    }
  };
  overlapping(spans.filter((s) => s.name.startsWith('steps')));
  overlapping(spans.filter((s) => s.name.startsWith('platforms')));
  level.blocks.forEach((b, i) => {
    level.blocks.forEach((o, j) => {
      if (j > i && Math.abs(b.x - o.x) < rules.minBlockSpacing) err(`blocks[${j}]`, `se solapa con blocks[${i}]`);
    });
  });
  // Pinchos: solo en el suelo, saltables y lejos de todo.
  const spikes = level.spikes.map((z, i) => ({ name: `spikes[${i}]`, from: z.x, to: z.x + z.width }));
  for (const z of spikes) {
    const width = z.to - z.from;
    if (width < rules.spikeWidth.min || width > rules.spikeWidth.max) {
      err(z.name, `mide ${n(width)} baldosas (entre ${rules.spikeWidth.min} y ${rules.spikeWidth.max})`);
    }
    if (width + 2 * rules.spikeTakeoff > rules.jumpReach) {
      err(z.name, `no se cruza con un salto normal: mide ${n(width)} baldosas más ${n(2 * rules.spikeTakeoff)} de margen y el salto recorre ${n(rules.jumpReach)}`);
    }
    if (z.from < start || z.to > flag) {
      err(z.name, `está fuera del recorrido (${z.to > flag ? 'más allá de la bandera' : 'antes de la salida'})`);
    } else if (z.from < start + rules.spikeStartClear) {
      err(z.name, `está a menos de ${rules.spikeStartClear} baldosas de la salida`);
    } else if (z.to > flag - rules.spikeFlagClear) {
      err(z.name, `está a menos de ${rules.spikeFlagClear} baldosas de la bandera`);
    }
    level.steps.forEach((st, i) => {
      if (z.from < st.x + st.width && st.x < z.to) err(z.name, `está sobre steps[${i}] (solo puede ir en el suelo)`);
      else if (z.from < st.x + st.width + rules.spikeClear && st.x - rules.spikeClear < z.to) err(z.name, `está a menos de ${rules.spikeClear} baldosas de steps[${i}]`);
    });
    level.platforms.forEach((p, i) => {
      if (z.from < p.x + p.width && p.x < z.to) err(z.name, `está bajo platforms[${i}]`);
      else if (z.from < p.x + p.width + rules.spikeClear && p.x - rules.spikeClear < z.to) err(z.name, `está a menos de ${rules.spikeClear} baldosas de platforms[${i}]`);
    });
    level.blocks.forEach((b, i) => {
      if (b.x > z.from - rules.spikeClear && b.x < z.to + rules.spikeClear) err(z.name, `está a menos de ${rules.spikeClear} baldosas de blocks[${i}]`);
    });
  }
  const byX = [...spikes].sort((a, b) => a.from - b.from);
  for (let k = 1; k < byX.length; k++) {
    const gap = byX[k]!.from - byX[k - 1]!.to;
    if (gap < rules.spikeGap) err(byX[k]!.name, `deja ${n(gap)} baldosas con ${byX[k - 1]!.name} (mínimo ${rules.spikeGap})`);
  }

  // Retos: sobre el suelo llano y sin nada más en su zona, dentro del recorrido y sin solaparse.
  const challenges = level.challenges.map((c, i) => ({ name: `challenges[${i}]`, ...challengeZone(c) }));
  for (const c of challenges) {
    if (c.from < start + rules.startClear || c.to > flag - rules.flagClear) {
      err(c.name, `no cabe entre la salida y la bandera (necesita de ${n(c.from)} a ${n(c.to)} con ${rules.startClear} y ${rules.flagClear} baldosas libres)`);
    }
    for (const o of [...spans, ...spikes]) {
      if (c.from < o.to && o.from < c.to) err(c.name, `tiene ${o.name} en su zona (debe ser suelo llano y libre)`);
    }
  }
  overlapping(challenges);

  // Densidad: nunca más de `maxEmpty` baldosas sin ningún elemento (los pinchos y los retos cuentan).
  let cursor = start;
  let prev = 'la salida';
  for (const s of [...spans, ...spikes, ...challenges].sort((a, b) => a.from - b.from)) {
    if (s.from - cursor > rules.maxEmpty) err(s.name, `queda a ${n(s.from - cursor)} baldosas vacías de ${prev} (máximo ${n(rules.maxEmpty)})`);
    if (s.to > cursor) {
      cursor = s.to;
      prev = s.name;
    }
  }
  if (flag - cursor > rules.maxEmpty) err('la bandera', `queda a ${n(flag - cursor)} baldosas vacías de ${prev} (máximo ${n(rules.maxEmpty)})`);

  return errors;
}
