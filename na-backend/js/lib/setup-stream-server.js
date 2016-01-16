import {BinaryServer} from 'binaryjs';

import setupServerConnectionHandler from './setup-server-connection-handler';
import {setClientList, createStreamersUpdate} from './server-helper';

export default function(streamers, tracks, filesByStreamer, clients, nextSongInQueue, db) {
    const writeToAllClients = setClientList(clients);
    const addToStreamers = createStreamersUpdate(streamers);

    const streamerServer = BinaryServer({port: 9000});
    streamerServer.on('connection', setupServerConnectionHandler(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue, db));
    return streamerServer;
}
