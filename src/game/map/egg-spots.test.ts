import { describe, expect, it } from 'vitest';
import { completeLevel, createGameState, worldProgress } from '../state';
import { EGG_SPOTS, eggSpot, insideEgg, SPOT_SERIES } from './egg-spots';
import { paintedBands } from './rainbow-arc';

const ISLA = { id: 'isla', levelCount: 12 } as const;

describe('el huevo del mapa', () => {
  it('tiene 12 manchas dentro del huevo y sin tocarse', () => {
    expect(EGG_SPOTS).toHaveLength(12);
    for (const s of EGG_SPOTS) {
      for (const [dx, dy] of [[s.r, 0], [-s.r, 0], [0, s.r], [0, -s.r]] as const) expect(insideEgg(s.x + dx, s.y + dy)).toBe(true);
    }
    EGG_SPOTS.forEach((a, i) =>
      EGG_SPOTS.slice(i + 1).forEach((b) => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(a.r + b.r)),
    );
  });

  it('las manchas siguen un patrón: de abajo arriba y los colores en serie', () => {
    EGG_SPOTS.forEach((s, i) => expect(s.color).toBe(SPOT_SERIES[i % 3]));
    for (let i = 4; i < 12; i++) expect(EGG_SPOTS[i]!.y).toBeLessThan(EGG_SPOTS[i - 4]!.y);
    expect(eggSpot(1)).toBe(EGG_SPOTS[0]);
    expect(eggSpot(13)).toBeUndefined();
  });

  it('manchas pintadas: ninguna, una pendiente o las 12', () => {
    const state = createGameState();
    expect(paintedBands(state, ISLA)).toEqual([]);
    worldProgress(state, 'isla').pending.add(1);
    expect(paintedBands(state, ISLA)).toEqual([1]);
    for (let l = 1; l <= 12; l++) completeLevel(state, 'isla', l, 3, 0);
    expect(paintedBands(state, ISLA)).toHaveLength(12);
  });
});
