"use client";
import React from "react";

const ShareIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block" }}
  >
    {/* 三個白圓圈 */}
    <circle cx="8" cy="24" r="4" fill="#fff" />
    <circle cx="24" cy="24" r="4" fill="#fff" />
    <circle cx="16" cy="8" r="4" fill="#fff" />
    {/* 兩條白線 */}
    <line x1="16" y1="8" x2="8" y2="24" stroke="#fff" strokeWidth="2.5" />
    <line x1="16" y1="8" x2="24" y2="24" stroke="#fff" strokeWidth="2.5" />
  </svg>
);

export default ShareIcon;
