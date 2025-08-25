"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export function FlipCard({
  frontContent,
  backContent,
  className,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div
      className={cn(
        "relative w-full h-full cursor-pointer perspective-1000",
        className,
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
}
