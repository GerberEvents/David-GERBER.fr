import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BrandingLayer } from "./components/BrandingLayer";
import { ProgressBar } from "./components/ProgressBar";
import { SubtitleLayer, SubtitleLine } from "./components/SubtitleLayer";
import { VideoLayer } from "./components/VideoLayer";

export interface TalkingHeadProps {
  // Chemin vers la vidéo SadTalker (dans /public)
  videoSrc?: string;
  // Echelle de la vidéo dans le cadre (0.7 = 70% de la hauteur)
  videoScale?: number;
  // Branding
  authorName?: string;
  authorTag?: string;
  accentColor?: string;
  // Sous-titres (générés manuellement ou via Whisper)
  subtitles?: SubtitleLine[];
  // Afficher la barre de progression
  showProgressBar?: boolean;
}

export const TalkingHeadVideo: React.FC<TalkingHeadProps> = ({
  videoSrc = "sadtalker_output.mp4",
  videoScale = 0.85,
  authorName = "David GERBER",
  authorTag = "@david.gerber",
  accentColor = "#E20613",
  subtitles = [],
  showProgressBar = true,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Couche vidéo (SadTalker output) avec fond flouté */}
      <VideoLayer src={videoSrc} scale={videoScale} />

      {/* Dégradé bas pour lisibilité des sous-titres */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 280,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Dégradé haut pour le branding */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 180,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Branding en haut */}
      <BrandingLayer
        name={authorName}
        tag={authorTag}
        position="top"
        accentColor={accentColor}
      />

      {/* Sous-titres */}
      {subtitles.length > 0 && (
        <SubtitleLayer subtitles={subtitles} color="#FFFFFF" />
      )}

      {/* Barre de progression */}
      {showProgressBar && <ProgressBar color={accentColor} />}
    </AbsoluteFill>
  );
};
