import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from '../../Home/index.module.scss';

const GamesTab: React.FC = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      id: 'truth-or-dare',
      title: '真心话大冒险',
      description: '一个有趣的团队互动游戏，让大家更好地了解彼此',
      image: '/team-game-hub/images/truth-or-dare.png',
    },
    {
      id: 'guess-word',
      title: '你划我猜',
      description: '经典的团队猜词游戏，支持你说我猜和你划我猜两种模式',
      image: '/team-game-hub/images/guess-word.png',
    },
    {
      id: 'add-word',
      title: '词语接力',
      description: '主持人给出一个词，参与者依次添加1个字，形成逻辑通顺的句子',
      image: '/team-game-hub/images/add-word.png',
    },
  ];

  return (
    <div>
      <Row gutter={[24, 24]} justify="start" align="stretch" className={styles.gameList}>
        {games.map((game) => (
          <Col key={game.id} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <div className={styles.imageContainer}>
                  <img alt={game.title} src={game.image} />
                </div>
              }
              onClick={() => window.open(`${process.env.PUBLIC_URL}#/${game.id}`, '_blank')}
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

export default GamesTab;