window.addEventListener('load', () => {
    const client = new BinaryClient(`ws://localhost:9001`);
    const audioCtx = new window.AudioContext();
    const audioBuffer = audioCtx.createBuffer(1, 8192, 44100);
    let playing = false;

    client.on('open', function() {
        console.log('client opened');
        const stream = client.createStream();

        stream.on('data', (data) => {
            console.log('got data');
            const buffer = new Float32Array(data);
            console.log(buffer.length);
            audioBuffer.copyToChannel(buffer, 0, 0);

            if (!playing) {
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start();
                playing = true;
            }
        });
    });
});
