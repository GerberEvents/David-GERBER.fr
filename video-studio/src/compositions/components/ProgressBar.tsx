import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  color?: string;
}

export const ProgressBar: React.FC<Props> = ({ color = "#E20613" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  const progress = frame / (durationInFrames - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 5,
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: color,
          borderRadius: "0 3px 3px 0",
          boxShadow: `0 0 8px ${color}`,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};
