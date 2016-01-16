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
        for (let artist in data) {
            tracks[artist] = tracks[artist] || {};
            db.query('select * from Artist where name=:name', {
                params: {
                    name: artist
                }
            })
            .then((artistResults) => {
                if (artistResults.length) {
                    return;
                }
                return db.query('insert into Artist (name) values (:name)', {
                    params: {
                        name: artist
                    }
                });
            })
            .then(() => {
                for (let albumName in data[artist]) {
                    tracks[artist][albumName] = tracks[artist][albumName] || {};
                    db.query('select * from Album where title=:title', {
                        params: {
                            title: albumName
                        }
                    })
                    .then(albumResults => {
                        if (albumResults.length) {
                            return
                        }
                        return db.query('insert into Album (title) values (:title)', {
                            params: {
                                title: albumName
                            }
                        });
                    })
                    .then(() => {
                        db.let('firstVertex', s => {
                            s.select()
                            .from('Album')
                            .where({'title': albumName});
                        })
                        .let('secondVertex', s => {
                            s.select()
                            .from('Artist')
                            .where({'name': artist});
                        })
                        .let('joiningEdge', s => {
                            s.create('edge', 'Recorded_By')
                            .from('$firstVertex')
                            .to('$secondVertex');
                        })
                        .commit()
                        .return('$firstVertex')
                        .all()
                        .then((results) => {
                            createSongs(data, artist, albumName, filesByStreamer, tracks, db, streamerId);
                        });
                    })
                }
            });
        }
    };
}

function createSongs(data, artist, albumName, filesByStreamer, tracks, db, streamerId) {
    const album = data[artist][albumName];
    for (let track in album) {
        filesByStreamer[album[track].id] = streamerId;
        tracks[artist][albumName][track] = album[track];
        db.let('firstVertex', s => {
            s.select()
            .from('Album')
            .where({'title': albumName});
        })
        .let('secondVertex', s => {
            s.create('vertex', 'Song')
            .set({
                title: album[track].title,
                number: album[track].number
            });
        })
        .let('joiningEdge', s => {
            s.create('edge', 'Found_On')
            .from('$secondVertex')
            .to('$firstVertex');
        })
        .commit()
        .return('$secondVertex')
        .all()
        .then((response) => {
            console.log('Inserted:', response)
        });
    }
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
