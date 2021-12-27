import create from 'zustand';
import { devtools } from 'zustand/middleware'

import { createConsumersSlice, ConsumersSlice } from './consumers';
import { createDeviceSlice, DeviceSlice } from './device';
import { createMicrophoneSlice, MicrophoneSlice } from './microphone';
import { createPeersSlice, PeersSlice } from './peers';
import { createRoomSlice, RoomSlice } from './room';
import { createTransportSlice, TransportSlice } from './transport';
import { createWebcamSlice, WebcamSlice } from './webcam';

export type AppState = DeviceSlice & RoomSlice & TransportSlice & MicrophoneSlice & WebcamSlice & PeersSlice & ConsumersSlice;

export const useStore = create<AppState>(devtools((set, get) => ({
    ...createDeviceSlice(set, get),
    ...createRoomSlice(set, get),
    ...createTransportSlice(set, get),
    ...createMicrophoneSlice(set, get),
    ...createWebcamSlice(set, get),
    ...createPeersSlice(set, get),
    ...createConsumersSlice(set, get),
})));