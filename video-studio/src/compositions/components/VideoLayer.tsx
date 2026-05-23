import React from "react";
import { OffthreadVideo, useVideoConfig } from "remotion";

interface Props {
  src: string;
  scale?: number;
}

export const VideoLayer: React.FC<Props> = ({ src, scale = 1 }) => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Fond flouté (même vidéo agrandie) */}
      <OffthreadVideo
        src={src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.4) saturate(1.5)",
          transform: "scale(1.1)",
        }}
      />
      {/* Vidéo principale centrée */}
      <OffthreadVideo
        src={src}
        style={{
          position: "relative",
          width: width * scale,
          height: height * scale,
          objectFit: "contain",
          borderRadius: 16,
        }}
      />
    </div>
  );
};
