export function createStreamer(db, streamerKey) {
    return db.query('select * from Streamer where key=:key', {
        params: {
            key: streamerKey
        }
    })
    .then(streamerResults => {
        if (streamerResults.length) {
            return;
        }
        return db.query('insert into Streamer (key) values (:key)', {
            params: {
                key: streamerKey
            }
        });
    })
}

export function createGenre(db, genre) {
    return db.query('select * from Genre where name=:name', {
        params: {
            name: genre
        }
    })
    .then(genreResults => {
        if (genreResults.length) {
            return;
        }
        return db.query('insert into Genre (name) values (:name)', {
            params: {
                name: genre
            }
        });
    });
}

export function createArtist(db, artist) {
    return db.query('select * from Artist where name=:name', {
        params: {
            name: artist
        }
    })
    .then(artistResults => {
        if (artistResults.length) {
            return;
        }
        return db.query('insert into Artist (name) values (:name)', {
            params: {
                name: artist
            }
        });
    });
}

export function createGenreArtist(db, genre, artist) {
    return db.let('firstVertex', s => {
        s.select()
        .from('Genre')
        .where({'name': genre});
    })
    .let('secondVertex', s => {
        s.select()
        .from('Artist')
        .where({'name': artist});
    })
    .let('joiningEdge', s => {
        s.create('edge', 'Classified_As')
        .from('$secondVertex')
        .to('$firstVertex');
    })
    .commit()
    .return('$firstVertex')
    .all()
}

export function createAlbum(db, albumName) {
    return db.query('select * from Album where title=:title', {
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
    });
}

export function createAlbumArtist(db, artist, albumName) {
    return db.let('firstVertex', s => {
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
}

export function createSong(db, albumName, song) {
    return db.let('firstVertex', s => {
        s.select()
        .from('Album')
        .where({'title': albumName});
    })
    .let('secondVertex', s => {
        s.create('vertex', 'Song')
        .set({
            title: song.title,
            number: song.number,
            id: song.id
        });
    })
    .let('joiningEdge', s => {
        s.create('edge', 'Found_On')
        .from('$secondVertex')
        .to('$firstVertex');
    })
    .commit()
    .return('$secondVertex')
    .all();
}

export function associateSongAndStreamer(db, rid, key) {
    return db.let('firstVertex', s => {
        s.select()
        .from('Streamer')
        .where({'key': key});
    })
    .let('secondVertex', s => {
        s.select()
        .from('Song')
        .where({'@rid': rid});
    })
    .let('joiningEdge', s => {
        s.create('edge', 'Hosted_On')
        .from('$secondVertex')
        .to('$firstVertex');
    })
    .commit()
    .return('$joiningEdge')
    .all();
}
