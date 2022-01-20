import create from "zustand";
import { devtools } from "zustand/middleware";

import { createConsumersSlice, ConsumersSlice } from "./media/consumers";
import { createDeviceSlice, DeviceSlice } from "./media/device";
import { createMicrophoneSlice, MicrophoneSlice } from "./media/microphone";
import { createPeersSlice, PeersSlice } from "./media/peers";
import { createRoomSlice, RoomSlice } from "./media/room";
import { createTransportSlice, TransportSlice } from "./media/transport";
import { createWebcamSlice, WebcamSlice } from "./media/webcam";
import { createSpeakerSlice, SpeakerSlice } from "./media/speaker";

export type AppState = DeviceSlice &
  RoomSlice &
  TransportSlice &
  MicrophoneSlice &
  WebcamSlice &
  PeersSlice &
  SpeakerSlice &
  ConsumersSlice;

export const useStore = create<AppState>(
  devtools((set, get) => ({
    ...createDeviceSlice(set, get),
    ...createRoomSlice(set, get),
    ...createTransportSlice(set, get),
    ...createMicrophoneSlice(set, get),
    ...createWebcamSlice(set, get),
    ...createPeersSlice(set, get),
    ...createConsumersSlice(set, get),
    ...createSpeakerSlice(set, get),
  }))
);
