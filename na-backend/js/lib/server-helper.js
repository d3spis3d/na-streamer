import {createArtist, createAlbum, createAlbumArtist, createSong,
        createStreamer, associateSongAndStreamer} from '../queries/setup-track-data';

export function createStreamersUpdate(streamers) {
    return function(streamerId, stream) {
        streamers[streamerId] = stream;
        console.log(streamers);
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

export function setTrackListingMap(db) {
    return function(data) {
        const key = data.key;
        const trackData = data.tracks;

        createStreamer(db, key)
        .then(() => {
            for (let artist in trackData) {
                createArtist(db, artist)
                .then(() => {
                    for (let albumName in trackData[artist]) {
                        createAlbum(db, albumName)
                        .then(() => {
                            createAlbumArtist(db, artist, albumName)
                            .then(() => {
                                const album = trackData[artist][albumName];
                                for (let track in album) {
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

export function setupInitQueue(songQueue, db, streamers) {
    return function() {
        let firstSong;

        db.query('select * from Song')
        .then(results => {
            return results.map(result => result['@rid']);
        })
        .then(songs => {
            const filesCount = songs.length;
            for (let i = 0; i < 5; i++) {
                const fileNumber = Math.floor(Math.random() * filesCount);
                songQueue.push(songs[fileNumber]);
            }

            firstSong = songQueue.shift();
            return db.query(`select expand( out("Hosted_On") ) from ${firstSong}`);
        })
        .then(results => {
            const stream = streamers[results[0].key];
            stream.write(firstSong);
        });
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
