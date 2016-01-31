import fs from 'fs';
import Rx from 'rx';

export default function(track, trackId, sendFileData, Throttle) {
    return function(err, results) {
        const trackStream = fs.createReadStream(track);
        const bps = (results.format.bit_rate / 10) * 1.2;
        const chunkSize = Math.ceil(bps / 10);
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
