import React, { useState, useEffect } from "react";
import { Button, message, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { CustomGameData } from "../../../components/CustomGameModal";
import GameTitle from "../../../components/GameTitle";
import CountdownTimer from "../../../components/CountdownTimer";
import TeamScoreCard from "../../../components/TeamScoreCard";
import GameHistory from "../../../components/GameHistory";
import GameActionButtons from "../../../components/GameActionButtons";
import GameQuestionCard from "../../../components/GameQuestionCard";
import GameContainer from "../../../components/GameContainer";
import CenterBox from "../../../components/CenterBox";

const { TextArea } = Input;

interface GameHistoryItem {
  question: string;
  userAnswer?: string;
  correctAnswer?: string;
  timestamp: number;
}

const CustomGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<CustomGameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [customAnswers, setCustomAnswers] = useState<string[]>([]);
  const [customQuestionsText, setCustomQuestionsText] = useState("");
  const [customAnswersText, setCustomAnswersText] = useState("");

  useEffect(() => {
    // 从 sessionStorage 获取游戏数据
    const storedGameData = sessionStorage.getItem("customGameData");
    if (storedGameData) {
      try {
        const parsedData: CustomGameData = JSON.parse(storedGameData);
        setGameData(parsedData);
        setCustomQuestions(parsedData.questions);
        if (parsedData.answers) {
          setCustomAnswers(parsedData.answers);
        }

        // 自动填充题目和答案到输入框
        setCustomQuestionsText(parsedData.questions.join("\n"));
        if (parsedData.answers) {
          setCustomAnswersText(parsedData.answers.join("\n"));
        }
      } catch (error) {
        message.error("游戏数据解析失败");
        navigate("/");
      }
    } else {
      message.error("未找到游戏数据");
      navigate("/");
    }
  }, [navigate]);

  if (!gameData) {
    return <div>加载中...</div>;
  }

  const currentQuestion = customQuestions[currentQuestionIndex];
  const currentAnswer = customAnswers[currentQuestionIndex];

  // 问答模式的处理函数
  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(false);
    setUserAnswer("");
  };

  const handleToggleAnswer = () => {
    if (!showAnswer && gameData.gameType === "qa") {
      const newHistoryItem: GameHistoryItem = {
        question: currentQuestion,
        userAnswer: userAnswer || "未作答",
        correctAnswer: currentAnswer,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }
    setShowAnswer(!showAnswer);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  // 开放模式的处理函数
  const handleCustomQuestionsSubmit = () => {
    const questions = customQuestionsText
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (questions.length === 0) {
      message.error("请至少输入一个题目");
      return;
    }

    if (gameData.gameType === "qa") {
      const answers = customAnswersText
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      if (answers.length !== questions.length) {
        message.error("题目和答案的数量必须一致");
        return;
      }
      setCustomAnswers(answers); // 直接设置而不是追加
    }

    setCustomQuestions(questions); // 直接设置而不是追加
    setIsModalVisible(false);
    message.success(`成功更新 ${questions.length} 个题目`);
  };

  const handleNextQuestion = () => {
    // 在开放模式下，记录当前题目到历史
    if (gameData?.gameType === "open" && currentQuestion) {
      const newHistoryItem: GameHistoryItem = {
        question: currentQuestion,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }

    if (currentQuestionIndex < customQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0); // 循环到第一题
    }
    setShowAnswer(false);
    setUserAnswer("");
  };

  // 问答模式界面（类似 RiddleGame）
  if (gameData.gameType === "qa") {
    return (
      <GameContainer>
        <div className={styles.container}>
          <GameTitle title={gameData.gameName} />
          {/* 顶部操作按钮 */}
          <GameActionButtons
            onCustomQuestions={() => setIsModalVisible(true)}
            onHistory={() => setHistoryVisible(true)}
          />

          {/* 团队得分卡片 */}
          <TeamScoreCard gameType={gameData.gameName} />
          <CenterBox>
            {/* 题目卡片 */}
            <GameQuestionCard
              content={currentQuestion || ""}
              placeholder="点击下一题开始游戏"
              fontSize="medium"
            />

            {/* 控制按钮区域 */}
            <div className={styles.controls}>
              {/* 倒计时区域 */}
              <CountdownTimer />
              <div className={styles.actionButtons}>
                {/* 答案显示区域 - 放在查看答案按钮左边 */}
                {showAnswer && currentAnswer && (
                  <div className={styles.answerSection}>
                    <div className={styles.answerLabel}>答案：</div>
                    <div className={styles.answerText}>{currentAnswer}</div>
                  </div>
                )}
                {/* 查看答案按钮 */}
                {currentQuestion && (
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
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNextQuestion}
                >
                  下一题
                </Button>
              </div>
            </div>
          </CenterBox>

          {/* 历史记录抽屉 */}
          <GameHistory
            visible={historyVisible}
            onClose={() => setHistoryVisible(false)}
            history={history.map((item) => ({
              word: `${item.question} - ${item.correctAnswer}`,
            }))}
            title="历史记录"
            historyType="word"
          />

          {/* 自定义题目模态框 */}
          <Modal
            title="编辑自定义题目"
            open={isModalVisible}
            onOk={handleCustomQuestionsSubmit}
            onCancel={() => {
              setIsModalVisible(false);
              // 取消时恢复原始数据
              if (gameData) {
                setCustomQuestionsText(gameData.questions.join("\n"));
                if (gameData.answers) {
                  setCustomAnswersText(gameData.answers.join("\n"));
                }
              }
            }}
            okText="保存"
            cancelText="取消"
            width={600}
          >
            <div style={{ marginBottom: 16 }}>
              <label>题目列表（每行一个题目）：</label>
              <TextArea
                value={customQuestionsText}
                onChange={(e) => setCustomQuestionsText(e.target.value)}
                placeholder="请输入题目，每行一个题目"
                rows={4}
              />
            </div>
            <div>
              <label>答案列表（每行一个答案，与题目顺序对应）：</label>
              <TextArea
                value={customAnswersText}
                onChange={(e) => setCustomAnswersText(e.target.value)}
                placeholder="请输入答案，每行一个答案"
                rows={4}
              />
            </div>
          </Modal>
        </div>
      </GameContainer>
    );
  }

  // 开放模式界面（类似 AddWordGame）
  return (
    <GameContainer>
      <div className={styles.container}>
        <GameTitle title={gameData.gameName} />
        {/* 顶部操作按钮 */}
        <GameActionButtons
          onCustomQuestions={() => setIsModalVisible(true)}
          onHistory={() => setHistoryVisible(true)}
        />

        {/* 团队得分卡片 */}
        <TeamScoreCard gameType={gameData.gameName} />
        <CenterBox>
          {/* 题目卡片 */}
          <GameQuestionCard
            content={currentQuestion || ""}
            placeholder="点击下一题开始游戏"
          />

          {/* 控制按钮区域 */}
          <div className={styles.controls}>
            {/* 倒计时区域 */}
            <CountdownTimer />
            <div className={styles.actionButtons}>
              <Button type="primary" size="large" onClick={handleNextQuestion}>
                下一题
              </Button>
            </div>
          </div>
        </CenterBox>

        {/* 历史记录抽屉 */}
        <GameHistory
          visible={historyVisible}
          onClose={() => setHistoryVisible(false)}
          history={history.map((item) => ({ word: item.question }))}
          title="历史记录"
          historyType="word"
        />

        {/* 自定义题目模态框 */}
        <Modal
          title="编辑自定义题目"
          open={isModalVisible}
          onOk={handleCustomQuestionsSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            // 取消时恢复原始数据
            if (gameData) {
              setCustomQuestionsText(gameData.questions.join("\n"));
            }
          }}
          okText="保存"
          cancelText="取消"
        >
          <TextArea
            value={customQuestionsText}
            onChange={(e) => setCustomQuestionsText(e.target.value)}
            placeholder="请输入题目，每行一个题目"
            rows={6}
          />
        </Modal>
      </div>
    </GameContainer>
  );
};

export default CustomGame;
