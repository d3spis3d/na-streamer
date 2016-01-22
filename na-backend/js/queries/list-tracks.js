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
    return db.query('select expand( in("Recorded_By") ) from Artist where @rid = :rid', {
        params: {
            rid: artistId
        }
    })
    .then(results => {
        return results.map(result => ({rid: result['@rid'], title: result.title}));
    });
}
