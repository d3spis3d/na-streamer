import {createArtist, createAlbum, createAlbumArtist, createSong,
        createStreamer, associateSongAndStreamer,
        createGenre, createGenreArtist} from '../queries/setup-track-data';

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
            const genres = trackData.genres.map(genre => createGenre(db, genre.name));
            return Promise.all(genres);
        })
        .then(() => {
            const artists = trackData.artists.map(artist => createArtist(db, artist.name, artist.genre));
            return Promise.all(artists);
        })
        .then(() => {
            const albums = trackData.albums.map(album => createAlbum(db, album.title, album.artist));
            return Promise.all(albums);
        })
        .then(() => {
            const songs = trackData.songs.map(song => createSong(db, song.title, song.number, song.id, song.album));
            return Promise.all(songs);
        })
        .then(() => {
            const songs = trackData.songs.map(song => associateSongAndStreamer(db, song.id, key));
            return Promise.all(songs);
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
            const stream = streamers[streamerKey];
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
            const stream = streamers[streamerKey];
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
