"use client";
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface AudioPlayerContextProps {
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Persist play state across reloads
  useEffect(() => {
    const saved = localStorage.getItem("musicPlaying");
    if (saved === "true") setMusicPlaying(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("musicPlaying", musicPlaying ? "true" : "false");
  }, [musicPlaying]);

  return (
    <AudioPlayerContext.Provider value={{ musicPlaying, setMusicPlaying, audioRef }}>
      {children}
      {typeof window !== "undefined" && createPortal(
        <audio
          ref={audioRef}
          src="/music/light-music.mp3"
          loop
          style={{ display: "none" }}
        />,
        document.body
      )}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
};
