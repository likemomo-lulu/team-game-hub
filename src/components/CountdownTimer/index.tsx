import React, { useState, useEffect } from "react";
import { Button, InputNumber, Space } from "antd";
import {
  ClockCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";

interface CountdownTimerProps {
  /** 默认倒计时时间（秒） */
  defaultTime?: number;
  /** 最小时间限制（秒） */
  minTime?: number;
  /** 最大时间限制（秒） */
  maxTime?: number;
  /** 倒计时结束时的回调函数 */
  onTimeEnd?: () => void;
  /** 倒计时状态变化的回调函数 */
  onStatusChange?: (isCountingDown: boolean) => void;
  /** 时间变化的回调函数 */
  onTimeChange?: (timeLeft: number) => void;
  /** 是否禁用组件 */
  disabled?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 音频文件路径 */
  audioSrc?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  defaultTime = 120,
  minTime = 1,
  maxTime = 300,
  onTimeEnd,
  onStatusChange,
  onTimeChange,
  disabled = false,
  className,
  audioSrc = "/audio/timer-end.wav",
}) => {
  const [countdownTime, setCountdownTime] = useState<number>(defaultTime);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(defaultTime);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    const audioElement = new Audio();
    audioElement.src = process.env.PUBLIC_URL + audioSrc;
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, [audioSrc]);

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);
        onTimeChange?.(newTimeLeft);

        if (newTimeLeft === 0) {
          setIsCountingDown(false);
          setIsPaused(false);
          onTimeEnd?.();
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(console.error);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [audio, isCountingDown, isPaused, timeLeft, onTimeEnd, onTimeChange]);

  // 状态变化回调
  useEffect(() => {
    onStatusChange?.(isCountingDown);
  }, [isCountingDown, onStatusChange]);

  // 切换倒计时状态
  const toggleCountdown = () => {
    if (isCountingDown) {
      // 停止倒计时
      setIsCountingDown(false);
      setIsPaused(false);
    } else {
      // 开始倒计时
      setTimeLeft(countdownTime);
      setIsCountingDown(true);
      setIsPaused(false);
    }
  };

  // 暂停/继续倒计时
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // 重置倒计时
  const resetCountdown = () => {
    setIsCountingDown(false);
    setIsPaused(false);
    setTimeLeft(countdownTime);
  };

  // 处理时间设置变化
  const handleTimeChange = (value: number | null) => {
    const newTime = value || defaultTime;
    setCountdownTime(newTime);
    if (!isCountingDown) {
      setTimeLeft(newTime);
    }
  };

  return (
    <div className={`${styles.countdownTimer} ${className || ""}`}>
      <Space size="middle">
        <InputNumber
          min={minTime}
          max={maxTime}
          value={countdownTime}
          onChange={handleTimeChange}
          disabled={isCountingDown || disabled}
          addonAfter="秒"
          className={styles.timeInput}
        />
        {isCountingDown ? (
          <>
            <div className={styles.timeLeft}>{timeLeft}秒</div>
            <Button
              type="default"
              icon={isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
              onClick={togglePause}
              disabled={disabled}
              className={styles.pauseButton}
            >
              {isPaused ? "继续" : "暂停"}
            </Button>
          </>
        ) : (
          <Button
            type="default"
            icon={<ClockCircleOutlined />}
            onClick={toggleCountdown}
            disabled={disabled}
          >
            开始倒计时
          </Button>
        )}
        {isCountingDown && (
          <Button
            type="default"
            onClick={resetCountdown}
            disabled={disabled}
            className={styles.resetButton}
          >
            重置
          </Button>
        )}
      </Space>
    </div>
  );
};

export default CountdownTimer;
