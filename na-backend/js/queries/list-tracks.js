export function listArtists(db) {
    return db.query('select * from Artist')
    .then(results => {
        return results.map(result => ({rid: result['@rid'], name: result.name}));
    });
}
