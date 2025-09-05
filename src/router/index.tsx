import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import TruthOrDare from "../pages/Games/TruthOrDare";
import GuessBySpeak from "../pages/Games/GuessBySpeak";
import GuessByAction from "../pages/Games/GuessByAction";
import AddWordGame from "../pages/Games/AddWordGame";
import Relay from "../pages/Games/Relay";
import Teams from "../pages/Teams";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/truth-or-dare",
    element: <TruthOrDare />,
  },
  {
    path: "/speak-guess",
    element: <GuessBySpeak />,
  },
  {
    path: "/action-guess",
    element: <GuessByAction />,
  },
  {
    path: "/add-word-game",
    element: <AddWordGame />,
  },
  {
    path: "/relay",
    element: <Relay />,
  },
  {
    path: "/teams",
    element: <Teams />,
  },
]);

export default router;
