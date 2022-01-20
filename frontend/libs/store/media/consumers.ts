import produce from "immer";
import { Consumer, RtpParameters, MediaKind } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { asyncEmit, socket } from "../../socket";
import { AppState } from "../useStore";

export interface ConsumersSlice {
  consumers: Record<string, Consumer>;
  addConsumer: (payload: ConsumerPayload) => Promise<Consumer>;
  pauseConsumer: (consumer: Consumer) => Promise<void>;
  onCloseConsumer: (consumerId: string) => Promise<void>;
  onPauseConsumer: (consumerId: string) => Promise<void>;
  onResumeConsumer: (consumerId: string) => Promise<void>;
}

type ConsumerPayload = {
  peerId: string;
  producerId: string;
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  type: string;
  appData: any;
  producerPaused: boolean;
};

export const createConsumersSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  consumers: {},
  addConsumer: async ({
    peerId,
    producerId,
    id,
    kind,
    rtpParameters,
    type,
    appData,
    producerPaused,
  }: ConsumerPayload): Promise<Consumer> => {
    // TODO: check from options
    // if (!this._consume) {
    //     reject(403, 'I do not want to consume');
    //     break;
    // }
    try {
      const recvTransport = get().recvTransport;
      if (!recvTransport) {
        throw new Error("recvTransport is not defined");
      }
      const consumer = await recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        appData: { ...appData, peerId }, // Trick.
      });

      set((state) => ({
        ...state,
        consumers: { ...state.consumers, [consumer.id]: consumer },
      }));

      consumer.on("transportclose", () => {
        set(
          produce((state) => {
            delete state.consumers[consumer.id];
          })
        );
      });

      // const { spatialLayers, temporalLayers } =
      //     parseScalabilityMode(consumer.rtpParameters.encodings?.[0].scalabilityMode);

      // store.dispatch(stateActions.addConsumer(
      //     {
      //         id: consumer.id,
      //         type: type,
      //         locallyPaused: false,
      //         remotelyPaused: producerPaused,
      //         rtpParameters: consumer.rtpParameters,
      //         spatialLayers: spatialLayers,
      //         temporalLayers: temporalLayers,
      //         preferredSpatialLayer: spatialLayers - 1,
      //         preferredTemporalLayer: temporalLayers - 1,
      //         priority: 1,
      //         codec: consumer.rtpParameters.codecs[0].mimeType.split('/')[1],
      //         track: consumer.track
      //     },
      //     peerId));

      // If audio-only mode is enabled, pause it.
      // if (consumer.kind === 'video' && store.getState().me.audioOnly) {
      //     get().pauseConsumer(consumer);
      // }
      return consumer;
    } catch (error) {
      console.error('"newConsumer" request failed:%o', error);

      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Error creating a Consumer: ${error}`
      //     }));

      throw error;
    }
  },
  pauseConsumer: async (consumer: Consumer) => {
    if (consumer.paused) {
      console.log("consumer is already paused");
      return;
    }
    console.log("pauseConsumer");
    try {
      await asyncEmit(socket, "pauseConsumer", { consumerId: consumer.id });
      // await this._protoo.request('pauseConsumer', { consumerId: consumer.id });
      consumer.pause();

      // store.dispatch(
      //     stateActions.setConsumerPaused(consumer.id, 'local'));
    } catch (error) {
      console.error("_pauseConsumer() | failed:%o", error);

      // store.dispatch(requestActions.notify(
      //     {
      //         type: 'error',
      //         text: `Error pausing Consumer: ${error}`
      //     }));
    }
  },
  onCloseConsumer: async (consumerId: string) => {
    const consumer = get().consumers[consumerId];
    if (!consumer) {
      return;
    }
    consumer.close();
    set(
      produce((state) => {
        delete state.consumers[consumerId];
      })
    );
  },
  onPauseConsumer: async (consumerId: string) => {
    const consumer = get().consumers[consumerId];
    if (!consumer) {
      return;
    }
    consumer.pause();
  },
  onResumeConsumer: async (consumerId: string) => {
    const consumer = get().consumers[consumerId];
    if (!consumer) {
      return;
    }
    consumer.resume();
  },
});
