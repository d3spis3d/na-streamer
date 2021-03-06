import {createArtist, createAlbum, createAlbumArtist, createSong,
        createStreamer, associateSongAndStreamer,
        createGenre, createGenreArtist} from '../queries/setup-track-data';

export function setupTrackListUpdate(db) {
    return function(data) {
        const key = data.key;
        const trackData = data.tracks;

        createStreamer(db, key)
        .then(() => {
            for (let genre in trackData) {
                createGenre(db, genre)
                .then(() => {
                    for (let artist in trackData[genre]) {
                        createArtist(db, artist)
                        .then(() => {
                            createGenreArtist(db, genre, artist)
                            .then((genreArtist) => {
                                for (let albumName in trackData[genre][artist]) {
                                    createAlbum(db, albumName)
                                    .then(() => {
                                        createAlbumArtist(db, artist, albumName)
                                        .then(() => {
                                            const album = trackData[genre][artist][albumName];
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
                        });
                    }
                });
            }
        });
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
            return db.query(`select *, out("Hosted_On").key as key, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from ${firstSong}`);
        })
        .then(results => {
            const result = results[0];

            const streamerKey = result.key[0];
            const songId = result.id;
            const stream = streamers.get(streamerKey);
            stream.write(songId.toString());

            return db.query(`insert into Now_Playing (title, album, artist) values (:title, :album, :artist)`, {
                params: {
                    title: result.title,
                    album: result.album[0],
                    artist: result.artist[0]
                }
            });
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
            return db.query(`select *, out("Hosted_On").key as key, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from ${results[0].id}`)
        })
        .then(results => {
            const result = results[0];

            const streamerKey = result.key[0];
            const songId = result.id;
            const stream = streamers.get(streamerKey);
            stream.write(songId.toString());

            return db.query(`insert into Now_Playing (title, album, artist) values (:title, :album, :artist)`, {
                params: {
                    title: result.title,
                    album: result.album[0],
                    artist: result.artist[0]
                }
            });
        })
        .then(() => {
            return db.query('delete vertex Now_Playing limit 1');
        })
        .then(() => {
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
