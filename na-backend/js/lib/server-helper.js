import {createArtist, createAlbum, createAlbumArtist, createSong,
        createStreamer, associateSongAndStreamer} from '../queries/setup-track-data';

export function createStreamersUpdate(streamers) {
    return function(streamerId, stream) {
        streamers[streamerId] = stream;
    };
}

export function setClientList(clients) {
    return function(data) {
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
                                    createSong(db, albumName, album[track])
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

export function setupInitQueue(db, streamers) {
    return function() {
        db.query('select * from Queue')
        .then(results => {
            if (results.length) {
                return Promise.reject('Queue already populated');
            }
            return db.query('select * from Song');
        })
        .then(results => {
            return results.map(result => result['@rid']);
        })
        .then(songs => {
            const filesCount = songs.length;
            for (let i = 0; i < 4; i++) {
                const fileNumber = Math.floor(Math.random() * filesCount);
                db.query(`insert into Queue (id) values (${songs[fileNumber]})`)
            }

            const fileNumber = Math.floor(Math.random() * filesCount);
            const firstSong = songs[fileNumber];
            return db.query(`select *, out("Hosted_On").key as key from ${firstSong}`);
        })
        .then(results => {
            const streamerKey = results[0].key[0];
            const songId = results[0].id;

            const stream = streamers[streamerKey];
            stream.write(songId.toString());
        })
        .catch((err) => {
            console.log(err);
        });
    };
}

export function setupNextSong(db, streamers) {
    return function() {
        db.query('delete vertex Queue return before limit 1')
        .then(results => {
            return db.query(`select *, out("Hosted_On").key as key from ${results[0].id}`)
        })
        .then(results => {
            const streamerKey = results[0].key[0];
            const songId = results[0].id;

            const stream = streamers[streamerKey];
            stream.write(songId.toString());
            return db.query('select COUNT(*) as count from Queue');
        })
        .then(count => {
            if (count[0].count === 1) {
                return db.query('select * from Song');
            }
            return Promise.reject();
        })
        .then(songs => {
            return songs.map(song => song['@rid']);
        })
        .then(songIds => {
            const filesCount = songIds.length;
            for (let i = 0; i < 3; i++) {
                const fileNumber = Math.floor(Math.random() * filesCount);
                db.query(`insert into Queue (id) values (${songIds[fileNumber]})`)
            }
        });
    }
}
