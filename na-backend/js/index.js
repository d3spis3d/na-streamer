import uuid from 'node-uuid';
import express from 'express';

import {setupStreamServer} from './lib/server';

import {getSongByUUID} from './routes/song';
import {getStream} from './routes/stream';
import {getLibrary} from './routes/library';

const filesByStreamer = {};
const tracks = {};
const clients = [];
const streamers = {};

const app = express();

app.get(getSongByUUID.url, getSongByUUID.generateHandler(filesByStreamer, streamers));

app.get(getStream.url, getStream.generateHandler(clients));

app.get(getLibrary.url, getLibrary.generateHandler(tracks));

const appServer = app.listen(4000, function () {
    const host = appServer.address().address;
    const port = appServer.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

    const streamerServer = setupStreamServer(streamers, tracks, filesByStreamer, clients);
});
