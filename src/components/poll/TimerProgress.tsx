import mainStyles from "./styles.module.css";

interface ITimerProgress {
  timer: number;
  progressColor?: string;
  styles?: React.CSSProperties;
}

export const TimerProgress = ({
  timer,
  progressColor = "#9ed157",
  styles,
}: ITimerProgress) => {
  return (
    <div
      style={{
        backgroundColor: progressColor,
        animationDuration: `${timer}s`,
        ...styles,
      }}
      className={mainStyles.vTrx6SideChat_timerProgress}
    />
  );
};
