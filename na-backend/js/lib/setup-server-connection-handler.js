import uuid from 'node-uuid';

import {setTrackListingMap} from './server-helper';
import setupStreamHandler from './setup-stream-handler';

export default function(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue, db) {
    return function(streamer) {
        console.log('stream connected');
        const streamerId = uuid.v4();
        const updateTrackListing = setTrackListingMap(tracks, filesByStreamer, streamerId, db);

        streamer.on('stream', setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, streamerId, nextSongInQueue));
    };
}
