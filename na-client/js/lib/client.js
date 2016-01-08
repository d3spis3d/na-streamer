import {BinaryClient} from 'binaryjs';

import * as streams from './streams';


export function startClient(filesStore, musicDir) {
    const client = BinaryClient('ws://localhost:9000');

    client.on('open', function() {
        streams.openStreamToServer(filesStore, musicDir, client);
    });
    client.on('close', function() {
        console.log('connection closed');
    });
    client.on('error', function(err) {
        console.log('error: ', err);
    });

    return client;
}
