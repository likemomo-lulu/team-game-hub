import React from "react";
import { Card } from "antd";
import styles from "./index.module.scss";

interface GameQuestionCardProps {
  /** 题目内容 */
  content: string;
  /** 占位符文本，当content为空时显示 */
  placeholder?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 字体大小，支持预设值或自定义 */
  fontSize?: "small" | "medium" | "large" | "extra-large" | number;
  /** 最小高度 */
  minHeight?: number;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

const GameQuestionCard: React.FC<GameQuestionCardProps> = ({
  content,
  placeholder = "点击开始游戏",
  className,
  fontSize = "large",
  minHeight = 200,
  loading = false,
  onClick,
}) => {
  // 字体大小映射
  const getFontSize = () => {
    if (typeof fontSize === "number") {
      return `${fontSize}px`;
    }

    const sizeMap = {
      small: "24px",
      medium: "36px",
      large: "60px",
      "extra-large": "72px",
    };

    return sizeMap[fontSize] || sizeMap.large;
  };

  const cardClassName = `${styles.questionCard} ${className || ""}`;

  const contentStyle = {
    fontSize: getFontSize(),
    minHeight: `${minHeight}px`,
  };

  return (
    <Card
      className={cardClassName}
      loading={loading}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className={styles.questionContent} style={contentStyle}>
        {content || placeholder}
      </div>
    </Card>
  );
};

export default GameQuestionCard;
