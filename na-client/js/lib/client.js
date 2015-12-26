import {BinaryClient} from 'binaryjs';
import {setupFilesProcessing} from './files';

export function startClient(filesStore, musicDir) {
    const client = BinaryClient('ws://localhost:9000');

    client.on('open', function() {
        console.log('opened connection');
        const stream = client.createStream();
        const sendFileData = createStreamToServer(stream);
        setupFilesProcessing(filesStore, sendFileData, musicDir);
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
