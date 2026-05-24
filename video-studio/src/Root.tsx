import React from "react";
import { Composition } from "remotion";
import { TalkingHeadVideo, TalkingHeadProps } from "./compositions/TalkingHeadVideo";

// Paramètres par défaut pour la prévisualisation dans Remotion Studio
const defaultProps: TalkingHeadProps = {
  videoSrc: "sadtalker_output.mp4",
  videoScale: 0.85,
  authorName: "David GERBER",
  authorTag: "@david.gerber",
  accentColor: "#E20613",
  showProgressBar: true,
  subtitles: [
    { text: "Bonjour ! 👋", startFrame: 0, endFrame: 60 },
    { text: "Voici ma dernière création.", startFrame: 65, endFrame: 130 },
    { text: "Découvrez mon portfolio →", startFrame: 135, endFrame: 200 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Format TikTok / Reels / Shorts — 9:16 Full HD */}
      <Composition
        id="TalkingHead_FullHD"
        component={TalkingHeadVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />

      {/* Format HD — plus léger pour la prévisualisation */}
      <Composition
        id="TalkingHead_HD"
        component={TalkingHeadVideo}
        durationInFrames={210}
        fps={30}
        width={720}
        height={1280}
        defaultProps={defaultProps}
      />

      {/* Format carré Instagram */}
      <Composition
        id="TalkingHead_Square"
        component={TalkingHeadVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ ...defaultProps, videoScale: 0.95 }}
      />
    </>
  );
};
