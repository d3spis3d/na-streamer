export const getQueue = {
    url: '/queue',
    generateHandler: function(db) {
        return function(req, res) {
            db.query('select * from Queue')
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

        };
    }
}
