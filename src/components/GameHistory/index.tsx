import React from "react";
import { Drawer, List, Button, Space } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

// 历史记录项接口
interface HistoryItem {
  /** 记录内容 */
  content?: string;
  /** 记录类型（用于TruthOrDare等游戏） */
  type?: string;
  /** 词语（用于猜词游戏） */
  word?: string;
  /** 其他自定义字段 */
  [key: string]: any;
}

// 组件属性接口
interface GameHistoryProps {
  /** 是否显示历史记录抽屉 */
  visible: boolean;
  /** 关闭抽屉的回调 */
  onClose: () => void;
  /** 历史记录数据 */
  history: HistoryItem[];
  /** 抽屉标题 */
  title?: string;
  /** 是否显示重置按钮 */
  showResetButton?: boolean;
  /** 重置历史记录的回调 */
  onReset?: () => void;
  /** 自定义渲染历史记录项 */
  renderItem?: (item: HistoryItem, index: number) => React.ReactNode;
  /** 历史记录类型，用于默认渲染 */
  historyType?: "simple" | "word" | "truthOrDare";
  /** 抽屉位置 */
  placement?: "left" | "right" | "top" | "bottom";
  /** 抽屉宽度 */
  width?: number | string;
}

const GameHistory: React.FC<GameHistoryProps> = ({
  visible,
  onClose,
  history,
  title = "历史记录",
  showResetButton = false,
  onReset,
  renderItem,
  historyType = "simple",
  placement = "right",
  width = 400,
}) => {
  // 默认渲染函数
  const defaultRenderItem = (item: HistoryItem) => {
    switch (historyType) {
      case "word":
        return (
          <List.Item>
            <List.Item.Meta description={item.word || item.content} />
          </List.Item>
        );
      case "truthOrDare":
        return (
          <List.Item>
            <List.Item.Meta
              title={item.type === "truth" ? "真心话" : "大冒险"}
              description={item.content}
            />
          </List.Item>
        );
      case "simple":
      default:
        return (
          <List.Item>
            <List.Item.Meta
              description={item.content || item.word || JSON.stringify(item)}
            />
          </List.Item>
        );
    }
  };

  return (
    <Drawer
      title={
        <div className={styles.drawerHeader}>
          <span>{title}</span>
          {showResetButton && onReset && (
            <Button
              type="text"
              icon={<RedoOutlined />}
              onClick={onReset}
              size="small"
            >
              重置记录
            </Button>
          )}
        </div>
      }
      placement={placement}
      onClose={onClose}
      open={visible}
      width={width}
      className={styles.historyDrawer}
    >
      {history.length === 0 ? (
        <div className={styles.emptyHistory}>暂无历史记录</div>
      ) : (
        <List
          className={styles.historyList}
          dataSource={history}
          renderItem={(item, index) =>
            renderItem ? renderItem(item, index) : defaultRenderItem(item)
          }
        />
      )}
    </Drawer>
  );
};

export default GameHistory;
export type { GameHistoryProps, HistoryItem };
