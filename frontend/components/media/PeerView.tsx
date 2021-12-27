import React, { useEffect, useRef } from 'react';
type Props = {
    audioTrack: any;
    videoTrack: any;
    isMe: boolean;
    audioMuted?: boolean;
}
export function PeerView({
    audioTrack,
    videoTrack,
    isMe,
    audioMuted = true,
}: Props) {
    const videoElem = useRef<HTMLVideoElement>(null);
    const audioElem = useRef<HTMLAudioElement>(null)
    useEffect(() => {
        if (!audioElem.current) {
            return;
        }
        if (audioTrack) {
            const stream = new MediaStream();

            stream.addTrack(audioTrack);
            audioElem.current.srcObject = stream;

            audioElem.current.play()
                .catch((error) => console.warn('audioElem.current.play() failed:%o', error));

        }
        else {
            audioElem.current.srcObject = null;
        }
    }, [audioTrack, audioElem]);

    useEffect(() => {
        if (!videoElem.current) {
            return;
        }
        if (videoTrack) {
            const stream = new MediaStream;

            stream.addTrack(videoTrack);
            videoElem.current.srcObject = stream;

            videoElem.current.oncanplay = () => { };

            videoElem.current.onplay = () => {
                // audioElem.play()
                //     .catch((error) => logger.warn('audioElem.play() failed:%o', error));
            };


            videoElem.current.play()
                .catch((error) => console.warn('videoElem.play() failed:%o', error));
        }
        else {
            videoElem.current.srcObject = null;
        }
    }, [videoTrack, videoElem])
    return (
        <div style={{width: 400}}>
            <video
                ref={videoElem}
                autoPlay
                playsInline
                muted
                controls={false}
            />

            <audio
                ref={audioElem}
                autoPlay
                playsInline
                muted={isMe || audioMuted}
                controls={false}
            />
        </div>
    );
}
