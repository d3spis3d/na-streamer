import Throttle from 'throttle';

import createTrackStream from './create-track-stream';

export default function(filesStore, sendFileData, probe) {
    return function(trackRequest) {
        console.log(trackRequest);
        const [trackId, channel] = trackRequest.split(';');
        const track = filesStore[trackId];
        const streamTrack = createTrackStream(track, trackId, sendFileData, Throttle, channel);
        probe(track, streamTrack);
    };
}
