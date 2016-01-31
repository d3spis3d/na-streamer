import {BinaryServer} from 'binaryjs';

import setupServerConnectionHandler from './setup-server-connection-handler';
import {setClientList, createStreamersUpdate} from './server-helper';

export default function(streamers, clients, nextSongInQueue, db, port) {
    const writeToAllClients = setClientList(clients);
    const addToStreamers = createStreamersUpdate(streamers);

    const streamerServer = BinaryServer({port: port});
    streamerServer.on('connection', setupServerConnectionHandler(writeToAllClients, addToStreamers, nextSongInQueue, db));
    return streamerServer;
}
