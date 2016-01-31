import {BinaryClient} from 'binaryjs';

import openStreamToServer from './streams/open-stream-to-server';

export function startClient(filesStore, options, key) {
    const client = BinaryClient(`ws://${options.host}:${options.port}`);

    client.on('open', function() {
        openStreamToServer(filesStore, options.dir, client, key);
    });
    client.on('close', function() {
        console.log('connection closed');
    });
    client.on('error', function(err) {
        console.log('error: ', err);
    });

    return client;
}
