import {BinaryClient} from 'binaryjs';
import probe from 'node-ffprobe';
import Rx from 'rx';

import Stream from '../streams/stream';

export default class Client {

    constructor(options, key) {
        this.host = options.host;
        this.port = options.port;
        this.dir = options.dir;
        this.key = key;
        this.filesById = {};
    }

    getFiles() {
        return filesById;
    }

    start(tracks) {
        this.client = BinaryClient(`ws://${this.host}:${this.port}`);

        client.on('open', () => {

        });

        client.on('close', this.handleClose);
        client.on('error', this.handleError);
    }

    handleOpen() {
        console.log('opened connection');
        this.stream = client.createStream();
        this.sendTracks(tracks);

        this.setupStreams();
    }

    handleClose() {
      console.log('connection closed');
    }

    handleError(err) {
      console.log('error: ', err);
    }

    sendTracks(tracks) {
        this.sendData({
            key: this.key,
            tracks: tracks
        });
    }

    sendData(data) {
      this.stream.write(data);
    }

    setupStreams() {
        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);

        trackRequests.subscribe(this.streamTrack);
    }

    streamTrack(trackId) {
        const track = this.filesById[trackId];
        stream = Stream(this.stream);
        stream.streamTrack(track);
    }
}
