"use client";
import { useAudioPlayer } from "./audio-player-context";

  const { musicPlaying, setMusicPlaying, audioRef } = useAudioPlayer();
  return (
    <div
      className="fixed top-4 left-[70px] z-60 flex flex-col items-center"
      style={{ width: 44, height: 44 }}
    >
      <div style={{ position: "relative", width: 40, height: 40 }}>
        <img
          src="/icons/record-player.svg"
          alt="唱片機"
          className="w-10 h-10 mb-1"
          style={{ filter: "drop-shadow(0 0 2px #fff)" }}
        />
        {/* Tonearm animation */}
        <svg
          width="40"
          height="40"
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "auto", cursor: "pointer", zIndex: 2 }}
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
        >
          <g
            style={{
              transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
              transform: musicPlaying ? "rotate(30deg)" : "rotate(-30deg)",
              transformOrigin: "8px 8px",
            }}
          >
            <rect x="7" y="7" width="2" height="18" fill="#fff" rx="1" />
            <circle cx="8" cy="7" r="2" fill="#fff" />
            <rect x="7" y="25" width="6" height="2" fill="#fff" rx="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}
