import Rx from 'rx';

export default function(clients, streamers, updateTrackListing, nextSongInQueue) {
    return function(stream) {
        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackListingData = streamedData
            .filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
        trackListingData.subscribe(data => {
            streamers.add(data.key, stream);
            updateTrackListing(data);
        });

        const trackEnd = streamedData
            .filter(data => !Buffer.isBuffer(data) && (typeof data === 'string' || data instanceof String));
        trackEnd.subscribe(data => {
            const channel = data.split(';')[1];
            nextSongInQueue(channel);
        });

        const binaryData = streamedData
            .filter(data => Buffer.isBuffer(data));
        binaryData.subscribe(data => {
            clients.writeToAll(data);
        });
    };
}
