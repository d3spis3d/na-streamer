import fs from 'fs';

import {BinaryClient} from 'binaryjs';
import {setupFilesProcessing} from './files';
import Rx from 'rx';
import probe from 'node-ffprobe';
import Throttle from 'throttle';

export function startClient(filesStore, musicDir) {
    const client = BinaryClient('ws://localhost:9000');

    client.on('open', function() {
        console.log('opened connection');
        const stream = client.createStream();
        const sendFileData = createStreamToServer(stream);
        const streamTrack = createTrackRequestResponse(filesStore, sendFileData);

        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);
        trackRequests.subscribe(streamTrack);

        setupFilesProcessing(filesStore, sendFileData, musicDir);
    });
    client.on('close', function() {
        console.log('connection closed');
    });
    client.on('error', function(err) {
        console.log('error: ', err);
    });
}

export function createStreamToServer(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}

export function createTrackRequestResponse(filesStore, sendFileData) {
    return function(trackId) {
        console.log(trackId);
        const track = filesStore[trackId];
        const streamTrack = createTrackStream(track, trackId, sendFileData);
        probe(track, streamTrack);
    };
}

export function createTrackStream(track, trackId, sendFileData) {
    return function(err, results) {
        const trackStream = fs.createReadStream(track);
        const bps = (results.format.bit_rate / 10) * 1.4;
        const chunkSize = Math.ceil(bps / 3);
        const throttledStream = new Throttle({bps, chunkSize});
        trackStream.pipe(throttledStream);

        const throttledData = Rx.Observable.fromEvent(throttledStream, 'data')
        .subscribe(data => {
            sendFileData(data);
        });

        const throttleEnd = Rx.Observable.fromEvent(throttledStream, 'end')
        .subscribe(() => {
            throttledData.dispose();
            throttleEnd.dispose();
            sendFileData(trackId);
        });
    };
}
