import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Gamepad, Users, Image } from "lucide-react";
import Teams from "../Teams";
import Background from "../Background";
import GamesTab from "./GameTab";
import styles from "./index.module.scss";

const Home: React.FC = () => {
  // 从 localStorage 获取保存的 activeKey，如果没有则默认为 "games"
  const [activeKey, setActiveKey] = useState<string>(() => {
    return localStorage.getItem("homeTabActiveKey") || "games";
  });

  // 当 activeKey 改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem("homeTabActiveKey", activeKey);
  }, [activeKey]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };
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
        activeKey={activeKey}
        onChange={handleTabChange}
        items={items}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
};

export default Home;
