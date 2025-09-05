import React from 'react';
import { Button, Space } from 'antd';
import { EditOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

export interface GameActionButtonsProps {
  /** 点击自定义题目按钮的回调 */
  onCustomQuestions: () => void;
  /** 点击历史记录按钮的回调 */
  onHistory: () => void;
  /** 点击重置记录按钮的回调（可选） */
  onReset?: () => void;
  /** 自定义题目按钮文本 */
  customQuestionsText?: string;
  /** 历史记录按钮文本 */
  historyText?: string;
  /** 重置记录按钮文本 */
  resetText?: string;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 游戏操作按钮组件
 * 提供自定义题目、历史记录和可选的重置记录功能
 */
const GameActionButtons: React.FC<GameActionButtonsProps> = ({
  onCustomQuestions,
  onHistory,
  onReset,
  customQuestionsText = '自定义题目',
  historyText = '历史记录',
  resetText = '重置记录',
  className
}) => {
  return (
    <div className={`${styles.actionButtons} ${className || ''}`}>
      <Space>
        <Button 
          icon={<EditOutlined />} 
          onClick={onCustomQuestions}
        >
          {customQuestionsText}
        </Button>
        <Button 
          icon={<HistoryOutlined />} 
          onClick={onHistory}
        >
          {historyText}
        </Button>
        {onReset && (
          <Button 
            icon={<DeleteOutlined />} 
            onClick={onReset}
            danger
          >
            {resetText}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default GameActionButtons;