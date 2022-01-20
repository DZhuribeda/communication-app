import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { SetState, GetState } from "zustand";
import { AppState } from "./../useStore";

export interface DeviceSlice {
  device: Device | null;
  createDevice: (device: RtpCapabilities) => Promise<Device>;
}

export const createDeviceSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  device: null,
  createDevice: async (rtpCapabilities: RtpCapabilities) => {
    const device = new Device();
    console.log("routerRtpCapabilities", rtpCapabilities);
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    set({ device });
    return device;
  },
});
