import {BinaryServer} from 'binaryjs';

import setupServerConnectionHandler from './setup-server-connection-handler';
import {setClientList, createStreamersUpdate} from './server-helper';

export default function(streamers, clients, nextSongInQueue, db) {
    const writeToAllClients = setClientList(clients);
    const addToStreamers = createStreamersUpdate(streamers);

    const streamerServer = BinaryServer({port: 9000});
    streamerServer.on('connection', setupServerConnectionHandler(writeToAllClients, addToStreamers, nextSongInQueue, db));
    return streamerServer;
}
