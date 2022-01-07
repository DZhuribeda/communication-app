import { io, Socket } from "socket.io-client";
import { useStore } from "./store/useStore";

// TODO: config
export const socket = io("http://127.0.0.1:4455", {
  withCredentials: true,
  reconnection: false,
});
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("newPeer", ({ id, displayName }) => {
  console.log("new peer");
  useStore.getState().addPeer({ id, displayName });
});

socket.on(
  "newConsumer",
  async (
    {
      peerId,
      producerId,
      id,
      kind,
      rtpParameters,
      type,
      appData,
      producerPaused,
    },
    cb
  ) => {
    console.log(`new conssumer ${id} producerId: ${producerId}`);
    await useStore.getState().addConsumer({
      peerId,
      producerId,
      id,
      kind,
      rtpParameters,
      type,
      appData,
      producerPaused,
    });
    console.debug("new consumer callback");
    cb({ test: "test" });
  }
);

socket.on("consumerClosed", ({ consumerId }) => {
  console.log("consumerClosed event");
  useStore.getState().onCloseConsumer(consumerId);
});
socket.on("consumerPaused", ({ consumerId }) => {
  console.log("consumerPaused event");
  useStore.getState().onPauseConsumer(consumerId);
});
socket.on("consumerResumed", ({ consumerId }) => {
  console.log("consumerResumed event");
  useStore.getState().onResumeConsumer(consumerId);
});
socket.on("peerClosed", ({ peerId }) => {
  console.log("peerClosed event");
  useStore.getState().removePeer(peerId);
});

// case 'consumerClosed':
//   {
//     const { consumerId } = notification.data;
//     const consumer = this._consumers.get(consumerId);

//     if (!consumer)
//       break;

//     consumer.close();
//     this._consumers.delete(consumerId);

//     const { peerId } = consumer.appData;

//     store.dispatch(
//       stateActions.removeConsumer(consumerId, peerId));

//     break;
//   }

//   case 'consumerPaused':
//   {
//     const { consumerId } = notification.data;
//     const consumer = this._consumers.get(consumerId);

//     if (!consumer)
//       break;

//     consumer.pause();

//     store.dispatch(
//       stateActions.setConsumerPaused(consumerId, 'remote'));

//     break;
//   }

//   case 'consumerResumed':
//   {
//     const { consumerId } = notification.data;
//     const consumer = this._consumers.get(consumerId);

//     if (!consumer)
//       break;

//     consumer.resume();

//     store.dispatch(
//       stateActions.setConsumerResumed(consumerId, 'remote'));

//     break;
//   }

export const asyncEmit = <SocketResponse>(
  socket: Socket,
  event: string,
  data: any = null
): Promise<SocketResponse> => {
  return new Promise((resolve, reject) => {
    socket.emit(event, data, (res: SocketResponse) => {
      resolve(res);
    });
  });
};
