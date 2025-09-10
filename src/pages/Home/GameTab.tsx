import React, { useState } from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import CustomGameModal, {
  CustomGameData,
} from "../../components/CustomGameModal";

const GamesTab: React.FC = () => {
  const navigate = useNavigate();
  const [customGameModalVisible, setCustomGameModalVisible] = useState(false);

  // 处理自定义游戏创建
  const handleCustomGameConfirm = (gameData: CustomGameData) => {
    // 将游戏数据存储到 sessionStorage 中
    sessionStorage.setItem("customGameData", JSON.stringify(gameData));
    // 打开自定义游戏页面
    window.open(`${process.env.PUBLIC_URL}#/custom-game`, "_blank");
  };

  const games = [
    {
      id: "truth-or-dare",
      title: "真心话大冒险",
      description: "一个有趣的团队互动游戏，让大家更好地了解彼此",
      image: "/team-game-hub/images/truth-or-dare.png",
    },
    {
      id: "speak-guess",
      title: "你说我猜",
      description: "通过语言描述让队友猜出词语的经典团队游戏",
      image: "/team-game-hub/images/guess-by-speak.jpg",
    },
    {
      id: "action-guess",
      title: "你划我猜",
      description: "通过动作表演让队友猜出词语的经典团队游戏",
      image: "/team-game-hub/images/guess-words.png",
    },
    {
      id: "add-word-game",
      title: "加字游戏",
      description: "主持人给出一个词，参与者依次添加1个字，形成逻辑通顺的句子",
      image: "/team-game-hub/images/add-word.png",
    },
    {
      id: "relay",
      title: "趣味传声筒",
      description: "经典的趣味传声筒，考验团队的沟通和理解能力",
      image: "/team-game-hub/images/relay.png",
    },
    {
      id: "riddle-game",
      title: "猜灯谜游戏",
      description: "传统的猜灯谜游戏",
      image: "/team-game-hub/images/lantern-riddles.png",
    },
    {
      id: "brain-teaser-game",
      title: "脑筋急转弯游戏",
      description: "开动脑筋，挑战思维极限的趣味问答游戏",
      image: "/team-game-hub/images/brain-teaser.png",
    },
    {
      id: "custom-game",
      title: "自定义游戏",
      description: "创建属于你的专属游戏，支持问答和开放式两种模式",
      image: "/team-game-hub/images/gift-box.jpg",
      isCustom: true,
    },
  ];

  return (
    <div>
      <Row
        gutter={[24, 24]}
        justify="start"
        align="stretch"
        className={styles.gameList}
      >
        {games.map((game) => (
          <Col key={game.id} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <div className={styles.imageContainer}>
                  <img alt={game.title} src={game.image} />
                </div>
              }
              onClick={() => {
                if (game.id === "custom-game") {
                  setCustomGameModalVisible(true);
                } else {
                  window.open(
                    `${process.env.PUBLIC_URL}#/${game.id}`,
                    "_blank"
                  );
                }
              }}
              className={styles.gameCard}
            >
              <Card.Meta title={game.title} description={game.description} />
            </Card>
          </Col>
        ))}
      </Row>

      <CustomGameModal
        visible={customGameModalVisible}
        onCancel={() => setCustomGameModalVisible(false)}
        onConfirm={handleCustomGameConfirm}
      />
    </div>
  );
};

export default GamesTab;
