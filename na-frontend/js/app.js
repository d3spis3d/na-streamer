import {BinaryClient} from 'binaryjs-client';

window.addEventListener('load', () => {
    const client = new BinaryClient(`ws://localhost:9001`);

    client.on('open', function() {
        console.log('client opened');
        const audioCtx = new window.AudioContext();
        const stream = client.createStream();
        let scheduleNextBuffer = 0;

        stream.on('data', (data) => {
            console.log('got data');
            audioCtx.decodeAudioData(data, buffer => {
                const source = audioCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start(scheduleNextBuffer || audioCtx.currentTime);
                scheduleNextBuffer = scheduleNextBuffer + buffer.duration;
            });
        });
    });
});
