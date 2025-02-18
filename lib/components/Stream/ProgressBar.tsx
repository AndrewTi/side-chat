import React, { useState, useRef } from "react";
import "./ProgressBar.css";

type TStyles = React.CSSProperties;

interface ProgressBarProps {
  progress: number;
  onSeek: (time: number) => void;
  styles: {
    progress?: TStyles;
    progressRange?: TStyles;
    progressThumb?: TStyles;
  };
}

export const ProgressBar = ({ progress, onSeek,styles }: ProgressBarProps) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progressPercent, setProgressPercent] = useState(100);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    setProgressPercent(+((clickX * 100) / rect.width).toFixed(2));
    onSeek((clickX * progress) / rect.width);
  };

  return (
    <div className="vTrx6Stream_progressContainer" onClick={handleSeek} style={styles?.progress}>
      <div className="vTrx6Stream_progressBar" ref={progressBarRef}>
        <div
          className="vTrx6Stream_progressRange"
          style={{ width: `${progressPercent}%`, ...styles?.progressRange }}
        />
      </div>
      <div
        className="vTrx6Stream_progressThumb"
        style={{ left: `${progressPercent}%`,...styles?.progressThumb }}
      />
    </div>
  );
};
