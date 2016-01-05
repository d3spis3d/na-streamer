import {BinaryClient} from 'binaryjs-client';

window.addEventListener('load', () => {
    const client = new BinaryClient(`ws://localhost:9001`);
    const audioCtx = new window.AudioContext();

    client.on('open', function() {
        console.log('client opened');
        const stream = client.createStream();

        stream.on('data', (data) => {
            console.log('got data');
            audioCtx.decodeAudioData(data, buffer => {
                console.log(buffer.length);
                const source = audioCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start();
            });
        });
    });
});
