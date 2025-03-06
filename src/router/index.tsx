import { createHashRouter } from 'react-router-dom';
import Home from '../pages/Home';
import TruthOrDare from '../pages/TruthOrDare';
import GuessWord from '../pages/GuessWord';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/truth-or-dare',
    element: <TruthOrDare />,
  },
  {
    path: '/guess-word',
    element: <GuessWord />,
  },
]);

export default router;