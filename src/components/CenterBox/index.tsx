import { ReactNode } from "react";
import styles from "./index.module.scss";

const CenterBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.centerBox}>{children}</div>;
};

export default CenterBox;
