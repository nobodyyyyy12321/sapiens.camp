"use client";
import { useAudioPlayer } from "./audio-player-context";

export default function RecordPlayer() {
  const { musicPlaying, setMusicPlaying, audioRef } = useAudioPlayer();
  return (
    <div
      className="fixed top-4 left-[70px] z-60 flex flex-col items-center"
      style={{ width: 44, height: 44 }}
    >
      <button
        style={{
          width: 40,
          height: 40,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
        onClick={() => {
          if (!audioRef.current) return;
          if (!musicPlaying) {
            audioRef.current.play();
            setMusicPlaying(true);
          } else {
            audioRef.current.pause();
            setMusicPlaying(false);
          }
        }}
        aria-label={musicPlaying ? "停止音樂" : "播放音樂"}
      >
        {musicPlaying ? (
          // Stop button: square
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="10" y="10" width="20" height="20" fill="white" />
          </svg>
        ) : (
          // Play button: triangle
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="14,10 30,20 14,30" fill="white" />
          </svg>
        )}
      </button>
    </div>
  );
}
