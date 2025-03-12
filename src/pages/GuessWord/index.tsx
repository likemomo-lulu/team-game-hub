import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  InputNumber,
  Drawer,
  List,
  Space,
  Row,
  Col,
  Select,
  Avatar,
} from "antd";
import {
  HistoryOutlined,
  RedoOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../contexts/TeamContext";
import styles from "./index.module.scss";
import { actionGuessWords, speakGuessWords } from "../../config";

const GuessWord: React.FC = () => {
  const { teams, incrementTeamScore } = useTeam();
  const [currentWord, setCurrentWord] = useState<string>("");
  const [gameMode, setGameMode] = useState<"speak" | "action">("speak");
  const [countdownTime, setCountdownTime] = useState<number>(120); // 默认2分钟
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownTime);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ mode: string; word: string }>>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTeamId, setCurrentTeamId] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, timeLeft]);

  const handleWordSelect = () => {
    const words = gameMode === "speak" ? speakGuessWords : actionGuessWords;
    const word = words[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [{ mode: gameMode, word }, ...prev.slice(0, 19)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handleCorrect = () => {
    if (currentWord) {
      if (currentTeamId) {
        incrementTeamScore(currentTeamId, "guess-word", 1);
      }
      handleWordSelect();
    }
  };

  const handleSkip = () => {
    handleWordSelect();
  };

  const toggleCountdown = () => {
    if (!isCountingDown) {
      setTimeLeft(countdownTime);
    }
    setIsCountingDown(!isCountingDown);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActionButtons}>
        <Space size="large">
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryVisible(true)}
          >
            历史记录
          </Button>
          <Button type="link" icon={<RedoOutlined />} onClick={resetHistory}>
            重置记录
          </Button>
        </Space>
      </div>

      <Card className={styles.scoreCard} title="团队得分">
        {teams.length === 0 ? (
          <div className={styles.noTeam}>请先在首页添加团队</div>
        ) : (
          <>
            <div className={styles.teamSelector}>
              <p>当前答题团队：</p>
              <Select
                placeholder="选择团队"
                style={{ width: "100%" }}
                value={currentTeamId || undefined}
                onChange={(value) => setCurrentTeamId(value)}
              >
                {teams.map((team) => (
                  <Select.Option key={team.id} value={team.id}>
                    <Space>
                      <Avatar size="small" src={team.avatar} />
                      {team.name}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </div>
            <List
              className={styles.teamScoreList}
              dataSource={teams}
              renderItem={(team) => (
                <List.Item>
                  <Space>
                    <Avatar src={team.avatar} />
                    <span>{team.name}</span>
                  </Space>
                  <span className={styles.score}>
                    {team.scores["guess-word"] || 0}分
                  </span>
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
      <Row gutter={24}>
        <Col span={24} className={styles.centerBox}>
          <div className={styles.timerSection}>
            <Space>
              <InputNumber
                min={1}
                max={300}
                value={countdownTime}
                onChange={(value) => setCountdownTime(value || 120)}
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
          <Card className={styles.wordCard}>
            <div className={styles.wordContent}>
              {currentWord || "点击按钮开始游戏"}
            </div>
          </Card>
          <div className={styles.controls}>
            <div className={styles.modeCards}>
              <Button
                type="default"
                size="large"
                className={` ${gameMode === "speak" ? styles.activeMode : ""} ${
                  styles.speakCard
                }`}
                onClick={() => setGameMode("speak")}
              >
                你说我猜
              </Button>
              <Button
                type="default"
                size="large"
                className={` ${
                  gameMode === "action" ? styles.activeMode : ""
                } ${styles.actionCard}`}
                onClick={() => setGameMode("action")}
              >
                你划我猜
              </Button>
            </div>
            <div className={styles.actionButtons}>
              <Button type="primary" size="large" onClick={handleWordSelect}>
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
                icon={<CloseOutlined />}
                onClick={handleSkip}
                disabled={!currentWord}
              >
                跳过
              </Button>
            </div>
          </div>
        </Col>
      </Row>

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
              <List.Item.Meta description={item.word} />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};

export default GuessWord;
