"use client";

import { useState } from "react";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FlipCard({
  frontContent,
  backContent,
  className = "",
  onClick,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  return (
    <div
      className={`relative cursor-pointer [perspective:1000px] ${className}`}
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          {frontContent}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {backContent}
        </div>
      </div>
    </div>
  );
}
