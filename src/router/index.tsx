import { createHashRouter } from 'react-router-dom';
import Home from '../pages/Home';
import TruthOrDare from '../pages/TruthOrDare';
import GuessWord from '../pages/GuessWord';
import AddWord from '../pages/AddWord';
import Teams from '../pages/Teams';

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
  {
    path: '/add-word',
    element: <AddWord />,
  },
  {
    path: '/teams',
    element: <Teams />,
  },
]);

export default router;