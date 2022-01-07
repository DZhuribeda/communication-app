import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'mediasoup/node/lib/Worker';
import { Router } from 'mediasoup/node/lib/Router';
import { mediasoupConfig } from './config';
import {
  DtlsParameters,
  MediaKind,
  Producer,
  RtpCapabilities,
  RtpParameters,
  SctpCapabilities,
  WebRtcTransport,
  Consumer,
  DataProducer,
  DataConsumer,
} from 'mediasoup/node/lib/types';

type UserPeer = {
  id: string;
  socket: any;
  displayName?: string;
  rtpCapabilities?: RtpCapabilities;
  sctpCapabilities?: SctpCapabilities;
  joined: boolean;
  transports: Record<string, WebRtcTransport>;
  producers: Record<string, Producer>;
  consumers: Record<string, Consumer>;
  dataProducers: Record<string, DataProducer>;
  dataConsumers: Record<string, DataConsumer>;
};

type MediaRoom = {
  id: string;
  router: Router;
  peers: UserPeer[];
};

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private rooms = {} as Record<string, MediaRoom>;
  constructor(private readonly worker: Worker) {}

  _getJoinedPeers(room: MediaRoom, excludedUserId: string) {
    this.logger.log(
      `_getJoinedPeers ${room.peers.length} ${room.peers
        .filter((peer) => peer.id !== excludedUserId)
        .map((p) => p.id)}`,
    );
    return room.peers.filter((peer) => peer.id !== excludedUserId);
  }

  _getCurrentPeer(room: MediaRoom, userId: string) {
    return room.peers.find((peer) => peer.id === userId);
  }
  async deleteUserFromRooms(userId: string) {
    this.logger.log(`deleteUserFromRooms ${userId}`);

    for (const room of Object.values(this.rooms)) {
      const peer = room.peers.find((peer) => peer.id === userId);
      if (peer) {
        room.peers = room.peers.filter((peer) => peer.id !== userId);
        if (!peer.joined) {
          continue;
        }
        for (const otherPeer of this._getJoinedPeers(room, userId)) {
          otherPeer.socket.emit('peerClosed', { peerId: peer.id });
          // .catch(() => { });
        }

        // Iterate and close all mediasoup Transport associated to this Peer, so all
        // its Producers and Consumers will also be closed.
        Object.values(peer.transports).forEach((transport) => {
          transport.close();
        });
        this.logger.log(`user "${userId}" deleted from room "${room.id}"`);
        // If this is the latest Peer in the room, close the room.
        if (room.peers.length === 0) {
          this.logger.log(
            `last Peer in the room left, closing the room [roomId:${room.id}]`,
          );

          room.router.close();
          delete this.rooms[room.id];
        }
      }
    }
  }

  async createRoom(
    socket: any,
    userId: string,
    roomId: string,
  ): Promise<MediaRoom> {
    const router = await this.worker.createRouter({
      ...mediasoupConfig.routerOptions,
    });
    const room = {
      id: roomId,
      router,
      peers: [
        {
          socket,
          id: userId,
          joined: false,
          transports: {},
          producers: {},
          consumers: {},
          dataProducers: {},
          dataConsumers: {},
        },
      ],
    };
    this.rooms[roomId] = room;
    return room;
  }

  async getRoom(roomId: string): Promise<MediaRoom> {
    return this.rooms[roomId];
  }

  async joinToRoom(socket: any, userId: string, roomId: string) {
    let room = await this.getRoom(roomId);
    if (!room) {
      room = await this.createRoom(socket, userId, roomId);
      return;
    }
    room.peers = room.peers.filter((peer) => peer.id !== userId);
    room.peers.push({
      id: userId,
      socket,
      joined: false,
      transports: {},
      producers: {},
      consumers: {},
      dataProducers: {},
      dataConsumers: {},
    });
  }

  async getRtpCapabilities(roomId: string) {
    const room = await this.getRoom(roomId);
    return room.router.rtpCapabilities;
  }

  async createWebRtcTransport(
    userId: string,
    roomId: string,
    forceTcp: boolean,
    producing: boolean,
    consuming: boolean,
    sctpCapabilities: any,
  ) {
    const room = await this.getRoom(roomId);

    const webRtcTransportOptions = {
      ...mediasoupConfig.webRtcTransportOptions,
      enableSctp: Boolean(sctpCapabilities),
      numSctpStreams: (sctpCapabilities || {}).numStreams,
      appData: { producing, consuming },
      enableUdp: true,
      enableTcp: false,
    };

    if (forceTcp) {
      webRtcTransportOptions.enableUdp = false;
      webRtcTransportOptions.enableTcp = true;
    }
    const transport = await room.router.createWebRtcTransport(
      webRtcTransportOptions,
    );
    // setInterval(() => {
    //     transport?.getStats().then(stats => {
    //         this.logger.log(`transport ${transport.id} stats ${JSON.stringify(stats)}`);
    //     });
    // }, 1000);

    transport.on('sctpstatechange', (sctpState) => {
      this.logger.log(
        `WebRtc Transport "sctpstatechange" event [sctpState:${sctpState}]`,
      );
    });

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'failed' || dtlsState === 'closed')
        this.logger.warn(
          `WebRtcTransport "dtlsstatechange" event [dtlsState:${dtlsState}]`,
        );
    });

    // NOTE: For testing.
    // await transport.enableTraceEvent(['probation', 'bwe']);
    // transport.on('trace', (trace) => {
    //     this.logger.log(
    //         `transport "trace" event [transportId:${transport.id}, trace.type:${trace.type}, trace:${JSON.stringify(trace)}]`);

    //     if (trace.type === 'bwe' && trace.direction === 'out') {
    //         const socket = room.peers.find(peer => peer.id === userId).socket;
    //         socket.emit('downlinkBwe', {
    //             desiredBitrate: trace.info.desiredBitrate,
    //             effectiveDesiredBitrate: trace.info.effectiveDesiredBitrate,
    //             availableBitrate: trace.info.availableBitrate
    //         });
    //     }
    // });
    const currentPeer = this._getCurrentPeer(room, userId);
    currentPeer.transports[transport.id] = transport;

    const { maxIncomingBitrate } = mediasoupConfig.webRtcTransportOptions;

    // If set, apply max incoming bitrate limit.
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  async connectWebRtcTransport(
    userId: string,
    roomId: string,
    transportId: string,
    dtlsParameters: DtlsParameters,
  ) {
    this.logger.log(`connectWebRtcTransport ${transportId} ${dtlsParameters}`);
    const room = await this.getRoom(roomId);
    const currentPeer = this._getCurrentPeer(room, userId);
    const transport = currentPeer.transports[transportId];

    if (!transport) {
      throw new Error(`transport with id "${transportId}" not found`);
    }
    this.logger.log('Connecting transport');
    await transport.connect({ dtlsParameters });
    this.logger.log('Connecting transport success');
    return { status: 'ok' };
  }

  async produce(
    userId: string,
    roomId: string,
    transportId: string,
    kind: MediaKind,
    rtpParameters: RtpParameters,
    appData: any,
  ) {
    this.logger.log('Creating producer');
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error(`room with id "${roomId}" not found`);
    }
    const currentPeer = this._getCurrentPeer(room, userId);
    // Ensure the Peer is joined.
    if (!currentPeer.joined) throw new Error('Peer not yet joined');

    const transport = currentPeer.transports[transportId];

    if (!transport) {
      throw new Error(`transport with id "${transportId}" not found`);
    }

    // Add peerId into appData to later get the associated Peer during
    // the 'loudest' event of the audioLevelObserver.
    appData = { ...appData, userId: userId };

    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData,
      // keyFrameRequestDelay: 5000
    });
    this.logger.log(`Producer created, ${producer.score}`);

    currentPeer.producers[producer.id] = producer;

    // Set Producer events.
    producer.on('score', (score) => {
      this.logger.log(
        `producer "score" event [producerId:${producer.id}: ${score}]`,
      );
      const socket = room.peers.find((peer) => peer.id === userId).socket;

      socket.emit('producerScore', { producerId: producer.id, score });
      // TODO: handle error
      // .catch(() => {});
    });

    producer.on('videoorientationchange', (videoOrientation) => {
      this.logger.log(
        `producer "videoorientationchange" event [producerId:${producer.id}, videoOrientation:${videoOrientation}]`,
      );
    });

    // NOTE: For testing.
    // await producer.enableTraceEvent([ 'rtp', 'keyframe', 'nack', 'pli', 'fir' ]);
    // await producer.enableTraceEvent([ 'pli', 'fir' ]);
    // await producer.enableTraceEvent([ 'keyframe' ]);

    producer.on('trace', (trace) => {
      this.logger.log(
        `producer "trace" event [producerId:${producer.id}, trace.type:${trace.type}, trace:${trace}]`,
      );
    });

    // Optimization: Create a server-side Consumer for each Peer.
    for (const otherPeer of this._getJoinedPeers(room, userId)) {
      this.logger.log(`Creating Consumer for peer ${otherPeer.id}`);
      this._createConsumer({
        room,
        consumerPeer: otherPeer,
        producerPeer: currentPeer,
        producer,
      });
    }

    // TODO: handle audioLevelObserver
    // Add into the audioLevelObserver.
    // if (producer.kind === 'audio') {
    //     this._audioLevelObserver.addProducer({ producerId: producer.id })
    //         .catch(() => {});
    // }
    return {
      id: producer.id,
    };
  }

  async _createConsumer({
    room,
    consumerPeer,
    producerPeer,
    producer,
  }: {
    room: MediaRoom;
    consumerPeer: UserPeer;
    producerPeer: UserPeer;
    producer: Producer;
  }) {
    // Optimization:
    // - Create the server-side Consumer in paused mode.
    // - Tell its Peer about it and wait for its response.
    // - Upon receipt of the response, resume the server-side Consumer.
    // - If video, this will mean a single key frame requested by the
    //   server-side Consumer (when resuming it).
    // - If audio (or video), it will avoid that RTP packets are received by the
    //   remote endpoint *before* the Consumer is locally created in the endpoint
    //   (and before the local SDP O/A procedure ends). If that happens (RTP
    //   packets are received before the SDP O/A is done) the PeerConnection may
    //   fail to associate the RTP stream.

    this.logger.log(`Creating consumer for producer ${producer.id}`);
    // NOTE: Don't create the Consumer if the remote Peer cannot consume it.
    if (
      !consumerPeer.rtpCapabilities ||
      !room.router.canConsume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.rtpCapabilities,
      })
    ) {
      return;
    }

    // Must take the Transport the remote Peer is using for consuming.
    const transport = Object.values(consumerPeer.transports).find(
      (t) => t.appData.consuming,
    );

    // This should not happen.
    if (!transport) {
      this.logger.warn('_createConsumer() | Transport for consuming not found');

      return;
    }

    // Create the Consumer in paused mode.
    let consumer: Consumer;

    try {
      consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.rtpCapabilities,
        paused: true,
      });
    } catch (error) {
      this.logger.warn('_createConsumer() | transport.consume():%o', error);

      return;
    }

    // Store the Consumer into the protoo consumerPeer data Object.
    consumerPeer.consumers[consumer.id] = consumer;

    // Set Consumer events.
    consumer.on('transportclose', () => {
      // Remove from its map.
      delete consumerPeer.consumers[consumer.id];
    });

    consumer.on('producerclose', () => {
      // Remove from its map.
      delete consumerPeer.consumers[consumer.id];
      consumerPeer.socket.emit('consumerClosed', { consumerId: consumer.id });
      // .catch(() => { });
    });

    consumer.on('producerpause', () => {
      this.logger.log(
        `consumer "producerpause" event [consumerId:${consumer.id}]`,
      );
      consumerPeer.socket.emit('consumerPaused', { consumerId: consumer.id });
      // .catch(() => { });
    });

    consumer.on('producerresume', () => {
      this.logger.log(
        'consumer "producerresume" event [consumerId:%s]',
        consumer.id,
      );
      consumerPeer.socket.emit('consumerResumed', { consumerId: consumer.id });
      // .catch(() => { });
    });

    consumer.on('score', (score) => {
      // logger.debug(
      // 	'consumer "score" event [consumerId:%s, score:%o]',
      // 	consumer.id, score);

      consumerPeer.socket.emit('consumerScore', {
        consumerId: consumer.id,
        score,
      });
      // .catch(() => { });
    });

    consumer.on('layerschange', (layers) => {
      consumerPeer.socket.emit('consumerLayersChanged', {
        consumerId: consumer.id,
        spatialLayer: layers ? layers.spatialLayer : null,
        temporalLayer: layers ? layers.temporalLayer : null,
      });
      // .catch(() => { });
    });

    // NOTE: For testing.
    // await consumer.enableTraceEvent([ 'rtp', 'keyframe', 'nack', 'pli', 'fir' ]);
    // await consumer.enableTraceEvent([ 'pli', 'fir' ]);
    // await consumer.enableTraceEvent([ 'keyframe' ]);

    consumer.on('trace', (trace) => {
      this.logger.debug(
        `consumer "trace" event [producerId:${consumer.id}, trace.type:${trace.type}, trace:{trace}]`,
      );
    });

    // Send a protoo request to the remote Peer with Consumer parameters.
    consumerPeer.socket.emit(
      'newConsumer',
      {
        peerId: producerPeer.id,
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        appData: producer.appData,
        producerPaused: consumer.producerPaused,
      },
      async (data) => {
        // Now that we got the positive response from the remote endpoint, resume
        // the Consumer so the remote endpoint will receive the a first RTP packet
        // of this new stream once its PeerConnection is already ready to process
        // and associate it.
        await consumer.resume();
        this.logger.log('Consumer resumed');

        consumerPeer.socket.emit('consumerScore', {
          consumerId: consumer.id,
          score: consumer.score,
        });
      },
    );
  }
  async _createDataConsumer({
    room,
    dataConsumerPeer,
    dataProducerPeer = null, // This is null for the bot DataProducer.
    dataProducer,
  }: {
    room: MediaRoom;
    dataConsumerPeer: UserPeer;
    dataProducerPeer?: UserPeer;
    dataProducer: DataProducer;
  }) {
    // NOTE: Don't create the DataConsumer if the remote Peer cannot consume it.
    if (!dataConsumerPeer.sctpCapabilities) return;

    // Must take the Transport the remote Peer is using for consuming.
    const transport = Object.values(dataConsumerPeer.transports).find(
      (t) => t.appData.consuming,
    );

    // This should not happen.
    if (!transport) {
      this.logger.warn(
        '_createDataConsumer() | Transport for consuming not found',
      );

      return;
    }

    // Create the DataConsumer.
    let dataConsumer;

    try {
      dataConsumer = await transport.consumeData({
        dataProducerId: dataProducer.id,
      });
    } catch (error) {
      this.logger.warn(
        '_createDataConsumer() | transport.consumeData():%o',
        error,
      );

      return;
    }

    // Store the DataConsumer into the protoo dataConsumerPeer data Object.
    dataConsumerPeer.dataConsumers[dataConsumer.id] = dataConsumer;

    // Set DataConsumer events.
    dataConsumer.on('transportclose', () => {
      // Remove from its map.
      delete dataConsumerPeer.dataConsumers[dataConsumer.id];
    });

    dataConsumer.on('dataproducerclose', () => {
      // Remove from its map.
      delete dataConsumerPeer.dataConsumers[dataConsumer.id];

      dataConsumerPeer.socket.emit('dataConsumerClosed', {
        dataConsumerId: dataConsumer.id,
      });
    });

    // Send a protoo request to the remote Peer with Consumer parameters.
    dataConsumerPeer.socket.emit('newDataConsumer', {
      // This is null for bot DataProducer.
      peerId: dataProducerPeer ? dataProducerPeer.id : null,
      dataProducerId: dataProducer.id,
      id: dataConsumer.id,
      sctpStreamParameters: dataConsumer.sctpStreamParameters,
      label: dataConsumer.label,
      protocol: dataConsumer.protocol,
      appData: dataProducer.appData,
    });
    // TODO: catch error
  }

  async join(
    userId: string,
    roomId: string,
    displayName: string,
    rtpCapabilities: RtpCapabilities,
    sctpCapabilities: SctpCapabilities,
  ) {
    const room = await this.getRoom(roomId);
    const currentPeer = this._getCurrentPeer(room, userId);
    // Ensure the Peer is joined.
    if (currentPeer.joined) {
      throw new Error('Peer already joined');
    }
    currentPeer.joined = true;
    currentPeer.displayName = displayName;
    // currentPeer.device = device;
    currentPeer.rtpCapabilities = rtpCapabilities;
    currentPeer.sctpCapabilities = sctpCapabilities;

    const joinedPeers = [
      ...room.peers,
      // ...this._broadcasters.values()
    ];

    for (const joinedPeer of joinedPeers) {
      // Create Consumers for existing Producers.
      for (const producer of Object.values(joinedPeer.producers)) {
        this.logger.log('Creating Consumer for peer %s', producer.id);
        this._createConsumer({
          room,
          consumerPeer: currentPeer,
          producerPeer: joinedPeer,
          producer,
        });
      }

      // Create DataConsumers for existing DataProducers.
      for (const dataProducer of Object.values(joinedPeer.dataProducers)) {
        this._createDataConsumer({
          room,
          dataConsumerPeer: currentPeer,
          dataProducerPeer: joinedPeer,
          dataProducer,
        });
      }
    }

    // Notify the new Peer to all other Peers.
    for (const otherPeer of this._getJoinedPeers(room, currentPeer.id)) {
      otherPeer.socket.emit('newPeer', {
        roomId: room.id,
        id: currentPeer.id,
        displayName: currentPeer.displayName,
      });
      // .catch(() => { });
    }

    // Reply now the request with the list of joined peers (all but the new one).
    const peerInfos = joinedPeers
      .filter((joinedPeer) => joinedPeer.id !== currentPeer.id)
      .map((joinedPeer) => ({
        id: joinedPeer.id,
        displayName: joinedPeer.displayName,
      }));

    return { peers: peerInfos };
  }
}
