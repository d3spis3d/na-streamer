import uuid from 'node-uuid';
import express from 'express';
import OrientDB from 'orientjs';

import setupStreamServer from './lib/setup-stream-server';
import {setupInitQueue, setupNextSong} from './lib/server-helper';
import setupRoutes from './routes/routes-setup';

import config from './config';

const tracks = {};
const clients = [];
const streamers = {};

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

setupRoutes(app, db, clients, populateQueue);
app.use(express.static('public'));

const appServer = app.listen(config.webPort, function () {
    const host = appServer.address().address;
    const port = appServer.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
    const streamerServer = setupStreamServer(streamers, clients, nextSongInQueue, db, config.streamPort);
});
