import Throttle from 'throttle';

import createTrackStream from './create-track-stream';

export default function(filesStore, sendFileData, probe) {
    return function(trackId) {
        console.log(trackId);
        const track = filesStore[trackId];
        const streamTrack = createTrackStream(track, trackId, sendFileData, Throttle);
        probe(track, streamTrack);
    };
}
