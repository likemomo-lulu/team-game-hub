import React, { useState, useEffect } from 'react';
import { Button, Card, InputNumber, Drawer, List, Space, Modal, Input } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const defaultTruthQuestions = [
  '你最近一次说谎是什么时候？说了什么谎？',
  '你最喜欢的一首歌是什么？为什么？',
  '你最难忘的一次旅行是哪次？',
  '你最后悔的一件事是什么？',
  '如果可以重来，你最想改变人生中的哪个决定？',
  '你最想感谢的人是谁？为什么？',
  '你最近一次哭是什么时候？为什么？',
  '你有什么特别的才能或技能？',
  '你最大的梦想是什么？',
  '你最害怕什么？为什么？',
  '如果可以选择一个超能力，你会选择什么？',
  '你最喜欢自己哪一点？',
  '你最不喜欢自己哪一点？',
  '你认为真正的友谊是什么？',
  '你最想去的地方是哪里？',
  '你最崇拜的人是谁？为什么？',
  '你最难忘的一次失败经历是什么？',
  '你最自豪的一件事是什么？',
  '如果可以穿越时空，你想去哪个年代？',
  '你最想实现的三个愿望是什么？',
  '你觉得自己最大的优点是什么？',
  '你最难忘的一次成功经历是什么？',
  '你最想改变自己的哪些习惯？',
  '你最喜欢的季节是什么？为什么？',
  '你最想对家人说的一句话是什么？',
  '你最近一次让自己感到骄傲的事情是什么？',
  '你认为最重要的三个生活准则是什么？',
  '如果可以选择转世，你想成为什么？',
  '你最难忘的一次惊喜是什么？',
  '你最想尝试的一件事是什么？',
  '你觉得自己最大的进步是什么？',
  '你最喜欢的一本书是什么？为什么？',
  '你最想感谢的一位老师是谁？为什么？',
  '你最难忘的一次误会是什么？',
  '你最想完成的一个目标是什么？',
  '你最喜欢的一部电影是什么？为什么？',
  '你最想改变的一个性格特点是什么？',
  '你最难忘的一次道歉是什么？',
  '你最想学习的一项技能是什么？',
  '你最喜欢的一个童年回忆是什么？',
  '你最想重温的一段时光是什么？',
  '你最近一次被感动是什么时候？',
  '你最想突破的一个困境是什么？',
  '你最喜欢的一种美食是什么？为什么？',
  '你最想实现的一个小目标是什么？',
  '你最近一次开怀大笑是什么时候？',
  '你最想收到的一份礼物是什么？',
  '你最想经历的一次冒险是什么？',
  '你最想感谢的一次帮助是什么？',
  '你最想对自己说的一句话是什么？'
];

const defaultDareActions = [
  '模仿一个电影角色说台词',
  '唱一首歌给大家听',
  '做10个俯卧撑',
  '给在场的一个人按摩3分钟',
  '即兴表演一个才艺',
  '模仿三种动物的叫声',
  '和一位玩家玩石头剪刀布，输的人做5个蹲起',
  '闭眼转三圈后走直线',
  '用夸张的表情讲述一个笑话',
  '即兴编一个四句押韵的顺口溜',
  '模仿一位明星的标志性动作',
  '和一位玩家合作即兴表演一个小情景剧',
  '用肢体语言描述一个词语让大家猜',
  '背对着大家跳一段舞蹈',
  '用一分钟讲述一个有趣的故事',
  '模仿一种职业的工作场景',
  '用夸张的方式演绎一首歌',
  '和一位玩家玩默契大考验',
  '做一个鬼脸让大家拍照',
  '模仿一个卡通人物的经典台词',
  '即兴创作一段rap',
  '用手机拍摄一个创意自拍',
  '和一位玩家玩眼神对视大赛',
  '表演一个魔术技巧',
  '用夸张的表情演绎一个情绪',
  '模仿一种交通工具的声音',
  '做一个简单的瑜伽动作',
  '用手机录制一个搞笑短视频',
  '即兴创作一个广告词',
  '和一位玩家玩猜拳游戏',
  '表演一段街舞动作',
  '模仿一种方言说话',
  '做一个简单的手指游戏',
  '用夸张的动作演绎一个场景',
  '即兴创作一个童话故事',
  '和一位玩家玩你画我猜',
  '表演一个特长或绝技',
  '模仿一种运动的动作',
  '做一个简单的平衡动作',
  '用夸张的方式演唱生日歌',
  '即兴创作一个笑话',
  '和一位玩家玩拇指大战',
  '表演一个简单的魔术',
  '模仿一种乐器的声音',
  '做一个简单的伸展运动',
  '用夸张的方式演绎一个广告',
  '即兴创作一个相声段子',
  '和一位玩家玩手势游戏',
  '表演一个简单的杂技动作',
  '模仿一种食物的味道表情'
];

const TruthOrDare: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [countdownTime, setCountdownTime] = useState<number>(60);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownTime);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ type: string; content: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customTruthQuestions, setCustomTruthQuestions] = useState<string>(defaultTruthQuestions.join('\n'));
  const [customDareActions, setCustomDareActions] = useState<string>(defaultDareActions.join('\n'));
  const [truthQuestions, setTruthQuestions] = useState<string[]>(defaultTruthQuestions);
  const [dareActions, setDareActions] = useState<string[]>(defaultDareActions);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, timeLeft]);

  const handleQuestionSelect = (type: 'truth' | 'dare') => {
    const questions = type === 'truth' ? truthQuestions : dareActions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    setCurrentQuestion(question);
    setHistory((prev) => [
      { type, content: question },
      ...prev.slice(0, 9),
    ]);
  };

  const toggleCountdown = () => {
    if (!isCountingDown) {
      setTimeLeft(countdownTime);
    }
    setIsCountingDown(!isCountingDown);
  };

  const handleCustomQuestionsSubmit = () => {
    setTruthQuestions(customTruthQuestions.split('\n').filter(q => q.trim()));
    setDareActions(customDareActions.split('\n').filter(q => q.trim()));
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
          {currentQuestion || '点击下方按钮开始游戏'}
        </div>
      </Card>

      <div className={styles.controls}>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={() => handleQuestionSelect('truth')}
          >
            真心话
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handleQuestionSelect('dare')}
          >
            大冒险
          </Button>

        </Space>
      </div>

      <div className={styles.timerSection}>
        <Space>
          <InputNumber
            min={1}
            max={300}
            value={countdownTime}
            onChange={(value) => setCountdownTime(value || 60)}
            disabled={isCountingDown}
            addonAfter="秒"
          />
          <Button
            type="default"
            icon={<ClockCircleOutlined />}
            onClick={toggleCountdown}
          >
            {isCountingDown ? `${timeLeft}秒` : '开始倒计时'}
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
                title={item.type === 'truth' ? '真心话' : '大冒险'}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Drawer>
      <Modal
        title="自定义题目"
        open={isModalVisible}
        onOk={handleCustomQuestionsSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ top: '2vh' }}
        bodyStyle={{ height: '80vh', overflowY: 'auto' }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <h4>真心话题目（每行一个问题）：</h4>
          <Input.TextArea
            value={customTruthQuestions}
            onChange={(e) => setCustomTruthQuestions(e.target.value)}
            rows={10}
          />
        </div>
        <div>
          <h4>大冒险题目（每行一个动作）：</h4>
          <Input.TextArea
            value={customDareActions}
            onChange={(e) => setCustomDareActions(e.target.value)}
            rows={10}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TruthOrDare;