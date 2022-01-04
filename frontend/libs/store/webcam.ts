import { Producer } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { asyncEmit, socket } from "../socket";
import { AppState } from "./useStore";

const VIDEO_CONSTRAINS = {
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } },
};

// Used for simulcast webcam video.
const WEBCAM_SIMULCAST_ENCODINGS = [
  { scaleResolutionDownBy: 4, maxBitrate: 500000 },
  { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
  { scaleResolutionDownBy: 1, maxBitrate: 5000000 },
];

// Used for VP9 webcam video.
const WEBCAM_KSVC_ENCODINGS = [{ scalabilityMode: "S3T3_KEY" }];

type VIDEO_TYPES = keyof typeof VIDEO_CONSTRAINS;
export interface WebcamSlice {
  resolution: VIDEO_TYPES;
  webcam: MediaDeviceInfo | null;
  webcams: Map<string, MediaDeviceInfo>;
  webcamProducer: Producer | null;
  enableWebcam: () => Promise<void>;
  updateWebcams: () => Promise<void>;
  disableWebcam: () => Promise<void>;
  changeWebcam: () => Promise<void>;
  changeWebcamResolution: () => Promise<void>;
}

export const createWebcamSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  webcamProducer: null,
  webcams: new Map(),
  webcam: null,
  resolution: "hd" as VIDEO_TYPES,
  updateWebcams: async () => {
    console.debug("_updateWebcams()");

    // Reset the list.
    const webcams = new Map();

    console.debug("_updateWebcams() | calling enumerateDevices()");

    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
      if (device.kind !== "videoinput") continue;

      webcams.set(device.deviceId, device);
    }

    const array = Array.from(webcams.values());
    const len = array.length;
    const webcam = get().webcam;
    const currentWebcamId = webcam ? webcam.deviceId : undefined;

    console.debug("_updateWebcams() [webcams:%o]", array);

    if (len === 0) {
      set((state) => ({ webcam: null }));
    } else if (!webcams.has(currentWebcamId)) {
      set((state) => ({ webcam: array[0] }));
    }
    set((state) => ({ ...state, webcams }));
  },
  enableWebcam: async () => {
    console.debug("enableWebcam()");

    const webcamProducer = get().webcamProducer;
    if (webcamProducer) {
      return;
    }
    const device = get().device;
    if (!device) {
      console.log("no device");
      return;
    }
    if (!device.canProduce("video")) {
      console.error("enableWebcam() | cannot produce video");
      return;
    }

    let track;
    let webcamDevice;

    // store.dispatch(stateActions.setWebcamInProgress(true));

    try {
      await get().updateWebcams();
      const webcamDevice = get().webcam;
      const resolution = get().resolution;

      if (!webcamDevice) throw new Error("no webcam devices");

      console.debug("enableWebcam() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { ideal: webcamDevice.deviceId },
          ...VIDEO_CONSTRAINS[resolution],
        },
      });
      console.debug("enableWebcam() | calling getUserMedia() success");

      track = stream.getVideoTracks()[0];

      let encodings;
      let codec;
      const codecOptions = {
        videoGoogleStartBitrate: 1000,
      };
      const forceH264 = false;
      const forceVP9 = false;
      const useSimulcast = true;

      if (forceH264) {
        codec = get().device?.rtpCapabilities?.codecs?.find(
          (c) => c.mimeType.toLowerCase() === "video/h264"
        );

        if (!codec) {
          throw new Error("desired H264 codec+configuration is not supported");
        }
      } else if (forceVP9) {
        codec = get().device?.rtpCapabilities?.codecs?.find(
          (c) => c.mimeType.toLowerCase() === "video/vp9"
        );

        if (!codec) {
          throw new Error("desired VP9 codec+configuration is not supported");
        }
      }

      if (useSimulcast) {
        // If VP9 is the only available video codec then use SVC.
        const firstVideoCodec = get().device?.rtpCapabilities?.codecs?.find(
          (c) => c.kind === "video"
        );

        if (
          (forceVP9 && codec) ||
          firstVideoCodec?.mimeType.toLowerCase() === "video/vp9"
        ) {
          encodings = WEBCAM_KSVC_ENCODINGS;
        } else {
          encodings = WEBCAM_SIMULCAST_ENCODINGS;
        }
      }
      const sendTransport = get().sendTransport;
      if (!sendTransport) {
        console.error("enableWebcam() | no sendTransport");
        return;
      }
      console.debug("enableWebcam() | calling sendTransport.produce()");
      console.log(encodings, codecOptions, codec);
      const webcamProducer = await sendTransport.produce({
        track,
        encodings,
        codecOptions,
        codec,
      });
      console.debug("enableWebcam() | calling sendTransport.produce() success");
      // setInterval(() => {
      //     webcamProducer?.getStats().then((data) => console.log(data));
      // }, 1000);

      console.debug(
        "enableWebcam() | calling store.dispatch(stateActions.setWebcamProducer(webcamProducer))"
      );
      set((state) => ({ ...state, webcamProducer }));

      // store.dispatch(stateActions.addProducer(
      //     {
      //         id: this._webcamProducer.id,
      //         deviceLabel: device.label,
      //         type: this._getWebcamType(device),
      //         paused: this._webcamProducer.paused,
      //         track: this._webcamProducer.track,
      //         rtpParameters: this._webcamProducer.rtpParameters,
      //         codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
      //     }));
      webcamProducer.on("transportclose", () => {
        set((state) => ({ ...state, webcamProducer: null }));
      });

      webcamProducer.on("trackended", () => {
        // store.dispatch(requestActions.notify(
        //     {
        //         type: 'error',
        //         text: 'Webcam disconnected!'
        //     }));

        get()
          .disableWebcam()
          .catch(() => {});
      });
    } catch (error) {
      console.error("enableWebcam() | failed:%o", error);

      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Error enabling webcam: ${error}`
      //     }));

      if (track) {
        track.stop();
      }
    }

    // store.dispatch(stateActions.setWebcamInProgress(false));
  },
  disableWebcam: async () => {
    console.debug("disableWebcam()");
    const webcamProducer = get().webcamProducer;
    if (!webcamProducer) return;

    webcamProducer.close();

    // store.dispatch(
    //     stateActions.removeProducer(this._webcamProducer.id));

    try {
      const roomId = get().roomId;
      await asyncEmit(socket, "closeProducer", {
        roomId: roomId,
        producerId: webcamProducer.id,
      });
    } catch (error) {
      // TODO: handle error
      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Error closing server-side webcam Producer: ${error}`
      //     }));
    }
    set((state) => ({ ...state, webcamProducer: null }));
  },
  changeWebcam: async () => {
    console.debug("changeWebcam()");
    // store.dispatch(stateActions.setWebcamInProgress(true));

    try {
      await get().updateWebcams();

      const webcams = get().webcams;
      const array = Array.from(webcams.keys());
      const len = array.length;
      const webcam = get().webcam;
      if (!webcam) {
        console.error("changeWebcam() | no webcam device");
        return;
      }
      let idx = array.indexOf(webcam.deviceId);

      if (idx < len - 1) idx++;
      else idx = 0;

      const newWebcam = webcams.get(array[idx]);
      if (!newWebcam) {
        console.error("changeWebcam() | no new webcam device");
        return;
      }
      set((state) => ({ ...state, webcam: newWebcam, resolution: "hd" }));

      console.debug(
        "changeWebcam() | new selected webcam [device:%o]",
        newWebcam
      );

      if (!newWebcam) throw new Error("no webcam devices");

      // Closing the current video track before asking for a new one (mobiles do not like
      // having both front/back cameras open at the same time).
      const webcamProducer = get().webcamProducer;
      if (!webcamProducer) {
        console.error("changeWebcam() | no webcamProducer");
        return;
      }
      if (!webcamProducer.track) {
        console.error("changeWebcam() | no webcamProducer.track");
        return;
      }
      webcamProducer.track.stop();

      console.debug("changeWebcam() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: newWebcam.deviceId },
          ...VIDEO_CONSTRAINS[get().resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await webcamProducer.replaceTrack({ track });

      // store.dispatch(
      //     stateActions.setProducerTrack(this._webcamProducer.id, track));
    } catch (error) {
      console.error("changeWebcam() | failed: %o", error);
      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Could not change webcam: ${error}`
      //     }));
    }

    // store.dispatch(
    //     stateActions.setWebcamInProgress(false));
  },
  changeWebcamResolution: async () => {
    console.debug("changeWebcamResolution()");
    // store.dispatch(
    //     stateActions.setWebcamInProgress(true));

    try {
      let resolution: keyof typeof VIDEO_CONSTRAINS;
      switch (get().resolution) {
        case "qvga":
          resolution = "vga";
          break;
        case "vga":
          resolution = "hd";
          break;
        case "hd":
          resolution = "qvga";
          break;
        default:
          resolution = "hd";
      }
      set((state) => ({ ...state, resolution }));
      console.debug("changeWebcamResolution() | calling getUserMedia()");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: get().webcam?.deviceId },
          ...VIDEO_CONSTRAINS[resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await get().webcamProducer?.replaceTrack({ track });

      // store.dispatch(
      //     stateActions.setProducerTrack(this._webcamProducer.id, track));
    } catch (error) {
      console.error("changeWebcamResolution() | failed: %o", error);

      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Could not change webcam resolution: ${error}`
      //     }));
    }

    // store.dispatch(
    //     stateActions.setWebcamInProgress(false));
  },
});
