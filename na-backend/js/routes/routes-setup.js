import bodyParser from 'body-parser';

import {getSongByUUID} from 'song';
import {getStream} from 'stream';
import {getArtists, getAlbums, getSongs} from 'library';
import {getQueue} from 'queue';

export function(app, db, clients, populateQueue) {
    app.use(bodyParser.json());

    app.get(getStream.url, getStream.generateHandler(clients, populateQueue));
    app.get(getArtists.url, getArtists.generateHandler(db));
    app.get(getAlbums.url, getAlbums.generateHandler(db));
    app.get(getSongs.url, getSongs.generateHandler(db));
    app.get(getQueue.url, getQueue.generateHandler(db));

    app.post(addToQueue.url, addToQueue.generateHandler(db));
}
