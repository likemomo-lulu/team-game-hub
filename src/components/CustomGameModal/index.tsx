import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Radio } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { TextArea } = Input;

export interface CustomGameData {
  gameName: string;
  gameType: "qa" | "open"; // qa: 问答模式(有答案), open: 开放模式(无答案)
  questions: string[];
  answers?: string[]; // 问答模式时需要答案
}

interface CustomGameModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (gameData: CustomGameData) => void;
}

const CustomGameModal: React.FC<CustomGameModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  const [gameType, setGameType] = useState<"qa" | "open">("open");
  const [questionsText, setQuestionsText] = useState("");
  const [answersText, setAnswersText] = useState("");

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const questions = questionsText
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);
      if (questions.length === 0) {
        message.info("请至少输入一个题目");
        return;
      }
      let answers: string[] | undefined;
      if (gameType === "qa") {
        answers = answersText
          .split("\n")
          .map((a) => a.trim())
          .filter((a) => a.length > 0);
        if (answers.length !== questions.length) {
          message.info("题目和答案的数量必须一致");
          return;
        }
      }
      const gameData: CustomGameData = {
        gameName: values.gameName,
        gameType,
        questions,
        answers,
      };
      onConfirm(gameData);
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setGameType("open");
    setQuestionsText("");
    setAnswersText("");
    onCancel();
  };

  return (
    <Modal
      title="创建自定义游戏"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText="创建游戏"
      cancelText="取消"
      className={styles.customGameModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          gameName: "",
          gameType: "open",
        }}
      >
        <Form.Item
          label="游戏名称"
          name="gameName"
          rules={[
            { required: true, message: "请输入游戏名称" },
            { max: 20, message: "游戏名称不能超过20个字符" },
          ]}
        >
          <Input placeholder="请输入游戏名称" />
        </Form.Item>

        <Form.Item label="游戏模式" name="gameType">
          <Radio.Group
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            <Radio value="open">开放模式（无标准答案）</Radio>
            <Radio value="qa">问答模式（有标准答案）</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="题目列表" required>
          <TextArea
            value={questionsText}
            onChange={(e) => setQuestionsText(e.target.value)}
            placeholder="请输入题目，每行一个题目\n例如：\n什么动物最容易贴在墙上？\n什么东西越洗越脏？"
            rows={6}
          />
          <div className={styles.tip}>提示：每行输入一个题目</div>
        </Form.Item>

        {gameType === "qa" && (
          <Form.Item label="答案列表" required>
            <TextArea
              value={answersText}
              onChange={(e) => setAnswersText(e.target.value)}
              placeholder="请输入答案，每行一个答案，与题目顺序对应\n例如：\n海豹（海报）\n水"
              rows={6}
            />
            <div className={styles.tip}>
              提示：每行输入一个答案，答案顺序要与题目一一对应
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CustomGameModal;
