import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import TruthOrDare from '../pages/TruthOrDare';
import GuessWord from '../pages/GuessWord';

const router = createBrowserRouter([
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
], {
  basename: '/team-game-hub'
});

export default router;