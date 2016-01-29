export const getQueue = {
    url: '/queue',
    generateHandler: function(db) {
        return function(req, res) {
            db.query('select * from Queue')
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
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const addToQueue = {
    url: '/queue',
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
