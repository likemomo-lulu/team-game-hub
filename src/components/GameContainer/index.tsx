import { ReactNode } from "react";
import styles from "./index.module.scss";

const GameContainer = ({ children }: { children: ReactNode }) => {
  return <div className={styles.gameContainer}>{children}</div>;
};

export default GameContainer;
