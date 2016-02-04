import bodyParser from 'body-parser';

import {getStream} from './stream';
import {getArtists, getAlbums, getSongs} from './library';
import {getQueue, addToQueue, removeFromQueue} from './queue';
import {getClients} from './clients';
import {getNowPlaying} from './now-playing';

export default function(app, db, clients, populateQueue) {
    app.use(bodyParser.json());

    app.get(getStream.url, getStream.generateHandler(clients, populateQueue));
    app.get(getArtists.url, getArtists.generateHandler(db));
    app.get(getAlbums.url, getAlbums.generateHandler(db));
    app.get(getSongs.url, getSongs.generateHandler(db));
    app.get(getQueue.url, getQueue.generateHandler(db));
    app.get(getClients.url, getClients.generateHandler(clients));
    app.get(getNowPlaying.url, getNowPlaying.generateHandler(db));

    app.post(addToQueue.url, addToQueue.generateHandler(db));

    app.delete(removeFromQueue.url, removeFromQueue.generateHandler(db));
}
