import { Producer } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { AppState } from "./../useStore";
import { socket } from "./../../socket";

export interface MicrophoneSlice {
  mic: MediaDeviceInfo | null;
  micTrackInitialization: boolean;
  micTrack: MediaStreamTrack | null;
  micsInProgress: boolean;
  mics: Map<string, MediaDeviceInfo>;
  initiateMic: () => Promise<void>;
  selectMic: (deviceId: string) => void;
  updateMics: () => Promise<void>;

  micProducer: Producer | null;
  enableMic: () => Promise<void>;
  disableMic: () => Promise<void>;
}

export const createMicrophoneSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  mic: null,
  micTrackInitialization: false,
  micTrack: null,
  micsInProgress: false,
  mics: new Map(),
  initiateMic: async () => {
    await get().updateMics();
    const mics = get().mics;
    const defaultMic = Array.from(mics.values())[0];
    set((state) => ({ ...state, mic: defaultMic ?? null }));
  },
  selectMic: (deviceId: string) => {
    if (get().mic?.deviceId === deviceId) {
      return;
    }
    if (!get().mics.has(deviceId)) {
      throw new Error("Invalid deviceId");
    }
    set((state) => ({ ...state, mic: state.mics.get(deviceId) ?? null }));
  },
  updateMics: async () => {
    console.debug("_updateMics()");
    set((state) => ({ ...state, micsInProgress: true }));
    // Reset the list.
    const mics = new Map();

    console.debug("_updateMics() | calling enumerateDevices()");

    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
      if (device.kind !== "audioinput") continue;
      mics.set(device.deviceId, device);
    }
    set((state) => ({ ...state, mics, micsInProgress: false }));
  },
  createMicTrack: async () => {},

  micProducer: null,
  enableMic: async () => {
    console.log("enableMic");
    const device = get().device;
    if (!device) {
      console.log("no device");
      return;
    }
    let micProducer = get().micProducer;
    if (micProducer) {
      return;
    }

    if (!device.canProduce("audio")) {
      console.error("enableMic() | cannot produce audio");
      return;
    }

    let track;
    const sendTransport = get().sendTransport;
    try {
      console.debug("enableMic() | calling getUserMedia()");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      track = stream.getAudioTracks()[0];
      if (!sendTransport) {
        throw new Error("No sendTransport");
      }
      micProducer = await sendTransport.produce({
        track,
        codecOptions: {
          opusStereo: true,
          opusDtx: true,
        },
        // NOTE: for testing codec selection.
        // codec : this._mediasoupDevice.rtpCapabilities.codecs
        // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
      });

      // store.dispatch(stateActions.addProducer({
      //         id: micProducer.id,
      //         paused: micProducer.paused,
      //         track: micProducer.track,
      //         rtpParameters: micProducer.rtpParameters,
      //         codec: micProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
      //     }));

      micProducer.on("transportclose", () => {
        set((state) => ({ ...state, micProducer: null }));
      });

      micProducer.on("trackended", () => {
        // store.dispatch(requestActions.notify(
        //     {
        //         type: 'error',
        //         text: 'Microphone disconnected!'
        //     }));

        get()
          .disableMic()
          .catch(() => {});
      });
      set((state) => ({ ...state, micProducer }));
    } catch (error) {
      console.error("enableMic() | failed:%o", error);

      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Error enabling microphone: ${error}`
      //     }));

      if (track) {
        track.stop();
      }
    }
  },
  disableMic: async () => {
    console.debug("disableMic()");
    const micProducer = get().micProducer;
    if (!micProducer) {
      return;
    }

    micProducer.close();

    // store.dispatch(
    // 	stateActions.removeProducer(this._micProducer.id));

    // try {
    socket.emit("closeProducer", { producerId: micProducer.id });
    // }
    // catch (error)
    // {
    // 	store.dispatch(requestActions.notify(
    // 		{
    // 			type : 'error',
    // 			text : `Error closing server-side mic Producer: ${error}`
    // 		}));
    // }

    set((state) => ({ ...state, micProducer: null }));
  },
});
