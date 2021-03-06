import React from "react";
import { useStore } from "../../libs/store/useStore";
import { PeerView } from "./peer-view";

export function Peer({ id }: { id: string }) {
  const { audioProducer, videoProducer } = useStore((state) => {
    return {
      audioProducer: Object.values(state.consumers).find(
        (consumer) =>
          consumer.appData.peerId === id && consumer.kind === "audio"
      ),
      videoProducer: Object.values(state.consumers).find(
        (consumer) =>
          consumer.appData.peerId === id && consumer.kind === "video"
      ),
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
