import React, { useState, useEffect } from "react";
import { Button, Space, Modal, Input } from "antd";
import styles from "./index.module.scss";
import { defaultDareActions, defaultTruthQuestions } from "../../../config";
import GameTitle from "../../../components/GameTitle";
import CountdownTimer from "../../../components/CountdownTimer";
import GameHistory from "../../../components/GameHistory";
import GameActionButtons from "../../../components/GameActionButtons";
import GameQuestionCard from "../../../components/GameQuestionCard";

const TruthOrDare: React.FC = () => {
  useEffect(() => {
    document.title = "真心话大冒险";
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

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

  const handleQuestionSelect = (type: "truth" | "dare") => {
    const questions = type === "truth" ? truthQuestions : dareActions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    setCurrentQuestion(question);
    setHistory((prev) => [{ type, content: question }, ...prev.slice(0, 9)]);
  };

  const handleCustomQuestionsSubmit = () => {
    setTruthQuestions(customTruthQuestions.split("\n").filter((q) => q.trim()));
    setDareActions(customDareActions.split("\n").filter((q) => q.trim()));
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <GameTitle title="真心话大冒险" />
      <GameActionButtons
        onCustomQuestions={() => setIsModalVisible(true)}
        onHistory={() => setHistoryVisible(true)}
      />
      <div className={styles.centerBox}>
        <GameQuestionCard
          content={currentQuestion}
          placeholder="点击下方按钮开始游戏"
          fontSize="small"
        />

        <div className={styles.controls}>
          {/* 倒计时区域 */}
          <CountdownTimer />
          <Space size="large" className={styles.actionButtons}>
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
      </div>

      <GameHistory
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="历史记录"
        historyType="truthOrDare"
      />
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
