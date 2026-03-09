"use client";
import { useAudioPlayer } from "./audio-player-context";

export default function RecordPlayer() {
  const { musicPlaying, setMusicPlaying, audioRef } = useAudioPlayer();
  return (
    <div
      className="fixed top-4 left-[70px] z-60 flex flex-col items-center"
      style={{ width: 44, height: 44 }}
    >
      <div style={{ position: "relative", width: 40, height: 40 }}>
        <img
          src="/icons/Record_player_(77801)_-_The_Noun_Project.svg"
          alt="唱片機"
          className="w-14 h-14 mb-1 transition-transform duration-700"
          style={{ filter: "invert(1) brightness(2)", transform: musicPlaying ? "scale(1.05) rotate(5deg)" : "scale(1) rotate(0deg)" }}
        />
          {/* Overlay transparent SVG for clickable tonearm animation, rectangle only, anchored at original tonearm circle center */}
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
                transition: "transform 0.7s cubic-bezier(.4,2,.6,1)",
                transform: musicPlaying ? "rotate(32deg)" : "rotate(-32deg)",
                transformOrigin: "8px 8px",
              }}
            >
              <rect x="7" y="7" width="2" height="18" fill="transparent" />
            </g>
          </svg>
      </div>
    </div>
  );
}
