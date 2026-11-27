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

/** La vista de las pruebas nuevas; `null` para las seis antiguas, que `QuizScene` dibuja ella misma. */
export function createView(kind: QuizKind, host: ViewHost): QuizView | null {
  switch (kind) {
    case 'share':
      return new ShareView(host);
    case 'order':
    case 'boats':
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
    case 'ten-friends':
      return new TenFrameView(host);
    case 'train':
      return new TrainView(host);
    case 'socks':
      return new SocksView(host);
    case 'memory':
      return new MemoryView(host);
    case 'number-line':
    case 'frog-jumps':
      return new NumberLineView(host);
    default:
      return null;
  }
}
