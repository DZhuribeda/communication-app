import { useEffect, useState } from "react";
import { RoomState } from "../../libs/entities/room";
import { useStore } from "../../libs/store/useStore";
import { Button } from "../core/button/button";
import { Size } from "../core/general";
import { Select } from "../core/select/select";
import { CameraPreview } from "../media/camera-preview";

function WebcamSelector() {
  const webcams = useStore((state) => state.webcams);
  const webcamsInProgress = useStore((state) => state.webcamsInProgress);
  const webcam = useStore((state) => state.webcam);
  const selectWebcam = useStore((state) => state.selectWebcam);
  const availbleWebcams = Array.from(webcams.keys()).map((webcamId) => ({
    id: webcamId,
    label: webcams.get(webcamId)?.label ?? "",
  }));
  return webcamsInProgress ? (
    <div>Detecting mics...</div>
  ) : (
    <Select
      label="Camera"
      options={availbleWebcams}
      selected={
        webcam
          ? {
              id: webcam.deviceId,
              label: webcam.label,
            }
          : null
      }
      setSelected={(option) => selectWebcam(option.id)}
      placeholder="Select a camera"
    />
  );
}

function MicSelector() {
  const mics = useStore((state) => state.mics);
  const micsInProgress = useStore((state) => state.micsInProgress);
  const mic = useStore((state) => state.mic);
  const selectMic = useStore((state) => state.selectMic);
  const availbleMics = Array.from(mics.keys()).map((micId) => ({
    id: micId,
    label: mics.get(micId)?.label ?? "",
  }));
  return micsInProgress ? (
    <div>Detecting microphone...</div>
  ) : (
    <Select
      label="Microphone"
      options={availbleMics}
      selected={
        mic
          ? {
              id: mic.deviceId,
              label: mic.label,
            }
          : null
      }
      setSelected={(option) => selectMic(option.id)}
      placeholder="Select a microphone"
    />
  );
}

function SpeakerSelector() {
  const speakers = useStore((state) => state.speakers);
  const speakersInProgress = useStore((state) => state.speakersInProgress);
  const speaker = useStore((state) => state.speaker);
  const selectSpeaker = useStore((state) => state.selectSpeaker);
  const availbleSpeakers = Array.from(speakers.keys()).map((speakerId) => ({
    id: speakerId,
    label: speakers.get(speakerId)?.label ?? "",
  }));
  return speakersInProgress ? (
    <div>Detecting speaker...</div>
  ) : (
    <Select
      label="Speaker"
      options={availbleSpeakers}
      selected={
        speaker
          ? {
              id: speaker.deviceId,
              label: speaker.label,
            }
          : null
      }
      setSelected={(option) => selectSpeaker(option.id)}
      placeholder="Select a speaker"
    />
  );
}

function MicrophonePreview({ getAudioLevel }: { getAudioLevel: () => number }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(getAudioLevel());
    }, 400);
    return () => clearInterval(interval);
  }, [getAudioLevel]);
  return <div>Current microphone level: {Math.round(level)}</div>;
}

function MicrophoneLevel() {
  const mic = useStore((state) => state.mic);
  const [micInitialization, setMicInitialization] = useState(false);
  const [getMicLevel, setGetMicLevel] = useState<() => number>(() => 0);
  useEffect(() => {
    async function initializeMic() {
      if (!mic) {
        return;
      }
      setMicInitialization(true);
      setGetMicLevel(() => () => 0);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          deviceId: mic.deviceId,
        },
      });
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.minDecibels = -127;
      analyser.maxDecibels = 0;
      analyser.smoothingTimeConstant = 0.4;
      audioSource.connect(analyser);
      const volumes = new Uint8Array(analyser.frequencyBinCount);
      const volumeCallback = () => {
        analyser.getByteFrequencyData(volumes);
        const volumeSum = volumes.reduce((acc, curr) => acc + curr, 0);
        const averageVolume = volumeSum / volumes.length;
        // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
        const volumePercent = (averageVolume * 100) / 127;
        return volumePercent;
      };
      setMicInitialization(false);
      setGetMicLevel(() => volumeCallback);
    }
    initializeMic();
    return () => {};
  }, [mic]);
  return <MicrophonePreview getAudioLevel={getMicLevel} />;
}

export function PreMedia() {
  const initiateWebcam = useStore((state) => state.initiateWebcam);
  const initiateMic = useStore((state) => state.initiateMic);
  const initiateSpeaker = useStore((state) => state.initiateSpeaker);
  const setRoomState = useStore((state) => state.setRoomState);

  useEffect(() => {
    initiateWebcam();
    initiateMic();
    initiateSpeaker();
  }, [initiateWebcam, initiateMic, initiateSpeaker]);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <MicrophoneLevel />
        <CameraPreview />
      </div>
      <div className="flex flex-col gap-2">
        <WebcamSelector />
        <MicSelector />
        <SpeakerSelector />
        <Button
          size={Size.md}
          onClick={() => {
            setRoomState(RoomState.entered);
          }}
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
