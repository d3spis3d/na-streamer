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
            return db.query(`select *, out("Hosted_On").key as key from ${firstSong}`);
        })
        .then(results => {
            const streamerKey = results[0].key[0];
            const songId = results[0]['@rid'];

            const stream = streamers[streamerKey];
            stream.write(songId.toString());
        });
    };
}

export function setupNextSong(songQueue, db, streamers) {
    return function() {
        const nextSong = songQueue.shift();
        db.query(`select *, out("Hosted_On").key as key from ${nextSong}`)
        .then(results => {
            const streamerKey = results[0].key[0];
            const songId = results[0]['@rid'];

            const stream = streamers[streamerKey];
            stream.write(songId.toString());
        });
    }
}
