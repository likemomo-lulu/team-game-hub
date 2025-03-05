import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'truth-or-dare',
      title: '真心话大冒险',
      description: '一个有趣的团队互动游戏，让大家更好地了解彼此',
      image: '/images/truth-or-dare.png',
    },
    {
      id: 'guess-word',
      title: '你划我猜',
      description: '经典的团队猜词游戏，支持你说我猜和你划我猜两种模式',
      image: '/images/guess-word.png',
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>快乐星球始发站</h1>
      <Row gutter={[24, 24]} className={styles.gameList}>
        {games.map((game) => (
          <Col key={game.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <div className={styles.imageContainer}>
                  <img alt={game.title} src={game.image} />
                </div>
              }
              onClick={() => navigate(`/${game.id}`)}
              className={styles.gameCard}
            >
              <Card.Meta title={game.title} description={game.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;