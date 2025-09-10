import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";
import styles from "./index.module.scss";

const Background: React.FC = () => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    // 预设背景图片路径
    const backgroundImages = [
      "/team-game-hub/background/background1.png",
      "/team-game-hub/background/background2.png",
      "/team-game-hub/background/background4.png",
      "/team-game-hub/background/background5.png",
    ];
    setBackgrounds(backgroundImages);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
      if (!document.fullscreenElement) {
        setFullscreenImage(null);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = async (image: string) => {
    setFullscreenImage(image);
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify="start" align="stretch">
        {backgrounds.map((background, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <div className={styles.imageContainer}>
                  <img
                    alt={`Background ${index + 1}`}
                    src={background}
                    onClick={() => enterFullscreen(background)}
                  />
                </div>
              }
            />
          </Col>
        ))}
      </Row>

      {fullscreenImage && (
        <div className={styles.fullscreenOverlay} onClick={exitFullscreen}>
          <img src={fullscreenImage} alt="Fullscreen background" />
        </div>
      )}
    </div>
  );
};

export default Background;
