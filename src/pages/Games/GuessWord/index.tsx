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
  Modal,
  Input,
} from "antd";
import {
  HistoryOutlined,
  RedoOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  StepForwardOutlined, 
  EditOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../../contexts/TeamContext";
import styles from "./index.module.scss";
import { actionGuessWords, speakGuessWords } from "../../../config";

const defaultSpeakWords = speakGuessWords;
const defaultActionWords = actionGuessWords;

const GuessWord: React.FC = () => {
  useEffect(() => {
    document.title = "你划我猜";
  }, []);
  const { teams, incrementTeamScore } = useTeam();
  const [currentWord, setCurrentWord] = useState<string>("");
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customSpeakWords, setCustomSpeakWords] = useState<string>(
    defaultSpeakWords.join("\n")
  );
  const [customActionWords, setCustomActionWords] = useState<string>(
    defaultActionWords.join("\n")
  );
  const [speakWords, setSpeakWords] = useState<string[]>(defaultSpeakWords);
  const [actionWords, setActionWords] = useState<string[]>(defaultActionWords);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);
        if (newTimeLeft === 0 && audio) {
          audio.currentTime = 0;
          audio.play();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [audio, isCountingDown, timeLeft]);

  const handleWordSelect = () => {
    const words = gameMode === "speak" ? speakWords : actionWords;
    const word = words[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [{ mode: gameMode, word }, ...prev.slice(0, 19)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
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

  const toggleCountdown = () => {
    if (!isCountingDown) {
      setTimeLeft(countdownTime);
    }
    setIsCountingDown(!isCountingDown);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  const handleCustomWordsSubmit = () => {
    setCurrentIndex(0);
    setSpeakWords(customSpeakWords.split("\n").filter((w) => w.trim()));
    setActionWords(customActionWords.split("\n").filter((w) => w.trim()));
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActionButtons}>
        <Space size="small">
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
              {currentWord || "请选择当前答题团队"}
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
                onClick={() => {setCurrentIndex(0);setGameMode("speak")}}
              >
                你说我猜
              </Button>
              <Button
                type="default"
                size="large"
                className={` ${
                  gameMode === "action" ? styles.activeMode : ""
                } ${styles.actionCard}`}
                onClick={() =>{setCurrentIndex(0); setGameMode("action")}}
              >
                你划我猜
              </Button>
            </div>
            <div className={styles.actionButtons}>
              <Button type="primary" size="large" onClick={handleWordSelect} disabled={!currentTeamId}>
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
                icon={<StepForwardOutlined  />}
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

      <Modal
        title="自定义题目"
        open={isModalVisible}
        onOk={handleCustomWordsSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ top: "2vh" }}
        bodyStyle={{ height: "80vh", overflowY: "auto" }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <h4>你说我猜题目（每行一个词语）：</h4>
          <Input.TextArea
            value={customSpeakWords}
            onChange={(e) => setCustomSpeakWords(e.target.value)}
            rows={10}
          />
        </div>
        <div>
          <h4>你划我猜题目（每行一个词语）：</h4>
          <Input.TextArea
            value={customActionWords}
            onChange={(e) => setCustomActionWords(e.target.value)}
            rows={10}
          />
        </div>
      </Modal>
    </div>
  );
};

export default GuessWord;
