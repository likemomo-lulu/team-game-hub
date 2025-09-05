import React from "react";
import styles from "./index.module.scss";

// 游戏标题组件的属性接口
interface GameTitleProps {
  // 游戏名称
  title: string;
  // 可选的副标题
  subtitle?: string;
  // 自定义样式类名
  className?: string;
}

/**
 * 游戏标题通用组件
 * 用于在各个游戏页面顶部显示游戏名称
 */
const GameTitle: React.FC<GameTitleProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`${styles.gameTitle} ${className}`}>
      <h1 className={styles.title}>当前游戏：{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default GameTitle;
