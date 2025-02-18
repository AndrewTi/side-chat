import { useEffect, useRef, useState } from "react";
import { create, MediaPlayer, PlayerEventType } from "amazon-ivs-player";
import { ProgressBar } from "./ProgressBar";

import { FaPlay } from "react-icons/fa";
import { GiPauseButton } from "react-icons/gi";
import { FaVolumeUp } from "react-icons/fa";
import { HiVolumeOff } from "react-icons/hi";
// import { RiFullscreenFill } from "react-icons/ri";

import wasmWorkerPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js?url";
import wasmBinaryPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm?url";

import mainStyles from "./styles.module.css";

type TStyles = React.CSSProperties;
interface IStreamProps {
  streamUrl: string;
  styles?: {
    mainBlock?: TStyles;
    videoBlock?: TStyles;
    controlsBlock?: TStyles;
    progress?: TStyles;
    progressRange?: TStyles;
    progressThumb?: TStyles;
    controls?: TStyles;
    controlButtonsBlock?: TStyles;
    controlButton?: TStyles;
    controlVolume?: TStyles;
    controlLive?: TStyles;
  };
}

export function Stream({ streamUrl, styles }: IStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<MediaPlayer>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoRef.current || !create) return;

    const ivsPlayer = create({
      wasmWorker: wasmWorkerPath,
      wasmBinary: wasmBinaryPath,
    });

    ivsPlayer.attachHTMLVideoElement(videoRef.current);
    ivsPlayer.load(streamUrl);
    ivsPlayer.setVolume(volume);

    ivsPlayer.addEventListener(PlayerEventType.TIME_UPDATE, () => {
      setProgress(ivsPlayer.getPosition());
    });

    setPlayer(ivsPlayer);

    return () => {
      ivsPlayer.pause();
      ivsPlayer.removeEventListener(PlayerEventType.TIME_UPDATE, () => {
        setProgress(ivsPlayer.getPosition());
      });
      ivsPlayer.delete();
    };
  }, [streamUrl]);

  const togglePlayPause = () => {
    if (!player) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    player?.setVolume(newVolume);
  };

  const handleMute = (newVolume: number) => {
    setVolume(newVolume);
    player?.setVolume(newVolume);
  };

  const handleSeek = (time: number) => {
    if (player) {
      player?.seekTo(time);
    }
  };

  return (
    <div className={mainStyles.vTrx6Stream_stream} style={styles?.mainBlock}>
      <video
        ref={videoRef}
        className={mainStyles.vTrx6Stream_streamVideo}
        playsInline
        style={styles?.videoBlock}
      />

      <div
        className={mainStyles.vTrx6Stream_controlsContainer}
        style={styles?.controlsBlock}
      >
        <ProgressBar
          progress={progress}
          onSeek={handleSeek}
          styles={{
            progress: styles?.progress,
            progressRange: styles?.progressRange,
            progressThumb: styles?.progressThumb,
          }}
        />

        <div
          className={mainStyles.vTrx6Stream_controls}
          style={styles?.controls}
        >
          <div
            className={mainStyles.vTrx6Stream_controlBtns}
            style={styles?.controlButtonsBlock}
          >
            <button
              className={mainStyles.vTrx6Stream_button}
              onClick={togglePlayPause}
              style={styles?.controlButton}
            >
              {isPlaying ? (
                <GiPauseButton
                  color={styles?.controlButton?.color || "#fff"}
                  size={18}
                />
              ) : (
                <FaPlay
                  color={styles?.controlButton?.color || "#fff"}
                  size={18}
                />
              )}
            </button>

            <div
              className={mainStyles.vTrx6Stream_controlsVolume}
              style={styles?.controlVolume}
            >
              <button
                className={mainStyles.vTrx6Stream_button}
                onClick={() => handleMute(volume > 0 ? 0 : 1)}
                style={styles?.controlButton}
              >
                {volume > 0 ? (
                  <FaVolumeUp
                    color={styles?.controlButton?.color || "#fff"}
                    size={18}
                  />
                ) : (
                  <HiVolumeOff
                    color={styles?.controlButton?.color || "#fff"}
                    size={18}
                  />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={mainStyles.vTrx6Stream_volumeRange}
                style={{
                  background: `linear-gradient(to right, #fff ${
                    volume * 100
                  }%, #333 ${volume * 100}%)`,
                }}
              />
            </div>
          </div>

          <div
            className={mainStyles.vTrx6Stream_live}
            style={styles?.controlLive}
          >
            <div className={mainStyles.vTrx6Stream_liveCircle} />
            <span>live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
