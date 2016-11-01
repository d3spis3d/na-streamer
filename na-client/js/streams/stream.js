import fs from 'fs';
import Rx from 'rx';
import Throttle from 'throttle';

export default class Stream {
    constructor(stream) {
        this.stream = stream;
    }

    streamTrack(track) {
        this.track = track;
        probe(track, this.createTrackStream);
    }

    createTrackStream(err, results) {
        const trackStream = fs.createReadStream(this.track);
        const bps = (results.format.bit_rate / 10) * 1.2;
        const chunkSize = Math.ceil(bps / 10);
        const throttledStream = new Throttle({bps, chunkSize});
        trackStream.pipe(throttledStream);

        const throttledData = Rx.Observable.fromEvent(throttledStream, 'data')
        .subscribe(data => {
            this.sendTrackData(data);
        });

        const throttleEnd = Rx.Observable.fromEvent(throttledStream, 'end')
        .subscribe(() => {
            throttledData.dispose();
            throttleEnd.dispose();
            this.sendTrackData(trackId);
        });
    }

    sendTrackData(data) {
        this.stream.write(data);
    }
}
