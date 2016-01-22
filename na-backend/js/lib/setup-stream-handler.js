import Rx from 'rx';

export default function(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue) {
    return function(stream) {
        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackListingData = streamedData
            .filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
        trackListingData.subscribe(data => {
            addToStreamers(data.key, stream);
            updateTrackListing(data);
        });

        const trackEnd = streamedData
            .filter(data => !Buffer.isBuffer(data) && (typeof data === 'string' || data instanceof String));
        trackEnd.subscribe(data => {
            nextSongInQueue();
        });

        const binaryData = streamedData
            .filter(data => Buffer.isBuffer(data));
        binaryData.subscribe(writeToAllClients);
    };
}
