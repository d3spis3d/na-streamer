import {BinaryServer} from 'binaryjs';

import setupServerConnectionHandler from './setup-server-connection-handler';
import {setClientList, createStreamersUpdate} from './server-helper';

export default function(streamers, tracks, filesByStreamer, clients) {
    const streamerServer = BinaryServer({port: 9000});
    const writeToAllClients = setClientList(clients);
    const addToStreamers = createStreamersUpdate(streamers);

    streamerServer.on('connection', setupServerConnectionHandler(tracks, filesByStreamer, writeToAllClients, addToStreamers));

    return streamerServer;
}
