import React, { useEffect, useRef, useState } from "react";
import { VIDEO_CONSTRAINS } from "../../libs/store/media/webcam";
import { useStore } from "../../libs/store/useStore";

export function CameraPreview() {
  const videoElem = useRef<HTMLVideoElement>(null);
  const webcam = useStore((state) => state.webcam);
  const resolution = useStore((state) => state.resolution);
  const [websteamInitialization, setWebsteamInitialization] =
    useState<boolean>(false);

  useEffect(() => {
    let stream = null as MediaStream | null;
    if (!videoElem.current || !webcam) {
      return;
    }
    async function playVideo() {
      if (!videoElem.current || !webcam) {
        return;
      }
      setWebsteamInitialization(true);
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: webcam.deviceId,
          ...VIDEO_CONSTRAINS[resolution],
        },
      });
      videoElem.current.srcObject = stream;

      videoElem.current.oncanplay = () => {};

      videoElem.current.onplay = () => {};

      videoElem.current
        .play()
        .catch((error) => console.warn("videoElem.play() failed:%o", error));
      setWebsteamInitialization(false);
    }
    playVideo();
    return () => {
      if (!stream) {
        return;
      }
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    };
  }, [videoElem, webcam, resolution]);
  return !webcam ? (
    <div>Webcam is not selected</div>
  ) : (
    <>
      <div>
        <video ref={videoElem} autoPlay playsInline muted controls={false} />
      </div>
      {websteamInitialization ? <div>Webcam is initializing</div> : null}
    </>
  );
}
