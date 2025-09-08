import React, { useEffect, useState } from "react";
import { Button } from "antd";
import styles from "./index.module.scss";
import { defaultInitialRelayWords } from "../../../config";
import GameTitle from "../../../components/GameTitle";
import CustomTopicModal from "../../../components/CustomTopicModal";
import CountdownTimer from "../../../components/CountdownTimer";
import TeamScoreCard from "../../../components/TeamScoreCard";
import GameHistory from "../../../components/GameHistory";
import GameActionButtons from "../../../components/GameActionButtons";
import GameQuestionCard from "../../../components/GameQuestionCard";
import GameContainer from "../../../components/GameContainer";
import CenterBox from "../../../components/CenterBox";

const Relay: React.FC = () => {
  useEffect(() => {
    document.title = "趣味传声筒";
  }, []);

  const [currentWord, setCurrentWord] = useState<string>("");

  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<string>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [initialWords, setInitialWords] = useState<string[]>(
    defaultInitialRelayWords
  );
  const [customInitialWords, setCustomInitialWords] = useState<string>(
    defaultInitialRelayWords.join("\n")
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 选择下一个词语
  const handleWordSelect = () => {
    const word = initialWords[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [word, ...prev.slice(0, 9)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % initialWords.length);
  };

  // 提交自定义词语
  const handleCustomWordsSubmit = () => {
    setCurrentIndex(0);
    const newWords = customInitialWords.split("\n").filter((w) => w.trim());
    setInitialWords(newWords);
    setIsModalVisible(false);
  };

  return (
    <GameContainer>
      <div className={styles.container}>
        <GameTitle title="趣味传声筒" />
        {/* 顶部操作按钮 */}
        <GameActionButtons
          onCustomQuestions={() => setIsModalVisible(true)}
          onHistory={() => setHistoryVisible(true)}
        />

        {/* 团队得分卡片 */}
        <TeamScoreCard gameType="趣味传声筒" />
        <CenterBox>
          {/* 题目卡片 */}
          <GameQuestionCard
            content={currentWord}
            placeholder="点击下一题开始游戏"
          />

          {/* 控制按钮区域 */}
          <div className={styles.controls}>
            {/* 倒计时区域 */}
            <CountdownTimer />
            <div className={styles.actionButtons}>
              <Button type="primary" size="large" onClick={handleWordSelect}>
                下一题
              </Button>
            </div>
          </div>
        </CenterBox>

        {/* 历史记录抽屉 */}
        <GameHistory
          visible={historyVisible}
          onClose={() => setHistoryVisible(false)}
          history={history.map((word) => ({ word }))}
          title="历史记录"
          historyType="word"
        />

        {/* 自定义题目模态框 */}
        <CustomTopicModal
          visible={isModalVisible}
          value={customInitialWords}
          onChange={setCustomInitialWords}
          onOk={handleCustomWordsSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </div>
    </GameContainer>
  );
};

export default Relay;
