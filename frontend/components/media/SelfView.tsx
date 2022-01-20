import React from "react";
import { useStore } from "../../libs/store/useStore";
import { PeerView } from "./peer-view";

export function SelfView() {
  const { audioProducer, videoProducer } = useStore((state) => {
    return {
      audioProducer: state.micProducer,
      videoProducer: state.webcamProducer,
    };
  });

  return (
    <div>
      <PeerView
        audioTrack={audioProducer ? audioProducer.track : null}
        videoTrack={videoProducer ? videoProducer.track : null}
      />
    </div>
  );
}
