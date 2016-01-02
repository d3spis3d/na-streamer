import fs from 'fs';

import {BinaryClient} from 'binaryjs';
import {setupFilesProcessing} from './files';
import Rx from 'rx';

export function startClient(filesStore, musicDir) {
    const client = BinaryClient('ws://localhost:9000');

    client.on('open', function() {
        console.log('opened connection');
        const stream = client.createStream();
        const sendFileData = createStreamToServer(stream);
        setupFilesProcessing(filesStore, sendFileData, musicDir);

        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackRequests = streamedData.filter(data => typeof data === 'string' ||
                                data instanceof String);
        trackRequests.subscribe(data => {
            console.log(data);
            const binaryData = fs.readFileSync(filesStore[data]);
            stream.write(binaryData);
        });
    });
    client.on('close', function() {
        console.log('connection closed');
    });
    client.on('error', function(err) {
        console.log('error: ', err);
    });
}

function createStreamToServer(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}
