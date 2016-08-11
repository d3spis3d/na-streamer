import bodyParser from 'body-parser';

import {getStream} from './stream';
import {getArtists, getAlbums, getSongs} from './library';
import {getQueue, addToQueue, removeFromQueue} from './queue';
import {getClients} from './clients';
import {getNowPlaying} from './now-playing';
import {getChannels, createChannel, deleteChannel} from './channel';

import {listQueueForChannel, addToChannelQueue, removeFromChannelQueue}
    from '../queries/queue';
import {listChannels, createChannelQuery, deleteChannelQuery} from '../queries/channel';

export default function(app, db, clients, populateQueue) {
    app.use(bodyParser.json());

    app.get(getStream.url, getStream.generateHandler(clients, populateQueue));
    app.get(getArtists.url, getArtists.generateHandler(db));
    app.get(getAlbums.url, getAlbums.generateHandler(db));
    app.get(getSongs.url, getSongs.generateHandler(db));
    app.get(getQueue.url, getQueue.generateHandler(db, listQueueForChannel));
    app.get(getClients.url, getClients.generateHandler(clients));
    app.get(getNowPlaying.url, getNowPlaying.generateHandler(db));
    app.get(getChannels.url, getChannels.generateHandler(db, listChannels));

    app.post(addToQueue.url, addToQueue.generateHandler(db, addToChannelQueue));
    app.post(createChannel.url, createChannel.generateHandler(db, createChannelQuery));

    app.delete(removeFromQueue.url, removeFromQueue.generateHandler(db, removeFromChannelQueue));
    app.delete(deleteChannel.url, deleteChannel.generateHandler(db, deleteChannelQuery));
}
