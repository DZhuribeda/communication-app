import { Producer } from "mediasoup-client/lib/types";
import { SetState, GetState } from "zustand";
import { AppState } from "./useStore";
import { socket } from './../socket';


export interface MicrophoneSlice {
    micProducer: Producer | null;
    enableMic: () => Promise<void>;
    disableMic: () => Promise<void>;
}

export const createMicrophoneSlice = (set: SetState<AppState>, get: GetState<AppState>) => ({
    micProducer: null,
    enableMic: async () => {
        console.log('enableMic');
        const device = get().device;
        if (!device) {
            console.log('no device');
            return;
        }
        let micProducer = get().micProducer;
        if (micProducer) {
            return;
        }

        if (!device.canProduce('audio')) {
            console.error('enableMic() | cannot produce audio');
            return;
        }

        let track;
        const sendTransport = get().sendTransport;
        try {
            console.debug('enableMic() | calling getUserMedia()');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            track = stream.getAudioTracks()[0];
            if (!sendTransport) {
                throw new Error('No sendTransport');
            }
            micProducer = await sendTransport.produce({
                track,
                codecOptions: {
                    opusStereo: true,
                    opusDtx: true
                }
                // NOTE: for testing codec selection.
                // codec : this._mediasoupDevice.rtpCapabilities.codecs
                // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
            });

            // store.dispatch(stateActions.addProducer({
            //         id: micProducer.id,
            //         paused: micProducer.paused,
            //         track: micProducer.track,
            //         rtpParameters: micProducer.rtpParameters,
            //         codec: micProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
            //     }));

            micProducer.on('transportclose', () => {
                set((state) => ({...state, micProducer: null}));
            });

            micProducer.on('trackended', () => {
                // store.dispatch(requestActions.notify(
                //     {
                //         type: 'error',
                //         text: 'Microphone disconnected!'
                //     }));

                get().disableMic()
                    .catch(() => { });
            });    
            set((state) => ({...state, micProducer}));

        }
        catch (error) {
            console.error('enableMic() | failed:%o', error);

            // store.dispatch(requestActions.notify(
            //     {
            //         type: 'error',
            //         text: `Error enabling microphone: ${error}`
            //     }));

            if (track) {
                track.stop();
            }
        }
    },
    disableMic: async () => {
        console.debug('disableMic()');
        const micProducer = get().micProducer;
        if (!micProducer) {
            return;
        }

        micProducer.close();

        // store.dispatch(
        // 	stateActions.removeProducer(this._micProducer.id));

        // try {
        socket.emit('closeProducer', { producerId: micProducer.id });
        // }
        // catch (error)
        // {
        // 	store.dispatch(requestActions.notify(
        // 		{
        // 			type : 'error',
        // 			text : `Error closing server-side mic Producer: ${error}`
        // 		}));
        // }

        set((state) => ({...state, micProducer: null}));
    }

});
