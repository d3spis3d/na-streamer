import {BinaryServer} from 'binaryjs';
import uuid from 'node-uuid';
import Rx from 'rx';

export function setupStreamServer(streamers, tracks, filesByStreamer, clients) {
    const streamerServer = BinaryServer({port: 9000});

    streamerServer.on('connection', function(streamer) {
        const streamerId = uuid.v4();
        const updateTrackListing = setTrackListingMap(tracks, filesByStreamer);

        streamer.on('stream', function(stream) {
            streamers[streamerId] = stream;
            const streamedData = Rx.Observable.fromEvent(stream, 'data');

            const trackListingData = streamedData
                .filter(data => !Buffer.isBuffer(data) && !(typeof data === 'string' || data instanceof String));
            trackListingData.subscribe(updateTrackListing(data));

            const trackEnd = streamedData
                .filter(data => !Buffer.isBuffer(data) && (typeof data === 'string' || data instanceof String));
            trackEnd.subscribe(data => {
                console.log('track finished', data);
            });

            const binaryData = streamedData
                .filter(data => Buffer.isBuffer(data));
            binaryData.subscribe(writeToAllClients(data));
        });
    });

    return streamerSever;
}

export function writeToAllClients(data) {
    console.log('received binary data');
    clients.forEach(client => {
        client.res.write(data);
    });
}

export function setTrackListingMap() {
    return function(data) {
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
    }
  console.log(filesByStreamer);
}
