import React, { useEffect, useRef, useState } from "react";
import "./VolumeProgressBar.css";

type TStyles = React.CSSProperties;

interface VolumeProgressBarProps {
  volume: number;
  onVolumeChange: (time: number) => void;
  styles: {
    progress?: TStyles;
    progressRange?: TStyles;
    progressThumb?: TStyles;
  };
}

export const VolumeProgressBar = ({
  volume,
  onVolumeChange,
  styles,
}: VolumeProgressBarProps) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progressPercent, setProgressPercent] = useState(volume * 100);

  useEffect(() => {
    setProgressPercent(volume * 100);
  }, [volume]);

  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = (clientX: number) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;

    const newVolume = +((clickX * 100) / rect.width).toFixed(2);

    if (newVolume > 100 || newVolume < 0) return;

    setProgressPercent(newVolume);
    onVolumeChange(newVolume / 100);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateProgress(event.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="vTrx6Stream_volume-progressContainer"
      onClick={(e) => updateProgress(e.clientX)}
      style={styles?.progress}
    >
      <div className="vTrx6Stream_volume-progressBar" ref={progressBarRef}>
        <div
          className="vTrx6Stream_volume-progressRange"
          style={{ width: `${progressPercent}%`, ...styles?.progressRange }}
        />
      </div>
      <div
        className="vTrx6Stream_volume-progressThumb"
        style={{ left: `${progressPercent}%`, ...styles?.progressThumb }}
        onMouseDown={() => setIsDragging(true)}
      />
    </div>
  );
};
