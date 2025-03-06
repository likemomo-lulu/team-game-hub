import React, { useState } from 'react';
import { Button, Card, Drawer, List, Space, Modal, Input } from 'antd';
import { HistoryOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const defaultInitialWords = [
  '吃瓜',
  '运动',
  '上班',
  '甜',
  '崩了',
  '海绵宝宝',
  '美国队长',
  '爬树',
  '看海',
  '酒量',
  '北京',
  '发呆',
  '杯子',
  '你',
  '讨厌',
  '完蛋',
  '喜欢',
  '养生',
  '凳子',
  '笑死',
  '厕所',
  '买房',
  '牵手',
  '好吃',
  '美女',
  '老板',
  '猫和老鼠',
  '拖拉机',
  '牙疼',
  '麻辣烫',
  '高跟鞋',
  '谁',
  '鬼屋',
  '过山车',
  '前任',
  '纸巾',
  '淋雨',
  '倒车',
  '母鸡',
  '加班',
  '农夫山泉',
  '买车',
  '蹦迪',
  '牛魔王',
  '高端',
  '铁锅炖大鹅'
];

const AddWord: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<string>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customInitialWords, setCustomInitialWords] = useState<string>(defaultInitialWords.join('\n'));
  const [initialWords, setInitialWords] = useState<string[]>(defaultInitialWords);

  const handleWordSelect = () => {
    const randomIndex = Math.floor(Math.random() * initialWords.length);
    const word = initialWords[randomIndex];
    setCurrentWord(word);
    setHistory((prev) => [
      word,
      ...prev.slice(0, 9),
    ]);
  };

  const handleCustomWordsSubmit = () => {
    setInitialWords(customInitialWords.split('\n').filter(w => w.trim()));
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionButtons}>
        <Space size="large">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            自定义题目
          </Button>
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryVisible(true)}
          >
            历史记录
          </Button>
        </Space>
      </div>

      <Card className={styles.questionCard}>
        <div className={styles.questionContent}>
          {currentWord || '点击按钮开始游戏'}
        </div>
      </Card>

      <div className={styles.controls}>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={handleWordSelect}
          >
            下一题
          </Button>
        </Space>
      </div>

      <Drawer
        title="历史记录"
        placement="right"
        onClose={() => setHistoryVisible(false)}
        open={historyVisible}
      >
        <List
          dataSource={history}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                description={item}
              />
            </List.Item>
          )}
        />
      </Drawer>

      <Modal
        title="自定义题目"
        open={isModalVisible}
        onOk={handleCustomWordsSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ top: '2vh' }}
        bodyStyle={{ height: '80vh', overflowY: 'auto' }}
        okText="确定"
        cancelText="取消"
      >
        <div>
          <h4>初始词（每行一个词）：</h4>
          <Input.TextArea
            value={customInitialWords}
            onChange={(e) => setCustomInitialWords(e.target.value)}
            rows={20}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AddWord;