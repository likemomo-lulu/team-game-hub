import React, { useState, useEffect } from "react";
import { Button } from "antd";
import styles from "./index.module.scss";
import { defaultRiddles, RiddleItem } from "../../../config";
import CustomTopicModal from "../../../components/CustomTopicModal";
import GameTitle from "../../../components/GameTitle";
import CountdownTimer from "../../../components/CountdownTimer";
import TeamScoreCard from "../../../components/TeamScoreCard";
import GameHistory from "../../../components/GameHistory";
import GameActionButtons from "../../../components/GameActionButtons";
import GameQuestionCard from "../../../components/GameQuestionCard";
import GameContainer from "../../../components/GameContainer";
import CenterBox from "../../../components/CenterBox";

const RiddleGame: React.FC = () => {
  useEffect(() => {
    document.title = "猜灯谜游戏";
  }, []);

  const [currentRiddle, setCurrentRiddle] = useState<RiddleItem | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<RiddleItem>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [riddles, setRiddles] = useState<RiddleItem[]>(defaultRiddles);
  const [customRiddles, setCustomRiddles] = useState<string>(
    defaultRiddles.map((r) => `${r.question}|${r.answer}`).join("\n")
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 选择下一个灯谜
  const handleRiddleSelect = () => {
    const riddle = riddles[currentIndex];
    setCurrentRiddle(riddle);
    setShowAnswer(false); // 重置答案显示状态
    setHistory((prev) => [riddle, ...prev.slice(0, 9)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % riddles.length);
  };

  // 显示/隐藏答案
  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // 提交自定义灯谜
  const handleCustomRiddlesSubmit = () => {
    setCurrentIndex(0);
    const newRiddles = customRiddles
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [question, answer] = line.split("|");
        return {
          question: question?.trim() || "",
          answer: answer?.trim() || "",
        };
      })
      .filter((riddle) => riddle.question && riddle.answer);
    setRiddles(newRiddles);
    setIsModalVisible(false);
  };

  return (
    <GameContainer>
      <div className={styles.container}>
        <GameTitle title="猜灯谜游戏" />
        {/* 顶部操作按钮 */}
        <GameActionButtons
          onCustomQuestions={() => setIsModalVisible(true)}
          onHistory={() => setHistoryVisible(true)}
        />

        {/* 团队得分卡片 */}
        <TeamScoreCard gameType="猜灯谜游戏" />
        <CenterBox>
          {/* 题目卡片 */}
          <GameQuestionCard
            content={currentRiddle?.question || ""}
            placeholder="点击下一题开始游戏"
            fontSize="medium"
          />

          {/* 控制按钮区域 */}
          <div className={styles.controls}>
            {/* 倒计时区域 */}
            <CountdownTimer />
            <div className={styles.actionButtons}>
              {/* 答案显示区域 - 放在查看答案按钮左边 */}
              {showAnswer && currentRiddle && (
                <div className={styles.answerSection}>
                  <div className={styles.answerLabel}>答案：</div>
                  <div className={styles.answerText}>
                    {currentRiddle.answer}
                  </div>
                </div>
              )}
              {/* 查看答案按钮 */}
              {currentRiddle && (
                <Button
                  type="default"
                  size="large"
                  onClick={handleToggleAnswer}
                  className={styles.answerButton}
                >
                  {showAnswer ? "隐藏答案" : "查看答案"}
                </Button>
              )}
              {/* 下一题按钮 */}
              <Button type="primary" size="large" onClick={handleRiddleSelect}>
                下一题
              </Button>
            </div>
          </div>
        </CenterBox>

        {/* 历史记录抽屉 */}
        <GameHistory
          visible={historyVisible}
          onClose={() => setHistoryVisible(false)}
          history={history.map((riddle) => ({
            word: `${riddle.question} - ${riddle.answer}`,
          }))}
          title="历史记录"
          historyType="word"
        />

        {/* 自定义题目模态框 */}
        <CustomTopicModal
          visible={isModalVisible}
          value={customRiddles}
          onChange={setCustomRiddles}
          onOk={handleCustomRiddlesSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </div>
    </GameContainer>
  );
};

export default RiddleGame;
