export function createArtist(db, artist) {
    return db.query('select * from Artist where name=:name', {
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
    });
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

export function createSong(db, albumName, title, number) {
    return db.let('firstVertex', s => {
        s.select()
        .from('Album')
        .where({'title': albumName});
    })
    .let('secondVertex', s => {
        s.create('vertex', 'Song')
        .set({
            title: title,
            number: number
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
