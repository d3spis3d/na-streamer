export function listQueueForChannel(db, channel='default') {
    return db.query('select * from Queue where channel = :channel', {
        params: {
            channel: channel
        }
    })
    .then(results => {
        return results.map(result => result.id);
    })
    .then(rids => {
        if (rids.length) {
            return db.query(`select *, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from [${rids}]`);
        }
        return [];
    })
    .then(results => {
        return results.map(result => {
            return {
                title: result.title,
                id: result.id,
                album: result.album[0],
                artist: result.artist[0],
                rid: result['@rid']
            };
        });
    });
}

export function addToChannelQueue(db, rid, channel='default') {
    return db.query(`insert into Queue (id, channel) values (${rid}, ${channel})`);
}

export function removeFromChannelQueue(db, rid, channel='default') {
    return db.query('delete vertex from Queue where id = :rid and channel = :channel', {
        params: {
            rid: rid,
            channel: channel
        }
    });
}
