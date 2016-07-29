export const getQueue = {
    url: '/api/queue',
    generateHandler: function(db) {
        return function(req, res) {
            return db.query('select * from Queue')
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
            })
            .then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const addToQueue = {
    url: '/api/queue',
    generateHandler: function(db) {
        return function(req, res) {
            const rid = req.body.rid;
            return db.query(`insert into Queue (id) values (${rid})`)
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}

export const removeFromQueue = {
    url: '/api/queue',
    generateHandler: function(db) {
        return function(req, res) {
            const rid = req.body.rid;
            return db.query('delete vertex from Queue where id = :rid', {
                params: {
                    rid: rid
                }
            })
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}
