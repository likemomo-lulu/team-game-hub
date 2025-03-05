import React, { useState, useEffect } from 'react';
import { Button, Card, InputNumber, Drawer, List, Space, Row, Col } from 'antd';
import { HistoryOutlined, RedoOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const speakGuessWords = [
  '纸巾', '挖掘机', '牛肉干', '刘姥姥初进大观园', '台球', '电话铃声', '理发师', '小霸王', '丸子', '蝴蝶', '工资', '山丘', '护肤品', '键盘侠', '螃蟹', '打酱油', '实验室', '篮球架', '沙滩排球', '豌豆', '减肥', '水龙头', '开关', '蜡烛', '狐狸', '李连杰', '金针菇', '牛肉面', '杭州', '睡觉', 'KTV', '口红', '兵马俑', '从这里开始', '升旗', '春联', '小白兔', '扣子', '橡皮擦', '榴莲', '跳舞', '树懒', '二郎神', '绿皮香蕉', '守株待兔', '台灯', '射击', '假货', '酸菜鱼', '山药', '打麻将', '脸盆', '哈利波特', '音响', '青花瓷', '华山论剑', '遛狗', '小天鹅', '刺猬', '化学', '果粒多', '守门员', '辛巴', '水蜜桃', '电吹风', '沙僧', '牛奶糖', '含情脉脉', '纸杯', '纣王', '到这里了', '刘姥姥初进大观园', '垃圾桶', '西红柿', '水壶', '跳伞', '电梯', '长颈鹿', '白雪公主', '甘蔗', '水浒传', '开门', '俯卧撑', '饼干', '包青天', '北极熊', '龙井虾仁', '酒鬼', '咖啡', '流星', '铲屎官', '眉来眼去', '透明胶', '来历不明', '全家桶', '酸辣粉', '梅兰芳', '外星人', '狗急跳墙', '护身符', '菠菜', '三明治', '干冰', '放虎归山', '话剧', '洋葱', '相框', '狼心狗肺', '金毛狮王', '蹭饭', '加油站', '大摇大摆', '麻婆豆腐', '明信片', '魔术', '大款', '司马光', '如鱼得水', '白骨精', '盲人摸象', '丘比特', '蓝色', '母鸡', '喷香水', '故宫', '灭火器', '左顾右盼', '围棋', '鹦鹉', '蒙娜丽莎', '画龙点睛', '假惺惺', '板栗', '阿凡提', '功夫', '东倒西歪', '胆小如鼠', '玫瑰', '流口水', '林黛玉', '树屋', '千千万万', '火车站', '请假', '炸鸡', '高新企业', '大草原', '桑葚', '端午', '秃顶', '二郎神', '体检', '灯笼', '相声', '林黛玉', '门铃', '大兴安岭', '爱你一万年', '遛狗', '捧场', '红领巾', '彩虹', '拔河', '克隆', '刮风', '抹布', '坐船', '恐龙', '光头强', '鸟瞰', '手抓饼', '手套', '摩天轮', '温度计', '开瓶器', '电风扇', '水池', '三杯鸡', '围裙', '葫芦娃', '巾帼不让须眉', '结婚请柬', '空格键', '世界杯', '杂技', '唐伯虎', '英雄联盟', '摸鱼', '越野车', '无人机', '喜羊羊', '五彩斑斓的黑', '莲藕', '小龙虾', '替罪羊', '嫦娥', '东北虎', '灰太狼', '烤红薯', '虾兵蟹将', '狮子座', '极光', '盗墓', '一无所有', '手忙脚乱', '仙人掌', 'Duang Duang Duang', '秋天的第一杯奶茶', '狼人杀', '打太极', '周杰伦', '手撕鸡', '开心果', '流星雨', '精卫填海', '小毛驴', '稻花香', '班花', '泰山', '破防了', '凡尔赛', '容嬷嬷', '狗不理包子', '乘风破浪的姐姐'
];

const actionGuessWords = [
  '目瞪口呆', '喜怒无常', '偷菜', '一石二鸟', '贵妃醉酒', '画饼充饥', '郎才女貌', '中大奖', '丢三落四', '姗姗来迟', '闻鸡起舞', '闭月羞花', '画饼充饥', '放风筝', '手舞足蹈', '虎口逃生', '金鸡独立', '狼心狗肺', '对牛弹琴', '斗地主', '抽刀断水', '一见钟情', '草木皆兵', '一心两用', '两小无猜', '做蛋糕', '愚公移山', '东施效颦', '霸王别姬', '八仙过海', '头重脚轻', '见钱眼开', '掌上明珠', '吃喝玩乐', '一手遮天', '一刀两断', '拔苗助长', '掩耳盗铃', '交头接耳', '化敌为友', '雾里看花', '指手画脚', '抢凳子', '一笑倾城', '小鸟依人', '草船借箭', '大摇大摆', '酸甜苦辣', '抢红包', '火烧眉毛', '打肿脸充胖子', '垂头丧气', '争先恐后', '摇头晃脑', '昂首挺胸', '幸灾乐祸', '恍然大悟', '快马加鞭', '压马路', '想入非非', '东倒西歪', '马踏飞燕', '一毛不拔', '挥汗如雨', '闭目养神', '回眸一笑', '比翼双飞', '扭秧歌', '顶天立地', '风吹草动', '从这里开始', '一五一十', '人山人海', '三心二意', '口是心非', '万水千山', '天高地厚', '心灵手巧', '甘拜下风', '吹风机', '过目不忘', '后羿射日', '精卫填海', '花好月圆', '兴高采烈', '闷闷不乐', '张牙舞爪', '了如指掌', '马不停蹄', '心平气和', '百发百中', '黑白分明', '放风筝', '呼风唤雨', '手忙脚乱', '四面八方', '良药苦口', '望眼欲穿', '钢铁直男', '吃瓜', '摆烂', '太极拳', '瞅你咋地', '抛媚眼', '纸上谈兵', '溜溜梅', '到这里了', '隔山打牛', '将心比心', '面壁思过', '翩翩起舞', '嫦娥奔月', '挖呀挖呀挖', '中秋节', '盲人摸象', '打麻将', '自拍', '如鱼得水', '自由女神像', '龙卷风', '满地找牙', '你是我的神', '干饭人', '直播带货', '冰糖葫芦', '长颈鹿', '撕名牌', '广播体操', '恋爱脑', '背黑锅', '靠脸吃饭', '爱的抱抱', '上蹿下跳', '虎视眈眈', '怒发冲冠', '如来神掌', '广场舞', '关公面前耍大刀', '五子棋', '你这是在玩火', '隐形眼镜', '泪流满面', '守口如瓶', '小白兔', '保温杯里放枸杞', '大鹏展翅', '得意洋洋'
];

const GuessWord: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [gameMode, setGameMode] = useState<'speak' | 'action'>('speak');
  const [countdownTime, setCountdownTime] = useState<number>(120); // 默认2分钟
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownTime);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ mode: string; word: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, timeLeft]);

  const handleWordSelect = () => {
    const words = gameMode === 'speak' ? speakGuessWords : actionGuessWords;
    const word = words[currentIndex];
    setCurrentWord(word);
    setHistory((prev) => [
      { mode: gameMode, word },
      ...prev.slice(0, 19),
    ]);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const toggleCountdown = () => {
    if (!isCountingDown) {
      setTimeLeft(countdownTime);
    }
    setIsCountingDown(!isCountingDown);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionButtons}>
        <Space size="large">
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryVisible(true)}
          >
            历史记录
          </Button>
          <Button
            type="link"
            icon={<RedoOutlined />}
            onClick={resetHistory}
          >
            重置记录
          </Button>
        </Space>
      </div>
      <div className={styles.timerSection}>
        <Space>
          <InputNumber
            min={1}
            max={300}
            value={countdownTime}
            onChange={(value) => setCountdownTime(value || 120)}
            disabled={isCountingDown}
            addonAfter="秒"
          />
          <Button
            type="default"
            icon={<ClockCircleOutlined />}
            onClick={toggleCountdown}
          >
            {isCountingDown ? `${timeLeft}秒` : '开始倒计时'}
          </Button>
        </Space>
      </div>
      
      <Card className={styles.wordCard}>
        <div className={styles.wordContent}>
          {currentWord || '准备'}
        </div>
      </Card>

      <div className={styles.controls}>
      <div className={styles.modeCards}>
          <Button type='default'  size="large" className={` ${gameMode === 'speak' ? styles.activeMode : ''} ${styles.speakCard}`}
            onClick={() => setGameMode('speak')}>
            你说我猜
          </Button>
          <Button           type='default'   size="large" className={` ${gameMode === 'action' ? styles.activeMode : ''} ${styles.actionCard}`}
            onClick={() => setGameMode('action')} >你划我猜</Button>
      </div>
        <Button
          type="primary"
          size="large"
          onClick={handleWordSelect}
        >
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
              <List.Item.Meta
                description={item.word}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};

export default GuessWord;