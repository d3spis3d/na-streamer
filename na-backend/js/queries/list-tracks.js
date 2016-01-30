export function listArtists(db) {
    return db.query('select * from Artist')
    .then(results => {
        return results.map(result => ({rid: result['@rid'], name: result.name}));
    });
}

export function listAlbums(db) {
    return db.query('select * from Album')
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title}));
    });
}

export function listAlbumsByArtist(db, artistId) {
    return db.query(`select expand( in("Recorded_By") ) from ${artistId}`)
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title}));
    });
}

export function listSongs(db) {
    return db.query('select * from Song')
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title, number: result.number}));
    });
}

export function listSongsByAlbum(db, albumId) {
    return db.query(`select expand( in("Found_On") ) from ${albumId}`)
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title, number: result.number}));
    });
}

export function listSongsByArtist(db, artistId) {
    return db.query(`select expand( in("Recorded_By").in("Found_On") ) from ${artistId}`)
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title, number: result.number}));
    });
}
