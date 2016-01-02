import {BinaryServer} from 'binaryjs';
import uuid from 'node-uuid';

const filesByClient = {};
const tracks = {};
const clients = {};

const server = BinaryServer({port: 9000});

server.on('connection', function(client) {
    const clientId = uuid.v4();
    client.on('stream', function(stream) {
        clients[clientId] = stream;
        stream.on('data', function(data) {
            for (let artist in data) {
                tracks[artist] = tracks[artist] || {};
                for (let albumName in data[artist]) {
                    tracks[artist][albumName] = tracks[artist][albumName] || {};
                    const album = data[artist][albumName];
                    for (let track in album) {
                        filesByClient[album[track].id] = clientId;
                        tracks[artist][albumName][track] = album[track];
                    }
                }
            }

        });
    });
});
