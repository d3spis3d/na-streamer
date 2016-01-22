import uuid from 'node-uuid';

import {setTrackListingMap} from './server-helper';
import setupStreamHandler from './setup-stream-handler';

export default function(writeToAllClients, addToStreamers, nextSongInQueue, db) {
    return function(streamer) {
        console.log('stream connected');
        const updateTrackListing = setTrackListingMap(db);

        streamer.on('stream', setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue));
    };
}
