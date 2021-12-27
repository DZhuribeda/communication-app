import { DtlsParameters, IceCandidate, IceParameters, RtpCapabilities, SctpParameters } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { AppState } from "./useStore";
import { asyncEmit, socket } from '../socket';


const produce = true;
const consume = true;
const forceTcp = false;
const useDataChannel = true;

type JoinToRoomResponse = {
  roomId: string;
  participants: string[];
  rtpCapabilities: RtpCapabilities;
}

export interface RoomSlice {
  roomId: string;
  joinToRoom: () => Promise<void>;
}

export const createRoomSlice = (set: SetState<AppState>, get: GetState<AppState>) => ({
  roomId: 'testing',
  joinToRoom: async () => {
    const roomId = get().roomId;
    const data = await asyncEmit<JoinToRoomResponse>(socket, 'joinToRoom', { roomId });
    const device = await (get().createDevice(data.rtpCapabilities));
    if (produce) {
      const {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = await asyncEmit<{
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
      }>(socket, 'createWebRtcTransport', {
        roomId,
        forceTcp: forceTcp,
        producing: true,
        consuming: false,
        sctpCapabilities: useDataChannel
          ? device.sctpCapabilities
          : undefined
      });
      await get().createProducerWebRtcTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      });
    }
    if (consume) {
      const {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = await asyncEmit<{
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
      }>(socket, 'createWebRtcTransport', {
        roomId,
        forceTcp: forceTcp,
        producing: false,
        consuming: true,
        sctpCapabilities: useDataChannel
          ? device.sctpCapabilities
          : undefined
      });
      await get().createConsumerWebRtcTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      });
    }
    console.log('rtpCapabilities', device.rtpCapabilities)
    const { peers } = await asyncEmit<{ peers: any[] }>(socket, 'join', {
      roomId,
      // TODO: change to name
      displayName: 'username',
      // device          : this._device,
      rtpCapabilities: consume
        ? device.rtpCapabilities
        : undefined,
      sctpCapabilities: useDataChannel && consume
        ? device.sctpCapabilities
        : undefined
    });
    peers.forEach(peer => {
      get().addPeer(peer);
    }); 

    // store.dispatch(
    //     stateActions.setRoomState('connected'));

    // // Clean all the existing notifcations.
    // store.dispatch(
    //     stateActions.removeAllNotifications());

    // store.dispatch(requestActions.notify(
    //     {
    //         text    : 'You are in the room!',
    //         timeout : 3000
    //     }));
    // for (const peer of peers) {
    //     store.dispatch(
    //         stateActions.addPeer(
    //             { ...peer, consumers: [], dataConsumers: [] }));
    // }

    // Enable mic/webcam.
    if (produce) {
      // Set our media capabilities.
      // store.dispatch(stateActions.setMediaCapabilities(
      //     {
      //         canSendMic: this._mediasoupDevice.canProduce('audio'),
      //         canSendWebcam: this._mediasoupDevice.canProduce('video')
      //     }));

      // enableMic();

      // const devicesCookie = cookiesManager.getDevices();

      // if (!devicesCookie || devicesCookie.webcamEnabled || this._externalVideo)
      get().enableWebcam();

      const sendTransport = get().sendTransport;
      if (!sendTransport) {
        throw new Error('No sendTransport');
      }
      sendTransport.on('connectionstatechange', (connectionState) => {
        if (connectionState === 'connected') {
          // TODO
          // this.enableChatDataProducer();
        }
      });
    }
  }
});
