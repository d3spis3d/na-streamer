import {BinaryClient} from 'binaryjs';

import openStreamToServer from './streams/open-stream-to-server';

export default class Client() {

    constructor(options, key) {
        this.options = options;
        this.key = key;
    }

    start(tracks) {
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
    }
}
