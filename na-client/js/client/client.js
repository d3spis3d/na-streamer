import {BinaryClient} from 'binaryjs';
import probe from 'node-ffprobe';
import Rx from 'rx';

import {createWriteStream} from '../helper';
import setupFilesProcessing from '../files/setup-files-processing';
import createTrackResponse from './create-track-response';

export default class Client() {

    constructor(options, key) {
        this.host = options.host;
        this.port = options.port;
        this.dir = options.dir;
        this.key = key;
    }

    start(tracks) {
        this.client = BinaryClient(`ws://${this.host}:${this.port}`);

        client.on('open', () => {
            console.log('opened connection');
            this.stream = client.createStream();
            const streamTrack = createTrackResponse(tracks, sendFileData, probe);

            const streamedData = Rx.Observable.fromEvent(stream, 'data');

            const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);
            trackRequests.subscribe(streamTrack);

            setupFilesProcessing(tracks, sendFileData, musicDir, key);
        });

        client.on('close', this.handleClose);
        client.on('error', this.handleError);
    }

    sendLibraryData(data) {
      this.stream.write(data);
    }

    handleClose() {
      console.log('connection closed');
    }

    handleError(err) {
      console.log('error: ', err);
    }
}
