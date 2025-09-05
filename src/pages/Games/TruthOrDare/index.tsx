import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  InputNumber,
  Drawer,
  List,
  Space,
  Modal,
  Input,
} from "antd";
import {
  HistoryOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { defaultDareActions, defaultTruthQuestions } from "../../../config";

const TruthOrDare: React.FC = () => {
  useEffect(() => {
    document.title = "真心话大冒险";
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = process.env.PUBLIC_URL + "/audio/timer-end.wav";
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, []);

  const [countdownTime, setCountdownTime] = useState<number>(60);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownTime);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<
    Array<{ type: string; content: string }>
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customTruthQuestions, setCustomTruthQuestions] = useState<string>(
    defaultTruthQuestions.join("\n")
  );
  const [customDareActions, setCustomDareActions] = useState<string>(
    defaultDareActions.join("\n")
  );
  const [truthQuestions, setTruthQuestions] = useState<string[]>(
    defaultTruthQuestions
  );
  const [dareActions, setDareActions] = useState<string[]>(defaultDareActions);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          if (newTimeLeft === 0 && audio) {
            audio.currentTime = 0;
            audio.play();
          }
          return newTimeLeft;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [audio, isCountingDown, timeLeft]);

  const handleQuestionSelect = (type: "truth" | "dare") => {
    const questions = type === "truth" ? truthQuestions : dareActions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    setCurrentQuestion(question);
    setHistory((prev) => [{ type, content: question }, ...prev.slice(0, 9)]);
  };

  const toggleCountdown = () => {
    if (!isCountingDown) {
      setTimeLeft(countdownTime);
    }
    setIsCountingDown(!isCountingDown);
  };

  const handleCustomQuestionsSubmit = () => {
    setTruthQuestions(customTruthQuestions.split("\n").filter((q) => q.trim()));
    setDareActions(customDareActions.split("\n").filter((q) => q.trim()));
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
          {currentQuestion || "点击下方按钮开始游戏"}
        </div>
      </Card>

      <div className={styles.controls}>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={() => handleQuestionSelect("truth")}
          >
            真心话
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handleQuestionSelect("dare")}
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
            {isCountingDown ? `${timeLeft}秒` : "开始倒计时"}
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
                title={item.type === "truth" ? "真心话" : "大冒险"}
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
        style={{ top: "2vh" }}
        bodyStyle={{ height: "80vh", overflowY: "auto" }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <h4>真心话题题（每行一个问题）：</h4>
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
