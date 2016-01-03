import {BinaryServer} from 'binaryjs';
import uuid from 'node-uuid';
import express from 'express';
import Rx from 'rx';

const filesByClient = {};
const tracks = {};
const clients = {};

const app = express();

app.get('/:uuid', function(req, res) {
    const clientId = filesByClient[req.params.uuid];
    const stream = clients[clientId];
    stream.write(req.params.uuid);
    res.sendStatus(200);
});

const appServer = app.listen(3000, function () {
  const host = appServer.address().address;
  const port = appServer.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

const server = BinaryServer({port: 9000});

server.on('connection', function(client) {
    const clientId = uuid.v4();
    client.on('stream', function(stream) {
        clients[clientId] = stream;

        const streamedData = Rx.Observable.fromEvent(stream, 'data');

        const trackListingData = streamedData.filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
        trackListingData.subscribe(data => {
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
            console.log(filesByClient);
        });

        const trackEnd = streamedData.filter(data => !Buffer.isBuffer(data) && (typeof data === 'string' || data instanceof String));
        trackData.subscribe(data => {
            console.log('track finished', data);
        });

        const binaryData = streamedData.filter(data => Buffer.isBuffer(data));
        binaryData.subscribe(data => {
            console.log('received binary data');
        });
    });
});
