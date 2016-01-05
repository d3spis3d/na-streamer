import {BinaryServer} from 'binaryjs';
import uuid from 'node-uuid';
import express from 'express';
import Rx from 'rx';

const filesByStreamer = {};
const tracks = {};
const clients = [];
const streamers = {};

const app = express();

app.get('/song/:uuid', function(req, res) {
    const streamerId = filesByStreamer[req.params.uuid];
    const stream = streamers[streamerId];
    stream.write(req.params.uuid);
    res.sendStatus(200);
});

app.get('/stream', function(req, res) {
    const headers = { "Content-Type": "audio/mpeg", "Connection": "close", "Transfer-Encoding": "identity"};
    if (!res.headers) {
        res.writeHead(200, headers);
    }
    clients.push({res});
});

const appServer = app.listen(4000, function () {
    const host = appServer.address().address;
    const port = appServer.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

    const streamerServer = BinaryServer({port: 9000});

    streamerServer.on('connection', function(streamer) {
        const streamerId = uuid.v4();
        streamer.on('stream', function(stream) {
            streamers[streamerId] = stream;

            const streamedData = Rx.Observable.fromEvent(stream, 'data');

            const trackListingData = streamedData.filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
            trackListingData.subscribe(data => {
                for (let artist in data) {
                    tracks[artist] = tracks[artist] || {};
                    for (let albumName in data[artist]) {
                        tracks[artist][albumName] = tracks[artist][albumName] || {};
                        const album = data[artist][albumName];
                        for (let track in album) {
                            filesByStreamer[album[track].id] = streamerId;
                            tracks[artist][albumName][track] = album[track];
                        }
                    }
                }
              console.log(filesByStreamer);
            });

            const trackEnd = streamedData.filter(data => !Buffer.isBuffer(data) && (typeof data === 'string' || data instanceof String));
            trackEnd.subscribe(data => {
                console.log('track finished', data);
            });

            const binaryData = streamedData.filter(data => Buffer.isBuffer(data));
            binaryData.subscribe(data => {
                console.log('received binary data');
                clients.forEach(client => {
                    client.res.write(data);
                });
            });
        });
    });

  /*const frontendServer = BinaryServer({port: 9001});
  frontendServer.on('connection', function(client) {
      client.on('stream', function(stream) {
          clients.push({stream: stream});
      });
  });*/
});
