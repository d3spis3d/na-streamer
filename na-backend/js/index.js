import uuid from 'node-uuid';
import express from 'express';
import OrientDB from 'orientjs';
import {BinaryServer} from 'binaryjs';

import {setupInitQueue, setupNextSong, setupTrackListUpdate} from './lib/server-helper';
import {setupClients, setupStreamers} from './lib/server-setup';
import setupStreamHandler from './lib/setup-stream-handler';
import setupRoutes from './routes/routes-setup';

import config from './config';

const clients = setupClients();
const streamers = setupStreamers();

const app = express();

const server = OrientDB({
    host: config.databaseHost,
    port: config.databasePort,
    username: config.username,
    password: config.password
});

const db = server.use('music');

const populateQueue = setupInitQueue(db, streamers);
const nextSongInQueue = setupNextSong(db, streamers);
const updateTrackListing = setupTrackListUpdate(db);

setupRoutes(app, db, clients, populateQueue);
app.use(express.static('public'));

const appServer = app.listen(config.webPort, function () {
    const host = appServer.address().address;
    const port = appServer.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

const streamerServer = BinaryServer({port: config.streamPort});
streamerServer.on('connection', function(streamer) {
    console.log('stream connected');
    streamer.on('stream', setupStreamHandler(clients, streamers, updateTrackListing, nextSongInQueue));
});
