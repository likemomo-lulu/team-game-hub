import React, { useState } from "react";
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
import {
  HistoryOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../contexts/TeamContext";
import styles from "./index.module.scss";
import { defaultInitialWords } from "../../config";

const AddWord: React.FC = () => {
  const { teams, incrementTeamScore } = useTeam();
  const [currentWord, setCurrentWord] = useState<string>("");
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<string>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isScoreModalVisible, setIsScoreModalVisible] =
    useState<boolean>(false);
  const [customInitialWords, setCustomInitialWords] = useState<string>(
    defaultInitialWords.join("\n")
  );
  const [initialWords, setInitialWords] =
    useState<string[]>(defaultInitialWords);
  const [teamScores, setTeamScores] = useState<{ [key: string]: number }>({});

  const handleWordSelect = () => {
    const randomIndex = Math.floor(Math.random() * initialWords.length);
    const word = initialWords[randomIndex];
    setCurrentWord(word);
    setHistory((prev) => [word, ...prev.slice(0, 9)]);
  };

  const handleCustomWordsSubmit = () => {
    setInitialWords(customInitialWords.split("\n").filter((w) => w.trim()));
    setIsModalVisible(false);
  };

  const handleScoreSubmit = () => {
    Object.entries(teamScores).forEach(([teamId, score]) => {
      if (score > 0) {
        incrementTeamScore(teamId, "add-word", score);
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
        <Card className={styles.questionCard}>
          <div className={styles.questionContent}>
            {currentWord || "点击按钮开始游戏"}
          </div>
        </Card>
      </div>

      <div className={styles.controls}>
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
