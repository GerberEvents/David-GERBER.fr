import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  name?: string;
  tag?: string;
  position?: "top" | "bottom";
  accentColor?: string;
}

export const BrandingLayer: React.FC<Props> = ({
  name = "David GERBER",
  tag = "@david.gerber",
  position = "top",
  accentColor = "#E20613",
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(
    enter,
    [0, 1],
    [position === "top" ? -24 : 24, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        [position]: 48,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0 32px",
        gap: 16,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 6,
          height: 52,
          borderRadius: 3,
          background: accentColor,
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            letterSpacing: "-0.5px",
          }}
        >
          {name}
        </span>
        <span
          style={{
            color: accentColor,
            fontSize: 22,
            fontWeight: 600,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          {tag}
        </span>
      </div>
    </div>
  );
};
