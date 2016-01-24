import {BinaryClient} from 'binaryjs';

import openStreamToServer from './streams/open-stream-to-server';

export function startClient(filesStore, musicDir, key) {
    const client = BinaryClient('ws://localhost:9000');

    client.on('open', function() {
        openStreamToServer(filesStore, musicDir, client, key);
    });
    client.on('close', function() {
        console.log('connection closed');
    });
    client.on('error', function(err) {
        console.log('error: ', err);
    });

    return client;
}
