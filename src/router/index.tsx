import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import TruthOrDare from "../pages/Games/TruthOrDare";
import GuessBySpeak from "../pages/Games/GuessBySpeak";
import GuessByAction from "../pages/Games/GuessByAction";
import AddWordGame from "../pages/Games/AddWordGame";
import Relay from "../pages/Games/Relay";
import RiddleGame from "../pages/Games/RiddleGame";
import Teams from "../pages/Teams";
import BrainTeaserGame from "../pages/Games/BrainTeaserGame";

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
    path: "/riddle-game",
    element: <RiddleGame />,
  },
  {
    path: "/brain-teaser-game",
    element: <BrainTeaserGame />,
  },
  {
    path: "/teams",
    element: <Teams />,
  },
]);

export default router;
