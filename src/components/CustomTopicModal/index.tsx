import React from "react";
import { Modal, Input } from "antd";
import styles from "./index.module.scss";

// 自定义题目弹窗组件的属性接口
interface CustomTopicModalProps {
  // 弹窗是否可见
  visible: boolean;
  // 弹窗标题
  title?: string;
  // 提示文本
  promptText?: string;
  // 文本域的值
  value: string;
  // 文本域值变化的回调
  onChange: (value: string) => void;
  // 确定按钮的回调
  onOk: () => void;
  // 取消按钮的回调
  onCancel: () => void;
  // 文本域的行数
  rows?: number;
  // 弹窗宽度
  width?: number;
  // 确定按钮文本
  okText?: string;
  // 取消按钮文本
  cancelText?: string;
}

/**
 * 自定义题目弹窗通用组件
 * 用于各个游戏中的自定义题目输入功能
 */
const CustomTopicModal: React.FC<CustomTopicModalProps> = ({
  visible,
  title = "自定义题目",
  promptText = "题目（每行一个词语）：",
  value,
  onChange,
  onOk,
  onCancel,
  rows = 20,
  width = 800,
  okText = "确定",
  cancelText = "取消",
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      style={{ top: "2vh" }}
      bodyStyle={{ height: "80vh", overflowY: "auto" }}
      okText={okText}
      cancelText={cancelText}
      className={styles.customTopicModal}
    >
      <div className={styles.content}>
        <h4 className={styles.promptText}>{promptText}</h4>
        <Input.TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={styles.textArea}
          placeholder="请输入题目，每行一个词语"
        />
      </div>
    </Modal>
  );
};

export default CustomTopicModal;