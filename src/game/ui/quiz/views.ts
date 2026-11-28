import type { QuizKind } from '../../../learning/quiz/types';
import { BalanceView } from './balance-view';
import { CableCarView } from './cable-car-view';
import { FingersView } from './fingers-view';
import { MemoryView } from './memory-view';
import { MirrorView } from './mirror-view';
import { NumberLineView } from './number-line-view';
import { OrderView } from './order-view';
import { ShareView } from './share-view';
import { SocksView } from './socks-view';
import { TenFrameView } from './ten-frame-view';
import { TracksView } from './tracks-view';
import { TrainView } from './train-view';
import type { QuizView, ViewHost } from './view';

/**
 * Vista propia de cada tipo de prueba que la tiene (spec `world-isolation`: una entrada por tipo). Las que
 * no están aquí las dibuja `QuizScene` con sus piezas comunes.
 */
const QUIZ_VIEWS: Readonly<Partial<Record<QuizKind, (host: ViewHost) => QuizView>>> = {
  share: (host) => new ShareView(host),
  order: (host) => new OrderView(host),
  boats: (host) => new OrderView(host),
  'cable-car': (host) => new CableCarView(host),
  tracks: (host) => new TracksView(host),
  balance: (host) => new BalanceView(host),
  mirror: (host) => new MirrorView(host),
  fingers: (host) => new FingersView(host),
  'ten-frame': (host) => new TenFrameView(host),
  'ten-friends': (host) => new TenFrameView(host),
  train: (host) => new TrainView(host),
  socks: (host) => new SocksView(host),
  memory: (host) => new MemoryView(host),
  'number-line': (host) => new NumberLineView(host),
  'frog-jumps': (host) => new NumberLineView(host),
};

/** La vista propia del tipo de prueba; `null` si `QuizScene` la dibuja ella misma. */
export function createView(kind: QuizKind, host: ViewHost): QuizView | null {
  return QUIZ_VIEWS[kind]?.(host) ?? null;
}
