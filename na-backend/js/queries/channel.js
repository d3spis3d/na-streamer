export function listChannels(db) {
    return db.query('select * from Channel')
    .then(results => {
        return results.map(result => ({key: result.key, title: result.title}));
    });
}

export function createChannelQuery(db, title, key) {
    return db.query(`insert into Channel (title, key) values (${title}, ${key})`);
}

export function deleteChannelQuery(db, key) {
    return db.query('delete vertex from Channel where key = :key', {
        params: {
            key: key
        }
    });
}
