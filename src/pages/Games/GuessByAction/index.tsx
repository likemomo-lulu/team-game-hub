import React, { useState, useEffect } from "react";
import { Button, Space, Row, Col } from "antd";
import {
  RedoOutlined,
  CheckOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../../contexts/TeamContext";
import styles from "./index.module.scss";
import { actionGuessWords } from "../../../config";
import CustomTopicModal from "../../../components/CustomTopicModal";
import GameTitle from "../../../components/GameTitle";
import CountdownTimer from "../../../components/CountdownTimer";
import TeamScoreCard from "../../../components/TeamScoreCard";
import GameHistory from "../../../components/GameHistory";
import GameActionButtons from "../../../components/GameActionButtons";
import GameQuestionCard from "../../../components/GameQuestionCard";

const defaultActionWords = actionGuessWords;

const GuessByAction: React.FC = () => {
  useEffect(() => {
    document.title = "你划我猜";
  }, []);

  const { incrementTeamScore } = useTeam();
  const [currentWord, setCurrentWord] = useState<string>("");

  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ word: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTeamId, setCurrentTeamId] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customActionWords, setCustomActionWords] = useState<string>(
    defaultActionWords.join("\n")
  );
  const [actionWords, setActionWords] = useState<string[]>(defaultActionWords);

  const handleWordSelect = () => {
    const word = actionWords[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [{ word }, ...prev.slice(0, 19)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % actionWords.length);
  };

  const handleCorrect = () => {
    if (currentWord) {
      if (currentTeamId) {
        incrementTeamScore(currentTeamId, "你划我猜", 1);
      }
      handleWordSelect();
    }
  };

  const handleSkip = () => {
    handleWordSelect();
  };

  const handleCustomWordsSubmit = () => {
    setCurrentIndex(0);
    setActionWords(customActionWords.split("\n").filter((w) => w.trim()));
    setIsModalVisible(false);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  return (
    <div className={styles.container}>
      <GameTitle title="你划我猜" />
      <GameActionButtons
        onCustomQuestions={() => setIsModalVisible(true)}
        onHistory={() => setHistoryVisible(true)}
      />

      <TeamScoreCard
        gameType="你划我猜"
        showTeamSelector={true}
        selectorTitle="当前答题团队："
        selectedTeamId={currentTeamId}
        onTeamChange={setCurrentTeamId}
      />
      <div className={styles.centerBox}>
        <GameQuestionCard
          content={currentWord}
          placeholder="请选择当前答题团队"
          fontSize="large"
        />

        <div className={styles.controls}>
          <CountdownTimer
            defaultTime={120}
            className={styles.countdownSection}
          />
          <div className={styles.actionButtons}>
            <Button
              type="primary"
              size="large"
              onClick={handleWordSelect}
              disabled={!currentTeamId}
            >
              下一题
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={handleCorrect}
              className={styles.correctButton}
              disabled={!currentWord}
            >
              答对了
            </Button>
            <Button
              danger
              size="large"
              icon={<StepForwardOutlined />}
              onClick={handleSkip}
              disabled={!currentWord}
            >
              跳过
            </Button>
          </div>
        </div>
      </div>

      <GameHistory
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="历史记录"
        historyType="word"
        showResetButton={true}
        onReset={resetHistory}
      />

      <CustomTopicModal
        visible={isModalVisible}
        value={customActionWords}
        onChange={setCustomActionWords}
        onOk={handleCustomWordsSubmit}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default GuessByAction;
