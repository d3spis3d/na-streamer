import Rx from 'rx';

export default function(writeToAllClients, addToStreamers, updateTrackListing, streamerId, nextSongInQueue) {
    return function(stream) {
        addToStreamers(streamerId, stream);
        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackListingData = streamedData
            .filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
        trackListingData.subscribe(updateTrackListing);

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
