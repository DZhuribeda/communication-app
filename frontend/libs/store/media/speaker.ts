import { Producer } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { AppState } from "../useStore";
import { socket } from "../../socket";

export interface SpeakerSlice {
  speaker: MediaDeviceInfo | null;
  speakerTrackInitialization: boolean;
  speakerTrack: MediaStreamTrack | null;
  speakersInProgress: boolean;
  speakers: Map<string, MediaDeviceInfo>;
  initiateSpeaker: () => Promise<void>;
  selectSpeaker: (deviceId: string) => void;
  updateSpeakers: () => Promise<void>;
}

export const createSpeakerSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  speaker: null,
  speakerTrackInitialization: false,
  speakerTrack: null,
  speakersInProgress: false,
  speakers: new Map(),
  initiateSpeaker: async () => {
    await get().updateSpeakers();
    const speakers = get().speakers;
    const defaultSpeaker = Array.from(speakers.values())[0];
    set((state) => ({ ...state, speaker: defaultSpeaker ?? null }));
  },
  selectSpeaker: (deviceId: string) => {
    if (get().speaker?.deviceId === deviceId) {
      return;
    }
    if (!get().speakers.has(deviceId)) {
      throw new Error("Invalid deviceId");
    }
    set((state) => ({
      ...state,
      speaker: state.speakers.get(deviceId) ?? null,
    }));
  },
  updateSpeakers: async () => {
    console.debug("_updateSpeakers()");
    set((state) => ({ ...state, speakersInProgress: true }));
    // Reset the list.
    const speakers = new Map();

    console.debug("_updateSpeakers() | calling enumerateDevices()");

    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
      if (device.kind !== "audiooutput") continue;
      speakers.set(device.deviceId, device);
    }
    set((state) => ({ ...state, speakers, speakersInProgress: false }));
  },
});
