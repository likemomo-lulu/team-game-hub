import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Avatar,
  List,
  Space,
  Popconfirm,
  Divider,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useTeam } from "../../contexts/TeamContext";
import type { Team } from "../../contexts/TeamContext";
import styles from "./index.module.scss";

const Teams: React.FC = () => {
  const {
    teams,
    addTeam,
    removeTeam,
    resetTeams,
    updateTeamScore,
    getTotalScore,
    removeGameScores,
  } = useTeam();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddTeam = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const timestamp = Date.now();
      const defaultAvatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${timestamp}`;
      addTeam({
        name: values.name,
        avatar: values.avatar || defaultAvatar,
      });
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const [isGameScoreManageModalVisible, setIsGameScoreManageModalVisible] = useState(false);
  const [customGameName, setCustomGameName] = useState("");
  const [editingGameId, setEditingGameId] = useState("");
  const [customScores, setCustomScores] = useState<{ [key: string]: number }>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddGame, setShowAddGame] = useState(false);

  console.log("teams------", teams);

  // 获取所有游戏ID
  const getGameIds = () => {
    const allGameIds = new Set<string>();

    teams.forEach((team) => {
      Object.keys(team.scores).forEach((gameId) => {
        allGameIds.add(gameId);
      });
    });

    return Array.from(allGameIds);
  };

  const gameIds = getGameIds();

  const columns = [
    {
      title: "排名",
      key: "rank",
      render: (value: any, record: Team, index: number) => index + 1,
      width: 80,
      align: "center" as any,
    },
    {
      title: <div style={{display:'flex',justifyContent:'center'}}>团队</div>,
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Team) => (
        <Space>
          <Avatar src={record.avatar} size="large" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "总分",
      key: "total-score",
      align: "center" as any,
      render: (value: any, record: Team, index: number) => {
        const totalScore = getTotalScore(record);
        let trophyIcon;
        let scoreStyle;

        if (index === 0) {
          trophyIcon = <TrophyOutlined style={{ color: "#FFD700" }} />; // 金色奖杯
          scoreStyle = { color: "#FFD700", fontWeight: "bold" };
        } else if (index === 1) {
          trophyIcon = <TrophyOutlined style={{ color: "#C0C0C0" }} />; // 银色奖杯
          scoreStyle = { color: "#C0C0C0", fontWeight: "bold" };
        } else if (index === 2) {
          trophyIcon = <TrophyOutlined style={{ color: "#CD7F32" }} />; // 铜色奖杯
          scoreStyle = { color: "#CD7F32", fontWeight: "bold" };
        } else {
          trophyIcon = null;
          scoreStyle = { color: "#666666" };
        }

        return (
          <Space>
            {trophyIcon}
            <span style={scoreStyle}>{totalScore}</span>
          </Space>
        );
      },
      // sorter: (a: Team, b: Team) => getTotalScore(b) - getTotalScore(a),
      defaultSortOrder: "descend" as SortOrder,
    },
    // 动态生成游戏得分列
    ...gameIds.map((gameId) => ({
      title: `${gameId}得分`,
      key: `${gameId}-score`,
      align: "center" as any,
      render: (value: any, record: Team) => record.scores[gameId] || 0,
    })),
    {
      title: "操作",
      key: "action",
      align: "center" as any,
      render: (value: any, record: Team) => (
        <Popconfirm
          title="确定要删除这个团队吗？"
          onConfirm={() => removeTeam(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>团队设置</h1>
        <Space>
          <Button
            type="primary"
            icon={<TrophyOutlined />}
            onClick={() => setIsGameScoreManageModalVisible(true)}
          >
            游戏得分管理
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTeam}
            className={styles.addButton}
          >
            添加团队
          </Button>
          <Popconfirm
            title="确定要重置所有团队信息吗？"
            description="此操作将清空所有团队及其得分数据，且不可恢复。"
            onConfirm={resetTeams}
            okText="确定"
            cancelText="取消"
          >
            <Button type="default" danger icon={<ClearOutlined />}>
              重置团队
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Card className={styles.teamsCard}>
        <Table
          dataSource={teams}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "暂无团队，请添加团队" }}
        />
      </Card>

      <Modal
        title="添加团队"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="团队名称"
            rules={[{ required: true, message: "请输入团队名称" }]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item name="avatar" label="团队头像URL">
            <Input placeholder="请输入团队头像URL（可选）" />
          </Form.Item>
          <p className={styles.avatarTip}>
            如不填写，系统将自动从Unsplash获取随机图片作为头像
          </p>
        </Form>
      </Modal>

      <Modal
        title="游戏得分管理"
        open={isGameScoreManageModalVisible}
        onOk={() => {
          if (isEditMode && editingGameId) {
            teams.forEach((team) => {
              const score = customScores[team.id] || 0;
              updateTeamScore(team.id, editingGameId, score);
            });
          } else if (!isEditMode && customGameName.trim()) {
            teams.forEach((team) => {
              const score = customScores[team.id] || 0;
              updateTeamScore(team.id, customGameName.trim(), score);
            });
          }
          setEditingGameId("");
          setCustomGameName("");
          setCustomScores({});
          setIsGameScoreManageModalVisible(false);
          setIsEditMode(false);
          setShowAddGame(false);
        }}
        onCancel={() => {
          setEditingGameId("");
          setCustomGameName("");
          setCustomScores({});
          setIsGameScoreManageModalVisible(false);
          setIsEditMode(false);
          setShowAddGame(false);
        }}
        okText="确定"
        cancelText="取消"
      >
        {!showAddGame && !isEditMode && (
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                setShowAddGame(true);
                setIsEditMode(false);
                setEditingGameId("");
                setCustomGameName("");
                setCustomScores({});
              }}
            >
              添加新游戏
            </Button>
          </div>
        )}

        {showAddGame && !isEditMode && (
          <Form layout="vertical">
            <Form.Item
              label="游戏名称"
              required
              rules={[{ required: true, message: "请输入游戏名称" }]}
            >
              <Input
                placeholder="请输入自定义游戏名称"
                value={customGameName}
                onChange={(e) => setCustomGameName(e.target.value)}
              />
            </Form.Item>

            <h4>各团队得分：</h4>
            <List
              dataSource={teams}
              renderItem={(team) => (
                <List.Item>
                  <Space>
                    <Avatar src={team.avatar} />
                    <span>{team.name}</span>
                  </Space>
                  <Input
                    type="number"
                    min={0}
                    value={customScores[team.id] || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCustomScores((prev) => ({ ...prev, [team.id]: value }));
                    }}
                    style={{ width: 100 }}
                    addonAfter="分"
                  />
                </List.Item>
              )}
            />
          </Form>
        )}

        {(isEditMode || editingGameId) && (
          <div>
            <h4>编辑<span style={{ color: 'red' }}>{editingGameId}</span>游戏得分：</h4>
            <List
              dataSource={teams}
              renderItem={(team) => (
                <Space style={{ marginBottom: 8 }}>
                  <Avatar src={team.avatar} size="small" />
                  <span>{team.name}</span>
                  <Input
                    type="number"
                    min={0}
                    value={customScores[team.id] || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCustomScores((prev) => ({ ...prev, [team.id]: value }));
                    }}
                    style={{ width: 100 }}
                    addonAfter="分"
                  />
                </Space>
              )}
            />
          </div>
        )}

        <Divider />

        <List
          dataSource={gameIds}
          renderItem={(gameId) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    setEditingGameId(gameId);
                    setIsEditMode(true);
                    setCustomScores(
                      teams.reduce((acc, team) => ({
                        ...acc,
                        [team.id]: team.scores[gameId] || 0,
                      }), {})
                    );
                  }}
                >
                  编辑
                </Button>,
                <Popconfirm
                  title="确定要删除这个游戏的所有得分记录吗？"
                  onConfirm={() => removeGameScores(gameId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>,
              ].filter(Boolean)}
            >
              <div style={{ flex: 1 }}>
                {gameId}
              </div>
            </List.Item>
          )}
        />
      </Modal>


    </div>
  );
};

export default Teams;
