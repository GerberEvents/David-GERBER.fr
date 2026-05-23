import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface SubtitleLine {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface Props {
  subtitles: SubtitleLine[];
  color?: string;
  fontSize?: number;
}

export const SubtitleLayer: React.FC<Props> = ({
  subtitles,
  color = "#FFFFFF",
  fontSize = 52,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const current = subtitles.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  if (!current) return null;

  const fadeIn = spring({ frame: frame - current.startFrame, fps, config: { damping: 20 } });
  const fadeOut = interpolate(
    frame,
    [current.endFrame - 8, current.endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "0 32px",
        opacity,
        transform: `translateY(${interpolate(fadeIn, [0, 1], [12, 0])}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: 12,
          padding: "12px 24px",
          maxWidth: width - 64,
        }}
      >
        <p
          style={{
            color,
            fontSize,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 700,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.3,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {current.text}
        </p>
      </div>
    </div>
  );
};
