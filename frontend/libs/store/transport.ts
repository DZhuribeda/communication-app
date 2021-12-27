import { DtlsParameters, IceCandidate, IceParameters, SctpParameters, Transport } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { socket } from "../socket";
import { AppState } from "./useStore";

const PC_PROPRIETARY_CONSTRAINTS = {
    optional: [{ googDscp: true }]
};

export interface TransportSlice {
    sendTransport: Transport | null;
    recvTransport: Transport | null;
    createProducerWebRtcTransport: (payload: {
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
    }) => Promise<void>;
    createConsumerWebRtcTransport: (payload: {
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
    }) => Promise<void>;
}

export const createTransportSlice = (set: SetState<AppState>, get: GetState<AppState>) => ({
    sendTransport: null,
    recvTransport: null,
    createProducerWebRtcTransport: async ({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
    }: {
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
    }) => {
        console.log('createProducerWebRtcTransport');
        const device = get().device;
        if (!device) {
            console.log('no device');
            return;
        }
        const sendTransport = device.createSendTransport({
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters: {
                ...dtlsParameters,
                // Remote DTLS role. We know it's always 'auto' by default so, if
                // we want, we can force local WebRTC transport to be 'client' by
                // indicating 'server' here and vice-versa.
                role: 'auto'
            },
            sctpParameters,
            iceServers: [],
            proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
            // additionalSettings: { encodedInsertableStreams: this._e2eKey && e2e.isSupported() }
        });
        const roomId = get().roomId;

        sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
            console.debug(`sendTransport.on connect`, dtlsParameters);
            if (!sendTransport) {
                console.log('Missing sendTransport');
                return;
            }
            socket.emit(
                'connectWebRtcTransport', {
                roomId,
                transportId: sendTransport.id,
                dtlsParameters
            }, () => {
                console.log('connectWebRtcTransport success');
                callback();
            });
            // TODO: handle errback
            // .catch(errback);
        });

        sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
            console.debug('sendTransport.on produce');
            if (!sendTransport) {
                console.log('Missing sendTransport');
                return;
            }
            console.log('sendTransport.on produce', kind, rtpParameters, appData);
            socket.emit('produce', {
                transportId: sendTransport.id,
                roomId,
                kind,
                rtpParameters,
                appData
            }, ({ id }: { id: string }) => {
                console.log('producer', id);
                callback({ id });
            });
            // TODO: handle errback
            // errback(error);
        });

        sendTransport.on('producedata', ({
            sctpStreamParameters,
            label,
            protocol,
            appData
        },
            callback,
            errback
        ) => {
            if (!sendTransport) {
                console.log('Missing sendTransport');
                return;
            }
            console.debug(
                '"producedata" event: [sctpStreamParameters:%o, appData:%o]',
                sctpStreamParameters, appData);
            socket.emit('produceData', {
                transportId: sendTransport.id,
                sctpStreamParameters,
                label,
                protocol,
                appData
            }, callback);
            // TODO: handle errback
            // errback(error);
        });
        sendTransport.on('connectionstatechange', (connectionState) => {
            console.log('sendTransport.on connectionstatechange', connectionState);
        });
        set((state) => ({ ...state, sendTransport }));
    },
    createConsumerWebRtcTransport: async ({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
    }: {
        id: string,
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters?: SctpParameters,
    }) => {
        console.log('createConsumerWebRtcTransport');
        const device = get().device;
        if (!device) {
            console.log('no device');
            return;
        }
        const roomId = get().roomId;
        const recvTransport = device.createRecvTransport({
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters: {
                ...dtlsParameters,
                // Remote DTLS role. We know it's always 'auto' by default so, if
                // we want, we can force local WebRTC transport to be 'client' by
                // indicating 'server' here and vice-versa.
                role: 'auto'
            },
            sctpParameters,
            iceServers: [],
            proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
            // additionalSettings: { encodedInsertableStreams: this._e2eKey && e2e.isSupported() }
        });

        recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
            if (!recvTransport) {
                console.log('Missing recvTransport');
                return;
            }
            socket.emit(
                'connectWebRtcTransport', {
                roomId,
                transportId: recvTransport.id,
                dtlsParameters
            }, () => {
                console.log('connectWebRtcTransport reciever success');
                callback();
            });
            // TODO: handle errback
            // .catch(errback);
        });
        set((state) => ({ ...state, recvTransport }));
    }
});
