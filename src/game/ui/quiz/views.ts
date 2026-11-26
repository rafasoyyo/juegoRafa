import type { QuizKind } from '../../../learning/quiz/types';
import { BalanceView } from './balance-view';
import { CableCarView } from './cable-car-view';
import { FingersView } from './fingers-view';
import { MemoryView } from './memory-view';
import { MirrorView } from './mirror-view';
import { NumberLineView } from './number-line-view';
import { OrderView } from './order-view';
import { ShareView } from './share-view';
import { TenFrameView } from './ten-frame-view';
import { TracksView } from './tracks-view';
import type { QuizView, ViewHost } from './view';

/** La vista de las pruebas nuevas; `null` para las seis antiguas, que `QuizScene` dibuja ella misma. */
export function createView(kind: QuizKind, host: ViewHost): QuizView | null {
  switch (kind) {
    case 'share':
      return new ShareView(host);
    case 'order':
      return new OrderView(host);
    case 'cable-car':
      return new CableCarView(host);
    case 'tracks':
      return new TracksView(host);
    case 'balance':
      return new BalanceView(host);
    case 'mirror':
      return new MirrorView(host);
    case 'fingers':
      return new FingersView(host);
    case 'ten-frame':
      return new TenFrameView(host);
    case 'memory':
      return new MemoryView(host);
    case 'number-line':
      return new NumberLineView(host);
    default:
      return null;
  }
}
