import * as os from 'os';
import { MediaKind } from 'mediasoup/node/lib/RtpParameters';
import { WorkerLogLevel, WorkerLogTag } from 'mediasoup/node/lib/Worker';

export const mediasoupConfig = {
  // Number of mediasoup workers to launch.
  numWorkers: Object.keys(os.cpus()).length,
  // mediasoup WorkerSettings.
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#WorkerSettings
  workerSettings: {
    logLevel: 'debug' as WorkerLogLevel,
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rtx',
      'bwe',
      'score',
      'simulcast',
      'svc',
      'sctp',
    ] as WorkerLogTag[],
    rtcMinPort: process.env.MEDIASOUP_MIN_PORT || 40000,
    rtcMaxPort: process.env.MEDIASOUP_MAX_PORT || 40020,
  },
  // mediasoup Router options.
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#RouterOptions
  routerOptions: {
    mediaCodecs: [
      {
        kind: <MediaKind>'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: <MediaKind>'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: <MediaKind>'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
          'profile-id': 2,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: <MediaKind>'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: <MediaKind>'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  },
  // mediasoup WebRtcTransport options for WebRTC endpoints (mediasoup-client,
  // libmediasoupclient).
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
  webRtcTransportOptions: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '0.0.0.0',
      },
    ],
    initialAvailableOutgoingBitrate: 1000000,
    minimumAvailableOutgoingBitrate: 600000,
    maxSctpMessageSize: 262144,
    // Additional options that are not part of WebRtcTransportOptions.
    maxIncomingBitrate: 1500000,
  },
  // mediasoup PlainTransport options for legacy RTP endpoints (FFmpeg,
  // GStreamer).
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#PlainTransportOptions
  plainTransportOptions: {
    listenIp: {
      ip: process.env.MEDIASOUP_LISTEN_IP || '1.2.3.4',
      announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
    },
    maxSctpMessageSize: 262144,
  },
};
