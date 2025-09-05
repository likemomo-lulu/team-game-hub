import React from "react";
import { Tabs } from "antd";
import { Gamepad, Users, Image } from "lucide-react";
import Teams from "../Teams";
import Background from "../Background";
import GamesTab from "../Games/GamesTab";
import styles from "./index.module.scss";

const Home: React.FC = () => {
  const items = [
    {
      key: "games",
      label: (
        <span>
          <Gamepad size={16} style={{ marginRight: "8px" }} />
          游戏
        </span>
      ),
      children: <GamesTab />,
    },
    {
      key: "teams",
      label: (
        <span>
          <Users size={16} style={{ marginRight: "8px" }} />
          团队
        </span>
      ),
      children: <Teams />,
    },
    {
      key: "background",
      label: (
        <span>
          <Image size={16} style={{ marginRight: "8px" }} />
          背景墙
        </span>
      ),
      children: <Background />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>快乐星球始发站</h1>
      <Tabs
        defaultActiveKey="games"
        items={items}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
};

export default Home;
