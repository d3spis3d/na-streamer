import fs from 'fs';
import Rx from 'rx';
import Throttle from 'throttle';

export default function(filesStore, sendFileData, probe) {
    return function(trackId) {
        console.log(trackId);
        const track = filesStore[trackId];

        probe(track)
        .then(results => {
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
        });
    };
}
