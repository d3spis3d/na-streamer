import {createArtist, createAlbum, createAlbumArtist, createSong,
        createStreamer, associateSongAndStreamer} from '../queries/setup-track-data';

export function createStreamersUpdate(streamers) {
    return function(streamerId, stream) {
        streamers[streamerId] = stream;
    };
}

export function setClientList(clients) {
    return function(data) {
        console.log('received binary data');
        clients.forEach(client => {
            client.res.write(data);
        });
    };
}

export function setTrackListingMap(tracks, filesByStreamer, streamerId, db) {
    return function(data) {
        const key = data.key;
        const trackData = data.tracks;

        createStreamer(db, key)
        .then(() => {
            for (let artist in trackData) {
                tracks[artist] = tracks[artist] || {};
                createArtist(db, artist)
                .then(() => {
                    for (let albumName in trackData[artist]) {
                        tracks[artist][albumName] = tracks[artist][albumName] || {};
                        createAlbum(db, albumName)
                        .then(() => {
                            createAlbumArtist(db, artist, albumName)
                            .then(() => {
                                const album = trackData[artist][albumName];
                                for (let track in album) {
                                    filesByStreamer[album[track].id] = streamerId;
                                    tracks[artist][albumName][track] = album[track];
                                    createSong(db, albumName, album[track].title, album[track].number)
                                    .then((response) => {
                                        associateSongAndStreamer(db, response[0]['@rid'], key);
                                    });
                                }
                            });
                        });
                    }
                });
            }
        })

    };
}

export function setupInitQueue(songQueue, filesByStreamer, streamers) {
    return function() {
        const files = Object.keys(filesByStreamer);
        const filesCount = files.length;
        for (let i = 0; i < 5; i++) {
            const fileNumber = Math.floor(Math.random() * filesCount);
            songQueue.push(files[fileNumber]);
        }

        const firstSong = songQueue.shift();
        const streamerId = filesByStreamer[firstSong];
        const stream = streamers[streamerId];
        stream.write(firstSong);
    };
}

export function setupNextSong(songQueue, filesByStreamer, streamers) {
    return function() {
        const nextSong = songQueue.shift();
        const streamerId = filesByStreamer[nextSong];
        const stream = streamers[streamerId];
        stream.write(nextSong);
    }
}
