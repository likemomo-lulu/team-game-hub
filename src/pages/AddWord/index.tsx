import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  List,
  Space,
  Modal,
  Input,
  Avatar,
  InputNumber,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import {
  HistoryOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../contexts/TeamContext";
import styles from "./index.module.scss";
import { defaultInitialRelayWords, defaultInitialWords } from "../../config";

const AddWord: React.FC = () => {
  useEffect(() => {
    document.title = "词语接力";
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
  const [countdownTime, setCountdownTime] = useState<number>(120);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownTime);
  const [gameMode, setGameMode] = useState<"add-word" | "relay">("relay");
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<string>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isScoreModalVisible, setIsScoreModalVisible] = useState<boolean>(false);
  const [initialWords, setInitialWords] = useState<string[]>(defaultInitialRelayWords);
  const [customInitialWords, setCustomInitialWords] = useState<string>(
    initialWords.join("\n")
  );

  const [teamScores, setTeamScores] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(()=>{
    if(gameMode === "relay"){
      setInitialWords(defaultInitialRelayWords)
    }else{
      setInitialWords(defaultInitialWords)
    }
  },[gameMode])

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
    const words = initialWords
    const word = words[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [word, ...prev.slice(0, 9)]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handleCustomWordsSubmit = () => {
    setCurrentIndex(0);
    setInitialWords(customInitialWords.split("\n").filter((w) => w.trim()));
    setIsModalVisible(false);
  };

  const handleScoreSubmit = () => {
    Object.entries(teamScores).forEach(([teamId, score]) => {
      if (score > 0) {
        incrementTeamScore(teamId, "词语接力", score);
      }
    });
    setTeamScores({});
    setIsScoreModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActionButtons}>
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

      <Card className={styles.scoreCard} title="团队得分">
        {teams.length === 0 ? (
          <div className={styles.noTeam}>请先在首页添加团队</div>
        ) : (
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
                  {team.scores["add-word"] || 0}分
                </span>
              </List.Item>
            )}
          />
        )}
      </Card>

      <div className={styles.centerBox}>
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
              onClick={() => {
                if (!isCountingDown) {
                  setTimeLeft(countdownTime);
                }
                setIsCountingDown(!isCountingDown);
              }}
            >
              {isCountingDown ? `${timeLeft}秒` : "开始倒计时"}
            </Button>
          </Space>
        </div>
        <Card className={styles.questionCard}>
          <div className={styles.questionContent}>
            {currentWord || "点击下一题开始游戏"}
          </div>
        </Card>
      </div>

      <div className={styles.controls}>
        <div className={styles.modeCards}>
          <Button
            type="default"
            size="large"
            className={`${gameMode === "add-word" ? styles.activeMode : ""} ${styles.speakCard}`}
            onClick={() =>{setCurrentIndex(0); setGameMode("add-word")}}
          >
            加字游戏
          </Button>
          <Button
            type="default"
            size="large"
            className={`${gameMode === "relay" ? styles.activeMode : ""} ${styles.actionCard}`}
            onClick={() =>{setCurrentIndex(0); setGameMode("relay")}}
          >
            传声筒
          </Button>
        </div>
        <div className={styles.actionButtons}>
          <Button
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsScoreModalVisible(true)}
          >
            手动计分
          </Button>
          <Button type="primary" size="large" onClick={handleWordSelect}>
            下一题
          </Button>
        </div>
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
              <List.Item.Meta description={item} />
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
        <div>
          <h4>初始词（每行一个词）：</h4>
          <Input.TextArea
            value={customInitialWords}
            onChange={(e) => setCustomInitialWords(e.target.value)}
            rows={20}
          />
        </div>
      </Modal>

      <Modal
        title="本轮计分"
        open={isScoreModalVisible}
        onOk={handleScoreSubmit}
        onCancel={() => {
          setTeamScores({});
          setIsScoreModalVisible(false);
        }}
        okText="确定"
        cancelText="取消"
      >
        <List
          dataSource={teams}
          renderItem={(team) => (
            <List.Item>
              <Space>
                <Avatar src={team.avatar} />
                <span>{team.name}</span>
              </Space>
              <InputNumber
                min={0}
                value={teamScores[team.id] || 0}
                onChange={(value) =>
                  setTeamScores((prev) => ({ ...prev, [team.id]: value || 0 }))
                }
                addonAfter="分"
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default AddWord;
