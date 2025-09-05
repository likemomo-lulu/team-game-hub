import React from "react";
import { Card, List, Space, Avatar, Select, InputNumber } from "antd";
import { useTeam } from "../../contexts/TeamContext";
import styles from "./index.module.scss";

// 团队接口
interface Team {
  id: string;
  name: string;
  avatar: string;
  scores: { [key: string]: number | undefined };
}

// 组件属性接口
interface TeamScoreCardProps {
  /** 游戏类型，用于显示对应游戏的得分 */
  gameType: string;
  /** 是否显示团队选择器 */
  showTeamSelector?: boolean;
  /** 团队选择器标题 */
  selectorTitle?: string;
  /** 选中的团队ID */
  selectedTeamId?: string;
  /** 团队选择变化回调 */
  onTeamChange?: (teamId: string) => void;
}

const TeamScoreCard: React.FC<TeamScoreCardProps> = ({
  gameType,
  showTeamSelector = false,
  selectorTitle = "选择团队",
  selectedTeamId,
  onTeamChange,
}) => {
  const { teams, updateTeamScore } = useTeam();

  // 处理分数变化
  const handleScoreChange = (teamId: string, value: number | null) => {
    if (value !== null) {
      updateTeamScore(teamId, gameType, value);
    }
  };
  return (
    <Card className={styles.scoreCard} title="团队得分">
      {teams.length === 0 ? (
        <div className={styles.noTeam}>请先在首页添加团队</div>
      ) : (
        <>
          {showTeamSelector && (
            <div className={styles.teamSelector}>
              <p>{selectorTitle}</p>
              <Select
                placeholder="选择团队"
                style={{ width: "100%" }}
                value={selectedTeamId || undefined}
                onChange={onTeamChange}
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
          )}
          <List
            className={styles.teamScoreList}
            dataSource={teams}
            renderItem={(team) => (
              <List.Item>
                <Space>
                  <Avatar src={team.avatar} />
                  <span>{team.name}</span>
                </Space>
                <div className={styles.scoreInput}>
                  <InputNumber
                    min={0}
                    value={team.scores[gameType] || 0}
                    onChange={(value) => handleScoreChange(team.id, value)}
                    addonAfter="分"
                    size="small"
                    style={{ width: 100 }}
                  />
                </div>
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
};

export default TeamScoreCard;
export type { TeamScoreCardProps, Team };
